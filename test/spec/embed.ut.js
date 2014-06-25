(function() {
    'use strict';

    ddescribe('embed.js', function() {
        var C6Query;

        var $;

        var $div,
            $ogImage;

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
            $ogImage = $('<meta property="og:image" content="http://www.cinema6.com/collateral/custom.jpg">');
            $('head').append($ogImage);
            $('body').append($div);
        });

        afterEach(function() {
            $div.remove();
            $ogImage.remove();
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
                    'data-preload': '',
                    'data-:branding': btoa('elitedaily')
                },
                {
                    'data-exp': 'e-123',
                    'data-width': '100%',
                    'data-height': '300px',
                    'data-splash': 'flavorc:16/9',
                    'data-:title': btoa('This is a Great MiniReel.'),
                    'data-:branding': btoa('urbantimes')
                },
                {
                    'data-exp': 'e-123',
                    'data-width': '150',
                    'data-splash': 'flavor4:6/5',
                    'data-:title': btoa('Last One Here!'),
                    'data-preload': '',
                    'data-:branding': btoa('elitedaily')
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
                        $('link#c6-' + atob(config['data-:branding'])).remove();
                    });

                    describe('the element', function() {
                        it('should create a div after the script', function() {
                            var $embed = $('div#c6embed-e-123');

                            expect($embed.length).toBe(1);
                            expect($embed[0].nextSibling).toBe($script[0]);
                            expect($embed[0].style.position).toBe('relative');
                        });
                    });

                    describe('if replaceImage is true', function() {
                        var $embed;

                        function create(done) {
                            var script = document.createElement('script');

                            script.src = '/base/src/embed.js';
                            script.setAttribute('data-replace-image', '');
                            script.setAttribute('data-exp', 'e-abc');
                            script.setAttribute('data-splash', 'flavor1:1/1');

                            script.onload = function() {
                                var intervalId = setInterval(function() {
                                    if (!!$div[0].innerHTML) {
                                        clearInterval(intervalId);
                                        done();
                                    }
                                }, 50);
                            };

                            $div.append(script);

                            return script;
                        }

                        afterEach(function() {
                            if ($embed) {
                                $embed.remove();
                            }
                        });

                        describe('with one image on the page', function() {
                            var $img;

                            beforeEach(function(done) {
                                $img = $('<img src="http://www.cinema6.com/collateral/custom.jpg">');
                                $('body').append($img);
                                create(function() {
                                    $embed = $('div#c6embed-e-abc');
                                    done();
                                });
                            });

                            it('should insert the embed after the image', function() {
                                expect($embed[0].nextSibling).toBe($img[0]);
                            });

                            it('should hide the image', function() {
                                expect($img.css('display')).toBe('none');
                            });

                            it('should use the featured image for the splash', function() {
                                expect($embed[0].innerHTML).toContain('Splash: http://www.cinema6.com/collateral/custom.jpg');
                            });

                            afterEach(function() {
                                $img.remove();
                            });
                        });

                        describe('with more than one image on the page', function() {
                            var $img1, $img2, script;

                            beforeEach(function(done) {
                                $img1 = $('<img src="http://www.cinema6.com/collateral/custom.jpg">');
                                $img2 = $('<img src="http://www.cinema6.com/collateral/custom.jpg">');

                                $('body').append($img1);
                                $('body').append($img2);
                                script = create(function() {
                                    $embed = $('div#c6embed-e-abc');
                                    done();
                                });
                            });

                            afterEach(function() {
                                $img1.remove();
                                $img2.remove();
                            });

                            it('should insert the embed after the script', function() {
                                expect($embed[0].nextSibling).toBe(script);
                                expect($embed[0].nextSibling.tagName).toBe('SCRIPT');
                            });
                        });

                        describe('with no images on the page', function() {
                            var script;

                            beforeEach(function(done) {
                                script = create(function() {
                                    $embed = $('div#c6embed-e-abc');
                                    done();
                                });
                            });

                            it('should insert the embed after the script', function() {
                                expect($embed[0].nextSibling).toBe(script);
                                expect($embed[0].nextSibling.tagName).toBe('SCRIPT');
                            });
                        });

                        describe('if there is no open graph meta tag', function() {
                            var script;

                            beforeEach(function(done) {
                                $ogImage.remove();
                                script = create(function() {
                                    $embed = $('div#c6embed-e-abc');
                                    done();
                                });
                            });

                            afterEach(function() {
                                $('head').append($ogImage);
                            });

                            it('should insert the embed after the script', function() {
                                expect($embed[0].nextSibling).toBe(script);
                                expect($embed[0].nextSibling.tagName).toBe('SCRIPT');
                            });
                        });
                    });

                    describe('the branding stylesheet', function() {
                        it('should add a branding stylesheet to the page', function() {
                            var branding = atob(config['data-:branding']);

                            expect($('link#c6-' + branding).attr('href')).toBe(
                                'base/test/helpers/collateral/branding/' + branding + '/styles/splash.css'
                            );
                        });

                        describe('with multiple embeds on the same page', function() {
                            beforeEach(function(done) {
                                var embed2 = document.createElement('script');

                                embed2.src = '/base/src/embed.js';
                                for (var key in config) {
                                    embed2.setAttribute(key, config[key]);
                                }

                                embed2.onload = done;

                                $div.append(embed2);
                            });

                            it('should not add the branding again', function() {
                                expect($('link#c6-' + atob(config['data-:branding'])).length).toBe(1);
                            });
                        });
                    });

                    describe('the splash page', function() {
                        var $splash, splashJS;

                        beforeEach(function(done) {
                            $splash = $('div#c6embed-e-123 div');

                            var intervalId = setInterval(function() {
                                splashJS = window.c6.requireCache[
                                    window.__C6_URL_ROOT__ +
                                    '/collateral/splash/splash.js'
                                ];

                                if (!!$splash[0].innerHTML && splashJS) {
                                    clearInterval(intervalId);
                                    done();
                                }
                            }, 50);
                        });


                        it('should call a script that will provide interactivity', function() {
                            expect(splashJS).toHaveBeenCalledWith(window.c6, window.c6.embeds[config['data-exp']], $splash[0]);
                        });

                        it('should set settings.splashDelegate to the result of the interactivity module', function() {
                            expect(splashJS()).toEqual(window.c6.embeds[config['data-exp']].splashDelegate);
                        });

                        it('should create a div for the splash page', function(done) {
                            var splash = config['data-splash'].split(':'),
                                theme = splash[0],
                                ratio = splash[1].split('/').join('-');

                            load('base/test/helpers/collateral/splash/' + theme + '/' + ratio + '.js', function(html) {
                                expect($splash[0].innerHTML).toBe(
                                    html.replace('{{title}}', atob(config['data-:title']))
                                        .replace('{{splash}}', window.__C6_URL_ROOT__ +
                                            '/collateral/experiences/' + config['data-exp'] + '/splash')
                                );
                                expect($splash.hasClass('c6brand__' + atob(config['data-:branding']))).toBe(true);
                                done();
                            });
                        });

                        describe('when the mouse enters it', function() {
                            function mouseenter($element) {
                                var event = document.createEvent('MouseEvent');
                                event.initMouseEvent('mouseenter');

                                $element[0].dispatchEvent(event);
                            }

                            beforeEach(function() {
                                spyOn(window.c6, 'loadExperience');

                                mouseenter($splash);
                            });

                            if ('data-preload' in config) {
                                it('should not preload the experience', function() {
                                    expect(window.c6.loadExperience).not.toHaveBeenCalled();
                                });
                            } else {
                                it('should preload the experience', function() {
                                    expect(window.c6.loadExperience).toHaveBeenCalledWith(window.c6.embeds[config['data-exp']], true);
                                });

                                it('should only preload the experience on the first mouseover', function() {
                                    mouseenter($splash);

                                    expect(window.c6.loadExperience.calls.count()).toBe(1);
                                });
                            }
                        });
                    });

                    describe('the c6 object', function() {
                        it('should exist', function() {
                            expect(window.c6).toEqual({
                                embeds: {
                                    'e-123': {
                                        embed: $('#c6embed-e-123')[0],
                                        load: false,
                                        preload: false,
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
                                            result.replaceImage = false;
                                            result.branding = jasmine.any(String);

                                            delete result[':title'];
                                            delete result[':branding'];

                                            return result;
                                        }())
                                    }
                                },
                                app: null,
                                loadExperience: jasmine.any(Function),
                                requireCache: jasmine.any(Object),
                                branding: jasmine.any(Object),
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
                var script,
                    intervalId = setInterval(function() {
                        if (!window.c6) { return; }

                        if (Object.keys(window.c6.requireCache).length === 3) {
                            clearInterval(intervalId);
                            done();
                        }
                    }, 100);

                script = document.createElement('script');
                script.src = '/base/src/embed.js';
                script.setAttribute('data-splash', 'foo:1/1');
                if (preload) {
                    script.setAttribute('data-preload');
                }
                script.setAttribute('data-exp', 'e-60196c3751eb52');

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

        describe('with no branding', function() {
            beforeEach(function(done) {
                var script = document.createElement('script');

                script.setAttribute('data-exp', 'e-abc');
                script.setAttribute('data-splash', 'flavorflav:6/5');

                script.src = '/base/src/embed.js';
                script.onload = done;
                $div.append(script);
            });

            it('should not add a branding stylesheet', function() {
                expect($('link#c6-undefined').length).toBe(0);
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
