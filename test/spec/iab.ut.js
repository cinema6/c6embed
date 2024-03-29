var iab = require('../../lib/iab');
var q = require('q');
var logger = require('rc-logger').default;

describe('MRAID()', function() {
    'use strict';

    var events;

    var mraid;

    beforeEach(function() {
        events = {};
        logger.enabled(false);

        window.mraid = {
            addEventListener: jasmine.createSpy('mraid.addEventListener()').and.callFake(function addEventListener(event, handler) {
                (events[event] || (events[event] = [])).push(handler);
            }),

            removeEventListener: jasmine.createSpy('mraid.removeEventListener()').and.callFake(function removeEventListener(event, handler) {
                events[event] = (event[events] || []).filter(function(item) {
                    return item !== handler;
                });
            }),

            getState: jasmine.createSpy('mraid.getState()').and.returnValue('loading'),
            isViewable: jasmine.createSpy('mraid.isViewable()').and.returnValue(false),

            getExpandProperties: jasmine.createSpy('mraid.getExpandProperties()').and.returnValue({
                width: 320,
                height: 490,
                useCustomClose: false,
                isModal: true
            }),
            setExpandProperties: jasmine.createSpy('mraid.setExpandProperties()'),

            getOrientationProperties: jasmine.createSpy('mraid.getOrientationProperties()').and.returnValue({
                allowOrientationChange: true,
                forceOrientation: 'none'
            }),
            setOrientationProperties: jasmine.createSpy('mraid.setOrientationProperties()'),

            getVersion: jasmine.createSpy('mraid.getVersion()').and.returnValue('2.0'),
            supports: jasmine.createSpy('mraid.supports()').and.returnValue(false),

            useCustomClose: jasmine.createSpy('mraid.useCustomClose()'),

            open: jasmine.createSpy('mraid.open()'),
            expand: jasmine.createSpy('mraid.expand()'),
            close: jasmine.createSpy('mraid.close()')
        };

        mraid = new iab.MRAID();
    });

    afterEach(function() {
        delete window.mraid;
    });

    function dispatch(event) {
        var args = Array.prototype.slice.call(arguments, 1);

        (events[event] || []).forEach(function(handler) {
            handler.apply(null, args);
        });
    }

    it('should exist', function() {
        expect(mraid).toEqual(jasmine.any(Object));
    });

    describe('when non-mraid event listeners are added', function() {
        beforeEach(function() {
            window.mraid.addEventListener.calls.reset();
            mraid.on('pollProperty', function() {});
            mraid.on('removeListener', function() {});
        });

        it('should not call mraid.addEventListener()', function() {
            expect(window.mraid.addEventListener).not.toHaveBeenCalled();
        });
    });

    describe('when mraid events are emitted', function() {
        var ready, error, stateChange, viewableChange, sizeChange;

        beforeEach(function() {
            ready = jasmine.createSpy('ready()');
            error = jasmine.createSpy('error()');
            stateChange = jasmine.createSpy('stateChange()');
            viewableChange = jasmine.createSpy('viewableChange()');
            sizeChange = jasmine.createSpy('sizeChange()');

            mraid.on('ready', ready);
            mraid.on('error', error);
            mraid.on('stateChange', stateChange);
            mraid.on('stateChange', stateChange);
            mraid.on('viewableChange', viewableChange);
            mraid.on('sizeChange', sizeChange);

            dispatch('ready', 'foo', 'bar');
            dispatch('error', new Error());
            dispatch('stateChange', { data: 'foo' });
            dispatch('viewableChange');
            dispatch('sizeChange', 'BIG');
        });

        it('should emit the events on itself', function() {
            expect(ready).toHaveBeenCalledWith('foo', 'bar');
            expect(error).toHaveBeenCalledWith(jasmine.any(Error));
            expect(stateChange).toHaveBeenCalledWith({ data: 'foo' });
            expect(viewableChange).toHaveBeenCalledWith();
            expect(sizeChange).toHaveBeenCalledWith('BIG');

            expect(stateChange.calls.count()).toBe(2);
        });
    });

    describe('when the last handler for an mraid event is removed', function() {
        var ready1, ready2, ready3;

        beforeEach(function() {
            mraid.removeAllListeners('ready');

            ready1 = jasmine.createSpy('ready1()');
            ready2 = jasmine.createSpy('ready2()');
            ready3 = jasmine.createSpy('ready3()');

            mraid.on('ready', ready1);
            mraid.on('ready', ready2);
            mraid.on('ready', ready3);
        });

        it('should remove the handler when its last handler is removed', function() {
            mraid.removeListener('ready', ready1);
            expect(events.ready.length).not.toBe(0);

            mraid.removeListener('ready', ready2);
            expect(events.ready.length).not.toBe(0);

            mraid.removeListener('ready', ready3);
            expect(events.ready.length).toBe(0);
        });
    });

    describe('if there is no mraid global', function() {
        beforeEach(function() {
            delete window.mraid;
        });

        it('should throw an error', function() {
            expect(function() {
                new iab.MRAID();
            }).toThrow(new Error('window.mraid does not exist'));
        });
    });

    describe('when called with configuration options', function() {
        beforeEach(function() {
            mraid = new iab.MRAID({
                width: 1920,
                height: 1080,
                useCustomClose: true,
                isModal: false,
                allowOrientationChange: false,
                forceOrientation: 'portrait'
            });
        });

        it('should not touch any mraid methods', function() {
            [
                window.mraid.getExpandProperties,
                window.mraid.setExpandProperties,
                window.mraid.getOrientationProperties,
                window.mraid.setOrientationProperties
            ].forEach(function(spy) {
                expect(spy).not.toHaveBeenCalled();
            });
        });

        describe('when the api is ready', function() {
            beforeEach(function(done) {
                window.mraid.getState.and.returnValue('default');
                mraid.emit('ready');

                q().then(function() {}).then(done);
            });

            it('should set the correct props', function() {
                expect(window.mraid.setExpandProperties).toHaveBeenCalledWith({
                    width: 1920,
                    height: 1080,
                    useCustomClose: true,
                    isModal: false
                });
                expect(window.mraid.setOrientationProperties).toHaveBeenCalledWith({
                    allowOrientationChange: false,
                    forceOrientation: 'portrait'
                });
                expect(window.mraid.useCustomClose).toHaveBeenCalledWith(true);
            });
        });
    });

    describe('if called with partial configuration options', function() {
        beforeEach(function(done) {
            window.mraid.getState.and.returnValue('default');

            mraid = new iab.MRAID({
                width: 800,
                forceOrientation: 'none'
            });

            q().then(done);
        });

        it('should use the current values to fill in unset props', function() {
            expect(window.mraid.setExpandProperties).toHaveBeenCalledWith({
                width: 800,
                height: window.mraid.getExpandProperties().height,
                useCustomClose: window.mraid.getExpandProperties().useCustomClose,
                isModal: window.mraid.getExpandProperties().isModal
            });
            expect(window.mraid.setOrientationProperties).toHaveBeenCalledWith({
                allowOrientationChange: window.mraid.getOrientationProperties().allowOrientationChange,
                forceOrientation: 'none'
            });
            expect(window.mraid.useCustomClose).toHaveBeenCalledWith(false);
        });
    });

    describe('if called with no configuration options', function() {
        beforeEach(function(done) {
            window.mraid.getState.and.returnValue('default');

            mraid = new iab.MRAID();
            q().then(done);
        });

        it('should call setExpandProperties() and setOrientationProperties() with the current values', function() {
            expect(window.mraid.setExpandProperties).toHaveBeenCalledWith(window.mraid.getExpandProperties());
            expect(window.mraid.setOrientationProperties).toHaveBeenCalledWith(window.mraid.getOrientationProperties());
            expect(window.mraid.useCustomClose).toHaveBeenCalledWith(false);
        });
    });

    ['portrait', 'landscape'].forEach(function(orientation) {
        describe('if forceOrientation is ' + orientation, function() {
            beforeEach(function(done) {
                window.mraid.getState.and.returnValue('default');
                window.mraid.setOrientationProperties.calls.reset();

                mraid = new iab.MRAID({
                    forceOrientation: orientation,
                    allowOrientationChange: true
                });
                q().then(done);
            });

            it('should make allowOrientationChange false', function() {
                expect(window.mraid.setOrientationProperties).toHaveBeenCalledWith({
                    allowOrientationChange: false,
                    forceOrientation: orientation
                });
            });
        });
    });

    ['none'].forEach(function(orientation) {
        describe('if forceOrientation is ' + orientation, function() {
            [true, false].forEach(function(allow) {
                describe('and allowOrientationChange is ' + allow, function() {
                    beforeEach(function(done) {
                        window.mraid.getState.and.returnValue('default');
                        window.mraid.setOrientationProperties.calls.reset();

                        mraid = new iab.MRAID({
                            forceOrientation: orientation,
                            allowOrientationChange: allow
                        });
                        q().then(done);
                    });

                    it('should make allowOrientationChange ' + allow, function() {
                        expect(window.mraid.setOrientationProperties).toHaveBeenCalledWith({
                            allowOrientationChange: allow,
                            forceOrientation: orientation
                        });
                    });
                });
            });
        });
    });

    describe('if the version is 1.0', function() {
        beforeEach(function(done) {
            window.mraid.getVersion.and.returnValue('1.0');
            window.mraid.getState.and.returnValue('default');
            window.mraid.getOrientationProperties.calls.reset();
            window.mraid.setOrientationProperties.calls.reset();
            window.mraid.supports.calls.reset();

            mraid = new iab.MRAID();
            q().then(done);
        });

        it('should not call getOrientationProperties() or setOrientationProperties()', function() {
            expect(window.mraid.getOrientationProperties).not.toHaveBeenCalled();
            expect(window.mraid.setOrientationProperties).not.toHaveBeenCalled();
        });

        it('should not call supports()', function() {
            expect(window.mraid.supports).not.toHaveBeenCalled();
        });
    });

    describe('properties:', function() {
        describe('[ready]', function() {
            ['loading'].forEach(function(state) {
                describe('if getState() returns ' + state, function() {
                    beforeEach(function() {
                        window.mraid.getState.and.returnValue(state);
                    });

                    it('should be false', function() {
                        expect(mraid.ready).toBe(false);
                    });
                });
            });

            ['default', 'expanded', 'resized', 'hidden'].forEach(function(state) {
                describe('if getState() returns ' + state, function() {
                    beforeEach(function() {
                        window.mraid.getState.and.returnValue(state);
                    });

                    it('should be true', function() {
                        expect(mraid.ready).toBe(true);
                    });
                });
            });
        });

        describe('[viewable]', function() {
            [true, 1].forEach(function(value) {
                describe('if isViewable() returns ' + value, function() {
                    beforeEach(function() {
                        window.mraid.isViewable.and.returnValue(value);
                    });

                    it('should be true', function() {
                        expect(mraid.viewable).toBe(true);
                    });
                });
            });

            [false, 0].forEach(function(value) {
                describe('if isViewable() returns ' + value, function() {
                    beforeEach(function() {
                        window.mraid.isViewable.and.returnValue(value);
                    });

                    it('should be false', function() {
                        expect(mraid.viewable).toBe(false);
                    });
                });
            });
        });

        describe('[useCustomClose]', function() {
            [true, false].forEach(function(value) {
                describe('if mraid.getExpandProperties().useCustomClose is ' + value, function() {
                    beforeEach(function() {
                        window.mraid.getExpandProperties.and.returnValue({ useCustomClose: value });
                    });

                    it('should be ' + value, function() {
                        expect(mraid.useCustomClose).toBe(value);
                    });
                });
            });
        });
    });

    describe('methods:', function() {
        describe('[waitUntil({ prop, value, event })]', function() {
            var success, failure;

            beforeEach(function() {
                jasmine.clock().install();

                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');
            });

            afterEach(function() {
                jasmine.clock().uninstall();
            });

            describe('if the prop is already the value', function() {
                beforeEach(function(done) {
                    mraid.foo = 'bar';

                    mraid.waitUntil({ prop: 'foo', value: 'bar', event: 'fooChange' }).then(success, failure);
                    q().then(done);
                });

                it('should fulfill with the value', function() {
                    expect(success).toHaveBeenCalledWith('bar');
                });
            });

            describe('if the prop is not already the value', function() {
                var value;
                var get, set;

                beforeEach(function(done) {
                    value = 'foo';
                    get = jasmine.createSpy('get() foo').and.callFake(function() {
                            return value;
                    });
                    set = jasmine.createSpy('set() foo').and.callFake(function(val) {
                        value = val;
                    });

                    Object.defineProperty(mraid, 'foo', { get: get, set: set });

                    mraid.waitUntil({ prop: 'foo', value: 'bar', event: 'fooChange' }).then(success, failure);
                    q().then(done);
                });

                it('should not fulfill the promise', function() {
                    expect(success).not.toHaveBeenCalled();
                    expect(failure).not.toHaveBeenCalled();
                });

                describe('as time passes', function() {
                    var pollProperty;

                    beforeEach(function() {
                        pollProperty = jasmine.createSpy('pollProperty()');
                        mraid.on('pollProperty', pollProperty);
                        get.calls.reset();
                    });

                    it('should emit the "pollProperty" event', function() {
                        jasmine.clock().tick(1000);
                        expect(pollProperty).toHaveBeenCalledWith('foo', 'foo', 'bar');
                        expect(get.calls.count()).toBe(1);
                        pollProperty.calls.reset();
                        get.calls.reset();

                        mraid.foo = 'HEY!';
                        jasmine.clock().tick(1000);
                        expect(pollProperty).toHaveBeenCalledWith('foo', 'HEY!', 'bar');
                        expect(get.calls.count()).toBe(1);
                    });
                });

                describe('if time passes and the value still has not become the expected one', function() {
                    beforeEach(function(done) {
                        mraid.foo = 'hello';
                        jasmine.clock().tick(1000);
                        mraid.foo = 'world';
                        jasmine.clock().tick(1000);

                        q().then(done);
                    });

                    it('should not fulfill the promise', function() {
                        expect(success).not.toHaveBeenCalled();
                    });
                });

                describe('if the value becomes the expected one', function() {
                    beforeEach(function(done) {
                        mraid.foo = 'bar';
                        jasmine.clock().tick(1000);
                        q().then(done);
                    });

                    it('should fulfill the promise', function() {
                        expect(success).toHaveBeenCalledWith('bar');
                    });
                });

                describe('when the provided event is emitted', function() {
                    describe('but the value has not changed to the expected one', function() {
                        beforeEach(function(done) {
                            mraid.foo = 'something';
                            mraid.emit('fooChange');

                            q().then(done);
                        });

                        it('should not resolve the promise', function() {
                            expect(success).not.toHaveBeenCalled();
                            expect(failure).not.toHaveBeenCalled();
                        });

                        describe('and then it does', function() {
                            beforeEach(function(done) {
                                mraid.foo = 'bar';
                                mraid.emit('fooChange');

                                q().then(done);
                            });

                            it('should fulfill the promise', function() {
                                expect(success).toHaveBeenCalledWith('bar');
                            });
                        });
                    });

                    describe('and the value has changed to the expected one', function() {
                        beforeEach(function(done) {
                            mraid.foo = 'bar';
                            mraid.emit('fooChange');

                            q().then(done);
                        });

                        it('should fulfill promise', function() {
                            expect(success).toHaveBeenCalledWith('bar');
                        });
                    });
                });
            });
        });

        describe('[waitUntilReady()]', function() {
            var waitUntilPromise;
            var result;

            beforeEach(function() {
                waitUntilPromise = q.defer().promise;
                spyOn(mraid, 'waitUntil').and.returnValue(waitUntilPromise);

                result = mraid.waitUntilReady();
            });

            it('should wait until ready is true', function() {
                expect(mraid.waitUntil).toHaveBeenCalledWith({
                    prop: 'ready',
                    value: true,
                    event: 'ready'
                });
                expect(result).toBe(waitUntilPromise);
            });
        });

        describe('[waitUntilViewable()]', function() {
            var readyDeferred;
            var viewableDeferred;
            var success, failure;

            beforeEach(function(done) {
                readyDeferred = q.defer();
                spyOn(mraid, 'waitUntilReady').and.returnValue(readyDeferred.promise);

                viewableDeferred = q.defer();
                spyOn(mraid, 'waitUntil').and.returnValue(viewableDeferred.promise);

                success = jasmine.createSpy('success()');
                failure = jasmine.createSpy('failure()');

                mraid.waitUntilViewable().then(success, failure);
                q().then(done);
            });

            it('should wait until it is ready', function() {
                expect(mraid.waitUntilReady).toHaveBeenCalledWith();
            });

            it('should not start waiting until it is viewable', function() {
                expect(mraid.waitUntil).not.toHaveBeenCalledWith({ prop: 'viewable', value: true, event: 'viewableChange' });
            });

            it('should not fulfill the promise', function() {
                expect(success).not.toHaveBeenCalled();
                expect(failure).not.toHaveBeenCalled();
            });

            describe('when it is ready', function() {
                beforeEach(function(done) {
                    readyDeferred.resolve(true);

                    q().then(function() {}).then(done);
                });

                it('should wait until it is viewable', function() {
                    expect(mraid.waitUntil).toHaveBeenCalledWith({ prop: 'viewable', value: true, event: 'viewableChange' });
                });

                it('should not fulfill the promise', function() {
                    expect(success).not.toHaveBeenCalled();
                    expect(failure).not.toHaveBeenCalled();
                });

                describe('when it is viewable', function() {
                    beforeEach(function(done) {
                        viewableDeferred.resolve(true);

                        q().then(done);
                    });

                    it('should fulfill the promise', function() {
                        expect(success).toHaveBeenCalledWith(true);
                    });
                });
            });
        });

        describe('[open(url)]', function() {
            var url;

            beforeEach(function() {
                url = 'http://www.apple.com/';
            });

            ['default', 'expanded', 'resized'].forEach(function(state) {
                describe('if the state is ' + state, function() {
                    beforeEach(function() {
                        window.mraid.getState.and.returnValue(state);

                        mraid.open(url);
                    });

                    it('should open the url', function() {
                        expect(window.mraid.open).toHaveBeenCalledWith(url);
                    });
                });
            });

            ['loading', 'hidden'].forEach(function(state) {
                describe('if the state is ' + state, function() {
                    beforeEach(function() {
                        window.mraid.getState.and.returnValue(state);

                        mraid.open(url);
                    });

                    it('should do nothing', function() {
                        expect(window.mraid.open).not.toHaveBeenCalled();
                    });
                });
            });
        });

        describe('[expand(url)]', function() {
            var url;

            beforeEach(function() {
                url = 'http://www.google.com';
            });

            ['default', 'expanded', 'resized'].forEach(function(state) {
                describe('if the state is ' + state, function() {
                    beforeEach(function() {
                        window.mraid.getState.and.returnValue(state);

                        mraid.expand(url);
                    });

                    it('should expand the url', function() {
                        expect(window.mraid.expand).toHaveBeenCalledWith(url);
                    });
                });
            });

            ['loading', 'hidden'].forEach(function(state) {
                describe('if the state is ' + state, function() {
                    beforeEach(function() {
                        window.mraid.getState.and.returnValue(state);

                        mraid.expand(url);
                    });

                    it('should do nothing', function() {
                        expect(window.mraid.expand).not.toHaveBeenCalled();
                    });
                });
            });
        });

        describe('[close()]', function() {
            ['default', 'expanded', 'resized'].forEach(function(state) {
                describe('if the state is ' + state, function() {
                    beforeEach(function() {
                        window.mraid.getState.and.returnValue(state);

                        mraid.close();
                    });

                    it('should close the ad', function() {
                        expect(window.mraid.close).toHaveBeenCalled();
                    });
                });
            });

            ['loading', 'hidden'].forEach(function(state) {
                describe('if the state is ' + state, function() {
                    beforeEach(function() {
                        window.mraid.getState.and.returnValue(state);

                        mraid.close();
                    });

                    it('should do nothing', function() {
                        expect(window.mraid.close).not.toHaveBeenCalled();
                    });
                });
            });
        });
    });
});
