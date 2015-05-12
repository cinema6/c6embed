(function() {
    'use strict';

    var app = require('./app');

    /* Create C6Query */
    var C6Query = require('../lib/C6Query'),
        c6Query = new C6Query({
            document: document,
            window: window
        });

    /* Create Config */
    var Config = require('./Config'),
        config = new Config({
            window: window,
            document: window.document,
            $: c6Query
        });

    /* Fetch Q */
    var q = require('q');

    /* Fetch Modernizr */
    var modernizr = require('Modernizr');

    /* Fetch asEvented */
    var asEvented = require('asEvented');

    /* Create UserAgent */
    var UserAgent = require('../lib/UserAgent'),
        userAgent = new UserAgent({
            window: window
        });

    /* Create PostMessage */
    var PostMessage = require('../lib/PostMessage'),
        postmessage = new PostMessage({
            asEvented: asEvented,
            q: q,
            window: window
        });

    /* Create Location */
    var Location = require('./utils/Location'),
        $location = new Location({
            window: window
        });

    /* Create BrowserInfo */
    var BrowserInfo = require('../lib/BrowserInfo'),
        browserInfo = new BrowserInfo({
            modernizr: modernizr,
            window: window,
            userAgent: userAgent,
            $: c6Query
        });

    /* Create Player */
    var PlayerProvider = require('../src/PlayerProvider.js');
    var Player = new PlayerProvider({
        postmessage: postmessage,
        q: q
    });

    /* Create SponsoredCards */
    var SponsoredCards = require('../lib/SponsoredCards'),
        spCards = new SponsoredCards({
            window: window,
            config: config,
            q: q
        });

    /* Create C6AJAX */
    var C6AJAX = require('../lib/c6ajax/C6AJAX'),
        c6Ajax = new C6AJAX({
            window: window,
            q: q,
            browserInfo: browserInfo,
            location: $location
        });

    /* Create and Configure DocumentParser */
    var DocumentParser = require('./DocumentParser'),
        documentParser = new DocumentParser();

    /* Create and Configure FrameFactory */
    var FrameFactory = require('./FrameFactory'),
        frameFactory = new FrameFactory({
            $: c6Query,
            documentParser: documentParser,
            q: q
        });

    /* Create and Configure HostDocument */
    var HostDocument = require('./HostDocument'),
        hostDocument = new HostDocument({
            $: c6Query,
            window: window
        });

    /* Create and Configure Observable */
    var ObservableProvider = require('../lib/ObservableProvider'),
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
