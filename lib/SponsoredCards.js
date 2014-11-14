module.exports = function(deps) {
    'use strict';
    
    var c6 = deps.window.c6,
        q = deps.q;

    var _private = {};
    
    _private.loadAdtech = function() {
        var deferred = q.defer();

        c6.require.config = c6.require.config || {};
        c6.require.config.paths = c6.require.config.paths || {};
        c6.require.config.shim = c6.require.config.shim || {};
        c6.require.config.paths.adtech = 'http://aka-cdn.adtechus.com/dt/common/DAC.js';
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
        
        return deferred.promise.timeout(5000, 'Timed out after 5000ms loading adtech library');
    };
    
    _private.getCardConfigs = function(experience) {
        return (experience.data.deck || []).filter(function(card) {
            return card.sponsored === true && card.campaign && !!card.campaign.campaignId;
        });
    };

    _private.makeAdCall = function(card, experience, placement, adtech) {
        var banner = card.campaign.bannerId || '1',
            deferred = q.defer();

        adtech.loadAd({
            placement: placement,
            params: { target: '_blank', adid: card.campaign.campaignId, bnid: banner },
            complete: function() {
                _private.decorateCard(card, experience, placement);
                deferred.resolve();
            }
        });
        
        return deferred.promise.timeout(3000).catch(function(/*error*/) {
            _private.trimCard(card.id, experience);
        });
    };
    
    _private.decorateCard = function(card, experience, placement) {
        var cardInfo = c6.cardCache[placement][card.campaign.campaignId];
        if (!cardInfo) {
            return _private.trimCard(card.id, experience);
        }
        
        card.campaign.clickUrl = cardInfo.clickUrl;
        card.campaign.countUrl = cardInfo.countUrl;
    };
    
    _private.trimCard = function(id, experience) {
        experience.data.deck = experience.data.deck.filter(function(card) {
            return card.id !== id;
        });
    };
    
    /* @public */
    
    this.fetchSponsoredCards = function(experience) {
        var sponsoredCards = _private.getCardConfigs(experience),
            placement = parseInt(experience.data.wildCardPlacement);

        if (!sponsoredCards.length || !placement) {
            return q();
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
        
        return _private.loadAdtech().then(function(adtech) {
            adtech.config.page = {
                network: '5473.1',
                server: 'adserver.adtechus.com'
            };

            adtech.config.placements[placement] = {
                adContainerId: 'ad',
            };
            
            return q.all(sponsoredCards.map(function(card) {
                return _private.makeAdCall(card, experience, placement, adtech);
            }));
        });
    };

    if (window.__karma__) { this._private = _private; }
};