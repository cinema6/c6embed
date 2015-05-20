module.exports = function(win, readyState) {
    'use strict';

    var importScripts = require('../../lib/importScripts');

    var baseUrl = win.__C6_URL_ROOT__ || '//portal.cinema6.com',
        appJs = win.__C6_APP_JS__ || '//lib.cinema6.com/c6embed/v1/app.min.js',
        loadStart = new Date().getTime(),
        c6 = win.c6 = complete(win.c6 || {}, {
            embeds: [],
            app: null,
            branding: {},
            gaAcctIdPlayer: (function(acc,mi,mx){
                return acc+'-'+parseInt(((Math.random()*999999999)%(mx-mi+1))+mi,10);
            }('UA-44457821',31,35)),
            gaAcctIdEmbed: (function(acc,mi,mx){
                return acc+'-'+parseInt(((Math.random()*999999999)%(mx-mi+1))+mi,10);
            }('UA-44457821',6,30)),
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
        bools = ['preload', 'autoLaunch'],
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
            result.context = 'embed';
            result.container = (result.container || 'embed');
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
        }(
            Array.prototype.slice.call(document.getElementsByTagName('script'))
                .filter(function(script) {
                    return 'data-exp' in script.attributes;
                })
        )),
        head = document.getElementsByTagName('head')[0],
        script = config.script,
        target = (config.replaceImage && $(config.replaceImage)[0]) || script,
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
            standalone: false,
            playerVersion: parseInt(config.playerVersion, 10) || 1,
            load: false,
            preload: false,
            autoLaunch: config.autoLaunch,
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
    
    function handleClick() {
        settings.config.showStartTime= (new Date()).getTime();
        settings.config.context= 'embed';
        /* jshint camelcase:false */
        var embedTracker = config.exp.replace(/e-/,'');
        window.__c6_ga__(embedTracker + '.send', 'event', {
            'eventCategory' : 'Display',
            'eventAction'   : 'AttemptShow',
            'eventLabel'    : settings.config.title
        });
        /* jshint camelcase:true */
        splash.removeEventListener('click', handleClick, false);
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
        /* jshint camelcase:false */
        var embedTracker = config.exp.replace(/e-/,'');
        window.__c6_ga__(embedTracker + '.send', 'event', {
            'eventCategory' : 'Display',
            'eventAction'   : 'Visible',
            'eventLabel'    : settings.config.title
        });
        /* jshint camelcase:true */
    }

    function viewChangeHandler() {
        if (splashVisible()) {
            window.removeEventListener('scroll', viewChangeHandler);
            window.removeEventListener('resize', viewChangeHandler);
            visibleEvent();
        }
    }

    function splashOf(splashConfig) {
        return baseUrl +
            '/collateral/splash/' +
            splashConfig.style + '/' +
            splashConfig.ratio.join('-') + '.js';
    }

    for (attr in containerStyles) {
        div.style[attr] = containerStyles[attr];
    }

    div.appendChild(splash);
    target.parentNode.insertBefore(div, target);
    if (target !== script) {
        target.style.display = 'none';
    }

    var requireStart = (new Date()).getTime(), queryParams;
    queryParams = (function (object) {
        return Object.keys(object)
            .filter(function(key) {
                return !!object[key];
            })
            .map(function(key) {
                return [key, object[key]]
                    .map(encodeURIComponent)
                    .join('=');
            })
            .join('&');
    }({
        container: config.container,
        campaign: config.campaign,
        preview: config.preview,
        branding: config.branding,
        placementId: config.adPlacementId,
        wildCardPlacement: config.wp
    }));
    importScripts([
        '//lib.cinema6.com/twobits.js/v0.0.1-0-g7a19518/twobits.min.js',
        baseUrl + '/collateral/splash/splash.js',
        splashOf(config.splash),
        baseUrl + '/api/public/content/experience/' + config.exp + '.js?' + queryParams
    ], function(
        tb,
        splashJS,
        html,
        experience
    ) {
        if (c6.embeds[0].experience) {
            experience.data.branding = c6.embeds[0].experience.data.branding;
        }

        /* Create GA Tracker */
        (function() {
            /* jshint sub:true, asi:true, expr:true, camelcase:false, indent:false */
            (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
            })(window,document,'script','//www.google-analytics.com/analytics.js','__c6_ga__');
            /* jshint sub:false, asi:false, expr:false, indent:4 */

            var embedTracker = config.exp.replace(/e-/,''),
                pagePath = (function(e,q){
                    var r='/embed/'+e+'/',p,qf=[];
                    for (p in q){ if(q[p]){qf.push(p + '=' + q[p]);} }
                    if (qf.length){ r += '?' + qf.join('&'); }
                    return r;
                }(config.exp, {
                    cx: config.context,
                    ct: config.container,
                    bd: experience.data.branding,
                    al: config.autoLaunch
                }));

            window.__c6_ga__('create', c6.gaAcctIdPlayer, {
                'name'       : 'c6',
                'cookieName' : '_c6ga'
            });

            window.__c6_ga__('create', c6.gaAcctIdEmbed, {
                'name'       : embedTracker,
                'cookieName' : '_c6ga'
            });
            window.__c6_ga__(embedTracker + '.require', 'displayfeatures');

            window.__c6_ga__(embedTracker + '.set',{
                'dimension1' : window.location.href,
                'page'  : pagePath,
                'title' : config.title
            });

            window.__c6_ga__(embedTracker + '.send', 'pageview', {
                'sessionControl' : 'start'
            });
            /* jshint camelcase:true */
        }());

        try {
            var branding = experience.data.branding,
                c6SplashImage = baseUrl + experience.data.collateral.splash,
                splashImage = target.tagName === 'IMG' ?
                    target.getAttribute('src') : c6SplashImage,
                embedTracker = config.exp.replace(/e-/,'');

            /* jshint camelcase:false */
            if (experience && experience.data) {
                window.__c6_ga__(embedTracker + '.send', 'timing', {
                    'timingCategory' : 'API',
                    'timingVar'      : 'fetchExperience',
                    'timingValue'    : ((new Date()).getTime() - requireStart),
                    'timingLabel'    : 'c6'
                });
            }
            /* jshint camelcase:true */

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

            if (splashVisible()) {
                visibleEvent();
            } else {
                window.addEventListener('scroll', viewChangeHandler);
                window.addEventListener('resize', viewChangeHandler);
            }

            if (config.autoLaunch) {
                settings.config.showStartTime = (new Date()).getTime();
            }

            if (config.preload || config.autoLaunch) {
                c6.loadExperience(settings, true);
            } else {
                splash.addEventListener('mouseenter', handleMouseenter, false);
            }

            splash.addEventListener('click', handleClick, false);

            win.addEventListener('beforeunload', function() {
                var loaded = !!(settings.state && settings.state.get('active'));

                /* jshint camelcase: false */
                window.__c6_ga__(embedTracker + '.send', 'timing', {
                    'timingCategory' : 'API',
                    'timingVar'      : loaded ? 'closePageAfterLoad' : 'closePageBeforeLoad',
                    'timingValue'    : (new Date().getTime() - loadStart),
                    'timingLabel'    : 'c6'
                });
            }, false);
        }
        catch (err) {
            /* jshint camelcase:false */
            var embedTracker = settings.config.exp.replace(/e-/,'');
            window.__c6_ga__(embedTracker + '.send', 'event', {
                'eventCategory' : 'Error',
                'eventAction'   : 'Embed',
                'eventLabel'    : err.message
            });
            /* jshint camelcase:true */
            throw err;
        }
    });
};
