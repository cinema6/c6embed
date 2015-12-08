describe('PostMessageSession(win)', function() {
    'use strict';

    var PostMessageSession;
    var RCPostMessageSession;
    var Promise;

    beforeEach(function() {
        RCPostMessageSession = require('rc-post-message-session');
        PostMessageSession = require('../../lib/PostMessageSession');
        Promise = require('q')().constructor;
    });

    it('should exist', function() {
        expect(PostMessageSession).toEqual(jasmine.any(Function));
        expect(PostMessageSession.name).toBe('PostMessageSession');
    });

    describe('instance:', function() {
        var frame, win;
        var session;

        beforeEach(function() {
            frame = document.createElement('iframe');
            document.body.appendChild(frame);
            win = frame.contentWindow;

            session = new PostMessageSession(win);
        });

        afterEach(function() {
            document.body.removeChild(frame);
        });

        it('should be an RCPostMessageSession', function() {
            expect(session).toEqual(jasmine.any(RCPostMessageSession));
        });

        describe('methods:', function() {
            describe('request(event, data)', function() {
                var event, data;
                var result;

                beforeEach(function() {
                    event = 'some-request';
                    data = { nums: [1, 2, 3] };

                    spyOn(RCPostMessageSession.prototype, 'request').and.callThrough();

                    result = session.request(event, data);
                });

                it('should return a q Promise', function() {
                    expect(result).toEqual(jasmine.any(Promise));
                });

                it('should call super()', function() {
                    expect(RCPostMessageSession.prototype.request).toHaveBeenCalledWith(event, data);
                });
            });
        });
    });
});
