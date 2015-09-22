module.exports = function(deps) {
    'use strict';

    var formatURL = require('url').format;

    var $window = deps.window;
    var config = deps.config;
    var q = deps.q;
    var importScripts = deps.importScripts.withConfig({});
    var adLib = deps.adLib;

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
        card.campaign.playUrls = (card.campaign.playUrls || [])
            .concat(pixels.playUrls, [banner.clickUrl]);
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
    _private.makeAdCall = function(card, experience, pixels, placement, timeout) {
        var campaignId  = String(card.campaign && card.campaign.campaignId || card.adtechId),
            bannerId    = String(card.campaign && card.campaign.bannerId || card.bannerId || '1'),
            startFetch  = new Date().getTime();
            
        return adLib.loadAd(placement, campaignId, bannerId)
        .then(function(banner) {
            _private.sendTiming(experience.id, 'adtechLoadAd', (new Date().getTime() - startFetch));

            if (!banner) {
                _private.sendError(experience.id, 'loadAd returned no banner');
                return _private.trimCard(card.id, experience);
            }

            decorateCardWithPixels(card, pixels, banner);
            c6.usedSponsoredCards[experience.id].push(banner.extId);
        })
        .timeout(timeout || 3000)
        .catch(function(error) {
            _private.trimCard(card.id, experience);
            _private.sendError(experience.id, 'makeAdCall - ' + error);
        });
    };

    // Remove the card with the given id from the experience, sending an error event with the message
    _private.trimCard = function(id, experience) {
        experience.data.deck = experience.data.deck.filter(function(card) {
            return card.id !== id;
        });
    };


    // Find banners not yet used for this experience and load their objects from the content svc
    _private.loadCardObjects = function(experience, placeholders, pixels, banners, config) {
        return q.all(banners.map(function(banner) {
            if (!banner || c6.usedSponsoredCards[experience.id].indexOf(banner.extId) !== -1) {
                return q();
            }
            
            c6.usedSponsoredCards[experience.id].push(banner.extId);
        
            var deferred = q.defer();
            var url = urlRoot + '/api/public/content/card/' + banner.extId + '.js' + formatURL({
                query: {
                    container: config.container,
                    hostApp: config.hostApp,
                    network: config.network,
                    experience: config.exp,
                    pageUrl: config.pageUrl
                }
            });

            importScripts([url], function(card) {
                var campaign;

                if (!card || !card.campaign) {
                    _private.sendError(experience.id, 'card ' + banner.extId + ' not found');
                    return deferred.resolve();
                }
                
                campaign = card.campaign;
                
                card.adtechId = banner.campaignId;
                decorateCardWithPixels(card, pixels, banner);
                
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
    _private.fetchDynamicCards = function(experience, config, pixels, timeout) {
        var placement       = parseInt(experience.data.wildCardPlacement),
            placeholders    = _private.getPlaceholders(experience),
            categories      = (config && config.categories || []),
            startFetch      = new Date().getTime(),
            keywords        = {};

        categories = (typeof categories === 'string') ? categories.split(',') : categories;
        
        if (categories.length === 0) {
            categories = experience.categories || categories;
        }
        
        if (placeholders.length === 0) {
            return q();
        }
        
        keywords = {
            kwlp1: config && config.campaign || '',
            kwlp3: categories.slice(0, 4).join('+')
        };
        
        return adLib.multiAd(placeholders.length, placement, '2x2', keywords)
        .then(function(banners) {
            _private.sendTiming(experience.id,'adtechExecQueue', (new Date().getTime() - startFetch));
            
            return _private.loadCardObjects(experience, placeholders, pixels, banners || [], config);
        })
        .timeout(timeout || 6000)
        .catch(function(error) {
            _private.sendError(experience.id, 'fetchDynamicCards - ' + error);
        });
    };


    /* @public */

    /* Handle fetching banners for sponsored cards already in the exp, as well as dynamically
     * loading more cards to fill placeholders in the exp */
    this.fetchSponsoredCards = function(experience, config, pixels) {
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

        pixels = withDefaults(pixels, { playUrls: [], countUrls: [] });

        c6.usedSponsoredCards = c6.usedSponsoredCards || {};

        c6.usedSponsoredCards[experience.id] = [];

        adLib.configure({
            network: experience.data.adServer.network,
            server:  experience.data.adServer.server
        });

        // load statically mapped cards first
        return q.all(sponsoredCards.map(function(card) {
            return _private.makeAdCall(card, experience, pixels, placement, timeout);
        }))
        .then(function() {
            if (!config.hasSponsoredCards) {
                return _private.fetchDynamicCards(experience, config, pixels, timeout);
            } else {
                return q();
            }
        });
    };

    if (window.__karma__) { this._private = _private; }
};
