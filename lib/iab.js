(function() {
    'use strict';

    var EventEmitter = require('events').EventEmitter;
    var q = require('q');
    var inherits = require('util').inherits;
    var extend = require('./fns').extend;

    var STATE = {
        LOADING: 'loading',
        DEFAULT: 'default',
        EXPANDED: 'expanded',
        RESIZED: 'resized',
        HIDDEN: 'hidden'
    };

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

        if (!window.mraid) {
            throw new Error('window.mraid does not exist');
        }

        this.__private__ = {
            handlers: {},
            mraid: window.mraid
        };

        this.waitUntilReady().then(function setProps() {
            var $private = mraid.__private__;
            var expandedProps = extend(
                $private.mraid.getExpandProperties(),
                pick(props, ['width', 'height', 'useCustomClose', 'isModal'])
            );
            var orientationProps = extend(
                $private.mraid.getOrientationProperties(),
                pick(props, ['allowOrientationChange', 'forceOrientation'])
            );

            $private.mraid.setExpandProperties(expandedProps);
            $private.mraid.setOrientationProperties(orientationProps);
        });

        this.on('newListener', function onNewListener(event) {
            var $private = mraid.__private__;

            if ($private.handlers[event]) { return; }

            var handler = $private.handlers[event] = function handleMraidEvent() {
                mraid.emit.apply(mraid, [event].concat(toArray(arguments)));
            };

            $private.mraid.addEventListener(event, handler);
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

                return $private.mraid.getState() !== STATE.LOADING;
            }
        },

        viewable: {
            get: function getViewable() {
                var $private = this.__private__;

                return $private.mraid.isViewable();
            }
        }
    });

    MRAID.prototype.waitUntil = function waitUntil(config) {
        var mraid = this;
        var value = config.value;
        var prop = config.prop;
        var event = config.event;
        var deferred = q.defer();

        function hasExpectedValue() {
            return mraid[prop] === value;
        }

        if (hasExpectedValue()) {
            return q(value);
        }

        this.on(event, function checkValue() {
            if (hasExpectedValue()) {
                deferred.resolve(value);
                this.removeListener(event, checkValue);
            }
        });

        return deferred.promise;
    };

    MRAID.prototype.waitUntilReady = function waitUntilReady() {
        return this.waitUntil({ prop: 'ready', value: true, event: 'stateChange' });
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
