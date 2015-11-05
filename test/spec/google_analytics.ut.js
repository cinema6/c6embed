var __googleAnalytics__ = require('../../lib/google_analytics');

describe('googleAnalytics(global, name, accountId, params)', function() {
    'use strict';

    var scripts, analytics;
    var googleAnalytics;
    var global, name, accountId, params;
    var result;

    beforeEach(function() {
        scripts = [];
        analytics = [];

        googleAnalytics = jasmine.createSpy('googleAnalytics()').and.callFake(__googleAnalytics__);

        var createElement = document.createElement;
        spyOn(document, 'createElement').and.callFake(function(tagName) {
            var tag = tagName.toLowerCase();
            var element;

            if (tag === 'script') {
                element = createElement.call(document, 'x-script');
                scripts.push(element);

                try { spyOn(window, global); } catch(e) {}
            } else {
                element = createElement.call(document, tag);
            }

            return element;
        });

        global = '__c6_ga__';
        name = '00f21f522377ac';
        accountId = 'UA-44457821-12';
        params = {
            storage: 'none',
            cookieDomain: 'none'
        };

        delete window[global];
        expect(__googleAnalytics__.trackers).toEqual(jasmine.any(Object));
        __googleAnalytics__.trackers = {};

        result = googleAnalytics(global, name, accountId, params);
    });

    afterEach(function() {
        __googleAnalytics__.trackers = {};

        googleAnalytics.calls.all().forEach(function(call) {
            delete window[call.args[0]];
        });
    });

    it('should load analytics.js', function() {
        expect(scripts.map(function(script) { return script.src; })).toContain('https://www.google-analytics.com/analytics.js');
    });

    it('should create the tracker', function() {
        expect(window[global]).toHaveBeenCalledWith('create', accountId, {
            name: name,
            storage: params.storage,
            cookieDomain: params.cookieDomain
        });
    });

    it('should return a function', function() {
        expect(result).toEqual(jasmine.any(Function));
    });

    it('should cache the function', function() {
        expect(__googleAnalytics__.trackers[global + ':' + name]).toBe(result);
    });

    describe('result(method, ...args)', function() {
        var method, param1, param2;

        beforeEach(function() {
            method = 'send';
            param1 = 'event';
            param2 = { foo: 'bar' };

            result(method, param1, param2);
        });

        it('should call the tracker with the provided params', function() {
            expect(window[global]).toHaveBeenCalledWith(name + '.' + method, param1, param2);
        });
    });

    describe('if the same global is used again', function() {
        var tracker1, tracker2;

        beforeEach(function() {
            accountId = 'UA-44457821-6';
            params = {};

            tracker1 = result;
        });

        describe('and the name is different', function() {
            beforeEach(function() {
                name = 'aeba87a5cd7173';

                tracker2 = googleAnalytics(global, name, accountId, params);
            });

            it('should not load the GA script again', function() {
                expect(scripts.filter(function(script) {
                    return script.src === 'https://www.google-analytics.com/analytics.js';
                }).length).toBe(1);
            });

            it('should create a new tracker', function() {
                expect(tracker2).not.toBe(tracker1);
                expect(window[global]).toHaveBeenCalledWith('create', accountId, {
                    name: name
                });
            });
        });

        describe('and the name is the same', function() {
            beforeEach(function() {
                window[global].calls.reset();
            });

            describe('and the function is called with more than the global and name', function() {
                beforeEach(function() {
                    expect(function() {
                        tracker2 = googleAnalytics(global, name, accountId, params);
                    }).toThrow(new Error('Cannot specify accountId or params for GA tracker [' + name + '] because it has already been created.'));
                });

                it('should not load the GA script again', function() {
                    expect(scripts.filter(function(script) {
                        return script.src === 'https://www.google-analytics.com/analytics.js';
                    }).length).toBe(1);
                });

                it('should not create a tracker', function() {
                    expect(window[global]).not.toHaveBeenCalled();
                });
            });

            describe('and the function is called with just a global and name', function() {
                beforeEach(function() {
                    tracker2 = googleAnalytics(global, name);
                });

                it('should return the tracker', function() {
                    expect(tracker2).toBe(tracker1);
                });

                it('should not create a tracker', function() {
                    expect(window[global]).not.toHaveBeenCalled();
                });
            });
        });
    });

    describe('if a different global is used', function() {
        var tracker1, tracker2;

        beforeEach(function() {
            global = '__ga__';
            delete window[global];

            tracker1 = result;
        });

        describe('and the name is the same', function() {
            beforeEach(function() {
                tracker2 = googleAnalytics(global, name, accountId, params);
            });

            it('should create a new tracker', function() {
                expect(tracker2).not.toBe(tracker1);
                expect(window[global]).toHaveBeenCalledWith('create', accountId, {
                    name: name,
                    storage: params.storage,
                    cookieDomain: params.cookieDomain
                });
            });

            it('should create a new global', function() {
                expect(scripts.filter(function(script) {
                    return script.src === 'https://www.google-analytics.com/analytics.js';
                }).length).toBe(2);
            });
        });

        describe('and the name is different', function() {
            beforeEach(function() {
                name = 'aeba87a5cd7173';

                tracker2 = googleAnalytics(global, name, accountId, params);
            });

            it('should create a new tracker', function() {
                expect(tracker2).not.toBe(tracker1);
                expect(window[global]).toHaveBeenCalledWith('create', accountId, {
                    name: name,
                    storage: params.storage,
                    cookieDomain: params.cookieDomain
                });
            });

            it('should create a new global', function() {
                expect(scripts.filter(function(script) {
                    return script.src === ('https://www.google-analytics.com/analytics.js');
                }).length).toBe(2);
            });
        });
    });
});
