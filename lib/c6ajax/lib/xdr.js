module.exports = function(deps) {
    'use strict';

    var config = deps.config,
        q = deps.q,
        $window = deps.window,
        toQueryParams = deps.toQueryParams;

    var xdr = new $window.XDomainRequest(),
        url = config.url + toQueryParams(config.params),
        deferred = q.defer();

    function makeResponse(data) {
        return {
            status: null,
            data: data,
            headers: function() {}
        };
    }

    xdr.onerror = function() {
        deferred.reject(
            makeResponse('The XDomainRequest failed. We\'d tell you more if we could...')
        );
    };
    xdr.ontimeout = function() {
        deferred.reject(
            makeResponse('The XDomainRequest timed out after ' + config.timeout + 'ms.')
        );
    };
    xdr.onload = function() {
        var data;

        try {
            data = JSON.parse(xdr.responseText);
        } catch (e) {
            data = xdr.responseText;
        }

        deferred.resolve(makeResponse(data));
    };

    xdr.timeout = config.timeout || 0;

    xdr.open(config.method, url);
    xdr.send(((typeof config.data === 'object') ?
              JSON.stringify(config.data) : config.data) || '');

    return deferred.promise;
};
