(function() {
    'use strict';

    ddescribe('embed.js', function() {
        var C6Query;

        var $;

        var $div;

        function load(module, cb) {
            var iframe = document.createElement('iframe'),
                body = document.getElementsByTagName('body')[0],
                html = [
                    '<script>',
                    '(' + function(window) {
                        window.module = {
                            exports: {}
                        };
                        window.exports = window.module.exports;
                    }.toString() + '(window))',
                    '</script>',
                    '<script src="' + module + '"></script>'
                ].join('\n');

            iframe.style.display = 'none';
            iframe.addEventListener('load', function() {
                var head = iframe.contentWindow.document.getElementsByTagName('head')[0];

                if (head.childNodes.length < 1) { return; }

                cb.call(window, iframe.contentWindow.module.exports);
                body.removeChild(iframe);
            }, false);
            /* jshint scripturl:true */
            iframe.setAttribute('src', 'javascript:\'' + html + '\';');
            /* jshint scripturl:false */

            body.appendChild(iframe);
        }


        beforeEach(function() {
            window.__C6_URL_ROOT__ = 'base/test/helpers';
            window.__C6_APP_JS__ = 'http://staging.cinema6.com/foo.js';

            C6Query = require('../../lib/C6Query');

            $ = new C6Query({ window: window, document: document });

            $div = $('<div id="test"></div>');
            $('body').append($div);
        });

        afterEach(function() {
            $div.remove();
            delete window.c6;
            delete window.__C6_URL_ROOT__;
        });

        describe('common functionality', function() {
            var $script;

            it('should base64 decode any attributes that start with a :', function(done) {
                var script = document.createElement('script');

                script.src = '/base/src/embed.js';

                script.setAttribute('data-exp', 'e-abc123');
                script.setAttribute('data-width', '60%');
                script.setAttribute('data-splash', 'foo:1-1');
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
                    'data-splash': 'flavor1:1/1',
                    'data-:title': btoa('Hello World!'),
                    'data-preload': ''
                },
                {
                    'data-exp': 'e-123',
                    'data-width': '100%',
                    'data-height': '300px',
                    'data-splash': 'flavorc:16/9',
                    'data-:title': btoa('This is a Great MiniReel.')
                },
                {
                    'data-exp': 'e-123',
                    'data-width': '150',
                    'data-splash': 'flavor4:6/5',
                    'data-:title': btoa('Last One Here!'),
                    'data-preload': ''
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

                    describe('the element', function() {
                        it('should create a div after the script', function() {
                            var $embed = $('div#c6embed-e-123');

                            expect($embed.length).toBe(1);
                            expect($embed[0].nextSibling).toBe($script[0]);
                            expect($embed[0].style.position).toBe('relative');
                        });
                    });

                    describe('the splash page', function() {
                        var $div, splashJS;

                        beforeEach(function(done) {
                            $div = $('div#c6embed-e-123 div');

                            var intervalId = setInterval(function() {
                                splashJS = window.c6.requireCache[
                                    window.__C6_URL_ROOT__ +
                                    '/collateral/splash/splash.js'
                                ];

                                if (!!$div[0].innerHTML && splashJS) {
                                    clearInterval(intervalId);
                                    done();
                                }
                            }, 50);
                        });

                        it('should call a script that will provide interactivity', function() {
                            expect(splashJS).toHaveBeenCalledWith(window.c6, window.c6.embeds[config['data-exp']], $div[0]);
                        });

                        it('should set settings.splashDelegate to the result of the interactivity module', function() {
                            expect(splashJS()).toEqual(window.c6.embeds[config['data-exp']].splashDelegate);
                        });

                        it('should create a div for the splash page', function(done) {
                            var splash = config['data-splash'].split(':'),
                                theme = splash[0],
                                ratio = splash[1].split('/').join('-');

                            load('base/test/helpers/collateral/splash/' + theme + '/' + ratio + '.js', function(html) {
                                expect($div[0].innerHTML).toBe(
                                    html.replace('{{title}}', atob(config['data-:title']))
                                        .replace('{{splash}}', window.__C6_URL_ROOT__ +
                                            '/collateral/experiences/' + config['data-exp'] + '/splash')
                                );
                                done();
                            });
                        });
                    });

                    describe('the c6 object', function() {
                        it('should exist', function() {
                            expect(window.c6).toEqual({
                                embeds: {
                                    'e-123': {
                                        embed: $('#c6embed-e-123')[0],
                                        load: 'data-preload' in config,
                                        preload: 'data-preload' in config,
                                        splashDelegate: {},
                                        config: (function() {
                                            var result = {};

                                            for (var key in config) {
                                                result[key.replace(/^data-/, '')] = config[key];
                                            }

                                            result.script = $script[0];
                                            result.src = $script.attr('src');
                                            result.responsive = !result.height;
                                            result.splash = jasmine.any(Object);
                                            result.title = jasmine.any(String);
                                            result.preload = 'data-preload' in config;

                                            delete result[':title'];

                                            return result;
                                        }())
                                    }
                                },
                                app: 'data-preload' in config ? jasmine.any(Object) : null,
                                loadExperience: jasmine.any(Function),
                                requireCache: jasmine.any(Object),
                                gaAcctId: 'UA-44457821-2'
                            });
                        });

                        it('should be reused if there are multiple embed instances', function(done) {
                            var c6 = window.c6,
                                script = document.createElement('script');

                            script.src = '/base/src/embed.js';
                            script.setAttribute('data-exp', 'e-abc');
                            script.setAttribute('data-splash', 'foo:1/1');
                            $($div).append(script);
                            script.onload = function() {
                                expect(window.c6).toBe(c6);
                                done();
                            };
                        });

                        describe('methods', function() {
                            describe('loadExperience(embed, preload)', function() {
                                beforeEach(function() {
                                    window.c6.embeds['e-123'].preload = true;
                                    window.c6.loadExperience(window.c6.embeds['e-123']);
                                });

                                it('should pull down the full embed app', function() {
                                    expect(window.c6.app.src).toBe('http://staging.cinema6.com/foo.js');
                                    expect(window.c6.app.parentNode).toBe(document.getElementsByTagName('head')[0]);
                                });

                                it('should set load to true on the embed', function() {
                                    expect(window.c6.embeds['e-123'].load).toBe(true);
                                });

                                it('should set preload to false on the embed', function() {
                                    expect(window.c6.embeds['e-123'].preload).toBe(false);
                                });

                                describe('if preload is provided as true', function() {
                                    beforeEach(function() {
                                        window.c6.embeds['e-123'].load = false;

                                        window.c6.loadExperience(window.c6.embeds['e-123'], true);
                                    });

                                    it('should set load to true', function() {
                                        expect(window.c6.embeds['e-123'].load).toBe(true);
                                    });

                                    it('should set preload to true', function() {
                                        expect(window.c6.embeds['e-123'].preload).toBe(true);
                                    });
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
                });
            });
        });

        describe('data-preload attr', function() {
            function createEmbed(preload, done) {
                var script;

                script = document.createElement('script');
                script.src = '/base/src/embed.js';
                script.setAttribute('data-splash', 'foo:1/1');
                if (preload) {
                    script.setAttribute('data-preload');
                }
                script.setAttribute('data-exp', 'e-60196c3751eb52');
                script.onload = done;

                $div.append(script);
            }

            beforeEach(function() {
                window.c6 = {
                    embeds: {},
                    requireCache: {},
                    loadExperience: jasmine.createSpy('c6.loadExperience()')
                };
            });

            describe('if true', function() {
                beforeEach(function(done) {
                    createEmbed(true, done);
                });

                it('should preload the experience', function() {
                    expect(window.c6.loadExperience).toHaveBeenCalledWith(window.c6.embeds['e-60196c3751eb52'], true);
                });
            });

            describe('if preload is false', function() {
                beforeEach(function(done) {
                    createEmbed(false, done);
                });

                it('should not preload the experience', function() {
                    expect(window.c6.loadExperience).not.toHaveBeenCalled();
                });
            });
        });

        describe('when responsive', function() {
            beforeEach(function(done) {
                var script = document.createElement('script');

                script.setAttribute('data-exp', 'e-abc');
                script.setAttribute('data-splash', 'flavorflav:6/5');

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

                    expect(style.width).toBe('');
                    expect(style.height).toBe('');
                });
            });
        });

        describe('when not responsive', function() {
            beforeEach(function(done) {
                var script = document.createElement('script');

                script.setAttribute('data-exp', 'e-def');
                script.setAttribute('data-width', '100%');
                script.setAttribute('data-height', '300px');
                script.setAttribute('data-splash', 'foo:1/1');

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
