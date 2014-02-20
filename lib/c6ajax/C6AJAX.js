module.exports = function(deps) {
    'use strict';

    var $window = deps.window,
        q = deps.q,
        browserInfo = deps.browserInfo,
        $location = deps.location;

    var needXdr = !browserInfo.profile.cors && !!$window.XDomainRequest,
        xhr = require('./lib/xhr'),
        xdr = needXdr ? require('./lib/xdr') : null;

    function toQueryParams(params) {
        var key,
            pairs = [];

        if (!params) { return ''; }

        for (key in params) {
            pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
        }

        return '?' + pairs.join('&');
    }

    function ajax(config) {
        var url = config.url,
            isCrossOrigin = $location.origin !== $location.originOf(url),
            useXdr = isCrossOrigin && !!xdr;

        return (useXdr ? xdr : xhr)({
            config: config,
            q: q,
            window: $window,
            toQueryParams: toQueryParams
        });
    }

    ajax.get = function(url, config) {
        config = config || {};

        config.url = url;
        config.method = 'GET';

        return this(config);
    };

    ajax.delete = function(url, config) {
        config = config || {};

        config.url = url;
        config.method = 'DELETE';

        return this(config);
    };

    ajax.post = function(url, data, config) {
        config = config || {};

        config.url = url;
        config.data = data;
        config.method = 'POST';

        return this(config);
    };

    ajax.put = function(url, data, config) {
        config = config || {};

        config.url = url;
        config.data = data;
        config.method = 'PUT';

        return this(config);
    };

    return ajax;
};
