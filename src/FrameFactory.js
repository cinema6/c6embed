module.exports = function(deps) {
    'use strict';

    var $ = deps.$,
        q = deps.q,
        documentParser = deps.documentParser;

    return function() {
        var $result = $([
            '<iframe src="about:blank"',
            '    width="100%"',
            '    height="0"',
            '    scrolling="no"',
            '    style="border: none; position: absolute; top: 0px; left: 0px; z-index: 100;"',
            '    class="c6__cant-touch-this">',
            '</iframe>'
        ].join(''));

        $result.load = function(html, cb) {
            var document = documentParser(html),
                deferred = q.defer();

            document.injectScript(function(window) {
                try {
                    window.history.replaceState({}, 'parent', window.parent.location.href);
                } catch (e) {}
                window.frameElement.c6Loaded(window);
            });

            this.prop('c6Loaded', function(win) {
                deferred.resolve(cb(win));
            });
            this.attr('data-srcdoc', document.toString());
            /* jshint scripturl:true */
            // NOTE: It is very important that the "prop()" method and not the "attr()" method is
            // used here. Using "attr()" will cause this to fail in IE.
            this.prop('src', 'javascript: window.frameElement.getAttribute(\'data-srcdoc\')');
            /* jshint scripturl:false */

            return deferred.promise;
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
