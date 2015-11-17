(function() {
    'use strict';

    var formatURL = require('url').format;

    describe('SponsoredCards', function() {
        var SponsoredCards,
            AdLib,
            q,
            window,
            spCards,
            adLib,
            _private;

        var importScriptsMain = require('../../lib/importScripts.js');
        var withConfig = importScriptsMain.withConfig;
        var importScripts;

        var experience, withWildcards;
        
        beforeEach(function() {
            SponsoredCards = require('../../src/app/SponsoredCards');
            q = require('../../node_modules/q/q.js');
            AdLib = require('../../src/app/AdLib');
            
            window = {
                c6: { require: jasmine.createSpy('c6.require()') },
                __c6_ga__: jasmine.createSpy('c6_ga()'),
                location: {
                    protocol: 'http:'
                }
            };
            
            experience = {
                id: 'e-1234',
                title: 'TestExp',
                data: {
                    adServer : {
                        network : '5473.1',
                        server : 'adserver.adtechus.com'
                    },
                    wildCardPlacement: '1234',
                    deck: [
                        { id: 'rc1', sponsored: true, campaign: { campaignId: 'camp1' } },
                        { id: 'rc2', sponsored: false, campaign: { campaignId: null } },
                        { id: 'rc3', sponsored: true, campaign: { campaignId: 'camp3' } }
                    ]
                }
            };

            withWildcards = {
                id: 'e-4567',
                title: 'WCExp',
                data: {
                    adServer : {
                        network : '5473.1',
                        server : 'adserver.adtechus.com'
                    },
                    wildCardPlacement: '7654',
                    deck: [
                        { id: 'rc1', sponsored: true, campaign: { campaignId: 'camp1' } },
                        { id: 'rc2', type: 'wildcard' },
                        { id: 'rc3', type: 'wildcard' },
                        { id: 'rc4', sponsored: false, type: 'tamecard', foo: 'bar' }
                    ]
                }
            };

            spyOn(importScriptsMain, 'withConfig').and.callFake(function() {
                var importFn = withConfig.apply(importScriptsMain, arguments);

                return (importScripts = jasmine.createSpy('importScripts()').and.callFake(function() {
                    return importFn.apply(null, arguments);
                }));
            });
            
            adLib = new AdLib({
                window: window,
                q: q,
                importScripts: importScriptsMain
            });

            spCards = new SponsoredCards({
                window: window,
                config: { urlRoot: 'http://test.com' },
                q: q,
                adLib: adLib,
                importScripts: importScriptsMain
            });
            _private = spCards._private;
            spyOn(_private, 'trimCard').and.callThrough();
            spyOn(_private, 'sendError').and.callThrough();
        });
        
        beforeEach(function() {
            jasmine.clock().install();
        });
        
        afterEach(function() {
            jasmine.clock().uninstall();
        });

        describe('@public methods', function() {
            describe('fetchSponsoredCards', function() {
                var config;
                beforeEach(function() {
                    config = { campaign: 'cam-1' };
                    spyOn(adLib, 'configure').and.callThrough();
                    spyOn(_private, 'getCardConfigs').and.callThrough();
                    spyOn(_private, 'getPlaceholders').and.callThrough();
                    spyOn(_private, 'makeAdCall').and.returnValue(q());
                    spyOn(_private, 'fetchDynamicCards').and.returnValue(q());
                });

                describe('if called with a pixel object', function() {
                    describe('if there are pixels defined', function() {
                        beforeEach(function(done) {
                            spCards.fetchSponsoredCards(experience, config, {
                                playUrls: ['click.me'],
                                countUrls: ['count.me']
                            }).finally(done);
                        });

                        it('should call appropriate methods with the additional pixels', function() {
                            expect(_private.makeAdCall.calls.count()).toBe(2);
                            expect(_private.makeAdCall).toHaveBeenCalledWith(
                                jasmine.any(Object),
                                experience,
                                { playUrls: ['click.me'], countUrls: ['count.me'] },
                                1234,
                                10000
                            );
                            expect(_private.fetchDynamicCards).toHaveBeenCalledWith(
                                experience,
                                config,
                                { playUrls: ['click.me'], countUrls: ['count.me'] },
                                10000
                            );
                        });
                    });

                    describe('if there are no pixels defined', function() {
                        beforeEach(function(done) {
                            spCards.fetchSponsoredCards(experience, config, {
                                playUrls: undefined,
                                countUrls: undefined
                            }).done(done);
                        });

                        it('should call _private.makeAdCall() with some defaults', function() {
                            expect(_private.makeAdCall.calls.count()).toBe(2);
                            expect(_private.makeAdCall).toHaveBeenCalledWith(
                                jasmine.any(Object),
                                experience,
                                { playUrls: [], countUrls: [] },
                                1234,
                                10000
                            );
                            expect(_private.fetchDynamicCards).toHaveBeenCalledWith(
                                experience,
                                config,
                                { playUrls: [], countUrls: [] },
                                10000
                            );
                        });
                    });
                });

                describe('if called without a pixel object', function() {
                    beforeEach(function(done) {
                        spCards.fetchSponsoredCards(experience, config).finally(done);
                    });

                    it('should call _private.makeAdCall() with some defaults', function() {
                        expect(_private.makeAdCall.calls.count()).toBe(2);
                        expect(_private.makeAdCall).toHaveBeenCalledWith(
                            jasmine.any(Object),
                            experience,
                            { playUrls: [], countUrls: [] },
                            1234,
                            10000
                        );
                    });
                });

                it('should load adtech and load static and dynamic sponsored cards', function(done) {
                    spCards.fetchSponsoredCards(experience, config).then(function() {
                        expect(adLib.configure).toHaveBeenCalledWith({ server: 'adserver.adtechus.com', network: '5473.1' });
                        expect(_private.getCardConfigs).toHaveBeenCalledWith(experience);
                        expect(_private.getPlaceholders).toHaveBeenCalledWith(experience);
                        expect(window.c6.usedSponsoredCards).toEqual({ 'e-1234': [] });

                        expect(_private.makeAdCall.calls.count()).toBe(2);
                        expect(_private.makeAdCall).toHaveBeenCalledWith(
                            {id:'rc1',sponsored:true,campaign:{campaignId:'camp1'}}, experience, jasmine.any(Object), 1234, 10000);
                        expect(_private.makeAdCall).toHaveBeenCalledWith(
                            {id:'rc3',sponsored:true,campaign:{campaignId:'camp3'}}, experience, jasmine.any(Object), 1234, 10000);
                        expect(_private.fetchDynamicCards).toHaveBeenCalledWith(experience, config, jasmine.any(Object), 10000);
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should not overwrite existing entries c6.usedSponsoredCards', function(done) {
                    window.c6.usedSponsoredCards = {
                        'e-4567': ['rc-1', 'rc-2']
                    };

                    spCards.fetchSponsoredCards(experience, config).then(function() {
                        expect(window.c6.usedSponsoredCards).toEqual({
                            'e-4567': ['rc-1', 'rc-2'],
                            'e-1234': []
                        });
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should configure adLib with different network + server', function(done) {
                    experience.data.adServer.network = '4444.4' ;
                    experience.data.adServer.server = 'somehost.com' ;
                    spCards.fetchSponsoredCards(experience, config).then(function() {
                        expect(adLib.configure).toHaveBeenCalledWith({
                            network: '4444.4',
                            server: 'somehost.com'
                        });
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should return early and trim sponsored cards if the placement is missing', function(done) {
                    delete experience.data.wildCardPlacement;
                    spCards.fetchSponsoredCards(experience, config).then(function() {
                        expect(_private.makeAdCall).not.toHaveBeenCalled();
                        expect(_private.fetchDynamicCards).not.toHaveBeenCalled();
                        expect(_private.trimCard.calls.count()).toBe(2);
                        expect(_private.trimCard).toHaveBeenCalledWith('rc1', experience);
                        expect(_private.trimCard).toHaveBeenCalledWith('rc3', experience);
                        expect(_private.sendError.calls.count()).toBe(1);
                        expect(_private.sendError).toHaveBeenCalledWith('e-1234', 'No wildCardPlacement');
                        expect(experience.data.deck.length).toBe(1);
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should return early and trim sponsored cards if the placement is invalid', function(done) {
                    experience.data.wildCardPlacement = 'p1234';
                    spCards.fetchSponsoredCards(experience, config).then(function() {
                        expect(_private.makeAdCall).not.toHaveBeenCalled();
                        expect(_private.fetchDynamicCards).not.toHaveBeenCalled();
                        expect(_private.trimCard.calls.count()).toBe(2);
                        expect(_private.trimCard).toHaveBeenCalledWith('rc1', experience);
                        expect(_private.trimCard).toHaveBeenCalledWith('rc3', experience);
                        expect(_private.sendError.calls.count()).toBe(1);
                        expect(_private.sendError).toHaveBeenCalledWith('e-1234', 'No wildCardPlacement');
                        expect(experience.data.deck.length).toBe(1);
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should only fetchDynamicCards if there are unused placeholders', function(done) {
                    _private.getCardConfigs.and.returnValue([]);
                    spCards.fetchSponsoredCards(withWildcards, config).then(function() {
                        expect(_private.makeAdCall).not.toHaveBeenCalled();
                        expect(_private.fetchDynamicCards).toHaveBeenCalled();
                        expect(_private.trimCard).not.toHaveBeenCalled();
                        expect(_private.sendError).not.toHaveBeenCalled();
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });

                it('should return early if there are no sponsored cards or placeholders', function(done) {
                    _private.getCardConfigs.and.returnValue([]);
                    spCards.fetchSponsoredCards(experience, config).then(function() {
                        expect(_private.makeAdCall).not.toHaveBeenCalled();
                        expect(_private.fetchDynamicCards).not.toHaveBeenCalled();
                        expect(_private.trimCard).not.toHaveBeenCalled();
                        expect(_private.sendError).not.toHaveBeenCalled();
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should return early if config.preview is true', function(done) {
                    config.preview = true;
                    spCards.fetchSponsoredCards(experience, config).then(function() {
                        expect(_private.makeAdCall).not.toHaveBeenCalled();
                        expect(_private.fetchDynamicCards).not.toHaveBeenCalled();
                        expect(_private.trimCard).not.toHaveBeenCalled();
                        expect(_private.sendError).not.toHaveBeenCalled();
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should not fetchDynamicCards if config.hasSponsoredCards is true', function(done) {
                    config.hasSponsoredCards = true;
                    spCards.fetchSponsoredCards(withWildcards, config).then(function() {
                        expect(_private.makeAdCall.calls.count()).toBe(1);
                        expect(_private.makeAdCall).toHaveBeenCalledWith({id: 'rc1', sponsored: true, campaign: {campaignId: 'camp1'}},
                            withWildcards, jasmine.any(Object), 7654, 10000);
                        expect(_private.fetchDynamicCards).not.toHaveBeenCalled();
                        expect(_private.trimCard).not.toHaveBeenCalled();
                        expect(_private.sendError).not.toHaveBeenCalled();
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
            });
        });

        describe('_private methods', function() {
            describe('sendError', function() {
                it('should send an error event to Google Analytics', function() {
                    _private.sendError(experience.id, 'PROBLEM');
                    expect(window.__c6_ga__).toHaveBeenCalledWith('1234.send', 'event',
                        {eventCategory: 'Error', eventAction: 'SponsoredCardRemoved',
                         eventLabel: '{"message":"PROBLEM"}'});
                });
            });
        
            describe('sendTiming', function() {
                it('should send a timing event to Google Analytics', function() {
                    _private.sendTiming(experience.id, 'testVar',100);
                    expect(window.__c6_ga__).toHaveBeenCalledWith('1234.send', 'timing',
                        {timingCategory: 'API', timingVar: 'testVar', timingValue: 100});
                });
            });
        
            describe('getCardConfigs', function() {
                it('should return a list of sponsored cards', function() {
                    expect(_private.getCardConfigs(experience)).toEqual([
                        { id: 'rc1', sponsored: true, campaign: { campaignId: 'camp1' } },
                        { id: 'rc3', sponsored: true, campaign: { campaignId: 'camp3' } }
                    ]);
                });
                
                it('should handle WildCard-style cards', function() {
                    experience.data.deck.push({ id: 'rc-sp1', sponsored: true, campaign: {}, adtechId: 123 });
                    expect(_private.getCardConfigs(experience)).toEqual([
                        { id: 'rc1', sponsored: true, campaign: { campaignId: 'camp1' } },
                        { id: 'rc3', sponsored: true, campaign: { campaignId: 'camp3' } },
                        { id: 'rc-sp1', sponsored: true, campaign: {}, adtechId: 123 }
                    ]);
                });
                
                it('should not choose cards that already have both click + count urls', function() {
                    experience.data.deck = [
                        { id: 'rc-sp1', sponsored: true, campaign: {}, adtechId: 123 },
                        { id: 'rc-sp2', sponsored: true, campaign: { clickUrl: 'click.me' }, adtechId: 456 },
                        { id: 'rc-sp3', sponsored: true, campaign: { countUrl: 'count.me' }, adtechId: 789 },
                        { id: 'rc-sp4', sponsored: true, campaign: { clickUrl: 'click.me', countUrl: 'count.me' }, adtechId: 987 }
                    ];
                    
                    expect(_private.getCardConfigs(experience)).toEqual([
                        { id: 'rc-sp1', sponsored: true, campaign: {}, adtechId: 123 },
                        { id: 'rc-sp2', sponsored: true, campaign: { clickUrl: 'click.me' }, adtechId: 456 },
                        { id: 'rc-sp3', sponsored: true, campaign: { countUrl: 'count.me' }, adtechId: 789 }
                    ]);
                });
                
                it('should handle nonexistent or empty decks', function() {
                    experience.data.deck = [];
                    expect(_private.getCardConfigs(experience)).toEqual([]);
                    delete experience.data.deck;
                    expect(_private.getCardConfigs(experience)).toEqual([]);
                });
                
                it('should handle weirdly formed cards', function() {
                    experience.data.deck = [
                        { id: 'rc1', sponsored: true, campaign: { foo: 'bar' } },
                        { id: 'rc2', sponsored: true },
                        { id: 'rc3', campaign: { campaignId: 'camp3' } },
                        { id: 'rc4', sponsored: false, adtechId: 123 }
                    ];
                    expect(_private.getCardConfigs(experience)).toEqual([]);
                });
            });

            describe('getPlaceholders', function() {
                it('should return a list of wildcard placeholders', function() {
                    expect(_private.getPlaceholders(withWildcards)).toEqual([
                        { id: 'rc2', type: 'wildcard' },
                        { id: 'rc3', type: 'wildcard' }
                    ]);
                });

                it('should handle nonexistent or empty decks', function() {
                    withWildcards.data.deck = [];
                    expect(_private.getPlaceholders(withWildcards)).toEqual([]);
                    delete withWildcards.data.deck;
                    expect(_private.getPlaceholders(withWildcards)).toEqual([]);
                });
            });
            
            describe('makeAdCall', function() {
                var pixels;

                beforeEach(function() {
                    pixels = { countUrls: [], playUrls: [] };
                    window.c6.usedSponsoredCards = { 'e-1234': [] };
                    spyOn(adLib, 'loadAd').and.returnValue(q({
                        placementId : 1234,
                        campaignId  : 'camp1',
                        extId       : 'rc1',
                        clickUrl    : 'click.me',
                        countUrl    : 'count.me'
                    }));
                });

                it('should call adLib.loadAd', function(done) {
                    _private.makeAdCall(experience.data.deck[0], experience, pixels, 1234).then(function() {
                        expect(experience.data.deck[0]).toEqual({
                            id: 'rc1',
                            sponsored: true,
                            campaign: { campaignId: 'camp1', playUrls: ['click.me'], countUrls: ['count.me'] }
                        });
                        expect(adLib.loadAd).toHaveBeenCalledWith(1234, 'camp1', '1');
                        expect(window.c6.usedSponsoredCards['e-1234']).toEqual(['rc1']);
                        expect(_private.trimCard).not.toHaveBeenCalled();
                        expect(_private.sendError).not.toHaveBeenCalled();
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });

                it('should use the card\'s configured bannerId, if it exists', function(done) {
                    experience.data.deck[0].bannerId = '2';
                    _private.makeAdCall(experience.data.deck[0], experience, pixels, 1234).then(function() {
                        expect(experience.data.deck[0]).toEqual({
                            id: 'rc1',
                            sponsored: true,
                            campaign: {
                                campaignId: 'camp1',
                                playUrls: ['click.me'],
                                countUrls: ['count.me']
                            },
                            bannerId: '2'
                        });
                        expect(adLib.loadAd).toHaveBeenCalledWith(1234, 'camp1', '2');
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should handle WildCard-style cards', function(done) {
                    adLib.loadAd.and.returnValue(q({
                        placementId : 1234,
                        campaignId  : 987,
                        extId       : 'rc1',
                        clickUrl    : 'click.me.now',
                        countUrl    : 'count.me.now'
                    }));
                    experience.data.deck[0] = {
                        id: 'rc1',
                        sponsored: true,
                        adtechId: 987,
                        bannerId: '3',
                        campaign: {}
                    };
                    _private.makeAdCall(experience.data.deck[0], experience, pixels, 1234).then(function() {
                        expect(experience.data.deck[0]).toEqual({
                            id: 'rc1',
                            sponsored: true,
                            adtechId: 987,
                            bannerId: '3',
                            campaign: {
                                playUrls: ['click.me.now'],
                                countUrls: ['count.me.now']
                            }
                        });
                        expect(adLib.loadAd).toHaveBeenCalledWith(1234, '987', '3');
                        expect(window.c6.usedSponsoredCards['e-1234']).toEqual(['rc1']);
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should timeout and trim the card if loadAd takes too long', function(done) {
                    adLib.loadAd.and.callFake(function() {
                        var deferred = q.defer();
                        setTimeout(function() {
                            deferred.resolve({
                                placementId : 1234,
                                campaignId  : 'camp1',
                                extId       : 'rc1',
                                clickUrl    : 'click.me',
                                countUrl    : 'count.me'
                            });
                        }, 4000);
                        return deferred.promise;
                    });
                    _private.makeAdCall(experience.data.deck[0], experience, pixels, 1234).then(function() {
                        expect(experience.data.deck).toEqual([
                            { id: 'rc2', sponsored: false, campaign: { campaignId: null } },
                            { id: 'rc3', sponsored: true, campaign: { campaignId: 'camp3' } }
                        ]);
                        expect(adLib.loadAd).toHaveBeenCalled();
                        expect(_private.trimCard).toHaveBeenCalledWith('rc1', experience);
                        expect(_private.sendError).toHaveBeenCalledWith('e-1234', 'makeAdCall - Error: Timed out after 3000 ms');
                        expect(window.__c6_ga__).toHaveBeenCalledWith('1234.send', 'event', 
                            {eventCategory: 'Error', eventAction: 'SponsoredCardRemoved',
                             eventLabel: '{"message":"makeAdCall - Error: Timed out after 3000 ms"}'});
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                    
                    jasmine.clock().tick(2001);
                    jasmine.clock().tick(2000);
                });

                it('should trim the card if loadAd returns an error',function(done){
                    adLib.loadAd.and.returnValue(q.reject('I GOT A PROBLEM'));
                    _private.makeAdCall(experience.data.deck[0], experience, pixels, 1234).then(function() {
                        expect(experience.data.deck).toEqual([
                            { id: 'rc2', sponsored: false, campaign: { campaignId: null } },
                            { id: 'rc3', sponsored: true, campaign: { campaignId: 'camp3' } }
                        ]);
                        expect(adLib.loadAd).toHaveBeenCalled();
                        expect(_private.trimCard).toHaveBeenCalledWith('rc1', experience);
                        expect(_private.sendError).toHaveBeenCalledWith('e-1234', 'makeAdCall - I GOT A PROBLEM');
                        expect(window.__c6_ga__).toHaveBeenCalledWith('1234.send', 'event', 
                            {eventCategory: 'Error', eventAction: 'SponsoredCardRemoved',
                             eventLabel: '{"message":"makeAdCall - I GOT A PROBLEM"}'});
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
            });
            
            describe('trimCard', function() {
                it('should delete a card from the deck', function() {
                    _private.trimCard('rc1', experience);
                    expect(experience.data.deck).toEqual([
                        { id: 'rc2', sponsored: false, campaign: { campaignId: null } },
                        { id: 'rc3', sponsored: true, campaign: { campaignId: 'camp3' } }
                    ]);
                });
                
                it('should not throw an error if the card is not in the deck', function() {
                    expect(function() { return _private.trimCard('rc4', experience); }).not.toThrow();
                    expect(experience.data.deck).toEqual([
                        { id: 'rc1', sponsored: true, campaign: { campaignId: 'camp1' } },
                        { id: 'rc2', sponsored: false, campaign: { campaignId: null } },
                        { id: 'rc3', sponsored: true, campaign: { campaignId: 'camp3' } }
                    ]);
                });
            });
            
            describe('loadCardObjects', function() {
                var placeholders, pixels, banners, config;
                beforeEach(function() {
                    config = {
                        campaign: 'cam-1',
                        categories: 'foo,bar',
                        container: 'pocketmath',
                        hostApp: 'Talking Tom',
                        network: 'omax',
                        exp: 'e-bea7342862e825',
                        pageUrl: 'cinema6.com'
                    };
                    placeholders = _private.getPlaceholders(withWildcards);
                    pixels = { playUrls: [ 'click.me' ], countUrls: [ 'count.me' ] };
                    
                    window.c6.usedSponsoredCards = {
                        'e-1234': ['rc-sp3'],
                        'e-4567': ['rc-sp1']
                    };
                    
                    banners = [
                        { extId: 'rc-sp1', campaignId: 123, clickUrl: 'click.1', countUrl: 'count.1' },
                        { extId: 'rc-sp2', campaignId: 234, clickUrl: 'click.2', countUrl: 'count.2' },
                        { extId: 'rc-sp3', campaignId: 345, clickUrl: 'click.3', countUrl: 'count.3' }
                    ];
                    spyOn(_private, 'swapCard').and.callThrough();

                    importScripts.and.callFake(function(urls, cb) {
                        var id = urls[0].match(/[^\/]+(?=\.js)/)[0];
                        cb({id: id, campaign: {} });
                    });
                });

                describe('if the card already has some pixels', function() {
                    beforeEach(function(done) {
                        importScripts.and.callFake(function(urls, cb) {
                            var id = urls[0].match(/[^\/]+(?=\.js)/)[0];
                            cb({id: id, campaign: { playUrls: ['click.custom'], countUrls: ['count.custom'] } });
                        });

                        _private.loadCardObjects(withWildcards, placeholders, pixels, banners, config).finally(done);
                    });

                    it('should combine the existing pixels with the campaign ones', function() {
                        expect(withWildcards.data.deck).toEqual([
                            jasmine.any(Object),
                            jasmine.objectContaining({
                                campaign: {
                                    playUrls: ['click.custom', 'click.me', 'click.2'], countUrls: ['count.custom', 'count.me', 'count.2']
                                }
                            }),
                            jasmine.objectContaining({
                                campaign: {
                                    playUrls: ['click.custom', 'click.me', 'click.3'], countUrls: ['count.custom', 'count.me', 'count.3']
                                }
                            }),
                            jasmine.any(Object)
                        ]);
                    });
                });

                it('should filter banners in the cache and load card objects from c6.require', function(done) {
                    _private.loadCardObjects(withWildcards, placeholders, pixels, banners, config).then(function() {
                        expect(withWildcards.data.deck).toEqual([
                            { id: 'rc1', sponsored: true, campaign: { campaignId: 'camp1' } },
                            { id: 'rc-sp2', adtechId: 234, campaign: {
                                playUrls: ['click.me', 'click.2'], countUrls: ['count.me', 'count.2']
                            } },
                            { id: 'rc-sp3', adtechId: 345, campaign: {
                                playUrls: ['click.me', 'click.3'], countUrls: ['count.me', 'count.3']
                            } },
                            { id: 'rc4', sponsored: false, type: 'tamecard', foo: 'bar' }
                        ]);
                        expect(importScripts.calls.count()).toBe(2);
                        expect(importScripts).toHaveBeenCalledWith(['http://test.com/api/public/content/card/rc-sp2.js' + formatURL({
                            query: {
                                container: config.container,
                                hostApp: config.hostApp,
                                network: config.network,
                                experience: config.exp,
                                pageUrl: config.pageUrl
                            }
                        })], jasmine.any(Function));
                        expect(importScripts).toHaveBeenCalledWith(['http://test.com/api/public/content/card/rc-sp3.js' + formatURL({
                            query: {
                                container: config.container,
                                hostApp: config.hostApp,
                                network: config.network,
                                experience: config.exp,
                                pageUrl: config.pageUrl
                            }
                        })], jasmine.any(Function));
                        expect(_private.swapCard.calls.count()).toBe(2);
                        expect(_private.swapCard).toHaveBeenCalledWith({id: 'rc2', type: 'wildcard'}, withWildcards.data.deck[1], withWildcards);
                        expect(_private.swapCard).toHaveBeenCalledWith({id: 'rc3', type: 'wildcard'}, withWildcards.data.deck[2], withWildcards);
                        expect(_private.sendError).not.toHaveBeenCalled();
                        expect(window.c6.usedSponsoredCards['e-4567']).toEqual(['rc-sp1', 'rc-sp2', 'rc-sp3']);
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should not allow a sponsored card to be repeated', function(done) {
                    banners = [
                        { extId: 'rc-sp2', campaignId: 234, clickUrl: 'click.2', countUrl: 'count.2' },
                        { extId: 'rc-sp2', campaignId: 234, clickUrl: 'click.2', countUrl: 'count.2' }
                    ];
                    _private.loadCardObjects(withWildcards, placeholders, pixels, banners, config).then(function() {
                        expect(withWildcards.data.deck).toEqual([
                            { id: 'rc1', sponsored: true, campaign: { campaignId: 'camp1' } },
                            { id: 'rc-sp2', adtechId: 234, campaign: {
                                playUrls: ['click.me', 'click.2'], countUrls: ['count.me', 'count.2']
                            } },
                            { id: 'rc3', type: 'wildcard' },
                            { id: 'rc4', sponsored: false, type: 'tamecard', foo: 'bar' }
                        ]);
                        expect(importScripts.calls.count()).toBe(1);
                        expect(importScripts).toHaveBeenCalledWith(['http://test.com/api/public/content/card/rc-sp2.js' + formatURL({
                            query: {
                                container: config.container,
                                hostApp: config.hostApp,
                                network: config.network,
                                experience: config.exp,
                                pageUrl: config.pageUrl
                            }
                        })], jasmine.any(Function));
                        expect(_private.swapCard.calls.count()).toBe(1);
                        expect(_private.swapCard).toHaveBeenCalledWith({id: 'rc2', type: 'wildcard'}, withWildcards.data.deck[1], withWildcards);
                        expect(_private.sendError).not.toHaveBeenCalled();
                        expect(window.c6.usedSponsoredCards['e-4567']).toEqual(['rc-sp1', 'rc-sp2']);
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should send errors if the cards cannot be found', function(done) {
                    importScripts.and.callFake(function(urls, cb) { cb(); });

                    _private.loadCardObjects(withWildcards, placeholders, pixels, banners, config).then(function() {
                        expect(withWildcards.data.deck).toEqual([
                            { id: 'rc1', sponsored: true, campaign: { campaignId: 'camp1' } },
                            { id: 'rc2', type: 'wildcard' },
                            { id: 'rc3', type: 'wildcard' },
                            { id: 'rc4', sponsored: false, type: 'tamecard', foo: 'bar' }
                        ]);
                        expect(importScripts.calls.count()).toBe(2);
                        expect(_private.swapCard).not.toHaveBeenCalled();
                        expect(_private.sendError.calls.count()).toBe(2);
                        expect(_private.sendError).toHaveBeenCalledWith('e-4567', 'card rc-sp2 not found');
                        expect(_private.sendError).toHaveBeenCalledWith('e-4567', 'card rc-sp3 not found');
                        expect(window.c6.usedSponsoredCards['e-4567']).toEqual(['rc-sp1', 'rc-sp2', 'rc-sp3']);
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should do nothing if there are no usable banners', function(done) {
                    window.c6.usedSponsoredCards['e-4567'] = ['rc-sp1', 'rc-sp2', 'rc-sp3'];
                    _private.loadCardObjects(withWildcards, placeholders, pixels, banners, config).then(function() {
                        expect(withWildcards.data.deck).toEqual([
                            { id: 'rc1', sponsored: true, campaign: { campaignId: 'camp1' } },
                            { id: 'rc2', type: 'wildcard' },
                            { id: 'rc3', type: 'wildcard' },
                            { id: 'rc4', sponsored: false, type: 'tamecard', foo: 'bar' }
                        ]);
                        expect(importScripts).not.toHaveBeenCalled();
                        expect(_private.swapCard).not.toHaveBeenCalled();
                        expect(_private.sendError).not.toHaveBeenCalled();
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
            });
            
            describe('swapCard', function() {
                var newCard;

                beforeEach(function() {
                    newCard = { id: 'rc-sp1', sponsored: true, adtechId: 1337 };
                });

                it('should swap a card for a placeholder in the experience\'s deck', function() {
                    _private.swapCard(withWildcards.data.deck[2], newCard, withWildcards);
                    expect(withWildcards.data.deck).toEqual([
                        { id: 'rc1', sponsored: true, campaign: { campaignId: 'camp1' } },
                        { id: 'rc2', type: 'wildcard' },
                        { id: 'rc-sp1', sponsored: true, adtechId: 1337 },
                        { id: 'rc4', sponsored: false, type: 'tamecard', foo: 'bar' }
                    ]);
                });
                
                it('should do nothing if there is no match', function() {
                    _private.swapCard({id: 'rc5'}, newCard, withWildcards);
                    expect(withWildcards.data.deck).toEqual([
                        { id: 'rc1', sponsored: true, campaign: { campaignId: 'camp1' } },
                        { id: 'rc2', type: 'wildcard' },
                        { id: 'rc3', type: 'wildcard' },
                        { id: 'rc4', sponsored: false, type: 'tamecard', foo: 'bar' }
                    ]);
                });
                
                it('should do nothing if the placeholder is undefined', function() {
                    _private.swapCard(undefined, newCard, withWildcards);
                    expect(withWildcards.data.deck).toEqual([
                        { id: 'rc1', sponsored: true, campaign: { campaignId: 'camp1' } },
                        { id: 'rc2', type: 'wildcard' },
                        { id: 'rc3', type: 'wildcard' },
                        { id: 'rc4', sponsored: false, type: 'tamecard', foo: 'bar' }
                    ]);
                });
            });
            
            describe('fetchDynamicCards', function() {
                var config, pixels;
                beforeEach(function() {
                    config = { campaign: 'cam-1', categories: 'foo,bar' };
                    pixels = { pixels: 'yes' };
                    
                    spyOn(_private, 'loadCardObjects').and.returnValue(q());
                    
                    spyOn(adLib, 'multiAd').and.returnValue(q(['bann1', 'bann2']));
                });
                    
                it('should skip if there are no placeholders', function(done) {
                    _private.fetchDynamicCards(experience, config, pixels, 3000).then(function() {
                        expect(adLib.multiAd).not.toHaveBeenCalled();
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should call multiAd to get multiple banners', function(done) {
                    _private.fetchDynamicCards(withWildcards, config, pixels, 3000).then(function() {
                        expect(adLib.multiAd).toHaveBeenCalledWith(2, 7654, '2x2', { kwlp1: 'cam-1', kwlp3: 'foo+bar' });
                        expect(_private.loadCardObjects).toHaveBeenCalledWith(withWildcards, [
                            {id: 'rc2', type: 'wildcard'},
                            {id: 'rc3', type: 'wildcard'}
                        ], pixels, ['bann1', 'bann2'], config);
                        expect(_private.sendError).not.toHaveBeenCalled();
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should handle categories formatted as an array', function(done) {
                    config.categories = ['foo', 'bar', 'baz'];
                    _private.fetchDynamicCards(withWildcards, config, pixels, 3000).then(function() {
                        expect(adLib.multiAd).toHaveBeenCalledWith(2, 7654, '2x2', { kwlp1: 'cam-1', kwlp3: 'foo+bar+baz' });
                        expect(_private.sendError).not.toHaveBeenCalled();
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should default to categories on the experience', function(done) {
                    config.categories = '';
                    withWildcards.categories = ['blah', 'bloop'];
                    _private.fetchDynamicCards(withWildcards, config, pixels, 3000).then(function() {
                        expect(adLib.multiAd).toHaveBeenCalledWith(2, 7654, '2x2', { kwlp1: 'cam-1', kwlp3: 'blah+bloop' });
                        expect(_private.sendError).not.toHaveBeenCalled();
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should handle the campaign and categories params being undefined', function(done) {
                    _private.fetchDynamicCards(withWildcards, {}, pixels, 3000).then(function() {
                        expect(adLib.multiAd).toHaveBeenCalledWith(2, 7654, '2x2', { kwlp1: '', kwlp3: '' });
                        expect(_private.sendError).not.toHaveBeenCalled();
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should timeout if multiAd takes too long', function(done) {
                    adLib.multiAd.and.callFake(function() {
                        var deferred = q.defer();
                        setTimeout(function() {
                            deferred.resolve(['bann1', 'bann2']);
                        }, 4000);
                        return deferred.promise;
                    });
                    
                    _private.fetchDynamicCards(withWildcards, {}, pixels, 3000).then(function() {
                        expect(adLib.multiAd).toHaveBeenCalled();
                        expect(_private.loadCardObjects).not.toHaveBeenCalled();
                        expect(_private.sendError).toHaveBeenCalledWith('e-4567', 'fetchDynamicCards - Error: Timed out after 3000 ms');
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                    
                    jasmine.clock().tick(3001);
                });
                
                it('should send an error if multiAd rejects', function(done) {
                    adLib.multiAd.and.returnValue(q.reject('I GOT A PROBLEM'));

                    _private.fetchDynamicCards(withWildcards, {}, pixels, 3000).then(function() {
                        expect(adLib.multiAd).toHaveBeenCalled();
                        expect(_private.loadCardObjects).not.toHaveBeenCalled();
                        expect(_private.sendError).toHaveBeenCalledWith('e-4567', 'fetchDynamicCards - I GOT A PROBLEM');
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should send an error if loadCardObjects rejects', function(done) {
                    _private.loadCardObjects.and.returnValue(q.reject('I GOT A PROBLEM'));

                    _private.fetchDynamicCards(withWildcards, {}, pixels, 3000).then(function() {
                        expect(adLib.multiAd).toHaveBeenCalled();
                        expect(_private.loadCardObjects).toHaveBeenCalled();
                        expect(_private.sendError).toHaveBeenCalledWith('e-4567', 'fetchDynamicCards - I GOT A PROBLEM');
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
            });
        });

        describe('@private methods', function() {
            describe('_private()', function() {
                it('should allow you to access the private methods and properties', function() {
                    expect(_private).toBeDefined();
                });
            });
        });
    });
}());
