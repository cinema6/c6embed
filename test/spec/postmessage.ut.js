(function() {
    'use strict';

    describe('postmessage.js', function() {
        var PostMessage,
            q,
            asEvented,
            postmessage;

        beforeEach(function() {
            PostMessage = require('../../lib/postmessage');
            q = require('../../node_modules/q/q');
            asEvented = require('../../node_modules/asEvented/asevented');

            postmessage = new PostMessage({ q: q, asEvented: asEvented });
        });

        it('should exist', function() {
            expect(postmessage).toEqual(jasmine.any(Object));
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
                                expect(value).toEqual(noop);
                            } else {
                                expect(value).not.toBeDefined();
                            }
                        }
                    });
                });
            });
        });
    });
}());
