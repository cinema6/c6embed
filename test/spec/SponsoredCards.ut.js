(function() {
    'use strict';

    describe('SponsoredCards', function() {
        var SponsoredCards,
            q,
            spCards,
            window,
            adtech,
            _private;

        var experience;
        
        beforeEach(function() {
            SponsoredCards = require('../../lib/SponsoredCards');
            q = require('../../node_modules/q/q.js');
            
            window = {
                c6: {
                    require: jasmine.createSpy('c6.require()').and.callFake(function(modules, cb) {
                        cb(adtech);
                    })
                }
            }
            
            adtech = {
                config: { placements: {} },
                loadAd: jasmine.createSpy('adtech.loadAd()')
            };
            
            experience = {
                id: 'e1',
                data: {
                    wildCardPlacement: '1234',
                    deck: [
                        { id: 'rc1', sponsored: true, campaign: { campaignId: 'camp1' } },
                        { id: 'rc2', sponsored: false, campaign: { campaignId: null } },
                        { id: 'rc3', sponsored: true, campaign: { campaignId: 'camp3' } }
                    ]
                }
            };

            spCards = new SponsoredCards({ q: q, window: window });
            _private = spCards._private;
        });
        
        beforeEach(function() {
            jasmine.clock().install();
        });
        
        afterEach(function() {
            jasmine.clock().uninstall();
        });

        describe('@public methods', function() {
            describe('fetchSponsoredCards', function() {
                beforeEach(function() {
                    spyOn(_private, 'getCardConfigs').and.callThrough();
                    spyOn(_private, 'loadAdtech').and.returnValue(q(adtech));
                    spyOn(_private, 'makeAdCall').and.returnValue(q());
                });
                
                it('should load adtech and make ad calls for each sponsored card', function(done) {
                    spCards.fetchSponsoredCards(experience).then(function() {
                        expect(_private.getCardConfigs).toHaveBeenCalledWith(experience);
                        expect(window.c6.cardCache).toEqual({ 1234: {} });
                        expect(window.c6.addSponsoredCard).toEqual(jasmine.any(Function));

                        expect(_private.loadAdtech).toHaveBeenCalled();
                        expect(adtech.config.page).toEqual({
                            network: '5473.1',
                            server: 'adserver.adtechus.com'
                        });
                        expect(adtech.config.placements[1234]).toEqual({ adContainerId: 'ad' });
                        
                        expect(_private.makeAdCall.calls.count()).toBe(2);
                        expect(_private.makeAdCall).toHaveBeenCalledWith(
                            {id:'rc1',sponsored:true,campaign:{campaignId:'camp1'}}, experience, 1234, adtech);
                        expect(_private.makeAdCall).toHaveBeenCalledWith(
                            {id:'rc3',sponsored:true,campaign:{campaignId:'camp3'}}, experience, 1234, adtech);
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should return early if the placement is missing or invalid', function(done) {
                    q([undefined, 'p1234'].map(function(placement) {
                        experience.data.wildCardPlacement = placement;
                        return spCards.fetchSponsoredCards(experience);
                    })).then(function() {
                        expect(_private.loadAdtech).not.toHaveBeenCalled();
                        expect(_private.makeAdCall).not.toHaveBeenCalled();
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should return early if there are no sponsored cards', function(done) {
                    _private.getCardConfigs.and.returnValue([]);
                    spCards.fetchSponsoredCards(experience).then(function() {
                        expect(_private.loadAdtech).not.toHaveBeenCalled();
                        expect(_private.makeAdCall).not.toHaveBeenCalled();
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should fail if loadAdtech fails', function(done) {
                    _private.loadAdtech.and.returnValue(q.reject('I GOT A PROBLEM'));
                    
                    spCards.fetchSponsoredCards(experience).then(function() {
                        expect('resolved').not.toBe('resolved');
                    }).catch(function(error) {
                        expect(error).toBe('I GOT A PROBLEM');
                    }).done(function() {
                        expect(_private.loadAdtech).toHaveBeenCalled();
                        expect(_private.makeAdCall).not.toHaveBeenCalled();
                        done();
                    });
                });
                
                describe('creates c6.addSponsoredCard that', function() {
                    it('should create an entry in the c6.cardCache', function(done) {
                        spCards.fetchSponsoredCards(experience).then(function() {
                            window.c6.addSponsoredCard(1234, 'c1', 'ext1', 'click.me', 'count.me');
                            expect(window.c6.cardCache).toEqual({
                                1234: { c1: { campExtId: 'ext1', clickUrl: 'click.me', countUrl: 'count.me' } }
                            });
                        }).catch(function(error) {
                            expect(error.toString()).not.toBeDefined();
                        }).done(done);
                    });
                });
            });
        });

        describe('_private methods', function() {
            describe('loadAdtech', function() {
                it('should setup necessary config and require in adtech', function(done) {
                    _private.loadAdtech().then(function(resp) {
                        expect(resp).toBe(adtech);
                        expect(window.c6.require).toHaveBeenCalledWith(['adtech'], jasmine.any(Function));
                        expect(window.c6.require.config).toEqual({
                            paths: { adtech: 'http://aka-cdn.adtechus.com/dt/common/DAC.js' },
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
                        { id: 'rc3', campaign: { campaignId: 'camp3' } }
                    ];
                    expect(_private.getCardConfigs(experience)).toEqual([]);
                });
            });
            
            describe('makeAdCall', function() {
                beforeEach(function() {
                    adtech.loadAd.and.callFake(function(opts) {
                        window.c6.cardCache = {1234: {camp1: {clickUrl: 'click.me', countUrl: 'count.me'}}};
                        opts.complete();
                    });
                    spyOn(_private, 'decorateCard').and.callThrough();
                    spyOn(_private, 'trimCard').and.callThrough();
                });

                it('should call adtech.loadAd', function(done) {
                    _private.makeAdCall(experience.data.deck[0], experience, 1234, adtech).then(function() {
                        expect(experience.data.deck[0]).toEqual({ id: 'rc1', sponsored: true,
                            campaign: { campaignId: 'camp1', clickUrl: 'click.me', countUrl: 'count.me' } });
                        expect(adtech.loadAd).toHaveBeenCalledWith({ placement: 1234,
                            params: { target: '_blank', adid: 'camp1', bnid: '1' }, complete: jasmine.any(Function) });
                        expect(_private.decorateCard).toHaveBeenCalledWith(experience.data.deck[0], experience, 1234);
                        expect(_private.trimCard).not.toHaveBeenCalled();
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should use the card\'s configured bannerId, if it exists', function(done) {
                    experience.data.deck[0].campaign.bannerId = '2';
                    _private.makeAdCall(experience.data.deck[0], experience, 1234, adtech).then(function() {
                        expect(experience.data.deck[0]).toEqual({ id: 'rc1', sponsored: true,
                            campaign: { campaignId: 'camp1', clickUrl: 'click.me', countUrl: 'count.me', bannerId: '2' } });
                        expect(adtech.loadAd).toHaveBeenCalledWith({ placement: 1234,
                            params: { target: '_blank', adid: 'camp1', bnid: '2' }, complete: jasmine.any(Function) });
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should timeout and trim the card if adtech takes too long', function(done) {
                    adtech.loadAd.and.callFake(function(opts) {
                        window.c6.cardCache = {1234: {camp1: {clickUrl: 'click.me', countUrl: 'count.me'}}};
                        setTimeout(opts.complete, 4000);
                    });
                    _private.makeAdCall(experience.data.deck[0], experience, 1234, adtech).then(function() {
                        expect(experience.data.deck).toEqual([
                            { id: 'rc2', sponsored: false, campaign: { campaignId: null } },
                            { id: 'rc3', sponsored: true, campaign: { campaignId: 'camp3' } }
                        ]);
                        expect(adtech.loadAd).toHaveBeenCalled();
                        expect(_private.trimCard).toHaveBeenCalledWith('rc1', experience);
                        expect(_private.decorateCard).not.toHaveBeenCalled();
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                    
                    jasmine.clock().tick(3001);
                });
            });
            
            describe('decorateCard', function() {
                beforeEach(function() {
                    window.c6.cardCache = { 1234: { camp1: { clickUrl: 'click.me', countUrl: 'count.me' } } };
                });
                
                it('should decorate a card with properties from the cardCache', function() {
                    _private.decorateCard(experience.data.deck[0], experience, 1234);
                    expect(experience.data.deck[0]).toEqual({ id: 'rc1', sponsored: true,
                        campaign: { campaignId: 'camp1', clickUrl: 'click.me', countUrl: 'count.me' } });
                });
                
                it('should call trimCard if there\'s no entry in the cardCache', function() {
                    spyOn(_private, 'trimCard').and.callThrough();
                    _private.decorateCard(experience.data.deck[2], experience, 1234);
                    expect(experience.data.deck).toEqual([
                        { id: 'rc1', sponsored: true, campaign: { campaignId: 'camp1' } },
                        { id: 'rc2', sponsored: false, campaign: { campaignId: null } }
                    ]);
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
