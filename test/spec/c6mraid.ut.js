var proxyquire = require('proxyquireify')(require);

describe('[c6mraid(config)]', function() {
    'use strict';

    var c6mraid, q, logger, globalLogger, extend;

    var Player, MRAID, viaPixel;
    var stubs;

    var player, mraid;

    var waitUntilViewableDeferred;

    var params;
    var success, failure;

    beforeAll(function() {
        q = require('q');
        globalLogger = require('rc-logger').default;
        extend = require('../../lib/fns').extend;

        Player = jasmine.createSpy('Player()').and.callFake(function(endpoint, params, data) {
            var Player = require('../../lib/Player');

            player = new Player(endpoint, params, data);
            spyOn(player, 'bootstrap').and.callThrough();

            return player;
        });
        Player.getParams = jasmine.createSpy('Player.getParams()').and.callFake(function() {
            return require('../../lib/Player').getParams.apply(this, arguments).then(function(params) {
                return extend(params, { processed: true });
            });
        });

        MRAID = jasmine.createSpy('MRAID()').and.callFake(function(params) {
            var MRAID = require('../../lib/iab').MRAID;
            waitUntilViewableDeferred = q.defer();

            mraid = new MRAID(params);
            spyOn(mraid, 'waitUntilViewable').and.returnValue(waitUntilViewableDeferred.promise);
            spyOn(mraid, 'close');
            spyOn(mraid, 'on').and.callThrough();

            return mraid;
        });

        viaPixel = jasmine.createSpy('viaPixel()').and.callFake(require('rc-logger/senders/pixel'));

        globalLogger.tasks.send.length = 1;

        spyOn(require('rc-logger').default, 'context').and.callThrough();

        stubs = {
            '../../lib/iab': {
                MRAID: MRAID
            },
            '../../lib/Player': Player,
            'q': q,
            'rc-logger': require('rc-logger'),
            'rc-logger/senders/pixel': viaPixel,

            '@noCallThru': true
        };

        c6mraid = proxyquire('../../src/c6mraid/c6mraid', stubs);

        logger = require('rc-logger').default.context.calls.mostRecent().returnValue;
    });

    beforeEach(function() {
        globalLogger.enabled(false);
        MRAID.calls.reset();
        Player.calls.reset();

        jasmine.clock().install();
        jasmine.clock().mockDate();

        window.mraid = {
            addEventListener: function() {},
            removeEventListener: function() {},
            getState: jasmine.createSpy('mraid.getState()').and.returnValue('loading'),
            isViewable: jasmine.createSpy('mraid.isViewable()').and.returnValue(false),
            getExpandProperties: jasmine.createSpy('mraid.getExpandProperties()').and.returnValue({ useCustomClose: true })
        };
        delete window.__C6_URL_ROOT__;

        success = jasmine.createSpy('success()');
        failure = jasmine.createSpy('failure()');

        spyOn(globalLogger, 'levels').and.callThrough();
        spyOn(globalLogger, 'prefix').and.callThrough();

        params = {
            experience: 'e-f75a93d62976aa',
            container: 'some-src',
            mobileType: 'swipe',
            type: 'full',
            playUrls: ['pixel1', 'pixel2'],
            countUrls: ['pixel3', 'pixel4'],
            launchUrls: ['pixel5', 'pixel6'],
            preview: false,
            ex: 'my-experiment',
            vr: 'my-variant',
            branding: 'some-pub',
            placementId: '87654321',
            campaign: 'cam-9c9692e33a8e98',
            wildCardPlacement: '12345678',
            apiRoot: 'https://dev.reelcontent.com',
            pageUrl: 'staging.reelcontent.com',
            forceOrientation: 'none',
            debug: true,
            hostApp: 'Talking Tom',
            network: 'omax',
            autoLaunch: true
        };

        c6mraid(params).then(success, failure);
    });

    afterEach(function() {
        delete window.mraid;
        delete window.c6;
        jasmine.clock().uninstall();
        globalLogger.tasks.send.length = 1;

        Array.prototype.slice.call(document.querySelectorAll('iframe[src*="/api/public/players"]')).forEach(function(iframe) {
            iframe.parentNode.removeChild(iframe);
        });
    });

    it('should configure the logger to send pixels', function() {
        expect(viaPixel).toHaveBeenCalledWith({
            url: 'https://logging.reelcontent.com/pixel.gif',
            addParams: jasmine.any(Function)
        });
        expect(viaPixel.calls.count()).toBe(1);
        expect(globalLogger.tasks.send[globalLogger.tasks.send.length - 1]).toBe(viaPixel.calls.mostRecent().returnValue);

        expect(viaPixel.calls.mostRecent().args[0].addParams(logger)).toEqual({
            c: logger.meta.container,
            n: logger.meta.network,
            a: logger.meta.app
        });
    });

    it('should get the params', function() {
        expect(Player.getParams).toHaveBeenCalledWith(params, {
            type: 'full-np',
            forceOrientation: 'portrait'
        });
    });

    describe('when the params are fetched', function() {
        var options;

        beforeEach(function(done) {
            Player.getParams.calls.mostRecent().returnValue.then(function(/*options*/) {
                options = arguments[0];
            }).then(done, done.fail);
        });

        it('should decorate the logger with information about the app', function() {
            expect(globalLogger.meta.container).toBe('some-src');
            expect(globalLogger.meta.network).toBe('omax');
            expect(globalLogger.meta.app).toBe('Talking Tom');
        });

        it('should create a new MRAID instance', function() {
            expect(MRAID).toHaveBeenCalledWith({
                forceOrientation: 'none',
                useCustomClose: true
            });
        });

        it('should create a new Player instance', function() {
            expect(Player).toHaveBeenCalledWith('https://dev.reelcontent.com/api/public/players/full', extend(options, {
                standalone: false,
                interstitial: true,
                context: 'mraid',
                autoLaunch: false
            }));
        });

        it('should bootstrap the player', function() {
            expect(player.bootstrap).toHaveBeenCalledWith(document.body, {
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
            });
        });

        [0, false].forEach(function(value) {
            describe('if called with debug: ' + value, function() {
                beforeEach(function(done) {
                    globalLogger.levels.calls.reset();
                    mraid.on.calls.reset();
                    c6mraid({ exp: 'e-d83a40ac1437f5', debug: value });
                    Player.getParams.calls.mostRecent().returnValue.finally(done);
                });

                it('should only enable error logging', function() {
                    expect(globalLogger.levels).toHaveBeenCalledWith(['error']);
                });

                it('should not listen for the pollProperty event', function() {
                    expect(mraid.on).not.toHaveBeenCalledWith('pollProperty', jasmine.any(Function));
                });
            });
        });

        [1, true].forEach(function(value) {
            describe('if called with debug: ' + value, function() {
                beforeEach(function(done) {
                    globalLogger.levels.calls.reset();
                    c6mraid({ exp: 'e-d83a40ac1437f5', debug: value });
                    Player.getParams.calls.mostRecent().returnValue.finally(done);
                });

                it('should enable everything but log-level logging', function() {
                    expect(globalLogger.levels).toHaveBeenCalledWith(['error', 'info', 'warn']);
                });

                it('should not listen for the pollProperty event', function() {
                    expect(mraid.on).not.toHaveBeenCalledWith('pollProperty', jasmine.any(Function));
                });
            });
        });

        [2].forEach(function(value) {
            describe('if called with debug: ' + value, function() {
                beforeEach(function(done) {
                    globalLogger.levels.calls.reset();
                    c6mraid({ exp: 'e-d83a40ac1437f5', debug: value });
                    Player.getParams.calls.mostRecent().returnValue.finally(done);
                });

                it('should enable all log levels', function() {
                    expect(globalLogger.levels).toHaveBeenCalledWith(['error', 'info', 'warn', 'log']);
                });
            });
        });

        describe('when random messages are emitted', function() {
            beforeEach(function() {
                spyOn(logger, 'info').and.callThrough();

                [{ event: 'jfefhfr' }, JSON.stringify({ event: 'fuiy34' }), 'foo=bar', 33, true, false, null, 0].forEach(function(payload) {
                    var event = document.createEvent('CustomEvent');
                    event.initCustomEvent('message', null, null, null);
                    event.data = payload;
                    window.dispatchEvent(event);
                });
            });

            it('should not do anything', function() {
                expect(logger.info).not.toHaveBeenCalled();
            });
        });

        [{ event: 'launch' }, { event: 'adStart' }, { event: 'adCount' }, { event: 'adEnded' }].forEach(function(payload) {
            describe('when the player emits ' + payload.event, function() {
                beforeEach(function() {
                    spyOn(logger, 'info').and.callThrough();

                    var event = document.createEvent('CustomEvent');
                    event.initCustomEvent('message', null, null, null);
                    event.data = JSON.stringify(payload);
                    window.dispatchEvent(event);
                });

                it('should log something', function() {
                    expect(logger.info).toHaveBeenCalledWith('Player event: ' + payload.event, payload);
                });
            });
        });

        describe('if there is an mraid error', function() {
            var message, action;

            beforeEach(function() {
                spyOn(logger, 'error').and.callThrough();

                message = 'There was an awful problem.';
                action = 'Doing something that should work...';

                mraid.emit('error', message, action);
            });

            it('should log an error', function() {
                expect(logger.error).toHaveBeenCalledWith('MRAID Error:', message, action);
            });
        });

        describe('when the ad is visible', function() {
            beforeEach(function(done) {
                waitUntilViewableDeferred.resolve(true);
                spyOn(player, 'show');
                spyOn(player, 'hide');

                q().then(function() {}).then(done);
            });

            it('should activate the player', function() {
                expect(player.show).toHaveBeenCalled();
            });

            describe('if the player closes', function() {
                beforeEach(function() {
                    expect(mraid.close).not.toHaveBeenCalled();

                    player.session.emit('close');
                });

                it('should close the ad', function() {
                    expect(mraid.close).toHaveBeenCalled();
                });
            });

            ['loading', 'expanded', 'resized', 'default'].forEach(function(state) {
                describe('if the ad state changes to ' + state, function() {
                    beforeEach(function() {
                        mraid.emit('stateChange', state);
                    });

                    it('should do nothing', function() {
                        expect(player.hide).not.toHaveBeenCalled();
                    });
                });
            });

            ['hidden'].forEach(function(state) {
                describe('if the ad state changes to ' + state, function() {
                    beforeEach(function() {
                        mraid.emit('stateChange', state);
                    });

                    it('should close the player', function() {
                        expect(player.hide).toHaveBeenCalled();
                    });
                });
            });
        });
    });
});
