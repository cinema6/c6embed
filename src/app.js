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
        hostDocument = deps.hostDocument;

    var c6 = window.c6;

    function appUrl(url) {
        return config.appBase + '/' + url;
    }

    c6.loadExperience = function(settings) {
        var $iframe = frameFactory(),
            $container = $(settings.embed),
            appConfig = {
                kDebug: config.debug,
                kDevice: browserInfo.profile.device,
                kEnvUrlRoot: config.urlRoot
            },
            appFolder = null;

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

        function communicateWithApp(appWindow) {
            var session = experienceService.registerExperience(settings.experience, appWindow);

            session
                .once('ready', function appReady() {
                    $iframe.show();
                })
                .on('fullscreenMode', function requestFullscreen(shouldEnterFullscreen) {
                    $iframe.fullscreen(shouldEnterFullscreen);

                    if (browserInfo.profile.device === 'phone') {
                        hostDocument.shrink(shouldEnterFullscreen);
                    }
                });
        }

        function loadApp(document) {
            $iframe.load(document.toString(), communicateWithApp);
        }

        $container.append($iframe);

        return fetchExperience()
            .then(scrapeConfiguration)
            .then(fetchApp)
            .then(modifyApp)
            .then(loadApp);
    };
};
