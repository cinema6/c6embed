/* jshint strict:false */

var formatUrl = require('url').format;
var resolveUrl = require('url').resolve;
var extend = require('./fns').extend;
var PlayerSession = require('./PlayerSession');
var q = require('q');
var inherits = require('util').inherits;
var EventEmitter = require('events').EventEmitter;
var importScripts = require('./importScripts');

function urlify(params) {
    return Object.keys(params).reduce(function(result, key) {
        var value = params[key];

        result[key] = (value instanceof Array) ? value.join(',') : value;

        return result;
    }, {});
}

function pick(object, keys) {
    return keys.reduce(function(result, key) {
        if (key in object) {
            result[key] = object[key];
        }

        return result;
    }, {});
}

Player.getParams = function getParams(params, defaults) {
    var placement = params.placement;
    var apiRoot = params.apiRoot || 'https://platform.reelcontent.com/';

    function createParams(placement) {
        var placementParams = placement && placement.tagParams;

        return extend({ apiRoot: apiRoot }, defaults, placementParams, params);
    }

    if (!placement) {
        return q(createParams());
    }

    return importScripts([
        resolveUrl(apiRoot, '/api/public/placements/' + placement + '.js')
    ]).spread(createParams);
};

function Player(endpoint, params, data) {
    this.frame = null;
    this.session = null;

    this.url = endpoint + formatUrl({ query: urlify(extend(pick(params, [
        'experience', 'card', 'campaign', 'container', 'categories',
        'branding', 'mobileType',
        'hostApp', 'network', 'ex', 'vr', 'placement', 'uuid',
        'playUrls', 'countUrls', 'clickUrls', 'launchUrls',
        'autoLaunch', 'prebuffer', 'countdown', 'autoplay',
        'context', 'standalone', 'interstitial', 'vpaid', 'preview', 'debug'
    ]), { embed: true })) });
    this.data = extend(data);

    this.shown = false;
    this.bootstrapped = false;
}
inherits(Player, EventEmitter);

Player.prototype.bootstrap = function bootstrap(container/*, styles*/) {
    var styles = extend({ border: 'none' }, arguments[1], { opacity: '0' });

    var self = this;
    var frame = document.createElement('iframe');
    var session;

    if (this.bootstrapped) { return q.reject(new Error('Player cannot be bootstrapped again.')); }

    this.bootstrapped = true;

    Object.keys(styles).forEach(function(key) {
        frame.style[key] = styles[key];
    });
    frame.src = this.url;

    container.appendChild(frame);
    session = new PlayerSession(frame.contentWindow);

    session.on('open', function() {
        self.shown = true;
        frame.style.opacity = 1;
    });
    session.on('close', function() {
        self.shown = false;
        frame.style.opacity = 0;
    });

    this.frame = frame;
    this.session = session;

    this.emit('bootstrap');

    return session.init(this.data).thenResolve(this);
};

Player.prototype.show = function show() {
    var self = this;
    var session = this.session;

    if (this.shown) { return q(this); }

    session.ping('show');

    return new q.Promise(function(resolve) {
        session.once('open', function() { resolve(self); });
    });
};

Player.prototype.hide = function hide() {
    var self = this;
    var session = this.session;

    if (!this.shown) { return q(this); }

    session.ping('hide');

    return new q.Promise(function(resolve) {
        session.once('close', function() { resolve(self); });
    });
};

module.exports = Player;
