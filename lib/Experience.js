module.exports = function(deps) {
    'use strict';

    var postmessage = deps.postmessage,
        q = deps.q,
        browserInfo = deps.browserInfo;

    var _private = {};

    function extend() {
        return Array.prototype.slice.call(arguments)
            .reduce(function(result, object) {
                Object.keys(object).forEach(function(key) {
                    result[key] = object[key];
                });

                return result;
            }, {});
    }

    _private.decorateSession = function(session, experience) {
        session.experience = experience;
        session.ready = false;

        session._readyDeferred = q.defer();
        session.ensureReadiness = function() {
            return this._readyDeferred.promise;
        };

        session.destroy = function() {
            postmessage.destroySession(this.id);
        };
    };

    /* @public */

    this.registerExperience = function(experience, expWindow, _appData) {
        var session = postmessage.createSession(expWindow),
            appData = _appData || {};

        _private.decorateSession(session, experience);

        session.once('handshake', function(data, respond) {
            respond({
                success: true,
                appData: extend(appData, {
                    experience: experience,
                    profile: appData.profile || browserInfo.profile,
                    version: 1
                })
            });
        });

        session.once('ready', function() {
            session.ready = true;
            session._readyDeferred.resolve(session);
        });

        return session;
    };

    if (window.__karma__) { this._private = _private; }
};
