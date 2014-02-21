module.exports = function(deps) {
    'use strict';

    var asEvented = deps.asEvented,
        q = deps.q,
        $window = deps.window;

    var sessionCount = 0,
        sessions = {},
        _private = {};

    _private.ping = function(win, event, type, data) {
        var message = { __c6__: { event: event, type: type, data: data } };

        win.postMessage(JSON.stringify(message), '*');
    };

    _private.newRequestId = function(session) {
        var id = 0;

        while (session._pending[id]) {
            id++;
        }

        return id;
    };

    _private.getSessionByWindow = function(win) {
        var id,
            session;

        for (id in sessions) {
            session = sessions[id];

            if (session.window === win) {
                return session;
            }
        }
    };

    _private.handleMessage = function(event) {
        var eventData = event.data,
            c6,
            eventName,
            type,
            typeName,
            typeId,
            data,
            session,
            done;

        try {
            c6 = JSON.parse(eventData).__c6__;
        } catch (err) {
            c6 = undefined;
        }

        if (!c6) { return; }

        eventName = c6.event;
        type = c6.type.split(':');
        typeName = type[0];
        typeId = type[1];
        data = c6.data;
        session = _private.getSessionByWindow(event.source);

        if (typeName === 'request') {
            done = function(response) {
                _private.ping(event.source, eventName, ('response:' + typeId), response);
            };

            session.trigger(eventName, data, done);
        } else if (typeName === 'response') {
            session._pending[typeId].resolve(data);
        } else if (typeName === 'ping') {
            session.trigger(eventName, data, function() {});
        }
    };

    this.createSession = function(win) {
        var session = {
            id: sessionCount++,
            window: win,
            _pending: {},

            ping: function(event, data) {
                _private.ping(this.window, event, 'ping', data);
            },

            request: function(event, data) {
                var deferred = q.defer(),
                    id = _private.newRequestId(this);

                this._pending[id] = deferred;

                _private.ping(this.window, event, ('request:' + id), data);

                return deferred.promise;
            }
        };

        asEvented.call(session);

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

    this.getSession = function(id) {
        return sessions[id];
    };

    $window.addEventListener('message', _private.handleMessage, false);

    if (!!window.__karma__) { this._private = _private; }
};
