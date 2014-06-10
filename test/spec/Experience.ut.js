(function() {
    'use strict';

    describe('Experience', function() {
        var Experience,
            q,
            asEvented,
            experience,
            _private;

        var postmessage,
            browserInfo,
            sessions,
            session,
            expWindow,
            exp;

        beforeEach(function() {
            Experience = require('../../lib/Experience');
            q = require('../../node_modules/q/q.js');
            asEvented = require('../../node_modules/asEvented/asevented.js');

            expWindow = {};
            exp = {
                id: 'e1'
            };

            sessions = [];
            postmessage = {
                _sessionCount: 0,
                createSession: jasmine.createSpy('postmessage.createSession()')
                    .and.callFake(function(win) {
                        var thisSession = {
                            id: postmessage._sessionCount++,
                            window: win,
                            request: jasmine.createSpy('session request')
                                .and.callFake(function() {
                                    var deferred = q.defer();

                                    thisSession._requestDeferreds.push(deferred);
                                    thisSession._requestDeferred = deferred;

                                    return deferred.promise;
                                }),
                            ping: jasmine.createSpy('session ping'),
                            _requestDeferreds: [],
                            _requestDeferred: null
                        };

                        asEvented.call(thisSession);
                        spyOn(thisSession, 'once').and.callThrough();

                        sessions.push(thisSession);
                        session = thisSession;

                        return thisSession;
                    }),
                destroySession: jasmine.createSpy('postmessage.destroySession()')
            };

            browserInfo = {
                profile: {}
            };

            experience = new Experience({ q: q, postmessage: postmessage, browserInfo: browserInfo });
            _private = experience._private;
        });

        it('should exist', function() {
            expect(experience).toEqual(jasmine.any(Object));
        });

        describe('@public methods', function() {
            describe('getSession(expId)', function() {
                var resolveHandlerSpy;

                beforeEach(function() {
                    resolveHandlerSpy = jasmine.createSpy('resolve handler');
                });

                it('should return a promise', function() {
                    expect(experience.getSession('e1').then).toEqual(jasmine.any(Function));
                });

                describe('if the session is not available', function() {
                    var result;

                    beforeEach(function() {
                        result = experience.getSession('e1');
                    });

                    it('should add a deferred to the sessions hash', function() {
                        expect(_private.sessions.e1.promise).toBeDefined();
                    });

                    it('should return the promise of the deferred it created', function() {
                        expect(result).toBe(_private.sessions.e1.promise);
                    });
                });

                describe('if the session is already available', function() {
                    var result,
                        deferred;

                    beforeEach(function() {
                        deferred = _private.sessions.e1 = q.defer();

                        result = experience.getSession('e1');
                    });

                    it('should return the existing promise', function() {
                        expect(result).toBe(deferred.promise);
                    });
                });
            });

            describe('registerExperience(experience, expWindow)', function() {
                var returnedSession;

                beforeEach(function() {
                    spyOn(_private, 'decorateSession');

                    returnedSession = experience.registerExperience(exp, expWindow);
                });

                it('should create a postmessage session with the window', function() {
                    expect(postmessage.createSession).toHaveBeenCalledWith(expWindow);
                });

                it('should decorate the session', function() {
                    expect(_private.decorateSession).toHaveBeenCalledWith(session, exp);
                });

                it('should return the session', function() {
                    expect(returnedSession).toBe(session);
                });

                it('should listen for a handshake from the experience', function() {
                    expect(session.once).toHaveBeenCalledWith('handshake', jasmine.any(Function));
                });

                it('should listen for the ready event from the session', function() {
                    expect(session.once).toHaveBeenCalledWith('ready', jasmine.any(Function));
                });

                it('should not resolve any promises right away', function() {
                    var spy = jasmine.createSpy('promise spy'),
                        deferred = _private.sessions.e1 = q.defer();

                    experience.registerExperience(exp, expWindow);
                    deferred.promise.then(spy);

                    expect(spy).not.toHaveBeenCalled();
                });

                describe('when the session is ready', function() {
                    beforeEach(function() {
                        session.trigger('ready', true);
                    });

                    it('should set the session\'s ready property to true', function() {
                        expect(session.ready).toBe(true);
                    });

                    describe('if the session has not yet been requested', function() {
                        var sessionHandler;

                        beforeEach(function(done) {
                            sessionHandler = jasmine.createSpy('session promise handler');

                            _private.sessions = {};

                            returnedSession = experience.registerExperience(exp, expWindow);
                            session.trigger('ready', true);

                            _private.sessions.e1.promise.then(sessionHandler);
                            setTimeout(done, 0);
                        });

                        it('should add a deferred that resolves to the session to the sessions hash', function() {
                            expect(sessionHandler).toHaveBeenCalledWith(session);
                            expect(_private.sessions.e1).toBeDefined();
                        });
                    });

                    describe('if the session has already been requested', function() {
                        var sessionHandler;

                        beforeEach(function(done) {
                            sessionHandler = jasmine.createSpy('session promise handler');

                            _private.sessions = {
                                e1: q.defer()
                            };

                            _private.sessions.e1.promise.then(sessionHandler);

                            returnedSession = experience.registerExperience(exp, expWindow);
                            session.trigger('ready', true);
                            setTimeout(done, 0);
                        });

                        it('should resolve the existing promise with the session', function() {
                            expect(sessionHandler).toHaveBeenCalledWith(session);
                        });
                    });
                });

                describe('when the handshake is requested', function() {
                    var respondSpy;

                    beforeEach(function() {
                        respondSpy = jasmine.createSpy('respond spy');

                        session.trigger('handshake', {}, respondSpy);
                    });

                    it('should respond with handshake data', function() {
                        var handshakeData = respondSpy.calls.mostRecent().args[0];

                        expect(handshakeData.success).toBe(true);
                        expect(handshakeData.appData.experience).toBe(exp);
                        expect(handshakeData.appData.profile).toBe(browserInfo.profile);
                        expect(handshakeData.appData.version).toBe(1);
                    });
                });
            });

            describe('deregisterExperience(expId)', function() {
                beforeEach(function() {
                    _private.sessions.e1 = session;

                    experience.deregisterExperience('e1');
                });

                it('should destroy the session', function() {
                    expect(postmessage.destroySession).toHaveBeenCalledWith(0);
                });

                it('should remove the session from the hash', function() {
                    expect(_private.sessions.hasOwnProperty('e1')).toBe(false);
                });
            });
        });

        describe('_private methods', function() {
            describe('decorateSession(session, experience)', function() {
                beforeEach(function() {
                    _private.decorateSession(session, exp);
                });

                it('should decorate the session with a reference to the experience', function() {
                    expect(session.experience).toBe(exp);
                });

                it('should decorate the session with a false ready property', function() {
                    expect(session.ready).toBe(false);
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
