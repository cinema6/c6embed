(function(win, readyState) {
    'use strict';

    var baseUrl = win.__C6_URL_ROOT__ || '//portal.cinema6.com',
        appJs = win.__C6_APP_JS__ || '//lib.cinema6.com/c6embed/v1/app.min.js',
        c6 = win.c6 = complete(win.c6 || {}, {
            embeds: [],
            app: null,
            requireCache: {},
            branding: {},
            gaAcctIdPlayer: 'UA-44457821-2',
            gaAcctIdEmbed: 'UA-44457821-3',
            loadExperience: function(embed, preload) {
                var app = this.app || (this.app = document.createElement('script')),
                    head = document.getElementsByTagName('head')[0];

                embed.load = true;
                embed.preload = !!preload;

                if (!app.parentNode) {
                    app.src = appJs;
                    head.appendChild(app);
                }
            }
        }),
        bools = ['preload', 'replaceImage'],
        config = (function(scripts) {
            var script = (readyState !== 'loading') ? (function() {
                var pending = c6.pending || [],
                    id = pending.shift();

                // There is a bug in IE10 and below where the document.readyState is reported
                // as "interactive" sooner than it should. In this circumstance, it could
                // appear that the embed script was loaded asynchronously, when in reality, it
                // was loaded synchronously. To try to make the embed as fool-proof as possible,
                // even if it appears as though the script was loaded asynchronously, we
                // fallback to trying to find the script tag if there are no pending async
                // embeds to load.
                if (!id) {
                    return scripts[scripts.length - 1];
                }

                return document.getElementById(id);
            }()) : scripts[scripts.length - 1],
                attributes = script.attributes,
                length = attributes.length,
                attribute,
                prop,
                value,
                result = {};

            function camelcase(word, index) {
                if (index === 0) { return word; }

                return word.charAt(0).toUpperCase() + word.substr(1);
            }

            while (length--) {
                attribute = attributes[length];
                prop = attribute.name.replace(/^data-/, '');
                value = attribute.value;

                if (prop.charAt(0) === '-' || prop.charAt(0) === ':') {
                    prop = prop.slice(1);
                    value = atob(value);
                }

                prop = prop.split('-').map(camelcase).join('');

                result[prop] = value;
            }

            length = bools.length;

            while (length--) {
                attribute = bools[length];

                result[attribute] = attribute in result;
            }

            result.script = script;
            result.responsive = !result.height;
            result.splash = (function() {
                var parts = result.splash.split(':');

                return {
                    style: parts[0],
                    ratio: parts[1].split('/').map(parseFloat)
                };
            }());

            return result;
        }(document.getElementsByTagName('script'))),
        head = document.getElementsByTagName('head')[0],
        script = config.script,
        target = config.replaceImage ? (function() {
            var ogImage = $('meta[property="og:image"]')[0],
                mainImageSrc = ogImage && ogImage.getAttribute('content'),
                mainImages = (mainImageSrc || []) && $('img[src="' + mainImageSrc + '"]');

            return mainImages.length === 1 ? mainImages[0] : script;
        }()) : script,
        responsiveStyles = {},
        staticStyles = {
            width: config.width,
            height: config.height
        },
        containerStyles = (config.width && config.height) ? staticStyles : responsiveStyles,
        div = new DOMElement('div', {
            class: 'c6embed-' + config.exp,
            style: 'position: relative'
        }),
        splash = new DOMElement('div'),
        attr = null,
        settings = c6.embeds[c6.embeds.push({
            embed: div,
            splashDelegate: {},
            load: false,
            preload: false,
            config: config
        }) - 1];

    function complete(object, defaults) {
        var key;

        for (key in defaults) {
            if (!object.hasOwnProperty(key)) {
                object[key] = defaults[key];
            }
        }
        return object;
    }

    function $() {
        return document.querySelectorAll.apply(document, arguments);
    }

    function DOMElement(tag, attrs, appendTo) {
        var element = document.createElement(tag),
            attr;

        for (attr in attrs) {
            element.setAttribute(attr, attrs[attr]);
        }

        if (appendTo) {
            appendTo.appendChild(element);
        }

        return element;
    }

    function handleMouseenter() {
        c6.loadExperience(settings, true);
        splash.removeEventListener('mouseenter', handleMouseenter, false);
    }

    function splashVisible() {
        var viewportWidth = window.innerWidth,
            viewportHeight = window.innerHeight,
            splashBounds = splash.getBoundingClientRect(),
            xOverlap = Math.max(0, Math.min(viewportWidth, splashBounds.left +
                splashBounds.width) - Math.max(0, splashBounds.left)),
            yOverlap = Math.max(0, Math.min(viewportHeight, splashBounds.top +
                splashBounds.height) - Math.max(0, splashBounds.top)),
            areaOverlap = xOverlap * yOverlap,
            splashArea = splashBounds.width * splashBounds.height;
        return areaOverlap/splashArea >= 0.5;
    }

    function visibleEvent() {
        var embedTracker = config.exp.replace(/e-/,'');
        /* jshint camelcase:false */
        window.__c6_ga__(embedTracker + '.send', 'event', {
            'eventCategory' : 'Display',
            'eventAction'   : 'Visible',
            'eventLabel'    : settings.config.title,
            'page'  : '/embed/' + settings.config.exp + '/',
            'title' : settings.config.title
        });
    }

    function viewChangeHandler() {
        if (splashVisible()) {
            window.removeEventListener('scroll', viewChangeHandler);
            window.removeEventListener('resize', viewChangeHandler);
            visibleEvent();
        }
    }

    function readyHandler() {
        if(document.readyState === 'complete') {
            document.removeEventListener('readystatechange', readyHandler);
            documentComplete();
        }
    }

    function documentComplete() {
        if (splashVisible()) {
            visibleEvent();
        } else {
            window.addEventListener('scroll', viewChangeHandler);
            window.addEventListener('resize', viewChangeHandler);
        }
    }

    function splashOf(splashConfig) {
        return baseUrl +
            '/collateral/splash/' +
            splashConfig.style + '/' +
            splashConfig.ratio.join('-') + '.js';
    }

    function require(srcs, cb) {
        var modules = [],
            loaded = 0;

        function load(module, index) {
            modules[index] = module;

            if (++loaded === srcs.length) {
                cb.apply(window, modules);
            }
        }

        srcs.forEach(function(src, index) {
            if (c6.requireCache[src]) { return load(c6.requireCache[src], index); }

            var iframe = document.createElement('iframe'),
                head = document.getElementsByTagName('head')[0],
                html = [
                    '<script>',
                    '(' + function(window) {
                        try {
                            // This hack is needed in order for the browser to send the
                            // "referer" header in Safari.
                            window.history.replaceState(null, null, window.document.referrer);
                        } catch(e) {}
                        window.Text = window.parent.Text;
                        window.module = {
                            exports: {}
                        };
                        window.exports = window.module.exports;
                    }.toString() + '(window))',
                    '</script>',
                    '<script src="' + src + '"></script>'
                ].join('\n');

            iframe.addEventListener('load', function() {
                var head = iframe.contentWindow.document.getElementsByTagName('head')[0];

                if (head.childNodes.length < 1) { return; }

                load((c6.requireCache[src] = iframe.contentWindow.module.exports), index);
            }, false);

            iframe.setAttribute('src', 'about:blank');
            head.appendChild(iframe);

            // The iframe must have its contents written using document.write(), otherwise the
            // browser will not send the "referer" header when requesting the script.
            iframe.contentWindow.document.write(html);
            iframe.contentWindow.document.close();
        });

        return modules;
    }

    /* Create GA Tracker */
    (function() {
        /* jshint sub:true, asi:true, expr:true, camelcase:false, indent:false */
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','__c6_ga__');
        /* jshint sub:false, asi:false, expr:false, indent:4 */

        var embedTracker = config.exp.replace(/e-/,'');

        window.__c6_ga__('create', c6.gaAcctIdPlayer, {
            'name'       : 'c6',
            'cookieName' : '_c6ga'
        });
        /*
        window.__c6_ga__('c6.require', 'displayfeatures');

        window.__c6_ga__('c6.set',{
            'dimension11' : window.location.href
        });
        */
        
        window.__c6_ga__('create', c6.gaAcctIdEmbed, {
            'name'       : embedTracker,
            'cookieName' : '_c6ga'
        });
        window.__c6_ga__(embedTracker + '.require', 'displayfeatures');

        window.__c6_ga__(embedTracker + '.set',{
            'dimension1' : window.location.href
        });

        window.__c6_ga__(embedTracker + '.send', 'pageview', {
            'page'  : '/embed/' + config.exp + '/',
            'title' : config.title,
            'sessionControl' : 'start'
        });
        /* jshint camelcase:true */
    }());

    for (attr in containerStyles) {
        div.style[attr] = containerStyles[attr];
    }

    div.appendChild(splash);
    target.parentNode.insertBefore(div, target);
    if (target !== script) {
        target.style.display = 'none';
    }

    if(document.readyState === 'complete') {
        documentComplete();
    } else {
        document.addEventListener('readystatechange', readyHandler);
    }

    require([
        '//lib.cinema6.com/twobits.js/v0.0.1-0-g7a19518/twobits.min.js',
        baseUrl + '/collateral/splash/splash.js',
        splashOf(config.splash),
        baseUrl + '/api/public/content/experience/' + config.exp + '.js'
    ], function(
        tb,
        splashJS,
        html,
        experience
    ) {
        var branding = experience.data.branding,
            c6SplashImage = baseUrl + experience.data.collateral.splash,
            splashImage = target.tagName === 'IMG' ?
                target.getAttribute('src') : c6SplashImage;

        if (branding) {
            /* jshint expr:true */
            (c6.branding[branding] ||
                (c6.branding[branding] = new DOMElement('link', {
                    id: 'c6-' + branding,
                    rel: 'stylesheet',
                    href: baseUrl + '/collateral/branding/' + branding + '/styles/splash.css'
                }, head))
            );
            /* jshint expr:false */
        }

        splash.innerHTML = html;
        splash.setAttribute('class', 'c6brand__' + branding);
        tb.parse(splash)({
            title: experience.data.title,
            splash: splashImage
        });
        settings.splashDelegate = splashJS(c6, settings, splash);
        settings.experience = experience;

        if (config.preload) {
            c6.loadExperience(settings, true);
        } else {
            splash.addEventListener('mouseenter', handleMouseenter, false);
        }
    });
}(window, window.mockReadyState || document.readyState));
