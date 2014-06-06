module.exports = function(deps) {
    'use strict';

    var $ = deps.$,
        window = deps.window;

    function scrollTop() {
        window.scrollTo(0, 0);
    }

    this.shrink = function(shouldShrink) {
        if (shouldShrink) {
            scrollTop();
            window.addEventListener('orientationchange', scrollTop, false);

            $('body>*').forEachNode(function(node) {
                var $node = $(node),
                    style = node.style;

                if ($node.hasClass('c6__cant-touch-this')) { return; }

                $node.createSnapshot();

                if ($node.css('position') === 'fixed') {
                    style.setProperty('position', 'relative', 'important');
                }

                if (node.parentNode.tagName === 'BODY') {
                    ['max-height', 'min-height', 'margin', 'padding'].forEach(function(prop) {
                        style.setProperty(prop, '0px', 'important');
                    });
                    style.setProperty('position', 'relative', 'important');
                    style.setProperty('overflow', 'hidden', 'important');
                }

                $node.addClass('c6__greetings-from-princeton-nj');
            });
        } else {
            $('.c6__greetings-from-princeton-nj').revertTo(0);
            window.removeEventListener('orientationchange', scrollTop, false);
        }
    };
};