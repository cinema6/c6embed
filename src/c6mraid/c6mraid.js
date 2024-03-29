/* jshint strict:false */
var MRAID = require('../../lib/iab').MRAID;
var Player = require('../../lib/Player');
var resolveUrl = require('url').resolve;
var extend = require('../../lib/fns').extend;
var globalLogger = require('rc-logger').default;
var viaPixel = require('rc-logger/senders/pixel');
var logger = globalLogger.context('c6mraid.js');

var PLAYER_EVENTS = ['launch', 'adStart', 'adCount', 'adEnded'];

function initLogger(config) {
    var levels = [
        { value: 0, levels: ['error'] },
        { value: 1, levels: ['info', 'warn'] },
        { value: 2, levels: ['log'] }
    ].filter(function(params) {
        return config.debug >= params.value;
    }).reduce(function(result, params) {
        return result.concat(params.levels);
    }, []);


    globalLogger.meta.container = config.container;
    globalLogger.meta.network = config.network;
    globalLogger.meta.app = config.hostApp;
    globalLogger.levels(levels);
}

globalLogger.tasks.send.push(viaPixel({
    url: 'https://logging.reelcontent.com/pixel.gif',
    addParams: function addParams(logger) {
        return {
            c: logger.meta.container,
            n: logger.meta.network,
            a: logger.meta.app
        };
    }
}));

module.exports = function c6mraid(params) {
    return Player.getParams(params, {
        type: 'full-np',
        forceOrientation: 'portrait'
    }).then(function init(config) {
        initLogger(config);

        var endpoint = resolveUrl(config.apiRoot, '/api/public/players/' + config.type);
        var player = new Player(endpoint, extend(config, {
            standalone: false,
            interstitial: true,
            context: 'mraid',
            autoLaunch: false
        }));
        var mraid = new MRAID({ forceOrientation: config.forceOrientation, useCustomClose: true });

        player.bootstrap(document.body, {
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
        }).then(function logPlayerLoaded() {
            logger.info('Player loaded.');
        });

        logger.info('Initialize.', config);

        mraid.on('error', function logError(message, action) {
            logger.error('MRAID Error:', message, action);
        });

        mraid.waitUntilViewable().then(function sendVisibleEvent() {
            logger.info(
                'MRAID is reporting ad is viewable. useCustomClose is', mraid.useCustomClose
            );

            mraid.on('stateChange', function(state) {
                logger.info('MRAID reports state changed to', state);
            });
        });

        window.addEventListener('message', function(event) {
            var data = (function() {
                try { return JSON.parse(event.data) || {}; } catch(e) { return {}; }
            }());
            if (PLAYER_EVENTS.indexOf(data.event) < 0) { return; }

            logger.info('Player event: ' + data.event, data);
        });

        return mraid.waitUntilViewable().then(function activatePlayer() {
            logger.info('Showing player.');

            player.show();

            player.session.on('close', function closeMRAID() {
                mraid.close();
            });
            mraid.on('stateChange', function handleAdStateChange(state) {
                if (state === 'hidden') {
                    logger.info('Hiding player.');
                    player.hide();
                }
            });
        });
    });
};
