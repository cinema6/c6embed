(function() {
    'use strict';

    describe('AdLib', function() {
        var AdLib,
            q,
            adLib,
            c6Ajax,
            window,
            _private;

        beforeEach(function() {
            AdLib = require('../../src/app/AdLib');
            q = require('../../node_modules/q/q.js');
            
            window = {
                c6: {},
                location: {
                    protocol: 'http:'
                }
            };

            c6Ajax = {
                get: jasmine.createSpy('c6Ajax.get()')
            };

            adLib = new AdLib({ q: q, window: window, c6Ajax: c6Ajax });
            _private = adLib._private;
            _private.config.network = '1111.1';
            _private.config.server = 'adtech.com';
        });
        
        describe('_private methods', function() {
            describe('buildUrl', function() {
                it('should combine params and url parts into a final url', function() {
                    var url = _private.buildUrl('fakeType', 12345, { foo: 'bar', blah: 'bloop' });
                    expect(url).toMatch(/\/\/adtech\.com\/fakeType\/3\.0\/1111\.1\/12345\/0\/-1\/foo=bar;blah=bloop;target=_blank;misc=\d+;cors=yes$/);
                });
                
                it('should handle a case where no custom params are provided', function() {
                    var url = _private.buildUrl('addyn', 98765);
                    expect(url).toMatch(/\/\/adtech\.com\/addyn\/3\.0\/1111\.1\/98765\/0\/-1\/target=_blank;misc=\d+;cors=yes$/);
                });
                
                it('should set the cfp param if the browser will use an XDR', function() {
                    window.XDomainRequest = function() {};
                    var url = _private.buildUrl('addyn', 98765);
                    expect(url).toMatch(/\/\/adtech\.com\/addyn\/3\.0\/1111\.1\/98765\/0\/-1\/target=_blank;misc=\d+;cors=yes;cfp=1$/);
                });
            });
            
            describe('parseBanner', function() {
                it('should create a banner object out of a valid banner string', function() {
                    var banner = "window.c6.addSponsoredCard('1234', '5678', 'rc-1', 'click.me', 'count.me', 'e-1' );";
                    
                    expect(_private.parseBanner(banner)).toEqual({
                        placementId : '1234',
                        campaignId  : '5678',
                        extId       : 'rc-1',
                        clickUrl    : 'click.me',
                        countUrl    : 'count.me'
                    });
                });
                
                it('should return null for an invalid or undefined banner', function() {
                    var banner = "window.c6.addSponsoredCard('1234');"
                    expect(_private.parseBanner(banner)).toBe(null);
                    
                    var banner = "document.write('<a href=\"http://adserver.adtechus.com/?adlink/5491;\" target=\"_blank\"></a>');"
                    expect(_private.parseBanner(banner)).toBe(null);
  
                    expect(_private.parseBanner()).toBe(null);
                });
            });
        });

        describe('@public methods', function() {
            describe('configure', function() {
                it('can set the network and server', function() {
                    adLib.configure({ network: '1234.1', server: 'cinema6.com', foo: 'bar' });
                    expect(_private.config).toEqual({ network: '1234.1', server: 'cinema6.com' });
                });
            });
            
            describe('loadAd', function() {
                var banner;
                beforeEach(function() {
                    spyOn(_private, 'buildUrl').and.callThrough();
                    banner = "window.c6.addSponsoredCard('1234','5678','rc-1','click.me','count.me');";
                    c6Ajax.get.and.returnValue(q({ status: 200, data: banner }));
                });

                it('should load a banner and respond with a JSON representation', function(done) {
                    adLib.loadAd(1234, 5678, 1).then(function(banner) {
                        expect(banner).toEqual({
                            placementId : '1234',
                            campaignId  : '5678',
                            extId       : 'rc-1',
                            clickUrl    : 'click.me',
                            countUrl    : 'count.me'
                        });
                        expect(_private.buildUrl).toHaveBeenCalledWith('addyn', 1234,
                            jasmine.objectContaining({ adid: 5678, bnid: 1 }));
                        expect(c6Ajax.get).toHaveBeenCalledWith(jasmine.any(String), { withCredentials: true });
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should resolve with null if Adtech doesn\'t return a sponsored card banner', function(done) {
                    banner = "document.write('<a href=\"http://adserver.adtechus.com/?adlink/5491;\" target=\"_blank\"></a>');";
                    c6Ajax.get.and.returnValue(q({ code: 200, data: banner }));

                    adLib.loadAd(1234, 5678, 1).then(function(banner) {
                        expect(banner).toBe(null);
                        expect(_private.buildUrl).toHaveBeenCalled();
                        expect(c6Ajax.get).toHaveBeenCalled();
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should reject if the request fails', function(done) {
                    c6Ajax.get.and.returnValue(q.reject({ status: 500, data: 'Adtech stinks' }));

                    adLib.loadAd(1234, 5678, 1).then(function(banner) {
                        expect(banner).not.toBeDefined();
                    }).catch(function(error) {
                        expect(error).toBe('request failed - code = 500, body = Adtech stinks');
                        expect(c6Ajax.get).toHaveBeenCalled();
                    }).done(done);
                });
            });
            
            describe('multiAd', function() {
                var respData;
                beforeEach(function() {
                    spyOn(_private, 'buildUrl').and.callThrough();
                    spyOn(_private, 'parseBanner').and.callThrough();
                    
                    respData = {
                        'ADTECH_MultiAd': [
                            {
                                Ad: {
                                    AdCode: "window.c6.addSponsoredCard('1234','5678','rc-1','click.1','count.1')"
                                }
                            },
                            {
                                Ad: {
                                    AdCode: "window.c6.addSponsoredCard('1234','7890','rc-2','click.2','count.2')"
                                }
                            },
                            {
                                Ad: {
                                    AdCode: "document.write('<a href=\"http://adserver.adtechus.com/?adlink/5491;\" target=\"_blank\"></a>');"
                                }
                            }
                        ]
                    };
                    
                    c6Ajax.get.and.callFake(function() { return q({status: 200, data: respData }); });
                });
                
                it('should be able to load multiple banners and respond with an array of objects', function(done) {
                    adLib.multiAd(3, 1234, '2x2', { kwlp1: 'cam-1', kwlp3: 'foo+bar' }).then(function(banners) {
                        expect(banners).toEqual([
                            {
                                placementId : '1234',
                                campaignId  : '5678',
                                extId       : 'rc-1',
                                clickUrl    : 'click.1',
                                countUrl    : 'count.1'
                            },
                            {
                                placementId : '1234',
                                campaignId  : '7890',
                                extId       : 'rc-2',
                                clickUrl    : 'click.2',
                                countUrl    : 'count.2'
                            },
                            null
                        ]);
                        expect(_private.buildUrl).toHaveBeenCalledWith('multiad', 0, jasmine.objectContaining({
                            mode: 'json',
                            plcids: '1234,1234,1234',
                            Allowedsizes: '2x2',
                            kwlp1: 'cam-1',
                            kwlp3: 'foo+bar',
                        }));
                        expect(c6Ajax.get).toHaveBeenCalledWith(jasmine.any(String), { withCredentials: true });
                        expect(_private.parseBanner.calls.count()).toBe(3);
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should handle keywords being undefined', function(done) {
                    adLib.multiAd(3, 1234, '2x2').then(function(banners) {
                        expect(banners).toEqual([
                            jasmine.any(Object),
                            jasmine.any(Object),
                            null
                        ]);
                        expect(_private.buildUrl).toHaveBeenCalledWith('multiad', 0, jasmine.objectContaining({
                            mode: 'json',
                            plcids: '1234,1234,1234',
                            Allowedsizes: '2x2',
                            kwlp1: undefined,
                            kwlp3: undefined
                        }));
                        expect(_private.parseBanner.calls.count()).toBe(3);
                    }).catch(function(error) {
                        expect(error.toString()).not.toBeDefined();
                    }).done(done);
                });
                
                it('should reject if Adtech returns a malformed response', function(done) {
                    c6Ajax.get.and.returnValue(q({ status: 200, data: { banners: 'yes' } }));
                    
                    adLib.multiAd(3, 1234, '2x2').then(function(banners) {
                        expect(banners).not.toBeDefined();
                    }).catch(function(error) {
                        expect(error).toBe('Invalid response for multiAd request: {"status":200,"data":{"banners":"yes"}}');
                        expect(c6Ajax.get).toHaveBeenCalled();
                        expect(_private.parseBanner).not.toHaveBeenCalled();
                    }).done(done);
                });
                
                it('should reject if the request fails', function(done) {
                    c6Ajax.get.and.returnValue(q.reject({ status: 500, data: 'Adtech stinks' }));

                    adLib.multiAd(3, 1234, '2x2').then(function(banners) {
                        expect(banners).not.toBeDefined();
                    }).catch(function(error) {
                        expect(error).toBe('request failed - code = 500, body = Adtech stinks');
                        expect(c6Ajax.get).toHaveBeenCalled();
                        expect(_private.parseBanner).not.toHaveBeenCalled();
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
