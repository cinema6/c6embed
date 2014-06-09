(function() {
    'use strict';

    describe('DocumentParser', function() {
        var DocumentParser;

        var documentParser;

        var indexHTML;

        beforeEach(function() {
            indexHTML = require('../helpers/mock_index.js');

            DocumentParser = require('../../src/DocumentParser');

            documentParser = new DocumentParser({});
        });

        it('should exist', function() {
            expect(documentParser).toEqual(jasmine.any(Function));
        });

        describe('ParsedDocument', function() {
            var document;

            beforeEach(function() {
                document = documentParser(indexHTML);
            });

            describe('properties', function() {
                describe('html', function() {
                    it('should be the provided html', function() {
                        expect(document.html).toBe(indexHTML);
                    });
                });
            });

            describe('methods', function() {
                describe('injectScript(fn)', function() {
                    var fn,
                        result;

                    beforeEach(function() {
                        fn = function() {
                            window.foo = 'bar';
                            window.moreStuff = 'hello';
                        };

                        result = document.injectScript(fn);
                    });

                    it('should inject the function into the HTML', function() {
                        expect(document.html.match(/<head>/).length).toBe(1);
                        expect(document.html.match(/<\/head>/).length).toBe(1);
                        expect(document.html).toContain('<head><script>(' + fn.toString() + '(window));</script>');
                    });

                    it('should be chainable', function() {
                        expect(result).toBe(document);
                    });
                });

                describe('setGlobalObject(prop, object)', function() {
                    beforeEach(function() {
                        spyOn(document, 'injectScript').and.callThrough();
                    });

                    it('should inject a script that sets the global up', function() {
                        expect(document.setGlobalObject('c6', {
                            foo: 'bar',
                            test: true
                        })).toBe(document);

                        expect(document.injectScript.calls.mostRecent().args[0].toString()).toBe([
                            'function(window) {',
                            '    window["c6"] = ' + JSON.stringify({ foo: 'bar', test: true }) + ';',
                            '}'
                        ].join('\n'));
                    });
                });

                describe('setBase(href)', function() {
                    var base,
                        result;

                    beforeEach(function() {
                        base = 'http://portal.cinema6.com/apps/rumble/';

                        result = document.setBase(base);
                    });

                    it('should inject a base tag into the HTML', function() {
                        expect(document.html.match(/<head>/).length).toBe(1);
                        expect(document.html.match(/<\/head>/).length).toBe(1);
                        expect(document.html).toContain('<head><base href="' + base + '">');
                    });

                    it('should be chainable', function() {
                        expect(result).toBe(document);
                    });
                });

                describe('toString()', function() {
                    it('should return the document as a string', function() {
                        expect(document.toString()).toBe(indexHTML);
                    });
                });
            });
        });
    });
}());
