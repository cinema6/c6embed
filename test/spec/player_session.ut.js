describe('PlayerSession(win)', function() {
    'use strict';

    var PlayerSession;
    var PostMessageSession;
    var extend;

    beforeAll(function() {
        Function.prototype.bind = require('function-bind');
    });

    beforeEach(function() {
        PlayerSession = require('../../lib/PlayerSession');
        PostMessageSession = require('../../lib/PostMessageSession');
        extend = require('../../lib/fns').extend;
    });

    it('should exist', function() {
        expect(PlayerSession).toEqual(jasmine.any(Function));
        expect(PlayerSession.name).toBe('PlayerSession');
    });

    describe('instance:', function() {
        var session;
        var frame, win;

        beforeEach(function() {
            frame = document.createElement('iframe');
            document.body.appendChild(frame);
            win = frame.contentWindow;

            session = new PlayerSession(win);
        });

        afterEach(function() {
            document.body.removeChild(frame);
        });

        it('should be a PostMessageSession', function() {
            expect(session).toEqual(jasmine.any(PostMessageSession));
        });

        describe('properties:', function() {
            describe('ready', function() {
                it('should be false', function() {
                    expect(session.ready).toBe(false);
                });

                describe('when the session emits "ready"', function() {
                    beforeEach(function() {
                        session.emit('ready');
                    });

                    it('should be true', function() {
                        expect(session.ready).toBe(true);
                    });
                });
            });
        });

        describe('methods:', function() {
            describe('post(type, event, data, [id])', function() {
                var getID;
                var event, data;
                var result;

                beforeEach(function() {
                    getID = PlayerSession.getID;

                    event = 'handshake';
                    data = { foo: 'bar' };

                    spyOn(PlayerSession, 'getID').and.callThrough();
                    spyOn(PostMessageSession.prototype, 'post').and.callFake(function() { return getID(); });
                });

                describe('if the session is not ready', function() {
                    beforeEach(function() {
                        session.ready = false;
                    });

                    ['request', 'ping'].forEach(function(type) {
                        describe('and the type is "' + type + '"', function() {
                            beforeEach(function() {
                                result = session.post(type, event, data);
                            });

                            it('should return a unique id', function() {
                                expect(result).toBe(PlayerSession.getID.calls.mostRecent().returnValue);
                            });

                            it('should not call super()', function() {
                                expect(PostMessageSession.prototype.post).not.toHaveBeenCalled();
                            });

                            describe('when the session is ready', function() {
                                var id;

                                beforeEach(function() {
                                    id = getID();
                                    expect(session.post(type, event, data, id)).toBe(id);

                                    session.emit('ready');
                                });

                                it('should call super() on all of the posts', function() {
                                    expect(PostMessageSession.prototype.post).toHaveBeenCalledWith(type, event, data, result);
                                    expect(PostMessageSession.prototype.post).toHaveBeenCalledWith(type, event, data, id);
                                    expect(PostMessageSession.prototype.post.calls.count()).toBe(2);
                                });
                            });
                        });
                    });

                    ['response'].forEach(function(type) {
                        describe('and the type is "' + type + '"', function() {
                            beforeEach(function() {
                                result = session.post(type, event, data);
                            });

                            it('should call super()', function() {
                                expect(PostMessageSession.prototype.post).toHaveBeenCalledWith(type, event, data);
                                expect(result).toBe(PostMessageSession.prototype.post.calls.mostRecent().returnValue);
                            });
                        });
                    });
                });

                describe('if the session is ready', function() {
                    beforeEach(function() {
                        session.ready = true;
                    });

                    ['request', 'ping', 'response'].forEach(function(type) {
                        describe('and the type is "' + type + '"', function() {
                            beforeEach(function() {
                                result = session.post(type, event, data);
                            });

                            it('should call super()', function() {
                                expect(PostMessageSession.prototype.post).toHaveBeenCalledWith(type, event, data);
                                expect(result).toBe(PostMessageSession.prototype.post.calls.mostRecent().returnValue);
                            });
                        });
                    });
                });
            });

            describe('init(data)', function() {
                var success, failure;
                var data;

                beforeEach(function() {
                    success = jasmine.createSpy('success()');
                    failure = jasmine.createSpy('failure()');

                    data = { standalone: true, interstitial: false };
                });

                describe('if called before the handshake request', function() {
                    beforeEach(function(done) {
                        session.init(data).then(success, failure);
                        setTimeout(done, 0);
                    });

                    it('should not fulfill the promise', function() {
                        expect(success).not.toHaveBeenCalled();
                        expect(failure).not.toHaveBeenCalled();
                    });

                    describe('when the handshake request is received', function() {
                        var respond;

                        beforeEach(function(done) {
                            respond = jasmine.createSpy('respond()');
                            session.emit('handshake', null, respond);

                            setTimeout(done, 0);
                        });

                        it('should respond to the handshake', function() {
                            expect(respond).toHaveBeenCalledWith({
                                success: true,
                                appData: extend(data, { version: 1 })
                            });
                        });

                        it('should not fulfill the promise', function() {
                            expect(success).not.toHaveBeenCalled();
                        });

                        describe('when ready is emitted', function() {
                            beforeEach(function(done) {
                                session.emit('ready');

                                setTimeout(done, 0);
                            });

                            it('should fulfill the promise', function() {
                                expect(success).toHaveBeenCalledWith(session);
                            });
                        });
                    });
                });

                describe('if called after the handshake request', function() {
                    var respond;

                    beforeEach(function(done) {
                        respond = jasmine.createSpy('respond()');
                        session.emit('handshake', null, respond);

                        session.init(data).then(success, failure);
                        setTimeout(done, 0);
                    });

                    it('should respond to the handshake', function() {
                        expect(respond).toHaveBeenCalledWith({
                            success: true,
                            appData: extend(data, { version: 1 })
                        });
                    });

                    it('should not fulfill the promise', function() {
                        expect(success).not.toHaveBeenCalled();
                    });

                    describe('when ready is emitted', function() {
                        beforeEach(function(done) {
                            session.emit('ready');

                            setTimeout(done, 0);
                        });

                        it('should fulfill the promise', function() {
                            expect(success).toHaveBeenCalledWith(session);
                        });
                    });
                });
            });
        });
    });
});
