var proxyquire = require('proxyquireify')(require);

describe('getVPAIDAd()', function() {
    'use strict';

    var EventEmitter;
    var querystring;
    var extend;
    var q;
    var getVPAIDAd;

    var stubs;
    var playerBootstrapDeferred;

    beforeAll(function() {
        Function.prototype.bind = require('function-bind');
    });

    beforeEach(function() {
        EventEmitter = require('events').EventEmitter;
        querystring = require('querystring');
        extend = require('../../lib/fns').extend;
        q = require('q');

        stubs = {
            '../../lib/Player': jasmine.createSpy('Player()').and.callFake(function(endpoint, params, data) {
                var Player = require('../../lib/Player');
                var player = new Player(endpoint, params, data);

                playerBootstrapDeferred = q.defer();
                spyOn(player, 'bootstrap').and.callFake(function() {
                    Player.prototype.bootstrap.apply(this, arguments);

                    return playerBootstrapDeferred.promise;
                });

                return player;
            }),
            'events': {
                EventEmitter: jasmine.createSpy('EventEmitter()').and.callFake(function() {
                    return new EventEmitter();
                })
            },

            '@noCallThru': true
        };

        getVPAIDAd = proxyquire('../../src/vpaid/vpaid', stubs);
    });

    it('should exist', function() {
        expect(getVPAIDAd).toEqual(jasmine.any(Function));
        expect(getVPAIDAd.name).toBe('getVPAIDAd');
    });

    describe('when called', function() {
        var vpaid;
        var emitter;

        beforeEach(function() {
            vpaid = getVPAIDAd();

            emitter = stubs.events.EventEmitter.calls.mostRecent().returnValue;
        });

        it('should return an object', function() {
            expect(vpaid).toEqual(jasmine.any(Object));
        });

        it('should create an EventEmitter', function() {
            expect(stubs.events.EventEmitter).toHaveBeenCalledWith();
        });

        describe('the returned Object', function() {
            describe('handshakeVersion()', function() {
                it('should return 2.0', function() {
                    expect(vpaid.handshakeVersion()).toBe('2.0');
                });
            });

            describe('initAd(width, height, viewMode, desiredBitrate, creativeData, environmentVars)', function() {
                var config, slot;
                var width, height, viewMode, desiredBitrate, creativeData, environmentVars;
                var result;

                var player, iframe, session;

                beforeEach(function() {
                    config = {
                        uri: 'https://dev.cinema6.com/api/public/players/solo',
                        params: {
                            experience: 'e-d0817b1227cc37',
                            campaign: 'cam-c8cd8927915d1b',
                            preview: true,
                            autoLaunch: true,
                            context: 'standalone',
                            container: 'q1',
                            standalone: true,
                            interstitial: false
                        }
                    };
                    slot = document.createElement('div');

                    document.body.appendChild(slot);

                    width = 800;
                    height = 600;
                    viewMode = 'normal';
                    desiredBitrate = 1024;
                    creativeData = { AdParameters: JSON.stringify(config) };
                    environmentVars = {
                        slot: slot,
                        videoSlot: document.createElement('video'),
                        videoSlotCanAutoPlay: false
                    };

                    result = vpaid.initAd(width, height, viewMode, desiredBitrate, creativeData, environmentVars);

                    player = stubs['../../lib/Player'].calls.mostRecent().returnValue;
                    iframe = player.frame;
                    session = player.session;
                });

                afterEach(function() {
                    document.body.removeChild(slot);
                });

                it('should return undefined', function() {
                    expect(result).toBeUndefined();
                });

                it('should create a Player', function() {
                    expect(stubs['../../lib/Player']).toHaveBeenCalledWith(config.uri, extend(config.params, {
                        vpaid: true,
                        autoLaunch: false,
                        context: 'vpaid'
                    }));
                });

                it('should bootstrap the player', function() {
                    expect(player.bootstrap).toHaveBeenCalledWith(slot, {
                        width: width + 'px',
                        height: height + 'px',
                        position: 'absolute',
                        top: 0,
                        left: 0
                    });
                });

                describe('when the player is bootstrapped', function() {
                    beforeEach(function(done) {
                        spyOn(emitter, 'emit').and.callThrough();
                        playerBootstrapDeferred.fulfill(player);

                        playerBootstrapDeferred.promise.then(done);
                    });

                    it('should emit "AdLoaded"', function() {
                        expect(emitter.emit).toHaveBeenCalledWith('AdLoaded');
                    });
                });

                describe('when the session emits "vpaid:stateUpdated"', function() {
                    var state;

                    beforeEach(function() {
                        state = {
                            prop: 'adSkippableState',
                            value: false,
                            event: 'AdSkippableStateChange'
                        };

                        spyOn(emitter, 'emit').and.callThrough();

                        session.emit('vpaid:stateUpdated', state);
                    });

                    it('should update the specified prop', function() {
                        expect(vpaid.getAdSkippableState()).toBe(state.value);
                    });

                    it('should emit the specified event', function() {
                        expect(emitter.emit).toHaveBeenCalledWith(state.event);
                    });

                    describe('if the value is not changing', function() {
                        beforeEach(function() {
                            state.value = vpaid.getAdSkippableState();
                            emitter.emit.calls.reset();

                            session.emit('vpaid:stateUpdated', state);
                        });

                        it('should not emit the event', function() {
                            expect(emitter.emit).not.toHaveBeenCalled();
                        });
                    });

                    describe('if no event is specified', function() {
                        beforeEach(function() {
                            state = { prop: 'adRemainingTime', value: 30 };
                            emitter.emit.calls.reset();

                            session.emit('vpaid:stateUpdated', state);
                        });

                        it('should update the value', function() {
                            expect(vpaid.getAdRemainingTime()).toBe(state.value);
                        });

                        it('should not emit an event', function() {
                            expect(emitter.emit).not.toHaveBeenCalled();
                        });
                    });

                    describe('if just an event is specified', function() {
                        beforeEach(function() {
                            state = { event: 'AdVideoStart' };
                            emitter.emit.calls.reset();

                            session.emit('vpaid:stateUpdated', state);
                        });

                        it('should emit the event', function() {
                            expect(emitter.emit).toHaveBeenCalledWith(state.event);
                        });
                    });

                    describe('if params are specified', function() {
                        beforeEach(function() {
                            state = {
                                event: 'AdClickThru',
                                params: ['foo', 'bar', 'blegh']
                            };
                            emitter.emit.calls.reset();

                            session.emit('vpaid:stateUpdated', state);
                        });

                        it('should emit the event with the params', function() {
                            var expectation = expect(emitter.emit);

                            expectation.toHaveBeenCalledWith.apply(expectation, [state.event].concat(state.params));
                        });
                    });
                });

                describe('when the session emits "error"', function() {
                    var message;

                    beforeEach(function() {
                        spyOn(emitter, 'emit').and.callThrough();
                        message = 'I suck.';
                        spyOn(vpaid, 'stopAd').and.callThrough();

                        session.emit('error', message);
                    });

                    it('should emit the "AdError" event', function() {
                        expect(emitter.emit).toHaveBeenCalledWith('AdError', message);
                    });

                    it('should call stopAd()', function() {
                        expect(vpaid.stopAd).toHaveBeenCalled();
                    });
                });

                describe('when the session emits "close"', function() {
                    beforeEach(function() {
                        spyOn(vpaid, 'skipAd').and.callThrough();

                        session.emit('close');
                    });

                    it('should call skipAd()', function() {
                        expect(vpaid.skipAd).toHaveBeenCalled();
                    });
                });

                describe('when the session emits "cardComplete"', function() {
                    beforeEach(function() {
                        spyOn(vpaid, 'stopAd').and.callThrough();

                        session.emit('cardComplete');
                    });

                    it('should call vpaid.stopAd()', function() {
                        expect(vpaid.stopAd).toHaveBeenCalled();
                    });
                });

                describe('if container, standalone or interstitial are not specified', function() {
                    beforeEach(function() {
                        stubs['../../lib/Player'].calls.reset();

                        delete config.params.container;
                        delete config.params.standalone;
                        delete config.params.interstitial;
                        creativeData = { AdParameters: JSON.stringify(config) };

                        vpaid.initAd(width, height, viewMode, desiredBitrate, creativeData, environmentVars);
                    });

                    it('should give the player a container, standalone and interstitial', function() {
                        expect(stubs['../../lib/Player']).toHaveBeenCalledWith(jasmine.any(String), jasmine.objectContaining({
                            container: 'vpaid',
                            standalone: false,
                            interstitial: true
                        }));
                    });
                });

                describe('if the config is in query params format', function() {
                    beforeEach(function() {
                        stubs['../../lib/Player'].calls.reset();

                        config = querystring.stringify({
                            apiRoot: 'https://dev.cinema6.com/',
                            type: 'solo',
                            experience: 'e-d0817b1227cc37',
                            campaign: 'cam-c8cd8927915d1b',
                            preview: true,
                            autoLaunch: true,
                            context: 'standalone',
                            container: 'q1',
                            standalone: true,
                            interstitial: false
                        });

                        creativeData.AdParameters = config;

                        vpaid.initAd(width, height, viewMode, desiredBitrate, creativeData, environmentVars);
                    });

                    it('should create a Player', function() {
                        expect(stubs['../../lib/Player']).toHaveBeenCalledWith('https://dev.cinema6.com/api/public/players/solo', {
                            apiRoot: 'https://dev.cinema6.com/',
                            type: 'solo',
                            experience: 'e-d0817b1227cc37',
                            campaign: 'cam-c8cd8927915d1b',
                            preview: 'true',
                            container: 'q1',
                            standalone: 'true',
                            interstitial: 'false',
                            vpaid: true,
                            autoLaunch: false,
                            context: 'vpaid'
                        });
                    });

                    describe('if container, standalone, interstitial, apiRoot or type are not specified', function() {
                        beforeEach(function() {
                            stubs['../../lib/Player'].calls.reset();

                            config = querystring.stringify({
                                experience: 'e-d0817b1227cc37',
                                campaign: 'cam-c8cd8927915d1b',
                                preview: true,
                                autoLaunch: true,
                                context: 'standalone'
                            });
                            creativeData = { AdParameters: config };

                            vpaid.initAd(width, height, viewMode, desiredBitrate, creativeData, environmentVars);
                        });

                        it('should load the desktop-card player from production', function() {
                            expect(stubs['../../lib/Player']).toHaveBeenCalledWith('https://platform.reelcontent.com/api/public/players/desktop-card', jasmine.any(Object));
                        });

                        it('should give the player a container, standalone and interstitial', function() {
                            expect(stubs['../../lib/Player']).toHaveBeenCalledWith(jasmine.any(String), jasmine.objectContaining({
                                container: 'vpaid',
                                standalone: false,
                                interstitial: true
                            }));
                        });
                    });
                });
            });

            describe('subscribe(fn, event, listenerScope)', function() {
                var fn, event, listenerScope;
                var result;

                beforeEach(function() {
                    fn = jasmine.createSpy('fn()');
                    event = 'MyEvent';
                    listenerScope = {};

                    result = vpaid.subscribe(fn, event, listenerScope);
                });

                it('should return undefined', function() {
                    expect(result).toBeUndefined();
                });

                describe('when the emitter emits the event', function() {
                    var data;

                    beforeEach(function() {
                        data = { foo: 'bar' };

                        emitter.emit(event, data);
                    });

                    it('should invoke the specified function', function() {
                        expect(fn).toHaveBeenCalledWith(data);
                        expect(fn.calls.mostRecent().object).toBe(listenerScope);
                    });
                });
            });

            describe('unsubscribe(fn, event)', function() {
                var fn, event;
                var result;
                var otherFn;

                beforeEach(function() {
                    fn = jasmine.createSpy('fn()');
                    event = 'AnEvent';

                    otherFn = jasmine.createSpy('otherFn()');

                    vpaid.subscribe(otherFn, event);
                    vpaid.subscribe(fn, event);

                    result = vpaid.unsubscribe(fn, event);
                });

                it('should return undefined', function() {
                    expect(result).toBeUndefined();
                });

                describe('when the emitter emits the event', function() {
                    var data;

                    beforeEach(function() {
                        data = { foo: 'bar' };

                        emitter.emit(event, data);
                    });

                    it('should not invoke the specified function', function() {
                        expect(fn).not.toHaveBeenCalled();
                        expect(otherFn).toHaveBeenCalled();
                    });
                });
            });

            describe('(that may be called after initAd())', function() {
                var config, slot;
                var width, height, viewMode, desiredBitrate, creativeData, environmentVars;
                var player, iframe, session;

                beforeEach(function() {
                    config = {
                        uri: 'https://dev.cinema6.com/api/public/players/solo',
                        params: {
                            experience: 'e-d0817b1227cc37',
                            campaign: 'cam-c8cd8927915d1b',
                            preview: true,
                            autoLaunch: true
                        }
                    };
                    slot = document.createElement('div');

                    document.body.appendChild(slot);

                    width = 800;
                    height = 600;
                    viewMode = 'normal';
                    desiredBitrate = 1024;
                    creativeData = { AdParameters: JSON.stringify(config) };
                    environmentVars = {
                        slot: slot,
                        videoSlot: document.createElement('video'),
                        videoSlotCanAutoPlay: false
                    };

                    vpaid.initAd(width, height, viewMode, desiredBitrate, creativeData, environmentVars);

                    player = stubs['../../lib/Player'].calls.mostRecent().returnValue;
                    iframe = player.frame;
                    session = player.session;

                    spyOn(emitter, 'emit').and.callThrough();
                });

                afterEach(function() {
                    document.body.removeChild(slot);
                });

                describe('getAdLinear()', function() {
                    it('should return true', function() {
                        expect(vpaid.getAdLinear()).toBe(true);
                    });
                });

                describe('getAdWidth()', function() {
                    it('should return the specified width', function() {
                        expect(vpaid.getAdWidth()).toBe(width);
                    });
                });

                describe('getAdHeight()', function() {
                    it('should return the specified height', function() {
                        expect(vpaid.getAdHeight()).toBe(height);
                    });
                });

                describe('getAdExpanded()', function() {
                    it('should return false', function() {
                        expect(vpaid.getAdExpanded()).toBe(false);
                    });
                });

                describe('getAdSkippableState()', function() {
                    it('should return true', function() {
                        expect(vpaid.getAdSkippableState()).toBe(true);
                    });
                });

                describe('getAdRemainingTime()', function() {
                    it('should return -2', function() {
                        expect(vpaid.getAdRemainingTime()).toBe(-2);
                    });
                });

                describe('getAdDuration()', function() {
                    it('should return -2', function() {
                        expect(vpaid.getAdDuration()).toBe(-2);
                    });
                });

                describe('getAdVolume()', function() {
                    it('should return -1', function() {
                        expect(vpaid.getAdVolume()).toBe(-1);
                    });
                });

                describe('setAdVolume()', function() {
                    it('should return undefined', function() {
                        expect(vpaid.setAdVolume(0.5)).toBeUndefined();
                        expect(vpaid.getAdVolume()).toBe(-1);
                    });
                });

                describe('getAdCompanions()', function() {
                    it('should return an empty string', function() {
                        expect(vpaid.getAdCompanions()).toBe('');
                    });
                });

                describe('getAdIcons()', function() {
                    it('should return false', function() {
                        expect(vpaid.getAdIcons()).toBe(false);
                    });
                });

                describe('resizeAd(width, height, viewMode)', function() {
                    var width, height, viewMode;
                    var result;

                    beforeEach(function() {
                        width = 1080;
                        height = 720;
                        viewMode = 'normal';

                        result = vpaid.resizeAd(width, height, viewMode);
                    });

                    it('should return undefined', function() {
                        expect(result).toBeUndefined();
                    });

                    it('should change the width and height of the iframe', function() {
                        expect(iframe.width).toBe(width + 'px');
                        expect(iframe.height).toBe(height + 'px');
                    });

                    it('should change the values returned by getAdWidth() and getAdHeight()', function() {
                        expect(vpaid.getAdWidth()).toBe(width);
                        expect(vpaid.getAdHeight()).toBe(height);
                    });

                    it('should emit "AdSizeChange"', function() {
                        expect(emitter.emit).toHaveBeenCalledWith('AdSizeChange');
                    });
                });

                describe('startAd()', function() {
                    var result;
                    var showDeferred;

                    beforeEach(function() {
                        showDeferred = q.defer();

                        spyOn(player, 'show').and.returnValue(showDeferred.promise);

                        result = vpaid.startAd();
                    });

                    it('should return undefined', function() {
                        expect(result).toBeUndefined();
                    });

                    it('should show the player', function() {
                        expect(player.show).toHaveBeenCalled();
                    });

                    describe('when the player is shown', function() {
                        beforeEach(function(done) {
                            emitter.emit.calls.reset();

                            showDeferred.fulfill(player);
                            showDeferred.promise.finally(done);
                        });

                        it('should emit "AdStarted"', function() {
                            expect(emitter.emit).toHaveBeenCalledWith('AdStarted');
                        });

                        it('should emit "AdImpression"', function() {
                            expect(emitter.emit).toHaveBeenCalledWith('AdImpression');
                        });
                    });
                });

                describe('stopAd()', function() {
                    var result;

                    beforeEach(function() {
                        result = vpaid.stopAd();
                    });

                    it('should return undefined', function() {
                        expect(result).toBeUndefined();
                    });

                    it('should remove the player from the DOM', function() {
                        expect(slot.contains(iframe)).toBe(false);
                    });

                    it('should emit "AdStopped"', function() {
                        expect(emitter.emit).toHaveBeenCalledWith('AdStopped');
                    });
                });

                describe('pauseAd()', function() {
                    var result;

                    beforeEach(function() {
                        spyOn(session, 'ping').and.callThrough();

                        result = vpaid.pauseAd();
                    });

                    it('should return undefined', function() {
                        expect(result).toBeUndefined();
                    });

                    it('should ping "vpaid:pauseAd"', function() {
                        expect(session.ping).toHaveBeenCalledWith('vpaid:pauseAd');
                    });
                });

                describe('resumeAd()', function() {
                    var result;

                    beforeEach(function() {
                        spyOn(session, 'ping').and.callThrough();

                        result = vpaid.resumeAd();
                    });

                    it('should return undefined', function() {
                        expect(result).toBeUndefined();
                    });

                    it('should ping "vpaid:resumeAd"', function() {
                        expect(session.ping).toHaveBeenCalledWith('vpaid:resumeAd');
                    });
                });

                describe('expandAd()', function() {
                    var result;

                    beforeEach(function() {
                        result = vpaid.expandAd();
                    });

                    it('should return undefined', function() {
                        expect(result).toBeUndefined();
                    });
                });

                describe('collapseAd()', function() {
                    var result;

                    beforeEach(function() {
                        result = vpaid.collapseAd();
                    });

                    it('should return undefined', function() {
                        expect(result).toBeUndefined();
                    });
                });

                describe('skipAd()', function() {
                    var result;

                    beforeEach(function() {
                        spyOn(vpaid, 'stopAd').and.callThrough();

                        result = vpaid.skipAd();
                    });

                    it('should return undefined', function() {
                        expect(result).toBeUndefined();
                    });

                    it('should call stopAd()', function() {
                        expect(vpaid.stopAd).toHaveBeenCalled();
                    });

                    it('should emit "AdSkipped"', function() {
                        expect(emitter.emit).toHaveBeenCalledWith('AdSkipped');
                    });

                    describe('if the adSkippableState is false', function() {
                        beforeEach(function() {
                            session.emit('vpaid:stateUpdated', {
                                prop: 'adSkippableState',
                                value: false,
                                event: 'AdSkippableStateChange'
                            });
                            vpaid.stopAd.calls.reset();
                            emitter.emit.calls.reset();

                            vpaid.skipAd();
                        });

                        it('should do nothing', function() {
                            expect(vpaid.stopAd).not.toHaveBeenCalled();
                            expect(emitter.emit).not.toHaveBeenCalled();
                        });
                    });
                });
            });
        });
    });
});
