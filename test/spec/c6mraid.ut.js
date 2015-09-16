var proxyquire = require('proxyquireify')(require);
var pagePathFor = require('../../src/ga_helpers').pagePath;

describe('[c6mraid(config)]', function() {
    'use strict';

    var c6mraid, q, Config, SponsoredCards, HostDocument, BrowserInfo, ObservableProvider, logger, globalLogger;

    var app, importScripts, MRAID, googleAnalytics;
    var stubs;

    var mraid;
    var Observable;

    var loadExperienceDeferred;
    var loadExperienceSettings;

    var waitUntilViewableDeferred;
    var tracker;

    var success, failure;

    beforeAll(function() {
        q = require('q');
        Config = require('../../src/app/Config');
        SponsoredCards = require('../../src/app/SponsoredCards');
        HostDocument = require('../../src/app/HostDocument');
        BrowserInfo = require('../../lib/BrowserInfo');
        ObservableProvider = require('../../lib/ObservableProvider');
        globalLogger = require('../../lib/logger').default;

        Observable = new ObservableProvider({});

        MRAID = jasmine.createSpy('MRAID()').and.callFake(function(params) {
            var MRAID = require('../../lib/iab').MRAID;
            waitUntilViewableDeferred = q.defer();

            mraid = new MRAID(params);
            spyOn(mraid, 'waitUntilViewable').and.returnValue(waitUntilViewableDeferred.promise);
            spyOn(mraid, 'close');

            return mraid;
        });
        app = jasmine.createSpy('app()').and.callFake(function() {
            window.c6.loadExperience = jasmine.createSpy('c6.loadExperience()').and.callFake(function(settings) {
                loadExperienceDeferred = q.defer();
                loadExperienceSettings = settings;

                settings.state = new Observable({ active: false });
                spyOn(settings.state, 'get').and.callThrough();
                spyOn(settings.state, 'set').and.callThrough();

                return loadExperienceDeferred.promise;
            });
        });
        importScripts = jasmine.createSpy('importScripts()');
        importScripts.withConfig = function() { return importScripts; };
        googleAnalytics = jasmine.createSpy('googleAnalytics()').and.callFake(function(global, name) {
            return (tracker = jasmine.createSpy(name + '()'));
        });

        spyOn(require('../../lib/logger').default, 'context').and.callThrough();

        stubs = {
            '../app/app': app,
            '../../lib/importScripts': importScripts,
            '../../lib/iab': {
                MRAID: MRAID
            },
            'q': q,
            '../../lib/google_analytics': googleAnalytics,
            '../../lib/logger': require('../../lib/logger'),

            '@noCallThru': true
        };

        c6mraid = proxyquire('../../src/c6mraid/c6mraid', stubs);

        logger = require('../../lib/logger').default.context.calls.mostRecent().returnValue;
    });

    beforeEach(function() {
        globalLogger.enabled(false);
        app.calls.reset();
        importScripts.calls.reset();
        MRAID.calls.reset();
        googleAnalytics.calls.reset();

        jasmine.clock().install();
        jasmine.clock().mockDate();

        window.mraid = {
            addEventListener: function() {},
            removeEventListener: function() {},
            getState: jasmine.createSpy('mraid.getState()').and.returnValue('loading')
        };
        delete window.__C6_URL_ROOT__;

        success = jasmine.createSpy('success()');
        failure = jasmine.createSpy('failure()');

        spyOn(globalLogger, 'levels').and.callThrough();
        spyOn(globalLogger, 'prefix').and.callThrough();

        c6mraid({
            exp: 'e-f75a93d62976aa',
            src: 'some-src',
            playerVersion: 3,
            mobileMode: 'swipe',
            mode: 'full-np',
            startPixels: ['pixel1', 'pixel2'],
            countPixels: ['pixel3', 'pixel4'],
            launchPixels: ['pixel5', 'pixel6'],
            preview: false,
            ex: 'my-experiment',
            vr: 'my-variant',
            branding: 'some-pub',
            adPlacementId: '87654321',
            campaign: 'cam-9c9692e33a8e98',
            wp: '12345678',
            apiRoot: 'https://staging.cinema6.com',
            pageUrl: 'staging.cinema6.com',
            forceOrientation: 'none',
            debug: true,
            app: 'Talking Tom',
            network: 'omax'
        }).then(success, failure);
    });

    afterEach(function() {
        delete window.mraid;
        delete window.c6;
        jasmine.clock().uninstall();
    });

    describe('the send function it adds to the logger', function() {
        var fn;
        var img;

        function MockImage() {
            this.src = null;

            img = this;
        }

        beforeEach(function() {
            spyOn(window, 'Image').and.callFake(MockImage);
            fn = globalLogger.tasks.send[globalLogger.tasks.send.length - 1];

            fn(globalLogger, 'log', ['hello world', 'what\'s up?']);
        });

        it('should fire a pixel to the C6 Log endpoint', function() {
            expect(img.src).toBe('https://logging.cinema6.com/pixel.gif?v=hello%20world%2C%20what\'s%20up%3F&cb=' + Date.now());
        });
    });

    it('should decorate the logger with information about the app', function() {
        expect(globalLogger.meta.container).toBe('some-src');
        expect(globalLogger.meta.network).toBe('omax');
        expect(globalLogger.meta.app).toBe('Talking Tom');
    });

    it('should create a new MRAID instance', function() {
        expect(MRAID).toHaveBeenCalledWith({
            forceOrientation: 'none',
            useCustomClose: true
        });
    });

    it('should set window.__C6_URL_ROOT__', function() {
        expect(window.__C6_URL_ROOT__).toBe('https://staging.cinema6.com');
    });

    it('should fetch the experience from the content service', function() {
        expect(importScripts).toHaveBeenCalledWith(['https://staging.cinema6.com/api/public/content/experience/e-f75a93d62976aa.js?branding=some-pub&placementId=87654321&campaign=cam-9c9692e33a8e98&container=some-src&wildCardPlacement=12345678&preview=false&pageUrl=staging.cinema6.com&hostApp=Talking%20Tom&network=omax'], jasmine.any(Function));
    });

    it('should create a c6 object', function() {
        expect(window.c6).toEqual(jasmine.objectContaining({
            gaAcctIdPlayer: jasmine.stringMatching(/UA-44457821-3[1-5]/),
            gaAcctIdEmbed: jasmine.stringMatching(/UA-44457821-[1-3]?[0-9]/),
            embeds: []
        }));
    });

    it('should create the c6.loadExperience() method', function() {
        expect(app).toHaveBeenCalledWith(jasmine.objectContaining({
            window: window,
            frameFactory: jasmine.any(Function),
            $: jasmine.any(Function),
            Q: jasmine.any(Function),
            config: jasmine.any(Object), // Change
            c6Ajax: jasmine.any(Function),
            documentParser: jasmine.any(Function),
            browserInfo: jasmine.any(Object), // Change
            Player: jasmine.any(Function),
            spCardService: jasmine.any(Object), // Change
            hostDocument: jasmine.any(Object), // Change
            Observable: jasmine.any(Function)
        }));
    });

    it('should create a GA tracker for the player', function() {
        expect(googleAnalytics).toHaveBeenCalledWith('__c6_ga__', 'c6', window.c6.gaAcctIdPlayer, {
            storage: 'none',
            cookieDomain: 'none'
        });
    });

    it('should create a GA tracker for the embed', function() {
        expect(googleAnalytics).toHaveBeenCalledWith('__c6_ga__', 'f75a93d62976aa', window.c6.gaAcctIdEmbed, {
            storage: 'none',
            cookieDomain: 'none'
        });
        expect(tracker).toHaveBeenCalledWith('require', 'displayfeatures');
        expect(tracker).toHaveBeenCalledWith('set', {
            checkProtocolTask: null,
            dimension1: 'mraid',
            page: pagePathFor('e-f75a93d62976aa', {
                cx: 'mraid',
                ct: 'some-src',
                ex: 'my-experiment',
                vr: 'my-variant'
            })
        });
    });

    it('should send a pageview', function() {
        expect(tracker).toHaveBeenCalledWith('send', 'pageview', {
            sessionControl: 'start'
        });
    });

    [0, false].forEach(function(value) {
        describe('if called with debug: ' + value, function() {
            beforeEach(function() {
                globalLogger.levels.calls.reset();
                c6mraid({ exp: 'e-d83a40ac1437f5', debug: value });
            });

            it('should only enable error logging', function() {
                expect(globalLogger.levels).toHaveBeenCalledWith(['error']);
            });
        });
    });

    [1, true].forEach(function(value) {
        describe('if called with debug: ' + value, function() {
            beforeEach(function() {
                globalLogger.levels.calls.reset();
                c6mraid({ exp: 'e-d83a40ac1437f5', debug: value });
            });

            it('should enable everything but log-level logging', function() {
                expect(globalLogger.levels).toHaveBeenCalledWith(['error', 'info', 'warn']);
            });
        });
    });

    [2].forEach(function(value) {
        describe('if called with debug: ' + value, function() {
            beforeEach(function() {
                globalLogger.levels.calls.reset();
                c6mraid({ exp: 'e-d83a40ac1437f5', debug: value });
            });

            it('should enable all log levels', function() {
                expect(globalLogger.levels).toHaveBeenCalledWith(['error', 'info', 'warn', 'log']);
            });
        });
    });

    describe('if called with minimal configuration', function() {
        var experience;

        beforeEach(function(done) {
            jasmine.clock().uninstall();

            experience = {
                id: 'e-75d32a97a6193c',
                data: {
                    title: 'Some MiniReel',
                    deck: [
                        {
                            id: 'rc-718ba68784dc63',
                            title: 'My Card',
                            data: {}
                        }
                    ]
                }
            };
            importScripts.calls.reset();
            MRAID.calls.reset();
            globalLogger.levels.calls.reset();
            globalLogger.prefix.calls.reset();
            delete window.__C6_URL_ROOT__;

            c6mraid({ exp: 'e-75d32a97a6193c' });
            importScripts.calls.mostRecent().args[1](experience);
            q.delay(1).then(done);
        });

        afterEach(function() {
            jasmine.clock().install();
        });

        it('should not give the logger a prefix', function() {
            expect(globalLogger.prefix()).toBe('');
        });

        it('should create a portrait MRAID instance', function() {
            expect(MRAID).toHaveBeenCalledWith(jasmine.objectContaining({ forceOrientation: 'portrait' }));
        });

        it('should call c6.loadExperience() with some default configuration', function() {
            expect(window.c6.loadExperience).toHaveBeenCalledWith(jasmine.objectContaining({
                playerVersion: 1,

                config: jasmine.objectContaining({
                    startPixel: '',
                    countPixel: '',
                    launchPixel: '',
                    pageUrl: 'cinema6.com'
                })
            }), true);
        });

        it('should send no query params when fetching from the content service', function() {
            expect(importScripts).toHaveBeenCalledWith(['http://portal.cinema6.com/api/public/content/experience/e-75d32a97a6193c.js?branding=&placementId=&campaign=&container=&wildCardPlacement=&preview=&pageUrl=cinema6.com&hostApp=&network='], jasmine.any(Function));
        });

        it('should set window.__C6_URL_ROOT__ to point to cinema6 production', function() {
            expect(window.__C6_URL_ROOT__).toBe('http://portal.cinema6.com');
        });
    });

    describe('if there is an mraid error', function() {
        var message, action;

        beforeEach(function() {
            spyOn(logger, 'error').and.callThrough();

            message = 'There was an awful problem.';
            action = 'Doing something that should work...';

            mraid.emit('error', message, action);
        });

        it('should log an error', function() {
            expect(logger.error).toHaveBeenCalledWith('MRAID Error:', message, action);
        });
    });

    describe('when the ad is visible', function() {
        beforeEach(function(done) {
            waitUntilViewableDeferred.resolve(true);
            waitUntilViewableDeferred.promise.then(done, done);
        });

        it('should send a visible event to GA', function() {
            expect(tracker).toHaveBeenCalledWith('send', 'event', {
                eventCategory: 'Display',
                eventAction: 'Visible'
            });
        });

        ['default', 'expanded', 'resized', 'hidden'].forEach(function(state) {
            describe('when the state changes to ' + state, function() {
                beforeEach(function() {
                    jasmine.clock().tick(10234);
                });

                describe('before the player has loaded', function() {
                    beforeEach(function() {
                        tracker.calls.reset();
                        mraid.emit('stateChange', state);
                    });

                    if (state === 'hidden') {
                        it('should send a closeBeforeShow timing to GA', function() {
                            expect(tracker).toHaveBeenCalledWith('send', 'timing', {
                                timingCategory: 'API',
                                timingVar: 'closePageBeforeLoad',
                                timingValue: 10234,
                                timingLabel: 'c6'
                            });
                        });
                    } else {
                        it('should send nothing to GA', function() {
                            expect(tracker).not.toHaveBeenCalled();
                        });
                    }
                });

                describe('after the player has loaded', function() {
                    beforeEach(function(done) {
                        importScripts.calls.mostRecent().args[1]({
                            id: 'e-f75a93d62976aa',
                            data: {
                                branding: 'cool-pub',
                                title: 'My Awesome MiniReel',
                                deck: [
                                    {
                                        id: 'rc-718ba68784dc63',
                                        title: 'My Card',
                                        data: {}
                                    }
                                ]
                            }
                        });
                        q().then(function() {}).then(function() {
                            loadExperienceDeferred.resolve(window.c6.loadExperience.calls.mostRecent().args[0]);
                            return loadExperienceDeferred.promise.then(function() {});
                        }).then(function() {
                            tracker.calls.reset();
                            loadExperienceSettings.state.set('active', false);
                            mraid.emit('stateChange', state);
                        }).then(done, done);
                    });

                    if (state === 'hidden') {
                        it('should send a closePageAfterLoad timing to GA', function() {
                            expect(tracker).toHaveBeenCalledWith('send', 'timing', {
                                timingCategory: 'API',
                                timingVar: 'closePageAfterLoad',
                                timingValue: 10234,
                                timingLabel: 'c6'
                            });
                        });
                    } else {
                        it('should send nothing to GA', function() {
                            expect(tracker).not.toHaveBeenCalled();
                        });
                    }
                });
            });
        });
    });

    describe('when the experience is fetched', function() {
        var experience;

        beforeEach(function(done) {
            experience = {
                id: 'e-f75a93d62976aa',
                data: {
                    branding: 'cool-pub',
                    title: 'My Awesome MiniReel',
                    deck: [
                        {
                            id: 'rc-718ba68784dc63',
                            title: 'My Card',
                            data: {}
                        }
                    ]
                }
            };

            jasmine.clock().tick(346);
            importScripts.calls.mostRecent().args[1](experience);
            q().then(function() {}).then(done);
        });

        it('should set the title in ga', function() {
            expect(tracker).toHaveBeenCalledWith('set', { title: experience.data.title });
        });

        it('should send the amount of time it took to fetch the experience', function() {
            expect(tracker).toHaveBeenCalledWith('send', 'timing', {
                timingCategory: 'API',
                timingVar: 'fetchExperience',
                timingValue: 346,
                timingLabel: 'c6'
            });
        });

        it('should disable video preloading on the first video in the MR', function() {
            expect(experience.data.deck[0].data.preload).toBe(false);
        });

        it('should call c6.loadExperience(minireel, true)', function() {
            expect(window.c6.loadExperience).toHaveBeenCalledWith(jasmine.objectContaining({
                load: true,
                preload: true,

                standalone: false,
                interstitial: true,
                playerVersion: 3,
                mobileMode: 'swipe',
                mode: 'full-np',

                embed: document.body,
                splashDelegate: {},
                experience: experience,

                config: {
                    exp: experience.id,
                    title: experience.data.title,
                    startPixel: 'pixel1 pixel2',
                    countPixel: 'pixel3 pixel4',
                    launchPixel: 'pixel5 pixel6',
                    container: 'some-src',
                    context: 'mraid',
                    preview: false,
                    ex: 'my-experiment',
                    vr: 'my-variant',
                    hostApp: 'Talking Tom',
                    network: 'omax',
                    pageUrl: 'staging.cinema6.com'
                }
            }), true);
        });

        it('should not fulfill the promise', function() {
            expect(success).not.toHaveBeenCalled();
        });

        describe('when the ad is visible', function() {
            beforeEach(function(done) {
                waitUntilViewableDeferred.resolve(true);
                q().then(function() {}).then(done);
            });

            it('should not activate the player', function() {
                expect(loadExperienceSettings.state.set).not.toHaveBeenCalledWith('active', true);
            });
        });

        describe('when the player is preloaded', function() {
            beforeEach(function(done) {
                loadExperienceDeferred.resolve(window.c6.loadExperience.calls.mostRecent().args[0]);
                q().then(function() {}).then(done);
            });

            it('should not activate the player', function() {
                expect(loadExperienceSettings.state.set).not.toHaveBeenCalledWith('active', true);
            });
        });

        describe('when loading the player happens after MRAID is ready to show it', function() {
            beforeEach(function(done) {
                waitUntilViewableDeferred.resolve(true);
                waitUntilViewableDeferred.promise.then(function() {
                    jasmine.clock().tick(600);
                }).then(function() {
                    jasmine.clock().tick(321);
                    loadExperienceDeferred.resolve(window.c6.loadExperience.calls.mostRecent().args[0]);
                }).then(function() {}).then(function() {}).then(done, done);
            });

            it('should send the amount of time the user was waiting', function() {
                expect(tracker).toHaveBeenCalledWith('send', 'timing', {
                    timingCategory: 'API',
                    timingVar: 'loadDelay',
                    timingValue: 321,
                    timingLabel: 'c6'
                });
            });
        });

        describe('when the player is preloaded and the ad is visible', function() {
            beforeEach(function(done) {
                loadExperienceDeferred.resolve(window.c6.loadExperience.calls.mostRecent().args[0]);
                waitUntilViewableDeferred.resolve(true);

                q().then(function() {}).then(done);
            });

            it('should not activate the player', function() {
                expect(loadExperienceSettings.state.set).not.toHaveBeenCalledWith('active', true);
            });

            describe('after 600 ms', function() {
                beforeEach(function(done) {
                    jasmine.clock().tick(600);
                    q().then(function() {}).then(function() {}).then(done);
                });

                it('should activate the player', function() {
                    expect(loadExperienceSettings.state.set).toHaveBeenCalledWith('active', true);
                });

                describe('if the player closes', function() {
                    beforeEach(function() {
                        expect(mraid.close).not.toHaveBeenCalled();

                        loadExperienceSettings.state.set('active', false);
                    });

                    it('should close the ad', function() {
                        expect(mraid.close).toHaveBeenCalled();
                    });
                });

                ['loading', 'expanded', 'resized', 'default'].forEach(function(state) {
                    describe('if the ad state changes to ' + state, function() {
                        beforeEach(function() {
                            mraid.emit('stateChange', state);
                        });

                        it('should do nothing', function() {
                            expect(loadExperienceSettings.state.set).not.toHaveBeenCalledWith('active', false);
                        });
                    });
                });

                ['hidden'].forEach(function(state) {
                    describe('if the ad state changes to ' + state, function() {
                        beforeEach(function() {
                            mraid.emit('stateChange', state);
                        });

                        it('should close the player', function() {
                            expect(loadExperienceSettings.state.set).toHaveBeenCalledWith('active', false);
                        });
                    });
                });
            });
        });
    });
});
