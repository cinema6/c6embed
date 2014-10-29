module.exports = function(deps) {
    'use strict';
    
    //TODO: unit test everything!

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
            }
        };
        
        c6.require(['adtech'], deferred.resolve);
        
        return deferred.promise;
    };
    
    _private.getCardConfigs = function(experience) {
        return (experience.data.deck || []).filter(function(card) {
            return card.sponsored === true && card.campaign && !!card.campaign.campaignId;
        });
    };
    
    /*TODO: this function may be called multiple times after different amounts of cards loaded; 
     * so figure out how to properly detect when cards can't be loaded.*/
    _private.decorateSponsoredCards = function(placement, cards) {
        // window.console.log('ASDF: decorating ' + cards.length + ' cards');
        cards.forEach(function(card) {
            var cardInfo = c6.cardCache[placement][card.campaign.campaignId];
            if (!cardInfo) {
                // window.console.log('ASDF: could not retrieve info for card with campId ' + card.campaign.campaignId);
                return;
            }
            
            card.campaign.clickUrl = cardInfo.clickUrl;
            card.campaign.countUrl = cardInfo.countUrl;
        });
        // window.console.log('ASDF: decorated cards - ');
        // window.console.log(cards);
    };

    /* @public */
    
    this.fetchSponsoredCards = function(experience) {
        var sponsoredCards = _private.getCardConfigs(experience),
            placement = parseInt(experience.data.placementId);

        c6.cardCache = c6.cardCache || {};
        

        c6.addSponsoredCard = function(placementId, campaignId, campExtId, clickUrl, countUrl) {
            // window.console.log('ASDF: addSponsoredCard: ' + Array.prototype.slice.call(arguments).join(', '));
            c6.cardCache[placementId][campaignId] = {
                campExtId   : campExtId,
                clickUrl    : clickUrl,
                countUrl    : countUrl
            };
        };
        
        if (!sponsoredCards.length || !placement) {
            return q();
        }
        
        // window.console.log('ASDF: have ' + sponsoredCards.length + ' sponsored cards'); //TODO: remove all log statements
        
        c6.cardCache[placement] = {};
        
        return _private.loadAdtech().then(function(adtech) {
            // window.console.log('ASDF: loaded adtech');

            adtech.config.page = {
                network: '5473.1',
                server: 'adserver.adtechus.com',
                enableMultiAd: true
            };

            adtech.config.placements[placement] = {
                adContainerId: 'ad',
                complete: function() {
                    // window.console.log('ASDF: calling complete: ' + Array.prototype.slice.call(arguments).join(', '));
                    return _private.decorateSponsoredCards(placement, sponsoredCards);
                }
            };
            
            sponsoredCards.forEach(function(card, idx) {
                var banner = card.campaign.bannerId || '1';
                adtech.enqueueAd({
                    placement: placement,
                    // debugMode: true, //TODO
                    params: { target: '_blank', adid: card.campaign.campaignId, bnid: banner }
                });
            });
            
            adtech.executeQueue({
                multiAd: {
                    // disableAdInjection: true, //TODO
                    readyCallback: function() {
                        // window.console.log('ASDF: readyCallback: ' + Array.prototype.slice.call(arguments).join(', '));
                        adtech.showAd(placement);
                    }
                }
            });
        });
    };

    if (window.__karma__) { this._private = _private; }
};
