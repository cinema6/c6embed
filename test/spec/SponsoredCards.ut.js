(function() {
    'use strict';

    describe('SponsoredCards', function() {
        var SponsoredCards,
            q,
            spCards,
            window,
            adtech,
            _private;

        var experience, withWildcards;
        
        beforeEach(function() {
            SponsoredCards = require('../../lib/SponsoredCards');
            q = require('../../node_modules/q/q.js');
            
            window = {
                c6: { require: jasmine.createSpy('c6.require()') },
                __c6_ga__: jasmine.createSpy('c6_ga()')
            }
            
            adtech = {
                config: { placements: {} },
                loadAd: jasmine.createSpy('adtech.loadAd()'),
                enqueueAd: jasmine.createSpy('adtech.enqueueAd()'),
                executeQueue: jasmine.createSpy('adtech.executeQueue()'),
                showAd: jasmine.createSpy('adtech.showAd()')
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

            spCards = new SponsoredCards({ q: q, config: { urlRoot: 'http://test.com' }, window: window });
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
                    spyOn(_private, 'getCardConfigs').and.callThrough();
                    spyOn(_private, 'getPlaceholders').and.callThrough();
                    spyOn(_private, 'loadAdtech').and.returnValue(q(adtech));
                    spyOn(_private, 'makeAdCall').and.returnValue(q());
                    spyOn(_private, 'fetchDynamicCards').and.returnValue(q());
                });

                describe('if called with a pixel object', function() {
                    describe('if there are pixels defined', function() {
                        beforeEach(function(done) {
                            spCards.fetchSponsoredCards(experience, config, {
                                clickUrls: ['click.me'],
                                countUrls: ['count.me']
                            }).finally(done);
                        });

                        it('should call appropriate methods with the additional pixels', function() {
                            expect(_private.makeAdCall.calls.count()).toBe(2);
                            expect(_private.makeAdCall).toHaveBeenCalledWith(
                                jasmine.any(Object),
                                experience,
                                { clickUrls: ['click.me'], countUrls: ['count.me'] },
                                1234,
                                adtech,
                                3000
                            );
                            expect(_private.fetchDynamicCards).toHaveBeenCalledWith(
                                experience,
                                config,
                                { clickUrls: ['click.me'], countUrls: ['count.me'] },
                                adtech,
                                3000
                            );
                        });
                    });

                    describe('if there are no pixels defined', function() {
                        beforeEach(function(done) {
                            spCards.fetchSponsoredCards(experience, config, {
                                clickUrls: undefined,
                                countUrls: undefined
                            }).done(done);
                        });

                        it('should call _private.makeAdCall() with some defaults', function() {
                            expect(_private.makeAdCall.calls.count()).toBe(2);
                            expect(_private.makeAdCall).toHaveBeenCalledWith(
                                jasmine.any(Object),
                                experience,
                                { clickUrls: [], countUrls: [] },
                                1234,
                                adtech,
                                3000
                            );
                            expect(_private.fetchDynamicCards).toHaveBeenCalledWith(
                                experience,
                                config,
                                { clickUrls: [], countUrls: [] },
                                adtech,
                                3000
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
                            { clickUrls: [], countUrls: [] },
                            1234,
                            adtech,
                            3000
                        );
                    });
                });

                it('should load adtech and load static and dynamic sponsored cards', function(done) {
                    spCards.fetchSponsoredCards(experience, config).then(function() {
                        expect(_private.getCardConfigs).toHaveBeenCalledWith(experience);
                        expect(_private.getPlaceholders).toHaveBeenCalledWith(experience);
                        expect(window.c6.cardCache).toEqual({ 1234: {} });
                        expect(window.c6.addSponsoredCard).toEqual(jasmine.any(Function));

                        expect(_private.loadAdtech).toHaveBeenCalled();
                        expect(adtech.config.page).toEqual({
                            network: '5473.1',
                            server: 'adserver.adtechus.com',
                            enableMultiAd: true
                        });
                        expect(adtech.config.placements[1234]).toEqual({ adContainerId: 'ad' });
                        
                        expect(_private.makeAdCall.calls.count()).toBe(2);
                        expect(_private.makeAdCall).toHaveBeenCalledWith(
                            {id:'rc1',sponsored:true,campaign:{campaignId:'camp1'}}, experience, jasmine.any(Object), 1234, adtech,3000);
                        expect(_private.makeAdCall).toHaveBeenCalledWith(
                            {id:'rc3',sponsored:true,campaign:{campaignId:'camp3'}}, experience, jasmine.any(Object), 1234, adtech,3000);
                        expect(_private.fetchDynamicCards).toHaveBeenCalledWith(experience, config, jasmine.any(Object), adtech, 3000);
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should not overwrite existing entries in the cardCache', function(done) {
                    window.c6.cardCache = {
                        1234: {
                            987: { foo: 'bar' },
                            876: { foo: 'baz' }
                        },
                        4321: {
                            567: { foo: 'buz' }
                        }
                    };

                    spCards.fetchSponsoredCards(experience, config).then(function() {
                        expect(_private.getCardConfigs).toHaveBeenCalledWith(experience);
                        expect(window.c6.cardCache).toEqual({
                            1234: {
                                987: { foo: 'bar' },
                                876: { foo: 'baz' }
                            },
                            4321: {
                                567: { foo: 'buz' }
                            }
                        });
                        expect(window.c6.addSponsoredCard).toEqual(jasmine.any(Function));
                        expect(_private.loadAdtech).toHaveBeenCalled();
                        expect(_private.makeAdCall.calls.count()).toBe(2);
                        expect(_private.fetchDynamicCards).toHaveBeenCalled();
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should load adtech and make ad calls with passed network', function(done) {
                    experience.data.adServer.network = '4444.4' ;
                    spCards.fetchSponsoredCards(experience, config).then(function() {
                        expect(_private.loadAdtech).toHaveBeenCalled();
                        expect(adtech.config.page).toEqual({
                            network: '4444.4',
                            server: 'adserver.adtechus.com',
                            enableMultiAd: true
                        });
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should load adtech and make ad calls with passed server', function(done) {
                    experience.data.adServer.server = 'somehost.com' ;
                    spCards.fetchSponsoredCards(experience, config).then(function() {
                        expect(_private.loadAdtech).toHaveBeenCalled();
                        expect(adtech.config.page).toEqual({
                            network: '5473.1',
                            server: 'somehost.com',
                            enableMultiAd: true
                        });
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should return early and trim sponsored cards if the placement is missing', function(done) {
                    delete experience.data.wildCardPlacement;
                    spCards.fetchSponsoredCards(experience, config).then(function() {
                        expect(_private.loadAdtech).not.toHaveBeenCalled();
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
                        expect(_private.loadAdtech).not.toHaveBeenCalled();
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
                
                it('should only fetchDynamicCards if there are no sponsored cards', function(done) {
                    _private.getCardConfigs.and.returnValue([]);
                    spCards.fetchSponsoredCards(withWildcards, config).then(function() {
                        expect(_private.loadAdtech).toHaveBeenCalled();
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
                        expect(_private.loadAdtech).not.toHaveBeenCalled();
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
                        expect(_private.loadAdtech).not.toHaveBeenCalled();
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
                        expect(_private.loadAdtech).toHaveBeenCalled();
                        expect(_private.makeAdCall.calls.count()).toBe(1);
                        expect(_private.makeAdCall).toHaveBeenCalledWith({id: 'rc1', sponsored: true, campaign: {campaignId: 'camp1'}},
                            withWildcards, jasmine.any(Object), 7654, adtech, 3000);
                        expect(_private.fetchDynamicCards).not.toHaveBeenCalled();
                        expect(_private.trimCard).not.toHaveBeenCalled();
                        expect(_private.sendError).not.toHaveBeenCalled();
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should still resolve if loadAdtech fails', function(done) {
                    _private.loadAdtech.and.returnValue(q.reject('I GOT A PROBLEM'));
                    
                    spCards.fetchSponsoredCards(experience, config).then(function() {
                        expect(_private.loadAdtech).toHaveBeenCalled();
                        expect(_private.makeAdCall).not.toHaveBeenCalled();
                        expect(_private.fetchDynamicCards).not.toHaveBeenCalled();
                        expect(_private.trimCard.calls.count()).toBe(2);
                        expect(_private.trimCard).toHaveBeenCalledWith('rc1', experience);
                        expect(_private.trimCard).toHaveBeenCalledWith('rc3', experience);
                        expect(_private.sendError.calls.count()).toBe(1);
                        expect(_private.sendError).toHaveBeenCalledWith('e-1234', 'loading adtech failed - I GOT A PROBLEM');
                        expect(experience.data.deck.length).toBe(1);
                    }).catch(function(error) {
                        expect(error).not.toBeDefined();
                    }).done(done);
                });
                
                describe('creates c6.addSponsoredCard that', function() {
                    beforeEach(function(done) {
                        window.c6.cardCache = {};
                        spCards.fetchSponsoredCards(experience, config).done(done);
                    });
                    
                    it('should create an entry in the c6.cardCache if there is none', function() {
                        window.c6.addSponsoredCard(1234, 987, 'ext1', 'click.me', 'count.me', 'e-4321');
                        expect(window.c6.cardCache).toEqual({ 1234: { 987: {
                            campaignId: 987, extId: 'ext1', clickUrl: 'click.me', countUrl: 'count.me',
                            usableFor: { 'e-4321': true }
                        } } });
                    });

                    it('should just update the usableFor block for an existing entry', function() {
                        window.c6.cardCache = { 1234: { 987: {
                            campaignId: 987, extId: 'ext1', clickUrl: 'click.me', countUrl: 'count.me',
                            usableFor: { 'e-4321': true }
                        } } };
                    
                        window.c6.addSponsoredCard(1234, 987, 'ext1', 'click.you', 'count.you', 'e-1234');
                        expect(window.c6.cardCache).toEqual({ 1234: { 987: {
                            campaignId: 987, extId: 'ext1', clickUrl: 'click.me', countUrl: 'count.me',
                            usableFor: { 'e-4321': true, 'e-1234': true }
                        } } });
                    });

                    it('should not update an existing entry that has already been used', function() {
                        window.c6.cardCache = { 1234: { 987: {
                            campaignId: 987, extId: 'ext1', clickUrl: 'click.me', countUrl: 'count.me',
                            usableFor: { 'e-4321': false }
                        } } };
                    
                        window.c6.addSponsoredCard(1234, 987, 'ext1', 'click.you', 'count.you', 'e-4321');
                        expect(window.c6.cardCache).toEqual({ 1234: { 987: {
                            campaignId: 987, extId: 'ext1', clickUrl: 'click.me', countUrl: 'count.me',
                            usableFor: { 'e-4321': false }
                        } } });
                    });
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
        
            describe('loadAdtech', function() {
                beforeEach(function() {
                    window.c6.require.and.callFake(function(modules, cb) {
                        cb(adtech);
                    });
                });

                it('should setup necessary config and require in adtech', function(done) {
                    _private.loadAdtech().then(function(resp) {
                        expect(resp).toBe(adtech);
                        expect(window.c6.require).toHaveBeenCalledWith(['adtech'], jasmine.any(Function));
                        expect(window.c6.require.config).toEqual({
                            paths: { adtech: '//aka-cdn.adtechus.com/dt/common/DAC.js' },
                            shim: { adtech: {
                                exports: 'ADTECH',
                                onCreateFrame: jasmine.any(Function)
                            } }
                        });
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should timeout if require never calls back with anything', function(done) {
                    window.c6.require.and.callFake(function(modules, cb) { return adtech; });
                    
                    _private.loadAdtech().then(function(resp) {
                        expect(resp).not.toBeDefined();
                    }).catch(function(error) {
                        expect(error).toEqual(new Error('Timed out after 5000ms loading adtech library'));
                    }).done(done);

                    jasmine.clock().tick(5001);
                });
                
                describe('creates onCreateFrame in require.config that', function(done) {
                    it('should prepare the window and document', function(done) {
                        _private.loadAdtech().then(function(resp) {
                            var newWindow = {
                                parent: window,
                                document: { write: jasmine.createSpy('document.write') }
                            };
                            window.c6.require.config.shim.adtech.onCreateFrame(newWindow);
                            expect(newWindow.c6).toBe(window.c6);
                            expect(newWindow.document.write).toHaveBeenCalledWith('<div id="ad"></div>');
                        }).catch(function(error) {
                            expect(error.toString()).not.toBeDefined();
                        }).done(done);
                    });
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
                    pixels = { countUrls: [], clickUrls: [] };
                    window.c6.cardCache = { 1234: {} };
                    adtech.loadAd.and.callFake(function(opts) {
                        window.c6.cardCache[1234].camp1 = {
                            clickUrl: 'click.me', countUrl: 'count.me',
                            usableFor: { 'e-1234': true }
                        };
                        opts.complete();
                    });
                    spyOn(_private, 'decorateCard').and.callThrough();
                });

                it('should call adtech.loadAd', function(done) {
                    _private.makeAdCall(experience.data.deck[0], experience, pixels, 1234, adtech).then(function() {
                        expect(experience.data.deck[0]).toEqual({
                            id: 'rc1',
                            sponsored: true,
                            campaign: { campaignId: 'camp1', clickUrls: ['click.me'], countUrls: ['count.me'] }
                        });
                        expect(adtech.loadAd).toHaveBeenCalledWith({
                            placement: 1234,
                            params: {
                                target: '_blank',
                                adid: 'camp1',
                                bnid: '1',
                                sub1: 'e-1234'
                            },
                            complete: jasmine.any(Function)
                        });
                        expect(window.c6.cardCache[1234].camp1.usableFor['e-1234']).toBe(false);
                        expect(_private.decorateCard).toHaveBeenCalledWith(experience.data.deck[0], experience, pixels, 1234);
                        expect(_private.trimCard).not.toHaveBeenCalled();
                        expect(_private.sendError).not.toHaveBeenCalled();
                        expect(window.__c6_ga__).not.toHaveBeenCalled();
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should use the card\'s configured bannerId, if it exists', function(done) {
                    experience.data.deck[0].campaign.bannerId = '2';
                    _private.makeAdCall(experience.data.deck[0], experience, pixels, 1234, adtech).then(function() {
                        expect(experience.data.deck[0]).toEqual({
                            id: 'rc1',
                            sponsored: true,
                            campaign: {
                                campaignId: 'camp1',
                                clickUrls: ['click.me'],
                                countUrls: ['count.me'],
                                bannerId: '2'
                            }
                        });
                        expect(adtech.loadAd).toHaveBeenCalledWith({
                            placement: 1234,
                            params: {
                                target: '_blank',
                                adid: 'camp1',
                                bnid: '2',
                                sub1: 'e-1234'
                            },
                            complete: jasmine.any(Function)
                        });
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should handle WildCard-style cards', function(done) {
                    window.c6.cardCache[1234]['987'] = {
                        clickUrl: 'click.me.now', countUrl: 'count.me.now',
                        usableFor: { 'e-1234': true }
                    };
                    experience.data.deck[0] = {
                        id: 'rc1',
                        sponsored: true,
                        adtechId: 987,
                        bannerId: '3',
                        campaign: {}
                    };
                    _private.makeAdCall(experience.data.deck[0], experience, pixels, 1234, adtech).then(function() {
                        expect(experience.data.deck[0]).toEqual({
                            id: 'rc1',
                            sponsored: true,
                            adtechId: 987,
                            bannerId: '3',
                            campaign: {
                                clickUrls: ['click.me.now'],
                                countUrls: ['count.me.now']
                            }
                        });
                        expect(adtech.loadAd).toHaveBeenCalledWith({
                            placement: 1234,
                            params: {
                                target: '_blank',
                                adid: '987',
                                bnid: '3',
                                sub1: 'e-1234'
                            },
                            complete: jasmine.any(Function)
                        });
                        expect(window.c6.cardCache[1234]['987'].usableFor['e-1234']).toBe(false);
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should timeout and trim the card if adtech takes too long', function(done) {
                    adtech.loadAd.and.callFake(function(opts) {
                        window.c6.cardCache = { 1234: { camp1: {
                            clickUrl: 'click.me', countUrl: 'count.me'},
                            usableFor: { 'e-1234': true }
                        } };
                        setTimeout(opts.complete, 4000);
                    });
                    _private.makeAdCall(experience.data.deck[0], experience, pixels, 1234, adtech).then(function() {
                        expect(experience.data.deck).toEqual([
                            { id: 'rc2', sponsored: false, campaign: { campaignId: null } },
                            { id: 'rc3', sponsored: true, campaign: { campaignId: 'camp3' } }
                        ]);
                        expect(adtech.loadAd).toHaveBeenCalled();
                        expect(_private.trimCard).toHaveBeenCalledWith('rc1', experience);
                        expect(_private.sendError).toHaveBeenCalledWith('e-1234', 'makeAdCall - Error: Timed out after 3000 ms');
                        expect(window.__c6_ga__).toHaveBeenCalledWith('1234.send', 'event', 
                            {eventCategory: 'Error', eventAction: 'SponsoredCardRemoved',
                             eventLabel: '{"message":"makeAdCall - Error: Timed out after 3000 ms"}'});
                        expect(_private.decorateCard).not.toHaveBeenCalled();
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                    
                    jasmine.clock().tick(3001);
                });

                it('should trim card if adtech complete function throws an exception',function(done){
                    var err = new Error('test error');
                    _private.decorateCard.and.callFake(function(){
                        throw (err);
                    });
                    adtech.loadAd.and.callFake(function(opts) {
                        window.c6.cardCache = { 1234: { camp1: {
                            clickUrl: 'click.me', countUrl: 'count.me'},
                            usableFor: { 'e-1234': true }
                        } };
                        opts.complete();

                    });
                    _private.makeAdCall(experience.data.deck[0], experience, pixels, 1234, adtech).then(function() {
                        expect(experience.data.deck).toEqual([
                            { id: 'rc2', sponsored: false, campaign: { campaignId: null } },
                            { id: 'rc3', sponsored: true, campaign: { campaignId: 'camp3' } }
                        ]);
                        expect(adtech.loadAd).toHaveBeenCalled();
                        expect(_private.trimCard).toHaveBeenCalledWith('rc1', experience);
                        expect(_private.sendError).toHaveBeenCalledWith('e-1234', 'makeAdCall - test error');
                        expect(window.__c6_ga__).toHaveBeenCalledWith('1234.send', 'event', 
                            {eventCategory: 'Error', eventAction: 'SponsoredCardRemoved',
                             eventLabel: '{"message":"makeAdCall - test error"}'});
                        expect(_private.decorateCard).toHaveBeenCalled();
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
            });
            
            describe('decorateCard', function() {
                var pixels;
                beforeEach(function() {
                    pixels = { countUrls: ['custom.count'], clickUrls: ['custom.click'] };
                    window.c6.cardCache = { 1234: { camp1: {
                        clickUrl: 'click.me', countUrl: 'count.me',
                        usableFor: { 'e-1234': true }
                    } } };
                });
                
                it('should decorate a card with properties from the cardCache', function() {
                    _private.decorateCard(experience.data.deck[0], experience, pixels, 1234);
                    expect(experience.data.deck[0]).toEqual({
                        id: 'rc1',
                        sponsored: true,
                        campaign: {
                            campaignId: 'camp1',
                            clickUrls: ['custom.click', 'click.me'],
                            countUrls: ['custom.count', 'count.me']
                        }
                    });
                    expect(window.c6.cardCache[1234].camp1.usableFor['e-1234']).toBe(false);
                });

                it('should handle WildCard-style cards', function() {
                    window.c6.cardCache[1234]['987'] = {
                        clickUrl: 'click.me.now', countUrl: 'count.me.now',
                        usableFor: { 'e-1234': true }
                    };
                    experience.data.deck[0] = {
                        id: 'rc1',
                        sponsored: true,
                        adtechId: 987,
                        bannerId: '3',
                        campaign: {}
                    };
                    _private.decorateCard(experience.data.deck[0], experience, pixels, 1234);
                    expect(experience.data.deck[0]).toEqual({
                        id: 'rc1',
                        sponsored: true,
                        adtechId: 987,
                        bannerId: '3',
                        campaign: {
                            clickUrls: ['custom.click', 'click.me.now'],
                            countUrls: ['custom.count', 'count.me.now']
                        }
                    });
                    expect(window.c6.cardCache[1234]['987'].usableFor['e-1234']).toBe(false);
                });
                
                it('should call trimCard if there\'s no entry in the cardCache', function() {
                    _private.decorateCard(experience.data.deck[2], experience, pixels, 1234);
                    expect(experience.data.deck).toEqual([
                        { id: 'rc1', sponsored: true, campaign: { campaignId: 'camp1' } },
                        { id: 'rc2', sponsored: false, campaign: { campaignId: null } }
                    ]);
                    expect(_private.trimCard).toHaveBeenCalledWith('rc3', experience);
                    expect(_private.sendError).toHaveBeenCalledWith('e-1234', 'ad call finished but no cardInfo');
                    expect(window.__c6_ga__).toHaveBeenCalledWith('1234.send', 'event', 
                        {eventCategory: 'Error', eventAction: 'SponsoredCardRemoved',
                         eventLabel: '{"message":"ad call finished but no cardInfo"}' });
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
                var placeholders, pixels;
                beforeEach(function() {
                    placeholders = _private.getPlaceholders(withWildcards);
                    pixels = { clickUrls: [ 'click.me' ], countUrls: [ 'count.me' ] };
                    
                    window.c6.cardCache = {
                        7654: {
                            123: {
                                extId: 'rc-sp1', campaignId: 123, clickUrl: 'click.1', countUrl: 'count.1',
                                usableFor: { 'e-4567': false, 'e-1234': true }
                            },
                            234: {
                                extId: 'rc-sp2', campaignId: 234, clickUrl: 'click.2', countUrl: 'count.2',
                                usableFor: { 'e-4567': true, 'e-1234': true }
                            },
                            345: {
                                extId: 'rc-sp3', campaignId: 345, clickUrl: 'click.3', countUrl: 'count.3',
                                usableFor: { 'e-4567': true }
                            },
                            456: {
                                extId: 'rc-sp4', campaignId: 456, clickUrl: 'click.4', countUrl: 'count.4',
                                usableFor: { 'e-1234': true }
                            }
                        }
                    };
                    spyOn(_private, 'swapCard').and.callThrough();

                    window.c6.require.and.callFake(function(urls, cb) {
                        var id = urls[0].match(/[^\/]+(?=\.js)/)[0];
                        cb({id: id, campaign: {} });
                    });
                });

                describe('if the card already has some pixels', function() {
                    beforeEach(function(done) {
                        window.c6.require.and.callFake(function(urls, cb) {
                            var id = urls[0].match(/[^\/]+(?=\.js)/)[0];
                            cb({id: id, campaign: { clickUrls: ['click.custom'], countUrls: ['count.custom'] } });
                        });

                        _private.loadCardObjects(withWildcards, placeholders, pixels, 7654).finally(done);
                    });

                    it('should combine the existing pixels with the campaign ones', function() {
                        expect(withWildcards.data.deck).toEqual([
                            jasmine.any(Object),
                            jasmine.objectContaining({
                                campaign: {
                                    clickUrls: ['click.custom', 'click.me', 'click.2'], countUrls: ['count.custom', 'count.me', 'count.2']
                                }
                            }),
                            jasmine.objectContaining({
                                campaign: {
                                    clickUrls: ['click.custom', 'click.me', 'click.3'], countUrls: ['count.custom', 'count.me', 'count.3']
                                }
                            }),
                            jasmine.any(Object)
                        ]);
                    });
                });

                it('should filter banners in the cache and load card objects from c6.require', function(done) {
                    _private.loadCardObjects(withWildcards, placeholders, pixels, 7654).then(function() {
                        expect(withWildcards.data.deck).toEqual([
                            { id: 'rc1', sponsored: true, campaign: { campaignId: 'camp1' } },
                            { id: 'rc-sp2', adtechId: 234, campaign: {
                                clickUrls: ['click.me', 'click.2'], countUrls: ['count.me', 'count.2']
                            } },
                            { id: 'rc-sp3', adtechId: 345, campaign: {
                                clickUrls: ['click.me', 'click.3'], countUrls: ['count.me', 'count.3']
                            } },
                            { id: 'rc4', sponsored: false, type: 'tamecard', foo: 'bar' }
                        ]);
                        expect(window.c6.require.calls.count()).toBe(2);
                        expect(window.c6.require).toHaveBeenCalledWith(['http://test.com/api/public/content/card/rc-sp2.js'], jasmine.any(Function));
                        expect(window.c6.require).toHaveBeenCalledWith(['http://test.com/api/public/content/card/rc-sp3.js'], jasmine.any(Function));
                        expect(_private.swapCard.calls.count()).toBe(2);
                        expect(_private.swapCard).toHaveBeenCalledWith({id: 'rc2', type: 'wildcard'}, withWildcards.data.deck[1], withWildcards);
                        expect(_private.swapCard).toHaveBeenCalledWith({id: 'rc3', type: 'wildcard'}, withWildcards.data.deck[2], withWildcards);
                        expect(_private.sendError).not.toHaveBeenCalled();
                        expect(window.c6.cardCache[7654][234].usableFor).toEqual({'e-4567': false, 'e-1234': true});
                        expect(window.c6.cardCache[7654][345].usableFor).toEqual({'e-4567': false});
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should send errors if the cards cannot be found', function(done) {
                    window.c6.require.and.callFake(function(urls, cb) { cb(); });

                    _private.loadCardObjects(withWildcards, placeholders, pixels, 7654).then(function() {
                        expect(withWildcards.data.deck).toEqual([
                            { id: 'rc1', sponsored: true, campaign: { campaignId: 'camp1' } },
                            { id: 'rc2', type: 'wildcard' },
                            { id: 'rc3', type: 'wildcard' },
                            { id: 'rc4', sponsored: false, type: 'tamecard', foo: 'bar' }
                        ]);
                        expect(window.c6.require.calls.count()).toBe(2);
                        expect(_private.swapCard).not.toHaveBeenCalled();
                        expect(_private.sendError.calls.count()).toBe(2);
                        expect(_private.sendError).toHaveBeenCalledWith('e-4567', 'card rc-sp2 not found');
                        expect(_private.sendError).toHaveBeenCalledWith('e-4567', 'card rc-sp3 not found');
                        expect(window.c6.cardCache[7654][234].usableFor).toEqual({'e-4567': true, 'e-1234': true});
                        expect(window.c6.cardCache[7654][345].usableFor).toEqual({'e-4567': true});
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should leave some placeholders intact if there aren\'t enough usable banners', function(done) {
                    window.c6.cardCache[7654][234].usableFor['e-4567'] = false;
                    _private.loadCardObjects(withWildcards, placeholders, pixels, 7654).then(function() {
                        expect(withWildcards.data.deck).toEqual([
                            { id: 'rc1', sponsored: true, campaign: { campaignId: 'camp1' } },
                            { id: 'rc-sp3', adtechId: 345, campaign: {
                                clickUrls: ['click.me', 'click.3'], countUrls: ['count.me', 'count.3']
                            } },
                            { id: 'rc3', type: 'wildcard' },
                            { id: 'rc4', sponsored: false, type: 'tamecard', foo: 'bar' }
                        ]);
                        expect(window.c6.require.calls.count()).toBe(1);
                        expect(window.c6.require).toHaveBeenCalledWith(['http://test.com/api/public/content/card/rc-sp3.js'], jasmine.any(Function));
                        expect(_private.swapCard.calls.count()).toBe(1);
                        expect(_private.swapCard).toHaveBeenCalledWith({id: 'rc2', type: 'wildcard'}, withWildcards.data.deck[1], withWildcards);
                        expect(_private.sendError).not.toHaveBeenCalled();
                        expect(window.c6.cardCache[7654][234].usableFor).toEqual({'e-4567': false, 'e-1234': true});
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should do nothing if there are no usable banners', function(done) {
                    window.c6.cardCache[7654][234].usableFor['e-4567'] = false;
                    window.c6.cardCache[7654][345].usableFor['e-4567'] = false;
                    _private.loadCardObjects(withWildcards, placeholders, pixels, 7654).then(function() {
                        expect(withWildcards.data.deck).toEqual([
                            { id: 'rc1', sponsored: true, campaign: { campaignId: 'camp1' } },
                            { id: 'rc2', type: 'wildcard' },
                            { id: 'rc3', type: 'wildcard' },
                            { id: 'rc4', sponsored: false, type: 'tamecard', foo: 'bar' }
                        ]);
                        expect(window.c6.require).not.toHaveBeenCalled();
                        expect(_private.swapCard).not.toHaveBeenCalled();
                        expect(_private.sendError).not.toHaveBeenCalled();
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
            });
            
            describe('swapCard', function() {
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
                    var complete = null;
                    
                    config = { campaign: 'cam-1', categories: 'foo,bar' };
                    pixels = { pixels: 'yes' };
                    
                    spyOn(_private, 'loadCardObjects').and.returnValue(q());
                    adtech.enqueueAd.and.callFake(function(cfg) {
                        complete = cfg.complete;
                    });
                    adtech.executeQueue.and.callFake(function(cfg) {
                        cfg.multiAd.readyCallback();
                    });
                    adtech.showAd.and.callFake(function(placement) {
                        complete();
                    });
                });
                    
                it('should skip if there are no placeholders', function(done) {
                    _private.fetchDynamicCards(experience, config, pixels, adtech, 3000).then(function() {
                        expect(adtech.enqueueAd).not.toHaveBeenCalled();
                        expect(adtech.executeQueue).not.toHaveBeenCalled();
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should make an ad call for each placeholder', function(done) {
                    _private.fetchDynamicCards(withWildcards, config, pixels, adtech, 3000).then(function() {
                        expect(adtech.enqueueAd.calls.count()).toBe(2);
                        adtech.enqueueAd.calls.allArgs().forEach(function(args) {
                            expect(args).toEqual([{
                                placement: 7654,
                                params: {
                                    target: '_blank',
                                    Allowedsizes: '2x2',
                                    kwlp1: 'cam-1',
                                    kwlp3: 'foo+bar',
                                    sub1: 'e-4567'
                                },
                                complete: jasmine.any(Function)
                            }]);
                        });
                        expect(adtech.executeQueue.calls.count()).toBe(1);
                        expect(adtech.executeQueue).toHaveBeenCalledWith({ multiAd: {
                            disableAdInjection: true,
                            readyCallback: jasmine.any(Function)
                        } });
                        expect(_private.loadCardObjects).toHaveBeenCalledWith(withWildcards, [
                            {id: 'rc2', type: 'wildcard'},
                            {id: 'rc3', type: 'wildcard'}
                        ], pixels, 7654);
                        expect(_private.sendError).not.toHaveBeenCalled();
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should handle categories formatted as an array', function(done) {
                    config.categories = ['foo', 'bar', 'baz'];
                    _private.fetchDynamicCards(withWildcards, config, pixels, adtech, 3000).then(function() {
                        expect(adtech.enqueueAd.calls.count()).toBe(2);
                        adtech.enqueueAd.calls.allArgs().forEach(function(args) {
                            expect(args).toEqual([{
                                placement: 7654,
                                params: {
                                    target: '_blank',
                                    Allowedsizes: '2x2',
                                    kwlp1: 'cam-1',
                                    kwlp3: 'foo+bar+baz',
                                    sub1: 'e-4567'
                                },
                                complete: jasmine.any(Function)
                            }]);
                        });
                        expect(adtech.executeQueue.calls.count()).toBe(1);
                        expect(_private.loadCardObjects).toHaveBeenCalled();
                        expect(_private.sendError).not.toHaveBeenCalled();
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should only use the first four categories', function(done) {
                    config.categories = 'one,two,three,four,five,six';
                    _private.fetchDynamicCards(withWildcards, config, pixels, adtech, 3000).then(function() {
                        expect(adtech.enqueueAd.calls.count()).toBe(2);
                        adtech.enqueueAd.calls.allArgs().forEach(function(args) {
                            expect(args).toEqual([{
                                placement: 7654,
                                params: {
                                    target: '_blank',
                                    Allowedsizes: '2x2',
                                    kwlp1: 'cam-1',
                                    kwlp3: 'one+two+three+four',
                                    sub1: 'e-4567'
                                },
                                complete: jasmine.any(Function)
                            }]);
                        });
                        expect(adtech.executeQueue.calls.count()).toBe(1);
                        expect(_private.loadCardObjects).toHaveBeenCalled();
                        expect(_private.sendError).not.toHaveBeenCalled();
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should default to categories on the experience', function(done) {
                    config.categories = '';
                    withWildcards.categories = ['blah', 'bloop'];
                    _private.fetchDynamicCards(withWildcards, config, pixels, adtech, 3000).then(function() {
                        expect(adtech.enqueueAd.calls.count()).toBe(2);
                        adtech.enqueueAd.calls.allArgs().forEach(function(args) {
                            expect(args).toEqual([{
                                placement: 7654,
                                params: {
                                    target: '_blank',
                                    Allowedsizes: '2x2',
                                    kwlp1: 'cam-1',
                                    kwlp3: 'blah+bloop',
                                    sub1: 'e-4567'
                                },
                                complete: jasmine.any(Function)
                            }]);
                        });
                        expect(adtech.executeQueue.calls.count()).toBe(1);
                        expect(_private.loadCardObjects).toHaveBeenCalled();
                        expect(_private.sendError).not.toHaveBeenCalled();
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should handle the campaign and categories params being undefined', function(done) {
                    _private.fetchDynamicCards(withWildcards, {}, pixels, adtech, 3000).then(function() {
                        expect(adtech.enqueueAd.calls.count()).toBe(2);
                        adtech.enqueueAd.calls.allArgs().forEach(function(args) {
                            expect(args).toEqual([{
                                placement: 7654,
                                params: {
                                    target: '_blank',
                                    Allowedsizes: '2x2',
                                    kwlp1: undefined,
                                    kwlp3: '',
                                    sub1: 'e-4567'
                                },
                                complete: jasmine.any(Function)
                            }]);
                        });
                        expect(adtech.executeQueue.calls.count()).toBe(1);
                        expect(_private.loadCardObjects).toHaveBeenCalled();
                        expect(_private.sendError).not.toHaveBeenCalled();
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should timeout if adtech takes too long', function(done) {
                    adtech.executeQueue.and.callFake(function(cfg) {
                        setTimeout(cfg.multiAd.readyCallback, 4000);
                    });
                    
                    _private.fetchDynamicCards(withWildcards, {}, pixels, adtech, 3000).then(function() {
                        expect(adtech.enqueueAd.calls.count()).toBe(2);
                        expect(adtech.executeQueue.calls.count()).toBe(1);
                        expect(_private.loadCardObjects).not.toHaveBeenCalled();
                        expect(_private.sendError).toHaveBeenCalledWith('e-4567', 'fetchDynamicCards - Error: Timed out after 3000 ms');
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                    
                    jasmine.clock().tick(3001);
                });
                
                it('should send an error if loadCardObjects rejects', function(done) {
                    _private.loadCardObjects.and.returnValue(q.reject('I GOT A PROBLEM'));

                    _private.fetchDynamicCards(withWildcards, {}, pixels, adtech, 3000).then(function() {
                        expect(adtech.enqueueAd.calls.count()).toBe(2);
                        expect(adtech.executeQueue.calls.count()).toBe(1);
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
