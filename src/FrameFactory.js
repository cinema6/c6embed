module.exports = function(deps) {
    'use strict';

    var $ = deps.$,
        documentParser = deps.documentParser;

    return function(width, height) {
        var $result = $([
            '<div style="position: relative;">',
            '    <iframe src="about:blank"',
            '        width="100%"',
            '        height="0"',
            '        scrolling="no"',
            '        style="border: none;"',
            '        class="c6__cant-touch-this">',
            '    </iframe>',
            '</div>'
        ].join(''));

        if (!width || !height) {
            $result.css({
                width: '100%',
                height: '0',
                'box-sizing': 'border-box',
                '-moz-box-sizing': 'border-box',
                fontSize: '16px'
            });
        } else {
            $result.css({
                width: width,
                height: height
            });
        }

        $result.load = function(html, cb) {
            var $iframe = $($result[0].childNodes[1]),
                document = documentParser(html);

            document.injectScript(function(window) {
                (window.history.replaceState || function() {}).call(
                    window.history,
                    {},
                    'parent',
                    window.parent.location.href
                );
                window.frameElement.c6Loaded(window);
            });

            $iframe.prop('c6Loaded', cb);
            $iframe.attr('data-srcdoc', document.toString());
            /* jshint scripturl:true */
            $iframe.attr('src', 'javascript: window.frameElement.getAttribute(\'data-srcdoc\')');
            /* jshint scripturl:false */
        };

        return $result;
    };
};
