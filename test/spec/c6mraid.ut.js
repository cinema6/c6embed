var proxyquire = require('proxyquireify')(require);
var pagePathFor = require('../../src/ga_helpers').pagePath;

describe('[c6mraid(config)]', function() {
    'use strict';

    var c6mraid, q, Config, SponsoredCards, HostDocument, BrowserInfo, ObservableProvider;

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

        stubs = {
            '../app/app': app,
            '../../lib/importScripts': importScripts,
            '../../lib/iab': {
                MRAID: MRAID
            },
            'q': q,
            '../../lib/google_analytics': googleAnalytics,

            '@noCallThru': true
        };

        c6mraid = proxyquire('../../src/c6mraid/c6mraid', stubs);
    });

    beforeEach(function() {
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
            forceOrientation: 'none'
        }).then(success, failure);
    });

    afterEach(function() {
        delete window.mraid;
        delete window.c6;
        jasmine.clock().uninstall();
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
        expect(importScripts).toHaveBeenCalledWith(['https://staging.cinema6.com/api/public/content/experience/e-f75a93d62976aa.js?branding=some-pub&placementId=87654321&campaign=cam-9c9692e33a8e98&container=some-src&wildCardPlacement=12345678&preview=false&pageUrl=staging.cinema6.com'], jasmine.any(Function));
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
            delete window.__C6_URL_ROOT__;

            c6mraid({ exp: 'e-75d32a97a6193c' });
            importScripts.calls.mostRecent().args[1](experience);
            q.delay(1).then(done);
        });

        afterEach(function() {
            jasmine.clock().install();
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
                    launchPixel: ''
                })
            }), true);
        });

        it('should send no query params when fetching from the content service', function() {
            expect(importScripts).toHaveBeenCalledWith(['http://portal.cinema6.com/api/public/content/experience/e-75d32a97a6193c.js?branding=&placementId=&campaign=&container=&wildCardPlacement=&preview=&pageUrl=cinema6.com'], jasmine.any(Function));
        });

        it('should set window.__C6_URL_ROOT__ to point to cinema6 production', function() {
            expect(window.__C6_URL_ROOT__).toBe('http://portal.cinema6.com');
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
                    vr: 'my-variant'
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
                    q().then(function() {}).then(done);
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
