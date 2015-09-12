var q = require('q');
var MRAID = require('../../lib/iab').MRAID;
var importScripts = require('../../lib/importScripts');
var app = require('../app/app');
var googleAnalytics = require('../../lib/google_analytics');
var pagePathFor = require('../ga_helpers').pagePath;
var formatUrl = require('url').format;
var parseUrl = require('url').parse;
var globalLogger = require('../../lib/logger').default;
var logger = globalLogger.context('c6mraid.js');

var modernizr = require('Modernizr');
var C6Query = require('../../lib/C6Query');
var Config = require('../app/Config');
var asEvented = require('asEvented');
var UserAgent = require('../../lib/UserAgent');
var PostMessage = require('../../lib/PostMessage');
var Location = require('../app/utils/Location');
var BrowserInfo = require('../../lib/BrowserInfo');
var PlayerProvider = require('../app/PlayerProvider');
var C6AJAX = require('../../lib/c6ajax/C6AJAX');
var AdLib = require('../../src/app/AdLib');
var SponsoredCards = require('../app/SponsoredCards');
var DocumentParser = require('../app/DocumentParser');
var FrameFactory = require('../app/FrameFactory');
var HostDocument = require('../app/HostDocument');
var ObservableProvider = require('../../lib/ObservableProvider');

logger.tasks.send.push(sendLog);

function omit(object, keys) {
    'use strict';

    return Object.keys(object).reduce(function(result, key) {
        if (keys.indexOf(key) < 0) {
            result[key] = object[key];
        }

        return result;
    }, {});
}

function sendLog(logger, method, args) {
    'use strict';

    var img = new Image();
    img.src = formatUrl({
        protocol: 'https:',
        hostname: 'logging.cinema6.com',
        pathname: 'pixel.gif',
        query: {
            v: args.join(', '),
            cb: Date.now()
        }
    });
}

function getLoader(apiRoot) {
    'use strict';

    window.c6 = {
        embeds: [],
        gaAcctIdPlayer: (function(acc,mi,mx){
            return acc+'-'+parseInt(((Math.random()*999999999)%(mx-mi+1))+mi,10);
        }('UA-44457821',31,35)),
        gaAcctIdEmbed: (function(acc,mi,mx){
            return acc+'-'+parseInt(((Math.random()*999999999)%(mx-mi+1))+mi,10);
        }('UA-44457821',6,30))
    };

    window.__C6_URL_ROOT__ = apiRoot;

    googleAnalytics('__c6_ga__', 'c6', window.c6.gaAcctIdPlayer, {
        storage: 'none',
        cookieDomain: 'none'
    });

    /* Create Location */
    var $location = new Location({
        window: window,
        document: document
    });

    /* Create C6Query */
    var c6Query = new C6Query({
        document: document,
        window: window
    });

    /* Create Config */
    var config = new Config({
        window: window,
        document: window.document,
        location: $location
    });

    /* Create UserAgent */
    var userAgent = new UserAgent({
        window: window
    });

    /* Create PostMessage */
    var postmessage = new PostMessage({
        asEvented: asEvented,
        q: q,
        window: window
    });

    /* Create BrowserInfo */
    var browserInfo = new BrowserInfo({
        modernizr: modernizr,
        window: window,
        userAgent: userAgent,
        $: c6Query
    });

    /* Create Player */
    var Player = new PlayerProvider({
        postmessage: postmessage,
        q: q
    });

    /* Create C6AJAX */
    var c6Ajax = new C6AJAX({
        window: window,
        q: q,
        browserInfo: browserInfo,
        location: $location
    });

    /* Create AdLib */
    var adLib = new AdLib({
        c6Ajax: c6Ajax,
        location: $location,
        q: q
    });

    /* Create SponsoredCards */
    var spCards = new SponsoredCards({
        window: window,
        config: config,
        q: q,
        adLib: adLib,
        importScripts: importScripts
    });

    /* Create and Configure DocumentParser */
    var documentParser = new DocumentParser();

    /* Create and Configure FrameFactory */
    var frameFactory = new FrameFactory({
        $: c6Query,
        documentParser: documentParser,
        q: q
    });

    /* Create and Configure HostDocument */
    var hostDocument = new HostDocument({
        $: c6Query,
        window: window
    });

    /* Create and Configure Observable */
    var Observable = new ObservableProvider();

    /* Run the Application! */
    app({
        window: window,
        frameFactory: frameFactory,
        $: c6Query,
        Q: q,
        config: config,
        c6Ajax: c6Ajax,
        documentParser: documentParser,
        browserInfo: browserInfo,
        Player: Player,
        spCardService: spCards,
        hostDocument: hostDocument,
        Observable: Observable
    });

    return window.c6.loadExperience;
}

function fetchExperience(config) {
    'use strict';

    return new q.Promise(function(resolve) {
        var base = parseUrl(config.apiRoot);

        importScripts([formatUrl({
            protocol: base.protocol,
            hostname: base.hostname,
            pathname: '/api/public/content/experience/' + config.id + '.js',
            query: omit(config, ['id', 'apiRoot'])
        })], function(experience) {
            resolve(experience);
        });
    });
}

module.exports = function c6mraid(config) {
    'use strict';

    globalLogger.levels(config.debug ? ['log', 'info', 'warn', 'error'] : ['error']);

    var START_TIME = Date.now();
    var apiRoot = config.apiRoot || 'http://portal.cinema6.com';
    var pageUrl = config.pageUrl || 'cinema6.com';
    var orientation = config.forceOrientation || 'portrait';
    var loadExperience = getLoader(apiRoot);
    var mraid = new MRAID({ forceOrientation: orientation, useCustomClose: true });
    var ga = googleAnalytics('__c6_ga__', config.exp.replace(/^e-/, ''), window.c6.gaAcctIdEmbed, {
        storage: 'none',
        cookieDomain: 'none'
    });
    var controller = null;

    logger.info('Initialize.');

    ga('require', 'displayfeatures');
    ga('set', {
        checkProtocolTask: null,
        dimension1: 'mraid',
        page: pagePathFor(config.exp, {
            cx: 'mraid',
            ct: config.src,
            ex: config.ex,
            vr: config.vr
        })
    });
    ga('send', 'pageview', {
        sessionControl: 'start'
    });

    mraid.waitUntilViewable().then(function sendVisibleEvent() {
        var visibleStart = Date.now();

        ga('send', 'event', {
            eventCategory: 'Display',
            eventAction: 'Visible'
        });

        logger.info('MRAID is reporting ad is viewable.');

        mraid.on('stateChange', function(state) {
            var timeVisible = Date.now() - visibleStart;
            var wasActive = !!controller;

            logger.info('MRAID reports state changed to', state);

            if (state !== 'hidden')  { return; }

            ga('send', 'timing', {
                timingCategory: 'API',
                timingVar: wasActive ? 'closePageAfterLoad' : 'closePageBeforeLoad',
                timingValue: timeVisible,
                timingLabel: 'c6'
            });
        });
    });

    return q.all([
        fetchExperience({
            id: config.exp,
            apiRoot: apiRoot,

            branding: config.branding,
            placementId: config.adPlacementId,
            campaign: config.campaign,
            container: config.src,
            wildCardPlacement: config.wp,
            preview: config.preview,
            pageUrl: pageUrl,
            hostApp: config.app,
            network: config.network
        }).then(function(experience) {
            logger.info('Experience was fetched.');

            ga('set', { title: experience.data.title });
            ga('send', 'timing', {
                timingCategory: 'API',
                timingVar: 'fetchExperience',
                timingValue: Date.now() - START_TIME,
                timingLabel: 'c6'
            });

            experience.data.deck[0].data.preload = false;

            return loadExperience({
                load: true,
                preload: true,

                standalone: false,
                interstitial: true,
                playerVersion: config.playerVersion || 1,
                mobileMode: config.mobileMode,
                mode: config.mode,

                embed: document.body,
                splashDelegate: {},
                experience: experience,

                config: {
                    exp: experience.id,
                    title: experience.data.title,
                    startPixel: (config.startPixels || []).join(' '),
                    countPixel: (config.countPixels || []).join(' '),
                    launchPixel: (config.launchPixels || []).join(' '),
                    container: config.src,
                    context: 'mraid',
                    preview: config.preview,
                    ex: config.ex,
                    vr: config.vr,
                    hostApp: config.app,
                    network: config.network,
                    pageUrl: pageUrl
                }
            }, true);
        }).then(function logSuccess(controller) {
            logger.log('Player loaded.');
            return controller;
        }),
        mraid.waitUntilViewable().delay(600).then(function recordReadyTime() {
            return Date.now();
        })
    ]).then(function activatePlayer(data) {
        var waitTime = Date.now() - data[1];
        controller = data[0];

        logger.info('Showing player.');

        ga('send', 'timing', {
            timingCategory: 'API',
            timingVar: 'loadDelay',
            timingValue: waitTime,
            timingLabel: 'c6'
        });

        controller.state.set('active', true);
        controller.state.observe('active', function observeActive(active) {
            if (!active) {
                mraid.close();
            }
        });
        mraid.on('stateChange', function handleAdStateChange(state) {
            if (state === 'hidden') {
                logger.info('Hiding player.');
                controller.state.set('active', false);
            }
        });
    });
};
