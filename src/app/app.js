module.exports = function(deps) {
    'use strict';

    var window = deps.window,
        frameFactory = deps.frameFactory,
        $ = deps.$,
        c6Ajax = deps.c6Ajax,
        config = deps.config,
        documentParser = deps.documentParser,
        browserInfo = deps.browserInfo,
        Player = deps.Player,
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
        var profile = settings.profile || browserInfo.profile;
        var defaultAdNetwork = window.__C6_AD_NETWORK__ || '5473.1',
            defaultAdServer  = window.__C6_AD_SERVER__  || 'adserver.adtechus.com',
            promise;
        var autoLaunch = (settings.autoLaunch && (/^(desktop|netbook)$/).test(profile.device));

        if (settings.autoLaunch) {
            preload = true;
        }

        function bootstrap() {
            var experience = settings.experience,
                $iframe = frameFactory(),
                $container = $(settings.embed),
                splashDelegate = settings.splashDelegate,
                appConfig = {
                    kDebug: config.debug,
                    kDevice: profile.device,
                    kEnvUrlRoot: config.urlRoot,
                    kMode: profile.device !== 'phone' ?
                        (settings.mode || experience.data.mode) :
                        (settings.mobileMode || 'mobile')
                },
                standalone = settings.config.container === 'jumpramp' ? false : settings.standalone,
                player2Modes = ['mobile', 'full', 'light', 'lightbox', 'lightbox-playlist', 'solo', 'solo-ads'],
                playerVersion = player2Modes.indexOf(appConfig.kMode) > -1 ?
                    settings.playerVersion : 1,
                appUri = playerVersion === 2 ? 'mini-reel-player' : experience.appUri,
                appFolder = (window.__C6_APP_FOLDER__ || appUrl(appUri)) + '/',
                appFile = window.__C6_APP_FILE__ ||
                    ((appUri === 'mini-reel-player') ? 'index' : appConfig.kMode) + '.html',
                appPath = appFolder + appFile,
                state = null,
                getPlayerDeferred = Q.defer();
            var embedTracker = settings.config.exp.replace(/e-/,'');

            /* jshint camelcase:false */
            window.__c6_ga__(embedTracker + '.send', 'event', {
                'eventCategory' : 'Bootstrap',
                'eventAction'   : 'LoadExperience'
            });
            /* jshint camelcase:true */

            experience.data.adServer = experience.data.adServer || {};
            experience.data.adServer.network =
                experience.data.adServer.network || defaultAdNetwork;
            experience.data.adServer.server =
                experience.data.adServer.server || defaultAdServer;

            if (settings.config.launchPixel) {
                (function() {
                    var campaign = (experience.data.campaign || (experience.data.campaign = {}));

                    campaign.launchUrls = (campaign.launchUrls || [])
                        .concat(settings.config.launchPixel.split(' '));
                }());
            }

            function fetchApp() {
                var startFetch = new Date().getTime();

                return c6Ajax.get(appPath)
                    .then(function parse(response) {
                        if (!response.data) {
                            throw new Error(
                                'Unexpected response for MR App request: ' + JSON.stringify(response)
                            );
                        }

                        /* jshint camelcase:false */
                        window.__c6_ga__(embedTracker + '.send', 'timing', {
                            'timingCategory' : 'API',
                            'timingVar'      : 'fetchPlayer',
                            'timingValue'    : (new Date().getTime() - startFetch)
                        });

                        return documentParser(response.data, {
                            mode: appConfig.kMode
                        });
                    });
            }

            function modifyApp(document) {
                return document
                    .setGlobalObject('c6', appConfig)
                    .setBase(appFolder);
            }

            function loadApp(document) {
                return $iframe.load(document.toString(), communicateWithApp);
            }

            function communicateWithApp(appWindow) {
                var player = new Player(appWindow);

                player.session.on('open', function openApp() {
                    state.set('active', true);
                })
                .on('close', function closeApp() {
                    state.set('active', false);
                })
                .on('fullscreenMode', function requestFullscreen(shouldEnterFullscreen) {
                    if (settings.allowFullscreen === false) { return; }

                    $iframe.fullscreen(shouldEnterFullscreen);

                    if (shouldEnterFullscreen) {
                        if (profile.device === 'phone') {
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

                getPlayerDeferred.resolve(player);

                return player;
            }

            function getSponsoredCards() {
                var startFetch = (new Date()).getTime();
                var clickUrls = settings.config.startPixel && settings.config.startPixel.split(' ');
                var countUrls = settings.config.countPixel && settings.config.countPixel.split(' ');

                return spCardService.fetchSponsoredCards(experience, settings.config, {
                    clickUrls: clickUrls,
                    countUrls: countUrls
                }).then(function(){
                    /* jshint camelcase:false */
                    window.__c6_ga__(embedTracker + '.send', 'timing', {
                        'timingCategory' : 'API',
                        'timingVar'      : 'fetchSponsoredCards',
                        'timingValue'    : ((new Date()).getTime() - startFetch),
                        'timingLabel'    : 'adtech'
                    });
                });
            }

            function trimPlaceholders() {
                experience.data.deck = experience.data.deck.filter(function(card) {
                    return card.type !== 'wildcard';
                });
                return experience;
            }

            function loadPlayer() {
                $container.append($iframe);

                return fetchApp()
                    .then(modifyApp)
                    .then(loadApp);
            }

            function loadAds() {
                return getSponsoredCards().then(trimPlaceholders);
            }

            function bootstrapPlayer(values) {
                var player = values[0], experience = values[1];

                player.bootstrap({
                    experience: experience,
                    profile: settings.profile || browserInfo.profile,
                    standalone: standalone
                });

                return player.getReadySession();
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
                            group:      settings.config.adId,
                            experiment: settings.config.ex || null,
                            variant:    settings.config.vr || null
                        });
                    }
                });
            }

            function loadAll() {
                return Q.all([
                    loadPlayer(),
                    loadAds()
                ]).then(bootstrapPlayer).then(setAppDefines).then(initAnalytics);
            }

            function finish() {
                return settings;
            }

            settings.getPlayer = function() {
                return getPlayerDeferred.promise;
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
                    return settings.getPlayer()
                        .then(function(player) {
                            return player.getReadySession();
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

            settings.autoLaunch = false;

            // The iframe must be inserted asynchronously here because, on iOS, if the method is
            // called from a mouse hover event, click event handlers will not execute becasue
            // this method modifies the DOM (by adding the iframe.) So, we make sure to do all of
            // our work asynchronously in the next event loop.
            return Q.delay(0)
                .then(loadAll)
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

        if (!preload || autoLaunch) {
            promise.then(function(settings) {
                settings.state.set('active', true);
            });
        }

        return promise;
    };

    return initialize(embeds);
};
