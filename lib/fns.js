(function() {
    'use strict';

    module.exports.extend = function() {
        var objects = Array.prototype.slice.call(arguments);

        return objects.reduce(function(result, object) {
            return Object.keys(object || {}).reduce(function(result, key) {
                result[key] = object[key];
                return result;
            }, result);
        }, {});
    };
}());
