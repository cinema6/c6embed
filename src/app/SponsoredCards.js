module.exports = function(deps) {
    'use strict';

    var $window = deps.window;
    var config = deps.config;
    var q = deps.q;
    var importScripts = deps.importScripts.withConfig({
        paths: {
            adtech: '//aka-cdn.adtechus.com/dt/common/DAC.js'
        },
        shim: {
            adtech: {
                exports: 'ADTECH',
                onCreateFrame: function(window) {
                    var document = window.document;

                    window.c6 = window.parent.c6;

                    /* jshint evil:true */
                    document.write('<div id="ad"></div>');
                    /* jshint evil:false */
                }
            }
        }
    });

    var c6 = $window.c6;
    var urlRoot = config.urlRoot;

    var _private = {};

    function withDefaults(object, defaults) {
        return Object.keys(defaults).reduce(function(object, key) {
            object[key] = object[key] === undefined ? defaults[key] : object[key];
            return object;
        }, object || {});
    }

    function decorateCardWithPixels(card, pixels, banner) {
        card.campaign.clickUrls = (card.campaign.clickUrls || [])
            .concat(pixels.clickUrls, [banner.clickUrl]);
        card.campaign.countUrls = (card.campaign.countUrls || [])
            .concat(pixels.countUrls, [banner.countUrl]);
    }
    
    // Send an error event to Google Analytics
    _private.sendError = function(expId, message) {
        var embedTracker = expId.replace(/e-/,'');
        /* jshint camelcase:false */
        deps.window.__c6_ga__(embedTracker + '.send', 'event', {
            'eventCategory' : 'Error',
            'eventAction'   : 'SponsoredCardRemoved',
            'eventLabel'    : JSON.stringify({message: message})
        });
        /* jshint camelcase:true */
    };

    _private.sendTiming = function(expId,tvar,tval) {
        var embedTracker = expId.replace(/e-/,'');
        /* jshint camelcase:false */
        deps.window.__c6_ga__(embedTracker + '.send', 'timing', {
            'timingCategory' : 'API',
            'timingVar'      : tvar,
            'timingValue'    : tval
        });
    };

    // Load the Adtech library
    _private.loadAdtech = function(timeout) {
        var deferred = q.defer();
        timeout = timeout || 5000;

        importScripts(['adtech'], deferred.resolve);

        return deferred.promise.timeout(timeout, 'Timed out after ' + timeout + 'ms loading adtech library');
    };

    // Get all that are sponsored + have an adtech id, but don't already have clickUrl + countUrl
    _private.getCardConfigs = function(experience) {
        return (experience.data.deck || []).filter(function(card) {
            return card.sponsored === true && card.campaign && (
                ( !!card.campaign.campaignId || !!card.adtechId ) &&
                !( card.campaign.clickUrl && card.campaign.countUrl )
            );
        });
    };
    
    // Get a list of all cards with the 'wildcard' type
    _private.getPlaceholders = function(experience) {
        return (experience.data.deck || []).filter(function(card) {
            return card.type === 'wildcard';
        });
    };

    // Retrieve the banner for a sponsored card that already exists in the minireel
    _private.makeAdCall = function(card, experience, pixels, placement, adtech, timeout) {
        var campaignId = String(card.campaign && card.campaign.campaignId || card.adtechId),
            bannerId = String(card.campaign && card.campaign.bannerId || card.bannerId || '1'),
            deferred = q.defer();
            
        adtech.loadAd({
            placement: placement,
            params: {
                target: '_blank',
                adid: campaignId,
                bnid: bannerId,
                sub1: experience.id
            },
            complete: function() {
                try {
                    _private.decorateCard(card, experience, pixels, placement);
                    deferred.resolve();
                } catch(error){
                    deferred.reject((error.message || error));
                }
            }
        });

        return deferred.promise.timeout(timeout || 3000).catch(function(error) {
            _private.trimCard(card.id, experience);
            _private.sendError(experience.id, 'makeAdCall - ' + error);
        });
    };

    // Decorate the card with click + count urls, if its banners was saved in the cardCache
    _private.decorateCard = function(card, experience, pixels, placement) {
        var campaignId = String(card.campaign && card.campaign.campaignId || card.adtechId),
            cardInfo = c6.cardCache[placement][campaignId];

        if (!cardInfo) {
            _private.sendError(experience.id, 'ad call finished but no cardInfo');
            return _private.trimCard(card.id, experience);
        }

        decorateCardWithPixels(card, pixels, cardInfo);

        cardInfo.usableFor[experience.id] = false;
    };

    // Remove the card with the given id from the experience, sending an error event with the message
    _private.trimCard = function(id, experience) {
        experience.data.deck = experience.data.deck.filter(function(card) {
            return card.id !== id;
        });
    };


    // Find banners not yet used for this experience and load their objects from the content svc
    _private.loadCardObjects = function(experience, placeholders, pixels, placement) {
        
        // these are the extra cards dynamically fetched for this experience (and only this exp)
        var banners = Object.keys(c6.cardCache[placement]).filter(function(campaignId) {
            return c6.cardCache[placement][campaignId].usableFor[experience.id] === true;
        }).map(function(campaignId) {
            return c6.cardCache[placement][campaignId];
        });
        
        return q.all(banners.map(function(banner) {
            var deferred = q.defer();

            importScripts([urlRoot + '/api/public/content/card/' + banner.extId + '.js'], function(card) {
                var campaign;

                if (!card || !card.campaign) {
                    _private.sendError(experience.id, 'card ' + banner.extId + ' not found');
                    return deferred.resolve();
                }

                campaign = card.campaign;
                
                card.adtechId = banner.campaignId;
                decorateCardWithPixels(card, pixels, banner);
                banner.usableFor[experience.id] = false;
                
                _private.swapCard(placeholders.shift(), card, experience);
                
                deferred.resolve();
            });

            return deferred.promise;
        }));
    };
    
    // Search through the experience's deck and swap the placeholder with the newCard
    _private.swapCard = function(placeholder, newCard, experience) {
        if (!placeholder) {
            return;
        }
    
        experience.data.deck.forEach(function(card, idx) {
            if (card.id === placeholder.id) {
                experience.data.deck[idx] = newCard;
            }
        });
    };
    
    // Make ad calls for each wildcard placeholder in the experience, calling loadCardObjects when done
    _private.fetchDynamicCards = function(experience, config, pixels, adtech, timeout) {
        var deferred = q.defer(),
            placement = parseInt(experience.data.wildCardPlacement),
            placeholders = _private.getPlaceholders(experience),
            categories = (config && config.categories || []),
            startFetch = new Date().getTime(),
            completes = 0;
        categories = (typeof categories === 'string') ? categories.split(',') : categories;
        
        if (categories.length === 0) {
            categories = experience.categories || categories;
        }
        
        if (placeholders.length === 0) {
            return q();
        }

        placeholders.forEach(function() {
            adtech.enqueueAd({
                placement: placement,
                params: {
                    target: '_blank',
                    Allowedsizes: '2x2',
                    kwlp1: config && config.campaign,
                    kwlp3: categories.slice(0, 4).join('+'),
                    sub1: experience.id
                },
                complete: function onComplete() { // adtech should only call once
                    completes++;
                    if (completes === 1){
                        _private.sendTiming(experience.id,'adtechExecQueue',
                            (new Date().getTime() - startFetch));
                        _private.loadCardObjects(experience, placeholders, pixels, placement)
                        .then(deferred.resolve)
                        .catch(deferred.reject);
                    } else {
                        _private.sendError(experience.id, 'fetchDynamicCards (' +
                            completes + ') - warning, extra completes!');
                    }
                }
            });
        });

        var queueId = adtech.executeQueue({
            multiAd: {
                disableAdInjection: true
            }
        });

        adtech.showAd(placement,queueId);
            
        return deferred.promise.timeout(timeout || 6000).catch(function(error) {
            _private.sendError(experience.id, 'fetchDynamicCards (' +
                completes + ') - ' + error);
        });
    };


    /* @public */

    /* Handle fetching banners for sponsored cards already in the exp, as well as dynamically
     * loading more cards to fill placeholders in the exp */
    this.fetchSponsoredCards = function(experience, config, pixels, preloaded) {
        var placement = parseInt(experience.data.wildCardPlacement),
            timeout = 10000,
            sponsoredCards = _private.getCardConfigs(experience),
            placeholders = _private.getPlaceholders(experience);
            
        // Don't load anything from Adtech while in preview mode
        if (config && (config.preview === true || config.preview === 'true')) {
            return q();
        }

        if (!placement) {
            _private.sendError(experience.id, 'No wildCardPlacement');
            return q.all(sponsoredCards.map(function(card) {
                return _private.trimCard(card.id, experience);
            }));
        }
        
        if (!sponsoredCards.length && !placeholders.length) {
            return q();
        }

        pixels = withDefaults(pixels, { clickUrls: [], countUrls: [] });

        c6.cardCache = c6.cardCache || {};

        c6.addSponsoredCard = function(placementId, campaignId, extId, clickUrl, countUrl, requestor) {
            if (!c6.cardCache[placementId][campaignId]) {
                c6.cardCache[placementId][campaignId] = {
                    campaignId  : campaignId,
                    extId       : extId,
                    clickUrl    : clickUrl,
                    countUrl    : countUrl,
                    usableFor   : {}
                };
            }
            
            // keep track of which experiences requested a card, and if card has been used for an experience
            if (c6.cardCache[placementId][campaignId].usableFor[requestor] === undefined) {
                c6.cardCache[placementId][campaignId].usableFor[requestor] = true;
            }
        };

        c6.cardCache[placement] = c6.cardCache[placement] || {};

        return _private.loadAdtech(preloaded ? 10000 : 5000).then(function(adtech) {
            if (!adtech) {
                _private.sendError(experience.id, 'adtech load was blocked.');
                return q();
            }

            adtech.config.page = {
                protocol: ($window.location.protocol === 'https:' ) ? 'https' : 'http',
                network: experience.data.adServer.network,
                server:  experience.data.adServer.server,
                enableMultiAd: true
            };

            adtech.config.placements[placement] = {
                adContainerId: 'ad'
            };
        
            // load statically mapped cards first
            return q.all(sponsoredCards.map(function(card) {
                return _private.makeAdCall(card, experience, pixels, placement, adtech, timeout);
            }))
            .then(function() {
                if (!config.hasSponsoredCards) {
                    return _private.fetchDynamicCards(experience, config, pixels, adtech, timeout);
                } else {
                    return q();
                }
            });
        }, function(error) {
            sponsoredCards.map(function(card) {
                return _private.trimCard(card.id, experience);
            });
            _private.sendError(experience.id, 'loading adtech failed - ' + error);
            return q();
        });
    };

    if (window.__karma__) { this._private = _private; }
};
