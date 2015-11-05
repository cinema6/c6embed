var extend = require('./fns').extend;

function loadAnalyticsJS(name) {
    /* jshint sub:true, asi:true, expr:true, camelcase:false, indent:false */
    'use strict';

    if (window[name]) { return; }

    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js',name);
}

function googleAnalytics(global, name, accountId, params) {
    'use strict';

    var cacheKey = (global + ':' + name);
    var tracker;

    if (googleAnalytics.trackers[cacheKey]) {
        if (arguments.length > 2) {
            throw new Error(
                'Cannot specify accountId or params for GA tracker [' + name + '] because it ' +
                'has already been created.'
            );
        }

        return googleAnalytics.trackers[cacheKey];
    }

    tracker = function tracker(method) {
        var args = Array.prototype.slice.call(arguments, 1);

        return window[global].apply(window, [name + '.' + method].concat(args));
    };

    loadAnalyticsJS(global);
    window[global]('create', accountId, extend(params, { name: name }));

    /* jshint boss:true */
    return (googleAnalytics.trackers[cacheKey] = tracker);
}
googleAnalytics.trackers = {};

module.exports = googleAnalytics;
