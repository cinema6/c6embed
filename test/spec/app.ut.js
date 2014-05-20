(function() {
    'use strict';

    describe('app', function() {
        var app;

        var C6Query;

        var $,
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
            session;

        function Session() {
            AsEvented.call(this);
        }
        Session.prototype = {
            ping: jasmine.createSpy('session.ping()')
        };

        function run() {
            app({
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
                hostDocument: hostDocument
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

            experienceService = {
                registerExperience: jasmine.createSpy('experienceService.registerExperience()')
                    .and.returnValue(session)
            };

            hostDocument = {
                shrink: jasmine.createSpy('hostDocument.shrink()')
            };

            app = require('../../src/app');
        });

        it('should exist', function() {
            expect(app).toEqual(jasmine.any(Function));
        });

        it('should replace the c6.loadExperience method', function() {
            var c6 = $window.c6,
                loadExperience = c6.loadExperience;

            run();

            expect($window.c6).toBe(c6);
            expect($window.c6.loadExperience).toEqual(jasmine.any(Function));
            expect($window.c6.loadExperience).not.toBe(loadExperience);
        });

        describe('c6.loadExperience(embed)', function() {
            var embed;

            beforeEach(function(done) {
                c6Ajax.get.and.returnValue(Q.when({
                    data: indexHTML
                }));

                run();

                embed = {
                    embed: $('<div>')[0],
                    load: true,
                    config: {
                        exp: 'e-68cde3e4177b8a',
                        responsive: true
                    }
                };

                $window.c6.loadExperience(embed).finally(done);
            });

            it('should put the iframe in the embed container', function() {
                expect(embed.embed.firstChild).toBe($iframe[0]);
            });

            it('should fetch the experience', function() {
                expect(c6Db.find).toHaveBeenCalledWith('experience', embed.config.exp);
            });

            it('should fetch index.html', function() {
                expect(c6Ajax.get).toHaveBeenCalledWith(config.appBase + '/' + experience.appUri + '/index.html');
            });

            it('should parse the document', function() {
                expect(mockDocumentParser).toHaveBeenCalledWith(indexHTML);
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

                describe('when the app is ready', function() {
                    beforeEach(function() {
                        session.emit('ready', true);
                    });

                    it('should show the app', function() {
                        expect($iframe.show).toHaveBeenCalled();
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
                    });

                    describe('when the embed is responsive', function() {
                        beforeEach(function() {
                            session.emit('responsiveStyles', styles);
                        });

                        it('should set the styles on the container', function() {
                            for (var prop in styles) {
                                expect(embed.embed.style[prop]).toBe(styles[prop]);
                            }
                        });
                    });
                });
            });
        });
    });
}());
