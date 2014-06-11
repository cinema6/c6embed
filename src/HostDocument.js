module.exports = function(deps) {
    'use strict';

    var $ = deps.$,
        window = deps.window;

    function scrollTop() {
        window.scrollTo(0, 0);
    }

    this.reset = function() {
        $('.c6__greetings-from-princeton-nj').revertTo(0);
    };

    this.putInRootStackingContext = function($element) {
        function fixup(node) {
            var parent, style, $parent;

            if (!node) { return; }

            parent = node.parentNode;
            style = parent.style;
            $parent = $(parent);

            if (parent.tagName === 'HTML') { return; }

            $parent.createSnapshot();

            style.setProperty('z-index', 'auto', 'important');
            style.setProperty('opacity', '1', 'important');

            if ($parent.css('position') === 'fixed') {
                style.setProperty('position', 'static', 'important');
            }

            $parent.addClass('c6__greetings-from-princeton-nj');

            fixup($parent[0]);
        }

        fixup($element[0]);
    };

    this.shrink = function(shouldShrink) {
        function snapshot($node) {
            $node.createSnapshot();
            $node.addClass('c6__greetings-from-princeton-nj');
        }

        if (shouldShrink) {
            scrollTop();
            window.addEventListener('orientationchange', scrollTop, false);

            $('body>*').forEachNode(function(node) {
                var $node = $(node),
                    style = node.style;

                if ($node.hasClass('c6__cant-touch-this')) { return; }

                if ($node.css('position') === 'fixed') {
                    snapshot($node);

                    style.setProperty('position', 'relative', 'important');
                }

                if (node.parentNode.tagName === 'BODY') {
                    snapshot($node);

                    ['max-height', 'min-height', 'margin', 'padding'].forEach(function(prop) {
                        style.setProperty(prop, '0px', 'important');
                    });
                    style.setProperty('position', 'relative', 'important');
                    style.setProperty('overflow', 'hidden', 'important');
                }

            });
        } else {
            this.reset();
            window.removeEventListener('orientationchange', scrollTop, false);
        }
    };
};
