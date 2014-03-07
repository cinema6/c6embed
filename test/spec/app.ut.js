(function() {
    'use strict';

    describe('app', function() {
        var app,
            q,
            C6Query,
            $,
            asEvented;

        var c6Db,
            c6Ajax,
            experience,
            config,
            $window;

        var testFrame,
            testDoc,
            exp,
            session,
            indexHTML;

        function Session() {
            asEvented.call(this);

            spyOn(this, 'on').and.callThrough();

            session = this;
        }

        function run() {
            app({ config: config, q: q, c6Db: c6Db, c6Ajax: c6Ajax, experience: experience, window: $window, $: $ });
        }

        beforeEach(function(done) {
            var body = document.getElementsByTagName('body')[0];

            function waitForReady() {
                if (testDoc.readyState === 'complete') {
                    done();
                } else {
                    setTimeout(waitForReady, 50);
                }
            }

            testFrame = document.createElement('iframe');

            testFrame.src = 'about:blank';
            testFrame.width = '800';
            testFrame.height = '600';

            body.appendChild(testFrame);
            testDoc = testFrame.contentWindow.document;

            testDoc.open('text/html', 'replace');
            testDoc.write([
                '<html>',
                '    <head>',
                '        <title>Elite Daily</title>',
                '        <style>',
                '            .floater {',
                '                position: absolute; width: 200px; height: 1000px;',
                '            }',
                '            .fixed {',
                '                position: fixed !important; width: 20px; height: 300px !important;',
                '            }',
                '        </style>',
                '    </head>',
                '    <body>',
                '        <div style="height: 300px;" class="container">',
                '            <article>',
                '                <h1>My Post</h1>',
                '                <div class="mr-container">',
                '                    <script id="mockScript"></script>',
                '                </div>',
                '                <iframe style="position: fixed; height: 100%; width: 100%;" src="about:blank" class="c6__cant-touch-this"></iframe>',
                '                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut tristique volutpat dolor quis convallis. Nunc vestibulum, mauris quis luctus imperdiet.</p>',
                '                <p>Nunc accumsan malesuada metus, eget malesuada nibh dignissim et. Pellentesque tempor, nisi in semper varius, urna eros mattis eros, non luctus diam urna a mi.</p>',
                '            </article>',
                '            <div class="floater">I\'m floating!</div>',
                '            <div>',
                '                <span class="fixed">I\'m fixed!</span>',
                '            </div>',
                '        </div>',
                '    </body>',
                '</html>'
            ].join('\n'));
            testDoc.close();

            setTimeout(waitForReady, 50);

            app = require('../../src/app');
            q = require('../../node_modules/q/q.js');
            asEvented = require('../../node_modules/asEvented/asevented.js');
            C6Query = require('../../lib/C6Query');

            $ = new C6Query({ window: testFrame.contentWindow, document: testDoc });

            exp = {
                id: 'e-dbc8133f4d41a7',
                appUri: 'minireel'
            };

            indexHTML = [
                '<html>',
                '    <head>',
                '        <title>My Title</title>',
                '    </head>',
                '    <body>',
                '        <h1>This is the file!</h1>',
                '    </body>',
                '</html>'
            ].join('\n');

            $window = {
                history: {}
            };

            config = {
                experienceId: 'e-dbc8133f4d41a7',
                $script: $('#mockScript'),
                width: '100%',
                height: '200'
            };

            experience = {
                registerExperience: jasmine.createSpy('experience.registerExperience()')
                    .and.callFake(function() {
                        return new Session();
                    })
            };

            c6Ajax = jasmine.createSpy('c6Ajax()')
                .and.callFake(function(config) {
                    if (config.method === 'GET') {
                        if (config.url === 'http://s3.amazonaws.com/c6.dev/content/minireel/index.html' ||
                            config.url === 'http://cinema6.com/experiences/minireel/index.html') {

                            return q.when({
                                status: 200,
                                data: indexHTML,
                                headers: function() { return {}; }
                            });
                        }
                    }
                });
            c6Ajax.get = jasmine.createSpy('c6Ajax.get()')
                .and.callFake(function(url, config) {
                    config = config || {};

                    config.method = 'GET';
                    config.url = url;

                    return c6Ajax(config);
                });

            c6Db = {
                find: jasmine.createSpy('c6Db.find()')
                    .and.callFake(function(type, id) {
                        if (type === 'experience' && id === 'e-dbc8133f4d41a7') {
                            return q.when(exp);
                        }
                    })
            };
        });

        afterEach(function() {
            document.getElementsByTagName('body')[0].removeChild(testFrame);
        });

        describe('creating the iframe', function() {
            beforeEach(run);

            it('should create an empty iframe after the script tag', function() {
                var $iframe = $('div.mr-container iframe'),
                    $script = config.$script;

                expect($iframe.length).toBe(1);
                expect($iframe[0].src).toBe('about:blank');
                expect($iframe[0].height).toBe(config.height);
                expect($iframe[0].width).toBe(config.width);
                expect($iframe.prop('style').border).toBe('none');
                expect($iframe[0].scrolling).toBe('yes');
                expect($iframe.classes()).toContain('c6__cant-touch-this');

                expect($iframe[0].previousSibling).toBe($script[0]);
            });
        });

        describe('fetching the experience', function() {
            beforeEach(function(done) {
                run();
                setTimeout(done, 1);
            });

            it('should fetch the experience', function() {
                expect(c6Db.find).toHaveBeenCalledWith('experience', config.experienceId);
            });
        });

        describe('fetching index.html', function() {
            describe('if in debug mode', function() {
                beforeEach(function(done) {
                    config.debug = true;

                    run();
                    setTimeout(done, 2);
                });

                it('should fetch the index file from the dev box', function() {
                    expect(c6Ajax.get).toHaveBeenCalledWith('http://s3.amazonaws.com/c6.dev/content/minireel/index.html');
                });
            });

            describe('if not in debug mode', function() {
                beforeEach(function(done) {
                    run();
                    setTimeout(done, 2);
                });

                it('should fetch the index file from the dev box', function() {
                    expect(c6Ajax.get).toHaveBeenCalledWith('http://cinema6.com/experiences/minireel/index.html');
                });
            });
        });

        describe('loading the app into the iframe', function() {
            /* jshint scripturl:true */
            describe('if the browser supports history.replaceState()', function() {
                beforeEach(function(done) {
                    $window.history.replaceState = function() {};

                    run();
                    setTimeout(done, 3);
                });

                it('should write the contents of index.html into the iframe with a base tag to fix relative urls, and a replaceState() command to fix document.referrer', function() {
                    var $iframe = $('.mr-container iframe');

                    expect($iframe.attr('data-srcdoc')).toBe([
                        '<html>',
                        '    <head><base href="http://cinema6.com/experiences/minireel/"><script>window.history.replaceState({}, "parent", window.parent.location.href);</script>',
                        '        <title>My Title</title>',
                        '    </head>',
                        '    <body>',
                        '        <h1>This is the file!</h1>',
                        '    </body>',
                        '</html>'
                    ].join('\n'));
                    expect(decodeURI($iframe.prop('src'))).toBe('javascript: window.frameElement.getAttribute(\'data-srcdoc\')');
                });
            });

            describe('if the browser does not support history.replaceState()', function() {
                beforeEach(function(done) {
                    run();
                    setTimeout(done, 3);
                });

                it('should write the contents of index.html into the iframe with a base tag to fix relative urls', function() {
                    var $iframe = $('.mr-container iframe');

                    expect($iframe.attr('data-srcdoc')).toBe([
                        '<html>',
                        '    <head><base href="http://cinema6.com/experiences/minireel/">',
                        '        <title>My Title</title>',
                        '    </head>',
                        '    <body>',
                        '        <h1>This is the file!</h1>',
                        '    </body>',
                        '</html>'
                    ].join('\n'));
                    expect(decodeURI($iframe.prop('src'))).toBe('javascript: window.frameElement.getAttribute(\'data-srcdoc\')');
                });
            });
        });

        describe('communicating with the application', function() {
            beforeEach(function(done) {
                run();
                setTimeout(done, 4);
            });

            it('should register the experience', function() {
                expect(experience.registerExperience).toHaveBeenCalledWith(exp, $('.mr-container iframe').prop('contentWindow'));
            });

            describe('when the session is ready', function() {
                beforeEach(function() {
                    session.trigger('ready', true);
                });

                it('should listen for the fullscreenMode event', function() {
                    expect(session.on).toHaveBeenCalledWith('fullscreenMode', jasmine.any(Function));
                });

                describe('when the experience requests fullscreen', function() {
                    beforeEach(function() {
                        session.trigger('fullscreenMode', true);
                    });

                    it('should give the iframe fullscreen styles', function() {
                        var $iframe = $('.mr-container iframe');

                        expect($iframe.css('position')).toBe('fixed');
                        expect($iframe.css('top')).toBe('0px');
                        expect($iframe.css('right')).toBe('0px');
                        expect($iframe.css('bottom')).toBe('0px');
                        expect($iframe.css('left')).toBe('0px');
                        expect($iframe.css('width')).toBe($(testFrame).css('width'));
                        expect($iframe.css('height')).toBe($(testFrame).css('height'));
                        expect($iframe.css('zIndex')).toBe('2147483647');
                    });

                    it('should shrink the site down to an itty-bitty thang', function() {
                        var $body = $('body'),
                            $firstChildren = $($body[0].childNodes),
                            $fixed = $('.fixed');

                        $firstChildren.forEach(function(child) {
                            if (child instanceof testFrame.contentWindow.Text) { return; }

                            var $child = $(child);

                            expect($child.css('position')).toBe('relative');
                            expect($child.css('height')).toBe('0px');
                            expect($child.css('overflow')).toBe('hidden');
                            expect($child.classes()).toContain('c6__play-that-funky-music-white-boy');
                        });

                        expect($fixed.classes()).toContain('c6__play-that-funky-music-white-boy');
                        expect($fixed.css('position')).toBe('relative');
                    });

                    it('should not mess with elements that have the c6__cant-touch-this class', function() {
                        expect($('.c6__cant-touch-this').css('position')).toBe('fixed');
                    });
                });

                describe('when the experience requests to leave fullscreen', function() {
                    beforeEach(function() {
                        session.trigger('fullscreenMode', true);
                        session.trigger('fullscreenMode', false);
                    });

                    it('should give the iframe default styles', function() {
                        var $iframe = $('.mr-container iframe');

                        expect($iframe.css('position')).toBe('static');
                        expect($iframe.css('top')).toBe('auto');
                        expect($iframe.css('right')).toBe('auto');
                        expect($iframe.css('bottom')).toBe('auto');
                        expect($iframe.css('left')).toBe('auto');
                        expect($iframe.css('width')).toBe('784px');
                        expect($iframe.css('height')).toBe('200px');
                        expect($iframe.css('zIndex')).toBe('auto');
                    });

                    it('should set all the modified elements to their original state', function() {
                        var $container = $('.container'),
                            $fixed = $('.fixed');

                        expect($container.css('height')).toBe('300px');
                        expect($container.css('overflow')).toBe('visible');
                        expect($container.css('position')).toBe('static');
                        expect($container.hasClass('c6__play-that-funky-music-white-boy')).toBe(false);

                        expect($fixed.css('position')).toBe('fixed');
                        expect($fixed.hasClass('c6__play-that-funky-music-white-boy')).toBe(false);
                    });
                });
            });
        });
    });
}());
