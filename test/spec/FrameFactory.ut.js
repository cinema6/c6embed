(function() {
    'use strict';

    describe('FrameFactory', function() {
        var FrameFactory,
            DocumentParser,
            C6Query,
            q;

        var frameFactory,
            documentParser,
            fakeDocumentParser,
            $;

        var mockHtml,
            parsedDoc;

        beforeEach(function() {
            mockHtml = require('../helpers/mock_index.js');

            q = require('../../node_modules/q/q');
            C6Query = require('../../lib/C6Query');
            FrameFactory = require('../../src/FrameFactory');
            DocumentParser = require('../../src/DocumentParser');

            documentParser = new DocumentParser({});
            fakeDocumentParser = jasmine.createSpy('documentParser()')
                .and.callFake(function() {
                    parsedDoc = documentParser.apply(null, arguments);

                    spyOn(parsedDoc, 'injectScript').and.callThrough();

                    return parsedDoc;
                });
            $ = new C6Query({ window: window, document: document });

            frameFactory = new FrameFactory({ $: $, documentParser: fakeDocumentParser, q: q });
        });

        it('should exist', function() {
            expect(frameFactory).toEqual(jasmine.any(Function));
        });

        describe('the iframe', function() {
            var $iframe;

            beforeEach(function() {
                $iframe = $(frameFactory()[0]);
            });

            it('should have a src of about:blank', function() {
                expect($iframe.attr('src')).toBe('about:blank');
            });

            it('should have a width of 100%', function() {
                expect($iframe.attr('width')).toBe('100%');
            });

            it('should have a height of 0', function() {
                expect($iframe.attr('height')).toBe('0');
            });

            it('should be positioned absolutely', function() {
                expect($iframe.attr('style')).toContain('position: absolute;');
            });

            it('should be in the top left corner', function() {
                expect($iframe.attr('style')).toContain('top: 0px;');
                expect($iframe.attr('style')).toContain('left: 0px;');
            });

            it('should have a z-index of 100', function() {
                expect($iframe.attr('style')).toContain('z-index: 100;');
            });

            it('should not be scrollable', function() {
                expect($iframe.attr('scrolling')).toBe('no');
            });

            it('should have no border', function() {
                expect($iframe.attr('style')).toContain('border: none;');
            });

            it('should have the c6__cant-touch-this class', function() {
                expect($iframe.hasClass('c6__cant-touch-this')).toBe(true);
            });
        });

        describe('methods', function() {
            var $result,
                $iframe;

            beforeEach(function() {
                $result = frameFactory();
                $iframe = $result;
            });

            describe('load(html, cb)', function() {
                var cb,
                    success;

                beforeEach(function() {
                    success = jasmine.createSpy('success');
                    cb = jasmine.createSpy('callback()').and.returnValue(true);
                    spyOn($result, 'prop').and.callThrough();

                    $result.load(mockHtml, cb).then(success);
                });

                it('should parse the document', function() {
                    expect(fakeDocumentParser).toHaveBeenCalledWith(mockHtml);
                });

                it('should attach a callback to the iframe', function() {
                    expect($iframe[0].c6Loaded).toEqual(jasmine.any(Function));
                });

                describe('script injection', function() {
                    var fn, win;

                    beforeEach(function() {
                        fn = parsedDoc.injectScript.calls.mostRecent().args[0];
                        win = {
                            frameElement: {
                                c6Loaded: $iframe[0].c6Loaded
                            },
                            parent: {
                                location: {
                                    href: 'http://wp.cinema6.com/wordpress'
                                }
                            },
                            history: {}
                        };
                    });

                    it('should inject a script that calls the callback function and resolves the promise with the callback return value', function(done) {
                        win.frameElement.c6Loaded(win);

                        expect(cb).toHaveBeenCalledWith(win);
                        setTimeout(function() {
                            expect(success).toHaveBeenCalledWith(true);
                            done();
                        }, 10);
                    });

                    describe('if the browser supports "replaceState"', function() {
                        beforeEach(function() {
                            win.history.replaceState = jasmine.createSpy('history.replaceState()');

                            fn(win);
                        });

                        it('should put a history entry for the current page in', function() {
                            expect(win.history.replaceState).toHaveBeenCalledWith({}, 'parent', win.parent.location.href);
                            expect(win.history.replaceState.calls.mostRecent().object).toBe(win.history);
                        });
                    });
                });

                it('should put the HTML on the iframe as an attribute', function() {
                    expect($iframe.attr('data-srcdoc')).toBe(parsedDoc.toString());
                });

                it('should set the src to a jsurl that will load the document', function() {
                    /* jshint scripturl:true */
                    expect($result.prop).toHaveBeenCalledWith('src', 'javascript: window.frameElement.getAttribute(\'data-srcdoc\')');
                    expect($iframe.attr('src')).toBe('javascript: window.frameElement.getAttribute(\'data-srcdoc\')');
                    /* jshint scripturl:false */
                });
            });

            describe('fullscreen(bool)', function() {
                it('should be chainable', function() {
                    [true, false].forEach(function(bool) {
                        expect($result.fullscreen(bool)).toBe($result);
                    });
                });

                describe('when true is passed in', function() {
                    beforeEach(function() {
                        $result.fullscreen(true);
                    });

                    it('should give the iframe fullscreen styles', function() {
                        ['position: fixed;', 'top: 0px;', 'left: 0px;', 'bottom: 0px;', 'right: 0px;', 'z-index: 9007199254740992;']
                            .forEach(function(definition) {
                                expect($iframe.attr('style')).toContain(definition);
                            });
                    });
                });

                describe('when false is passed in', function() {
                    beforeEach(function() {
                        $result.fullscreen(true);
                        $result.fullscreen(false);
                    });

                    it('should remove any fullscreen styles', function() {
                        ['position: absolute;', 'top: 0px;', 'left: 0px;']
                            .forEach(function(definition) {
                                expect($iframe.attr('style')).toContain(definition);
                            });

                        ['bottom: 0px;', 'right: 0px;', 'z-index: 9007199254740992;']
                            .forEach(function(definition) {
                                expect($iframe.attr('style')).not.toContain(definition);
                            });
                    });
                });
            });

            describe('show()', function() {
                beforeEach(function() {
                    $result.show();
                });

                it('should set the height to 100%', function() {
                    expect($result.attr('height')).toBe('100%');
                });
            });

            describe('hide()', function() {
                beforeEach(function() {
                    $result.show();
                    $result.hide();
                });

                it('should set the height to 0', function() {
                    expect($result.attr('height')).toBe('0');
                });
            });
        });
    });
}());
