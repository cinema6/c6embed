var proxyquire = require('proxyquireify')(require);

describe('Player', function() {
    'use strict';

    var q;
    var extend;
    var parseUrl;
    var PlayerSession;
    var EventEmitter;

    var importScripts, importScriptsDeferred;
    var stubs;

    var Player;

    beforeEach(function() {
        q = require('q');
        extend = require('../../lib/fns').extend;
        parseUrl = require('url').parse;
        PlayerSession = require('../../lib/PlayerSession');
        EventEmitter = require('events').EventEmitter;

        importScripts = jasmine.createSpy('importScripts()').and.returnValue((importScriptsDeferred = q.defer()).promise);

        stubs = {
            'events': require('events'),
            './PlayerSession': PlayerSession,
            './importScripts': importScripts,

            '@noCallThru': true
        };

        Player = proxyquire('../../lib/Player', stubs);
    });

    it('should exist', function() {
        expect(Player).toEqual(jasmine.any(Function));
        expect(Player.name).toBe('Player');
    });

    describe('static:', function() {
        describe('methods:', function() {
            describe('getParams(params)', function() {
                var params;
                var success, failure;
                var result;

                beforeEach(function() {
                    params = {
                        apiRoot: 'https://dev.reelcontent.com/',
                        placement: 'pl-fd17c524732abf',
                        playUrls: ['{{SOME_MACRO}}'],
                        debug: 2,
                        forceOrientation: 'landscape'
                    };

                    success = jasmine.createSpy('success()');
                    failure = jasmine.createSpy('failure()');

                    result = Player.getParams(params);
                    result.then(success, failure);
                });

                it('should make a request for the placement', function() {
                    expect(importScripts).toHaveBeenCalledWith([
                        'https://dev.reelcontent.com/api/public/placements/pl-fd17c524732abf.js'
                    ]);
                });

                describe('when the placement is fetched', function() {
                    var placement;

                    beforeEach(function(done) {
                        placement = {
                            id: params.placement,
                            tagParams: {
                                campaign: 'cam-fbe79c20d3f9b6',
                                card: 'rc-b2b46e95e12542',
                                container: 'beeswax',
                                debug: false
                            }
                        };

                        importScriptsDeferred.fulfill([placement]);

                        result.finally(done);
                    });

                    it('should fulfill with the placement tagParams, extended with the provided params', function() {
                        expect(success).toHaveBeenCalledWith(extend(placement.tagParams, params));
                    });
                });

                describe('if defaults are specified', function() {
                    var defaults;
                    var placement;

                    beforeEach(function(done) {
                        defaults = {
                            type: 'full-np',
                            pageUrl: 'reelcontent.com',
                            forceOrientation: 'portrait'
                        };

                        importScripts.calls.reset();
                        success.calls.reset();
                        failure.calls.reset();

                        importScripts.and.returnValue(q([(placement = {
                            id: params.placement,
                            tagParams: {
                                campaign: 'cam-fbe79c20d3f9b6',
                                card: 'rc-b2b46e95e12542',
                                container: 'pocketmath',
                                debug: false,
                                type: 'desktop-card'
                            }
                        })]));

                        Player.getParams(params, defaults).then(success, failure).finally(done);
                    });

                    it('should use the default values', function() {
                        expect(success).toHaveBeenCalledWith(extend(defaults, placement.tagParams, params));
                    });
                });

                describe('if there is no apiRoot', function() {
                    var placement;

                    beforeEach(function(done) {
                        delete params.apiRoot;

                        importScripts.calls.reset();
                        success.calls.reset();
                        failure.calls.reset();

                        importScripts.and.returnValue(q([(placement = {
                            id: params.placement,
                            tagParams: {
                                campaign: 'cam-fbe79c20d3f9b6',
                                card: 'rc-b2b46e95e12542',
                                container: 'pocketmath',
                                debug: false
                            }
                        })]));

                        Player.getParams(params).then(success, failure).finally(done);
                    });

                    it('should use "https://platform.reelcontent.com/" as the apiRoot', function() {
                        expect(importScripts).toHaveBeenCalledWith([
                            'https://platform.reelcontent.com/api/public/placements/pl-fd17c524732abf.js'
                        ]);
                    });

                    it('should set the apiRoot', function() {
                        expect(success).toHaveBeenCalledWith(extend({ apiRoot: 'https://platform.reelcontent.com/' }, placement.tagParams, params));
                    });
                });

                describe('if there is no placement', function() {
                    beforeEach(function(done) {
                        delete params.placement;

                        importScripts.calls.reset();
                        success.calls.reset();
                        failure.calls.reset();

                        Player.getParams(params).then(success, failure).finally(done);
                    });

                    it('should not fetch the placement', function() {
                        expect(importScripts).not.toHaveBeenCalled();
                    });

                    it('should fulfill with a copy of the params', function() {
                        expect(success).toHaveBeenCalledWith(params);
                        expect(success.calls.mostRecent().args[0]).not.toBe(params);
                    });

                    describe('and no apiRoot', function() {
                        beforeEach(function(done) {
                            delete params.apiRoot;

                            success.calls.reset();
                            failure.calls.reset();

                            Player.getParams(params).then(success, failure).finally(done);
                        });

                        it('should set it to "https://platform.reelcontent.com/"', function() {
                            expect(success).toHaveBeenCalledWith(extend({ apiRoot: 'https://platform.reelcontent.com/' }, params));
                        });
                    });
                });
            });
        });
    });

    describe('instance:', function() {
        var endpoint, params, data;
        var player;

        beforeEach(function() {
            endpoint = 'https://dev.reelcontent.com/api/public/players/desktop-card';
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
                clickUrls: ['click1.jpg', 'click2.jpg'],
                launchUrls: ['launch1.jpg', 'launch2.jpg'],
                width: 800,
                height: 600,
                splash: {},
                ex: 'my-experiment',
                vr: 'some-variant',
                prebuffer: true,
                embed: 'foo',
                countdown: 15,
                placement: 'pl-6a020c18a28c5d',
                uuid: 'wuyrf4378f',
                autoplay: false
            };
            data = { foo: 'bar' };

            player = new Player(endpoint, params, data);
        });

        it('should be an EventEmitter', function() {
            expect(player).toEqual(jasmine.any(EventEmitter));
        });

        describe('if params are omitted', function() {
            beforeEach(function() {
                params = {
                    card: 'rc-677091d298a151',
                    container: 'reactx'
                };

                player = new Player(endpoint, params, data);
            });

            it('should only include the specified params in the url', function() {
                expect(parseUrl(player.url, true).query).toEqual({
                    card: 'rc-677091d298a151',
                    container: 'reactx',
                    embed: 'true'
                });
            });
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
                        host: 'dev.reelcontent.com',
                        pathname: '/api/public/players/desktop-card',
                        query: {
                            experience: 'e-4158d66ede3306',
                            card: 'rc-677091d298a151',
                            campaign: 'cam-ba0444a0749644',
                            container: 'reactx',
                            context: 'vpaid',
                            categories: 'food,tech',
                            branding: 'rcplatform',
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
                            clickUrls: 'click1.jpg,click2.jpg',
                            launchUrls: 'launch1.jpg,launch2.jpg',
                            ex: 'my-experiment',
                            vr: 'some-variant',
                            prebuffer: 'true',
                            embed: 'true',
                            countdown: '15',
                            placement: 'pl-6a020c18a28c5d',
                            uuid: 'wuyrf4378f',
                            autoplay: 'false'
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
