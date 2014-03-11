(function() {
    'use strict';

    describe('Config', function() {
        var Config,
            config,
            C6Query,
            $;

        var $window,
            $document,
            myScriptData,
            myScript,
            scripts;

        function MockElement(data) {
            this.getAttribute = jasmine.createSpy('element.getAttribute()')
                .and.callFake(function(name) {
                    return data.attributes[name];
                });
        }

        beforeEach(function() {
            Config = require('../../src/Config');
            C6Query = require('../../lib/C6Query');

            myScriptData = {
                attributes: {
                    src: 'embed.js',
                    'data-exp': 'e-4cb24cfbe4f2fc',
                    'data-height': '300',
                    'data-width': '100%'
                }
            };

            scripts = [
                new MockElement({
                    attributes: {
                        src: 'foo.js'
                    }
                }),
                new MockElement({
                    attributes: {
                        src: 'test.js'
                    }
                }),
                new MockElement(myScriptData)
            ];

            myScript = scripts[2];

            $window = {};

            $document = {
                getElementsByTagName: jasmine.createSpy('$document.getElementsByTagName()')
                    .and.callFake(function(name) {
                        if (name === 'script') {
                            return scripts;
                        }
                    }),
                createElement: function(tagName) {
                    return document.createElement(tagName);
                }
            };

            $ = new C6Query({ document: $document, window: $window });
            config = new Config({ document: $document, window: $window, $: $ });
        });

        it('should exist', function() {
            expect(config).toEqual(jasmine.any(Object));
        });

        it('should pull configuration data from the last script tag (the script tag that loaded this JS)', function() {
            expect(config.experienceId).toBe('e-4cb24cfbe4f2fc');
            expect(config.src).toBe('embed.js');
            expect(config.$script).toEqual($(myScript));
            expect(config.height).toBe('300');
            expect(config.width).toBe('100%');
        });

        it('should set a debug flag if the __C6_DEBUG__ flag is set', function() {
            expect(config.debug).toBe(false);

            $window.__C6_DEBUG__ = true;
            config = new Config({ document: $document, window: $window, $: $ });
            expect(config.debug).toBe(true);
        });

        it('should set the base collateral directory based on the debug mode', function() {
            expect(config.collateralBase).toBe('http://cinema6.com/collateral');

            $window.__C6_DEBUG__ = true;
            config = new Config({ document: $document, window: $window, $: $ });

            expect(config.collateralBase).toBe('https://s3.amazonaws.com/c6.dev/media/src/site/collateral');
        });

        it('should be responsive if a width and height are not set', function() {
            expect(config.responsive).toBe(false);

            delete myScriptData.attributes['data-height'];
            config = new Config({ document: $document, window: $window, $: $ });

            expect(config.responsive).toBe(false);

            delete myScriptData.attributes['data-width'];
            config = new Config({ document: $document, window: $window, $: $ });

            expect(config.responsive).toBe(true);
        });
    });
}());
