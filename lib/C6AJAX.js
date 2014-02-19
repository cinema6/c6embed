module.exports = function(deps) {
    'use strict';

    var $window = deps.window,
        q = deps.q;

    var XHR = $window.XMLHttpRequest;

    function ajax(config) {
        var xhr = new XHR(),
            url,
            deferred = q.defer();

        function toQueryParams(params) {
            var key,
                pairs = [];

            if (!params) { return ''; }

            for (key in params) {
                pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
            }

            return '?' + pairs.join('&');
        }

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
                    headers: xhr.getAllResponseHeaders
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
