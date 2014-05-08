module.exports = function(deps) {
    'use strict';

    var $window = deps.window,
        $document = deps.document,
        $ = deps.$;

    var scripts = $document.getElementsByTagName('script'),
        $thisScript = $(scripts[scripts.length - 1]);

    this.experienceId = $thisScript.attr('data-exp');
    this.width = $thisScript.attr('data-width');
    this.height = $thisScript.attr('data-height');
    this.responsive = !this.width && !this.height;

    this.src = $thisScript.attr('src');
    this.$script = $thisScript;
    this.debug          = !!$window.__C6_DEBUG__;
    this.urlRoot        = ($window.__C6_URL_ROOT__ ||
        ($window.location.protocol + '//portal.cinema6.com'));
    this.appBase        = (this.urlRoot + '/apps');
    this.apiBase        = (this.urlRoot + '/api');
    this.gaAcctId       = 'UA-44457821-2';
};
