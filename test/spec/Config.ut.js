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

        it('should set Config.env to production if __C6_ENV__ is not set', function(){
            config = new Config({ document: $document, window: $window, $: $ });
            expect(config.env).toEqual('production');
        });

        it('should set Config.env to __C6_ENV__ if __C6_ENV__ is set', function(){
            $window.__C6_ENV__ = 'staging';
            config = new Config({ document: $document, window: $window, $: $ });
            expect(config.env).toEqual('staging');
        });

        it('should set Config.env to lc(__C6_ENV__) if __C6_ENV__ is set', function(){
            $window.__C6_ENV__ = 'Staging';
            config = new Config({ document: $document, window: $window, $: $ });
            expect(config.env).toEqual('staging');
        });

        it('should set a debug flag if the __C6_DEBUG__ flag is set', function() {
            expect(config.debug).toBe(false);

            $window.__C6_DEBUG__ = true;
            config = new Config({ document: $document, window: $window, $: $ });
            expect(config.debug).toBe(true);
        });

        it('should set a debug flag if the __C6_DEBUG__ flag is not set and __C6_ENV__ is not "production"',function(){
            expect(config.debug).toBe(false);

            $window.__C6_ENV__ = 'test';
            config = new Config({ document: $document, window: $window, $: $ });
            expect(config.debug).toBe(true);
        });

        it('should set the apiBase based on the __C6_DEBUG__ flag', function() {
            expect(config.apiBase).toBe('http://cinema6.com/api');

            $window.__C6_DEBUG__ = true;
            config = new Config({ document: $document, window: $window, $: $ });

            expect(config.apiBase).toBe('http://staging.cinema6.com/api');
        });

        it('should set the expBase based on the __C6_DEBUG__ flag', function() {
            expect(config.expBase).toBe('http://cinema6.com/experiences');

            $window.__C6_DEBUG__ = true;
            config = new Config({ document: $document, window: $window, $: $ });

            expect(config.expBase).toBe('http://staging.cinema6.com/experiences');
        });

        it('should set the base collateral directory based on the debug mode', function() {
            expect(config.collateralBase).toBe('http://cinema6.com/collateral');

            $window.__C6_DEBUG__ = true;
            config = new Config({ document: $document, window: $window, $: $ });

            expect(config.collateralBase).toBe('http://staging.cinema6.com/collateral');
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
