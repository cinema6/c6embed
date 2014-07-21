(function(win, readyState) {
    'use strict';

    var baseUrl = win.__C6_URL_ROOT__ || '//portal.cinema6.com',
        appJs = win.__C6_APP_JS__ || '//lib.cinema6.com/c6embed/v1/app.min.js',
        bools = ['preload', 'replaceImage'],
        config = (function(scripts) {
            var script = (readyState !== 'loading') ? (function() {
                    if (!window.c6 || !window.c6.pending) {
                        throw new Error([
                            'Cinema6 embed was loaded asynchronously without ',
                            'the async helper script!'
                        ].join(''));
                    }

                    return document.getElementById(window.c6.pending.shift());
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

                if (prop.charAt(0) === ':') {
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
        splash = new DOMElement('div', {
            class: 'c6brand__' + config.branding
        }),
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

    function splashOf(splashConfig) {
        return baseUrl +
            '/collateral/splash/' +
            splashConfig.style + '/' +
            splashConfig.ratio.join('-') + '.js';
    }

    function require(src, cb) {
        if (c6.requireCache[src]) { return cb.call(window, c6.requireCache[src]); }

        var iframe = document.createElement('iframe'),
            head = document.getElementsByTagName('head')[0],
            html = [
                '<script>',
                '(' + function(window) {
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

            cb.call(window, (c6.requireCache[src] = iframe.contentWindow.module.exports));
        }, false);
        /* jshint scripturl:true */
        iframe.setAttribute('src', 'javascript:\'' + html + '\';');
        /* jshint scripturl:false */

        head.appendChild(iframe);
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

    if (config.branding) {
        /* jshint expr:true */
        (c6.branding[config.branding] ||
            (c6.branding[config.branding] = new DOMElement('link', {
                id: 'c6-' + config.branding,
                rel: 'stylesheet',
                href: baseUrl + '/collateral/branding/' + config.branding + '/styles/splash.css'
            }, head))
        );
        /* jshint expr:false */
    }

    for (attr in containerStyles) {
        div.style[attr] = containerStyles[attr];
    }

    div.appendChild(splash);
    target.parentNode.insertBefore(div, target);
    if (target !== script) {
        target.style.display = 'none';
    }

    require('//lib.cinema6.com/twobits.js/v0.0.1-0-g7a19518/twobits.min.js', function(tb) {
        require(baseUrl + '/collateral/splash/splash.js', function(splashJS) {
            require(splashOf(config.splash), function(html) {
                var c6SplashImage = baseUrl + '/collateral/experiences/' + config.exp + '/splash',
                    splashImage = target.tagName === 'IMG' ?
                        target.getAttribute('src') : c6SplashImage;

                splash.innerHTML = html;
                tb.parse(splash)({
                    title: config.title,
                    splash: splashImage
                });
                settings.splashDelegate = splashJS(c6, settings, splash);

                if (config.preload) {
                    c6.loadExperience(settings, true);
                } else {
                    splash.addEventListener('mouseenter', handleMouseenter, false);
                }
            });
        });
    });
}(window, window.mockReadyState || document.readyState));
