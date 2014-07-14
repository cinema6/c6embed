module.exports = function() {
    'use strict';

    function Observer(initialValue, context) {
        this.context = context;
        this.handlers = [];
        this.lastValue = initialValue;
    }
    Observer.prototype = {
        notify: function(newValue) {
            if (newValue === this.lastValue) { return; }

            this.handlers.forEach(function(handler) {
                this.invoke(handler, newValue, this.lastValue);
            }, this);
            this.lastValue = newValue;
        },
        invoke: function() {
            var args = Array.prototype.slice.call(arguments),
                handler = args.shift();

            return handler.apply(this.context, args);
        },
        remove: function(handler) {
            this.handlers.splice(this.handlers.indexOf(handler), 1);
        },
        add: function(handler) {
            this.handlers.push(handler);
            this.invoke(handler, this.lastValue, this.lastValue);
        }
    };

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
                observer = this._observers[prop];

            this.get(props.join('.'))[key] = value;

            if (observer) {
                observer.notify(value);
            }
        },
        observe: function(prop, cb) {
            (this._observers[prop] ||
                (this._observers[prop] = new Observer(this.get(prop), this))
            ).add(cb);

            return this;
        },
        ignore: function(prop, cb) {
            var observer = this._observers[prop];

            if (observer) {
                observer.remove(cb);
            }
        }
    };

    return Observable;
};
