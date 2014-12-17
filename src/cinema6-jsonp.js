(function() {
    'use strict';

    /**
     * Initialize some default configuration. Set up the c6 object (if it still needs to be set
     * up.)
     */
    var baseUrl = window.__C6_URL_ROOT__ || '//portal.cinema6.com',
        appJs   = window.__C6_APP_JS__ || '//lib.cinema6.com/c6embed/v1/app.min.js',
        c6 = window.c6 = complete(window.c6 || {}, {
            app: null,
            embeds: [],
            requireCache: {},
            widgetContentCache: {},
            gaAcctIdPlayer: 'UA-44457821-2',
            gaAcctIdEmbed: (function(acc,mi,mx){
                return acc+'-'+parseInt(((Math.random()*999999999)%(mx-mi+1))+mi,10);
            }('UA-44457821',6,30)),

            require: function(srcs, cb) {
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
            },

            loadExperience: function(minireel, preload) {
                minireel.load = true;
                minireel.preload = !!preload;

                /* jshint expr:true */
                this.app || (this.app = new DOMElement('script', {
                    src: appJs
                }, document.head));
            },
            addReel: function(id, placement, clickUrl) {
                var cache = this.widgetContentCache;

                (cache[placement] || (cache[placement] = [])).push({
                    expId: id,
                    clickUrl: clickUrl
                });
            },
            loadExperienceById: function(id) {
                var config = this.embeds.reduce(function(result, config) {
                    return config.experience.id === id ? config : result;
                }, null);

                new DOMElement('img', {
                    src: config.trackingUrl
                });

                return this.loadExperience(config);
            }
        }),
        require = c6.require,
        params = complete((function() {
            var jsonpScripts = Array.prototype.slice.call(document.getElementsByTagName('script'))
                .filter(function(script) {
                    return (/\/cinema6-jsonp(.min)?\.js/).test(script.src);
                });

            return getParams(jsonpScripts[jsonpScripts.length - 1].src);
        }()), { count: 1 }),
        container = (function() {
            var id = 'c6-lightbox-container';

            return document.getElementById(id) || new DOMElement('div', {
                id: id
            }, document.body);
        }()),
        callback = window[params.callback];

    /**********************************************************************************************
     * Helper/Utility Functions
     *********************************************************************************************/
    function getParams(url) {
        return (url.match(/\?(.*)$/) || [null, ''])[1]
            .split('&')
            .map(function(pair) {
                return pair.split('=').map(decodeURIComponent);
            })
            .reduce(function(params, pair) {
                params[pair[0]] = parseInt(pair[1]) || pair[1];
                return params;
            }, {});
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

    function loop(times, cb) {
        var i = 0;

        for ( ; i < times; i++) {
            cb(i);
        }
    }

    /**********************************************************************************************
     * Represents a MiniReel that has been loaded. These will go in the c6.embeds array.
     *********************************************************************************************/
    function MiniReelConfig(experience, trackingUrl) {
        this.load = false;
        this.preload = false;

        this.standalone = false;

        this.embed = container;
        this.splashDelegate = {};
        this.experience = experience;

        this.trackingUrl = trackingUrl;
        this.config = {
            exp: experience.id,
            title: experience.data.title
        };
    }

    /*
     * This function populates the c6.embeds array with configuration and calls back the JSONP
     * function with an array of MiniReel data objects.
     *
     * This is called by ADTECH after all of the MiniReels have been fetched.
     */
    function sendResponse(items) {
        var query = toQueryParams({
            context: 'mr2',
            branding: params.branding,
            placementId: params.adPlacementId,
            container: params.src
        });

        require(items.map(function(item) {
            return baseUrl + '/api/public/content/experience/' + item.expId + '.js?' + query;
        }), function() {
            var experiences = Array.prototype.slice.call(arguments);

            c6.embeds.push.apply(c6.embeds, experiences.map(function(experience, index) {
                return new MiniReelConfig(experience, items[index].clickUrl);
            }));

            experiences.forEach(function(experience) {
                var embedTracker = experience.id.replace(/^e-/, '');

                /* jshint camelcase:false */
                window.__c6_ga__('create', c6.gaAcctIdEmbed, {
                    'name'       : embedTracker,
                    'cookieName' : '_c6ga'
                });
                window.__c6_ga__(embedTracker + '.require', 'displayfeatures');

                window.__c6_ga__(embedTracker + '.set',{
                    'dimension1' : window.location.href
                });

                window.__c6_ga__(embedTracker + '.send', 'pageview', {
                    'page'  : '/embed/' + experience.id + '/',
                    'title' : experience.data.title,
                    'sessionControl' : 'start'
                });
               
                //TODO - replace this when we can actually detect that we are visible
                window.__c6_ga__(embedTracker + '.send', 'event', {
                    'eventCategory' : 'Display',
                    'eventAction'   : 'Visible',
                    'eventLabel'    : experience.data.title,
                    'page'  : '/embed/' + experience.id + '/',
                    'title' : experience.data.title
                });
                /* jshint camelcase:true */
            });

            c6.embeds.forEach(function(embed) {
                c6.loadExperience(embed, true);
            });

            callback({
                params: params,
                items: experiences.map(function(experience) {
                    return {
                        id: experience.id,
                        title: experience.data.title,
                        image: baseUrl + experience.data.collateral.splash
                    };
                })
            });
        });
    }

    require.config = {
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

    require([
        'adtech'
    ], function(
        adtech
    ) {
        adtech.config.page = {
            network: '5473.1',
            server: 'adserver.adtechus.com',
            enableMultiAd: true
        };

        adtech.config.placements[params.id] = {
            adContainerId: 'ad',
            complete: function() {
                sendResponse(c6.widgetContentCache[params.id]);
            }
        };

        loop(params.count, function() {
            adtech.enqueueAd(params.id);
        });

        adtech.executeQueue({
            multiAd: {
                disableAdInjection: true,
                readyCallback: function() {
                    adtech.showAd(params.id);
                }
            }
        });
    });
}());
