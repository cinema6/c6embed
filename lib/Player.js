/* jshint strict:false */

var formatUrl = require('url').format;
var extend = require('./fns').extend;
var PlayerSession = require('./PlayerSession');
var q = require('q');

function urlify(params) {
    return Object.keys(params).reduce(function(result, key) {
        var value = params[key];

        result[key] = (value instanceof Array) ? value.join(',') : value;

        return result;
    }, {});
}

function Player(endpoint, params, data) {
    this.frame = null;
    this.session = null;

    this.url = endpoint + formatUrl({ query: urlify(params) });
    this.data = extend(data);

    this.shown = false;
}

Player.prototype.bootstrap = function bootstrap(container/*, styles*/) {
    var styles = extend({ border: 'none' }, arguments[1], { opacity: '0' });

    var self = this;
    var frame = document.createElement('iframe');
    var session;

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
