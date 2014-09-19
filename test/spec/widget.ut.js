(function() {
    'use strict';

    ddescribe('widget.js', function() {
        var baseUrl,
            $window, $document,
            $, $env;

        function load(done) {
            var script = $document.createElement('script');

            script.src = '/base/src/widget.js';
            script.onload = function() {
                done();
            };
            $('body').append(script);

            return script;
        }

        function waitForDeps(deps, done) {
            var c6 = $window.c6,
                id = setInterval(function() {
                    if (deps.every(function(dep) {
                        return !!c6.requireCache[dep];
                    })) {
                        clearInterval(id);
                        done(deps.map(function(dep) {
                            return c6.requireCache[dep];
                        }));
                    }
                }, 50);
        }

        beforeEach(function(done) {
            var C6Query = require('../../lib/C6Query');

            $ = new C6Query({ window: window, document: document });

            $env = $('<iframe src="/base/test/helpers/dummy.html"></iframe>');
            $env[0].onload = function() {
                $window = $env.prop('contentWindow');
                $document = $window.document;
                $ = new C6Query({ window: $window, document: $document });

                baseUrl = $window.__C6_URL_ROOT__ = '/base/test/helpers';
                $window.__C6_APP_JS__ = 'http://staging.cinema6.com/foo.js';
                $window.__c6_ga__ = jasmine.createSpy('__c6_ga__');

                $window.console = $window.parent.console;

                load(done);
            };
            $('body').append($env);
        });

        afterEach(function() {
            $env.remove();
        });

        it('should configure google analytics', function() {
            expect($window.__c6_ga__).toHaveBeenCalledWith('create', $window.c6.gaAcctIdPlayer, {
                name: 'c6',
                cookieName: '_c6ga'
            });
        });

        describe('the c6 object', function() {
            var c6;

            beforeEach(function() {
                c6 = $window.c6;
            });

            it('should exist', function() {
                expect(c6).toEqual(jasmine.any(Object));
            });

            it('should have all the required properties', function() {
                expect(c6.app).toBe(null);
                expect(c6.embeds).toEqual([]);
                expect(c6.branding).toEqual({});
                expect(c6.requireCache).toEqual({});
                expect(c6.widgetContentCache).toEqual({});
                expect(c6.gaAcctIdPlayer).toBe('UA-44457821-2');
                expect(c6.gaAcctIdEmbed).toBe('UA-44457821-3');

                expect(c6.loadExperience).toEqual(jasmine.any(Function));
                expect(c6.addReel).toEqual(jasmine.any(Function));
                expect(c6.createWidget).toEqual(jasmine.any(Function));
            });

            describe('if there is already a c6 object', function() {
                var orig;

                beforeEach(function(done) {
                    orig = $window.c6 = {
                        foo: {}
                    };

                    load(function() {
                        c6 = $window.c6;
                        done();
                    });
                });

                it('should not be overwritten', function() {
                    expect(c6).toBe(orig);
                });

                it('should be extended', function() {
                    expect(c6.app).toBe(null);
                    expect(c6.embeds).toEqual([]);
                    expect(c6.branding).toEqual({});
                    expect(c6.requireCache).toEqual({});
                    expect(c6.widgetContentCache).toEqual({});
                    expect(c6.gaAcctIdPlayer).toBe('UA-44457821-2');
                    expect(c6.gaAcctIdEmbed).toBe('UA-44457821-3');
                    expect(c6.foo).toEqual({});
                    expect(c6.foo).toBe(orig.foo);

                    expect(c6.loadExperience).toEqual(jasmine.any(Function));
                    expect(c6.addReel).toEqual(jasmine.any(Function));
                    expect(c6.createWidget).toEqual(jasmine.any(Function));
                });
            });

            describe('methods', function() {
                describe('createWidget(config)', function() {
                    beforeEach(function() {
                        c6.createWidget({
                            branding: 'digitaljournal',
                            template: 'collateral/mr2/templates/test',
                            placementId: '3330799'
                        });
                    });

                    it('should write a <div> into the DOM', function() {
                        expect($('div').length).toBe(1);
                    });

                    describe('the <div>', function() {
                        var $div;

                        beforeEach(function() {
                            $div = $('div');
                        });

                        it('should have a random ID', function() {
                            expect($div.attr('id')).toMatch(/c6_[a-z0-9]{10}/);
                        });

                        it('should have the "c6_widget" class', function() {
                            expect($div.hasClass('c6_widget')).toBe(true);
                        });

                        it('should have a class for its branding', function() {
                            expect($div.hasClass('c6brand__digitaljournal')).toBe(true);
                        });
                    });

                    it('should create a reference to a stylesheet for the branding', function() {
                        var $link = $('head link#c6-digitaljournal');

                        expect($link.attr('rel')).toBe('stylesheet');
                        expect($link.attr('href')).toBe(baseUrl + '/collateral/branding/digitaljournal/styles/splash.css');
                    });

                    describe('if there is another widget with the same branding', function() {
                        beforeEach(function() {
                            c6.createWidget({
                                branding: 'digitaljournal',
                                template: 'collateral/mr2/templates/test',
                                placementId: '3330799'
                            });
                        });

                        it('should not create another link tag', function() {
                            expect($('head link#c6-digitaljournal').length).toBe(1);
                        });
                    });

                    describe('after all dependencies have loaded', function() {
                        var adtech, twobits, splashJS, template;

                        beforeEach(function(done) {
                            waitForDeps([
                                'http://aka-cdn.adtechus.com/dt/common/DAC.js',
                                '//lib.cinema6.com/twobits.js/v0.0.1-0-g7a19518/twobits.min.js',
                                baseUrl + '/collateral/splash/splash.js',
                                baseUrl + '/collateral/mr2/templates/test.js'
                            ], function(deps) {
                                adtech = deps[0];
                                twobits = deps[1];
                                splashJS = deps[2];
                                template = deps[3];

                                done();
                            });
                        });

                        it('should load adtech', function() {
                            expect(adtech).toEqual(jasmine.any(Object));
                            expect(Object.keys(adtech).length).toBeGreaterThan(0);
                        });

                        it('should put the splash template into the <div>', function() {
                            expect($('.c6-mr2__mr-splash').length).toBe(3);
                        });

                        it('should configure adtech', function() {
                            expect(adtech.config.page).toEqual({
                                network: '5473.1',
                                server: 'adserver.adtechus.com',
                                enableMultiAd: true
                            });

                            expect(adtech.config.placements['3330799']).toEqual({
                                adContainerId: 'ad',
                                complete: jasmine.any(Function)
                            });
                        });

                        describe('adtech calls', function() {
                            beforeEach(function() {
                                spyOn(adtech, 'enqueueAd');
                                spyOn(adtech, 'executeQueue');

                                c6.createWidget({
                                    branding: 'digitaljournal',
                                    template: 'collateral/mr2/templates/test',
                                    placementId: '3330799'
                                });
                            });

                            it('should enqueue enough ads to fill the template', function() {
                                expect(adtech.enqueueAd).toHaveBeenCalledWith(3330799);
                                expect(adtech.enqueueAd.calls.count()).toBe(3);
                            });

                            it('should execute the queue', function() {
                                expect(adtech.executeQueue).toHaveBeenCalledWith({
                                    multiAd: {
                                        disableAdInjection: true,
                                        readyCallback: jasmine.any(Function)
                                    }
                                });
                            });

                            describe('after the queue is executed', function() {
                                beforeEach(function() {
                                    spyOn(adtech, 'showAd');

                                    adtech.executeQueue.calls.mostRecent().args[0].multiAd.readyCallback();
                                });

                                it('should show the ad', function() {
                                    expect(adtech.showAd).toHaveBeenCalledWith('3330799');
                                });
                            });
                        });
                    });
                });

                describe('addReel(expId, placementId, clickUrl)', function() {
                    var desired;

                    beforeEach(function() {
                        desired = [
                            {
                                expId: 'e-317748a42e861b',
                                clickUrl: 'track.me/tr-efe96eb03f3bee'
                            },
                            {
                                expId: 'e-a3f0967a8afc16',
                                clickUrl: 'track.me/tr-c89b0839cecb08'
                            },
                            {
                                expId: 'e-388f7b044c82e0',
                                clickUrl: 'track.me/tr-c0d1bf9f330410'
                            }
                        ];

                        desired.forEach(function(config) {
                            c6.addReel(config.expId, '3330799', config.clickUrl);
                        });
                    });

                    it('should add the MiniReel to an array, associated with the placementId', function() {
                        expect(c6.widgetContentCache['3330799']).toEqual(desired);
                    });
                });
            });
        });
    });
}());
