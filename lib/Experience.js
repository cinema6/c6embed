module.exports = function(deps) {
    'use strict';

    var postmessage = deps.postmessage,
        q = deps.q,
        browserInfo = deps.browserInfo;

    var _private = {};

    _private.sessions = {};
    _private.decorateSession = function(session, experience) {
        session.experience = experience;
        session.ready = false;
    };

    /* @public */

    this.getSession = function(expId) {
        return (_private.sessions[expId] = _private.sessions[expId] || q.defer()).promise;
    };

    /* @private */

    this.registerExperience = function(experience, expWindow) {
        var session = postmessage.createSession(expWindow),
            expId = experience.id;

        _private.decorateSession(session, experience);

        session.once('handshake', function(data, respond) {
            respond({
                success: true,
                appData: {
                    experience: experience,
                    profile: browserInfo.profile
                }
            });
        });

        session.once('ready', function() {
            session.ready = true;
            (_private.sessions[expId] = _private.sessions[expId] || q.defer()).resolve(session);
        });

        return session;
    };

    this.deregisterExperience = function(expId) {
        var session = _private.sessions[expId];

        postmessage.destroySession(session.id);

        delete _private.sessions[expId];
    };

    if (window.__karma__) { this._private = _private; }
};
