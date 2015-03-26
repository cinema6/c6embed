module.exports = function(deps) {
    'use strict';

    var c6 = deps.window.c6,
        urlRoot = deps.config.urlRoot,
        q = deps.q;

    var _private = {};

    function withDefaults(object, defaults) {
        return Object.keys(defaults).reduce(function(object, key) {
            object[key] = object[key] === undefined ? defaults[key] : object[key];
            return object;
        }, object || {});
    }
    
    // Send an error event to Google Analytics
    _private.sendError = function(experience, message) {
        var embedTracker = experience.id.replace(/e-/,'');
        /* jshint camelcase:false */
        deps.window.__c6_ga__(embedTracker + '.send', 'event', {
            'eventCategory' : 'Error',
            'eventAction'   : 'SponsoredCardRemoved',
            'eventLabel'    : JSON.stringify({message: message})
        });
        /* jshint camelcase:true */
    };

    // Load the Adtech library using c6.require
    _private.loadAdtech = function(timeout) {
        var deferred = q.defer();
        timeout = timeout || 5000;
        c6.require.config = c6.require.config || {};
        c6.require.config.paths = c6.require.config.paths || {};
        c6.require.config.shim = c6.require.config.shim || {};
        c6.require.config.paths.adtech = '//aka-cdn.adtechus.com/dt/common/DAC.js';
        c6.require.config.shim.adtech = {
            exports: 'ADTECH',
            onCreateFrame: function(window) {
                var document = window.document;

                window.c6 = window.parent.c6;

                /* jshint evil:true */
                document.write('<div id="ad"></div>');
                /* jshint evil:false */
            }
        };

        c6.require(['adtech'], deferred.resolve);

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
    
    // Get a list of all cards with the 'wildcard' type TODO: test
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
            _private.sendError(experience, 'makeAdCall - ' + error);
        });
    };

    
    //TODO: comment, test, RENAME
    _private.loadCardObjects = function(experience, placeholders, pixels, placement) {
        console.log('ASDF: placeholders = ' + placeholders.map(function(card) { return card.id; }));
        
        // these are the extra cards dynamically fetched for this experience (and only this exp)
        var banners = Object.keys(c6.cardCache[placement]).filter(function(campaignId) {
            return c6.cardCache[placement][campaignId].usableFor[experience.id] === true;
        }).map(function(campaignId) {
            return c6.cardCache[placement][campaignId];
        });
        
        console.log('ASDF: have banners: ' + banners.map(function(obj) { return obj.extId; }));
        
        return q.all(banners.map(function(banner) {
            var deferred = q.defer();

            c6.require([urlRoot + '/api/public/content/card/' + banner.extId + '.js'], function(card) {
                if (!card || !card.campaign) {
                    _private.sendError(experience, 'card ' + banner.extId + ' not found');
                    return deferred.resolve();
                }
                
                card.adtechId = banner.campaignId;
                card.campaign.clickUrls = pixels.clickUrls.concat([banner.clickUrl]);
                card.campaign.countUrls = pixels.countUrls.concat([banner.countUrl]);
                banner.usableFor[experience.id] = false;
                
                _private.swapCard(placeholders.shift(), card, experience);
                
                deferred.resolve();
            });

            return deferred.promise;
        }));
    };
    
    // Search through the experience's deck and swap the placeholder with the newCard TODO: test
    _private.swapCard = function(placeholder, newCard, experience) {
        console.log('ASDF: calling swapCard for ' + placeholder.id + ' and ' + newCard.id);
        if (!placeholder) {
            return;
        }
    
        experience.data.deck.forEach(function(card, idx) {
            if (card.id === placeholder.id) {
                experience.data.deck[idx] = newCard;
            }
        });
    };
    
    // Decorate the card with click + count urls, if its banners was saved in the cardCache
    _private.decorateCard = function(card, experience, pixels, placement) {
        var campaignId = String(card.campaign && card.campaign.campaignId || card.adtechId),
            cardInfo = c6.cardCache[placement][campaignId];

        console.log('ASDF: decorateCard for ' + card.id + ', ' + campaignId + ', ' + placement); //TODO
            
        if (!cardInfo) {
            _private.sendError(experience, 'ad call finished but no cardInfo');
            return _private.trimCard(card.id, experience);
        }

        card.campaign.clickUrls = pixels.clickUrls.concat([cardInfo.clickUrl]);
        card.campaign.countUrls = pixels.countUrls.concat([cardInfo.countUrl]);
        cardInfo.usableFor[experience.id] = false;
    };

    // Remove the card with the given id from the experience, sending an error event with the message
    _private.trimCard = function(id, experience) {
        console.log('ASDF: Trimming card ' + id); //TODO
        experience.data.deck = experience.data.deck.filter(function(card) {
            return card.id !== id;
        });
    };
    
    // TODO: comment, test
    _private.fetchDynamicCards = function(experience, placeholders, config, pixels, adtech, timeout) {
        var deferred = q.defer(),
            placement = parseInt(experience.data.wildCardPlacement),
            categories = (config && config.categories) instanceof Array ? config.categories
                                                                        : (config.categories || '').split(',');
        
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
                    kwlp3: categories.join('+'),
                    sub1: experience.id
                },
                complete: function onComplete() { // should only be called once
                    _private.loadCardObjects(experience, placeholders, pixels, placement)
                    .then(deferred.resolve)
                    .catch(deferred.reject);
                }
            });
        });

        adtech.executeQueue({
            multiAd: {
                disableAdInjection: true,
                readyCallback: function() {
                    adtech.showAd(placement);
                }
            }
        });
            
        return deferred.promise.timeout(timeout || 3000).catch(function(error) {
            _private.sendError('fetchDynamicCards - ' + error);
        });
    };


    /* @public */

    //TODO: cleanup/modularize?
    this.fetchSponsoredCards = function(experience, config, pixels, preloaded) {
        var placement = parseInt(experience.data.wildCardPlacement),
            timeout = preloaded ? 10000 : 3000,
            sponsoredCards = _private.getCardConfigs(experience),
            placeholders = _private.getPlaceholders(experience);

        if (!placement) {
            _private.sendError(experience, 'No wildCardPlacement');
            return q.all(sponsoredCards.concat(placeholders).map(function(card) {
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
                    usableFor   : {} //TODO: rename
                };
            }
            
            // keep track of which experiences requested a card, and if card has been used for an experience
            if (c6.cardCache[placementId][campaignId].usableFor[requestor] === undefined) {
                c6.cardCache[placementId][campaignId].usableFor[requestor] = true;
            }
        };

        c6.cardCache[placement] = c6.cardCache[placement] || {};

        return _private.loadAdtech(preloaded ? 10000 : 5000)
        .catch(function(error) {
            sponsoredCards.concat(placeholders).map(function(card) {
                return _private.trimCard(card.id, experience);
            });
            _private.sendError(experience, 'loading adtech failed - ' + error);
            return q();
        })
        .then(function(adtech) {
            adtech.config.page = {
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
                return _private.fetchDynamicCards(experience, placeholders, config, pixels, adtech, timeout);
            });
        });
    };

    if (window.__karma__) { this._private = _private; }
};
