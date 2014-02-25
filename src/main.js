(function() {
    'use strict';

    var app = require('./app');

    /* Create Config */
    var Config = require('./Config'),
        config = new Config({
            window: window,
            document: window.document
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
            userAgent: userAgent
        });

    /* Create Experience */
    var Experience = require('../lib/Experience'),
        experience = new Experience({
            postmessage: postmessage,
            q: q,
            browserInfo: browserInfo
        });

    /* Create C6AJAX */
    var C6AJAX = require('../lib/c6ajax/C6AJAX'),
        c6Ajax = new C6AJAX({
            window: window,
            q: q,
            browserInfo: browserInfo,
            location: $location
        });

    /* Create C6Query */
    var C6Query = require('../lib/C6Query'),
        c6Query = new C6Query({
            document: document,
            window: window
        });

    /* Create and Configure C6DB */
    var FixtureAdapter = require('../lib/c6db/adapters/Fixture'),
        C6DB = require('../lib/c6db/C6DB'),
        adapter = new FixtureAdapter({
            c6Ajax: c6Ajax,
            q: q
        }),
        c6Db = new C6DB({
            q: q
        });
    adapter.jsonSrc = 'http://s3.amazonaws.com/c6.dev/mock/fixtures.json';
    c6Db.adapter = adapter;

    /* Run the Application! */
    return app({
        document: window.document,
        config: config,
        q: q,
        c6Db: c6Db,
        c6Ajax: c6Ajax,
        experience: experience,
        window: window,
        $: c6Query
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
