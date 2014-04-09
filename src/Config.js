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
    this.env            = ($window.__C6_ENV__ || 'production').toLowerCase();
    this.urlRoot        = ($window.__C6_URL_ROOT__ || 'http://cinema6.com');
    this.collateralBase = ($window.__C6_BASE_COL__ || (this.urlRoot + '/collateral'));
    this.experienceBase = ($window.__C6_BASE_EXP__ || (this.urlRoot + '/experiences'));
    this.apiBase        = ($window.__C6_BASE_API__ || (this.urlRoot + '/api'));
};
