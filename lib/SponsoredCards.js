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
    
    //TODO: comment, test
    _private.getPlaceholders = function(experience) {
        return (experience.data.deck || []).filter(function(card) {
            return card.type === 'wildcard';
        });
    };

    //TODO: no longer needed?
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
                    _private.trimCard(card.id, experience, 'makeAdCall - ' +
                        (error.message || error));
                    deferred.reject(error);
                }
            }
        });

        return deferred.promise.timeout(timeout || 3000).catch(function(error) {
            _private.trimCard(card.id, experience, 'makeAdCall - ' + error);
        });
    };
    
    //TODO: comment, test, RENAME
    _private.decorateCards = function(experience, placeholders, pixels, placement) {
        console.log('ASDF: calling decorateCards');
        console.log('ASDF: placeholders = ' + placeholders.map(function(card) { return card.id; }));
        
        // these are the extra cards dynamically fetched for this experience (and only this exp)
        var banners = Object.keys(c6.cardCache[placement]).filter(function(campaignId) {
            if (c6.cardCache[placement][campaignId].mappings[experience.id] === true) console.log('ASDF: banner ' + c6.cardCache[placement][campaignId].extId + ' already used'); //TODO
            return c6.cardCache[placement][campaignId].mappings[experience.id] === false;
        }).map(function(campaignId) {
            return c6.cardCache[placement][campaignId];
        });
        
        console.log('ASDF: have banners: ' + banners.map(function(obj) { return obj.extId; }));
        
        return q.all(banners.map(function(banner) {
            var deferred = q.defer();
            c6.require([urlRoot + '/api/public/content/card/' + banner.extId + '.js'], function(card) {
                console.log('ASDF: finished c6.require'); //TODO
                
                if (!card || !card.campaign) { //TODO: reconsider?
                    return deferred.reject('Card ' + banner.extId + ' not found');
                }
                
                card.adtechId = banner.campaignId;
                card.campaign.clickUrls = pixels.clickUrls.concat([banner.clickUrl]);
                card.campaign.countUrls = pixels.countUrls.concat([banner.countUrl]);
                banner.mappings[experience.id] = true;
                
                _private.swapCard(placeholders.shift(), card, experience);
                
                deferred.resolve();
            });

            return deferred.promise;
        }));

        //TODO: see if this can't be done more elegantly...        
        
        /*
        c6.require(banners.map(function(bann) {
            return urlRoot + '/api/public/content/card/' + bann.extId + '.js';
        }), function() {
            console.log('finished c6.require');
            var cards = Array.prototype.slice.call(arguments)
                .filter(function(card) {
                    return !!card.campaign;
                });
                
            placeholders.forEach(function(placeholder) {
                var newCard = cards.pop(),
                    banner;
                    
                if (!newCard) {
                    //TODO: should this send GA error events? should it use a different category?
                    return _private.trimCard(placeholder.id, experience, 'no more sponsored card banners');
                }

                banner = banners.filter(function(bann) { return bann.extId === newCard.id; })[0];
                newCard.adtechId = banner.campaignId;

                console.log('ASDF: swapping ' + placeholder.id + ' for ' + newCard.id); //TODO
                
                _private.swapCard(experience, placeholder, newCard);
                _private.decorateCard(newCard, experience, pixels, placement);
            });

            console.log('resolving');
            deferred.resolve();
        });
        */
    };
    
    //TODO: comment, test
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
    
    //TODO: no longer needed?
    _private.decorateCard = function(card, experience, pixels, placement) {
        var campaignId = String(card.campaign && card.campaign.campaignId || card.adtechId),
            cardInfo = c6.cardCache[placement][campaignId];

        console.log('ASDF: decorateCard for ' + card.id + ', ' + campaignId + ', ' + placement); //TODO
            
        if (!cardInfo) {
            return _private.trimCard(card.id, experience, 'ad call finished but no cardInfo');
        }

        card.campaign.clickUrls = pixels.clickUrls.concat([cardInfo.clickUrl]);
        card.campaign.countUrls = pixels.countUrls.concat([cardInfo.countUrl]);
        cardInfo.mappings[experience.id] = true;
    };

    _private.trimCard = function(id, experience, message) {
        console.log('ASDF: Trimming card ' + id + ', ' + message); //TODO
        experience.data.deck = experience.data.deck.filter(function(card) {
            return card.id !== id;
        });

        var embedTracker = experience.id.replace(/e-/,'');
        /* jshint camelcase:false */
        deps.window.__c6_ga__(embedTracker + '.send', 'event', {
            'eventCategory' : 'Error',
            'eventAction'   : 'SponsoredCardRemoved',
            'eventLabel'    : JSON.stringify({message: message})
        });
        /* jshint camelcase:true */
    };

    /* @public */

    //TODO: cleanup/modularize?
    this.fetchSponsoredCards = function(experience, config, pixels, preloaded) {
        console.log('ASDF: inside fetchSponsoredCards for ' + experience.id);
        var sponsoredCards = _private.getCardConfigs(experience),
            placeholders = _private.getPlaceholders(experience),
            placement = parseInt(experience.data.wildCardPlacement);

        pixels = withDefaults(pixels, { clickUrls: [], countUrls: [] });

        if (!placement) {
            return q.all(sponsoredCards.map(function(card) {
                return _private.trimCard(card.id, experience, 'No wildCardPlacement');
            }));
        }
        
        if (placeholders.length === 0 && sponsoredCards.length === 0) {
            return q();
        }
        
        c6.cardCache = c6.cardCache || {};

        c6.addSponsoredCard = function(placementId, campaignId, extId, clickUrl, countUrl, requestor) {
            // console.log('ASDF: calling addSponsoredCards with ' + campaignId + ', ' + extId + ', ' + sub1); //TODO
            if (!c6.cardCache[placementId][campaignId]) {
                c6.cardCache[placementId][campaignId] = {
                    campaignId  : campaignId,
                    extId       : extId,
                    clickUrl    : clickUrl,
                    countUrl    : countUrl,
                    mappings    : {} //TODO: rename
                };
            }
            
            if (c6.cardCache[placementId][campaignId].mappings[requestor] === undefined) {
                c6.cardCache[placementId][campaignId].mappings[requestor] = false;
            }
        };

        c6.cardCache[placement] = c6.cardCache[placement] || {};
        
        console.log('ASDF: about to load adtech for ' + experience.id); //TODO

        return _private.loadAdtech(preloaded ? 10000 : 5000).then(function(adtech) {
            console.log('ASDF: loaded adtech for ' + experience.id); //TODO
            var categories = (config && config.categories) instanceof Array ? config.categories
                                                                            : (config.categories || '').split(',');

            adtech.config.page = {
                network: experience.data.adServer.network,
                server:  experience.data.adServer.server,
                enableMultiAd: true
            };

            adtech.config.placements[placement] = {
                adContainerId: 'ad'
            };

            console.log('ASDF: about to makeAdCalls for sponsoredCards ' + experience.id); //TODO
            
            return q.all(sponsoredCards.map(function(card) {
                return _private.makeAdCall(card, experience, pixels, placement, adtech, preloaded ? 10000 : 3000);
            }))
            .then(function() {

                console.log('ASDF: finished makeAdCalls for sponsoredCards ' + experience.id); //TODO

                var deferred = q.defer();
                
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
                        complete: function onComplete() {
                            console.log('ASDF: calling onComplete for ' + experience.id); //TODO
                            try {
                                _private.decorateCards(experience, placeholders, pixels, placement)
                                .then(deferred.resolve);
                            } catch(error){
                                placeholders.forEach(function(card) {
                                    _private.trimCard(card.id, experience, 'makeAdCall - ' +//TODO: 'redo error msg?'
                                                      (error.message || error));
                                });
                                deferred.reject(error);
                            }
                        }
                    });
                });

                console.log('ASDF: about to execute queue for ' + experience.id); //TODO

                adtech.executeQueue({
                    multiAd: {
                        disableAdInjection: true,
                        readyCallback: function() {
                            console.log('ASDF: calling readyCallback for ' + experience.id); //TODO
                            adtech.showAd(placement);
                        }
                    }
                });
                
                return deferred.promise;
            });
        })
        .catch(function(error) {
            console.log('ASDF: caught error in SponsoredCards');
            console.log(error && error.stack || error); //TODO
            sponsoredCards.map(function(card) {
                return _private.trimCard(card.id, experience, 'loading adtech failed - ' + error);
            });
            return q();
        });
    };

    if (window.__karma__) { this._private = _private; }
};
