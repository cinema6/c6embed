module.exports = function(deps) {
    'use strict';

    var c6 = deps.window.c6,
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

    _private.getCardConfigs = function(experience) {
        return (experience.data.deck || []).filter(function(card) {
            return card.sponsored === true && card.campaign && !!card.campaign.campaignId;
        });
    };

    _private.makeAdCall = function(card, experience, pixels, placement, adtech, timeout) {
        var banner = card.campaign.bannerId || '1',
            deferred = q.defer();

        adtech.loadAd({
            placement: placement,
            params: { target: '_blank', adid: card.campaign.campaignId, bnid: banner },
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

    _private.decorateCard = function(card, experience, pixels, placement) {
        var cardInfo = c6.cardCache[placement][card.campaign.campaignId];
        if (!cardInfo) {
            return _private.trimCard(card.id, experience, 'ad call finished but no cardInfo');
        }

        card.campaign.clickUrls = pixels.clickUrls.concat([cardInfo.clickUrl]);
        card.campaign.countUrls = pixels.countUrls.concat([cardInfo.countUrl]);
    };

    _private.trimCard = function(id, experience, message) {
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

    this.fetchSponsoredCards = function(experience, pixels, preloaded) {
        var sponsoredCards = _private.getCardConfigs(experience),
            placement = parseInt(experience.data.wildCardPlacement);

        pixels = withDefaults(pixels, { clickUrls: [], countUrls: [] });

        if (!sponsoredCards.length || !placement) {
            return q.all(sponsoredCards.map(function(card) {
                return _private.trimCard(card.id, experience, 'No wildCardPlacement');
            }));
        }

        c6.cardCache = c6.cardCache || {};

        c6.addSponsoredCard = function(placementId, campaignId, campExtId, clickUrl, countUrl) {
            c6.cardCache[placementId][campaignId] = {
                campExtId   : campExtId,
                clickUrl    : clickUrl,
                countUrl    : countUrl
            };
        };

        c6.cardCache[placement] = {};

        return _private.loadAdtech(preloaded ? 10000 : 5000).then(function(adtech) {
            adtech.config.page = {
                network: experience.data.adServer.network,
                server:  experience.data.adServer.server
            };

            adtech.config.placements[placement] = {
                adContainerId: 'ad',
            };

            return q.all(sponsoredCards.map(function(card) {
                return _private.makeAdCall(card, experience, pixels, placement, adtech, preloaded ? 10000 : 3000);
            }));
        }).catch(function(error) {
            sponsoredCards.map(function(card) {
                return _private.trimCard(card.id, experience, 'loading adtech failed - ' + error);
            });
            return q();
        });
    };

    if (window.__karma__) { this._private = _private; }
};
