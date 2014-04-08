module.exports = function(deps) {
    'use strict';

    var config = deps.config,
        q = deps.q,
        c6Db = deps.c6Db,
        c6Ajax = deps.c6Ajax,
        experienceService = deps.experience,
        $window = deps.window,
        $ = deps.$,
        browserInfo = deps.browserInfo;

    /* HELPER FUNCTIONS */
    function appUrl(url) {
        return config.expBase + '/' + url;
    }

    function scrollTop() {
        $window.scrollTo(0);
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
            originalStyles = $element.data('originalStyles'),
            prop;

        for (prop in fullscreenStyles) {
            $element.css(prop, bool ? fullscreenStyles[prop] : originalStyles[prop] || '');
        }

        // No scrolling magic if we are not a phone
        if (browserInfo.profile.device !== 'phone'){
            return;
        }
         
        if (bool) {
            $window.scrollTo(0);

            $window.addEventListener('orientationchange', scrollTop, false);

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
            $window.removeEventListener('orientationchange', scrollTop, false);

            $('.c6__play-that-funky-music-white-boy').revertTo(0);
        }
    }

    /* SUPER-DUPER ASYNC PROMISE CHAIN STARTS HERE */
    function createFrame() {
        var $script = config.$script,
            isResponsive = config.responsive,
            width = isResponsive ? '100%' : config.width,
            cssWidth = isResponsive ? width : width + 'px',
            $container,
            $iframe = $('<iframe src="about:blank" width="' +
                        width + '" height="0" scrolling="no" ' +
                        'style="border: none;" class="c6__cant-touch-this">'),
            $placeholder = $(
                '<div id="c6-placeholder" style=" width: ' + cssWidth + '; height: 7em; padding-top: 6em;  font-size: 16px; text-align: center; line-height: 1; font-style: normal; background: #f2f2f2; color: #898989">' +
                    'Preparing your Video Experience&#8230;' +
                '</div>'
            ),
            styles = {};

        if (isResponsive) {
            $container = $([
                '<div id="c6-responsive"',
                '    class="c6__cant-touch-this"',
                '    style="position: relative; width:100%; height:0; box-sizing: border-box; -moz-box-sizing: border-box; font-size: 16px;">'
            ].join(''));

            $iframe.css({
                position: 'absolute',
                top: 0,
                left: 0
            });

            $container.append($iframe);
        }

        $($iframe.prop('style')).forEach(function(style) {
            styles[style] = $iframe.prop('style')[style];
        });

        $iframe.data('originalStyles', styles);

        ($container || $iframe).insertAfter($script);
        $placeholder.insertAfter($script);

        return q.when([$iframe, $container, $placeholder]);
    }

    function fetchExperience(data) {
        data.unshift(c6Db.find('experience', config.experienceId));

        return q.all(data);
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
        var experience = data[0];

        data.unshift(c6Ajax.get(appUrl(experience.appUri) + '/index.html')
            .then(function(response) {
                return response.data;
            }));

        return q.all(data);
    }

    function loadApp(data) {
        /* jshint scripturl:true */
        var indexHTML = data[0],
            experience = data[1],
            $iframe = data[2];

        var baseTag = '<base href="' + appUrl(experience.appUri) + '/">',
            pushState = '<script>window.history.replaceState({}, "parent", window.parent.location.href);</script>',
            matchHead = indexHTML.match(/<head>/),
            headEndIndex = matchHead.index + matchHead[0].length;

        // It is very important for IE <= 10 that an event listener
        // for "load" is placed on the window. Really, we don't
        // even need to wait for the load before proceeding, but
        // I figured it couldn't hurt to wait. If the "load"
        // handler is removed those versions of IE will fail in
        // strange ways to do postMessage communication.
        function waitForLoad(object) {
            var deferred = q.defer();

            object.onload = function() {
                deferred.resolve(object);
            };
            object.onerror = function() {
                deferred.reject(object);
            };

            return deferred.promise;
        }

        indexHTML = [
            indexHTML.slice(0, headEndIndex),
            baseTag,
            !!$window.history.replaceState ?
                pushState : '',
            indexHTML.slice(headEndIndex)
        ].join('');

        $iframe.attr('data-srcdoc', indexHTML);
        $iframe.prop('src', 'javascript: window.frameElement.getAttribute(\'data-srcdoc\')');

        data.push(waitForLoad($iframe.prop('contentWindow')));

        return data;
    }

    function communicateWithApp(data) {
        var experience = data[1],
            $iframe = data[2],
            $container = data[3],
            $placeholder = data[4];

        // It is also important that the window object is accessed through the iframe here, even
        // though it is technically accessible as the fourth member of the data array.
        var session = experienceService.registerExperience(experience, $iframe.prop('contentWindow'));

        session.once('ready', function() {
            $placeholder.remove();
            $iframe.prop('height', config.responsive ? '100%' : config.height);

            session.on('fullscreenMode', function(fullscreen) {
                setFullscreen($iframe, fullscreen);
            });
        });

        session.on('responsiveStyles', function(styles) {
            if ($container) {
                $container.css(styles);
            }
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
