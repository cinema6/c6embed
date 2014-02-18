module.exports = function(deps) {
    'use strict';

    var sessionCount = 0,
        sessions = {};

    this.createSession = function(win) {
        var session = {
            id: sessionCount++,
            window: win
        };

        sessions[session.id] = session;

        return session;
    };

    this.destroySession = function(id) {
        var session = sessions[id],
            noop = function() {},
            value;

        for (var key in session) {
            value = session[key];

            if (typeof value === 'function') {
                session[key] = noop;
            } else {
                session[key] = undefined;
            }
        }

        delete sessions[id];
    };
};
