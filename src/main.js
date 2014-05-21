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

    /* Create and Configure C6DB */
    var Cinema6Adapter = require('../lib/c6db/adapters/Cinema6'),
        C6DB = require('../lib/c6db/C6DB'),
        cinema6Adapter = new Cinema6Adapter({
            c6Ajax: c6Ajax,
            q: q
        }),
        c6Db = new C6DB({
            q: q
        });
    cinema6Adapter.apiBase = config.apiBase;
    c6Db.adapter = cinema6Adapter;

    /* Create and Configure DocumentParser */
    var DocumentParser = require('./DocumentParser'),
        documentParser = new DocumentParser();

    /* Create and Configure FrameFactory */
    var FrameFactory = require('./FrameFactory'),
        frameFactory = new FrameFactory({
            $: c6Query,
            documentParser: documentParser
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

    /* Create GA Tracker */
    /* jshint sub:true, asi:true, expr:true, camelcase:false, indent:false */
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','__c6_ga__');
    /* jshint sub:false, asi:false, expr:false, indent:4 */

    window.__c6_ga__('create', config.gaAcctId, {
        'name'       : 'c6',
        'cookieName' : '_c6ga'
    });
    window.__c6_ga__('c6.require', 'displayfeatures');

    window.__c6_ga__('c6.send', 'pageview', {
        'page'  : '/embed/main?experienceId=' + config.experienceId,
        'title' : 'c6Embed Main'
    });
    /* jshint camelcase:true */

    /* Run the Application! */
    return app({
        window: window,
        frameFactory: frameFactory,
        $: c6Query,
        Q: q,
        c6Db: c6Db,
        config: config,
        c6Ajax: c6Ajax,
        documentParser: documentParser,
        browserInfo: browserInfo,
        experienceService: experience,
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
