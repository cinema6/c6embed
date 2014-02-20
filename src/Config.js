module.exports = function(deps) {
    'use strict';

    var $window = deps.window,
        $document = deps.document;

    var scripts = $document.getElementsByTagName('script'),
        thisScript = scripts[scripts.length - 1];

    this.experienceId = thisScript.getAttribute('data-exp');
    this.width = thisScript.getAttribute('data-width');
    this.height = thisScript.getAttribute('data-height');

    this.src = thisScript.getAttribute('src');
    this.script = thisScript;
    this.debug = !!$window.__C6_DEBUG__;
};
