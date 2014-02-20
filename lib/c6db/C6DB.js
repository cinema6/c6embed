module.exports = function(deps) {
    'use strict';

    var q = deps.q;

    var _private = {},
        cache = _private.cache = {};

    function saveToCache(type, items) {
        items.forEach(function(item) {
            cache[type + ':' + item.id] = item;
        });

        return items;
    }

    this.find = function(type, id) {
        var adapter = this.adapter;

        function fetchFromCache() {
            var item = cache[type + ':' + id];

            if (!item) {
                return q.reject('Cannot find ' + (type + ':' + id) + ' in cache.');
            }

            return q.when([item]);
        }

        function fetchFromAdapter() {
            return adapter.find(type, id);
        }

        function extractSingle(items) {
            return items[0];
        }

        return fetchFromCache()
            .catch(fetchFromAdapter)
            .then(function(data) { return saveToCache(type, data); })
            .then(extractSingle);
    };

    this.findAll = function(type, matcher) {
        return this.adapter[matcher ? 'findQuery' : 'findAll'].apply(this.adapter, arguments)
            .then(function(data) { return saveToCache(type, data); });
    };

    if (window.__karma__) { this._private = _private; }
};
