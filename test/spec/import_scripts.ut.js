var importScripts = require('../../lib/importScripts.js');
var createElement = document.createElement;

describe('importScripts(scripts, callback)', function() {
    'use strict';

    var iframes;
    var contentWindows;

    function MockIframe() {
        var attributes = {};
        var handlers = {
            load: []
        };

        Object.defineProperties(this, {
            src: {
                get: function() {
                    return this.getAttribute('src');
                },

                set: function(value) {
                    return this.setAttribute('src', value);
                }
            }
        });

        this.setAttribute = jasmine.createSpy('iframe.setAttribute()')
            .and.callFake(function(attribute, value) {
                attributes[attribute] = value;
            });
        this.getAttribute = jasmine.createSpy('iframe.getAttribute()')
            .and.callFake(function(attribute) {
                return attributes[attribute] || null;
            });

        this.addEventListener = jasmine.createSpy('iframe.addEventListener()')
            .and.callFake(function(name, handler) {
                handlers[name].push(handler);
            });

        this.__trigger__ = function(name, event) {
            handlers[name].forEach(function(handler) {
                handler(event);
            });
        };

        iframes.push(this);
    }

    function MockContentWindow() {
        this.document = document.createDocumentFragment();
        this.document.appendChild(createElement.call(document, 'head'));
        this.document.appendChild(createElement.call(document, 'body'));
        this.document.head = this.document.querySelector('head');
        this.document.body = this.document.querySelector('body');
        this.document.write = jasmine.createSpy('document.write()');
        this.document.close = jasmine.createSpy('document.close()');

        contentWindows.push(this);
    }

    beforeEach(function() {
        iframes = [];
        contentWindows = [];
    });

    it('should exist', function() {
        expect(importScripts).toEqual(jasmine.any(Function));
    });

    describe('properties:', function() {
        describe('cache', function() {
            it('should be an object', function() {
                expect(importScripts.cache).toEqual({});
            });
        });
    });

    describe('methods:', function() {
        describe('withConfig(config)', function() {
            var result;
            var config;

            beforeEach(function() {
                config = {
                    paths: {
                        adtech: '//aka-cdn.adtechus.com/dt/common/DAC.js'
                    },
                    shim: {
                        adtech: {
                            exports: 'ADTECH',
                            onCreateFrame: function(window) {
                                window.c6 = window.parent.c6;
                            }
                        }
                    },
                    cache: {
                        '//foo.com/foo.js': {
                            foo: 'bar'
                        }
                    },
                    container: createElement.call(document, 'div')
                };

                result = importScripts.withConfig(config);
            });

            it('should return a new importScripts function', function() {
                expect(result).toEqual(jasmine.any(Function));
                expect(result.toString()).toBe(importScripts.toString());
                expect(Object.keys(result)).toEqual(Object.keys(importScripts));

                expect(result).not.toBe(importScripts);
                expect(result.cache).not.toBe(importScripts.cache);
            });

            describe('when the new function is called', function() {
                var importScripts;
                var callback;
                var success, failure;
                var iframe;

                beforeEach(function() {
                    var createElement = document.createElement;
                    spyOn(document, 'createElement').and.callFake(function(tag) {
                        switch (tag.toLowerCase()) {
                        case 'iframe':
                            return new MockIframe();
                        default:
                            return createElement.call(document, tag);
                        }
                    });

                    var appendChild = config.container.appendChild;
                    spyOn(config.container, 'appendChild').and.callFake(function(child) {
                        if (child instanceof MockIframe) {
                            child.contentWindow = new MockContentWindow();
                        } else {
                            return appendChild.call(config.container, child);
                        }
                    });

                    importScripts = result;

                    callback = jasmine.createSpy('callback()');
                    success = jasmine.createSpy('success()');
                    failure = jasmine.createSpy('failure()');

                    result = importScripts(['adtech', '//foo.com/foo.js'], callback);
                    result.then(success, failure);

                    iframe = iframes[0];
                });

                it('should use the paths config', function() {
                    expect(iframe.contentWindow.document.write).toHaveBeenCalledWith(jasmine.stringMatching(
                        '<script src="' + config.paths.adtech + '"'
                    ));
                });

                it('should use the onCreateFrame shim config', function() {
                    var html = iframe.contentWindow.document.write.calls.mostRecent().args[0];

                    expect(html).toContain('<script>(' + config.shim.adtech.onCreateFrame.toString() + '(window))<\/script>');
                });

                it('should use the container', function() {
                    expect(config.container.appendChild).toHaveBeenCalledWith(iframe);
                });

                describe('when the iframe is loaded', function() {
                    beforeEach(function(done) {
                        iframe.contentWindow.document.head.appendChild(createElement.call(document, 'script'));
                        iframe.contentWindow.module = {
                            exports: {}
                        };
                        iframe.contentWindow.ADTECH = {
                            loadAd: function() {}
                        };

                        iframe.__load__();
                        result.finally(done);
                    });

                    it('should callback with the specified global', function() {
                        expect(callback).toHaveBeenCalledWith(iframe.contentWindow.ADTECH, config.cache['//foo.com/foo.js']);
                    });

                    it('should fulfill with the specified global', function() {
                        expect(success).toHaveBeenCalledWith([iframe.contentWindow.ADTECH, config.cache['//foo.com/foo.js']]);
                    });
                });
            });
        });
    });

    describe('when called', function() {
        var srcs, callback;
        var result;
        var success, failure;

        beforeEach(function() {
            var createElement = document.createElement;
            spyOn(document, 'createElement').and.callFake(function(tag) {
                switch (tag.toLowerCase()) {
                case 'iframe':
                    return new MockIframe();
                default:
                    return createElement.call(document, tag);
                }
            });

            var appendChild = document.head.appendChild;
            spyOn(document.head, 'appendChild').and.callFake(function(child) {
                if (child instanceof MockIframe) {
                    child.contentWindow = new MockContentWindow();
                } else {
                    return appendChild.call(document.head, child);
                }
            });

            srcs = [
                '//aka-cdn.adtechus.com/dt/common/DAC.js',
                '//lib.cinema6.com/twobits.js/v0.0.1-0-g7a19518/twobits.min.js',
                '//portal.cinema6.com/collateral/splash/splash.js'
            ];
            callback = jasmine.createSpy('callback()');

            success = jasmine.createSpy('success()');
            failure = jasmine.createSpy('failure()');

            importScripts.cache = {};

            result = importScripts(srcs, callback);
            result.then(success, failure);
        });

        describe('with an empty array', function() {
            beforeEach(function(done) {
                callback.calls.reset();
                success.calls.reset();
                failure.calls.reset();

                result = importScripts([], callback);
                result.then(success, failure).finally(done);
            });

            it('should immediately call back', function() {
                expect(callback).toHaveBeenCalledWith();
            });

            it('should immediately fulfill', function() {
                expect(success).toHaveBeenCalledWith([]);
            });
        });

        describe('if no callback is specified', function() {
            beforeEach(function(done) {
                iframes = [];
                success.calls.reset();
                failure.calls.reset();

                srcs = [
                    '//lib.cinema6.com/twobits.js/v0.0.1-0-g7a19518/twobits.min.js'
                ];

                result = importScripts(srcs);
                result.then(success, failure).finally(done);

                iframes[0].contentWindow.document.head.appendChild(createElement.call(document, 'script'));
                iframes[0].contentWindow.module = {
                    exports: { foo: 'hey' }
                };
                iframes[0].__load__();
            });

            it('should only invoke the Promise API', function() {
                expect(success).toHaveBeenCalledWith([iframes[0].contentWindow.module.exports]);
            });
        });

        describe('if some items have already been imported', function() {
            var iframe;
            var modules;

            beforeEach(function() {
                modules = [
                    { name: 'Josh' },
                    { name: 'Scott' },
                    { name: 'Evan' }
                ];

                iframes.forEach(function(iframe, index) {
                    iframe.contentWindow.document.head.appendChild(createElement.call(document, 'script'));
                    iframe.contentWindow.module = {
                        exports: modules[index]
                    };

                    iframe.__load__();
                });

                callback.calls.reset();
                success.calls.reset();
                failure.calls.reset();
                document.createElement.calls.reset();
                iframes.length = 0;

                srcs[1] += '?cb=89yr8493';

                result = importScripts(srcs, callback);
                result.then(success, failure);

                iframe = iframes[0];
            });

            it('should only create an iframe for the module it does not have', function() {
                expect(document.createElement.calls.count()).toBe(1);
            });

            describe('when that iframe has loaded', function() {
                beforeEach(function(done) {
                    iframe.contentWindow.document.head.appendChild(createElement.call(document, 'script'));
                    iframe.contentWindow.module = {
                        exports: {
                            age: 23
                        }
                    };
                    iframe.__load__();

                    result.finally(done);
                });

                it('should callback', function() {
                    expect(callback).toHaveBeenCalledWith(modules[0], iframe.contentWindow.module.exports, modules[2]);
                });

                it('should fulfill', function() {
                    expect(success).toHaveBeenCalledWith([modules[0], iframe.contentWindow.module.exports, modules[2]]);
                });
            });
        });

        it('should create an iframe for each script', function() {
            expect(document.createElement.calls.count()).toBe(srcs.length);
            document.createElement.calls.all().forEach(function(call) {
                expect(call.args).toEqual(['iframe']);
            });
            iframes.forEach(function(iframe, index) {
                expect(iframe.src).toBe('about:blank');
                expect(iframe.getAttribute('data-module')).toBe(srcs[index]);
            });
        });

        it('should append each iframe to the head of the page', function() {
            iframes.forEach(function(iframe) {
                expect(document.head.appendChild).toHaveBeenCalledWith(iframe);
            });
        });

        it('should write some HTML into each iframe', function() {
            iframes.forEach(function(iframe, index) {
                var src = srcs[index];

                expect(iframe.contentWindow.document.write).toHaveBeenCalledWith([
                        '<script>',
                        '(' + function(window) {
                            var href = window.parent.location.href;

                            try {
                                // This hack is needed in order for the browser to send the
                                // "referer" header in Safari.
                                window.history.replaceState(null, null, href);
                            } catch(e) {}
                            window.Text = window.parent.Text;
                            window.module = {
                                exports: {}
                            };
                            window.exports = window.module.exports;
                        }.toString() + '(window))',
                        '<\/script>',
                        '<script>(' + (function() {}).toString() + '(window))<\/script>',
                        '<script src="' + src + '"',
                        '    onload="window.frameElement.__load__()"',
                        '    onerror="window.frameElement.__error__()"',
                        '    charset="utf-8">',
                        '<\/script>'
                ].join('\n'));
                expect(iframe.contentWindow.document.close).toHaveBeenCalled();
            });
        });

        describe('when a <script> loads', function() {
            var iframe;
            var src;

            beforeEach(function() {
                iframe = iframes[1];
                src = srcs[1];

                iframe.contentWindow.document.head.appendChild(createElement.call(document, 'script'));
                iframe.contentWindow.module = {
                    exports: {}
                };

                iframe.__load__();
            });

            it('should cache the module\'s exports', function() {
                expect(importScripts.cache[src]).toBe(iframe.contentWindow.module.exports);
            });
        });

        it('should call the callback when all of the iframes load', function(done) {
            iframes[1].contentWindow.document.head.appendChild(createElement.call(document, 'script'));
            iframes[1].contentWindow.module = {
                exports: { foo: 'bar' }
            };
            iframes[1].__load__();
            expect(callback).not.toHaveBeenCalled();

            iframes[2].contentWindow.document.head.appendChild(createElement.call(document, 'script'));
            iframes[2].contentWindow.module = {
                exports: { foo: 'foo' }
            };
            iframes[2].__load__();
            expect(callback).not.toHaveBeenCalled();

            iframes[0].contentWindow.document.head.appendChild(createElement.call(document, 'script'));
            iframes[0].contentWindow.module = {
                exports: { foo: 'hey' }
            };
            iframes[0].__load__();

            expect(callback).toHaveBeenCalledWith(
                iframes[0].contentWindow.module.exports,
                iframes[1].contentWindow.module.exports,
                iframes[2].contentWindow.module.exports
            );

            result.finally(function() {
                expect(success).toHaveBeenCalledWith([
                    iframes[0].contentWindow.module.exports,
                    iframes[1].contentWindow.module.exports,
                    iframes[2].contentWindow.module.exports
                ]);
            }).then(done, done.fail);
        });

        describe('if a <script> fails to load', function() {
            beforeEach(function(done) {
                iframes[0].contentWindow.document.head.appendChild(createElement.call(document, 'script'));
                iframes[0].contentWindow.module = {
                    exports: { foo: 'hey' }
                };
                iframes[0].__load__();

                iframes[2].contentWindow.document.head.appendChild(createElement.call(document, 'script'));
                iframes[2].__error__();

                result.finally(done);
            });

            it('should not call the callback()', function() {
                expect(callback).not.toHaveBeenCalled();
            });

            it('should reject the Promise', function() {
                expect(failure).toHaveBeenCalledWith(new Error('Failed to load script [' + srcs[2] + '].'));
            });
        });
    });
});
