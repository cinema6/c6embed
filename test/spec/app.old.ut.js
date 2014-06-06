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
            $window,
            browserInfo;

        var tracker,
            testFrame,
            testDoc,
            exp,
            session,
            indexHTML;

        function Session() {
            asEvented.call(this);

            spyOn(this, 'on').and.callThrough();
            this.ping = jasmine.createSpy('session.ping');
            session = this;
        }

        function run() {
            app({ config: config, q: q, c6Db: c6Db, c6Ajax: c6Ajax, experience: experience, window: $window, $: $, browserInfo : browserInfo });
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
                '            .container {',
                '                min-height: 200px; margin: 100px; padding: 50px;',
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

            app = require('../../src/app.old');
            q = require('../../node_modules/q/q.js');
            asEvented = require('../../node_modules/asEvented/asevented.js');
            C6Query = require('../../lib/C6Query');

            $ = new C6Query({ window: testFrame.contentWindow, document: testDoc });

            exp = {
                id: 'e-dbc8133f4d41a7',
                appUri: 'minireel',
                data: {}
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
                history: {},
                addEventListener: jasmine.createSpy('window.addEventListener()')
                    .and.callFake(function(event, handler) {
                        var handlers = this._handlers[event] = (this._handlers[event] || []);

                        handlers.push(handler);
                    }),
                removeEventListener: jasmine.createSpy('window.removeEventListener()')
                    .and.callFake(function(event, handler) {
                        var handlers = this._handlers[event] = (this._handlers[event] || []);

                        handlers.splice(handlers.indexOf(handler), 1);
                    }),
                _handlers: {},
                trigger: function(event) {
                    (this._handlers[event] || []).forEach(function(handler) {
                        handler({});
                    });
                },
                scrollTo: jasmine.createSpy('window.scrollTo()'),
                __c6_ga__ : jasmine.createSpy('window.__c6_ga__')
            };

            config = {
                experienceId: 'e-dbc8133f4d41a7',
                $script: $('#mockScript'),
                width: '100%',
                height: '200',
                appBase: 'http://cinema6.com/experiences',
                urlRoot: 'http://cinema6.com',
                debug: true
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
                        if (config.url === 'http://staging.cinema6.com/experiences/minireel/index.html' ||
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

            browserInfo = {
                profile : {
                    device : 'desktop' 
                }
            };
        });

        afterEach(function() {
            document.getElementsByTagName('body')[0].removeChild(testFrame);
        });

        describe('creating the iframe', function() {
            describe('if width and height are explicit', function() {
                beforeEach(run);

                it('should create an empty iframe after the script tag', function() {
                    var $iframe = $('div.mr-container iframe'),
                        $script = config.$script;

                    expect($iframe.length).toBe(1);
                    expect($iframe[0].src).toBe('about:blank');
                    expect($iframe[0].height).toBe('0');
                    expect($iframe[0].width).toBe(config.width);
                    expect($iframe.prop('style').border).toBe('none');
                    expect($iframe[0].scrolling).toBe('no');
                    expect($iframe.classes()).toContain('c6__cant-touch-this');

                    expect($iframe[0].previousSibling.previousSibling).toBe($script[0]);
                });
            });

            describe('if it should be responsive', function() {
                beforeEach(function() {
                    config.responsive = true;
                    run();
                });

                it('should put the iframe in a special responsive container', function() {
                    var $container = $('#c6-responsive'),
                        $iframe = $('#c6-responsive>iframe'),
                        $script = config.$script;

                    expect($container.length).toBe(1);
                    expect($container.attr('style')).toBe('position: relative; width:100%; height:0; box-sizing: border-box; -moz-box-sizing: border-box; font-size: 16px;');
                    expect($container.classes()).toContain('c6__cant-touch-this');

                    expect($iframe.length).toBe(1);
                    expect($iframe[0].src).toBe('about:blank');
                    expect($iframe[0].height).toBe('0');
                    expect($iframe[0].width).toBe('100%');
                    expect($iframe.prop('style').border).toBe('none');
                    expect($iframe.prop('style').position).toBe('absolute');
                    expect($iframe.prop('style').top).toBe('0px');
                    expect($iframe.prop('style').left).toBe('0px');
                    expect($iframe[0].scrolling).toBe('no');
                    expect($iframe.classes()).toContain('c6__cant-touch-this');

                    expect($container[0].previousSibling.previousSibling).toBe($script[0]);
                });
            });

            it('should create a placeholder div after the script', function() {
                var $script = config.$script;

                run();

                expect($($script[0].nextSibling).prop('id')).toBe('c6-placeholder');
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
                    config.appBase = 'http://staging.cinema6.com/experiences';
                    run();
                    setTimeout(done, 3);
                });

                it('should fetch the index file from the dev box', function() {
                    expect(c6Ajax.get).toHaveBeenCalledWith('http://staging.cinema6.com/experiences/minireel/index.html');
                });
            });

            describe('if not in debug mode', function() {
                beforeEach(function(done) {
                    run();
                    setTimeout(done, 3);
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
                    exp.data.mode = 'lightbox';
                    run();
                    setTimeout(done, 4);
                });

                it('should write the contents of index.html into the iframe with a base tag to fix relative urls, and a replaceState() command to fix document.referrer, mode=lightbox', function() {
                    var $iframe = $('.mr-container iframe');

                    expect($iframe.attr('data-srcdoc')).toBe([
                        '<html>',
                        '    <head><base href="http://cinema6.com/experiences/minireel/"><script>window.c6={kDebug:true,kMode:\'lightbox\',kDevice:\'desktop\',kEnvUrlRoot:\'http://cinema6.com\'};</script><script>window.history.replaceState({}, "parent", window.parent.location.href);</script>',
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

            describe('if mobile the browser supports history.replaceState()', function() {
                beforeEach(function(done) {
                    $window.history.replaceState = function() {};
                    browserInfo.profile.device = 'phone';
                    exp.data.mode = 'lightbox';
                    run();
                    setTimeout(done, 4);
                });

                it('should write the contents of index.html into the iframe with a base tag to fix relative urls, and a replaceState() command to fix document.referrer, mode=mobile', function() {
                    var $iframe = $('.mr-container iframe');

                    expect($iframe.attr('data-srcdoc')).toBe([
                        '<html>',
                        '    <head><base href="http://cinema6.com/experiences/minireel/"><script>window.c6={kDebug:true,kMode:\'lightbox\',kDevice:\'phone\',kEnvUrlRoot:\'http://cinema6.com\'};</script><script>window.history.replaceState({}, "parent", window.parent.location.href);</script>',
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
                    exp.data.mode = 'lightbox';
                    run();
                    setTimeout(done, 4);
                });

                it('should write the contents of index.html into the iframe with a base tag to fix relative urls', function() {
                    var $iframe = $('.mr-container iframe');

                    expect($iframe.attr('data-srcdoc')).toBe([
                        '<html>',
                        '    <head><base href="http://cinema6.com/experiences/minireel/"><script>window.c6={kDebug:true,kMode:\'lightbox\',kDevice:\'desktop\',kEnvUrlRoot:\'http://cinema6.com\'};</script>',
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

        describe('setting responsive styles', function() {
            describe('if the experience is responsive', function() {
                beforeEach(function(done) {
                    config.responsive = true;
                    run();
                    setTimeout(function() {
                        session.trigger('ready', true);
                        done();
                    }, 5);
                });

                it('should give the container the provided styles', function() {
                    var styles = {
                            paddingTop: '10px',
                            minHeight: '20%',
                            maxHeight: '35%'
                        },
                        $container = $('#c6-responsive');

                    session.trigger('responsiveStyles', styles);

                    expect($container.css('minHeight')).toBe('20%');
                    expect($container.css('maxHeight')).toBe('35%');
                    expect($container.css('padding-top')).toBe('10px');
                });
            });

            describe('if the experience is not responsive', function() {
                beforeEach(function(done) {
                    config.responsive = true;
                    run();
                    setTimeout(function() {
                        session.trigger('ready', true);
                        done();
                    }, 5);
                });

                it('should do nothing destructive', function() {
                    expect(function() {
                        session.trigger('responsiveStyles', {});
                    }).not.toThrow();
                });
            });
        });

        describe('in responsive mode', function() {
            describe('when the experience requests to leave fullscreen', function() {
                beforeEach(function(done) {
                    config.responsive = true;
                    run();
                    setTimeout(function() {
                        session.trigger('ready', true);
                        done();
                    }, 5);
                });

                it('should revert its styling back to the original styles', function() {
                    var $iframe = $('.mr-container iframe'),
                        originalStyle = $iframe.attr('style');

                    session.trigger('fullscreenMode', true);
                    session.trigger('fullscreenMode', false);

                    expect($iframe.attr('style')).toBe(originalStyle);
                });
            });

            describe('when the experience is ready', function() {
                beforeEach(function(done) {
                    config.responsive = true;
                    run();
                    setTimeout(function() {
                        $('.mr-container iframe')[0].contentWindow.onload();
                        setTimeout(function() {
                            session.trigger('ready', true);
                            done();
                        });
                    }, 5);
                });

                it('should set the iframe to be 100% of the responsive container', function() {
                    var $iframe = $('.mr-container iframe'),
                        $responsive = $('#c6-responsive');

                    $responsive.css('height', '300px');

                    expect($iframe.css('height')).toBe($responsive.css('height'));
                });
            });
        });

        describe('communicating with the application', function() {
            beforeEach(function(done) {
                run();
                setTimeout(done, 5);
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

                it('should remove the placeholder', function() {
                    var $script = config.$script;

                    expect($script[0].nextSibling).toBe($('.mr-container iframe')[0]);
                });

                it('should set the iframe to the correct height', function() {
                    var $iframe = $('.mr-container iframe');

                    expect($iframe.css('height')).toBe('200px');
                });

                describe('when the experience requests fullscreen on a phone', function() {
                    beforeEach(function() {
                        browserInfo.profile.device = 'phone';
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
                            expect($child[0].getBoundingClientRect().height).toBe(0);
                            expect($child.css('overflow')).toBe('hidden');
                            expect($child.classes()).toContain('c6__play-that-funky-music-white-boy');
                        });

                        expect($fixed.classes()).toContain('c6__play-that-funky-music-white-boy');
                        expect($fixed.css('position')).toBe('relative');
                    });

                    it('should not mess with elements that have the c6__cant-touch-this class', function() {
                        expect($('.c6__cant-touch-this').css('position')).toBe('fixed');
                    });

                    it('should scroll the window to the top', function() {
                        expect($window.scrollTo).toHaveBeenCalledWith(0, 0);
                    });

                    it('should scroll to the top whenever the device orientation changes', function() {
                        $window.trigger('orientationchange');
                        expect($window.scrollTo.calls.count()).toBe(2);

                        $window.trigger('orientationchange');
                        expect($window.scrollTo.calls.count()).toBe(3);

                        $window.trigger('orientationchange');
                        expect($window.scrollTo.calls.count()).toBe(4);
                    });
                });

                describe('when the experience requests fullscreen on desktop',function(){
                    beforeEach(function() {
                        browserInfo.profile.device = 'desktop';
                        session.trigger('fullscreenMode', true);
                    });

                    it('should shrink the site down to an itty-bitty thang', function() {
                        var $body = $('body'),
                            $firstChildren = $($body[0].childNodes),
                            $fixed = $('.fixed');

                        $firstChildren.forEach(function(child) {
                            if (child instanceof testFrame.contentWindow.Text) { return; }

                            var $child = $(child);

                            expect($child.css('position')).toBe('static');
                            expect($child.css('height')).toBe('300px');
                            expect($child.css('overflow')).toBe('visible');
                            expect($child.classes()).toContain('container');
                        });

                        expect($fixed.classes()).toContain('fixed');
                        expect($fixed.css('position')).toBe('fixed');
                    });
                    
                    it('should not scroll the window to the top', function() {
                        expect($window.scrollTo).not.toHaveBeenCalled();
                    });

                    it('should not scroll to the top whenever the device orientation changes', function() {
                        $window.trigger('orientationchange');
                        expect($window.scrollTo.calls.count()).toBe(0);

                        $window.trigger('orientationchange');
                        expect($window.scrollTo.calls.count()).toBe(0);

                        $window.trigger('orientationchange');
                        expect($window.scrollTo.calls.count()).toBe(0);
                    });
                });

                describe('when the experience requests to leave fllscrn on mobile', function() {
                    beforeEach(function() {
                        browserInfo.profile.device = 'phone';
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
                        expect($iframe.css('width')).toBe('484px');
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

                    it('should not trigger a scroll to the top', function() {
                        $window.trigger('orientationchange');
                        expect($window.scrollTo.calls.count()).toBe(1);

                        $window.trigger('orientationchange');
                        expect($window.scrollTo.calls.count()).toBe(1);

                        $window.trigger('orientationchange');
                        expect($window.scrollTo.calls.count()).toBe(1);
                    });
                });
            });

        });

        describe('google analytics',function(){
            beforeEach(function(){
                config.gaAcctId = 'abc';
                tracker = {
                    get : jasmine.createSpy('tracker.get')
                };
                tracker.get.and.returnValue('fake_client_id');

//                $window.__c6_ga__ = jasmine.createSpy('window.__c6_ga__');
                $window.__c6_ga__.getByName = jasmine.createSpy('ga.getByName')
                    .and.returnValue(tracker);
            });
            it('sends /embed/app page view',function(done){
                run();
                setTimeout(function(){
                    expect($window.__c6_ga__.calls.argsFor(0)).toEqual(['c6.send','pageview',
                        { 
                            page : '/embed/app?experienceId=e-dbc8133f4d41a7',
                            title : 'c6Embed App' 
                    }]);
                    done();
                },1);
            });

            it('sends a ping if it gets a clientId',function(done){
                run();
                setTimeout(function(){
                    session.trigger('ready', true);
                    $window.__c6_ga__.calls.mostRecent().args[0]();
                    expect($window.__c6_ga__.getByName).toHaveBeenCalledWith('c6');
                    expect(tracker.get).toHaveBeenCalledWith('clientId');
                    expect(session.ping).toHaveBeenCalledWith('initAnalytics',{ accountId : 'abc', clientId : 'fake_client_id' } );
                    done();
                },1);
            });

            it('sends no ping if it gets no clientId',function(done){
                tracker.get.and.returnValue(undefined);
                run();
                setTimeout(function(){
                    session.trigger('ready', true);
                    $window.__c6_ga__.calls.mostRecent().args[0]();
                    expect(session.ping).not.toHaveBeenCalled();
                    done();
                },1);
            });

            it('sends no ping if no tracker is returned',function(done){
                $window.__c6_ga__.getByName.and.returnValue(undefined);
                run();
                setTimeout(function(){
                    session.trigger('ready', true);
                    $window.__c6_ga__.calls.mostRecent().args[0]();
                    expect(session.ping).not.toHaveBeenCalled();
                    done();
                },1);
            });
        });
    });
}());