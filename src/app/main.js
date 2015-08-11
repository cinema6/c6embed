(function() {
    'use strict';

    var app = require('./app.js');

    /* Create Location */
    var Location = require('./utils/Location.js'),
        $location = new Location({
            window: window,
            document: document
        });

    /* Create C6Query */
    var C6Query = require('../../lib/C6Query.js'),
        c6Query = new C6Query({
            document: document,
            window: window
        });

    /* Create Config */
    var Config = require('./Config.js'),
        config = new Config({
            window: window,
            document: window.document,
            location: $location
        });

    /* Fetch Q */
    var q = require('q');

    /* Fetch Modernizr */
    var modernizr = require('Modernizr');

    /* Fetch asEvented */
    var asEvented = require('asEvented');

    /* Fetch importScripts */
    var importScripts = require('../../lib/importScripts');

    /* Create UserAgent */
    var UserAgent = require('../../lib/UserAgent.js'),
        userAgent = new UserAgent({
            window: window
        });

    /* Create PostMessage */
    var PostMessage = require('../../lib/PostMessage.js'),
        postmessage = new PostMessage({
            asEvented: asEvented,
            q: q,
            window: window
        });

    /* Create BrowserInfo */
    var BrowserInfo = require('../../lib/BrowserInfo.js'),
        browserInfo = new BrowserInfo({
            modernizr: modernizr,
            window: window,
            userAgent: userAgent,
            $: c6Query
        });

    /* Create Player */
    var PlayerProvider = require('./PlayerProvider.js');
    var Player = new PlayerProvider({
        postmessage: postmessage,
        q: q
    });

    /* Create C6AJAX */
    var C6AJAX = require('../../lib/c6ajax/C6AJAX.js'),
        c6Ajax = new C6AJAX({
            window: window,
            q: q,
            browserInfo: browserInfo,
            location: $location
        });
        
    /* Create AdLib */
    var AdLib = require('./AdLib.js'),
        adLib = new AdLib({
            c6Ajax: c6Ajax,
            location: $location,
            q: q
        });

    /* Create SponsoredCards */
    var SponsoredCards = require('./SponsoredCards.js'),
        spCards = new SponsoredCards({
            window: window,
            config: config,
            q: q,
            adLib: adLib,
            importScripts: importScripts
        });

    /* Create and Configure DocumentParser */
    var DocumentParser = require('./DocumentParser.js'),
        documentParser = new DocumentParser();

    /* Create and Configure FrameFactory */
    var FrameFactory = require('./FrameFactory.js'),
        frameFactory = new FrameFactory({
            $: c6Query,
            documentParser: documentParser,
            q: q
        });

    /* Create and Configure HostDocument */
    var HostDocument = require('./HostDocument.js'),
        hostDocument = new HostDocument({
            $: c6Query,
            window: window
        });

    /* Create and Configure Observable */
    var ObservableProvider = require('../../lib/ObservableProvider.js'),
        Observable = new ObservableProvider();

    /* Run the Application! */
    return app({
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
    })
        .then(function(result) {
            if (!window.console) { return; }
            window.console.log(result);
        })
        .catch(function(error) {
            if (!window.console) { return; }
            window.console.error(error);
        });
}());
