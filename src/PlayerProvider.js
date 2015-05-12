module.exports = function(deps) {
    'use strict';

    var postmessage = deps.postmessage;
    var Q = deps.q;

    function extend() {
        return Array.prototype.slice.call(arguments)
            .reduce(function(result, object) {
                return Object.keys(object).reduce(function(result, key) {
                    result[key] = object[key];
                    return result;
                }, result);
            }, {});
    }

    function Player(appWindow) {
        var player = this;

        this.experience = null;
        this.session = postmessage.createSession(appWindow);
        this.ready = false;

        this.__private__ = {
            respond: null,
            readyDeferred: Q.defer()
        };

        this.session.once('handshake', function(data, respond) {
            player.__private__.respond = respond;
        });
        this.session.once('ready', function() {
            player.ready = true;
            player.__private__.readyDeferred.resolve(player.session);
        });
    }
    Player.prototype = {
        bootstrap: function(data) {
            var respond = this.__private__.respond;
            var response = {
                success: true,
                appData: extend(data, {
                    version: 1
                })
            };

            if (respond) {
                respond(response);
            } else {
                this.session.once('handshake', function(data, respond) {
                    respond(response);
                });
            }

            return this;
        },

        getReadySession: function() {
            return this.__private__.readyDeferred.promise;
        }
    };

    return Player;
};
