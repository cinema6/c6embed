(function() {
    'use strict';

    describe('embed.js', function() {
        var C6Query;

        var $;

        var $div;

        beforeEach(function() {
            window.__C6_URL_ROOT__ = 'http://staging.cinema6.com';
            window.__C6_APP_JS__ = 'http://staging.cinema6.com/foo.js';

            C6Query = require('../../lib/C6Query');

            $ = new C6Query({ window: window, document: document });

            $div = $('<div id="test"></div>');
            $('body').append($div);
        });

        describe('common functionality', function() {
            var $script;

            it('should base64 decode any attributes that start with a :', function(done) {
                var script = document.createElement('script');

                script.src = '/base/src/embed.js';

                script.setAttribute('data-exp', 'e-abc123');
                script.setAttribute('data-width', '60%');
                script.setAttribute('data-:title', btoa('Hello World!'));
                script.setAttribute('data-:test', btoa('This is a Test!'));

                script.onload = function() {
                    var config = window.c6.embeds['e-abc123'].config;

                    expect(config.title).toBe('Hello World!');
                    expect(config.test).toBe('This is a Test!');
                    expect(config[':title']).not.toBeDefined();
                    expect(config[':test']).not.toBeDefined();

                    done();
                };

                $div.append(script);
            });

            [
                {
                    'data-exp': 'e-123',
                    'data-splash': 'flavor1'
                },
                {
                    'data-exp': 'e-123',
                    'data-width': '100%',
                    'data-height': '300px',
                    'data-splash': 'flavorc'
                },
                {
                    'data-exp': 'e-123',
                    'data-width': '150',
                    'data-splash': 'flavor4'
                }
            ].forEach(function(config) {
                describe('with config: ' + JSON.stringify(config), function() {
                    beforeEach(function(done) {
                        var script = document.createElement('script');


                        script.src = '/base/src/embed.js';
                        for (var key in config) {
                            script.setAttribute(key, config[key]);
                        }

                        $script = $(script);
                        $script[0].onload = done;
                        $div.append($script);
                    });

                    afterEach(function() {
                        $div.remove();
                        delete window.c6;
                        delete window.__C6_URL_ROOT__;
                    });

                    describe('the element', function() {
                        it('should create a div after the script', function() {
                            var $embed = $('div#c6embed-e-123');

                            expect($embed.length).toBe(1);
                            expect($embed[0].nextSibling).toBe($script[0]);
                            expect($embed[0].style.position).toBe('relative');
                        });

                        it('should put an iframe in the div', function() {
                            var $iframe = $('div#c6embed-e-123 > iframe');

                            expect($iframe.length).toBe(1);
                            expect($iframe.attr('width')).toBe('100%');
                            expect($iframe.attr('height')).toBe('100%');
                            expect($iframe.attr('scrolling')).toBe('no');
                            expect($iframe.attr('style')).toContain('border: none;');
                            expect($iframe.attr('style')).toContain('position: absolute;');
                            expect($iframe.attr('style')).toContain('top: 0px;');
                            expect($iframe.attr('style')).toContain('left: 0px;');
                            expect($iframe.attr('src')).toBe(window.__C6_URL_ROOT__ + '/collateral/splash/' + config['data-splash'] + '/index.html?exp=e-123');
                        });
                    });

                    describe('the c6 object', function() {
                        it('should exist', function() {
                            expect(window.c6).toEqual({
                                embeds: {
                                    'e-123': {
                                        embed: $('#c6embed-e-123')[0],
                                        load: false,
                                        config: (function() {
                                            var result = {};

                                            for (var key in config) {
                                                result[key.replace(/^data-/, '')] = config[key];
                                            }

                                            result.script = $script[0];
                                            result.src = $script.attr('src');
                                            result.responsive = !result.height;

                                            return result;
                                        }())
                                    }
                                },
                                app: null,
                                loadExperience: jasmine.any(Function)
                            });
                        });

                        it('should be reused if there are multiple embed instances', function(done) {
                            var c6 = window.c6,
                                script = document.createElement('script');

                            script.src = '/base/src/embed.js';
                            script.setAttribute('data-exp', 'e-abc');
                            $($div).append(script);
                            script.onload = function() {
                                expect(window.c6).toBe(c6);
                                done();
                            };
                        });

                        describe('methods', function() {
                            describe('loadExperience(embed)', function() {
                                beforeEach(function() {
                                    window.c6.loadExperience(window.c6.embeds['e-123']);
                                });

                                it('should pull down the full embed app', function() {
                                    expect(window.c6.app.src).toBe('http://staging.cinema6.com/foo.js');
                                    expect(window.c6.app.parentNode).toBe(document.getElementsByTagName('head')[0]);
                                });

                                it('should set load to true on the embed', function() {
                                    expect(window.c6.embeds['e-123'].load).toBe(true);
                                });
                            });

                            describe('if an experience has already been loaded', function() {
                                var embed, app;

                                beforeEach(function() {
                                    embed = { load: false };
                                    app = window.c6.app = { parentNode: {} };

                                    window.c6.loadExperience(embed);
                                });

                                it('should not create a new script but still set load to true on the embed', function() {
                                    expect(window.c6.app).toBe(app);
                                    expect(embed.load).toBe(true);
                                });
                            });
                        });
                    });

                    describe('when the splash is clicked', function() {
                        beforeEach(function() {
                            var message = document.createEvent('CustomEvent');

                            message.initCustomEvent('message', false, false);
                            message.origin = 'http://staging.cinema6.com';
                            message.data = JSON.stringify({
                                event: 'click',
                                exp: 'e-123'
                            });

                            spyOn(window.c6, 'loadExperience');

                            window.dispatchEvent(message);
                        });

                        it('should call loadExperience()', function() {
                            expect(window.c6.loadExperience).toHaveBeenCalledWith(window.c6.embeds['e-123']);
                        });
                    });
                });
            });
        });

        describe('when responsive', function() {
            beforeEach(function(done) {
                var script = document.createElement('script');

                script.setAttribute('data-exp', 'e-abc');

                script.src = '/base/src/embed.js';
                script.onload = done;
                $div.append(script);
            });

            describe('the container', function() {
                var embed;

                beforeEach(function() {
                    embed = window.c6.embeds['e-abc'].embed;
                });

                it('should have styles for responsive sizing', function() {
                    var style = embed.style;

                    expect(style.width).toBe('100%');
                    expect(style.height).toBe('0px');
                    expect(style.boxSizing).toBe('border-box');
                    expect(style.fontSize).toBe('16px');
                    expect(style.minWidth).toBe('18.75em');
                    expect(style.minHeight).toBe('19.625em');
                    expect(style.padding).toBe('8.125em 0px 63%');
                });
            });
        });

        describe('when not responsive', function() {
            beforeEach(function(done) {
                var script = document.createElement('script');

                script.setAttribute('data-exp', 'e-def');
                script.setAttribute('data-width', '100%');
                script.setAttribute('data-height', '300px');

                script.src = '/base/src/embed.js';
                script.onload = done;
                $div.append(script);
            });

            describe('the container', function() {
                var embed;

                beforeEach(function() {
                    embed = window.c6.embeds['e-def'].embed;
                });

                it('should have styles for static sizing', function() {
                    var style = embed.style;

                    expect(style.width).toBe('100%');
                    expect(style.height).toBe('300px');
                });
            });
        });
    });
}());
