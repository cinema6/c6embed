module.exports = function(deps) {
    'use strict';

    var c6Ajax = deps.c6Ajax,
        q = deps.q;

    var cache = this._cache = {};

    this._getJSON = function(src) {
        var cached = cache[src],
            promise;

        if (cached) {
            promise = q.when({
                status: cached[0],
                data: cached[1],
                headers: function() { return cached[2]; }
            });
        } else {
            promise = c6Ajax.get(src);
        }

        return promise
            .then(function(response) {
                cache[src] = [response.status, response.data, response.headers()];

                return response.data;
            });
    };

    this.findAll = function(type) {
        return this._getJSON(this.jsonSrc)
            .then(function(fixtures) {
                return fixtures[type];
            });
    };

    this.find = function(type, id) {
        return this._getJSON(this.jsonSrc)
            .then(function(fixtures) {
                return fixtures[type].filter(function(object) {
                    return object.id === id;
                });
            });
    };

    this.findQuery = function(type, query) {
        return this._getJSON(this.jsonSrc)
            .then(function(fixtures) {
                var items = fixtures[type],
                    list = (function() {
                        var id = query.id;

                        if (!id) {
                            return items;
                        }

                        id = (id instanceof Array) ? id : [id];

                        return items.filter(function(item) {
                            return id.indexOf(item.id) > -1;
                        });
                    }());

                delete query.id;

                return list.filter(function(item) {
                    for (var key in query) {
                        if (item[key] !== query[key]) {
                            return false;
                        }
                    }

                    return true;
                });
            });
    };
};
