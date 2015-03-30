(function() {
    'use strict';

   describe('widget.js', function() {
        var baseUrl, appJs,
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
                id = $window.setInterval(function() {
                    if (deps.every(function(dep) {
                        return !!c6.requireCache[dep];
                    })) {
                        $window.clearInterval(id);
                        done(deps.map(function(dep) {
                            return c6.requireCache[dep];
                        }));
                    }
                }, 10);
        }

        beforeEach(function(done) {
            var C6Query = require('../../lib/C6Query');

            $ = new C6Query({ window: window, document: document });

            $env = $('<iframe src="/base/test/helpers/dummy.html" style="width: 800px; height: 600px; overflow: auto;" scrolling="yes"></iframe>');
            $env[0].onload = function() {
                $window = $env.prop('contentWindow');
                $document = $window.document;
                $ = new C6Query({ window: $window, document: $document });

                $('body').css({
                    margin: 0,
                    padding: 0
                });

                baseUrl = $window.__C6_URL_ROOT__ = '/base/test/helpers';
                appJs = $window.__C6_APP_JS__ = 'http://staging.cinema6.com/foo.js';
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
                expect(c6.require).toEqual(jasmine.any(Function));
                expect(c6.widgetContentCache).toEqual({});
                expect(c6.gaAcctIdPlayer).toMatch(/UA-44457821-/);
                expect(c6.gaAcctIdEmbed).toMatch(/UA-44457821-/);

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
                    expect(c6.require).toEqual(jasmine.any(Function));
                    expect(c6.widgetContentCache).toEqual({});
                    expect(c6.gaAcctIdPlayer).toMatch(/UA-44457821-/);
                    expect(c6.gaAcctIdEmbed).toMatch(/UA-44457821-/);
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
                            id: '3330799'
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

                        it('should be an inline-block element', function() {
                            expect($div.css('display')).toBe('none');
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
                                id: '3330799'
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
                                '//aka-cdn.adtechus.com/dt/common/DAC.js',
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

                        describe('the adtech environment', function() {
                            var adtechEnv;

                            beforeEach(function() {
                                adtechEnv = $('iframe[data-module=adtech]').prop('contentWindow');
                            });

                            it('should set up a reference to the c6 object', function() {
                                expect(adtechEnv.c6).toBe(c6);
                            });

                            it('should create a div for the ad placements', function() {
                                expect(adtechEnv.document.getElementById('ad')).not.toBeNull();
                            });
                        });

                        it('should put the splash template into the <div>', function() {
                            expect($('.c6-mr2__mr-splash').length).toBe(4);
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

                                $('div.c6_widget').remove();

                                c6.createWidget({
                                    branding: 'digitaljournal',
                                    template: 'collateral/mr2/templates/test',
                                    id: '3330799'
                                });
                            });

                            it('should enqueue enough ads to fill the template', function() {
                                expect(adtech.enqueueAd).toHaveBeenCalledWith(3330799);
                                expect(adtech.enqueueAd.calls.count()).toBe(4);
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

                            describe('if an experience 404s', function() {
                                var minireelIds, minireels;

                                function splashAtIndex(index) {
                                    return $($('div.c6_widget')[0].querySelectorAll('.c6-mr2__mr-splash'))[index];
                                }

                                beforeEach(function(done) {
                                    minireelIds = ['e-badegg1', 'e-badegg2', 'e-fcb95ef54b22f5'];

                                    minireelIds.forEach(function(id) {
                                        c6.addReel(id, '3330799', 'http://www.cinema6.com/track/' + id + '.jpg');
                                    });

                                    adtech.config.placements['3330799'].complete();

                                    waitForDeps(minireelIds.slice(0, 3).map(function(id) {
                                        return baseUrl + '/api/public/content/experience/' + id + '.js?container=mr2&branding=digitaljournal';
                                    }), function(_minireels) {
                                        minireels = _minireels;

                                        done();
                                    });
                                });

                                it('should still render the MiniReels it can render', function() {
                                    expect(splashAtIndex(0).querySelector('h1').firstChild.nodeValue).toBe(minireels[2].data.title);
                                });

                                it('should hide the splash pages it can\'t fill', function() {
                                    [1, 2].forEach(function(index) {
                                        expect($(splashAtIndex(index)).css('display')).toBe('none');
                                    });
                                });
                            });

                            describe('if multiple MR2s are using the same placement ID', function() {
                                var minireelIds, minireels;

                                beforeEach(function() {
                                    // Simulate another MR2 with our placement ID by adding more MiniReels than we asked for
                                    minireelIds = ['e-fcb95ef54b22f5', 'e-4b843ea93ed9d4', 'e-6b5ead50d4a1ed', 'e-60196c3751eb52', 'e-123', 'e-456', 'e-abc'];

                                    minireelIds.forEach(function(id) {
                                        c6.addReel(id, '3330799', 'http://www.cinema6.com/track/' + id + '.jpg');
                                    });
                                });

                                describe('after the first MR2 loads its stuff', function() {
                                    beforeEach(function(done) {
                                        adtech.config.placements['3330799'].complete();

                                        waitForDeps(minireelIds.slice(0, 3).map(function(id) {
                                            return baseUrl + '/api/public/content/experience/' + id + '.js?container=mr2&branding=digitaljournal';
                                        }), function(_minireels) {
                                            minireels = _minireels;

                                            done();
                                        });
                                    });

                                    it('should create embeds for the first round', function() {
                                        expect(c6.embeds.length).toBe(4);
                                        minireels.forEach(function(experience, index) {
                                            expect(c6.embeds[index].experience).toBe(experience);
                                        });
                                    });

                                    describe('after the second MR2 loads its stuff', function() {
                                        beforeEach(function(done) {
                                            adtech.config.placements['3330799'].complete();

                                            waitForDeps(minireelIds.map(function(id) {
                                                return baseUrl + '/api/public/content/experience/' + id + '.js?container=mr2&branding=digitaljournal';
                                            }), function(_minireels) {
                                                minireels = _minireels;

                                                done();
                                            });
                                        });

                                        it('should create embeds for the next round', function() {
                                            expect(c6.embeds.length).toBe(7);
                                            minireels.forEach(function(experience, index) {
                                                expect(c6.embeds[index].experience).toBe(experience);
                                            });
                                        });

                                        it('should have the right modes',function(){
                                            minireels.forEach(function(exp){
                                                switch(exp.id) {
                                                    case 'e-fcb95ef54b22f5':
                                                    case 'e-4b843ea93ed9d4':
                                                    case 'e-60196c3751eb52':
                                                        {
                                                        expect(exp.data.mode)
                                                            .toEqual('lightbox');
                                                        break;
                                                        }
                                                    case 'e-6b5ead50d4a1ed': 
                                                        {
                                                        expect(exp.data.mode)
                                                            .toEqual('lightbox-playlist');
                                                        break;
                                                        }
                                                    default:
                                                        expect(exp.data.mode).toEqual('lightbox');
                                                }
                                            });
                                        });
                                    });
                                });
                            });

                            describe('after the reels have been added', function() {
                                var minireelIds, minireels, embeds, content,
                                    splashDelegate;

                                function splashAtIndex(index) {
                                    return $($('div.c6_widget')[0].querySelectorAll('.c6-mr2__mr-splash'))[index];
                                }

                                beforeEach(function(done) {
                                    minireelIds = ['e-fcb95ef54b22f5', 'e-4b843ea93ed9d4', 'e-6b5ead50d4a1ed'];

                                    splashDelegate = {};
                                    splashJS.and.returnValue(splashDelegate);

                                    minireelIds.forEach(function(id) {
                                        c6.addReel(id, '3330799', 'http://www.cinema6.com/track/' + id + '.jpg');
                                    });
                                    content = c6.widgetContentCache['3330799'].slice();

                                    if (!$window.__c6_ga__.calls) {
                                        spyOn($window, '__c6_ga__');
                                    }

                                    spyOn(c6, 'loadExperience').and.callThrough();

                                    adtech.config.placements['3330799'].complete();

                                    waitForDeps(minireelIds.map(function(id) {
                                        return baseUrl + '/api/public/content/experience/' + id + '.js?container=mr2&branding=digitaljournal';
                                    }), function(_minireels) {
                                        var splashPages = Array.prototype.slice.call($('div.c6_widget')[0].querySelectorAll('.c6-mr2__mr-splash'));

                                        minireels = _minireels;
                                        embeds = c6.embeds.filter(function(config) {
                                            return splashPages.indexOf(config.embed) > -1;
                                        });

                                        done();
                                    });
                                });

                                it('should display the widget', function() {
                                    expect($('div.c6_widget').css('display')).toBe('inline-block');
                                });

                                it('should give all of the minireels the same branding', function() {
                                    minireels.forEach(function(minireel) {
                                        expect(minireel.data.branding).toBe(minireels[0].data.branding);
                                    });
                                });

                                describe('if there is already a loaded minireel', function() {
                                    beforeEach(function(done) {
                                        c6.embeds.length = 0;
                                        c6.embeds.push({
                                            experience: {
                                                data: {
                                                    branding: 'the-boss'
                                                }
                                            }
                                        });

                                        $('div.c6_widget').remove();

                                        c6.createWidget({
                                            template: 'collateral/mr2/templates/test',
                                            id: '3330710'
                                        });

                                        minireelIds.forEach(function(id) {
                                            c6.addReel(id, '3330710', 'http://www.cinema6.com/track/' + id + '.jpg');
                                        });

                                        adtech.config.placements['3330710'].complete();

                                        waitForDeps(minireelIds.map(function(id) {
                                            return baseUrl + '/api/public/content/experience/' + id + '.js?container=mr2';
                                        }), function(_minireels) {
                                            minireels = _minireels;

                                            done();
                                        });
                                    });

                                    it('should give every minireel the branding of the first one', function() {
                                        minireels.forEach(function(minireel) {
                                            expect(minireel.data.branding).toBe('the-boss');
                                        });
                                    });
                                });

                                describe('if no branding is specified', function() {
                                    beforeEach(function(done) {
                                        $('div.c6_widget').remove();

                                        c6.createWidget({
                                            template: 'collateral/mr2/templates/test',
                                            id: '3330710'
                                        });

                                        minireelIds.forEach(function(id) {
                                            c6.addReel(id, '3330710', 'http://www.cinema6.com/track/' + id + '.jpg');
                                        });

                                        adtech.config.placements['3330710'].complete();

                                        waitForDeps(minireelIds.map(function(id) {
                                            return baseUrl + '/api/public/content/experience/' + id + '.js?container=mr2';
                                        }), function(_minireels) {
                                            minireels = _minireels;

                                            done();
                                        });
                                    });

                                    it('should load MiniReels without specifying a branding', function() {
                                        minireels.forEach(function(experience) {
                                            expect(experience.data).toEqual(jasmine.any(Object));
                                        });
                                    });
                                });

                                describe('if an adPlacementId is specified', function() {
                                    beforeEach(function(done) {
                                        $('div.c6_widget').remove();

                                        c6.createWidget({
                                            template: 'collateral/mr2/templates/test',
                                            id: '3330710',
                                            adPlacementId: '3330123'
                                        });

                                        minireelIds.forEach(function(id) {
                                            c6.addReel(id, '3330710', 'http://www.cinema6.com/track/' + id + '.jpg');
                                        });

                                        adtech.config.placements['3330710'].complete();

                                        waitForDeps(minireelIds.map(function(id) {
                                            return baseUrl + '/api/public/content/experience/' + id + '.js?container=mr2&placementId=3330123';
                                        }), function(_minireels) {
                                            minireels = _minireels;

                                            done();
                                        });
                                    });

                                    it('should load MiniReels with a placementId', function() {
                                        minireels.forEach(function(experience) {
                                            expect(experience.data).toEqual(jasmine.any(Object));
                                        });
                                    });
                                });

                                describe('if a wildCardPlacement is specified', function() {
                                    beforeEach(function(done) {
                                        $('div.c6_widget').remove();

                                        c6.createWidget({
                                            template: 'collateral/mr2/templates/test',
                                            id: '3330710',
                                            adPlacementId: '3330123',
                                            wp: '3464003'
                                        });

                                        minireelIds.forEach(function(id) {
                                            c6.addReel(id, '3330710', 'http://www.cinema6.com/track/' + id + '.jpg');
                                        });

                                        adtech.config.placements['3330710'].complete();

                                        waitForDeps(minireelIds.map(function(id) {
                                            return baseUrl + '/api/public/content/experience/' + id + '.js?container=mr2&placementId=3330123&wildCardPlacement=3464003';
                                        }), function(_minireels) {
                                            minireels = _minireels;

                                            done();
                                        });
                                    });

                                    it('should load MiniReels with a placementId', function() {
                                        minireels.forEach(function(experience) {
                                            expect(experience.data).toEqual(jasmine.any(Object));
                                        });
                                    });
                                });

                                describe('if startPixels are specified', function() {
                                    beforeEach(function(done) {
                                        $('div.c6_widget').remove();
                                        c6.embeds.length = 0;

                                        c6.createWidget({
                                            template: 'collateral/mr2/templates/test',
                                            id: '3330710',
                                            startPixels: ['custom.pixel', 'another.pixel']
                                        });

                                        minireelIds.forEach(function(id) {
                                            c6.addReel(id, '3330710', 'http://www.cinema6.com/track/' + id + '.jpg');
                                        });

                                        adtech.config.placements['3330710'].complete();

                                        waitForDeps(minireelIds.map(function(id) {
                                            return baseUrl + '/api/public/content/experience/' + id + '.js?container=mr2';
                                        }), function(_minireels) {
                                            minireels = _minireels;

                                            done();
                                        });
                                    });

                                    it('should place the pixels in the config', function() {
                                        expect(c6.embeds.length).toBe(minireelIds.length);
                                        c6.embeds.forEach(function(embed) {
                                            expect(embed.config.startPixel).toBe('custom.pixel another.pixel');
                                        });
                                    });
                                });

                                describe('if countPixels are specified', function() {
                                    beforeEach(function(done) {
                                        $('div.c6_widget').remove();
                                        c6.embeds.length = 0;

                                        c6.createWidget({
                                            template: 'collateral/mr2/templates/test',
                                            id: '3330710',
                                            countPixels: ['custom.pixel', 'another.pixel']
                                        });

                                        minireelIds.forEach(function(id) {
                                            c6.addReel(id, '3330710', 'http://www.cinema6.com/track/' + id + '.jpg');
                                        });

                                        adtech.config.placements['3330710'].complete();

                                        waitForDeps(minireelIds.map(function(id) {
                                            return baseUrl + '/api/public/content/experience/' + id + '.js?container=mr2';
                                        }), function(_minireels) {
                                            minireels = _minireels;

                                            done();
                                        });
                                    });

                                    it('should place the pixels in the config', function() {
                                        expect(c6.embeds.length).toBe(minireelIds.length);
                                        c6.embeds.forEach(function(embed) {
                                            expect(embed.config.countPixel).toBe('custom.pixel another.pixel');
                                        });
                                    });
                                });

                                describe('if launchPixels are specified', function() {
                                    beforeEach(function(done) {
                                        $('div.c6_widget').remove();
                                        c6.embeds.length = 0;

                                        c6.createWidget({
                                            template: 'collateral/mr2/templates/test',
                                            id: '3330710',
                                            launchPixels: ['custom.pixel', 'another.pixel']
                                        });

                                        minireelIds.forEach(function(id) {
                                            c6.addReel(id, '3330710', 'http://www.cinema6.com/track/' + id + '.jpg');
                                        });

                                        adtech.config.placements['3330710'].complete();

                                        waitForDeps(minireelIds.map(function(id) {
                                            return baseUrl + '/api/public/content/experience/' + id + '.js?container=mr2';
                                        }), function(_minireels) {
                                            minireels = _minireels;

                                            done();
                                        });
                                    });

                                    it('should place the pixels in the config', function() {
                                        expect(c6.embeds.length).toBe(minireelIds.length);
                                        c6.embeds.forEach(function(embed) {
                                            expect(embed.config.launchPixel).toBe('custom.pixel another.pixel');
                                        });
                                    });
                                });

                                describe('if the widget is visible', function() {
                                    it('should preload all of its minireels', function() {
                                        expect(c6.loadExperience.calls.count()).toBe(3);
                                        embeds.forEach(function(embed, index) {
                                            var args = c6.loadExperience.calls.argsFor(index);

                                            expect(args[0]).toBe(embed);
                                            expect(args[1]).toBe(true);
                                        });
                                    });
                                });

                                describe('if the widget is not visible', function() {
                                    function $getLastWidget() {
                                        var $widgets = $('div.c6_widget');

                                        return $($widgets[$widgets.length - 1]);
                                    }

                                    function retrigger(css) {
                                        $getLastWidget().css(css);
                                        minireelIds.forEach(function(id) {
                                            c6.addReel(id, '3330799', 'foo.jpg');
                                        });
                                        adtech.config.placements['3330799'].complete();
                                    }

                                    beforeEach(function(done) {
                                        c6.loadExperience.calls.reset();

                                        c6.createWidget({
                                            branding: 'off-page',
                                            template: 'collateral/mr2/templates/off-page',
                                            id: '3330799'
                                        });

                                        $getLastWidget().css({
                                            position: 'fixed',
                                            top: '601px',
                                            left: '0px'
                                        });

                                        waitForDeps([
                                            baseUrl + '/collateral/mr2/templates/test.js'
                                        ], function() {
                                            c6.embeds.length = 0;
                                            minireelIds.forEach(function(id) {
                                                c6.addReel(id, '3330799', 'foo.jpg');
                                            });
                                            adtech.config.placements['3330799'].complete();

                                            waitForDeps(minireelIds.map(function(id) {
                                                return baseUrl + '/api/public/content/experience/' + id + '.js?container=mr2&branding=off-page';
                                            }), function(_minireels) {
                                                minireels = _minireels;

                                                done();
                                            });
                                        });
                                    });

                                    it('should not preload any experiences', function() {
                                        expect(c6.loadExperience).not.toHaveBeenCalled();

                                        retrigger({
                                            top: '-101px'
                                        });
                                        expect(c6.loadExperience).not.toHaveBeenCalled();

                                        retrigger({
                                            top: '0px',
                                            left: '-401px'
                                        });
                                        expect(c6.loadExperience).not.toHaveBeenCalled();

                                        retrigger({
                                            left: '801px'
                                        });
                                        expect(c6.loadExperience).not.toHaveBeenCalled();
                                    });

                                    describe('if scrolled into view', function() {
                                        function scroll() {
                                            var event = document.createEvent('Event');
                                            event.initEvent('scroll', true, true);

                                            $window.scrollTo.apply($window, arguments);
                                            $window.dispatchEvent(event);
                                        }

                                        beforeEach(function() {
                                            $getLastWidget().css({
                                                position: 'static',
                                                marginTop: '505px'
                                            });
                                            scroll(0, 15);
                                        });

                                        it('should preload', function() {
                                            c6.embeds.forEach(function(embed) {
                                                expect(c6.loadExperience).toHaveBeenCalledWith(embed, true);
                                            });
                                        });
                                    });

                                    describe('if resized into view', function() {
                                        beforeEach(function() {
                                            var event = document.createEvent('Event');
                                            event.initEvent('resize', true, true);

                                            $getLastWidget().css({
                                                position: 'static',
                                                marginLeft: '801px'
                                            });
                                            $env.css({
                                                width: '1024px',
                                                height: '768px'
                                            });
                                            $window.dispatchEvent(event);
                                        });

                                        it('should preload', function() {
                                            expect(c6.loadExperience.calls.count()).toBe(3);
                                            c6.embeds.forEach(function(embed) {
                                                expect(c6.loadExperience).toHaveBeenCalledWith(embed, true);
                                            });
                                        });
                                    });
                                });

                                it('should add embed objects to the c6 object for every minireel', function() {
                                    minireels.forEach(function(experience, index) {
                                        var minireel = embeds[index],
                                            splash = splashAtIndex(index);

                                        expect(minireel.embed).toBe(splash);
                                        expect(minireel.splashDelegate).toBe(splashDelegate);
                                        expect(minireel.experience).toBe(experience);
                                        expect(minireel.load).toEqual(jasmine.any(Boolean));
                                        expect(minireel.preload).toEqual(jasmine.any(Boolean));
                                        expect(minireel.standalone).toBe(false);
                                        expect(minireel.playerVersion).toBe(1);
                                        expect(minireel.config).toEqual({
                                            exp: experience.id,
                                            title: experience.data.title,
                                            context: 'mr2',
                                            container: 'mr2',
                                            hasSponsoredCards: true,
                                            adId: undefined,
                                            startPixel: undefined,
                                            countPixel: undefined,
                                            launchPixel: undefined
                                        });
                                    });
                                });

                                describe('if the playerVersion is specified', function() {
                                    beforeEach(function(done) {
                                        $('div.c6_widget').remove();
                                        c6.embeds.length = 0;

                                        c6.createWidget({
                                            template: 'collateral/mr2/templates/test',
                                            id: '3330710',
                                            playerVersion: 6
                                        });

                                        minireelIds.forEach(function(id) {
                                            c6.addReel(id, '3330710', 'http://www.cinema6.com/track/' + id + '.jpg');
                                        });

                                        adtech.config.placements['3330710'].complete();

                                        waitForDeps(minireelIds.map(function(id) {
                                            return baseUrl + '/api/public/content/experience/' + id + '.js?container=mr2';
                                        }), function(_minireels) {
                                            minireels = _minireels;

                                            done();
                                        });
                                    });

                                    it('should set the playerVersion', function() {
                                        c6.embeds.forEach(function(minireel) {
                                            expect(minireel.playerVersion).toBe(6);
                                        });
                                    });
                                });

                                it('should compile the templates', function() {
                                    minireels.forEach(function(experience, index) {
                                        var $splash = $(splashAtIndex(index)),
                                            $h1 = $($splash[0].querySelectorAll('h1')),
                                            $img = $($splash[0].querySelectorAll('img'));

                                        expect($h1[0].firstChild.nodeValue).toBe(experience.data.title);
                                        expect($img.attr('src')).toBe(baseUrl + experience.data.collateral.splash);
                                    });
                                });

                                it('should set up a splash delegate for every page', function() {
                                    minireels.forEach(function(experience, index) {
                                        expect(splashJS).toHaveBeenCalledWith({
                                            loadExperience: jasmine.any(Function)
                                        }, embeds[index], splashAtIndex(index));
                                    });
                                });

                                it('should pass a loadExperience() method that proxies to the c6 object and fires the correct tracking pixel', function() {
                                    var images = [],
                                        createElement = $document.createElement;

                                    c6.loadExperience.calls.reset();
                                    spyOn($document, 'createElement')
                                        .and.callFake(function() {
                                            return images[images.push(createElement.apply($document, arguments)) - 1];
                                        });

                                    content.forEach(function(config, index) {
                                        var delegate = splashJS.calls.argsFor(index)[0],
                                            minireel = embeds[index];

                                        delegate.loadExperience(minireel);

                                        expect(c6.loadExperience).toHaveBeenCalledWith(minireel);
                                        expect(images[index].src).toBe(config.clickUrl);
                                    });
                                });

                                it('should set up google analytics for the player', function() {
                                    minireels.forEach(function(experience) {
                                        var embedTracker = experience.id.replace(/^e-/, '');

                                        expect($window.__c6_ga__).toHaveBeenCalledWith('create', c6.gaAcctIdEmbed, {
                                            name: embedTracker,
                                            cookieName: '_c6ga'
                                        });

                                        expect($window.__c6_ga__).toHaveBeenCalledWith(embedTracker + '.require', 'displayfeatures');

                                        expect($window.__c6_ga__).toHaveBeenCalledWith(embedTracker + '.set', {
                                            page: '/embed/' + experience.id + '/?ct=mr2&cx=mr2&bd=urbantimes',
                                            title: experience.data.title,
                                            dimension1: $window.location.href
                                        });

                                        expect($window.__c6_ga__).toHaveBeenCalledWith(embedTracker + '.send', 'pageview', {
                                            sessionControl: 'start'
                                        });
                                    });
                                });

                                it('should create branding stylesheets for every experience', function() {
                                    minireels.forEach(function(experience, index) {
                                        var splash = splashAtIndex(index);

                                        expect($('head link#c6-' + experience.data.branding).length).toBe(1);
                                        expect(splash.className.split(' ').length).toBeGreaterThan(1);
                                        expect(splash.className).toContain('c6brand__' + experience.data.branding);
                                    });
                                });

                                describe('if a minireel has no branding', function() {
                                    beforeEach(function() {
                                        delete minireels[0].data.branding;

                                        adtech.config.placements['3330799'].complete();
                                    });

                                    it('should not add a stylesheet', function() {
                                        expect($('head link#c6-undefined').length).toBe(0);
                                    });
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
                                clickUrl: 'track.me/tr-efe96eb03f3bee',
                                adId: 'xyz'
                            },
                            {
                                expId: 'e-a3f0967a8afc16',
                                clickUrl: 'track.me/tr-c89b0839cecb08',
                                adId: 'xyz'
                            },
                            {
                                expId: 'e-388f7b044c82e0',
                                clickUrl: 'track.me/tr-c0d1bf9f330410',
                                adId: 'xyz'
                            }
                        ];

                        desired.forEach(function(config) {
                            c6.addReel(config.expId, '3330799', config.clickUrl, 'xyz');
                        });
                    });

                    it('should add the MiniReel to an array, associated with the placementId', function() {
                        expect(c6.widgetContentCache['3330799']).toEqual(desired);
                    });
                });

                describe('loadExperience(embed, preload)', function() {
                    var embed;

                    beforeEach(function() {
                        embed = {
                            load: false,
                            preload: false
                        };

                        c6.loadExperience(embed);
                    });

                    it('should create a script tag for the main app.js', function() {
                        var $scripts = $('head script'),
                            $script = $($scripts[$scripts.length - 1]);

                        expect($script.attr('src')).toBe(appJs);
                    });

                    it('should set the load property of the embed to true', function() {
                        expect(embed.load).toBe(true);
                        expect(embed.preload).toBe(false);
                    });

                    describe('if preload is passed as true', function() {
                        beforeEach(function() {
                            c6.loadExperience(embed, true);
                        });

                        it('should set preload to true', function() {
                            expect(embed.preload).toBe(true);
                        });
                    });

                    describe('if called again', function() {
                        var $scripts;

                        beforeEach(function() {
                            $scripts = $('head script');

                            c6.loadExperience(embed);
                        });

                        it('should not create another script', function() {
                            expect($('head script').length).toBe($scripts.length);
                        });
                    });
                });
            });
        });
    });
}());
