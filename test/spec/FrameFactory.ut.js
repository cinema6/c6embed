(function() {
    'use strict';

    describe('FrameFactory', function() {
        var FrameFactory,
            DocumentParser,
            C6Query;

        var frameFactory,
            documentParser,
            fakeDocumentParser,
            $;

        var mockHtml,
            parsedDoc;

        beforeEach(function() {
            mockHtml = require('../helpers/mock_index.js');

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

            frameFactory = new FrameFactory({ $: $, documentParser: fakeDocumentParser });
        });

        it('should exist', function() {
            expect(frameFactory).toEqual(jasmine.any(Function));
        });

        it('should return an iframe wrapped in a div', function() {
            var $result = frameFactory();

            expect($result.prop('tagName')).toBe('DIV');
            expect($result[0].childNodes[1].tagName).toBe('IFRAME');
        });

        describe('the iframe', function() {
            var $iframe;

            beforeEach(function() {
                $iframe = $(frameFactory()[0].childNodes[1]);
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

        describe('the div', function() {
            var $div;

            [[null, null], ['100px', null], [null, '200px']].forEach(function(args) {
                describe('if ' + args + ' are supplied as arguments', function() {
                    beforeEach(function() {
                        $div = frameFactory.apply(null, args);
                    });

                    it('should give the div responsive styles', function() {
                        var styles = $div.attr('style').toString();

                        ['position: relative;', 'width: 100%;', 'height: 0px;', 'box-sizing: border-box;', 'font-size: 16px;']
                            .forEach(function(style) {
                                expect(styles).toContain(style);
                            });
                    });
                });
            });

            describe('if a width and height are specified', function() {
                beforeEach(function() {
                    $div = frameFactory('70%', '300px');
                });

                it('should give the div static styles', function() {
                    var styles = $div.attr('style').toString();

                    ['position: relative;', 'width: 70%;', 'height: 300px;'].forEach(function(style) {
                        expect(styles).toContain(style);
                    });
                });
            });
        });

        describe('methods', function() {
            var $result,
                $iframe;

            beforeEach(function() {
                $result = frameFactory();
                $iframe = $($result[0].childNodes[1]);
            });

            describe('load(html, cb)', function() {
                var cb;

                beforeEach(function() {
                    cb = jasmine.createSpy('callback()');

                    $result.load(mockHtml, cb);
                });

                it('should parse the document', function() {
                    expect(fakeDocumentParser).toHaveBeenCalledWith(mockHtml);
                });

                it('should attach the callback to the iframe', function() {
                    expect($iframe[0].c6Loaded).toBe(cb);
                });

                describe('script injection', function() {
                    var fn, win;

                    beforeEach(function() {
                        fn = parsedDoc.injectScript.calls.mostRecent().args[0];
                        win = {
                            frameElement: {
                                c6Loaded: cb
                            },
                            parent: {
                                location: {
                                    href: 'http://wp.cinema6.com/wordpress'
                                }
                            },
                            history: {}
                        };
                    });

                    it('should inject a script that calls the callback function', function() {
                        fn(win);

                        expect(cb).toHaveBeenCalledWith(win);
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
                    expect($iframe.attr('src')).toBe('javascript: window.frameElement.getAttribute(\'data-srcdoc\')');
                    /* jshint scripturl:false */
                });
            });
        });
    });
}());
