describe('Player', function() {
    'use strict';

    var q;
    var extend;
    var parseUrl;
    var PlayerSession;
    var EventEmitter;

    var Player;

    beforeEach(function() {
        q = require('q');
        extend = require('../../lib/fns').extend;
        parseUrl = require('url').parse;
        PlayerSession = require('../../lib/PlayerSession');
        EventEmitter = require('events').EventEmitter;

        Player = require('../../lib/Player');
    });

    it('should exist', function() {
        expect(Player).toEqual(jasmine.any(Function));
        expect(Player.name).toBe('Player');
    });

    describe('instance:', function() {
        var endpoint, params, data;
        var player;

        beforeEach(function() {
            endpoint = 'https://dev.cinema6.com/api/public/players/desktop-card';
            params = {
                experience: 'e-4158d66ede3306',
                card: 'rc-677091d298a151',
                campaign: 'cam-ba0444a0749644',
                container: 'reactx',
                context: 'vpaid',
                categories: ['food', 'tech'],
                branding: 'rcplatform',
                placementId: '387489',
                wildCardPlacement: '849758493',
                pageUrl: 'reelcontent.com',
                mobileType: 'swipe',
                hostApp: 'My Talking Tom',
                network: 'omax',
                preview: true,
                autoLaunch: false,
                interstitial: true,
                standalone: false,
                vpaid: true,
                playUrls: ['play1.jpg', 'play2.jpg'],
                countUrls: ['count1.jpg', 'count2.jpg'],
                launchUrls: ['launch1.jpg', 'launch2.jpg'],
                width: 800,
                height: 600,
                splash: {},
                ex: 'my-experiment',
                vr: 'some-variant',
                prebuffer: true
            };
            data = { foo: 'bar' };

            player = new Player(endpoint, params, data);
        });

        it('should be an EventEmitter', function() {
            expect(player).toEqual(jasmine.any(EventEmitter));
        });

        describe('properties:', function() {
            describe('frame', function() {
                it('should be null', function() {
                    expect(player.frame).toBeNull();
                });
            });

            describe('session', function() {
                it('should be null', function() {
                    expect(player.session).toBeNull();
                });
            });

            describe('url', function() {
                it('should be made from the endpoint and params', function() {
                    var url = parseUrl(player.url, true);

                    expect(url).toEqual(jasmine.objectContaining({
                        protocol: 'https:',
                        host: 'dev.cinema6.com',
                        pathname: '/api/public/players/desktop-card',
                        query: {
                            experience: 'e-4158d66ede3306',
                            card: 'rc-677091d298a151',
                            campaign: 'cam-ba0444a0749644',
                            container: 'reactx',
                            context: 'vpaid',
                            categories: 'food,tech',
                            branding: 'rcplatform',
                            placementId: '387489',
                            wildCardPlacement: '849758493',
                            pageUrl: 'reelcontent.com',
                            mobileType: 'swipe',
                            hostApp: 'My Talking Tom',
                            network: 'omax',
                            preview: 'true',
                            autoLaunch: 'false',
                            interstitial: 'true',
                            standalone: 'false',
                            vpaid: 'true',
                            playUrls: 'play1.jpg,play2.jpg',
                            countUrls: 'count1.jpg,count2.jpg',
                            launchUrls: 'launch1.jpg,launch2.jpg',
                            ex: 'my-experiment',
                            vr: 'some-variant',
                            prebuffer: 'true'
                        }
                    }));
                });
            });

            describe('data', function() {
                it('should be a copy of the supplied data', function() {
                    expect(player.data).toEqual(data);
                    expect(player.data).not.toBe(data);
                });
            });

            describe('shown', function() {
                it('should be false', function() {
                    expect(player.shown).toBe(false);
                });
            });

            describe('bootstrapped', function() {
                it('should be false', function() {
                    expect(player.bootstrapped).toBe(false);
                });
            });
        });

        describe('methods:', function() {
            describe('bootstrap(container, styles)', function() {
                var container, styles;
                var success, failure;
                var bootstrap;

                var playerSessionInitDeferred;

                beforeEach(function(done) {
                    container = document.createElement('div');
                    document.body.appendChild(container);

                    styles = {
                        width: '100%',
                        height: '100%',
                        position: 'fixed',
                        top: '0px',
                        left: '0px'
                    };

                    success = jasmine.createSpy('success()');
                    failure = jasmine.createSpy('failure()');

                    spyOn(document, 'createElement').and.callThrough();

                    playerSessionInitDeferred = q.defer();
                    spyOn(PlayerSession.prototype, 'init').and.returnValue(playerSessionInitDeferred.promise);

                    bootstrap = jasmine.createSpy('bootstrap()').and.callFake(function() {
                        expect(player.frame).not.toBeNull();
                        expect(player.session).not.toBeNull();
                    });
                    player.on('bootstrap', bootstrap);

                    player.bootstrap(container, styles).then(success, failure);
                    setTimeout(done, 1);
                });

                afterEach(function() {
                    document.body.removeChild(container);
                });

                it('should set bootstrapped to true', function() {
                    expect(player.bootstrapped).toBe(true);
                });

                it('should emit "bootstrap"', function() {
                    expect(bootstrap).toHaveBeenCalled();
                });

                it('should create an iframe', function() {
                    expect(document.createElement).toHaveBeenCalledWith('iframe');
                    expect(player.frame).toBe(document.createElement.calls.mostRecent().returnValue);
                    expect(player.frame.tagName).toBe('IFRAME');
                });

                it('should give the iframe some styles', function() {
                    Object.keys(styles).forEach(function(key) {
                        expect(player.frame.style[key]).toBe(styles[key]);
                    });
                    expect(player.frame.style.border).toBe('none');
                    expect(player.frame.style.opacity).toBe('0');
                });

                it('should set the iframe src', function() {
                    expect(player.frame.src).toBe(player.url);
                });

                it('should append the iframe to the container', function() {
                    expect(container.contains(player.frame)).toBe(true);
                });

                it('should create a session for the player', function() {
                    expect(player.session).toEqual(jasmine.any(PlayerSession));
                    expect(player.session.window).toBe(player.frame.contentWindow);
                });

                it('should initialize the session', function() {
                    expect(player.session.init).toHaveBeenCalledWith(player.data);
                });

                describe('when the session is initialized', function() {
                    beforeEach(function(done) {
                        expect(success).not.toHaveBeenCalled();
                        expect(failure).not.toHaveBeenCalled();

                        playerSessionInitDeferred.fulfill(player.session);
                        setTimeout(done, 1);
                    });

                    it('should fulfill the promsie', function() {
                        expect(success).toHaveBeenCalledWith(player);
                    });
                });

                describe('if called again', function() {
                    var frame, session;

                    beforeEach(function(done) {
                        success.calls.reset();
                        failure.calls.reset();
                        bootstrap.calls.reset();

                        frame = player.frame;
                        session = player.session;

                        player.bootstrap().then(success, failure).finally(done);
                    });

                    it('should return a rejected promise', function() {
                        expect(failure).toHaveBeenCalledWith(new Error('Player cannot be bootstrapped again.'));
                    });

                    it('should not create a new iframe or frame', function() {
                        expect(player.frame).toBe(frame);
                        expect(player.session).toBe(session);
                    });

                    it('should not emit "bootstrap"', function() {
                        expect(bootstrap).not.toHaveBeenCalled();
                    });
                });

                describe('when the player is opened', function() {
                    beforeEach(function() {
                        player.shown = false;
                        player.frame.style.opacity = '0';

                        player.session.emit('open');
                    });

                    it('should set shown to true', function() {
                        expect(player.shown).toBe(true);
                    });

                    it('should set the frame opacity to 1', function() {
                        expect(player.frame.style.opacity).toBe('1');
                    });
                });

                describe('when the player is closed', function() {
                    beforeEach(function() {
                        player.shown = true;
                        player.frame.style.opacity = '1';

                        player.session.emit('close');
                    });

                    it('should set shown to false', function() {
                        expect(player.shown).toBe(false);
                    });

                    it('should set the frame opacity to 0', function() {
                        expect(player.frame.style.opacity).toBe('0');
                    });
                });
            });

            describe('show()', function() {
                var success, failure;

                beforeEach(function(done) {
                    success = jasmine.createSpy('success()');
                    failure = jasmine.createSpy('failure()');

                    player.bootstrap(document.createElement('div'));
                    spyOn(player.session, 'ping');

                    player.shown = false;

                    player.show().then(success, failure);
                    setTimeout(done, 1);
                });

                it('should ping the session with "show"', function() {
                    expect(player.session.ping).toHaveBeenCalledWith('show');
                });

                describe('when the session emits "open"', function() {
                    beforeEach(function(done) {
                        expect(success).not.toHaveBeenCalled();
                        expect(failure).not.toHaveBeenCalled();

                        player.session.emit('open');
                        setTimeout(done, 1);
                    });

                    it('should fulfill the promise', function() {
                        expect(success).toHaveBeenCalledWith(player);
                    });
                });

                describe('if the player is already shown', function() {
                    beforeEach(function(done) {
                        success.calls.reset();
                        failure.calls.reset();
                        player.session.ping.calls.reset();

                        player.shown = true;

                        player.show().then(success, failure).finally(done);
                    });

                    it('should not ping the session', function() {
                        expect(player.session.ping).not.toHaveBeenCalled();
                    });

                    it('should fulfill the promise', function() {
                        expect(success).toHaveBeenCalledWith(player);
                    });
                });
            });

            describe('hide()', function() {
                var success, failure;

                beforeEach(function(done) {
                    success = jasmine.createSpy('success()');
                    failure = jasmine.createSpy('failure()');

                    player.bootstrap(document.createElement('div'));
                    spyOn(player.session, 'ping');

                    player.shown = true;

                    player.hide().then(success, failure);
                    setTimeout(done, 1);
                });

                it('should ping the session with "hide"', function() {
                    expect(player.session.ping).toHaveBeenCalledWith('hide');
                });

                describe('when the session emits "close"', function() {
                    beforeEach(function(done) {
                        expect(success).not.toHaveBeenCalled();
                        expect(failure).not.toHaveBeenCalled();

                        player.session.emit('close');
                        setTimeout(done, 1);
                    });

                    it('should fulfill the promise', function() {
                        expect(success).toHaveBeenCalledWith(player);
                    });
                });

                describe('if the player is already hidden', function() {
                    beforeEach(function(done) {
                        success.calls.reset();
                        failure.calls.reset();
                        player.session.ping.calls.reset();

                        player.shown = false;

                        player.hide().then(success, failure).finally(done);
                    });

                    it('should not ping the session', function() {
                        expect(player.session.ping).not.toHaveBeenCalled();
                    });

                    it('should fulfill the promise', function() {
                        expect(success).toHaveBeenCalledWith(player);
                    });
                });
            });
        });
    });
});
