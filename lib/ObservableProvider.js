module.exports = function() {
    'use strict';

    function Observable(object) {
        var prop;

        for (prop in object) {
            this[prop] = object[prop];
        }

        this._observers = {};
    }
    Observable.prototype = {
        get: function(prop) {
            var props = (prop || '').split('.');

            return props.reduce(function(object, prop) {
                return object && (prop ? object[prop] : object);
            }, this);
        },
        set: function(prop, value) {
            var props = prop.split('.'),
                key = props.pop(),
                bucket = this._observers[prop] || [];

            this.get(props.join('.'))[key] = value;

            if (bucket.lastNotified === value) { return; }

            bucket.forEach(function(cb) {
                cb(value);
            });
        },
        observe: function(prop, cb) {
            var self = this,
                bucket = this._observers[prop] || (this._observers[prop] = []);

            function notify(value) {
                cb.call(self, value);
                bucket.lastNotified = value;
            }

            notify.cb = cb;

            notify(this.get(prop));
            bucket.push(notify);

            return this;
        },
        ignore: function(prop, cb) {
            var bucket = this._observers[prop] || [],
                index = bucket.map(function(notify) {
                    return notify.cb;
                }).indexOf(cb);

            bucket.splice(index, 1);
        }
    };

    return Observable;
};
