module.exports = function(deps) {
    'use strict';

    var window = deps.window,
        frameFactory = deps.frameFactory,
        $ = deps.$,
        c6Db = deps.c6Db,
        c6Ajax = deps.c6Ajax,
        config = deps.config,
        documentParser = deps.documentParser,
        browserInfo = deps.browserInfo,
        experienceService = deps.experienceService,
        hostDocument = deps.hostDocument,
        Observable = deps.Observable,
        Q = deps.Q;

    var c6 = window.c6,
        embeds = c6.embeds,
        id = null,
        settings = null,
        loads = [],
        noop = function() {};

    function appUrl(url) {
        return config.appBase + '/' + url;
    }

    c6.loadExperience = function(settings) {
        var promise;

        function bootstrap() {
            var $iframe = frameFactory(),
                $container = $(settings.embed),
                splashDelegate = settings.splashDelegate,
                appConfig = {
                    kDebug: config.debug,
                    kDevice: browserInfo.profile.device,
                    kEnvUrlRoot: config.urlRoot
                },
                appFolder = null,
                state = null;

            function fetchExperience() {
                return c6Db.find('experience', settings.config.exp);
            }

            function scrapeConfiguration(experience) {
                appConfig.kMode = experience.data.mode;
                appFolder = appUrl(experience.appUri + '/');
                settings.experience = experience;
            }

            function fetchApp() {
                return c6Ajax.get(appFolder + 'index.html')
                    .then(function parse(response) {
                        return documentParser(response.data);
                    });
            }

            function modifyApp(document) {
                return document
                    .setGlobalObject('c6', appConfig)
                    .setBase(appFolder);
            }

            function loadApp(document) {
                $iframe.load(document.toString(), communicateWithApp);

                return experienceService.getSession(settings.config.exp);
            }

            function communicateWithApp(appWindow) {
                var session = settings.session = experienceService.registerExperience(
                    settings.experience,
                    appWindow
                );

                session
                    .on('open', function openApp() {
                        state.set('active', true);
                    })
                    .on('close', function closeApp() {
                        state.set('active', false);
                    })
                    .on('fullscreenMode', function requestFullscreen(shouldEnterFullscreen) {
                        $iframe.fullscreen(shouldEnterFullscreen);

                        if (browserInfo.profile.device === 'phone') {
                            hostDocument.shrink(shouldEnterFullscreen);
                        }
                    })
                    .on('responsiveStyles', function setResponsiveStyles(styles) {
                        if (settings.config.responsive) {
                            settings.state.set('responsiveStyles', styles);
                        }
                    });
            }

            function finish() {
                return settings;
            }

            $container.createSnapshot();

            state = settings.state = new Observable({
                responsiveStyles: null,
                active: false
            })
            .observe('active', function(active) {
                function setResponsiveStyles(styles) {
                    $container.css(styles);
                }

                function callDelegate(method) {
                    (splashDelegate[method] || noop)();
                }

                function getSession() {
                    return experienceService.getSession(settings.config.exp);
                }

                if (active) {
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
            });

            $container.append($iframe);

            return fetchExperience()
                .then(scrapeConfiguration)
                .then(fetchApp)
                .then(modifyApp)
                .then(loadApp)
                .then(finish);
        }

        promise = settings.promise || (settings.promise = bootstrap());

        promise.then(function(settings) {
            settings.state.set('active', true);
        });

        return promise;
    };

    for (id in embeds) {
        settings = embeds[id];

        if (settings.load) {
            loads.push(c6.loadExperience(settings));
        }
    }

    return Q.all(loads);
};
