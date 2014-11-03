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
        var promise;

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
                appFolder = appUrl(experience.appUri + '/'),
                state = null,
                getSessionDeferred = Q.defer();
                
            function insertIframe() {
                $container.append($iframe);
            }

            function fetchApp() {
                return c6Ajax.get(appFolder + appConfig.kMode + '.html')
                    .then(function parse(response) {
                        return documentParser(response.data);
                    });
            }

            function modifyApp(document) {
                return document
                    .setGlobalObject('c6', appConfig)
                    .setBase(appFolder);
            }

            function getSponsoredCards(document) {
                return spCardService.fetchSponsoredCards(experience).thenResolve(document);
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
                            clientId:   clientId
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
                    window.__c6_ga__(embedTracker + '.send', 'event', {
                        'eventCategory' : 'Display',
                        'eventAction'   : 'Show',
                        'eventLabel'    : settings.config.title,
                        'page'  : '/embed/' + settings.config.exp + '/',
                        'title' : settings.config.title
                    });
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
                .then(loadApp)
                .then(initAnalytics)
                .then(finish);
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
