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
    this.debug = !!$window.__C6_DEBUG__;
    this.collateralBase = this.debug ?
        'http://staging.cinema6.com/collateral' :
        'http://cinema6.com/collateral';
    this.expBase = this.debug ?
        'http://staging.cinema6.com/experiences' :
        'http://cinema6.com/experiences';
    this.apiBase = this.debug ?
        'http://staging.cinema6.com/api' :
        'http://cinema6.com/api';
};
