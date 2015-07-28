var formatUrl = require('url').format;

(function() {
    'use strict';

    function existy(value) {
        return value !== null && value !== undefined;
    }

    function filterObject(object, predicate) {
        return Object.keys(object).filter(function(key) {
            return predicate(object[key], key, object);
        }).reduce(function(result, key) {
            result[key] = object[key];
            return result;
        }, {});
    }

    module.exports.pagePath = function(id, params) {
        return formatUrl({
            pathname: '/embed/' + id + '/',
            query: filterObject(params, existy)
        });
    };

}());
