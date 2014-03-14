module.exports = function(deps) {
    'use strict';

    var c6Ajax = deps.c6Ajax,
        q = deps.q;

    var self = this;

    function proxyMethod(method, type, args) {
        var service = self._serviceForType(type),
            adapter = self._services[service];

        if (!adapter) {
            return q.reject('Don\'t know how to handle type: ' + type + '.');
        }

        return adapter[method].apply(adapter, args);
    }

    function returnData(response) {
        return response.data;
    }

    this._serviceForType = function(type) {
        switch (type) {
        case 'experience':
            return 'content';
        default:
            return undefined;
        }
    };

    this._services = {
        content: {
            _base: '/content',
            findAll: function(type) {
                return c6Ajax.get(self.apiBase + this._base + '/' + type + 's')
                    .then(returnData);
            },
            find: function(type, id) {
                return c6Ajax.get(self.apiBase + this._base + '/' + type + '/' + id)
                    .then(returnData)
                    .then(function(data) {
                        return [data];
                    });
            },
            findQuery: function(type, query) {
                return c6Ajax.get((self.apiBase + this._base + '/' + type + 's'), {
                    params: query
                }).then(returnData);
            }
        }
    };

    this.findAll = function(type) {
        return proxyMethod('findAll', type, arguments);
    };

    this.find = function(type) {
        return proxyMethod('find', type, arguments);
    };

    this.findQuery = function(type) {
        return proxyMethod('findQuery', type, arguments);
    };
};
