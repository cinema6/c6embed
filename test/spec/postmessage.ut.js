(function() {
    'use strict';

    describe('postmessage.js', function() {
        var PostMessage,
            q,
            asEvented,
            postmessage,
            _private;

        var mockWindow;

        beforeEach(function() {
            PostMessage = require('../../lib/PostMessage');
            q = require('../../node_modules/q/q');
            asEvented = require('../../node_modules/asEvented/asevented');

            mockWindow = {
                addEventListener: jasmine.createSpy('window.addEventListener')
            };

            postmessage = new PostMessage({ q: q, asEvented: asEvented, window: mockWindow });
            _private = postmessage._private;
        });

        it('should exist', function() {
            expect(postmessage).toEqual(jasmine.any(Object));
        });

        it('should have the window listen for the message event and use the _private.handleMessage() function', function() {
            expect(mockWindow.addEventListener).toHaveBeenCalledWith('message', _private.handleMessage, false);
        });

        describe('@private', function() {
            describe('methods', function() {
                describe('ping(win, event, type, data)', function() {
                    var data,
                        win;

                    beforeEach(function() {
                        data = {};
                        win = {
                            postMessage: jasmine.createSpy('window postmessage')
                        };

                        _private.ping(win, 'test', 'request', data);
                    });

                    it('should send a message to the window', function() {
                        expect(win.postMessage).toHaveBeenCalled();
                    });

                    it('should format the data sent into a transferable format', function() {
                        var args = win.postMessage.calls.mostRecent().args,
                            message = args[0];

                        expect(typeof message).toBe('string');

                        message = JSON.parse(message);

                        expect(message.__c6__).toBeDefined();
                        expect(message.__c6__.event).toBe('test');
                        expect(message.__c6__.data).toEqual(data);
                        expect(message.__c6__.type).toBe('request');
                    });
                });

                describe('newRequestId', function() {
                    var sessions;

                    beforeEach(function() {
                        sessions = {
                            0: {
                                _pending: {}
                            },
                            1: {
                                _pending: {}
                            },
                            2: {
                                _pending: {}
                            }
                        };
                    });

                    it('should use the first unused id starting at 0', function() {
                        expect(_private.newRequestId(sessions[0])).toBe(0);
                    });

                    it('should not use an id if a session already has a request with that id', function() {
                        sessions[0]._pending[0] = {};
                        sessions[0]._pending[1] = {};

                        expect(_private.newRequestId(sessions[0])).toBe(2);
                    });

                    it('should still use an id even if there is an id with a higher value', function() {
                        sessions[2]._pending[0] = {};
                        sessions[2]._pending[1] = {};
                        sessions[2]._pending[2] = {};
                        sessions[2]._pending[5] = {};

                        expect(_private.newRequestId(sessions[2])).toBe(3);
                    });
                });

                describe('getSessionByWindow(win)', function() {
                    var window1,
                        window2,
                        window3,
                        session1,
                        session2,
                        session3;

                    beforeEach(function() {
                        window1 = {};
                        window2 = {};
                        window3 = {};

                        session1 = postmessage.createSession(window1);
                        session2 = postmessage.createSession(window2);
                        session3 = postmessage.createSession(window3);
                    });

                    it('should find the session with the corresponding window', function() {
                        expect(_private.getSessionByWindow(window1)).toBe(session1);
                        expect(_private.getSessionByWindow(window2)).toBe(session2);
                        expect(_private.getSessionByWindow(window3)).toBe(session3);
                    });
                });

                describe('handleMessage(event)', function() {
                    var data,
                        session,
                        args,
                        win,
                        C6Event;

                    function Event(data) {
                        this.data = JSON.stringify(data);
                    }

                    beforeEach(function() {
                        win = {};

                        session = postmessage.createSession(win);

                        data = {
                            __c6__: {
                                event: 'test',
                                data: {},
                                type: null
                            }
                        };

                        C6Event = function(data) {
                            this.source = win;

                            this.data = JSON.stringify(data);
                        };

                        spyOn(session, 'trigger');
                    });

                    it('should do nothing when a non-cinema6 event comes in', function() {
                        expect(function() {
                            _private.handleMessage.call(mockWindow, new Event({ facebook: 'hello' }));
                        }).not.toThrow();

                        expect(function() {
                            _private.handleMessage.call(mockWindow, new Event('hello'));
                        }).not.toThrow();

                        expect(function() {
                            _private.handleMessage.call(mockWindow, new Event(undefined));
                        }).not.toThrow();

                        expect(function() {
                            _private.handleMessage.call(mockWindow, new Event(null));
                        }).not.toThrow();

                        expect(function() {
                            _private.handleMessage.call(mockWindow, new Event(22));
                        }).not.toThrow();
                    });

                    describe('request', function() {
                        beforeEach(function() {
                            data.__c6__.type = 'request:0';

                            _private.handleMessage.call(mockWindow, new C6Event(data));

                            args = session.trigger.calls.mostRecent().args;
                        });

                        it('should trigger the received event', function() {
                            expect(session.trigger).toHaveBeenCalledWith('test', {}, jasmine.any(Function));
                        });

                        describe('the done() function', function() {
                            var done;

                            beforeEach(function() {
                                done = args[2];
                                spyOn(_private, 'ping');
                            });

                            it('should ping the window with the provided response', function() {
                                var data = {};

                                done(data);

                                expect(_private.ping).toHaveBeenCalledWith(win, 'test', 'response:0', data);
                            });
                        });
                    });

                    describe('response', function() {
                        beforeEach(function() {
                            data.__c6__.type = 'response:0';

                            session._pending[0] = {
                                resolve: jasmine.createSpy('session pending resolve')
                            };

                            _private.handleMessage(new C6Event(data));
                        });

                        it('should resolve the promise for the pending request with the provided data', function() {
                            expect(session._pending[0].resolve).toHaveBeenCalledWith(data.__c6__.data);
                        });
                    });

                    describe('ping', function() {
                        beforeEach(function() {
                            data.__c6__.type = 'ping';

                            _private.handleMessage(new C6Event(data));

                            args = session.trigger.calls.mostRecent().args;
                        });

                        it('should trigger the event with the data and the angular.noop function', function() {
                            expect(session.trigger).toHaveBeenCalledWith('test', data.__c6__.data, jasmine.any(Function));
                        });
                    });
                });
            });
        });

        describe('@public', function() {
            describe('methods', function() {
                var session,
                    win;

                beforeEach(function() {
                    win = {};

                    session = postmessage.createSession(win);
                });

                describe('createSession(win)', function() {
                    it('should create a session', function() {
                        expect(session).toEqual(jasmine.any(Object));
                    });

                    describe('the session', function() {
                        it('should have a reference to the window', function() {
                            expect(session.window).toBe(win);
                        });

                        it('should have a unique id', function() {
                            expect(session.id).toBe(0);

                            expect(postmessage.createSession({}).id).toBe(1);
                            expect(postmessage.createSession({}).id).toBe(2);
                        });
                    });
                });

                describe('destroySession(id)', function() {
                    beforeEach(function() {
                        postmessage.destroySession(0);
                    });

                    it('should make all the properties undefined and the functions angular.noop', function() {
                        var noop = function() {};

                        for (var prop in session) {
                            var value = session[prop];

                            if (typeof value === 'function') {
                                expect(value.toString()).toEqual(noop.toString());
                            } else {
                                expect(value).not.toBeDefined();
                            }
                        }
                    });
                });

                describe('getSession(id)', function() {
                    var foundSession;

                    beforeEach(function() {
                        foundSession = postmessage.getSession(0);
                    });

                    it('should get the session with the provided id', function() {
                        expect(foundSession).toBe(session);
                    });
                });

                describe('session methods', function() {
                    beforeEach(function() {
                        spyOn(_private, 'ping');
                    });

                    describe('ping(event, data)', function() {
                        beforeEach(function() {
                            session.ping('test', 'hello');
                        });

                        it('should ping the correct window', function() {
                            expect(_private.ping).toHaveBeenCalledWith(session.window, 'test', 'ping', 'hello');
                        });
                    });

                    describe('request', function() {
                        var promise;

                        beforeEach(function() {
                            promise = session.request('test', 'okay');
                        });

                        it('should return a promise', function() {
                            expect(promise.then).toEqual(jasmine.any(Function));
                        });

                        it('should add the deferred object to the pending requests', function() {
                            expect(session._pending[0].resolve).toEqual(jasmine.any(Function));
                        });

                        it('should ping the correct window with the request', function() {
                            expect(_private.ping).toHaveBeenCalledWith(session.window, 'test', 'request:0', 'okay');
                        });
                    });
                });
            });
        });
    });
}());
