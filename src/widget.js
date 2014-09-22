(function($window, $document/*, readyState*/) {
    'use strict';

    //TODO: Handle multiple widgets against same placementId?
    //TODO: Handle widget + one or more embeds on same page
    //
    var baseUrl = $window.__C6_URL_ROOT__ || '//portal.cinema6.com',
        appJs   = $window.__C6_APP_JS__ || '//lib.cinema6.com/c6embed/v1/app.min.js',
        c6 = $window.c6 = complete($window.c6 || {}, {
            app: null,
            embeds: [],
            branding: {},
            requireCache: {},
            widgetContentCache: {},
            gaAcctIdPlayer: 'UA-44457821-2',
            gaAcctIdEmbed: 'UA-44457821-3',

            loadExperience: function(embed, preload) {
                embed.load = true;
                embed.preload = !!preload;

                /* jshint expr:true */
                this.app || (this.app = new DOMElement('script', {
                    src: appJs
                }, $document.head));
            },

            addReel: function(expId, placementId, clickUrl) {
                return (this.widgetContentCache[placementId] ||
                    (this.widgetContentCache[placementId] = [])).push({
                        expId: expId,
                        clickUrl: clickUrl
                    });
            },

            createWidget: createWidget
        });

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
            .map(function(key) {
                return [key, object[key]]
                    .map(encodeURIComponent)
                    .join('=');
            })
            .join('&');
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

    function createWidget(config) {
        var container = (function() {
            var id = genRandomId('c6_');

            /* jshint evil:true */
            $document.write(
                '<div id="' + id + '" class="' +
                    ['c6_widget', 'c6brand__' + config.branding].join(' ') +
                '"></div>'
            );
            /* jshint evil:false */

            return $document.getElementById(id);
        }());

        loadBrandingStyles(config.branding);

        require([
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

            function MiniReelConfig(experience, splash) {
                this.load = false;
                this.preload = false;

                this.embed = splash;
                this.splashDelegate = splashJS(c6, this, splash);
                this.experience = experience;

                this.config = {
                    exp: experience.id,
                    title: experience.data.title
                };
            }


            adtech.config.page = {
                network: '5473.1',
                server: 'adserver.adtechus.com',
                enableMultiAd: true
            };

            adtech.config.placements[config.placementId] = {
                adContainerId: 'ad',
                complete: function() {
                    require(c6.widgetContentCache[config.placementId].map(function(item) {
                        return baseUrl + '/api/public/content/experience/' + item.expId + '.js?' +
                            toQueryParams({
                                context: 'mr2',
                                branding: config.branding,
                                placementId: config.placementId
                            });
                    }), function() {
                        Array.prototype.slice.call(arguments)
                            .forEach(function(experience, index) {
                                var splash = splashPages[index],
                                    embedTracker = experience.id.replace(/^e-/, '');

                                loadBrandingStyles(experience.data.branding);
                                splash.className += ' c6brand__' + experience.data.branding;

                                twobits.parse(splash)({
                                    title: experience.data.title,
                                    splash: baseUrl + experience.data.collateral.splash
                                });

                                c6.embeds.push(new MiniReelConfig(experience, splash));

                                /* jshint camelcase:false */
                                $window.__c6_ga__('create', c6.gaAcctIdEmbed, {
                                    'name'       : embedTracker,
                                    'cookieName' : '_c6ga'
                                });
                                $window.__c6_ga__(embedTracker + '.require', 'displayfeatures');

                                $window.__c6_ga__(embedTracker + '.set',{
                                    'dimension1' : $window.location.href
                                });

                                $window.__c6_ga__(embedTracker + '.send', 'pageview', {
                                    'page'  : '/embed/' + experience.id + '/',
                                    'title' : experience.data.title,
                                    'sessionControl' : 'start'
                                });
                                /* jshint camelcase:true */
                            });
                    });
                }
            };

            splashPages.forEach(function() {
                adtech.enqueueAd(parseInt(config.placementId));
            });

            adtech.executeQueue({
                multiAd: {
                    disableAdInjection: true,
                    readyCallback: function() {
                        adtech.showAd(config.placementId);
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

    require.config = {
        paths: {
            adtech: 'http://aka-cdn.adtechus.com/dt/common/DAC.js'
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
