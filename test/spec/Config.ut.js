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

        it('should set urlBase to http://cinema6.com if __C6_URL_ROOT__ is not set',function(){
            config = new Config({ document: $document, window: $window, $: $ });
            expect(config.urlRoot).toBe('http://cinema6.com');
        });

        it('should set urlBase to __C6_URL_ROOT__ if set',function(){
            $window.__C6_URL_ROOT__ = 'http://staging.cinema6.com';
            config = new Config({ document: $document, window: $window, $: $ });
            expect(config.urlRoot).toBe('http://staging.cinema6.com');
        });

        it('should set the apiBase based on urlBase if no __C6_BASE_API__ ', function() {
            $window.__C6_URL_ROOT__ = 'http://staging.cinema6.com';
            config = new Config({ document: $document, window: $window, $: $ });
            expect(config.apiBase).toBe('http://staging.cinema6.com/api');
        });

        it('should set the apiBase based on __C6_BASE_API__ if set', function() {
            $window.__C6_BASE_API__ = 'http://applesauce.com/api';
            config = new Config({ document: $document, window: $window, $: $ });
            expect(config.apiBase).toBe('http://applesauce.com/api');
        });

        it('should set the experienceBase based on urlBase if no __C6_BASE_EXP__ ', function() {
            $window.__C6_URL_ROOT__ = 'http://staging.cinema6.com';
            config = new Config({ document: $document, window: $window, $: $ });
            expect(config.experienceBase).toBe('http://staging.cinema6.com/experiences');
        });

        it('should set the experienceBase based on __C6_BASE_EXP__ if set', function() {
            $window.__C6_BASE_EXP__ = 'http://applesauce.com/experiences';
            config = new Config({ document: $document, window: $window, $: $ });
            expect(config.experienceBase).toBe('http://applesauce.com/experiences');
        });
        
        it('should set the collBase based on urlBase if no __C6_BASE_COL__ ', function() {
            $window.__C6_URL_ROOT__ = 'http://staging.cinema6.com';
            config = new Config({ document: $document, window: $window, $: $ });
            expect(config.collateralBase).toBe('http://staging.cinema6.com/collateral');
        });

        it('should set the collBase based on __C6_BASE_COL__ if set', function() {
            $window.__C6_BASE_COL__ = 'http://applesauce.com/collateral';
            config = new Config({ document: $document, window: $window, $: $ });
            expect(config.collateralBase).toBe('http://applesauce.com/collateral');
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
