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

    function handleError() {
        var d = xhr.statusText;
        if (!d) {
            d =  new Error('The XHR request to [' + (url && url.substr(0,150)) +
                    '] has failed...');
        }
        deferred.reject({
            status: null,
            data: d,
            headers: function() {
                return null;
            }
        });
    }
    
    xhr.onload = handleResponse;
    xhr.onerror = handleError;

    xhr.open(config.method, url, true);

    if (config.withCredentials) {
        xhr.withCredentials = true;
    }

    xhr.responseType = config.responseType || '';
    setHeaders(config.headers);
    xhr.timeout = config.timeout || 0;

    xhr.send(config.data);

    return deferred.promise;
};
