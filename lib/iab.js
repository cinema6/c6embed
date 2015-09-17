(function() {
    'use strict';

    var EventEmitter = require('events').EventEmitter;
    var q = require('q');
    var inherits = require('util').inherits;
    var extend = require('./fns').extend;
    var logger = require('./logger').default.context('MRAID');

    var STATE = {
        LOADING: 'loading',
        DEFAULT: 'default',
        EXPANDED: 'expanded',
        RESIZED: 'resized',
        HIDDEN: 'hidden'
    };
    var EVENTS = ['error', 'ready', 'sizeChange', 'stateChange', 'viewableChange'];

    function toArray(object) {
        return Array.prototype.slice.call(object);
    }

    function pick(_object, keys) {
        var object = _object || {};

        return keys.reduce(function(result, key) {
            if (key in object) {
                result[key] = object[key];
            }
            return result;
        }, {});
    }

    function proxyMethod(method) {
        return function proxy() {
            var $private = this.__private__;

            return $private.mraid[method].apply($private.mraid, arguments);
        };
    }

    function MRAID(props) {
        var mraid = this;

        EventEmitter.call(this);

        logger.info('Instantiate');

        if (!window.mraid) {
            logger.error('There is no global MRAID object!');
            throw new Error('window.mraid does not exist');
        }

        this.__private__ = {
            handlers: {},
            mraid: window.mraid
        };

        this.waitUntilReady().then(function setProps() {
            var $private = mraid.__private__;
            var version = $private.mraid.getVersion();

            function setExpandProperties() {
                var expandProps = extend(
                    $private.mraid.getExpandProperties(),
                    pick(props, ['width', 'height', 'useCustomClose', 'isModal'])
                );

                $private.mraid.setExpandProperties(expandProps);
                $private.mraid.useCustomClose(expandProps.useCustomClose);
            }

            function setOrientationProperties() {
                var orientationProps = extend(
                    $private.mraid.getOrientationProperties(),
                    pick(props, ['allowOrientationChange', 'forceOrientation'])
                );

                if (orientationProps.forceOrientation !== 'none') {
                    orientationProps.allowOrientationChange = false;
                }

                $private.mraid.setOrientationProperties(orientationProps);
            }

            logger.info('Ready! Version is', version);

            setExpandProperties();

            if (/^2/.test(version)) {
                setOrientationProperties();
            } else {
                logger.warn(
                    'Can\'t enforce orientation settings because MRAID version isn\'t 2.0.'
                );
            }
        });

        this.on('newListener', function onNewListener(event) {
            var $private = mraid.__private__;

            if ($private.handlers[event] || EVENTS.indexOf(event) < 0) { return; }

            $private.mraid.addEventListener(event, $private.handlers[event] = function handleMraidEvent() {
                mraid.emit.apply(mraid, [event].concat(toArray(arguments)));
            });
        });

        this.on('removeListener', function onRemoveListener(event) {
            var $private = mraid.__private__;

            if (EventEmitter.listenerCount(mraid, event) < 1) {
                $private.mraid.removeEventListener(event, $private.handlers[event]);
                $private.handlers[event] = null;
            }
        });
    }
    inherits(MRAID, EventEmitter);
    Object.defineProperties(MRAID.prototype, {
        ready: {
            get: function getReady() {
                var $private = this.__private__;
                var state = $private.mraid.getState();

                logger.log('Checking State:', state);

                return state !== STATE.LOADING;
            }
        },

        viewable: {
            get: function getViewable() {
                var $private = this.__private__;
                var isViewable = $private.mraid.isViewable();

                logger.log('Checking isViewable():', isViewable);

                return !!isViewable;
            }
        }
    });

    MRAID.prototype.waitUntil = function waitUntil(config) {
        var mraid = this;
        var value = config.value;
        var prop = config.prop;
        var event = config.event;
        var deferred = q.defer();
        var interval = null;

        function check(currentValue) {
            if (currentValue === value) {
                logger.log(prop + ' is now ' + value + '.');

                deferred.resolve(value);

                mraid.removeListener(event, checkValueOnEvent);
                clearInterval(interval);
            }
        }

        function checkValueOnEvent() {
            logger.log('Event fired:', event);
            return check(mraid[prop]);
        }

        function checkValueOnInterval() {
            var currentValue = mraid[prop];

            logger.log('Polling property:', prop);
            mraid.emit('pollProperty', prop, currentValue, value);

            return check(currentValue);
        }

        logger.log('Waiting until ' + prop + ' is ' + value + '.');

        if (mraid[prop] === value) {
            logger.log(prop + ' is already ' + value + '.');
            return q(value);
        }

        this.on(event, checkValueOnEvent);
        interval = setInterval(checkValueOnInterval, 1000);

        return deferred.promise;
    };

    MRAID.prototype.waitUntilReady = function waitUntilReady() {
        return this.waitUntil({ prop: 'ready', value: true, event: 'ready' });
    };

    MRAID.prototype.waitUntilViewable = function waitUntilViewable() {
        var mraid = this;

        return this.waitUntilReady().then(function wait() {
            return mraid.waitUntil({ prop: 'viewable', value: true, event: 'viewableChange' });
        });
    };

    MRAID.prototype.open = proxyMethod('open');

    MRAID.prototype.expand = proxyMethod('expand');

    MRAID.prototype.close = proxyMethod('close');

    module.exports.MRAID = MRAID;
}());
