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

    this.src = $thisScript.attr('src');
    this.$script = $thisScript;
    this.debug = !!$window.__C6_DEBUG__;
    this.collateralBase = this.debug ?
        'https://s3.amazonaws.com/c6.dev/media/src/site/collateral' :
        'http://cinema6.com/collateral';
};
