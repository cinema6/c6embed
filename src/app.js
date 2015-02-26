module.exports = function(deps) {
    'use strict';

    var window = deps.window,
        frameFactory = deps.frameFactory,
        $ = deps.$,
        c6Ajax = deps.c6Ajax,
        config = deps.config,
        documentParser = deps.documentParser,
        browserInfo = deps.browserInfo,
        experienceService = deps.experienceService,
        spCardService = deps.spCardService,
        hostDocument = deps.hostDocument,
        Observable = deps.Observable,
        Q = deps.Q;

    var c6 = window.c6,
        embeds = c6.embeds,
        noop = function() {};
    
    function initialize(embeds) {
        return Q.all(embeds.map(function(settings) {
            return settings.load ?
                c6.loadExperience(settings, settings.preload) :
                settings;
        }));
    }

    function appUrl(url) {
        return config.appBase + '/' + url;
    }

    c6.loadExperience = function(settings, preload) {
        var defaultAdNetwork = window.__C6_AD_NETWORK__ || '5473.1',
            defaultAdServer  = window.__C6_AD_SERVER__  || 'adserver.adtechus.com',
            promise;

        function bootstrap() {
            var experience = settings.experience,
                $iframe = frameFactory(),
                $container = $(settings.embed),
                splashDelegate = settings.splashDelegate,
                appConfig = {
                    kDebug: config.debug,
                    kDevice: browserInfo.profile.device,
                    kEnvUrlRoot: config.urlRoot,
                    kMode: browserInfo.profile.device !== 'phone' ?
                        experience.data.mode : 'mobile'
                },
                appFolder = (window.__C6_APP_FOLDER__ || appUrl(experience.appUri)) + '/',
                appPath = appFolder + (window.__C6_APP_FILE__ || (appConfig.kMode + '.html')),
                state = null,
                getSessionDeferred = Q.defer();

            experience.data.adServer = experience.data.adServer || {};
            experience.data.adServer.network =
                experience.data.adServer.network || defaultAdNetwork;
            experience.data.adServer.server =
                experience.data.adServer.server || defaultAdServer;

            if (settings.config.launchPixel) {
                (function() {
                    var campaign = (experience.data.campaign || (experience.data.campaign = {}));

                    campaign.launchUrls = settings.config.launchPixel.split(' ');
                }());
            }

            function insertIframe() {
                $container.append($iframe);
            }

            function fetchApp() {
                return c6Ajax.get(appPath)
                    .then(function parse(response) {
                        if (!response.data) {
                            throw new Error(
                                'Unexpected response for MR App request: ' + JSON.stringify(response)
                            );
                        }

                        return documentParser(response.data);
                    });
            }

            function modifyApp(document) {
                return document
                    .setGlobalObject('c6', appConfig)
                    .setBase(appFolder);
            }

            function getSponsoredCards(document) {
                var startFetch = (new Date()).getTime();
                var clickUrls = settings.config.startPixel && settings.config.startPixel.split(' ');
                var countUrls = settings.config.countPixel && settings.config.countPixel.split(' ');

                return spCardService.fetchSponsoredCards(experience, {
                    clickUrls: clickUrls,
                    countUrls: countUrls
                },preload).then(function(){
                    /* jshint camelcase:false */
                    var embedTracker = settings.config.exp.replace(/e-/,'');
                    window.__c6_ga__(embedTracker + '.send', 'timing', {
                        'timingCategory' : 'API',
                        'timingVar'      : 'fetchSponsoredCards',
                        'timingValue'    : ((new Date()).getTime() - startFetch),
                        'timingLabel'    : 'adtech'
                    });
                    return document;
                });
            }
            
            function trimPlaceholders(document) {
                experience.data.deck = experience.data.deck.filter(function(card) {
                    return card.type !== 'wildcard';
                });
                return document;
            }

            function loadApp(document) {
                return $iframe.load(document.toString(), communicateWithApp)
                    .then(function(session) {
                        return session.ensureReadiness();
                    });
            }

            function communicateWithApp(appWindow) {
                var session = experienceService.registerExperience(experience, appWindow, {
                    standalone: settings.standalone
                }).on('open', function openApp() {
                    state.set('active', true);
                })
                .on('close', function closeApp() {
                    state.set('active', false);
                })
                .on('fullscreenMode', function requestFullscreen(shouldEnterFullscreen) {
                    $iframe.fullscreen(shouldEnterFullscreen);

                    if (shouldEnterFullscreen) {
                        if (browserInfo.profile.device === 'phone') {
                            hostDocument.shrink(true);
                        }

                        hostDocument.putInRootStackingContext($iframe);
                    } else {
                        hostDocument.reset();
                    }
                })
                .on('responsiveStyles', function setResponsiveStyles(styles) {
                    if (settings.config.responsive) {
                        settings.state.set('responsiveStyles', styles);
                    }
                });

                getSessionDeferred.resolve(session);

                return session;
            }

            function setAppDefines(session) {
                settings.appDefines = session.window.c6;
                return session;
            }

            function initAnalytics(session) {
                /* jshint camelcase:false */
                window.__c6_ga__(function(){
                    var tracker = window.__c6_ga__.getByName('c6'), clientId;
                    try {
                        clientId = tracker.get('clientId');
                    }catch(e){

                    }
                    if (clientId){
                        session.ping('initAnalytics',{
                            accountId: window.c6.gaAcctIdPlayer,
                            clientId:   clientId,
                            container:  settings.config.container,
                            context:    settings.config.context,
                            group:      settings.config.adId
                        });
                    }
                });
            }

            function finish() {
                return settings;
            }

            settings.getSession = function() {
                return getSessionDeferred.promise;
            };

            $container.addClass('c6__cant-touch-this')
                .createSnapshot();

            state = settings.state = new Observable({
                responsiveStyles: null,
                active: false
            })
            .observe('active', function(active, wasActive) {
                var embedTracker = settings.config.exp.replace(/e-/,'');

                function setResponsiveStyles(styles) {
                    $container.css(styles);
                }

                function callDelegate(method) {
                    (splashDelegate[method] || noop)();
                }

                function getSession() {
                    return settings.getSession()
                        .then(function(session) {
                            return session.ensureReadiness();
                        });
                }

                if (active === wasActive) { return; }

                /* jshint camelcase:false */
                if (active) {
                    if (settings.config.showStartTime) {
                        window.__c6_ga__(embedTracker + '.send', 'event', {
                            'eventCategory' : 'Display',
                            'eventAction'   : 'Show',
                            'eventLabel'    : settings.config.title
                        });
                        window.__c6_ga__(embedTracker + '.send', 'timing', {
                            'timingCategory' : 'UX',
                            'timingVar'      : (preload ? 'showPreloadedPlayer' : 'showPlayer'),
                            'timingValue'    : ((new Date()).getTime() -
                                settings.config.showStartTime),
                            'timingLabel'    : settings.config.context
                        });
                        delete settings.config.showStartTime;
                    }
                    
                    $iframe.show();
                    callDelegate('didHide');
                    getSession()
                        .then(function pingShow(session) {
                            session.ping('show');
                        });

                    this.observe('responsiveStyles', setResponsiveStyles);
                } else {
                    $iframe.hide();
                    callDelegate('didShow');
                    getSession()
                        .then(function pingHide(session) {
                            session.ping('hide');
                        });

                    $container.revertTo(0);
                    this.ignore('responsiveStyles', setResponsiveStyles);
                }
                /* jshint camelcase:true */
            });

            // The iframe must be inserted asynchronously here because, on iOS, if the method is
            // called from a mouse hover event, click event handlers will not execute becasue
            // this method modifies the DOM (by adding the iframe.) So, we make sure to do all of
            // our work asynchronously in the next event loop.
            return Q.delay(0)
                .then(insertIframe)
                .then(fetchApp)
                .then(modifyApp)
                .then(getSponsoredCards)
                .then(trimPlaceholders)
                .then(loadApp)
                .then(setAppDefines)
                .then(initAnalytics)
                .then(finish)
                .catch(function(err){
                    /* jshint camelcase:false */
                    var embedTracker = settings.config.exp.replace(/e-/,'');

                    function stringifyError(error) {
                        try {
                            return JSON.stringify(Object.getOwnPropertyNames(error)
                                .reduce(function(result, prop) {
                                    result[prop] = error[prop];
                                    return result;
                                }, {}), null, '    ');
                        } catch(e) {
                            return error;
                        }
                    }

                    window.__c6_ga__(embedTracker + '.send', 'event', {
                        'eventCategory' : 'Error',
                        'eventAction'   : 'Embed.App',
                        'eventLabel'    : stringifyError(err)
                    });
                    return Q.reject(err);
                    /* jshint camelcase:true */
                });
        }

        if (settings.appDefines) {
            settings.appDefines.html5Videos.forEach(function(video) {
                video.load();
            });
        }

        promise = settings.promise || (settings.promise = bootstrap());

        if (!preload) {
            promise.then(function(settings) {
                settings.state.set('active', true);
            });
        }

        return promise;
    };

    return initialize(embeds);
};
