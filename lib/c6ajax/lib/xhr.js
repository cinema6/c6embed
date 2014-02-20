module.exports = function(deps) {
    'use strict';

    var config = deps.config,
        q = deps.q,
        $window = deps.window,
        toQueryParams = deps.toQueryParams;

    var xhr = new $window.XMLHttpRequest(),
        url,
        deferred = q.defer();

    function setHeaders(headers) {
        var header;

        for (header in headers) {
            xhr.setRequestHeader(header, headers[header]);
        }
    }

    url = config.url + toQueryParams(config.params);

    function handleResponse() {
        var response = {
                status: xhr.status,
                data: xhr.response,
                headers: function() {
                    return xhr.getAllResponseHeaders();
                }
            },
            status = response.status,
            success = !(status >= 400 && status < 600);

        deferred[success ? 'resolve' : 'reject'](response);
    }

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            handleResponse();
        }
    };

    xhr.timeout = config.timeout || 0;
    xhr.responseType = config.responseType || '';

    xhr.open(config.method, url);
    setHeaders(config.headers);
    xhr.send(config.data);

    return deferred.promise;
};
