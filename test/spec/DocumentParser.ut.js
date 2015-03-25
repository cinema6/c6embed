(function() {
    'use strict';

    describe('DocumentParser', function() {
        var DocumentParser;

        var documentParser;

        var indexHTML;
        var indexHTML2;

        beforeEach(function() {
            indexHTML = require('../helpers/mock_index.js');
            indexHTML2 = require('../helpers/mock_index--2.0.js');

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

            it('should throw an error if not given an HTML document', function() {
                expect(function() {
                    document = documentParser('I Suck!');
                }).toThrow();
            });

            describe('if called with macro values', function() {
                beforeEach(function() {
                    document = documentParser(indexHTML2, {
                        mode: 'mobile',
                        script: 'main.js',
                        foo: 'bar'
                    });
                });

                it('should replace the dynamic variables with the provided values', function() {
                    expect(document.toString()).toContain('<link rel="stylesheet" href="css/mobile.css" />');
                    expect(document.toString()).toContain('<script src="main.js"></script>');
                    expect(document.toString()).toContain('The mode is mobile!');
                });
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
                        expect(document.html).toContain('<head><base href="' + base + '"/>');
                    });

                    it('should be chainable', function() {
                        expect(result).toBe(document);
                    });

                    describe('if the document already has a base', function() {
                        beforeEach(function() {
                            document.html = document.html.replace(/<base .+?>/, '');

                            document.setBase('assets/');
                            document.setBase('http://www.apple.com/');
                        });

                        it('should concat the new base to the existing one', function() {
                            expect(document.html).toContain('<base href="http://www.apple.com/assets/"/>');
                        });

                        it('should replace the existing base tag', function() {
                            expect(document.html.match(/<base .+?>/g).length).toBe(1);
                        });
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
