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
            describe('registerExperience(experience, expWindow, appData)', function() {
                var returnedSession;

                beforeEach(function() {
                    spyOn(_private, 'decorateSession').and.callThrough();

                    returnedSession = experience.registerExperience(exp, expWindow);
                });

                describe('if called with some appData', function() {
                    var appData;

                    beforeEach(function() {
                        appData = {
                            mode: 'full',
                            standalone: true,
                            test: 'foo'
                        };

                        experience.registerExperience(exp, expWindow, appData);
                    });

                    describe('when the handshake is requested', function() {
                        var respondSpy, sentAppData;

                        beforeEach(function() {
                            respondSpy = jasmine.createSpy('respond()');

                            session.trigger('handshake', {}, respondSpy);

                            sentAppData = respondSpy.calls.mostRecent().args[0].appData;
                        });

                        it('should send app data that is extended with the provided data', function() {
                            expect(sentAppData).toEqual(jasmine.objectContaining({
                                experience: exp,
                                profile: browserInfo.profile,
                                version: 1
                            }));
                            expect(sentAppData).toEqual(jasmine.objectContaining(appData));
                        });
                    });
                });

                describe('if called with appData that includes a profile', function() {
                    var appData;
                    var profile;

                    beforeEach(function() {
                        profile = {
                            device: 'desktop',
                            flash: false
                        };

                        appData = {
                            standalone: false,
                            profile: profile
                        };

                        experience.registerExperience(exp, expWindow, appData);
                    });

                    describe('when the handshake is requested', function() {
                        var respondSpy, sentAppData;

                        beforeEach(function() {
                            respondSpy = jasmine.createSpy('respond()');

                            session.trigger('handshake', {}, respondSpy);

                            sentAppData = respondSpy.calls.mostRecent().args[0].appData;
                        });

                        it('should send app data that uses the custom profile', function() {
                            expect(sentAppData).toEqual(jasmine.objectContaining({
                                profile: profile
                            }));
                        });
                    });
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

                describe('when the session is ready', function() {
                    var ensureReadinessSpy;

                    beforeEach(function(done) {
                        ensureReadinessSpy = jasmine.createSpy('ensureReadiness() success');

                        session.ensureReadiness().then(ensureReadinessSpy).finally(done);
                        session.trigger('ready', true);
                    });

                    it('should set the session\'s ready property to true', function() {
                        expect(session.ready).toBe(true);
                    });

                    it('should resolve the promise returned by ensureReadiness()', function() {
                        expect(ensureReadinessSpy).toHaveBeenCalledWith(session);
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
        });

        describe('_private methods', function() {
            describe('decorateSession(session, experience)', function() {
                beforeEach(function() {
                    asEvented.call(session);
                    _private.decorateSession(session, exp);
                });

                it('should decorate the session with a reference to the experience', function() {
                    expect(session.experience).toBe(exp);
                });

                it('should decorate the session with a false ready property', function() {
                    expect(session.ready).toBe(false);
                });

                describe('the ensureReadiness() method', function() {
                    it('should exist', function() {
                        expect(session.ensureReadiness).toEqual(jasmine.any(Function));
                    });

                    it('should return a promise', function() {
                        var Promise = q.defer().promise.constructor;

                        expect(session.ensureReadiness()).toEqual(jasmine.any(Promise));
                    });

                    it('should return the same promise every time', function() {
                        expect(session.ensureReadiness()).toBe(session.ensureReadiness());
                    });
                });

                describe('the destroy() method', function() {
                    beforeEach(function() {
                        session.destroy();
                    });

                    it('should call postMessage.destroySession() with the session id', function() {
                        expect(postmessage.destroySession).toHaveBeenCalledWith(session.id);
                    });
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
