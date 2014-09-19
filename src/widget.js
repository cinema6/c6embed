(function(win, doc/*, readyState*/) {
    'use strict';

    //TODO: Handle multiple widgets against same placementId?
    //TODO: Handle widget + one or more embeds on same page
    //
    var baseUrl = win.__C6_URL_ROOT__ || '//portal.cinema6.com',
        appJs   = win.__C6_APP_JS__ || '//lib.cinema6.com/c6embed/v1/app.min.js',
        c6      = win.c6 = complete(win.c6 || {}, {
            widgetRunOnce   : true,
            app             : null,
            embeds          : [],
            branding        : {},
            requireCache    : {},
            contentCache    : {},
            gaAcctIdPlayer  : 'UA-44457821-2',
            gaAcctIdEmbed   : 'UA-44457821-3',

            //loads a miniReel
            loadExperience  : function(embed,preload) {
                var app = this.app || (this.app = doc.createElement('script')),
                    head = doc.getElementsByTagName('head')[0];

                embed.load = true;
                embed.preload = !!preload;

                if (!app.parentNode) {
                    app.src = appJs;
                    head.appendChild(app);
                }
            },

            //addReel will be called by code dynamically injected via adserver
            addReel         : function(expId,placementId,clickUrl){
                if (!this.contentCache[placementId]){
                    this.contentCache[placementId] = [];
                }
                this.contentCache[placementId].push({
                    expId    : expId,
                    clickUrl : clickUrl
                });
            },

            //createWidget will be called via code injected by adServer or via
            //custom integration
            createWidget    : widgetFactory
        });

    
    /*****************************************************************
     * Init code to run one time (in case there is more than one widget
     * being loaded on the page)
     */
    
    if (c6.widgetRunOnce){
        c6.widgetRunOnce = false;
    
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

    }

    /*****************************************************************
     * Helpers
     */

    function genRandomId(result,len){
        result  = result || '';
        len     = len || 10;
        while(len-- > 0){
            var n = (Math.floor(Math.random() * 999999999)) % 35;
            result += String.fromCharCode(((n <= 25) ? 97 : 22) + n);
        }
        return result;
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

            var iframe = document.createElement('iframe'),
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

            iframe.setAttribute('src', 'about:blank');
            head.appendChild(iframe);

            // The iframe must have its contents written using document.write(), otherwise the
            // browser will not send the "referer" header when requesting the script.
            iframe.contentWindow.document.write(html);
            iframe.contentWindow.document.close();
        });

        return modules;
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

    /*****************************************************************
     * Widget Work Starts Here
     * Cfg Object with these params:
     *  placementId - Used to retrieve MR's from Ad Server
     *  template    - Template file for formatting the Mr2 Widget
     *  branding    - Branding to apply to the MR2 Widget Container
     */
    
    function widgetFactory(cfg){
        var widgetDef = complete({ }, cfg),
            widgetDiv = (function(){
                var div, widgetId =  genRandomId('c6_');
                doc.write('<div id="' + widgetId + '"></di' + 'v>');
                div = doc.getElementById(widgetId);
                return div;
            }());

        require([
            'adtech',
            '//lib.cinema6.com/twobits.js/v0.0.1-0-g7a19518/twobits.min.js',
            baseUrl + '/collateral/splash/splash.js',
            widgetDef.template
        ], function(adtech, tb, splashJS, html) {
            //todo get widget branding..
            var splashTemplates, i,
                head = doc.getElementsByTagName('head')[0];
            widgetDiv.innerHTML = html;

            splashTemplates = doc.querySelectorAll('.c6-mr2__mr-splash');

            adtech.config.page = {
                network         : '5473.1',
                server          : 'adserver.adtechus.com',
                enableMultiAd   : true
            };
            
            adtech.config.placements[widgetDef.placementId] = {
                adContainerId   : 'ad',
                complete: function(){
                    c6.contentCache[widgetDef.placementId].forEach(function(o,index){
                        require([
                            baseUrl + '/api/public/content/experience/' + o.expId + '.js'
                        ], function( experience) {
                            var branding = experience.data.branding,
                                splashImage = baseUrl + experience.data.collateral.splash,
                                splashElt = splashTemplates[index],
                                minireel = {};

                            //TODO:  remove c6ads filter (c6ads dont play nice)
                            if ((branding) && (branding !== 'c6ads')){
                                /* jshint expr:true */
                                (c6.branding[branding] ||
                                    (c6.branding[branding] = new DOMElement('link', {
                                        id: 'c6-' + branding,
                                        rel: 'stylesheet',
                                        href: baseUrl + '/collateral/branding/' +
                                            branding + '/styles/splash.css'
                                    }, head))
                                );
                                /* jshint expr:false */
                                splashElt.setAttribute('class', 'c6brand__' + branding);
                            }
                            tb.parse(splashElt)({
                                title : experience.data.title,
                                splash: splashImage
                            });

                            minireel.embed = splashElt;
                            minireel.splashDelegate = splashJS(c6, minireel, splashElt);
                            minireel.experience = experience;
                            minireel.load = false;
                            minireel.preload =  false;
                            minireel.config = {
                                exp : experience.id,
                                title: experience.data.title
                            };
                            c6.embeds.push(minireel);
                            
                            var embedTracker = minireel.config.exp.replace(/e-/,'');

                            /* jshint camelcase:false */
                            win.__c6_ga__('create', c6.gaAcctIdEmbed, {
                                'name'       : embedTracker,
                                'cookieName' : '_c6ga'
                            });
                            win.__c6_ga__(embedTracker + '.require', 'displayfeatures');

                            win.__c6_ga__(embedTracker + '.set',{
                                'dimension1' : win.location.href
                            });

                            win.__c6_ga__(embedTracker + '.send', 'pageview', {
                                'page'  : '/embed/' + minireel.config.exp + '/',
                                'title' : minireel.config.title,
                                'sessionControl' : 'start'
                            });
                            /* jshint camelcase:true */

                        });
                    });
                }
            };
            
            for (i = 0; i < splashTemplates.length; i++){
                adtech.enqueueAd(parseInt(widgetDef.placementId,10));
            }
           
            adtech.executeQueue({
                multiAd: {
                    disableAdInjection: true,
                    readyCallback : function(){
                        adtech.showAd(widgetDef.placementId);
                    }
                }
            });
        });
    }

   
    /*****************************************************************
     * Viewport detection
     */
    
//     function visibleEvent() {
// //        var embedTracker = config.exp.replace(/e-/,'');
// //        /* jshint camelcase:false */
// //        win.__c6_ga__(embedTracker + '.send', 'event', {
// //            'eventCategory' : 'Display',
// //            'eventAction'   : 'Visible',
// //            'eventLabel'    : settings.config.title,
// //            'page'  : '/embed/' + settings.config.exp + '/',
// //            'title' : settings.config.title
// //        });
//         c6.loadExperience();
//     }
// 
//     function splashVisible() {
//         var viewportWidth = win.innerWidth,
//             viewportHeight = win.innerHeight,
//             splashBounds = widgetSplash.getBoundingClientRect(),
//             xOverlap = Math.max(0, Math.min(viewportWidth, splashBounds.left +
//                 splashBounds.width) - Math.max(0, splashBounds.left)),
//             yOverlap = Math.max(0, Math.min(viewportHeight, splashBounds.top +
//                 splashBounds.height) - Math.max(0, splashBounds.top)),
//             areaOverlap = xOverlap * yOverlap,
//             splashArea = splashBounds.width * splashBounds.height;
//         return areaOverlap/splashArea >= 0.5;
//     }
//     
//     function viewChangeHandler() {
//         if (splashVisible()) {
//             win.removeEventListener('scroll', viewChangeHandler);
//             win.removeEventListener('resize', viewChangeHandler);
//             visibleEvent();
//         }
//     }
// 
//     function readyHandler() {
//         if(doc.readyState === 'complete') {
//             doc.removeEventListener('readystatechange', readyHandler);
//             documentComplete();
//         }
//     }
// 
//     function documentComplete() {
//         if (splashVisible()) {
//             visibleEvent();
//         } else {
//             win.addEventListener('scroll', viewChangeHandler);
//             win.addEventListener('resize', viewChangeHandler);
//         }
//     }
//     
//     if(readyState === 'complete') {
//         documentComplete();
//     } else {
//         doc.addEventListener('readystatechange', readyHandler);
//     }
// 
}(window, document, window.mockReadyState || document.readyState));
