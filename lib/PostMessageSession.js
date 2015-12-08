/* jshint strict:false */
var RCPostMessageSession = require('rc-post-message-session');
var inherits = require('util').inherits;
var q = require('q');

function PostMessageSession() {
    RCPostMessageSession.apply(this, arguments);
}
inherits(PostMessageSession, RCPostMessageSession);

PostMessageSession.prototype.request = function request() {
    return q(RCPostMessageSession.prototype.request.apply(this, arguments));
};

module.exports = PostMessageSession;

Object.keys(RCPostMessageSession).forEach(function(key) {
    if (!(key in PostMessageSession)) {
        PostMessageSession[key] = RCPostMessageSession[key];
    }
});
