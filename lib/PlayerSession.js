/* jshint strict:false */
var PostMessageSession = require('./PostMessageSession');
var inherits = require('util').inherits;
var q = require('q');
var extend = require('./fns').extend;

function PlayerSession() {
    var self = this;

    PostMessageSession.apply(this, arguments);
    this.__private__.posts = [];
    this.__private__.getHandshakeResponder = (function() {
        var promise = new q.Promise(function resolver(resolve) {
            self.once('handshake', function(data, respond) {
                resolve(respond);
            });
        });

        return function getHandshakeResponder() {
            return promise;
        };
    }());

    this.ready = false;

    this.once('ready', function() {
        var call;
        while ((call = this.__private__.posts.shift())) {
            PostMessageSession.prototype.post.apply(this, call);
        }

        this.ready = true;
    });
}
inherits(PlayerSession, PostMessageSession);

PlayerSession.prototype.post = function post(type, event, data/*, [id]*/) {
    var id;

    if (this.ready || type === 'response') {
        return PostMessageSession.prototype.post.apply(this, arguments);
    }

    id = arguments.length >= 4 ? arguments[3] : this.constructor.getID();
    this.__private__.posts.push([type, event, data, id]);

    return id;
};

PlayerSession.prototype.init = function init(data) {
    var self = this;

    return this.__private__.getHandshakeResponder().then(function shake(respond) {
        respond({ success: true, appData: extend(data, { version: 1 }) });

        return new q.Promise(function resolver(resolve) {
            self.once('ready', resolve.bind(null, self));
        });
    });
};

module.exports = PlayerSession;

PlayerSession.getID = PostMessageSession.getID;
