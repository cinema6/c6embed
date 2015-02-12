(function($window, $document/*, readyState*/) {
    'use strict';

    /**
     * Initialize some default configuration. Set up the c6 object (if it still needs to be set
     * up.)
     */
    var baseUrl = $window.__C6_URL_ROOT__ || '//portal.cinema6.com',
        appJs   = $window.__C6_APP_JS__ || '//lib.cinema6.com/c6embed/v1/app.min.js',
        adNetwork = $window.__C6_AD_NETWORK__ || '5473.1',
        adServer  = $window.__C6_AD_SERVER__  || 'adserver.adtechus.com',
        c6 = $window.c6 = complete($window.c6 || {}, {
            app: null,
            embeds: [],
            branding: {},
            requireCache: {},
            widgetContentCache: {},
            gaAcctIdPlayer: (function(acc,mi,mx){
                return acc+'-'+parseInt(((Math.random()*999999999)%(mx-mi+1))+mi,10);
            }('UA-44457821',31,35)),
            gaAcctIdEmbed: (function(acc,mi,mx){
                return acc+'-'+parseInt(((Math.random()*999999999)%(mx-mi+1))+mi,10);
            }('UA-44457821',6,30)),

            loadExperience: function(embed, preload) {
                embed.load = true;
                embed.preload = !!preload;

                /* jshint expr:true */
                this.app || (this.app = new DOMElement('script', {
                    src: appJs
                }, $document.head));
            },

            addReel: function(expId, placementId, clickUrl, adId) {
                return (this.widgetContentCache[placementId] ||
                    (this.widgetContentCache[placementId] = [])).push({
                        expId: expId,
                        clickUrl: clickUrl,
                        adId: adId
                    });
            },

            createWidget: createWidget
        });

    /**********************************************************************************************
     * Helper/Utility Functions
     *********************************************************************************************/
    function require(srcs, cb) {
        var modules = [],
            loaded = 0,
            config = require.config || {},
            paths = config.paths || {},
            shims = config.shim || {};

        function load(module, index) {
            modules[index] = module;

            if (++loaded === srcs.length) {
                cb.apply(window, modules);
            }
        }

        srcs.forEach(function(_src, index) {
            var src = paths[_src] || _src,
                shim = shims[_src] || {},
                exports = shim.exports,
                onCreateFrame = shim.onCreateFrame || function() {};

            if (c6.requireCache[src]) { return load(c6.requireCache[src], index); }

            var iframe = new DOMElement('iframe', {
                    src: 'about:blank',
                    'data-module': _src
                }),
                head = document.getElementsByTagName('head')[0],
                html = [
                    '<script>',
                    '(' + function(window) {
                        try {
                            // This hack is needed in order for the browser to send the
                            // "referer" header in Safari.
                            window.history.replaceState(null, null, window.parent.location.href);
                        } catch(e) {}
                        window.Text = window.parent.Text;
                        window.module = {
                            exports: {}
                        };
                        window.exports = window.module.exports;
                    }.toString() + '(window))',
                    '</script>',
                    '<script>(' + onCreateFrame.toString() + '(window))</script>',
                    '<script src="' + src + '"></script>'
                ].join('\n');

            iframe.addEventListener('load', function() {
                var frameWindow = iframe.contentWindow,
                    head = frameWindow.document.getElementsByTagName('head')[0];

                if (head.childNodes.length < 1) { return; }

                load(
                    (c6.requireCache[src] =
                        (exports ? frameWindow[exports] : frameWindow.module.exports)
                    ),
                    index
                );
            }, false);

            head.appendChild(iframe);

            // The iframe must have its contents written using document.write(), otherwise the
            // browser will not send the "referer" header when requesting the script.
            iframe.contentWindow.document.write(html);
            iframe.contentWindow.document.close();
        });

        return modules;
    }

    c6.require = require;

    function complete(object, defaults) {
        var key;

        for (key in defaults) {
            if (!object.hasOwnProperty(key)) {
                object[key] = defaults[key];
            }
        }
        return object;
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

    function toQueryParams(object) {
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
    }

    function elementIsOnScreen(element) {
        var elementBounds = element.getBoundingClientRect(),
            windowBounds = {
                top: 0,
                right: $window.innerWidth,
                bottom: $window.innerHeight,
                left: 0,
                width: $window.innerWidth,
                height: $window.innerHeight
            };

        return elementBounds.top < windowBounds.bottom &&
            elementBounds.bottom > windowBounds.top &&
            elementBounds.right > windowBounds.left &&
            elementBounds.left < windowBounds.right;
    }

    function loadBrandingStyles(branding) {
        if (!branding) { return null; }

        return (c6.branding[branding] ||
            (c6.branding[branding] = new DOMElement('link', {
                id: 'c6-' + branding,
                rel: 'stylesheet',
                href: baseUrl + '/collateral/branding/' + branding + '/styles/splash.css'
            }, $document.head))
        );
    }

    function genRandomId(result,len){
        result  = result || '';
        len     = len || 10;
        while(len-- > 0){
            var n = (Math.floor(Math.random() * 999999999)) % 35;
            result += String.fromCharCode(((n <= 25) ? 97 : 22) + n);
        }
        return result;
    }

    /**********************************************************************************************
     * Function to Create an MR2 Embed.
     *
     * This get attached to the c6 object as c6.createWidget().
     *********************************************************************************************/
    function createWidget(config) {
        var container = (function() {
            var id = genRandomId('c6_');

            /* jshint evil:true */
            $document.write(
                '<div id="' + id + '" class="' +
                    ['c6_widget', 'c6brand__' + config.branding].join(' ') +
                '" style="display: none;"></div>'
            );
            /* jshint evil:false */

            return $document.getElementById(id);
        }());
        config.container = config.container || 'mr2';
        loadBrandingStyles(config.branding);

        c6.require([
            'adtech',
            '//lib.cinema6.com/twobits.js/v0.0.1-0-g7a19518/twobits.min.js',
            baseUrl + '/collateral/splash/splash.js',
            baseUrl + '/' + config.template + '.js'
        ], function(
            adtech,
            twobits,
            splashJS,
            template
        ) {
            var splashPages = (function() {
                container.innerHTML = template;

                return Array.prototype.slice.call(
                    container.querySelectorAll('.c6-mr2__mr-splash')
                );
            }());

            function MiniReelConfig(experience, splash, trackingUrl, adId) {
                var self = this;
                this.load = false;
                this.preload = false;

                this.standalone = false;

                this.embed = splash;
                this.splashDelegate = splashJS({
                    loadExperience: function() {
                        // Fire tracking pixel when this MiniReel is opened.
                        (new DOMElement('img', {
                            src: trackingUrl
                        }));

                        self.config.showStartTime = (new Date()).getTime();
                        return c6.loadExperience.apply(c6, arguments);
                    }
                }, this, splash);
                this.experience = experience;

                this.config = {
                    exp: experience.id,
                    title: experience.data.title,
                    context: 'mr2',
                    startPixel: config.startPixels && config.startPixels.join(' '),
                    countPixel: config.countPixels && config.countPixels.join(' '),
                    launchPixel: config.launchPixels && config.launchPixels.join(' '),
                    container: config.container,
                    adId : adId
                };
            }

            /**
             * This function will populate the MR2 widget with MiniReels. It is called by adtech
             * after all of the MiniReels have been pulled down from the ad server.
             */
            function populateWidget(configs) {
                var queryParams = toQueryParams({
                    container: config.container,
                    branding: config.branding,
                    placementId: config.adPlacementId,
                    wildCardPlacement: config.wp
                }),
                requireStart = (new Date()).getTime();

                c6.require(configs.map(function(item) {
                    return baseUrl + '/api/public/content/experience/' + item.expId + '.js?' +
                        queryParams;
                }), function() {
                    var experiences = Array.prototype.slice.call(arguments)
                        .filter(function(experience) {
                            return !!experience.data;
                        });
                    var minireels = experiences.map(function(experience, index) {
                        return new MiniReelConfig(
                            experience,
                            splashPages[index],
                            configs[index].clickUrl,
                            configs[index].adId
                        );
                    });
                    var extraSplashPages = (minireels.length === splashPages.length) ?
                        [] : splashPages.slice(minireels.length - splashPages.length);

                    function handleViewportShift() {
                        if (elementIsOnScreen(container)) {
                            preloadWidget();
                            $window.removeEventListener('scroll', handleViewportShift, false);
                            $window.removeEventListener('resize', handleViewportShift, false);
                        }
                    }

                    function preloadWidget() {
                        minireels.forEach(function(embed) {
                            c6.loadExperience(embed, true);
                        });
                    }

                    c6.embeds.push.apply(c6.embeds, minireels);

                    minireels.forEach(function(minireel) {
                        var experience = minireel.experience,
                            pageBranding = c6.embeds[0].experience.data.branding,
                            splash = minireel.embed,
                            embedTracker = experience.id.replace(/^e-/, ''),
                            pagePath = (function(e,q){
                                var r='/embed/'+e+'/',p,qf=[];
                                for (p in q){ if(q[p]){qf.push(p + '=' + q[p]);} }
                                if (qf.length){ r += '?' + qf.join('&'); }
                                return r;
                            }(experience.id,{
                                ct:minireel.config.container,
                                cx:minireel.config.context,
                                gp:minireel.config.adId,
                                bd:pageBranding
                            }));

                        if (!(/lightbox/).test(experience.data.mode)) {
                            experience.data.mode = 'lightbox';
                        }

                        experience.data.branding = pageBranding;

                        loadBrandingStyles(experience.data.branding);
                        splash.className += ' c6brand__' + experience.data.branding;

                        twobits.parse(splash)({
                            title: experience.data.title,
                            splash: baseUrl + experience.data.collateral.splash
                        });

                        /* jshint camelcase:false */
                        $window.__c6_ga__('create', c6.gaAcctIdEmbed, {
                            'name'       : embedTracker,
                            'cookieName' : '_c6ga'
                        });
                        $window.__c6_ga__(embedTracker + '.require', 'displayfeatures');

                        $window.__c6_ga__(embedTracker + '.set',{
                            'page'  : pagePath,
                            'title' : experience.data.title,
                            'dimension1' : $window.location.href
                        });

                        $window.__c6_ga__(embedTracker + '.send', 'pageview', {
                            'sessionControl' : 'start'
                        });

                        $window.__c6_ga__(embedTracker + '.send', 'timing', {
                            'timingCategory' : 'API',
                            'timingVar'      : 'fetchExperience',
                            'timingValue'    : ((new Date()).getTime() - requireStart),
                            'timingLabel'    : 'c6'
                        });
                        /* jshint camelcase:true */
                    });

                    extraSplashPages.forEach(function(splash) {
                        splash.style.display = 'none';
                    });

                    container.style.display = 'inline-block';

                    if (elementIsOnScreen(container)) {
                        preloadWidget();
                    } else {
                        $window.addEventListener('scroll', handleViewportShift, false);
                        $window.addEventListener('resize', handleViewportShift, false);
                    }
                });
            }

            adtech.config.page = {
                network: adNetwork,
                server: adServer,
                enableMultiAd: true
            };

            adtech.config.placements[config.id] = {
                adContainerId: 'ad',
                complete: function() {
                    return populateWidget(
                        c6.widgetContentCache[config.id]
                            .splice(0, splashPages.length)
                    );
                }
            };

            // Request a MiniReel for every MiniReel placeholder in the widget
            splashPages.forEach(function() {
                adtech.enqueueAd(parseInt(config.id));
            });

            adtech.executeQueue({
                multiAd: {
                    disableAdInjection: true,
                    readyCallback: function() {
                        adtech.showAd(config.id);
                    }
                }
            });
        });
    }

    /* Create GA Tracker */
    (function() {
        /* jshint sub:true, asi:true, expr:true, camelcase:false, indent:false */
        (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
        (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
        m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
        })(window,document,'script','//www.google-analytics.com/analytics.js','__c6_ga__');
        /* jshint sub:false, asi:false, expr:false, indent:4 */

        window.__c6_ga__('create', c6.gaAcctIdPlayer, {
            'name'       : 'c6',
            'cookieName' : '_c6ga'
        });
        /* jshint camelcase:true */
    }());

    c6.require.config = {
        paths: {
            adtech: '//aka-cdn.adtechus.com/dt/common/DAC.js'
        },
        shim: {
            adtech: {
                exports: 'ADTECH',
                onCreateFrame: function(window) {
                    var document = window.document;

                    window.c6 = window.parent.c6;

                    /* jshint evil:true */
                    document.write('<div id="ad"></div>');
                }
            }
        }
    };
}(window, document, window.mockReadyState || document.readyState));
