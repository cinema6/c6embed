/* jshint strict:false */
var c6embed = require('./embed-js');
var extend = require('../../lib/fns').extend;

var ARRAY_ATTRS = ['categories', 'playUrls', 'countUrls', 'launchUrls'];
var BOOLEANS = {
    preview: false,
    autoLaunch: false,
    preload: false,
    standalone: false,
    interstitial: false,
    prebuffer: false
};

function toArray(arraylike) {
    return Array.prototype.slice.call(arraylike);
}

function embed() {
    var script = document.currentScript || (function(scripts) {
        return scripts[scripts.length - 1];
    }(toArray(document.querySelectorAll('script[data-splash]')).filter(function (script) {
        // If a <script> has already been parsed we don't want to use it.
        return !script.__c6Handled__;
    })));
    var params = extend(BOOLEANS, toArray(script.attributes).map(function(attribute) {
        var name, value;

        if (!(/^data-/).test(attribute.name)) { return [null, attribute.value]; }

        // Convert data attribute to camelcased JS property name.
        name = attribute.name.replace(/^data-/, '').replace(/-(.)/g, function(match, letter) {
            return letter.toUpperCase();
        });

        if (ARRAY_ATTRS.indexOf(name) > -1) {
            value = attribute.value.split(/,\s*/);
        } else if (name in BOOLEANS) {
            value = true;
        } else if (name === 'splash') {
            value = (function() {
                var parts = attribute.value.split('/');

                return {
                    type: parts[0],
                    ratio: parts[1]
                };
            }());
        } else {
            value = attribute.value;
        }

        return [name, value];
    }).reduce(function(params, set) {
        var key = set[0];
        var value = set[1];

        if (key) {
            params[key] = value;
        }

        return params;
    }, {}));

    script.__c6Handled__ = true;

    c6embed(script, params);
}

module.exports = embed;

if (!window.__karma__) { embed(); }
