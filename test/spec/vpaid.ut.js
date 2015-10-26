var proxyquire = require('proxyquireify')(require);

describe('getVPAIDAd()', function() {
    'use strict';

    var PlayerSession;
    var EventEmitter;
    var querystring;
    var parseURL;
    var extend;
    var q;
    var getVPAIDAd;

    var stubs;
    var sessionInitDeferred;

    beforeEach(function() {
        PlayerSession = require('../../lib/PlayerSession');
        EventEmitter = require('events').EventEmitter;
        querystring = require('querystring');
        parseURL = require('url').parse;
        extend = require('../../lib/fns').extend;
        q = require('q');

        stubs = {
            '../../lib/PlayerSession': jasmine.createSpy('PlayerSession()').and.callFake(function(win) {
                var session = new PlayerSession(win);
                spyOn(session, 'init').and.returnValue((sessionInitDeferred = q.defer()).promise);

                return session;
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

                var iframe, session;

                beforeEach(function() {
                    config = {
                        uri: 'https://staging.cinema6.com/api/public/players/solo',
                        params: {
                            experience: 'e-d0817b1227cc37',
                            campaign: 'cam-c8cd8927915d1b',
                            preview: true,
                            autoLaunch: true,
                            context: 'standalone',
                            container: 'q1'
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

                    spyOn(document, 'createElement').and.callThrough();

                    result = vpaid.initAd(width, height, viewMode, desiredBitrate, creativeData, environmentVars);
                    iframe = document.createElement.calls.mostRecent().returnValue;
                    session = stubs['../../lib/PlayerSession'].calls.mostRecent().returnValue;
                });

                afterEach(function() {
                    document.body.removeChild(slot);
                });

                it('should return undefined', function() {
                    expect(result).toBeUndefined();
                });

                it('should create an iframe', function() {
                    expect(document.createElement).toHaveBeenCalledWith('iframe');
                    expect(iframe.src).toBe(config.uri + '?' + querystring.stringify(extend({ container: config.params.container }, config.params, {
                        vpaid: true,
                        autoLaunch: false,
                        context: 'vpaid'
                    })));
                    expect(iframe.width).toBe(width + 'px');
                    expect(iframe.height).toBe(height + 'px');
                    expect(iframe.style.border).toBe('none');
                    expect(iframe.style.opacity).toBe('0');
                    expect(iframe.style.position).toBe('absolute');
                    expect(iframe.style.top).toBe('0px');
                    expect(iframe.style.left).toBe('0px');
                });

                it('should put the iframe in the slot', function() {
                    expect(slot.contains(iframe)).toBe(true);
                });

                it('should create a new PlayerSession for the iframe', function() {
                    expect(stubs['../../lib/PlayerSession']).toHaveBeenCalledWith(iframe.contentWindow);
                });

                it('should initialize the session', function() {
                    expect(session.init).toHaveBeenCalledWith({});
                });

                describe('when the session is ready', function() {
                    beforeEach(function(done) {
                        spyOn(emitter, 'emit').and.callThrough();
                        sessionInitDeferred.fulfill(session);

                        sessionInitDeferred.promise.then(done);
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

                describe('if a container is not specified', function() {
                    beforeEach(function() {
                        delete config.params.container;
                        creativeData = { AdParameters: JSON.stringify(config) };

                        vpaid.initAd(width, height, viewMode, desiredBitrate, creativeData, environmentVars);
                        iframe = document.createElement.calls.mostRecent().returnValue;
                    });

                    it('should give the iframe a container', function() {
                        var params = parseURL(iframe.src, true).query;

                        expect(params.container).toBe('vpaid');
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
                var iframe, session;

                beforeEach(function() {
                    config = {
                        uri: 'https://staging.cinema6.com/api/public/players/solo',
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

                    spyOn(document, 'createElement').and.callThrough();

                    vpaid.initAd(width, height, viewMode, desiredBitrate, creativeData, environmentVars);

                    iframe = document.createElement.calls.mostRecent().returnValue;
                    session = stubs['../../lib/PlayerSession'].calls.mostRecent().returnValue;

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

                    beforeEach(function() {
                        spyOn(session, 'ping').and.callThrough();

                        result = vpaid.startAd();
                    });

                    it('should return undefined', function() {
                        expect(result).toBeUndefined();
                    });

                    it('should ping the player with "show"', function() {
                        expect(session.ping).toHaveBeenCalledWith('show');
                    });

                    it('should not show the iframe', function() {
                        expect(iframe.style.opacity).toBe('0');
                    });

                    describe('when the session emits "open"', function() {
                        beforeEach(function() {
                            emitter.emit.calls.reset();

                            session.emit('open');
                        });

                        it('should emit "AdStarted"', function() {
                            expect(emitter.emit).toHaveBeenCalledWith('AdStarted');
                        });

                        it('should emit "AdImpression"', function() {
                            expect(emitter.emit).toHaveBeenCalledWith('AdImpression');
                        });

                        it('should show the iframe', function() {
                            expect(iframe.style.opacity).toBe('1');
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
