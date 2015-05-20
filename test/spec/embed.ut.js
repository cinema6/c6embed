(function() {
    'use strict';

    var embedJS = require('../../src/embed/embed.js');
    var importScripts = require('../../lib/importScripts.js');

    function waitForDeps(deps, done) {
        var id = window.setInterval(function() {
            if (deps.every(function(dep) {
                return !!importScripts.cache[dep];
            })) {
                window.clearInterval(id);
                done(deps.map(function(dep) {
                    return importScripts.cache[dep];
                }));
            }
        }, 50);
    }

    describe('embed.js', function() {
        var C6Query;

        var $;

        var $div;

        function settingsByExp(exp) {
            return window.c6.embeds.reduce(function(result, settings) {
                return settings.config.exp === exp ? settings : result;
            }, null);
        }

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

        function embed(attributes, done, readyState) {
            importScripts.cache = {};
            var script = document.createElement('script');
            for (var attribute in attributes) {
                script.setAttribute(attribute, attributes[attribute]);
            }
            $div.append(script);
            embedJS(window, readyState || document.readyState);
            var intervalId = setInterval(function() {
                if (Object.keys(importScripts.cache).length === 4) {
                    clearInterval(intervalId);
                    done();
                }
            }, 50);

            return script;
        }


        beforeEach(function() {
            window.mockReadyState = 'loading';
            window.__C6_URL_ROOT__ = 'base/test/helpers';
            window.__C6_APP_JS__ = 'http://staging.cinema6.com/foo.js';

            importScripts.cache = {};

            C6Query = require('../../lib/C6Query');

            $ = new C6Query({ window: window, document: document });

            $div = $('<div id="test"></div>');
            $('body').append($div);
        });

        afterEach(function() {
            $div.remove();
            delete window.c6;
            delete window.__C6_URL_ROOT__;
            importScripts.cache = {};
        });

        describe('common functionality', function() {
            var $script;

            it('should base64 decode any attributes that start with a :', function(done) {
                embed({
                    'data-exp': 'e-abc123',
                    'data-width': '60%',
                    'data-splash': 'foo:1/1',
                    'data-:title': btoa('Hello World!'),
                    'data-:test': btoa('This is a Test!')
                }, done);

                var config = window.c6.embeds[0].config;

                expect(config.title).toBe('Hello World!');
                expect(config.test).toBe('This is a Test!');
                expect(config[':title']).not.toBeDefined();
                expect(config[':test']).not.toBeDefined();
            });

            it('should base64 decode any attributes that start with a -', function(done) {
                embed({
                    'data-exp': 'e-abc123',
                    'data-width': '60%',
                    'data-splash': 'foo:1/1',
                    'data--title': btoa('Hello World!'),
                    'data--test': btoa('This is a Test!')
                }, done);

                var config = window.c6.embeds[0].config;

                expect(config.title).toBe('Hello World!');
                expect(config.test).toBe('This is a Test!');
                expect(config['-title']).not.toBeDefined();
                expect(config['-test']).not.toBeDefined();
            });

            [
                {
                    'src': '/base/test/helpers/scripts/mock_embed.js',
                    'data-exp': 'e-123',
                    'data-splash': 'flavor1:1/1',
                    'data-preload': ''
                },
                {
                    'src': '/base/test/helpers/scripts/mock_embed.js',
                    'data-exp': 'e-123',
                    'data-width': '100%',
                    'data-height': '300px',
                    'data-splash': 'flavorc:16/9'
                },
                {
                    'src': '/base/test/helpers/scripts/mock_embed.js',
                    'data-exp': 'e-123',
                    'data-width': '150',
                    'data-splash': 'flavor4:6/5',
                    'data-preload': ''
                }
            ].forEach(function(config) {
                describe('with config: ' + JSON.stringify(config), function() {
                    var experience;

                    beforeEach(function(done) {
                        load('base/test/helpers/api/public/content/experience/' + config['data-exp'] + '.js', function(exp) {
                            experience = exp;
                            $script = $(embed(config, done));
                        });
                    });

                    afterEach(function() {
                        delete window.c6;
                        $('link#c6-' + experience.data.branding).remove();
                        importScripts.cache = {};
                    });

                    describe('the element', function() {
                        it('should create a div after the script', function() {
                            var $embed = $('div.c6embed-e-123');

                            expect($embed.length).toBe(1);
                            expect($embed[0].nextSibling).toBe($script[0]);
                            expect($embed[0].style.position).toBe('relative');
                        });
                    });

                    describe('if replaceImage is set', function() {
                        var $embed;

                        function create(done) {
                            importScripts.cache = {};

                            return embed({
                                'data-replace-image': '.header_image',
                                'data-exp': 'e-abc',
                                'data-splash': 'flavor1:1/1'
                            }, done);
                        }

                        afterEach(function() {
                            if ($embed) {
                                $embed.remove();
                            }
                        });

                        describe('with an image on the page', function() {
                            var $img;

                            beforeEach(function(done) {
                                $img = $('<img class="header_image" src="http://www.cinema6.com/collateral/custom.jpg">');
                                $('body').append($img);
                                create(function() {
                                    $embed = $('div.c6embed-e-abc');
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

                        describe('with no images on the page', function() {
                            var script;

                            beforeEach(function(done) {
                                script = create(function() {
                                    $embed = $('div.c6embed-e-abc');
                                    done();
                                });
                            });

                            it('should insert the embed after the script', function() {
                                expect($embed[0].nextSibling).toBe(script);
                                expect($embed[0].nextSibling.tagName).toBe('SCRIPT');
                            });
                        });
                    });

                    describe('the branding stylesheet', function() {
                        it('should add a branding stylesheet to the page', function() {
                            var branding = experience.data.branding;

                            expect($('link#c6-' + branding).attr('href')).toBe(
                                'base/test/helpers/collateral/branding/' + branding + '/styles/splash.css'
                            );
                        });

                        describe('with multiple embeds on the same page', function() {
                            beforeEach(function(done) {
                                embed(config, done);
                            });

                            it('should not add the branding again', function() {
                                expect($('link#c6-' + experience.data.branding).length).toBe(1);
                            });
                        });
                    });

                    describe('if there is already an embedded experience', function() {
                        var experience;

                        beforeEach(function(done) {
                            window.c6.embeds.unshift({
                                experience: {
                                    data: {
                                        branding: 'custom-branding'
                                    }
                                }
                            });

                            $('link#c6-theinertia').remove();


                            embed({
                                'data-exp': 'e-6b5ead50d4a1ed',
                                'data-splash': 'vertical-stack:3/2'
                            }, function() {
                                waitForDeps(['base/test/helpers/api/public/content/experience/e-6b5ead50d4a1ed.js?container=embed'], function(experiences) {
                                    experience = experiences[0];
                                    done();
                                });
                            });
                        });

                        it('should use the branding of the existing experience', function() {
                            expect(experience.data.branding).toBe('custom-branding');
                        });

                        it('should not create a stylesheet for the unused branding', function() {
                            expect($('link#c6-theinertia').length).toBe(0);
                        });
                    });

                    describe('the splash page', function() {
                        var $splash, splashJS;

                        beforeEach(function(done) {
                            $splash = $('div.c6embed-e-123 div');

                            var intervalId = setInterval(function() {
                                splashJS = importScripts.cache[
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
                            expect(splashJS).toHaveBeenCalledWith(window.c6, window.c6.embeds[0], $splash[0]);
                        });

                        it('should set settings.splashDelegate to the result of the interactivity module', function() {
                            expect(splashJS()).toEqual(window.c6.embeds[0].splashDelegate);
                        });

                        it('should create a div for the splash page', function(done) {
                            var splash = config['data-splash'].split(':'),
                                theme = splash[0],
                                ratio = splash[1].split('/').join('-');

                            load('base/test/helpers/collateral/splash/' + theme + '/' + ratio + '.js', function(html) {
                                expect($splash[0].innerHTML).toBe(
                                    html.replace('{{title}}', experience.data.title)
                                        .replace('{{splash}}', window.__C6_URL_ROOT__ +
                                            experience.data.collateral.splash)
                                );
                                expect($splash.hasClass('c6brand__' + experience.data.branding)).toBe(true);
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
                                    expect(window.c6.loadExperience).toHaveBeenCalledWith(window.c6.embeds[0], true);
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
                            expect(window.c6).toEqual(jasmine.objectContaining({
                                embeds: jasmine.any(Array),
                                app: 'data-preload' in config ? jasmine.any(document.createElement('script').constructor) : null,
                                loadExperience: jasmine.any(Function),
                                branding: jasmine.any(Object)
                            }));
                            expect(window.c6.embeds.length).toBe(1);
                            expect(window.c6.embeds[0]).toEqual(jasmine.objectContaining({
                                embed: $('.c6embed-e-123')[0],
                                load: 'data-preload' in config,
                                preload: 'data-preload' in config,
                                autoLaunch: 'data-auto-launch' in config,
                                standalone: false,
                                playerVersion: 1,
                                experience: experience,
                                splashDelegate: {},
                                config: jasmine.any(Object)
                            }));
                            expect(window.c6.embeds[0].config).toEqual((function() {
                                var result = {};

                                for (var key in config) {
                                    result[key.replace(/^data-/, '')] = config[key];
                                }
                                result.context = 'embed';
                                result.container = (result.container || 'embed');
                                result.script = $script[0];
                                result.src = $script.attr('src');
                                result.responsive = !result.height;
                                result.splash = jasmine.any(Object);
                                result.preload = 'data-preload' in config;
                                result.autoLaunch = 'data-auto-launch' in config;

                                delete result['auto-launch'];

                                return result;
                            }()));
                        });

                        describe('if the playerVersion is specified', function() {
                            beforeEach(function(done) {
                                delete window.c6;

                                embed({
                                    'data-exp': 'e-123',
                                    'data-splash': 'foo:1/1',
                                    'data-player-version': '3'
                                }, done);
                            });

                            it('should set the playerVersion', function() {
                                expect(window.c6.embeds[0].playerVersion).toBe(3);
                            });
                        });

                        it('should be reused if there are multiple embed instances', function(done) {
                            var c6 = window.c6;

                            embed({
                                'data-exp': 'e-abc',
                                'data-splash': 'foo:1/1'
                            }, function() {
                                expect(window.c6).toBe(c6);
                                done();
                            });
                        });

                        it('should fill in any missing props on the c6 object if they are missing', function(done) {
                            var c6 = window.c6 = { blah: 'foo' };

                            embed({
                                'data-exp': 'e-abc',
                                'data-splash': 'foo:1/1',
                            }, function() {
                                expect(c6).toEqual(jasmine.objectContaining({
                                    blah: 'foo',
                                    embeds: jasmine.any(Array),
                                    app: null,
                                    loadExperience: jasmine.any(Function),
                                    branding: jasmine.any(Object)
                                }));
                                expect(c6.gaAcctIdPlayer).toMatch(/UA-44457821-\d+/);
                                expect(c6.gaAcctIdEmbed).toMatch(/UA-44457821-\d+/);

                                done();
                            });
                        });

                        ['interactive', 'complete'].forEach(function(readyState) {
                            describe('if the document is ' + readyState, function() {
                                beforeEach(function(done) {
                                    var configScript = document.createElement('script');

                                    window.c6 = {
                                        pending: ['c6embed-q9h6dda4']
                                    };

                                    configScript.setAttribute('id', 'c6embed-q9h6dda4');
                                    configScript.setAttribute('data-exp', 'e-456');
                                    configScript.setAttribute('data-splash', 'flavorflav:6/5');

                                    $div.append(configScript);
                                    embed({}, done, readyState);
                                });

                                it('should find the script by the global exp id', function() {
                                    expect(settingsByExp('e-456')).toEqual(jasmine.any(Object));
                                });

                                it('should remove the pending experience id', function() {
                                    expect(window.c6.pending).toEqual([]);
                                });

                                describe('if there is nothing in the pending array', function() {
                                    var actualScript;

                                    beforeEach(function(done) {
                                        var fakeScript = document.createElement('script');

                                        actualScript = document.createElement('script');

                                        window.c6 = {
                                            pending: []
                                        };

                                        actualScript.setAttribute('data-exp', 'e-def');
                                        actualScript.setAttribute('data-splash', 'flavorflav:6/5');

                                        $div.append(actualScript);
                                        $div.append(fakeScript);

                                        embed({}, done, readyState);
                                    });

                                    it('should try to use the last c6embed script on the page', function() {
                                        expect(settingsByExp('e-def').config.script).toBe(actualScript);
                                    });
                                });
                            });
                        });

                        describe('methods', function() {
                            describe('loadExperience(embed, preload)', function() {
                                beforeEach(function() {
                                    window.c6.embeds[0].preload = true;
                                    window.c6.loadExperience(window.c6.embeds[0]);
                                });

                                it('should pull down the full embed app', function() {
                                    expect(window.c6.app.src).toBe('http://staging.cinema6.com/foo.js');
                                    expect(window.c6.app.parentNode).toBe(document.getElementsByTagName('head')[0]);
                                });

                                it('should set load to true on the embed', function() {
                                    expect(window.c6.embeds[0].load).toBe(true);
                                });

                                it('should set preload to false on the embed', function() {
                                    expect(window.c6.embeds[0].preload).toBe(false);
                                });

                                describe('if preload is provided as true', function() {
                                    beforeEach(function() {
                                        window.c6.embeds[0].load = false;

                                        window.c6.loadExperience(window.c6.embeds[0], true);
                                    });

                                    it('should set load to true', function() {
                                        expect(window.c6.embeds[0].load).toBe(true);
                                    });

                                    it('should set preload to true', function() {
                                        expect(window.c6.embeds[0].preload).toBe(true);
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

        function createEmbed(attrs, done) {
            return embed(attrs.reduce(function(config, pair) {
                config[pair[0]] = pair[1];
                return config;
            }, { 'data-exp': 'e-60196c3751eb52', 'data-splash': 'foo:1/1' }), done);
        }

        describe('data-preload attr', function() {
            beforeEach(function() {
                window.c6 = {
                    embeds: [],
                    loadExperience: jasmine.createSpy('c6.loadExperience()')
                };
            });

            describe('if true', function() {
                beforeEach(function(done) {
                    createEmbed([['data-preload']], done);
                });

                it('should preload the experience', function() {
                    expect(window.c6.loadExperience).toHaveBeenCalledWith(settingsByExp('e-60196c3751eb52'), true);
                });
            });

            describe('if preload is false', function() {
                beforeEach(function(done) {
                    createEmbed([], done);
                });

                it('should not preload the experience', function() {
                    expect(window.c6.loadExperience).not.toHaveBeenCalled();
                });
            });
        });

        describe('data-auto-launch attr', function() {
            beforeEach(function() {
                window.c6 = {
                    embeds: [],
                    loadExperience: jasmine.createSpy('c6.loadExperience()')
                };
            });

            describe('if true', function() {
                beforeEach(function(done) {
                    createEmbed([['data-auto-launch']], done);
                });

                it('should auto launch the experience', function() {
                    expect(window.c6.loadExperience).toHaveBeenCalledWith(settingsByExp('e-60196c3751eb52'), true);
                });

                it('should make the autoLaunch boolean true', function() {
                    expect(window.c6.loadExperience).toHaveBeenCalledWith(jasmine.objectContaining({ autoLaunch: true }), true);
                });
            });

            describe('if false', function() {
                beforeEach(function(done) {
                    createEmbed([], done);
                });

                it('should not auto launch the experience', function() {
                    expect(window.c6.loadExperience).not.toHaveBeenCalled();
                });

                it('should make the autoLaunch boolean true', function() {
                    expect(settingsByExp('e-60196c3751eb52').autoLaunch).toBe(false);
                });
            });
        });

        describe('with no branding', function() {
            beforeEach(function(done) {
                embed({
                    'data-exp': 'e-abc',
                    'data-splash': 'flavorflav:6/5'
                }, done);
            });

            it('should not add a branding stylesheet', function() {
                expect($('link#c6-undefined').length).toBe(0);
            });
        });

        describe('when responsive', function() {
            beforeEach(function(done) {
                embed({
                    'data-exp': 'e-abc',
                    'data-splash': 'flavorflav:6/5'
                }, done);
            });

            describe('the container', function() {
                var embed;

                beforeEach(function() {
                    embed = settingsByExp('e-abc').embed;
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
                embed({
                    'data-exp': 'e-def',
                    'data-width': '100%',
                    'data-height': '300px',
                    'data-splash': 'foo:1/1'
                }, done);
            });

            describe('the container', function() {
                var embed;

                beforeEach(function() {
                    embed = settingsByExp('e-def').embed;
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
