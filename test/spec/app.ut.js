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
            c6Db,
            c6Ajax,
            config,
            mockDocumentParser,
            browserInfo,
            experienceService,
            hostDocument;

        var $iframe,
            experience,
            indexHTML,
            parsedDoc,
            session,
            safeSession;

        function Session() {
            AsEvented.call(this);
        }
        Session.prototype = {
            ping: jasmine.createSpy('session.ping()')
        };

        function run() {
            return app({
                window: $window,
                frameFactory: frameFactory,
                $: $,
                Q: Q,
                c6Db: c6Db,
                config: config,
                c6Ajax: c6Ajax,
                documentParser: mockDocumentParser,
                browserInfo: browserInfo,
                experienceService: experienceService,
                hostDocument: hostDocument,
                Observable: Observable
            });
        }

        beforeEach(function() {
            var DocumentParser = require('../../src/DocumentParser'),
                documentParser = new DocumentParser();

            indexHTML = require('../helpers/mock_index.js');

            experience = {
                appUri: 'rumble',
                data: {
                    mode: 'lightbox-ads'
                }
            };

            $window = {
                c6: {
                    loadExperience: function() {}
                }
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

                $iframe.load = jasmine.createSpy('$iframe.load()');
                $iframe.fullscreen = jasmine.createSpy('$iframe.fullscreen()');
                $iframe.show = jasmine.createSpy('$iframe.show()');
                $iframe.hide = jasmine.createSpy('$iframe.hide()');

                return $iframe;
            };

            c6Db = {
                find: jasmine.createSpy('c6Db.find()')
                    .and.returnValue(Q.when(experience))
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
                    device: 'phone'
                }
            };

            session = new Session();

            safeSession = new Session();

            experienceService = {
                registerExperience: jasmine.createSpy('experienceService.registerExperience()')
                    .and.returnValue(session),
                getSession: jasmine.createSpy('experienceService.getSession()')
                    .and.returnValue(Q.when(safeSession))
            };

            hostDocument = {
                shrink: jasmine.createSpy('hostDocument.shrink()')
            };

            app = require('../../src/app');
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

            beforeEach(function() {
                embed1 = $('<div><div></div></div>')[0];
                embed2 = $('<div><div></div></div>')[0];

                c6 = $window.c6;

                c6.embeds = {
                    'e-123': {
                        load: false,
                        splashDelegate: {}
                    },
                    'e-abc': {
                        load: false,
                        splashDelegate: {}
                    },
                    'e-456': {
                        load: true,
                        embed: embed1,
                        config: {
                            exp: 'e-456'
                        },
                        splashDelegate: {}
                    },
                    'e-def': {
                        load: true,
                        embed: embed2,
                        config: {
                            exp: 'e-456'
                        },
                        splashDelegate: {}
                    },
                    'e-789': {
                        load: false,
                        splashDelegate: {}
                    }
                };

                [embed1, embed2].forEach(function(embed) {
                    $('body').append(embed);
                });

                run();
            });

            afterEach(function() {
                [embed1, embed2].forEach(function(embed) {
                    $(embed).remove();
                });
            });

            it('should load all the embeds where load is true', function() {
                for (var id in c6.embeds) {
                    if (c6.embeds[id].load) {
                        expect(c6.embeds[id].state).toEqual(jasmine.any(Observable), id);
                    } else {
                        expect(c6.embeds[id].state).not.toBeDefined(id);
                    }
                }
            });
        });

        describe('c6.loadExperience(settings)', function() {
            var settings,
                $embed,
                promise,
                success;

            beforeEach(function(done) {
                success = jasmine.createSpy('success()');

                c6Ajax.get.and.returnValue(Q.when({
                    data: indexHTML
                }));

                settings = {
                    embed: $('<div style="padding: 10px; margin-top: 10px;"><div></div></div>')[0],
                    load: true,
                    splashDelegate: {
                        didShow: jasmine.createSpy('splashDelegate.didShow()'),
                        didHide: jasmine.createSpy('splashDelegate.didHide()')
                    },
                    config: {
                        exp: 'e-68cde3e4177b8a',
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

            it('should add an observeable state object to the settings', function() {
                expect(settings.state).toEqual(jasmine.any(Observable));
                expect(settings.state).toEqual(jasmine.objectContaining({
                    responsiveStyles: null,
                    active: jasmine.any(Boolean)
                }));
            });

            it('should put the iframe in the embed container', function() {
                expect(settings.embed.childNodes[1]).toBe($iframe[0]);
            });

            it('should fetch the experience', function() {
                expect(c6Db.find).toHaveBeenCalledWith('experience', settings.config.exp);
            });

            it('should fetch index.html', function() {
                expect(c6Ajax.get).toHaveBeenCalledWith(config.appBase + '/' + experience.appUri + '/index.html');
            });

            it('should parse the document', function() {
                expect(mockDocumentParser).toHaveBeenCalledWith(indexHTML);
            });

            it('should resolve to the settings object', function() {
                expect(experienceService.getSession).toHaveBeenCalledWith(settings.config.exp);
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

                    spyOn(state, 'observe').and.callThrough();
                });

                describe('active', function() {
                    describe('when false', function() {
                        beforeEach(function() {
                            state.set('active', true);
                            $iframe.hide.calls.reset();
                            settings.splashDelegate.didShow.calls.reset();
                            experienceService.getSession.calls.reset();
                            state.set('responsiveStyles', {
                                padding: '20px',
                                marginTop: '50px'
                            });

                            state.set('active', false);
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
                            expect(experienceService.getSession).toHaveBeenCalledWith(settings.config.exp);
                            expect(safeSession.ping).toHaveBeenCalledWith('hide');
                        });

                        it('should revert back to the original container style', function() {
                            ['padding', 'marginTop'].forEach(function(prop) {
                                expect(settings.embed.style[prop]).toBe('10px');
                            });
                        });
                    });

                    describe('when true', function() {
                        beforeEach(function() {
                            state.set('active', true);
                        });

                        it('should show the iframe', function() {
                            expect($iframe.show).toHaveBeenCalled();
                        });

                        it('should post a nice message to the splash page', function() {
                            expect(settings.splashDelegate.didHide).toHaveBeenCalled();
                        });

                        it('should ping a nice message to the application', function() {
                            expect(experienceService.getSession).toHaveBeenCalledWith(settings.config.exp);
                            expect(safeSession.ping).toHaveBeenCalledWith('show');
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
                var appWindow;

                beforeEach(function() {
                    var cb = $iframe.load.calls.mostRecent().args[1];

                    appWindow = {};

                    cb(appWindow);
                });

                it('should start a session with the app', function() {
                    expect(experienceService.registerExperience).toHaveBeenCalledWith(experience, appWindow);
                });

                it('should put the session on the embed settings object', function() {
                    expect(settings.session).toBe(session);
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
                        });
                    });

                    describe('on a phone', function() {
                        beforeEach(function() {
                            browserInfo.profile.device = 'phone';
                        });

                        [true, false].forEach(function(bool) {
                            describe('when ' + bool + ' is provided', function() {
                                beforeEach(function() {
                                    session.emit('fullscreenMode', bool);
                                });

                                it('should shrink or unshrink the host document', function() {
                                    expect(hostDocument.shrink).toHaveBeenCalledWith(bool);
                                });
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
