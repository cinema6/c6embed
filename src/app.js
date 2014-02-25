module.exports = function(deps) {
    'use strict';

    var $document = deps.document,
        config = deps.config,
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

    function setFullscreen(element, bool) {
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
            style = element.style,
            prop;

        for (prop in fullscreenStyles) {
            style[prop] = bool ? fullscreenStyles[prop] : '';
        }

        $('body>*').forEachNode(function(node, parent) {
            var $node = $(node);

            if (parent.tagName === 'BODY') {
                $node.addClass('c6__play-that-funky-music-white-boy');
                $node.css({
                    position: 'relative',
                    height: '0px'
                });
                return;
            }

            if ($node.css('position') === 'fixed') {
                $node.addClass('c6__play-that-funky-music-white-boy');
                $node.css('position', 'relative');
            }
        });
    }

    /* SUPER-DUPER ASYNC PROMISE CHAIN STARTS HERE */
    function createFrame() {
        var iframe = $document.createElement('iframe'),
            $iframe = $(iframe),
            script = config.script,
            parent = script.parentNode;

        iframe.src = 'about:blank';
        iframe.width = config.width;
        iframe.height = config.height;
        iframe.scrolling = 'yes';
        iframe.style.border = 'none';
        $iframe.addClass('c6__cant-touch-this');

        return q.when(parent.insertBefore(iframe, script.nextSibling));
    }

    function fetchExperience(iframe) {
        return q.all([
            c6Db.find('experience', config.experienceId),
            iframe
        ]);
    }

    function fetchIndex(data) {
        var experience = data[0],
            iframe = data[1];

        return q.all([
            experience,
            iframe,
            c6Ajax.get(appUrl(experience.appUri) + '/index.html')
                .then(function(response) {
                    return response.data;
                })
        ]);
    }

    function loadApp(data) {
        /* jshint scripturl:true */
        var experience = data[0],
            iframe = data[1],
            indexHTML = data[2];

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

        iframe.setAttribute('data-srcdoc', indexHTML);
        iframe.src = 'javascript: window.frameElement.getAttribute(\'data-srcdoc\')';

        return [experience, iframe];
    }

    function communicateWithApp(data) {
        var experience = data[0],
            iframe = data[1];

        var session = experienceService.registerExperience(experience, iframe.contentWindow);

        session.once('ready', function() {
            session.on('fullscreenMode', function(fullscreen) {
                setFullscreen(iframe, fullscreen);
            });
        });

        return 'Success! Every went according to plan!';
    }

    /* Execute the chain */
    return createFrame()
        .then(fetchExperience)
        .then(fetchIndex)
        .then(loadApp)
        .then(communicateWithApp);
};
