module.exports = function(deps) {
    'use strict';

    var config = deps.config,
        q = deps.q,
        c6Db = deps.c6Db,
        c6Ajax = deps.c6Ajax,
        experienceService = deps.experience,
        $window = deps.window,
        $ = deps.$;

    /* HELPER FUNCTIONS */
    function appUrl(url) {
        return (config.debug ?
            'http://s3.amazonaws.com/c6.dev/content/' :
            'http://cinema6.com/experiences/') + url;
    }

    function setFullscreen($element, bool) {
        var fullscreenStyles = {
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 999999999999999
            },
            prop;

        for (prop in fullscreenStyles) {
            $element.css(prop, bool ? fullscreenStyles[prop] : '');
        }

        if (bool) {
            $('body>*').forEachNode(function(node, parent) {
                var $node = $(node),
                    style = node.style;

                if ($node.hasClass('c6__cant-touch-this')) {
                    return;
                }

                if (parent.tagName === 'BODY') {
                    $node.createSnapshot();
                    $node.addClass('c6__play-that-funky-music-white-boy');
                    style.setProperty('position', 'relative', 'important');
                    style.setProperty('height', '0px', 'important');
                    style.setProperty('overflow', 'hidden', 'important');
                    return;
                }

                if ($node.css('position') === 'fixed') {
                    $node.createSnapshot();
                    $node.addClass('c6__play-that-funky-music-white-boy');
                    style.setProperty('position', 'relative', 'important');
                }
            });
        } else {
            $('.c6__play-that-funky-music-white-boy').revertTo(0);
        }
    }

    /* SUPER-DUPER ASYNC PROMISE CHAIN STARTS HERE */
    function createFrame() {
        var $script = config.$script,
            isResponsive = config.responsive,
            width = isResponsive ? '100%' : config.width,
            height = isResponsive ? '100%' : config.height,
            $container,
            $iframe = $('<iframe src="about:blank" width="' +
                        width + '" height="' + height +
                        '" scrolling="yes" style="border: none;" class="c6__cant-touch-this">');

        if (isResponsive) {
            $container = $([
                '<div id="c6-responsive"',
                '    class="c6__cant-touch-this"',
                '    style="position: relative; width:100%; height:0; box-sizing: border-box; -moz-box-sizing: border-box;">'
            ].join(''));

            $iframe.css({
                position: 'absolute',
                top: 0,
                left: 0
            });

            $container.append($iframe);
        }

        ($container || $iframe).insertAfter($script);

        return q.when([$iframe, $container]);
    }

    function fetchExperience(data) {
        var $iframe = data[0],
            $container = data[1];

        return q.all([
            c6Db.find('experience', config.experienceId),
            $iframe,
            $container
        ]);
    }

    function transformExperience(data) {
        var experience = data[0];

        var img = experience.img,
            key;

        for (key in img) {
            img[key] = img[key] && config.collateralBase + '/' + img[key];
        }

        return data;
    }

    function fetchIndex(data) {
        var experience = data[0],
            $iframe = data[1],
            $container = data[2];

        return q.all([
            experience,
            $iframe,
            $container,
            c6Ajax.get(appUrl(experience.appUri) + '/index.html')
                .then(function(response) {
                    return response.data;
                })
        ]);
    }

    function loadApp(data) {
        /* jshint scripturl:true */
        var experience = data[0],
            $iframe = data[1],
            $container = data[2],
            indexHTML = data[3];

        var baseTag = '<base href="' + appUrl(experience.appUri) + '/">',
            pushState = '<script>window.history.replaceState({}, "parent", window.parent.location.href);</script>',
            matchHead = indexHTML.match(/<head>/),
            headEndIndex = matchHead.index + matchHead[0].length;

        indexHTML = [
            indexHTML.slice(0, headEndIndex),
            baseTag,
            !!$window.history.replaceState ?
                pushState : '',
            indexHTML.slice(headEndIndex)
        ].join('');

        $iframe.attr('data-srcdoc', indexHTML);
        $iframe.prop('src', 'javascript: window.frameElement.getAttribute(\'data-srcdoc\')');

        return [experience, $iframe, $container];
    }

    function communicateWithApp(data) {
        var experience = data[0],
            $iframe = data[1],
            $container = data[2];

        var session = experienceService.registerExperience(experience, $iframe.prop('contentWindow'));

        session.once('ready', function() {
            session.on('fullscreenMode', function(fullscreen) {
                setFullscreen($iframe, fullscreen);
            });

            session.on('responsiveStyles', function(styles) {
                if ($container) {
                    $container.css(styles);
                }
            });
        });

        return 'Success! Every went according to plan!';
    }

    /* Execute the chain */
    return createFrame()
        .then(fetchExperience)
        .then(transformExperience)
        .then(fetchIndex)
        .then(loadApp)
        .then(communicateWithApp);
};
