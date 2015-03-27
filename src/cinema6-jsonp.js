(function() {
    'use strict';

    /**
     * Initialize some default configuration. Set up the c6 object (if it still needs to be set
     * up.)
     */
    var baseUrl = window.__C6_URL_ROOT__ || '//portal.cinema6.com',
        appJs   = window.__C6_APP_JS__ || '//lib.cinema6.com/c6embed/v1/app.min.js',
        adNetwork = window.__C6_AD_NETWORK__ || '5473.1',
        adServer  = window.__C6_AD_SERVER__  || 'adserver.adtechus.com',
        c6 = window.c6 = complete(window.c6 || {}, {
            app: null,
            embeds: [],
            requireCache: {},
            widgetContentCache: {},
            gaAcctIdPlayer: (function(acc,mi,mx){
                return acc+'-'+parseInt(((Math.random()*999999999)%(mx-mi+1))+mi,10);
            }('UA-44457821',31,35)),
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
                            '<script src="' + src + '" charset="utf-8"></script>'
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
            addReel: function(id, placement, clickUrl, adId) {
                var cache = this.widgetContentCache;

                (cache[placement] || (cache[placement] = [])).push({
                    expId: id,
                    clickUrl: clickUrl,
                    adId : adId
                });
            },
            loadExperienceById: function(id) {
                var config = this.embeds.reduce(function(result, config) {
                    return config.experience.id === id ? config : result;
                }, null);

                config.config.showStartTime= (new Date()).getTime();
                config.config.context= 'jsonp';
                if (config.trackingUrl) {
                    new DOMElement('img', {
                        src: config.trackingUrl
                    });
                    delete config.trackingUrl;
                    
                    var embedTracker = config.experience.id.replace(/^e-/, '');
                    /* jshint camelcase:false */
                    window.__c6_ga__(embedTracker + '.send', 'event', {
                        'eventCategory' : 'Display',
                        'eventAction'   : 'AttemptShow',
                        'eventLabel'    : config.experience.data.title
                    });
                    /* jshint camelcase:true */
                }

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
        }()), { count: 1, src: 'jsonp' }),
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

    function find(array, predicate) {
        var index = 0;
        var length = array.length;

        for ( ; index < length; index++) {
            if (predicate(array[index], index)) {
                return array[index];
            }
        }

        return null;
    }

    function sponsorDataOf(minireel) {
        var sponsoredCard;

        if (!!minireel.data.params.sponsor) {
            return {
                name: minireel.data.params.sponsor,
                logo: minireel.data.collateral.logo
            };
        }

        sponsoredCard = find(minireel.data.deck, function(card) {
            return !!card.params.sponsor;
        });

        if (sponsoredCard) {
            return {
                name: sponsoredCard.params.sponsor,
                logo: sponsoredCard.collateral.logo
            };
        }

        return null;
    }

    /**********************************************************************************************
     * Represents a MiniReel that has been loaded. These will go in the c6.embeds array.
     *********************************************************************************************/
    function MiniReelConfig(experience, trackingUrl, adId) {
        this.load = false;
        this.preload = false;

        this.standalone = false;
        this.playerVersion = params.playerVersion || 1;

        this.embed = container;
        this.splashDelegate = {};
        this.experience = experience;

        this.trackingUrl = trackingUrl;
        this.config = {
            exp: experience.id,
            title: experience.data.title,
            adId: adId,
            startPixel: params.startPixel,
            countPixel: params.countPixel,
            launchPixel: params.launchPixel,
            container: params.src,
            hasSponsoredCards: true,
            context: 'jsonp'
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
            branding: params.branding,
            placementId: params.adPlacementId,
            wildCardPlacement: params.wp,
            container: params.src
        }),
        requireStart = (new Date()).getTime();

        require(items.map(function(item) {
            return baseUrl + '/api/public/content/experience/' + item.expId + '.js?' + query;
        }), function() {
            var experiences = Array.prototype.slice.call(arguments);
            var embeds = experiences.map(function(experience, index) {
                return new MiniReelConfig(experience, items[index].clickUrl, items[index].adId);
            });

            c6.embeds.push.apply(c6.embeds, embeds);

            embeds.forEach(function(minireel) {
                var experience = minireel.experience,
                    pageBranding = c6.embeds[0].experience.data.branding,
                    embedTracker = experience.id.replace(/^e-/, ''),
                    pagePath = (function(e,q){
                        var r='/embed/'+e+'/',p,qf=[];
                        for (p in q){ if(q[p]){qf.push(p + '=' + q[p]);} }
                        if (qf.length){ r += '?' + qf.join('&'); }
                        return r;
                    }(experience.id,{
                        cx:minireel.config.context,
                        ct:minireel.config.container,
                        gp:minireel.config.adId,
                        bd: pageBranding
                    }));

                if (!(/lightbox/).test(experience.data.mode)) {
                    experience.data.mode = 'lightbox';
                }

                experience.data.branding = pageBranding;

                /* jshint camelcase:false */
                window.__c6_ga__('create', c6.gaAcctIdEmbed, {
                    'name'       : embedTracker,
                    'cookieName' : '_c6ga'
                });
                window.__c6_ga__(embedTracker + '.require', 'displayfeatures');

                window.__c6_ga__(embedTracker + '.set',{
                    'page'  : pagePath,
                    'title' : experience.data.title,
                    'dimension1' : window.location.href
                });

                window.__c6_ga__(embedTracker + '.send', 'pageview', {
                    'sessionControl' : 'start'
                });
               
                //TODO - replace this when we can actually detect that we are visible
                window.__c6_ga__(embedTracker + '.send', 'event', {
                    'eventCategory' : 'Display',
                    'eventAction'   : 'Visible',
                    'eventLabel'    : experience.data.title
                });
                
                window.__c6_ga__(embedTracker + '.send', 'timing', {
                    'timingCategory' : 'API',
                    'timingVar'      : 'fetchExperience',
                    'timingValue'    : ((new Date()).getTime() - requireStart),
                    'timingLabel'    : 'c6'
                });
                /* jshint camelcase:true */

                c6.loadExperience(minireel, true);
            });

            callback({
                params: params,
                items: experiences.map(function(experience) {
                    return {
                        id: experience.id,
                        title: experience.data.title,
                        summary: experience.data.title,
                        image: baseUrl + experience.data.collateral.splash,
                        sponsor: sponsorDataOf(experience)
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
            network: adNetwork,
            server: adServer,
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
