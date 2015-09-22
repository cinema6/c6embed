(function() {
    'use strict';

    describe('app', function() {
        var app;

        var C6Query,
            ObservableProvider;

        var $,
            Observable,
            Q,
            AsEvented;

        var $window,
            frameFactory,
            c6Ajax,
            config,
            mockDocumentParser,
            browserInfo,
            spCardService,
            hostDocument;

        var $iframe,
            experience,
            indexHTML,
            indexHTML2,
            parsedDoc,
            session,
            safeSession,
            player;

        function Session() {
            AsEvented.call(this);
            this.window = {};
        }
        Session.prototype = {
            ping: jasmine.createSpy('session.ping()')
        };

        var Player = jasmine.createSpy('Player()').and.callFake(function() {
            this.session = session = new Session();
            safeSession = new Session();
            safeSession.window.c6 = {
                html5Videos: []
            };

            this.getReadySession = jasmine.createSpy('player.getReadySession()').and.returnValue(Q.when(safeSession));
            this.bootstrap = jasmine.createSpy('player.bootstrap()').and.returnValue(this);

            player = this;
        });

        function run() {
            return app({
                window: $window,
                frameFactory: frameFactory,
                $: $,
                Q: Q,
                config: config,
                c6Ajax: c6Ajax,
                documentParser: mockDocumentParser,
                browserInfo: browserInfo,
                spCardService: spCardService,
                Player: Player,
                hostDocument: hostDocument,
                Observable: Observable
            });
        }

        beforeEach(function() {
            var DocumentParser = require('../../src/app/DocumentParser'),
                documentParser = new DocumentParser();

            indexHTML = require('../helpers/mock_index.js');
            indexHTML2 = require('../helpers/mock_index--2.0.js');

            experience = {
                appUri: 'rumble',
                data: {
                    mode: 'lightbox-ads',
                    campaign: {
                        data: 'foo'
                    },
                    deck: [
                        { id: 'rc-1', type: 'youtube' },
                        { id: 'rc-2', type: 'wildcard' },
                        { id: 'rc-3', type: 'vimeo' },
                        { id: 'rc-4', type: 'wildcard' }
                    ]
                }
            };

            $window = {
                c6: {
                    loadExperience: function() {},
                    embeds: []
                },
                __c6_ga__: jasmine.createSpy('window.__c6_ga__')
            };


            config = {
                debug: true,
                urlRoot: 'http://test.cinema6.com',
                appBase: 'http://test.cinema6.com/apps'
            };

            Q = require('../../node_modules/q/q');
            AsEvented = require('../../node_modules/asEvented/asevented.js');

            C6Query = require('../../lib/C6Query');
            $ = new C6Query({ document: document, window: window });

            ObservableProvider = require('../../lib/ObservableProvider');
            Observable = new ObservableProvider();

            frameFactory = function() {
                $iframe = $('<iframe src="about:blank"></iframe>');

                $iframe.load = jasmine.createSpy('$iframe.load()').and.callFake(function(html, onReady) {
                    return Q.when(onReady($iframe.prop('contentWindow')));
                });
                $iframe.fullscreen = jasmine.createSpy('$iframe.fullscreen()');
                $iframe.show = jasmine.createSpy('$iframe.show()');
                $iframe.hide = jasmine.createSpy('$iframe.hide()');

                return $iframe;
            };

            c6Ajax = jasmine.createSpy('c6Ajax()');
            c6Ajax.get = jasmine.createSpy('c6Ajax.get()');

            mockDocumentParser = jasmine.createSpy('documentParser()')
                .and.callFake(function() {
                    parsedDoc = documentParser.apply(null, arguments);
                    spyOn(parsedDoc, 'setGlobalObject').and.callThrough();
                    spyOn(parsedDoc, 'setBase').and.callThrough();

                    return parsedDoc;
                });

            browserInfo = {
                profile: {
                    device: 'desktop'
                }
            };

            spCardService = {
                fetchSponsoredCards: jasmine.createSpy('spCardService.fetchSponsoredCards()')
                    .and.callFake(function(experience) {
                        experience.loadedCards = true;
                        return Q();
                    })
            };

            hostDocument = {
                shrink: jasmine.createSpy('hostDocument.shrink()'),
                putInRootStackingContext: jasmine.createSpy('hostDocument.putInRootStackingContext()'),
                reset: jasmine.createSpy('hostDocument.reset()')
            };

            app = require('../../src/app/app');
        });

        it('should exist', function() {
            expect(app).toEqual(jasmine.any(Function));
        });

        it('should return a promise', function() {
            var Promise = Q.when().constructor;

            expect(run()).toEqual(jasmine.any(Promise));
        });

        it('should replace the c6.loadExperience method', function() {
            var c6 = $window.c6,
                loadExperience = c6.loadExperience;

            run();

            expect($window.c6).toBe(c6);
            expect($window.c6.loadExperience).toEqual(jasmine.any(Function));
            expect($window.c6.loadExperience).not.toBe(loadExperience);
        });

        describe('on the first run', function() {
            var c6,
                embed1, embed2;

            beforeEach(function(done) {
                c6Ajax.get.and.returnValue(Q.when({
                    data: indexHTML
                }));

                embed1 = $('<div><div></div></div>')[0];
                embed2 = $('<div><div></div></div>')[0];

                c6 = $window.c6;

                c6.embeds = [
                    {
                        load: false,
                        preload: false,
                        splashDelegate: {}
                    },
                    {
                        load: false,
                        preload: false,
                        splashDelegate: {}
                    },
                    {
                        load: true,
                        preload: false,
                        embed: embed1,
                        config: {
                            exp: 'e-456'
                        },
                        experience: experience,
                        splashDelegate: {}
                    },
                    {
                        load: true,
                        preload: true,
                        embed: embed2,
                        config: {
                            exp: 'e-456'
                        },
                        experience: experience,
                        splashDelegate: {}
                    },
                    {
                        load: false,
                        preload: false,
                        splashDelegate: {}
                    }
                ];

                [embed1, embed2].forEach(function(embed) {
                    $('body').append(embed);
                });

                run().finally(done);
            });

            afterEach(function() {
                [embed1, embed2].forEach(function(embed) {
                    $(embed).remove();
                });
            });

            it('should load all the embeds where load is true', function() {
                c6.embeds.forEach(function(settings, index) {
                    if (settings.load) {
                        expect(settings.state).toEqual(jasmine.any(Observable), index);
                    } else {
                        expect(settings.state).not.toBeDefined(index);
                    }
                });
            });

            it('should preload all the embeds where preload is true', function() {
                c6.embeds.forEach(function(settings) {
                    if (settings.load) {
                        if (settings.preload) {
                            expect(settings.state.get('active')).toBe(false);
                        } else {
                            expect(settings.state.get('active')).toBe(true);
                        }
                    }
                });
            });

            describe('autoLaunch', function() {
                var settings;

                beforeEach(function() {
                    settings = {
                        load: false,
                        preload: false,
                        config: {
                            exp: 'e-456'
                        },
                        experience: experience,
                        splashDelegate: {},
                        embed: embed1
                    };

                    c6.embeds = [settings];
                });

                describe('if true', function() {
                    beforeEach(function() {
                        settings.autoLaunch = true;
                        settings.load = true;
                    });

                    ['phone', 'tablet'].forEach(function(device) {
                        describe('if the device is a ' + device, function() {
                            beforeEach(function(done) {
                                browserInfo.profile.device = device;

                                run().finally(done);
                            });

                            it('should preload the player', function() {
                                expect(settings.state.get('active')).toBe(false);
                            });

                            describe('when c6.loadExperience() is called', function() {
                                beforeEach(function(done) {
                                    c6.loadExperience(settings, false).finally(done);
                                });

                                it('should launch the player', function() {
                                    expect(settings.state.get('active')).toBe(true);
                                });
                            });
                        });
                    });

                    ['desktop', 'netbook'].forEach(function(device) {
                        describe('if the device is a ' + device, function() {
                            beforeEach(function(done) {
                                browserInfo.profile.device = device;

                                run().finally(done);
                            });

                            it('should launch the player', function() {
                                expect(settings.state.get('active')).toBe(true);
                            });

                            describe('if preload is true', function() {
                                beforeEach(function(done) {
                                    settings = {
                                        load: true,
                                        preload: true,
                                        autoLaunch: true,
                                        config: {
                                            exp: 'e-456'
                                        },
                                        experience: experience,
                                        splashDelegate: {},
                                        embed: embed1
                                    };

                                    c6.embeds = [settings];

                                    run().finally(done);
                                });

                                it('should still launch the player', function() {
                                    expect(settings.state.get('active')).toBe(true);
                                });
                            });
                        });
                    });
                });
            });
        });

        describe('c6.loadExperience(settings, preload)', function() {
            var settings,
                $embed,
                promise,
                success;

            beforeEach(function(done) {
                success = jasmine.createSpy('success()');

                c6Ajax.get.and.callFake(Q.when({
                    data: indexHTML
                }));

                c6Ajax.get.and.callFake(function(path) {
                    switch (path) {
                    case config.appBase + '/' + experience.appUri + '/lightbox-ads.html':
                        return Q.when({
                            data: indexHTML
                        });
                    case config.appBase + '/mini-reel-player/index.html':
                        return Q.when({
                            data: indexHTML2
                        });
                    default:
                        return Q.reject('404 NOT FOUND!');
                    }
                });

                settings = {
                    embed: $('<div style="padding: 10px; margin-top: 10px;"><div></div></div>')[0],
                    standalone: true,
                    interstitial: true,
                    load: true,
                    experience: experience,
                    mobileMode: undefined,
                    mode: undefined,
                    splashDelegate: {
                        didShow: jasmine.createSpy('splashDelegate.didShow()'),
                        didHide: jasmine.createSpy('splashDelegate.didHide()')
                    },
                    config: {
                        exp: 'e-68cde3e4177b8a',
                        showStartTime : 1,
                        context: 'embed',
                        responsive: true
                    }
                };

                $embed = $(settings.embed);
                $('body').append($embed);

                run();

                promise = $window.c6.loadExperience(settings);

                promise
                    .then(success)
                    .finally(done);
            });

            afterEach(function() {
                $embed.remove();
            });

            describe('if there appDefines', function() {
                var videos;

                beforeEach(function(done) {
                    videos = [1, 2, 3].map(function(number) {
                        return jasmine.createSpyObj('video' + number, ['load']);
                    });

                    settings.appDefines = {
                        html5Videos: videos
                    };

                    $window.c6.loadExperience(settings).finally(done);
                });

                it('should load each video', function() {
                    videos.forEach(function(video) {
                        expect(video.load).toHaveBeenCalled();
                    });
                });
            });

            it('should send an event to GA', function() {
                expect($window.__c6_ga__).toHaveBeenCalledWith('68cde3e4177b8a.send', 'event', {
                    'eventCategory' : 'Bootstrap',
                    'eventAction'   : 'LoadExperience'
                });
            });

            it('should add an observeable state object to the settings', function() {
                expect(settings.state).toEqual(jasmine.any(Observable));
                expect(settings.state).toEqual(jasmine.objectContaining({
                    responsiveStyles: null,
                    active: jasmine.any(Boolean)
                }));
            });

            it('should add a default adServer to experience', function(){
                expect(experience.data.adServer).toEqual({
                    network : '5473.1',
                    server : 'adserver.adtechus.com'
                });
            });
            
            describe('if __C6_AD_... is set use it as default', function() {
                beforeEach(function(done) {
                    delete settings.promise;
                    delete experience.data.adServer;

                    $window.__C6_AD_NETWORK__ = '1111.1';
                    $window.__C6_AD_SERVER__  = 'somehost.com';
                    $window.c6.loadExperience(settings).finally(done);
                });
                
                it('should add a default adServer to experience', function(){
                    expect(experience.data.adServer).toEqual({
                        network : '1111.1',
                        server : 'somehost.com'
                    });
                });
            });

            describe('if experience has adServer use it', function() {
                beforeEach(function(done) {
                    delete settings.promise;
                    experience.data.adServer = {
                        network : 'hbo',
                        server  : 'big'
                    };

                    $window.c6.loadExperience(settings).finally(done);
                });
                
                it('should add a default adServer to experience', function(){
                    expect(experience.data.adServer).toEqual({
                        network : 'hbo',
                        server : 'big'
                    });
                });
            });

            it('should put the iframe in the embed container', function() {
                expect(settings.embed.childNodes[1]).toBe($iframe[0]);
            });

            it('should make the container untouchable', function() {
                expect($(settings.embed).hasClass('c6__cant-touch-this')).toBe(true);
            });

            it('should fetch index.html', function() {
                expect(c6Ajax.get).toHaveBeenCalledWith(config.appBase + '/' + experience.appUri + '/lightbox-ads.html');
            });

            it('should measure the amount of time it takes to fetch the player\'s HTML', function(done) {
                var response = { data: indexHTML2 };
                var responseDeferred = Q.defer();
                c6Ajax.get.and.returnValue(responseDeferred.promise);
                delete settings.promise;
                $window.c6.loadExperience(settings);

                Q.delay(50)
                    .then(function() {
                        responseDeferred.resolve(response);
                        return responseDeferred.promise;
                    })
                    .then(function() {
                        return Q.delay(5);
                    })
                    .then(function() {
                        expect($window.__c6_ga__).toHaveBeenCalledWith('68cde3e4177b8a.send', 'timing', {
                            timingCategory: 'API',
                            timingVar: 'fetchPlayer',
                            timingValue: jasmine.any(Number)
                        });
                    })
                    .finally(done);
            });

            describe('if a profile is provided in the settings', function() {
                beforeEach(function(done) {
                    settings.profile = {
                        device: 'phone',
                        flash: false
                    };
                    browserInfo.profile.device = 'desktop';
                    settings.experience.data.mode = 'lightbox-playlist';
                    settings.experience.appUri = 'mini-reel-player';

                    delete settings.promise;
                    c6Ajax.get.calls.reset();
                    mockDocumentParser.calls.reset();
                    hostDocument.shrink.calls.reset();

                    $window.c6.loadExperience(settings).finally(done);
                });

                it('should set the mode based on the provided profile', function() {
                    expect(mockDocumentParser).toHaveBeenCalledWith(jasmine.any(String), { mode: 'mobile' });
                });

                it('should include the profile as app data', function() {
                    expect(player.bootstrap).toHaveBeenCalledWith(jasmine.objectContaining({
                        profile: settings.profile
                    }));
                });

                it('should use the provided profile when entering fullscreen mode', function() {
                    session.emit('fullscreenMode', true);
                    expect(hostDocument.shrink).toHaveBeenCalled();
                });
            });

            describe('if playerVersion is 2', function() {
                beforeEach(function(done) {
                    settings.playerVersion = 2;

                    delete settings.promise;
                    settings.experience.data.mode = 'lightbox-playlist';
                    browserInfo.profile.device = 'phone';
                    c6Ajax.get.calls.reset();

                    $window.c6.loadExperience(settings).finally(done);
                });

                it('should fetch player 2.0', function() {
                    expect(c6Ajax.get).toHaveBeenCalledWith(config.appBase + '/mini-reel-player/index.html');
                });

                [].forEach(function(mode) {
                    describe('if the mode is ' + mode, function() {
                        beforeEach(function(done) {
                            settings.experience.data.mode = mode;

                            delete settings.promise;
                            browserInfo.profile.device = 'desktop';
                            c6Ajax.get.calls.reset();

                            $window.c6.loadExperience(settings).finally(done);
                        });

                        it('should load player 1.0', function() {
                            expect(c6Ajax.get).toHaveBeenCalledWith(config.appBase + '/' + experience.appUri + '/' + mode + '.html');
                        });
                    });
                });

                ['full', 'mobile', 'lightbox', 'lightbox-playlist', 'light', 'solo', 'solo-ads'].forEach(function(mode) {
                    describe('if the mode is ' + mode, function() {
                        beforeEach(function(done) {
                            settings.experience.data.mode = mode;

                            delete settings.promise;
                            browserInfo.profile.device = 'desktop';
                            c6Ajax.get.calls.reset();

                            $window.c6.loadExperience(settings).finally(done);
                        });

                        it('should load player 2.0', function() {
                            expect(c6Ajax.get).toHaveBeenCalledWith(config.appBase + '/mini-reel-player/index.html');
                        });
                    });
                });
            });

            describe('if the appUri is "mini-reel-player"', function() {
                beforeEach(function(done) {
                    settings.playerVersion = 1;

                    delete settings.promise;
                    settings.experience.appUri = 'mini-reel-player';
                    c6Ajax.get.calls.reset();

                    $window.c6.loadExperience(settings).finally(done);
                });

                it('should load player 2.0', function() {
                    expect(c6Ajax.get).toHaveBeenCalledWith(config.appBase + '/mini-reel-player/index.html');
                });
            });

            it('should trim out empty wildcard placeholders', function() {
                expect(settings.experience.data.deck).toEqual([
                    { id: 'rc-1', type: 'youtube' },
                    { id: 'rc-3', type: 'vimeo' }
                ]);
            });

            it('should fetch the sponsoredCards', function() {
                expect(spCardService.fetchSponsoredCards).toHaveBeenCalledWith(experience, settings.config, {
                    playUrls: undefined,
                    countUrls: undefined
                });
            });

            describe('if the config has a startPixel and countPixel', function() {
                beforeEach(function(done) {
                    delete settings.promise;
                    settings.config.startPixel = 'http://my.com/pixel1 http://your.com/pixel2';
                    settings.config.countPixel = 'http://my.com/pixel3 http://your.com/pixel4';
                    spCardService.fetchSponsoredCards.calls.reset();
                    $window.c6.loadExperience(settings).finally(done);
                });

                it('should fetch the sponosred cards with the additional pixels', function() {
                    expect(spCardService.fetchSponsoredCards).toHaveBeenCalledWith(experience, settings.config, {
                        playUrls: settings.config.startPixel.split(' '),
                        countUrls: settings.config.countPixel.split(' ')
                    });
                });
            });

            describe('if the config has a launchPixel', function() {
                beforeEach(function() {
                    delete settings.promise;
                    settings.config.launchPixel = 'http://my.com/pixel1 http://your.com/pixel2';
                });

                describe('if the minireel has a campaign', function() {
                    var campaign;

                    beforeEach(function(done) {
                        campaign = experience.data.campaign = {};
                        $window.c6.loadExperience(settings).finally(done);
                    });

                    it('should give the campaign launchUrls', function() {
                        expect(campaign.launchUrls).toEqual(settings.config.launchPixel.split(' '));
                    });

                    describe('if the campaign already has launchPixels', function() {
                        beforeEach(function(done) {
                            delete settings.promise;
                            campaign.launchUrls = ['http://my.com/mother-pixel'];

                            $window.c6.loadExperience(settings).finally(done);
                        });

                        it('should use all the pixels', function() {
                            expect(campaign.launchUrls).toEqual(['http://my.com/mother-pixel'].concat(settings.config.launchPixel.split(' ')));
                        });
                    });
                });

                describe('if the minireel has no campaign', function() {
                    beforeEach(function(done) {
                        delete experience.data.campaign;
                        $window.c6.loadExperience(settings).finally(done);
                    });

                    it('should create one for it', function() {
                        expect(experience.data.campaign).toEqual({
                            launchUrls: settings.config.launchPixel.split(' ')
                        });
                    });
                });
            });

            describe('if mode is set', function() {
                beforeEach(function(done) {
                    delete settings.promise;
                    mockDocumentParser.calls.reset();
                    c6Ajax.get.calls.reset();
                    c6Ajax.get.and.returnValue(Q.when({
                        data: indexHTML
                    }));

                    settings.mode = 'fullnp';

                    $window.c6.loadExperience(settings).finally(done);
                });

                it('should load the player for that mode', function() {
                    expect(mockDocumentParser).toHaveBeenCalledWith(jasmine.any(String), { mode: 'fullnp' });
                });
            });

            describe('if the device is a phone', function() {
                beforeEach(function(done) {
                    delete settings.promise;
                    mockDocumentParser.calls.reset();
                    c6Ajax.get.calls.reset();
                    c6Ajax.get.and.returnValue(Q.when({
                        data: indexHTML
                    }));

                    browserInfo.profile.device = 'phone';

                    $window.c6.loadExperience(settings).finally(done);
                });

                it('should load the mobile version', function() {
                    expect(c6Ajax.get).toHaveBeenCalledWith(config.appBase + '/' + experience.appUri + '/mobile.html');
                });

                it('should provide the mobile mode to the document', function() {
                    expect(mockDocumentParser).toHaveBeenCalledWith(jasmine.any(String), { mode: 'mobile' });
                });

                describe('if mobileMode is set', function() {
                    beforeEach(function(done) {
                        mockDocumentParser.calls.reset();
                        delete settings.promise;
                        settings.mobileMode = 'swipe';

                        $window.c6.loadExperience(settings).finally(done);
                    });

                    it('should use that mode', function() {
                        expect(mockDocumentParser).toHaveBeenCalledWith(jasmine.any(String), { mode: 'swipe' });
                    });
                });
            });

            it('should parse the document', function() {
                expect(mockDocumentParser).toHaveBeenCalledWith(indexHTML, { mode: 'lightbox-ads' });
            });

            describe('if the ajax reqest has no data', function() {
                var spy;

                beforeEach(function(done) {
                    spy = jasmine.createSpy('spy()');

                    c6Ajax.get.and.returnValue(Q.when({
                        status: 304,
                        data: ''
                    }));

                    delete settings.promise;
                    $window.c6.loadExperience(settings).catch(spy).finally(done);
                });

                it('should reject the chain with an error', function() {
                    expect(spy).toHaveBeenCalledWith(new Error('Unexpected response for MR App request: ' + JSON.stringify({ status: 304, data: '' })));
                });
            });

            it('should resolve to the settings object', function() {
                expect(player.getReadySession).toHaveBeenCalled();
                expect(success).toHaveBeenCalledWith(settings);
            });

            it('should set put a reference to the promise on the settings object', function() {
                expect(settings.promise).toBe(promise);
            });

            it('should just return the same promise if called again', function() {
                expect($window.c6.loadExperience(settings)).toBe(promise);
            });

            describe('when the app is loaded', function() {
                beforeEach(function(done) {
                    spyOn(settings.state, 'set').and.callThrough();

                    $window.c6.loadExperience(settings).finally(done);
                });

                it('should set active to true', function() {
                    expect(settings.state.set).toHaveBeenCalledWith('active', true);
                });

                describe('if preload is true', function() {
                    beforeEach(function(done) {
                        settings.state.set.calls.reset();

                        $window.c6.loadExperience(settings, true).finally(done);
                    });

                    it('should not set active to true', function() {
                        expect(settings.state.set).not.toHaveBeenCalledWith('active', jasmine.any(Boolean));
                    });
                });
            });

            it('should setup a global c6 object in the app', function() {
                expect(parsedDoc.setGlobalObject).toHaveBeenCalledWith('c6', {
                    kDebug: config.debug,
                    kMode: experience.data.mode,
                    kDevice: browserInfo.profile.device,
                    kEnvUrlRoot: config.urlRoot
                });
            });

            it('should set the base to be the app\'s folder', function() {
                expect(parsedDoc.setBase).toHaveBeenCalledWith(config.appBase + '/' + experience.appUri + '/');
            });

            it('should load the application', function() {
                expect($iframe.load).toHaveBeenCalledWith(parsedDoc.toString(), jasmine.any(Function));
            });

            describe('state observation', function() {
                var state;

                beforeEach(function() {
                    state = settings.state;
                    spyOn(settings, 'getPlayer').and.returnValue(Q.when(player));
                    spyOn(state, 'observe').and.callThrough();
                });

                describe('active', function() {
                    describe('when false', function() {
                        beforeEach(function(done) {
                            state.set('active', true);
                            $iframe.hide.calls.reset();
                            settings.splashDelegate.didShow.calls.reset();
                            player.getReadySession.calls.reset();
                            state.set('responsiveStyles', {
                                padding: '20px',
                                marginTop: '50px'
                            });
                            $window.__c6_ga__.calls.reset();

                            state.set('active', false);
                            setTimeout(done, 20);
                        });

                        it('should hide the iframe', function() {
                            expect($iframe.hide).toHaveBeenCalled();
                        });

                        it('should not pay attetion to responsiveStyles', function() {
                            state.set('responsiveStyles', { top: '20px' });

                            expect(settings.embed.style.top).toBe('');
                        });

                        it('should post a nice message to the splash page', function() {
                            expect(settings.splashDelegate.didShow).toHaveBeenCalled();
                        });

                        it('should ping a nice message to the application', function() {
                            expect(player.getReadySession).toHaveBeenCalled();
                            expect(safeSession.ping).toHaveBeenCalledWith('hide');
                        });

                        it('should revert back to the original container style', function() {
                            ['padding', 'marginTop'].forEach(function(prop) {
                                expect(settings.embed.style[prop]).toBe('10px');
                            });
                        });
                    });

                    describe('when true', function() {
                        beforeEach(function(done) {
                            state.set('active', false);
                            $window.__c6_ga__.calls.reset();
                            settings.config.showStartTime = 12345;

                            state.set('active', true);
                            setTimeout(done, 20);
                        });

                        it('should show the iframe', function() {
                            expect($iframe.show).toHaveBeenCalled();
                        });

                        it('should post a nice message to the splash page', function() {
                            expect(settings.splashDelegate.didHide).toHaveBeenCalled();
                        });

                        it('should ping a nice message to the application', function() {
                            expect(player.getReadySession).toHaveBeenCalled();
                            expect(safeSession.ping).toHaveBeenCalledWith('show');
                        });

                        it('should call GA',function(){
                            expect($window.__c6_ga__.calls.argsFor(0)).toEqual(['68cde3e4177b8a.send','event',{ eventCategory: 'Display', eventAction: 'Show', eventLabel: undefined}]);

                            expect($window.__c6_ga__.calls.argsFor(1)[0]).toEqual('68cde3e4177b8a.send'); 
                            expect($window.__c6_ga__.calls.argsFor(1)[1]).toEqual('timing');

                            expect($window.__c6_ga__.calls.argsFor(1)[2]).toEqual(jasmine.objectContaining({ timingCategory: 'UX', timingVar: 'showPlayer', timingLabel: 'embed'}));
                        });

                        describe('repeat show',function(){
                            beforeEach(function(done) {
                                $window.__c6_ga__.calls.reset();
                                state.set('active', false);
                                state.set('active', true);
                                setTimeout(done, 20);
                            });

                            it('should not call GA',function(){
                                expect($window.__c6_ga__).not.toHaveBeenCalled();
                            });
                        });

                        describe('if there are responsiveStyles', function() {
                            var styles;

                            beforeEach(function() {
                                styles = {
                                    paddingTop: '50%',
                                    marginLeft: '10px'
                                };

                                state.set('responsiveStyles', styles);
                            });

                            it('should set the styles on the container', function() {
                                for (var prop in styles) {
                                    expect(settings.embed.style[prop]).toBe(styles[prop]);
                                }
                            });
                        });
                    });
                });
            });

            describe('when the app loads', function() {
                var appWindow,
                    getPlayerSuccess;

                beforeEach(function() {
                    getPlayerSuccess = jasmine.createSpy('getPlayer() success');
                    settings.getPlayer().then(getPlayerSuccess);

                    appWindow = $iframe.prop('contentWindow');
                });

                it('should start a session with the app', function() {
                    expect(Player).toHaveBeenCalledWith(appWindow);
                });

                it('should bootstrap the player', function() {
                    expect(player.bootstrap).toHaveBeenCalledWith({
                        experience: experience,
                        profile: browserInfo.profile,
                        standalone: settings.standalone,
                        interstitial: settings.interstitial
                    });
                });

                it('should resolve the settings.getPlayer() method\'s promise', function(done) {
                    setTimeout(function() {
                        expect(getPlayerSuccess).toHaveBeenCalledWith(player);
                        done();
                    }, 10);
                });

                it('should decorate the settings object with the app\'s c6 object', function() {
                    expect(settings.appDefines).toBe(safeSession.window.c6);
                });

                describe('if running inside of jumpramp', function() {
                    beforeEach(function(done) {
                        delete settings.promise;
                        settings.config.container = 'jumpramp';
                        settings.standalone = true;
                        player.bootstrap.calls.reset();

                        $window.c6.loadExperience(settings).finally(done);
                    });

                    it('should set standalone to false', function() {
                        expect(player.bootstrap).toHaveBeenCalledWith(jasmine.objectContaining({
                            standalone: false
                        }));
                    });
                });

                describe('google analytics',function(){
                    var tracker;

                    beforeEach(function(){
                        $window.c6.gaAcctIdPlayer = 'abc';
                        settings.config.container = 'test';
                        settings.config.context = 'test';
                        settings.config.adId = 'xyz';
                        tracker = {
                            get : jasmine.createSpy('tracker.get')
                        };
                        tracker.get.and.returnValue('fake_client_id');

                        $window.__c6_ga__.getByName = jasmine.createSpy('ga.getByName')
                            .and.returnValue(tracker);
                    });

                    it('sends a ping if it gets a clientId',function(){
                        $window.__c6_ga__.calls.argsFor(3)[0]();
                        expect($window.__c6_ga__.getByName).toHaveBeenCalledWith('c6');
                        expect(tracker.get).toHaveBeenCalledWith('clientId');
                        expect(session.ping).toHaveBeenCalledWith('initAnalytics',{
                            accountId : 'abc',
                            clientId : 'fake_client_id',
                            container: 'test',
                            context: 'test',
                            group: 'xyz',
                            experiment: null,
                            variant: null
                        });
                    });

                    describe('if the MiniReel is part of an experiment', function() {
                        beforeEach(function() {
                            settings.config.ex = 'my-crazy-experiment';
                            settings.config.vr = 'crazy-idea';
                            session.ping.calls.reset();

                            session.trigger('ready', true);
                            session.ping.calls.reset();
                            $window.__c6_ga__.calls.argsFor(3)[0]();
                        });

                        it('should send experiment and variant information to the player', function() {
                            expect(session.ping).toHaveBeenCalledWith('initAnalytics', jasmine.objectContaining({
                                experiment: settings.config.ex,
                                variant: settings.config.vr
                            }));
                        });
                    });

                    it('sends no ping if it gets no clientId',function(){
                        tracker.get.and.returnValue(undefined);

                        session.trigger('ready', true);
                        session.ping.calls.reset();
                        $window.__c6_ga__.calls.argsFor(3)[0]();
                        expect(session.ping).not.toHaveBeenCalled();
                    });

                    it('sends no ping if no tracker is returned',function(){
                        $window.__c6_ga__.getByName.and.returnValue(undefined);

                        session.trigger('ready', true);
                        session.ping.calls.reset();
                        $window.__c6_ga__.calls.argsFor(3)[0]();
                        expect(session.ping).not.toHaveBeenCalled();
                    });
                });

                describe('when the app wants to open', function() {
                    beforeEach(function() {
                        spyOn(settings.state, 'set').and.callThrough();

                        session.emit('open');
                    });

                    it('should set active to true', function() {
                        expect(settings.state.set).toHaveBeenCalledWith('active', true);
                    });
                });

                describe('when the app wants to close', function() {
                    beforeEach(function() {
                        spyOn(settings.state, 'set').and.callThrough();

                        session.emit('close');
                    });

                    it('should set active to false', function() {
                        expect(settings.state.set).toHaveBeenCalledWith('active', false);
                    });
                });

                describe('when the app wants to enter fullscreen mode', function() {
                    ['desktop', 'tablet', 'netbook', 'phone'].forEach(function(device) {
                        describe('on a ' + device, function() {
                            beforeEach(function() {
                                browserInfo.profile.device = device;
                            });

                            describe('if allowFullscreen is false', function() {
                                beforeEach(function() {
                                    settings.allowFullscreen = false;
                                });

                                describe('when true is provided', function() {
                                    beforeEach(function() {
                                        session.emit('fullscreenMode', true);
                                    });

                                    it('should not fullscreen the iframe', function() {
                                        expect($iframe.fullscreen).not.toHaveBeenCalled();
                                    });

                                    it('should not put the iframe in the root stacking context', function() {
                                        expect(hostDocument.putInRootStackingContext).not.toHaveBeenCalled();
                                    });
                                });
                            });

                            [true, false].forEach(function(bool) {
                                describe('when ' + bool + ' is provided', function() {
                                    beforeEach(function() {
                                        session.emit('fullscreenMode', bool);
                                    });

                                    it('should fullscreen/unfullscreen the iframe', function() {
                                        expect($iframe.fullscreen).toHaveBeenCalledWith(bool);
                                    });
                                });
                            });

                            describe('when true is provided', function() {
                                beforeEach(function() {
                                    session.emit('fullscreenMode', true);
                                });

                                it('should put the $iframe in the root stacking context', function() {
                                    expect(hostDocument.putInRootStackingContext).toHaveBeenCalledWith($iframe);
                                });
                            });

                            describe('when false is provided', function() {
                                beforeEach(function() {
                                    session.emit('fullscreenMode', false);
                                });

                                it('should reset the hostDocument', function() {
                                    expect(hostDocument.reset).toHaveBeenCalled();
                                });
                            });
                        });
                    });

                    describe('on a phone', function() {
                        beforeEach(function() {
                            browserInfo.profile.device = 'phone';
                        });

                        describe('when true is provided', function() {
                            beforeEach(function() {
                                session.emit('fullscreenMode', true);
                            });

                            it('should shrink the host document', function() {
                                expect(hostDocument.shrink).toHaveBeenCalledWith(true);
                            });
                        });

                        describe('when false is provided', function() {
                            beforeEach(function() {
                                session.emit('fullscreenMode', false);
                            });

                            it('should not shrink the host document', function() {
                                expect(hostDocument.shrink).not.toHaveBeenCalled();
                            });
                        });
                    });

                    ['desktop', 'tablet', 'netbook'].forEach(function(device) {
                        describe('on a ' + device, function() {
                            beforeEach(function() {
                                browserInfo.profile.device = device;
                            });

                            [true, false].forEach(function(bool) {
                                describe('when ' + bool + ' is provided', function() {
                                    beforeEach(function() {
                                        session.emit('fullscreenMode', bool);
                                    });

                                    it('should not shrink the host document', function() {
                                        expect(hostDocument.shrink).not.toHaveBeenCalled();
                                    });
                                });
                            });
                        });
                    });
                });

                describe('when the app tries to set responsive styles', function() {
                    var styles;

                    beforeEach(function() {
                        styles = {
                            paddingLeft: '20px',
                            height: '70px',
                            marginTop: '10px'
                        };

                        spyOn(settings.state, 'set').and.callThrough();
                    });

                    describe('when the embed is responsive', function() {
                        beforeEach(function() {
                            session.emit('responsiveStyles', styles);
                        });

                        it('should set the styles on the state object', function() {
                            expect(settings.state.set).toHaveBeenCalledWith('responsiveStyles', styles);
                        });
                    });

                    describe('when the embed is not responsive', function() {
                        beforeEach(function() {
                            settings.config.responsive = false;

                            session.emit('responsiveStyles', styles);
                        });

                        it('should not set the styles', function() {
                            expect(settings.state.set).not.toHaveBeenCalled();
                        });
                    });
                });
            });
        });
    });
}());
