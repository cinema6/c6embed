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

        it('should set Config.debug to false if __C6_DEBUG__ is not set', function(){
            config = new Config({ document: $document, window: $window, $: $ });
            expect(config.debug).toEqual(false);
        });

        it('should set Config.debug to __C6_DEBUG__ if __C6_DEBUG__ is set', function(){
            $window.__C6_DEBUG__ = true;
            config = new Config({ document: $document, window: $window, $: $ });
            expect(config.debug).toEqual(true);
        });

        it('should set urlBase to http://portal.cinema6.com if __C6_URL_ROOT__ is not set',function(){
            config = new Config({ document: $document, window: $window, $: $ });
            expect(config.urlRoot).toBe('http://portal.cinema6.com');
        });

        it('should set urlBase to __C6_URL_ROOT__ if set',function(){
            $window.__C6_URL_ROOT__ = 'http://staging.cinema6.com';
            config = new Config({ document: $document, window: $window, $: $ });
            expect(config.urlRoot).toBe('http://staging.cinema6.com');
        });

        it('should set the apiBase based on urlBase', function() {
            $window.__C6_URL_ROOT__ = 'http://staging.cinema6.com';
            config = new Config({ document: $document, window: $window, $: $ });
            expect(config.apiBase).toBe('http://staging.cinema6.com/api');
        });

        it('should set the appBase based on urlBase', function() {
            $window.__C6_URL_ROOT__ = 'http://staging.cinema6.com';
            config = new Config({ document: $document, window: $window, $: $ });
            expect(config.appBase).toBe('http://staging.cinema6.com/apps');
        });

        it('should set the collBase based on urlBase', function() {
            $window.__C6_URL_ROOT__ = 'http://staging.cinema6.com';
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
