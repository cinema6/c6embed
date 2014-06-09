module.exports = function(deps) {
    'use strict';

    var $ = deps.$,
        documentParser = deps.documentParser;

    return function() {
        var $result = $([
            '<iframe src="about:blank"',
            '    width="100%"',
            '    height="0"',
            '    scrolling="no"',
            '    style="border: none; position: absolute; top: 0px; left: 0px;"',
            '    class="c6__cant-touch-this">',
            '</iframe>'
        ].join(''));

        $result.load = function(html, cb) {
            var document = documentParser(html);

            document.injectScript(function(window) {
                try {
                    window.history.replaceState({}, 'parent', window.parent.location.href);
                } catch (e) {}
                window.frameElement.c6Loaded(window);
            });

            this.prop('c6Loaded', cb);
            this.attr('data-srcdoc', document.toString());
            /* jshint scripturl:true */
            this.attr('src', 'javascript: window.frameElement.getAttribute(\'data-srcdoc\')');
            /* jshint scripturl:false */
        };

        $result.fullscreen = function(enterFullscreen) {
            this.css(enterFullscreen ?
                {
                    position: 'fixed',
                    right: '0px',
                    bottom: '0px',
                    zIndex: 9007199254740992
                } :
                {
                    position: 'absolute',
                    bottom: '',
                    right: '',
                    zIndex: ''
                }
            );

            return this;
        };

        $result.show = function() {
            this.attr('height', '100%');
        };

        $result.hide = function() {
            this.attr('height', '0');
        };

        return $result;
    };
};
