var PlayerProvider = require('../../src/PlayerProvider.js');
var PostMessage = require('../../lib/PostMessage.js');
var q = require('../../node_modules/q/q.js');
var asEvented = require('../../node_modules/asEvented/asevented.js');

describe('Player', function() {
    'use strict';

    var Player;
    var postMessage;

    function extend() {
        return Array.prototype.slice.call(arguments)
            .reduce(function(result, object) {
                return Object.keys(object).reduce(function(result, key) {
                    result[key] = object[key];
                    return result;
                }, result);
            }, {});
    }

    beforeEach(function() {
        postMessage = new PostMessage({
            q: q,
            asEvented: asEvented,
            window: window
        });

        Player = new PlayerProvider({
            postmessage: postMessage,
            q: q
        });
    });

    it('should exist', function() {
        expect(Player).toEqual(jasmine.any(Function));
    });

    describe('instance', function() {
        var player;
        var session;
        var appWindow;

        beforeEach(function() {
            session = asEvented.call({});
            spyOn(postMessage, 'createSession').and.returnValue(session);

            appWindow = {
                postMessage: jasmine.createSpy('appWindow.postMessage()')
            };

            player = new Player(appWindow);
        });

        it('should create a session for the player', function() {
            expect(postMessage.createSession).toHaveBeenCalledWith(appWindow);
        });

        describe('properties:', function() {
            describe('experience', function() {
                it('should be null', function() {
                    expect(player.experience).toBeNull();
                });
            });

            describe('session', function() {
                it('should be the session created by createSession()', function() {
                    expect(player.session).toBe(session);
                });

                describe('events:', function() {
                    describe('ready', function() {
                        beforeEach(function() {
                            session.emit('ready');
                        });

                        it('should set ready to true', function() {
                            expect(player.ready).toBe(true);
                        });
                    });
                });
            });

            describe('ready', function() {
                it('should be false', function() {
                    expect(player.ready).toBe(false);
                });
            });
        });

        describe('methods:', function() {
            describe('bootstrap(experience, profile)', function() {
                var experience;
                var profile;
                var data;
                var result;

                var respond;

                beforeEach(function() {
                    experience = {
                        id: 'e-7c9852570ab45d',
                        data: {
                            deck: []
                        }
                    };

                    profile = {
                        device: 'desktop',
                        flash: true
                    };

                    data = {
                        experience: experience,
                        profile: profile,
                        standalone: true
                    };

                    respond = jasmine.createSpy('respond()');

                    session.emit('handshake', null, respond);

                    result = player.bootstrap(data);
                });

                it('should be chainable', function() {
                    expect(result).toBe(player);
                });

                it('should respond to the handshake', function() {
                    expect(respond).toHaveBeenCalledWith({
                        success: true,
                        appData: extend(data, {
                            version: 1
                        })
                    });
                });

                describe('if called before handshake is emitted', function() {
                    beforeEach(function() {
                        player = new Player(appWindow);

                        player.bootstrap(data);
                    });

                    describe('when handshake is emitted', function() {
                        beforeEach(function() {
                            session.emit('handshake', null, respond);
                        });

                        it('should respond to the handshake', function() {
                            expect(respond).toHaveBeenCalledWith({
                                success: true,
                                appData: extend(data, {
                                    version: 1
                                })
                            });
                        });
                    });
                });
            });

            describe('getReadySession()', function() {
                var success;

                beforeEach(function(done) {
                    success = jasmine.createSpy('success()');

                    player.getReadySession().then(success);
                    setTimeout(done, 5);
                });

                describe('when the session emits ready', function() {
                    beforeEach(function(done) {
                        session.emit('ready');
                        setTimeout(done, 1);
                    });

                    it('should fulfill the promise with the session', function() {
                        expect(success).toHaveBeenCalledWith(session);
                    });
                });

                describe('if the session is already ready', function() {
                    beforeEach(function(done) {
                        session = asEvented.call({});
                        postMessage.createSession.and.returnValue(session);
                        player = new Player(appWindow);
                        success.calls.reset();

                        session.emit('ready');
                        player.getReadySession().then(success);

                        setTimeout(done, 1);
                    });

                    it('should immediately fulfill', function() {
                        expect(success).toHaveBeenCalledWith(session);
                    });
                });

                it('should return the same promise every time', function() {
                    expect(player.getReadySession()).toBe(player.getReadySession());
                });
            });
        });
    });
});
