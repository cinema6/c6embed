module.exports = function(deps) {
    'use strict';

    var $window = deps.window;

    this.originOf = function(url) {
        var isAbs = url.search(/^\w+:\/\//) > -1;

        function getOriginOfAbsUrl(url) {
            var protocol = url.match(/^\w+:/)[0].slice(0, -1),
                portMatcher = url.match(/:\d+/),
                port = portMatcher && portMatcher[0].slice(1),
                host = url.match(/\/\/(\w|\d+|\.)+/)[0].slice(2);

            if (!port) {
                port = (protocol === 'https') ? '443' : '80';
            }

            return protocol + '://' + host + ':' + port;
        }

        return getOriginOfAbsUrl(isAbs ? url : $window.location.href);
    };

    Object.defineProperties(this, {
        origin: {
            get: function() {
                return this.originOf($window.location.href);
            }
        }
    });
};
