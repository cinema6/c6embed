/* jshint strict:false */
var extend = require('../../lib/fns').extend;
var querystring = require('querystring');
var PlayerSession = require('../../lib/PlayerSession');
var EventEmitter = require('events').EventEmitter;

function createPlayer(slot, src, width, height) {
    var iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.width = width + 'px';
    iframe.height = height + 'px';
    iframe.style.border = 'none';
    iframe.style.opacity = '0';
    iframe.style.position = 'absolute';
    iframe.style.top = '0';
    iframe.style.left = '0';

    slot.appendChild(iframe);

    return iframe;
}

function getVPAIDAd() {
    var emitter = new EventEmitter();

    var player = null;
    var session = null;
    var state = {
        adLinear: true,
        adWidth: null,
        adHeight: null,
        adExpanded: false,
        adSkippableState: true,
        adRemainingTime: -2,
        adDuration: -2,
        adVolume: -1,
        adCompanions: '',
        adIcons: false
    };

    return {
        getAdLinear: function getAdLinear() {
            return state.adLinear;
        },

        getAdWidth: function getAdWidth() {
            return state.adWidth;
        },

        getAdHeight: function getAdHeight() {
            return state.adHeight;
        },

        getAdExpanded: function getAdExpanded() {
            return state.adExpanded;
        },

        getAdSkippableState: function getAdSkippableState() {
            return state.adSkippableState;
        },

        getAdRemainingTime: function getAdRemainingTime() {
            return state.adRemainingTime;
        },

        getAdDuration: function getAdDuration() {
            return state.adDuration;
        },

        getAdVolume: function getAdVolume() {
            return state.adVolume;
        },
        setAdVolume: function setAdVolume() {},

        getAdCompanions: function getAdCompanions() {
            return state.adCompanions;
        },

        getAdIcons: function getAdIcons() {
            return state.adIcons;
        },

        handshakeVersion: function handshakeVersion() {
            return '2.0';
        },

        initAd: function initAd(width, height, viewMode, desiredBitrate, creativeData, environmentVars) {
            var self = this;
            var config = JSON.parse(creativeData.AdParameters);
            var playerURI = config.uri + '?' + querystring.stringify(extend({
                standalone: false,
                interstitial: true,
                container: 'vpaid'
            }, config.params, {
                vpaid: true,
                autoLaunch: false,
                context: 'vpaid'
            }));

            player = createPlayer(environmentVars.slot, playerURI, width, height);
            session = new PlayerSession(player.contentWindow);
            session.init({}).then(function() { emitter.emit('AdLoaded'); });

            state.adWidth = width;
            state.adHeight = height;

            session.on('vpaid:stateUpdated', function updateState(update) {
                var prop = update.prop;
                var value = update.value;
                var event = update.event;
                var params = update.params || [];
                var valueChanged = prop && (value !== state[prop]);
                var shouldEmit = event && (!prop || valueChanged);

                if (valueChanged) {
                    state[prop] = value;
                }

                if (shouldEmit) {
                    emitter.emit.apply(emitter, [event].concat(params));
                }
            });

            session.on('error', function emitAdError(message) {
                emitter.emit('AdError', message);
                self.stopAd();
            });

            session.on('cardComplete', function stopAd() {
                self.stopAd();
            });

            session.on('close', function skipAd() {
                self.skipAd();
            });
        },

        resizeAd: function resizeAd(width, height/*, viewMode*/) {
            player.width = width + 'px';
            player.height = height + 'px';

            state.adWidth = width;
            state.adHeight = height;
            emitter.emit('AdSizeChange');
        },

        startAd: function startAd() {
            session.ping('show');
            session.once('open', function showPlayer() {
                player.style.opacity = '1';
                emitter.emit('AdStarted');
                emitter.emit('AdImpression');
            });
        },

        stopAd: function stopAd() {
            player.parentNode.removeChild(player);
            emitter.emit('AdStopped');

            emitter.removeAllListeners();
            player = null;
            session = null;
        },

        pauseAd: function pauseAd() {
            session.ping('vpaid:pauseAd');
        },

        resumeAd: function resumeAd() {
            session.ping('vpaid:resumeAd');
        },

        expandAd: function expandAd() {},

        collapseAd: function collapseAd() {},

        skipAd: function skipAd() {
            if (!this.getAdSkippableState()) { return; }

            emitter.emit('AdSkipped');
            return this.stopAd();
        },

        subscribe: function subscribe(fn, event, listenerScope) {
            // Create a function that is bound to the specified listenerScope
            var boundFn = fn.bind(listenerScope);
            // Store a reference to the original fn so we know which boundFn to remove when the
            // original is passed to unsubscribe()
            boundFn.orig = fn;

            // Register the boundFn with the emitter
            emitter.addListener(event, boundFn);
        },

        unsubscribe: function unsubscribe(fn, event) {
            emitter.removeListener(event, (function(listeners) {
                var length = listeners.length;

                // Find the boundFn we created for this fn
                while (length--) {
                    if (listeners[length].orig === fn) {
                        return listeners[length];
                    }
                }
            }(emitter.listeners(event))));
        }
    };
}

module.exports = getVPAIDAd;
