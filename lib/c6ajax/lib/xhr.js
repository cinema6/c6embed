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
                data: (function() {
                    try {
                        return JSON.parse(xhr.responseText);
                    } catch(e) {
                        return xhr.responseText;
                    }
                }()),
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

    xhr.open(config.method, url, true);

    xhr.responseType = config.responseType || '';
    setHeaders(config.headers);
    xhr.timeout = config.timeout || 0;

    xhr.send(config.data);

    return deferred.promise;
};
