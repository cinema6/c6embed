var proxyquire = require('proxyquireify')(require);

describe('c6embed(beforeElement, params)', function() {
    'use strict';

    var resolveUrl;
    var querystring;
    var q;
    var twobits;
    var Player, importScripts, BrowserInfo;
    var stubs;
    var container;

    var playerBootstrapDeferred;

    var c6embed;

    beforeEach(function() {
        resolveUrl = require('url').resolve;
        querystring = require('querystring');
        q = require('q');
        twobits = require('twobits.js');
        require('rc-browser-info'); // Make sure this is a valid module

        Player = jasmine.createSpy('Player()').and.callFake(function(endpoint, params, data) {
            var Player = require('../../lib/Player');
            var player = new Player(endpoint, params, data);

            playerBootstrapDeferred = q.defer();
            spyOn(player, 'bootstrap').and.callFake(function() {
                Player.prototype.bootstrap.apply(this, arguments);

                return playerBootstrapDeferred.promise;
            });
            spyOn(player, 'show').and.callThrough();
            spyOn(player, 'hide').and.callThrough();

            return player;
        });

        importScripts = jasmine.createSpy('importScripts()');

        BrowserInfo = jasmine.createSpy('BrowserInfo()').and.callFake(function(agent) {
            this.agent = agent;

            this.isMobile = false;
            this.isTablet = false;
            this.isDesktop = true;
        });

        stubs = {
            '../../lib/Player': Player,
            '../../lib/importScripts': importScripts,
            'twobits.js': twobits,
            'rc-browser-info': BrowserInfo,

            '@noCallThru': true
        };

        container = document.createElement('div');
        container.innerHTML = [
            '<span id="one"></span>',
            '<span id="two"></span>',
            '<span id="three"></span>'
        ].join('');
        document.body.appendChild(container);

        c6embed = proxyquire('../../src/embed/embed-js', stubs);
    });

    afterEach(function() {
        document.body.removeChild(container);
    });

    it('should exist', function() {
        expect(c6embed).toEqual(jasmine.any(Function));
        expect(c6embed.name).toBe('c6embed');
    });

    describe('when called', function() {
        var beforeElement, params;
        var success, failure;

        var browser, player, embed, splash, lightboxes;

        beforeEach(function(done) {
            beforeElement = container.querySelector('span#two');
            params = {
                apiRoot: 'https://dev.cinema6.com/',
                type: 'desktop-card',
                experience: 'e-3f3b58482741e3',
                campaign: 'cam-f71ce1be881d10',
                branding: 'theinertia',
                placementId: '7475348',
                container: 'digitaljournal',
                wildCardPlacement: '485738459',
                pageUrl: 'cinema6.com',
                hostApp: 'Google Chrome',
                network: 'cinema6',
                preview: false,
                categories: ['food', 'tech'],
                playUrls: ['play1.gif', 'play2.gif'],
                countUrls: ['count1.gif', 'count2.gif'],
                launchUrls: ['launch1.gif', 'launch2.gif'],
                mobileType: 'swipe',
                width: '800px',
                height: '600px',
                autoLaunch: false,
                splash: {
                    type: 'img-text-overlay',
                    ratio: '16:9'
                },
                ex: 'my-experiment',
                vr: 'some-variant',
                preload: false,
                title: 'This is an Awesome MiniReel!',
                image: '/collateral/experiences/e-3f3b58482741e3/splash'
            };

            success = jasmine.createSpy('success()');
            failure = jasmine.createSpy('failure()');

            spyOn(document, 'createElement').and.callThrough();

            browser = {
                agent: window.navigator.userAgent,

                isMobile: false,
                isTablet: false,
                isDesktop: true
            };
            BrowserInfo.and.returnValue(browser);

            c6embed(beforeElement, params).then(success, failure);
            setTimeout(function() {
                player = Player.calls.mostRecent().returnValue;
                embed = document.createElement.calls.all()[0].returnValue;
                lightboxes = document.createElement.calls.all()[1].returnValue;
                splash = document.createElement.calls.all()[2].returnValue;

                done();
            }, 1);
        });

        afterEach(function() {
            var node;
            while ((node = document.getElementById('c6-lightboxes'))) {
                node.parentNode.removeChild(node);
            }
        });

        it('should create a BrowserInfo instance', function() {
            expect(BrowserInfo).toHaveBeenCalledWith(window.navigator.userAgent);
        });

        it('should create a Player', function() {
            expect(Player).toHaveBeenCalledWith('https://dev.cinema6.com/api/public/players/desktop-card', {
                apiRoot: 'https://dev.cinema6.com/',
                type: 'desktop-card',
                experience: 'e-3f3b58482741e3',
                campaign: 'cam-f71ce1be881d10',
                branding: 'theinertia',
                placementId: '7475348',
                container: 'digitaljournal',
                wildCardPlacement: '485738459',
                pageUrl: 'cinema6.com',
                hostApp: 'Google Chrome',
                network: 'cinema6',
                preview: false,
                categories: ['food', 'tech'],
                playUrls: ['play1.gif', 'play2.gif'],
                countUrls: ['count1.gif', 'count2.gif'],
                launchUrls: ['launch1.gif', 'launch2.gif'],
                mobileType: 'swipe',
                width: '800px',
                height: '600px',
                autoLaunch: false,
                splash: {
                    type: 'img-text-overlay',
                    ratio: '16:9'
                },
                ex: 'my-experiment',
                vr: 'some-variant',
                preload: false,
                title: 'This is an Awesome MiniReel!',
                image: '/collateral/experiences/e-3f3b58482741e3/splash',
                standalone: false,
                context: 'embed'
            });
        });

        it('should create a <div> for the embed, splash and lightboxes', function() {
            expect(document.createElement.calls.count()).toBe(3);
            document.createElement.calls.all().forEach(function(call) {
                expect(call.args).toEqual(['div']);
            });

            expect(Array.prototype.slice.call(embed.classList)).toContain('c6embed-' + params.experience);
            expect(embed.style.position).toBe('relative');
            expect(embed.contains(splash)).toBe(true);

            expect(lightboxes.id).toBe('c6-lightboxes');
            expect(lightboxes.style.position).toBe('relative');
            expect(lightboxes.style.width).toBe('0px');
            expect(lightboxes.style.height).toBe('0px');
            expect(lightboxes.style.overflow).toBe('hidden');
            expect(lightboxes.parentNode).toBe(document.body);
        });

        it('should configure the embed with the specified width and height', function() {
            expect(embed.style.width).toBe(params.width);
            expect(embed.style.height).toBe(params.height);
        });

        it('should give the splash a class for its branding', function() {
            expect(Array.prototype.slice.call(splash.classList)).toContain('c6brand__theinertia');
        });

        it('should not hide the splash', function() {
            expect(splash.style.display).toBe('');
        });

        it('should load a branding stylesheet', function() {
            var link = document.getElementById('c6-theinertia');

            expect(link.tagName).toBe('LINK');
            expect(link.href).toBe('https://dev.cinema6.com/collateral/branding/theinertia/styles/splash.css');
            expect(link.rel).toBe('stylesheet');
            expect(link.parentNode).toBe(document.head);
        });

        describe('if a stylesheet has already been loaded', function() {
            beforeEach(function(done) {
                var link = document.createElement('link');

                link.id = 'c6-elitedaily';
                link.href = 'https://dev.cinema6.com/collateral/branding/elitedaily/styles/splash.css';
                link.rel = 'stylesheet';

                document.head.appendChild(link);

                document.createElement.calls.reset();

                params.branding = 'elitedaily';
                c6embed(beforeElement, params).then(success, failure);
                setTimeout(done, 1);

                player = Player.calls.mostRecent().returnValue;
                embed = document.createElement.calls.all()[0].returnValue;
                splash = document.createElement.calls.all()[1].returnValue;
            });

            it('should not add another stylesheet', function() {
                expect(document.querySelectorAll('head link[href$="elitedaily/styles/splash.css"]').length).toBe(1);
            });

            it('should still add the class', function() {
                expect(Array.prototype.slice.call(splash.classList)).toContain('c6brand__elitedaily');
            });
        });

        it('should use importScripts() to fetch some required resources', function() {
            expect(importScripts).toHaveBeenCalledWith([
                'https://dev.cinema6.com/collateral/splash/splash.js',
                'https://dev.cinema6.com/collateral/splash/img-text-overlay/16-9.js'
            ], jasmine.any(Function));
        });

        describe('if there is already a <div> for lightboxes', function() {
            beforeEach(function(done) {
                lightboxes.parentNode.removeChild(lightboxes);

                lightboxes = document.createElement('div');
                lightboxes.id = 'c6-lightboxes';
                document.head.appendChild(lightboxes);

                document.createElement.calls.reset();

                c6embed(beforeElement, params).then(success, failure);
                setTimeout(done, 1);
            });

            it('should not create another lightboxes <div>', function() {
                expect(document.createElement.calls.count()).toBe(2);
                document.createElement.calls.all().forEach(function(call) {
                    expect(call.returnValue.id).not.toBe('c6-lightboxes');
                });
            });
        });

        describe('if the device is mobile', function() {
            beforeEach(function(done) {
                Player.calls.reset();
                document.createElement.calls.reset();

                browser.isDesktop = false;
                browser.isMobile = true;

                c6embed(beforeElement, params).then(success, failure);
                setTimeout(done, 1);

                player = Player.calls.mostRecent().returnValue;
                embed = document.createElement.calls.all()[0].returnValue;
                splash = document.createElement.calls.all()[1].returnValue;
            });

            it('should make the type the mobileType', function() {
                expect(Player).toHaveBeenCalledWith('https://dev.cinema6.com/api/public/players/swipe', jasmine.any(Object));
            });
        });

        describe('when the scripts are fetched', function() {
            var splashDelegate;
            var splashJs, splashHTML;

            beforeEach(function(done) {
                splashDelegate = {
                    didHide: jasmine.createSpy('delegate.didHide()'),
                    didShow: jasmine.createSpy('delegate.didShow()')
                };

                splashJs = jasmine.createSpy('splashJS()').and.returnValue(splashDelegate);
                splashHTML = require('../helpers/collateral/splash/flavorc/16-9');

                spyOn(twobits, 'parse').and.callFake(function() {
                    return jasmine.createSpy('compile()');
                });

                expect(success).not.toHaveBeenCalled();
                expect(failure).not.toHaveBeenCalled();

                importScripts.calls.mostRecent().args[1](splashJs, splashHTML);
                setTimeout(done, 1);
            });

            afterEach(function() {
                Array.prototype.slice.call(document.querySelectorAll('link[href$="splash.css"]')).forEach(function(link) {
                    link.parentNode.removeChild(link);
                });
            });

            it('should innerHTML the splashHTML into the splash <div>', function() {
                expect(splash.innerHTML).toBe(splashHTML);
            });

            it('should parse and compile the splash with twobits.js', function() {
                expect(twobits.parse).toHaveBeenCalledWith(splash);
                expect(twobits.parse.calls.mostRecent().returnValue).toHaveBeenCalledWith({
                    title: params.title,
                    splash: resolveUrl(params.apiRoot, params.image)
                });
            });

            it('should call the splashJs function', function() {
                expect(splashJs).toHaveBeenCalledWith({ loadExperience: jasmine.any(Function) }, null, splash);
            });

            it('should fulfill with the embed', function() {
                expect(success).toHaveBeenCalledWith(embed);
            });

            it('should append the embed to the DOM', function() {
                expect(container.contains(embed)).toBe(true);
                expect(embed.previousSibling).toBe(container.querySelector('span#one'));
            });

            describe('if called with minimal params', function() {
                beforeEach(function(done) {
                    Player.calls.reset();
                    document.createElement.calls.reset();
                    importScripts.calls.reset();
                    twobits.parse.calls.reset();

                    params = {
                        experience: 'e-3f3b58482741e3'
                    };

                    c6embed(beforeElement, params).then(success, failure);
                    setTimeout(done, 1);

                    player = Player.calls.mostRecent().returnValue;
                    embed = document.createElement.calls.all()[0].returnValue;
                    splash = document.createElement.calls.all()[1].returnValue;

                    importScripts.calls.mostRecent().args[1](splashJs, splashHTML);
                    setTimeout(done, 1);
                });

                it('should fetch a default splash image', function() {
                    expect(importScripts).toHaveBeenCalledWith(jasmine.arrayContaining(['https://platform.reelcontent.com/collateral/splash/img-text-overlay/16-9.js']), jasmine.any(Function));
                });

                it('should create a player with some defaults', function() {
                    expect(Player).toHaveBeenCalledWith('https://platform.reelcontent.com/api/public/players/light', {
                        apiRoot: 'https://platform.reelcontent.com/',
                        type: 'light',
                        container: 'embed',
                        mobileType: 'mobile',
                        splash: {
                            type: 'img-text-overlay',
                            ratio: '16:9'
                        },
                        autoLaunch: false,
                        experience: 'e-3f3b58482741e3',
                        standalone: false,
                        context: 'embed'
                    });
                });

                it('should not give the embed <div> a width or height', function() {
                    expect(embed.style.width).toBe('');
                    expect(embed.style.height).toBe('');
                });

                it('should not load any branding stylesheets', function() {
                    expect(document.getElementById('c6-undefined')).toBeNull();
                });

                it('should set the splash and title to null when compiling the template', function() {
                    expect(twobits.parse.calls.mostRecent().returnValue).toHaveBeenCalledWith(jasmine.objectContaining({
                        title: null,
                        splash: null
                    }));
                });
            });

            describe('if preload is true', function() {
                beforeEach(function(done) {
                    params.preload = true;

                    document.createElement.calls.reset();

                    c6embed(beforeElement, params).then(success, failure).finally(function() {
                        player = Player.calls.mostRecent().returnValue;
                        embed = document.createElement.calls.all()[0].returnValue;
                        splash = document.createElement.calls.all()[1].returnValue;

                        done();
                    });

                    setTimeout(function() {
                        importScripts.calls.mostRecent().args[1](splashJs, splashHTML);
                    }, 1);
                });

                it('should bootstrap the player', function() {
                    expect(player.bootstrap).toHaveBeenCalledWith(embed, jasmine.any(Object));
                });

                it('should not show the player', function() {
                    expect(player.show).not.toHaveBeenCalled();
                });
            });

            describe('if autoLaunch is true', function() {
                beforeEach(function(done) {
                    embed.parentNode.removeChild(embed);

                    params = {
                        apiRoot: 'https://dev.cinema6.com/',
                        type: 'desktop-card',
                        experience: 'e-3f3b58482741e3',
                        campaign: 'cam-f71ce1be881d10',
                        branding: 'some-new-thing',
                        placementId: '7475348',
                        container: 'digitaljournal',
                        wildCardPlacement: '485738459',
                        pageUrl: 'cinema6.com',
                        hostApp: 'Google Chrome',
                        network: 'cinema6',
                        preview: false,
                        categories: ['food', 'tech'],
                        playUrls: ['play1.gif', 'play2.gif'],
                        countUrls: ['count1.gif', 'count2.gif'],
                        launchUrls: ['launch1.gif', 'launch2.gif'],
                        mobileType: 'swipe',
                        autoLaunch: true,
                        ex: 'my-experiment',
                        vr: 'some-variant',
                        preload: false
                    };

                    document.createElement.calls.reset();
                    importScripts.calls.reset();
                    player.bootstrap.calls.reset();
                    Player.calls.reset();

                    c6embed(beforeElement, params).then(success, failure);

                    player = Player.calls.mostRecent().returnValue;
                    embed = document.createElement.calls.all()[0].returnValue;

                    setTimeout(done, 1);
                });

                it('should not create a splash <div>', function() {
                    expect(document.createElement.calls.all().filter(function(call) {
                        return call.args[0].toLowerCase() === 'div';
                    }).length).toBe(1);
                    expect(document.createElement).toHaveBeenCalledWith('div');
                });

                it('should not import any scripts', function() {
                    expect(importScripts).not.toHaveBeenCalled();
                });

                it('should create a standalone player', function() {
                    expect(Player).toHaveBeenCalledWith('https://dev.cinema6.com/api/public/players/desktop-card', {
                        splash: {
                            type: 'img-text-overlay',
                            ratio: '16:9'
                        },
                        apiRoot: 'https://dev.cinema6.com/',
                        type: 'desktop-card',
                        experience: 'e-3f3b58482741e3',
                        campaign: 'cam-f71ce1be881d10',
                        branding: 'some-new-thing',
                        placementId: '7475348',
                        container: 'digitaljournal',
                        wildCardPlacement: '485738459',
                        pageUrl: 'cinema6.com',
                        hostApp: 'Google Chrome',
                        network: 'cinema6',
                        preview: false,
                        categories: ['food', 'tech'],
                        playUrls: ['play1.gif', 'play2.gif'],
                        countUrls: ['count1.gif', 'count2.gif'],
                        launchUrls: ['launch1.gif', 'launch2.gif'],
                        mobileType: 'swipe',
                        autoLaunch: true,
                        ex: 'my-experiment',
                        vr: 'some-variant',
                        preload: false,
                        standalone: true,
                        context: 'embed'
                    });
                });

                it('should append the embed to the DOM', function() {
                    expect(container.contains(embed)).toBe(true);
                    expect(embed.previousSibling).toBe(container.querySelector('span#one'));
                });

                it('should bootstrap the player', function() {
                    expect(player.bootstrap).toHaveBeenCalledWith(embed, jasmine.any(Object));
                });

                it('should fulfill with the embed <div>', function() {
                    expect(success).toHaveBeenCalledWith(embed);
                });

                describe('and so is interstitial', function() {
                    beforeEach(function(done) {
                        embed.parentNode.removeChild(embed);

                        params.interstitial = true;

                        document.createElement.calls.reset();
                        importScripts.calls.reset();
                        player.bootstrap.calls.reset();
                        Player.calls.reset();

                        c6embed(beforeElement, params).then(success, failure);

                        player = Player.calls.mostRecent().returnValue;
                        embed = document.createElement.calls.all()[0].returnValue;
                        splash = document.createElement.calls.all()[1].returnValue;

                        setTimeout(done, 1);
                    });

                    it('should set interstitial to true and standalone to false', function() {
                        expect(Player).toHaveBeenCalledWith('https://dev.cinema6.com/api/public/players/desktop-card', {
                            splash: {
                                type: 'img-text-overlay',
                                ratio: '16:9'
                            },
                            apiRoot: 'https://dev.cinema6.com/',
                            type: 'desktop-card',
                            experience: 'e-3f3b58482741e3',
                            campaign: 'cam-f71ce1be881d10',
                            branding: 'some-new-thing',
                            placementId: '7475348',
                            container: 'digitaljournal',
                            wildCardPlacement: '485738459',
                            pageUrl: 'cinema6.com',
                            hostApp: 'Google Chrome',
                            network: 'cinema6',
                            preview: false,
                            categories: ['food', 'tech'],
                            playUrls: ['play1.gif', 'play2.gif'],
                            countUrls: ['count1.gif', 'count2.gif'],
                            launchUrls: ['launch1.gif', 'launch2.gif'],
                            mobileType: 'swipe',
                            autoLaunch: true,
                            ex: 'my-experiment',
                            vr: 'some-variant',
                            interstitial: true,
                            preload: false,
                            standalone: false,
                            context: 'embed'
                        });
                    });

                    it('should create a splash <div>', function() {
                        expect(document.createElement.calls.all().filter(function(call) {
                            return call.args[0].toLowerCase() === 'div';
                        }).length).toBe(2);
                        expect(document.createElement).toHaveBeenCalledWith('div');
                        expect(importScripts).toHaveBeenCalled();
                    });

                    it('should hide the splash', function() {
                        expect(splash.style.display).toBe('none');
                    });

                    describe('when the scripts are imported', function() {
                        var splashDelegate;
                        var splashJs, splashHTML;

                        beforeEach(function(done) {
                            splashDelegate = {
                                didHide: jasmine.createSpy('delegate.didHide()'),
                                didShow: jasmine.createSpy('delegate.didShow()')
                            };

                            splashJs = jasmine.createSpy('splashJS()').and.returnValue(splashDelegate);
                            splashHTML = require('../helpers/collateral/splash/flavorc/16-9');

                            importScripts.calls.mostRecent().args[1](splashJs, splashHTML);
                            setTimeout(done, 1);
                        });

                        afterEach(function() {
                            Array.prototype.slice.call(document.querySelectorAll('link[href$="splash.css"]')).forEach(function(link) {
                                link.parentNode.removeChild(link);
                            });
                        });

                        describe('when the player is bootstrapped', function() {
                            beforeEach(function() {
                                player.bootstrap(document.createElement('div'));
                            });

                            describe('and closed', function() {
                                beforeEach(function() {
                                    player.session.emit('close');
                                });

                                it('should show the splash', function() {
                                    expect(splash.style.display).toBe('');
                                });
                            });
                        });
                    });
                });

                describe('when the player is bootstrapped', function() {
                    beforeEach(function() {
                        player.bootstrap(document.createElement('div'));
                    });

                    describe('and opened', function() {
                        beforeEach(function() {
                            player.session.emit('open');
                        });

                        it('should set the player\'s z-index to 100', function() {
                            expect(player.frame.style.zIndex).toBe('100');
                        });
                    });

                    describe('and closed', function() {
                        beforeEach(function() {
                            player.session.emit('close');
                        });

                        it('should set the player\'s z-index to -100', function() {
                            expect(player.frame.style.zIndex).toBe('-100');
                        });
                    });

                    describe('and sends responsiveStyles', function() {
                        var styles;

                        beforeEach(function() {
                            styles = {
                                minWidth: '18.75em',
                                padding: '0px 0px 85%',
                                fontSize: '16px',
                                height: '0px',
                                overflow: 'hidden'
                            };

                            embed.style.minWidth = '20px';
                            embed.style.padding = '10px';
                            embed.style.fontSize = '50px';
                            embed.style.height = '200px';
                            embed.style.overflow = 'scroll';
                        });

                        describe('when the player is shown', function() {
                            beforeEach(function() {
                                player.shown = true;

                                player.session.emit('responsiveStyles', styles);
                            });

                            it('should set the styles on the embed <div>', function() {
                                Object.keys(styles).forEach(function(key) {
                                    expect(embed.style[key]).toBe(styles[key]);
                                });
                            });

                            describe('when the player closes', function() {
                                beforeEach(function() {
                                    player.session.emit('close');
                                });

                                it('should set the styles it changed back to their original values', function() {
                                    expect(embed.style.minWidth).toBe('20px');
                                    expect(embed.style.padding).toBe('10px');
                                    expect(embed.style.fontSize).toBe('50px');
                                    expect(embed.style.height).toBe('200px');
                                    expect(embed.style.overflow).toBe('scroll');
                                });
                            });
                        });

                        describe('when the player is hidden', function() {
                            beforeEach(function() {
                                player.shown = false;

                                player.session.emit('responsiveStyles', styles);
                            });

                            it('should not set the styles on the embed <div>', function() {
                                expect(embed.style.minWidth).toBe('20px');
                                expect(embed.style.padding).toBe('10px');
                                expect(embed.style.fontSize).toBe('50px');
                                expect(embed.style.height).toBe('200px');
                                expect(embed.style.overflow).toBe('scroll');
                            });

                            describe('when the player opens', function() {
                                beforeEach(function() {
                                    player.session.emit('open');
                                });

                                it('should apply the styles', function() {
                                    Object.keys(styles).forEach(function(key) {
                                        expect(embed.style[key]).toBe(styles[key]);
                                    });
                                });
                            });

                            describe('when the player closes', function() {
                                beforeEach(function() {
                                    player.session.emit('open');
                                    player.session.emit('close');
                                });

                                it('should set the styles it changed back to their original values', function() {
                                    expect(embed.style.minWidth).toBe('20px');
                                    expect(embed.style.padding).toBe('10px');
                                    expect(embed.style.fontSize).toBe('50px');
                                    expect(embed.style.height).toBe('200px');
                                    expect(embed.style.overflow).toBe('scroll');
                                });

                                describe('but then reopens', function() {
                                    beforeEach(function() {
                                        player.session.emit('open');
                                    });

                                    it('should apply the styles again', function() {
                                        Object.keys(styles).forEach(function(key) {
                                            expect(embed.style[key]).toBe(styles[key]);
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });

            describe('and the user hovers over the splash image', function() {
                beforeEach(function() {
                    var mouseenter = document.createEvent('MouseEvent');
                    mouseenter.initMouseEvent('mouseenter');

                    splash.dispatchEvent(mouseenter);
                });

                it('should not bootstrap the player', function() {
                    expect(player.bootstrap).not.toHaveBeenCalled();
                });

                describe('in the next turn of the event loop', function() {
                    beforeEach(function(done) {
                        setTimeout(done, 0);
                    });

                    it('should bootstrap the player', function() {
                        expect(player.bootstrap).toHaveBeenCalledWith(embed, jasmine.any(Object));
                    });

                    it('should not show() the player', function() {
                        expect(player.show).not.toHaveBeenCalled();
                    });
                });
            });

            describe('when the player is bootstrapped', function() {
                beforeEach(function() {
                    player.bootstrap(document.createElement('div'));
                });

                describe('and opened', function() {
                    beforeEach(function() {
                        player.session.emit('open');
                    });

                    it('should call didShow() on the splash delegate', function() {
                        expect(splashDelegate.didShow).toHaveBeenCalled();
                    });

                    it('should set the player\'s z-index to 100', function() {
                        expect(player.frame.style.zIndex).toBe('100');
                    });

                    describe('and there is no didShow() method on the splash delegate', function() {
                        beforeEach(function() {
                            delete splashDelegate.didShow;
                            player.emit('bootstrap');
                        });

                        it('should do nothing', function() {
                            expect(function() { player.session.emit('open'); }).not.toThrow();
                        });
                    });
                });

                describe('and closed', function() {
                    beforeEach(function() {
                        player.session.emit('close');
                    });

                    it('should call didHide() on the splash delegate', function() {
                        expect(splashDelegate.didHide).toHaveBeenCalled();
                    });

                    it('should set the player\'s z-index to -100', function() {
                        expect(player.frame.style.zIndex).toBe('-100');
                    });

                    describe('and there is no didHide() method on the splash delegate', function() {
                        beforeEach(function() {
                            delete splashDelegate.didHide;
                            player.emit('bootstrap');
                        });

                        it('should do nothing', function() {
                            expect(function() { player.session.emit('close'); }).not.toThrow();
                        });
                    });
                });

                describe('and sends responsiveStyles', function() {
                    var styles;

                    beforeEach(function() {
                        styles = {
                            minWidth: '18.75em',
                            padding: '0px 0px 85%',
                            fontSize: '16px',
                            height: '0px',
                            overflow: 'hidden'
                        };

                        embed.style.minWidth = '20px';
                        embed.style.padding = '10px';
                        embed.style.fontSize = '50px';
                        embed.style.height = '200px';
                        embed.style.overflow = 'scroll';
                    });

                    describe('when the player is shown', function() {
                        beforeEach(function() {
                            player.shown = true;

                            player.session.emit('responsiveStyles', styles);
                        });

                        it('should set the styles on the embed <div>', function() {
                            Object.keys(styles).forEach(function(key) {
                                expect(embed.style[key]).toBe(styles[key]);
                            });
                        });

                        describe('when the player closes', function() {
                            beforeEach(function() {
                                player.session.emit('close');
                            });

                            it('should set the styles it changed back to their original values', function() {
                                expect(embed.style.minWidth).toBe('20px');
                                expect(embed.style.padding).toBe('10px');
                                expect(embed.style.fontSize).toBe('50px');
                                expect(embed.style.height).toBe('200px');
                                expect(embed.style.overflow).toBe('scroll');
                            });
                        });
                    });

                    describe('when the player is hidden', function() {
                        beforeEach(function() {
                            player.shown = false;

                            player.session.emit('responsiveStyles', styles);
                        });

                        it('should not set the styles on the embed <div>', function() {
                            expect(embed.style.minWidth).toBe('20px');
                            expect(embed.style.padding).toBe('10px');
                            expect(embed.style.fontSize).toBe('50px');
                            expect(embed.style.height).toBe('200px');
                            expect(embed.style.overflow).toBe('scroll');
                        });

                        describe('when the player opens', function() {
                            beforeEach(function() {
                                player.session.emit('open');
                            });

                            it('should apply the styles', function() {
                                Object.keys(styles).forEach(function(key) {
                                    expect(embed.style[key]).toBe(styles[key]);
                                });
                            });
                        });

                        describe('when the player closes', function() {
                            beforeEach(function() {
                                player.session.emit('open');
                                player.session.emit('close');
                            });

                            it('should set the styles it changed back to their original values', function() {
                                expect(embed.style.minWidth).toBe('20px');
                                expect(embed.style.padding).toBe('10px');
                                expect(embed.style.fontSize).toBe('50px');
                                expect(embed.style.height).toBe('200px');
                                expect(embed.style.overflow).toBe('scroll');
                            });

                            describe('but then reopens', function() {
                                beforeEach(function() {
                                    player.session.emit('open');
                                });

                                it('should apply the styles again', function() {
                                    Object.keys(styles).forEach(function(key) {
                                        expect(embed.style[key]).toBe(styles[key]);
                                    });
                                });
                            });
                        });
                    });
                });
            });

            describe('loadExperience(settings, preload)', function() {
                var loadExperience;
                var settings, preload;

                beforeEach(function() {
                    loadExperience = splashJs.calls.mostRecent().args[0].loadExperience;

                    settings = null;
                    preload = false;

                    loadExperience(settings, preload);
                });

                it('should bootstrap the player', function() {
                    expect(player.bootstrap).toHaveBeenCalledWith(embed, {
                        position: 'absolute',
                        top: '0px',
                        left: '0px',
                        width: '100%',
                        height: '100%',
                        zIndex: '-100'
                    });
                });

                it('should show the player', function() {
                    expect(player.show).toHaveBeenCalled();
                });

                describe('if called again', function() {
                    beforeEach(function() {
                        player.bootstrap.calls.reset();
                        player.show.calls.reset();

                        loadExperience(settings, preload);
                    });

                    it('should not bootstrap the player', function() {
                        expect(player.bootstrap).not.toHaveBeenCalled();
                    });

                    it('should still show() the player', function() {
                        expect(player.show).toHaveBeenCalled();
                    });
                });

                describe('if preload is true', function() {
                    beforeEach(function() {
                        player.bootstrapped = false;
                        player.bootstrap.calls.reset();
                        player.show.calls.reset();

                        preload = true;

                        loadExperience(settings, preload);
                    });

                    it('should bootstrap() the player', function() {
                        expect(player.bootstrap).toHaveBeenCalled();
                    });

                    it('should not show the player', function() {
                        expect(player.show).not.toHaveBeenCalled();
                    });
                });

                describe('if the type is', function() {
                    beforeEach(function() {
                        lightboxes.parentNode.removeChild(lightboxes);
                    });

                    ['swipe', 'mobile', 'lightbox', 'lightbox-playlist'].forEach(function(type) {
                        describe('"' + type + '"', function() {
                            beforeEach(function(done) {
                                params.type = type;

                                document.createElement.calls.reset();

                                c6embed(beforeElement, params).then(success, failure).finally(function() {
                                    player = Player.calls.mostRecent().returnValue;
                                    embed = document.createElement.calls.all()[0].returnValue;
                                    lightboxes = document.createElement.calls.all()[1].returnValue;
                                    splash = document.createElement.calls.all()[2].returnValue;
                                    loadExperience = splashJs.calls.mostRecent().args[0].loadExperience;

                                    loadExperience(settings, preload);
                                }).then(done, done.fail);

                                setTimeout(function() {
                                    importScripts.calls.mostRecent().args[1](splashJs, splashHTML);
                                }, 1);
                            });

                            it('should bootstrap the player into the lightboxes <div>', function() {
                                expect(player.bootstrap).toHaveBeenCalledWith(lightboxes, jasmine.any(Object));
                            });

                            describe('when the player opens', function() {
                                beforeEach(function() {
                                    player.session.emit('open');
                                });

                                it('should fullscreen the player', function() {
                                    expect(player.frame.style.position).toBe('fixed');
                                    expect(player.frame.style.zIndex).toBe('9007199254740992');
                                });

                                describe('and then closes', function() {
                                    beforeEach(function() {
                                        player.session.emit('close');
                                    });

                                    it('should un-fullscreen the player', function() {
                                        expect(player.frame.style.position).toBe('absolute');
                                        expect(player.frame.style.zIndex).toBe('-100');
                                    });
                                });
                            });
                        });
                    });

                    ['light', 'full', 'full-np', 'desktop-card', 'solo', 'solo-ads'].forEach(function(type) {
                        describe('"' + type + '"', function() {
                            beforeEach(function(done) {
                                params.type = type;

                                document.createElement.calls.reset();

                                c6embed(beforeElement, params).then(success, failure).finally(function() {
                                    player = Player.calls.mostRecent().returnValue;
                                    embed = document.createElement.calls.all()[0].returnValue;
                                    splash = document.createElement.calls.all()[1].returnValue;
                                    loadExperience = splashJs.calls.mostRecent().args[0].loadExperience;

                                    loadExperience(settings, preload);
                                }).then(done, done.fail);

                                setTimeout(function() {
                                    importScripts.calls.mostRecent().args[1](splashJs, splashHTML);
                                }, 1);
                            });

                            it('should bootstrap the player into the embed <div>', function() {
                                expect(player.bootstrap).toHaveBeenCalledWith(embed, jasmine.any(Object));
                            });

                            describe('when the player opens', function() {
                                beforeEach(function() {
                                    player.session.emit('open');
                                });

                                it('should not fullscreen the player', function() {
                                    expect(player.frame.style.position).toBe('absolute');
                                    expect(player.frame.style.zIndex).toBe('100');
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});
