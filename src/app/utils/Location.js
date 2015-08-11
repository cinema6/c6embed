module.exports = function(deps) {
    'use strict';

    var $window = deps.window;
    var $document = deps.document;

    var parseUrl = (function() {
        var parser = $document.createElement('a');
        var needsDoubleSet = (function() {
            parser.setAttribute('href', '/foo');
            return !parser.protocol;
        }());

        return function parseUrl(url) {
            parser.setAttribute('href', url);
            if (needsDoubleSet) { parser.setAttribute('href', parser.href); }

            return parser;
        };
    }());

    this.originOf = function(url) {
        function getOriginOf(url) {
            var parsed = parseUrl(url);
            var protocol = parsed.protocol;
            var hostname = parsed.hostname;
            var port = parseInt(parsed.port, 10) || (protocol === 'https:' ? 443 : 80);

            return (hostname || null) && (protocol + '//' + hostname + ':' + port);
        }

        return getOriginOf(url);
    };

    Object.defineProperties(this, {
        origin: {
            get: function() {
                return this.originOf($window.location.href);
            }
        },

        protocol: {
            get: function() {
                return (/https?:/).test($window.location.protocol) ?
                    $window.location.protocol : 'http:';
            }
        }
    });
};
