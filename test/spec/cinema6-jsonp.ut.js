describe('cinema6-jsonp.js', function() {
    'use strict';

    var C6Query;

    var $;

    var $window, $document,
        $env,
        $workspace;

    var c6,
        baseUrl, appJs;

    function load(cb, src) {
        var script = $document.createElement('script');

        script.src = src || ('/base/src/cinema6-jsonp/cinema6-jsonp.js?callback=onC6AdLoad&id=108542&count=3&cb=' + Date.now());
        script.onload = cb;

        $workspace.append(script);
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
            }, 50);
    }

    beforeEach(function(done) {
        C6Query = require('../../lib/C6Query');

        $ = new C6Query({ document: document, window: window });

        $env = $('<iframe src="/base/test/helpers/dummy.html" style="width: 800px; height: 600px; overflow: auto;" scrolling="yes"></iframe>');
        $env[0].onload = function() {
            $window = $env.prop('contentWindow');
            $document = $window.document;
            $ = new C6Query({ window: $window, document: $document });

            $('body').css({
                margin: 0,
                padding: 0
            });

            $workspace = $([
                '<div>',
                '    <script src="/base/src/cinema6-jsonp/cinema6-jsonp.js?callback=foo&id=12345"></script>',
                '</div>'
            ].join(''));

            $('body').append($workspace);

            baseUrl = $window.__C6_URL_ROOT__ = '/base/test/helpers';
            appJs = $window.__C6_APP_JS__ = 'http://staging.cinema6.com/foo.js';
            $window.__c6_ga__ = jasmine.createSpy('__c6_ga__');

            $window.console = $window.parent.console;
            $window.onC6AdLoad = jasmine.createSpy('onC6AdLoad()');

            load(function() {
                c6 = $window.c6;

                done();
            });
        };
        $('body').append($env);
    });

    afterEach(function() {
        $workspace.remove();
    });

    it('should configure google analytics', function() {
        expect($window.__c6_ga__).toHaveBeenCalledWith('create', $window.c6.gaAcctIdPlayer, {
            name: 'c6',
            cookieName: '_c6ga'
        });
    });

    it('should put one container in the DOM', function(done) {
        load(function() {
            expect($('div#c6-lightbox-container').length).toBe(1);
            done();
        });
    });

    describe('the c6 object', function() {
        var c6;

        beforeEach(function() {
            c6 = $window.c6;
        });

        it('should have the required properties', function() {
            expect(c6.app).toBe(null, 'app');
            expect(c6.embeds).toEqual(jasmine.any($window.Array), 'embeds');
            expect(c6.requireCache).toEqual(jasmine.any(Object), 'requireCache');
            expect(c6.require).toEqual(jasmine.any(Function), 'require');
            expect(c6.widgetContentCache).toEqual({}, 'widgetContentCache');
            expect(c6.gaAcctIdPlayer).toMatch(/UA-44457821-/, 'gaAcctIdPlayer');
            expect(c6.gaAcctIdEmbed).toMatch(/UA-44457821-/, 'gaAcctIdEmbed');

            expect(c6.loadExperience).toEqual(jasmine.any(Function), 'loadExperience');
            expect(c6.addReel).toEqual(jasmine.any(Function), 'addReel');
            expect(c6.loadExperienceById).toEqual(jasmine.any(Function), 'loadExperienceById');
        });

        describe('if there is already a c6 object', function() {
            beforeEach(function(done) {
                c6 = $window.c6 = {
                    branding: {},
                    createWidget: function() {}
                };

                load(done);
            });

            it('should not replace the c6 object', function() {
                expect($window.c6).toBe(c6);
            });

            it('should extend it', function() {
                expect(c6.app).toBe(null, 'app');
                expect(c6.embeds).toEqual(jasmine.any($window.Array), 'embeds');
                expect(c6.branding).toEqual({}, 'branding');
                expect(c6.requireCache).toEqual(jasmine.any(Object), 'requireCache');
                expect(c6.require).toEqual(jasmine.any(Function), 'require');
                expect(c6.widgetContentCache).toEqual({}, 'widgetContentCache');
                expect(c6.gaAcctIdPlayer).toMatch(/UA-44457821-/, 'gaAcctIdPlayer');
                expect(c6.gaAcctIdEmbed).toMatch(/UA-44457821-/, 'gaAcctIdEmbed');

                expect(c6.loadExperience).toEqual(jasmine.any(Function), 'loadExperience');
                expect(c6.addReel).toEqual(jasmine.any(Function), 'addReel');
                expect(c6.createWidget).toEqual(jasmine.any(Function), 'createWidget');
                expect(c6.loadExperienceById).toEqual(jasmine.any(Function), 'loadExperienceById');
            });
        });

        describe('methods', function() {
            describe('addReel(id, placement, clickUrl)', function() {
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
                        c6.addReel(config.expId, '108542', config.clickUrl, 'xyz');
                    });
                });

                it('should add the MiniReel to an array, associated with the placementId', function() {
                    desired.forEach(function(expectedConfig, index) {
                        var actualConfig = c6.widgetContentCache['108542'][index];

                        expect(actualConfig.expId).toBe(expectedConfig.expId);
                        expect(actualConfig.clickUrl).toBe(expectedConfig.clickUrl);
                        expect(actualConfig.adId).toBe(expectedConfig.adId);
                    });
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

            describe('loadExperienceById(id)', function() {
                var one, two, three,
                    createElement,
                    element;

                beforeEach(function() {
                    createElement = $document.createElement;
                    spyOn($document, 'createElement').and.callFake(function() {
                        return (element = createElement.apply($document, arguments));
                    });

                    one = {
                        experience: {
                            id: 'e-c0fe92d7aeca1e',
                            data : {
                                title : 'Experience One'
                            }
                        },
                        config : {},
                        trackingUrl: 'http://c6.co/8924htfn37848r43.jpg'
                    };
                    two = {
                        experience: {
                            id: 'e-4a2418dd5c0196',
                            data : {
                                title : 'Experience Two'
                            }
                        },
                        config : {},
                        trackingUrl: 'http://c6.co/9204uru89r44.jpg'
                    };
                    three = {
                        experience: {
                            id: 'e-99c243954c7966',
                            data : {
                                title : 'Experience Three'
                            }
                        },
                        config : {},
                        trackingUrl: 'http://c6.co/9384utf304r4f.jpg'
                    };

                    c6.embeds.push(one, two, three);

                    spyOn(c6, 'loadExperience');

                    c6.loadExperienceById('e-4a2418dd5c0196');
                });

                afterEach(function() {
                    $document.createElement = createElement;
                });

                it('should call loadExperience() with the embed of that ID', function() {
                    expect(c6.loadExperience).toHaveBeenCalledWith(two);
                });

                it('should fire a tracking pixel for that experience', function() {
                    expect(element.tagName).toBe('IMG');
                    expect(element.src).toBe('http://c6.co/9204uru89r44.jpg');
                    expect(two.trackingUrl).not.toBeDefined();
                    expect($window.__c6_ga__.calls.mostRecent().args).toEqual([
                        '4a2418dd5c0196.send',
                        'event',
                        {
                            eventCategory : 'Display',
                            eventAction   : 'AttemptShow',
                            eventLabel    : 'Experience Two'
                        }
                    ]);
                });
            });
        });
    });

    describe('after adtech is loaded', function() {
        var adtech;

        beforeEach(function(done) {
            waitForDeps([
                '//aka-cdn.adtechus.com/dt/common/DAC.js'
            ], function(deps) {
                adtech = deps[0];

                spyOn(adtech, 'enqueueAd');
                spyOn(adtech, 'executeQueue');
                spyOn($window, '__c6_ga__');

                load(done);
            });
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

        describe('if no count is provided', function() {
            beforeEach(function(done) {
                adtech.enqueueAd.calls.reset();

                load(done, '/base/src/cinema6-jsonp/cinema6-jsonp.js');
            });

            it('should call enqueueAd once', function() {
                expect(adtech.enqueueAd.calls.count()).toBe(1);
            });
        });

        describe('if the script is minified', function() {
            beforeEach(function(done) {
                var script = document.createElement('script');

                $workspace.append(script);
                $('<script src="/base/src/cinema6-jsonp.min.js?id=12345678"></script>').insertAfter(script);

                script.onload = done;

                script.src = '/base/src/cinema6-jsonp/cinema6-jsonp.js';
            });

            it('should still work', function() {
                expect(adtech.config.placements['12345678']).toEqual({
                    adContainerId: 'ad',
                    complete: jasmine.any(Function)
                });
            });
        });

        it('should configure adtech', function() {
            expect(adtech.config.page).toEqual({
                protocol: 'http',
                network: '5473.1',
                server: 'adserver.adtechus.com',
                enableMultiAd: true
            });
        });

        it('should configure a placement', function() {
            expect(adtech.config.placements['108542']).toEqual({
                adContainerId: 'ad',
                complete: jasmine.any(Function)
            });
        });

        it('should enqueue the ads', function() {
            expect(adtech.enqueueAd.calls.count()).toBe(3);
            adtech.enqueueAd.calls.all().forEach(function(call) {
                expect(call.args[0]).toBe(108542);
            });
        });

        it('should execute the queue', function() {
            expect(adtech.executeQueue).toHaveBeenCalledWith({
                multiAd: {
                    disableAdInjection: true,
                    readyCallback: jasmine.any(Function)
                }
            });
        });

        describe('when the queue is ready', function() {
            beforeEach(function() {
                spyOn(adtech, 'showAd');
                adtech.executeQueue.calls.mostRecent().args[0].multiAd.readyCallback();
            });

            it('should show the ad', function() {
                expect(adtech.showAd).toHaveBeenCalledWith(108542);
            });
        });

        describe('when the ad server has responded with some experiences', function() {
            var expIds;

            beforeEach(function() {
                expIds = ['e-4b843ea93ed9d4', 'e-6b5ead50d4a1ed', 'e-60196c3751eb52','e-60196c3751eb52'];

                expIds.forEach(function(id) {
                    c6.addReel(id, '108542', 'http://www.cinema6.com/track/' + id + '.jpg');
                });

                spyOn(c6, 'loadExperience');

                adtech.config.placements['108542'].complete();
            });

            describe('if called with extra params', function() {
                beforeEach(function(done) {
                    load(function() {
                        adtech.config.placements['108542'].complete();
                        done();
                    }, '/base/src/cinema6-jsonp/cinema6-jsonp.js?callback=onC6AdLoad&id=108542&branding=techcrunch&adPlacementId=12345&wp=333&count=3&src=veeseo&cb=' + Date.now());
                });

                it('should fetch minireels from the content service with additional params', function(done) {
                    waitForDeps(expIds.map(function(id) {
                        return baseUrl + '/api/public/content/experience/' + id + '.js?branding=techcrunch&placementId=12345&wildCardPlacement=333&container=veeseo';
                    }), function(experiences) {
                        expect(experiences.length).toBe(4);
                        experiences.forEach(function(exp){
                            switch(exp.id) {
                                case 'e-fcb95ef54b22f5':
                                case 'e-4b843ea93ed9d4':
                                case 'e-60196c3751eb52':
                                    {
                                    expect(exp.data.mode).toEqual('lightbox');
                                    break;
                                    }
                                case 'e-6b5ead50d4a1ed': 
                                    {
                                    expect(exp.data.mode).toEqual('lightbox-playlist');
                                    break;
                                    }
                                default:
                                    expect(exp.data.mode).not
                                        .toBeDefined();
                            }
                        });

                        done();
                    });
                });
            });

            describe('if a startPixel is specified', function() {
                beforeEach(function(done) {
                    c6.embeds.length = 0;
                    load(function() {
                        adtech.config.placements['108542'].complete();
                        waitForDeps(expIds.map(function(id) {
                            return baseUrl + '/api/public/content/experience/' + id + '.js?container=jsonp';
                        }), done);
                    }, '/base/src/cinema6-jsonp/cinema6-jsonp.js?callback=onC6AdLoad&id=108542&startPixel=http%3A%2F%2Ftracking.com%2Fpixel&cb=' + Date.now());
                });

                it('should set the startPixel on the config', function() {
                    expect(c6.embeds.length).toBe(expIds.length);
                    c6.embeds.forEach(function(embed) {
                        expect(embed.config.startPixel).toBe('http://tracking.com/pixel');
                    });
                });
            });

            describe('if a countPixel is specified', function() {
                beforeEach(function(done) {
                    c6.embeds.length = 0;
                    load(function() {
                        adtech.config.placements['108542'].complete();
                        waitForDeps(expIds.map(function(id) {
                            return baseUrl + '/api/public/content/experience/' + id + '.js?container=jsonp';
                        }), done);
                    }, '/base/src/cinema6-jsonp/cinema6-jsonp.js?callback=onC6AdLoad&id=108542&countPixel=http%3A%2F%2Ftracking.com%2Fpixel&cb=' + Date.now());
                });

                it('should set the startPixel on the config', function() {
                    expect(c6.embeds.length).toBe(expIds.length);
                    c6.embeds.forEach(function(embed) {
                        expect(embed.config.countPixel).toBe('http://tracking.com/pixel');
                    });
                });
            });

            describe('if a launchPixel is specified', function() {
                beforeEach(function(done) {
                    c6.embeds.length = 0;
                    load(function() {
                        adtech.config.placements['108542'].complete();
                        waitForDeps(expIds.map(function(id) {
                            return baseUrl + '/api/public/content/experience/' + id + '.js?container=jsonp';
                        }), done);
                    }, '/base/src/cinema6-jsonp/cinema6-jsonp.js?callback=onC6AdLoad&id=108542&launchPixel=http%3A%2F%2Ftracking.com%2Fpixel&cb=' + Date.now());
                });

                it('should set the startPixel on the config', function() {
                    expect(c6.embeds.length).toBe(expIds.length);
                    c6.embeds.forEach(function(embed) {
                        expect(embed.config.launchPixel).toBe('http://tracking.com/pixel');
                    });
                });
            });

            describe('after the experiences have been fetched', function() {
                var exps;

                beforeEach(function(done) {
                    waitForDeps(expIds.map(function(id) {
                        return baseUrl + '/api/public/content/experience/' + id + '.js?container=jsonp';
                    }), function(experiences) {
                        exps = experiences;

                        done();
                    });
                });

                it('should set up google analytics for the player', function() {
                    exps.forEach(function(experience) {
                        var embedTracker = experience.id.replace(/^e-/, '');

                        expect($window.__c6_ga__).toHaveBeenCalledWith('create', c6.gaAcctIdEmbed, {
                            name: embedTracker,
                            cookieName: '_c6ga'
                        });

                        expect($window.__c6_ga__).toHaveBeenCalledWith(embedTracker + '.require', 'displayfeatures');

                        expect($window.__c6_ga__).toHaveBeenCalledWith(embedTracker + '.set', {
                            page: '/embed/' + experience.id + '/?cx=jsonp&ct=jsonp&bd=digitaljournal',
                            title: experience.data.title,
                            dimension1: $window.location.href
                        });

                        expect($window.__c6_ga__).toHaveBeenCalledWith(embedTracker + '.send', 'pageview', {
                            sessionControl: 'start'
                        });
                    });
                });

                it('should callback the jsonp function with a result', function() {
                    expect($window.onC6AdLoad).toHaveBeenCalledWith({
                        params: {
                            callback: 'onC6AdLoad',
                            id: 108542,
                            count: 3,
                            cb: jasmine.any(Number),
                            src: 'jsonp'
                        },
                        items: jasmine.any($window.Array)
                    });

                    var result = $window.onC6AdLoad.calls.mostRecent().args[0];

                    exps.forEach(function(experience, index) {
                        var data = result.items[index];

                        expect(data.id).toBe(experience.id);
                        expect(data.title).toBe(experience.data.title);
                        expect(data.summary).toBe(experience.data.title);
                        expect(data.image).toBe(baseUrl + experience.data.collateral.splash);
                    });

                    expect(result.items[0].sponsor).toEqual({
                        name: exps[0].data.params.sponsor,
                        logo: exps[0].data.collateral.logo
                    });
                    expect(result.items[1].sponsor).toEqual({
                        name: exps[1].data.deck[2].params.sponsor,
                        logo: exps[1].data.deck[2].collateral.logo
                    });
                    expect(result.items[2].sponsor).toBeNull();
                    expect(result.items[2].sponsor).toBeNull();
                });

                it('should push configuration into the embeds array', function() {
                    exps.forEach(function(exp, index) {
                        var config = c6.embeds[index];

                        expect(config.load).toBe(false);
                        expect(config.preload).toBe(false);

                        expect(config.standalone).toBe(false);
                        expect(config.playerVersion).toBe(1);

                        expect(config.embed).toBe($('div#c6-lightbox-container')[0]);
                        expect(config.splashDelegate).toEqual({});
                        expect(config.experience).toBe(exp);

                        expect(config.trackingUrl).toBe('http://www.cinema6.com/track/' + exp.id + '.jpg');
                        expect(config.config).toEqual({
                            exp: exp.id,
                            title: exp.data.title,
                            container: 'jsonp',
                            hasSponsoredCards: true,
                            context: 'jsonp',
                            adId: undefined,
                            startPixel: undefined,
                            countPixel: undefined,
                            launchPixel: undefined,
                            preview: undefined
                        });
                    });
                });

                describe('if preview mode is set in the URL', function() {
                    beforeEach(function(done) {
                        c6.embeds.length = 0;
                        load(function() {
                            adtech.config.placements['108542'].complete();
                            waitForDeps(expIds.map(function(id) {
                                return baseUrl + '/api/public/content/experience/' + id + '.js?container=jsonp';
                            }), done);
                        }, '/base/src/cinema6-jsonp/cinema6-jsonp.js?callback=onC6AdLoad&id=108542&preview=true&playerVersion=4&cb=' + Date.now());
                    });

                    it('should set the preview attribute in the experiences\' config', function() {
                        exps.forEach(function(exp, index) {
                            expect(c6.embeds[index].config.preview).toBe('true');
                        });
                    });
                });

                describe('if the playerVersion is set in the URL', function() {
                    beforeEach(function(done) {
                        c6.embeds.length = 0;
                        load(function() {
                            adtech.config.placements['108542'].complete();
                            waitForDeps(expIds.map(function(id) {
                                return baseUrl + '/api/public/content/experience/' + id + '.js?container=jsonp';
                            }), done);
                        }, '/base/src/cinema6-jsonp/cinema6-jsonp.js?callback=onC6AdLoad&id=108542&playerVersion=4&cb=' + Date.now());
                    });

                    it('should set the playerVersion to the supplied version', function() {
                        c6.embeds.forEach(function(minireel) {
                            expect(minireel.playerVersion).toBe(4);
                        });
                    });
                });

                it('should give every experience the same branding', function() {
                    exps.forEach(function(experience) {
                        expect(experience.data.branding).toBe(exps[0].data.branding);
                    });
                });

                describe('if there is already stuff in the c6.embeds array', function() {
                    beforeEach(function(done) {
                        c6.embeds.length = 0;
                        c6.embeds.push({
                            experience: {
                                data: {
                                    branding: 'master'
                                }
                            }
                        });

                        load(function() {
                            adtech.config.placements['108542'].complete();
                            waitForDeps(expIds.map(function(id) {
                                return baseUrl + '/api/public/content/experience/' + id + '.js?container=veeseo';
                            }), function(experiences) {
                                exps = experiences;
                                done();
                            });
                        }, '/base/src/cinema6-jsonp/cinema6-jsonp.js?callback=onC6AdLoad&id=108542&src=veeseo&cb=' + Date.now());
                    });

                    it('should take the branding from the experience that was already there', function() {
                        exps.forEach(function(experience) {
                            expect(experience.data.branding).toBe('master');
                        });
                    });
                });

                it('should preload all of the experiences', function() {
                    expect(c6.embeds.length).toBeGreaterThan(0);

                    c6.embeds.forEach(function(embed) {
                        expect(c6.loadExperience).toHaveBeenCalledWith(embed, true);
                    });
                });
            });
        });
    });
});
