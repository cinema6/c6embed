/* jshint strict:false */
var extend = require('../../lib/fns').extend;
var Player = require('../../lib/Player');
var EventEmitter = require('events').EventEmitter;
var querystring = require('querystring');
var resolveUrl = require('url').resolve;

function getVPAIDAd() {
    var emitter = new EventEmitter();

    var player = null;
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
            var adParams = creativeData.AdParameters;
            var config = adParams.charAt(0) === '{' ?
                JSON.parse(adParams) : querystring.parse(adParams);
            var apiRoot = config.apiRoot || 'https://platform.reelcontent.com/';
            var type = config.type || 'desktop-card';
            var uri = config.uri || resolveUrl(apiRoot, '/api/public/players/' + type);
            var params = config.params || config;

            player = new Player(uri, extend({
                standalone: false,
                interstitial: true,
                container: 'vpaid'
            }, params, {
                vpaid: true,
                autoLaunch: false,
                context: 'vpaid'
            }));

            player.bootstrap(environmentVars.slot, {
                width: width + 'px',
                height: height + 'px',
                position: 'absolute',
                top: 0,
                left: 0
            }).then(function() { emitter.emit('AdLoaded'); });

            state.adWidth = width;
            state.adHeight = height;

            player.session.on('vpaid:stateUpdated', function updateState(update) {
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

            player.session.on('error', function emitAdError(message) {
                emitter.emit('AdError', message);
                self.stopAd();
            });

            player.session.on('cardComplete', function stopAd() {
                self.stopAd();
            });

            player.session.on('close', function skipAd() {
                self.skipAd();
            });

            player.session.once('video:play', function countImpression() {
                emitter.emit('AdImpression');
                emitter.emit('AdStarted');
            });
        },

        resizeAd: function resizeAd(width, height/*, viewMode*/) {
            player.frame.width = width + 'px';
            player.frame.height = height + 'px';

            state.adWidth = width;
            state.adHeight = height;
            emitter.emit('AdSizeChange');
        },

        startAd: function startAd() {
            player.show();
        },

        stopAd: function stopAd() {
            player.frame.parentNode.removeChild(player.frame);
            emitter.emit('AdStopped');

            emitter.removeAllListeners();
            player = null;
        },

        pauseAd: function pauseAd() {
            player.session.ping('vpaid:pauseAd');
        },

        resumeAd: function resumeAd() {
            player.session.ping('vpaid:resumeAd');
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
