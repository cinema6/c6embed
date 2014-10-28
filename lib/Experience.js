module.exports = function(deps) {
    'use strict';

    var c6 = deps.window.c6,
        postmessage = deps.postmessage,
        q = deps.q,
        browserInfo = deps.browserInfo;

    var _private = {};

    function extend() {
        return Array.prototype.slice.call(arguments)
            .reduce(function(result, object) {
                Object.keys(object).forEach(function(key) {
                    result[key] = object[key];
                });

                return result;
            }, {});
    }
    
    _private.loadAdtech = function() { //TODO: test
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
    
    _private.getSponsoredCards = function(experience) { //TODO: test
        return (experience.data.deck || []).filter(function(card) {
            return card.sponsored === true && card.campaign && !!card.campaign.campaignId;
        });
    };
    
    _private.decorateSponsoredCards = function(placement, cards) { //TODO: test. rename?
        window.console.log('ASDF: decorating ' + cards.length + ' cards');
        window.console.log('ASDF: call count = ' + c6.callCount);
        cards.forEach(function(card) {
            var cardInfo = c6.cardCache[placement][card.campaign.campaignId];
            if (!cardInfo) {
                window.console.log('ASDF: could not retrieve info for card with campId ' + card.campaign.campaignId);
                return; //TODO: handle missing cardInfo
            }
            
            card.campaign.clickUrl = cardInfo.clickUrl;
            card.campaign.countUrl = cardInfo.countUrl;
        });
        window.console.log('ASDF: decorated cards - ');
        window.console.log(cards);
    };
    
    this.makeAdCalls = function(experience) { //TODO: test
        var sponsoredCards = _private.getSponsoredCards(experience),
            placement = parseInt(experience.data.placementId);

        c6.cardCache = c6.cardCache || {};
        
        c6.callCount = 0; //TODO: remove this

        c6.addSponsoredCard = function(placementId, campaignId, campExtId, clickUrl, countUrl) {
            c6.callCount++;
            c6.cardCache[placementId][campaignId] = {
                campExtId   : campExtId,
                clickUrl    : clickUrl,
                countUrl    : countUrl
            };
        };
        
        if (!sponsoredCards.length || !placement) {
            return q();
        }
        
        window.console.log('ASDF: have ' + sponsoredCards.length + ' sponsored cards'); //TODO: remove all log statements
        
        c6.cardCache[placement] = {};
        
        return _private.loadAdtech().then(function(adtech) { //TODO: wait for ad calls to finish?
            window.console.log('ASDF: loaded adtech');

            adtech.config.page = {
                network: '5473.1',
                server: 'adserver.adtechus.com',
                enableMultiAd: true
            };

            adtech.config.placements[placement] = {
                adContainerId: 'ad',
                complete: function() {
                    window.console.log('ASDF: calling complete');
                    return _private.decorateSponsoredCards(placement, sponsoredCards);
                }
            };
            
            sponsoredCards = [sponsoredCards[1], sponsoredCards[0]]; //TODO: WHY DOES IT ONLY DO THE FIRST ONE BLAAAAAGGGGHHHH
            sponsoredCards.forEach(function(card) {
                // if (card.campaign.campaignId !== '6077763') return;
                adtech.enqueueAd({
                    placement: placement,
                    params: { target: '_blank', adid: card.campaign.campaignId, bnid: '1' }
                });
            });

            adtech.executeQueue({
                multiAd: {
                    disableAdInjection: true,
                    readyCallback: function() {
                        window.console.log('ASDF: readyCallback');
                        adtech.showAd(placement);
                    }
                }
            });
        });
    };

    _private.decorateSession = function(session, experience) {
        session.experience = experience;
        session.ready = false;

        session._readyDeferred = q.defer();
        session.ensureReadiness = function() {
            return this._readyDeferred.promise;
        };

        session.destroy = function() {
            postmessage.destroySession(this.id);
        };
    };

    /* @public */

    this.registerExperience = function(experience, expWindow, _appData) {
        var session = postmessage.createSession(expWindow),
            appData = _appData || {};

        _private.decorateSession(session, experience);

        session.once('handshake', function(data, respond) {
            respond({
                success: true,
                appData: extend(appData, {
                    experience: experience,
                    profile: browserInfo.profile,
                    version: 1
                })
            });
        });

        session.once('ready', function() {
            session.ready = true;
            session._readyDeferred.resolve(session);
        });

        return session;
    };

    if (window.__karma__) { this._private = _private; }
};
