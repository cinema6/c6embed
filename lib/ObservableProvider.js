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

            if (bucket.lastValue === undefined){
                bucket.lastValue = this.get(props.join('.'))[key];
            }

            this.get(props.join('.'))[key] = value;

            if (bucket.lastValue === value) { return; }

            bucket.forEach(function(cb) {
                cb(value,bucket.lastValue);
            });

            bucket.lastValue = value;
        },
        observe: function(prop, cb) {
            var self = this,
                bucket = this._observers[prop] || (this._observers[prop] = []);

            function notify(value,lastValue) {
                cb.call(self, value, lastValue);
            }

            notify.cb = cb;

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
