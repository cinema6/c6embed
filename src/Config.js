module.exports = function(deps) {
    'use strict';

    var $window = deps.window;

    this.debug          = !!$window.__C6_DEBUG__;
    this.urlRoot        = ($window.__C6_URL_ROOT__ ||
        ($window.location.protocol + '//portal.cinema6.com'));
    this.appBase        = (this.urlRoot + '/apps');
    this.apiBase        = (this.urlRoot + '/api');
    this.gaAcctIdPlayer = 'UA-44457821-2';
    this.gaAcctIdEmbed  = 'UA-44457821-3';
};
