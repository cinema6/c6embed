/* jshint strict: false */
var q = require('q');
var Player = require('../../lib/Player');
var resolveUrl = require('url').resolve;
var extend = require('../../lib/fns').extend;
var importScripts = require('../../lib/importScripts');
var twobits = require('twobits.js');
var BrowserInfo = require('rc-browser-info');

var LIGHTBOX_TYPES = ['mobile', 'swipe', 'lightbox', 'lightbox-playlist'];
var PLAYER_STYLES = {
    position:   'absolute',
    top:        '0px',
    left:       '0px',
    width:      '100%',
    height:     '100%',
    zIndex:     '-100'
};

function noop() {}

function pick(object, keys) {
    return keys.reduce(function(result, key) {
        result[key] = object[key];
        return result;
    }, {});
}

function importDeps(deps) {
    return new q.Promise(function callImportScripts(resolve) {
        return importScripts(deps, function(/*...modules*/) {
            return resolve(Array.prototype.slice.call(arguments));
        });
    });
}

function c6embed(beforeElement/*, params*/) {
    var params = extend({
        apiRoot: 'https://platform.reelcontent.com/',
        type: 'light',
        container: 'embed',
        mobileType: 'mobile',
        splash: {
            type: 'img-text-overlay',
            ratio: '16:9'
        },
        autoLaunch: false
    }, arguments[1]);

    var browser = new BrowserInfo(window.navigator.userAgent);
    var apiRoot = params.apiRoot;
    var autoLaunch = !!params.autoLaunch;
    var interstitial = !!params.interstitial;
    var standalone = autoLaunch && !interstitial;
    var preload = params.preload;
    var type = browser.isMobile ? params.mobileType : params.type;
    var isLightbox = LIGHTBOX_TYPES.indexOf(type) > -1;
    var experienceId = params.experience;
    var endpoint = resolveUrl(apiRoot, '/api/public/players/' + type);
    var player = new Player(endpoint, extend(params, {
        standalone: standalone,
        context: 'embed'
    }));
    var embed = document.createElement('div');
    var styleController = (function() {
        var responsiveStyles = null;
        var originalStyles = null;

        function applyStyles(styles) {
            Object.keys(styles || {}).forEach(function(key) {
                embed.style[key] = styles[key];
            });
        }

        return {
            set: function set(styles) {
                responsiveStyles = extend(styles);

                return this;
            },

            apply: function apply() {
                originalStyles = pick(embed.style, Object.keys(responsiveStyles || {}));
                applyStyles(responsiveStyles);

                return this;
            },

            clear: function clear() {
                applyStyles(originalStyles);

                return this;
            }
        };
    }());
    var lightboxes = document.getElementById('c6-lightboxes') || (function(lightboxes) {
        lightboxes.id = 'c6-lightboxes';
        lightboxes.style.position = 'relative';
        lightboxes.style.width = '0px';
        lightboxes.style.height = '0px';
        lightboxes.style.overflow = 'hidden';

        document.body.appendChild(lightboxes);

        return lightboxes;
    }(document.createElement('div')));

    function loadExperience(settings, preload) {
        if (!player.bootstrapped) {
            player.bootstrap(isLightbox ? lightboxes : embed, PLAYER_STYLES);
        }

        if (!preload) {
            player.show();
        }
    }

    function createSplash() {
        var splash = document.createElement('div');
        var splashJsUrl = resolveUrl(apiRoot, '/collateral/splash/splash.js');
        var splashHtmlUrl = resolveUrl(apiRoot, '/collateral/splash/' + params.splash.type + '/' +
            params.splash.ratio.split(':').join('-') + '.js');
        var splashImage = params.image && resolveUrl(apiRoot, params.image);

        function loadBranding(branding, splash) {
            var id = 'c6-' + branding;
            var link;

            if (branding && !document.getElementById(id)) {
                link = document.createElement('link');
                link.id = id;
                link.rel = 'stylesheet';
                link.href = resolveUrl(apiRoot, '/collateral/branding/' + branding + '/styles/splash.css');

                document.head.appendChild(link);
            }

            splash.className = 'c6brand__' + branding;
        }

        if (autoLaunch) {
            splash.style.display = 'none';
        }

        loadBranding(params.branding, splash);
        embed.appendChild(splash);

        splash.addEventListener('mouseenter', function handleMouseenter() {
            q().then(function preload() { return loadExperience(null, true); });

            splash.removeEventListener('mouseenter', handleMouseenter, false);
        }, false);

        return importDeps([splashJsUrl, splashHtmlUrl]).spread(function init(splashJs, splashHtml) {
            var splashDelegate;

            player.once('bootstrap', function addPlayerListeners() {
                player.session.on('open', function() {
                    splashDelegate.didShow();
                });
                player.session.on('close', function() {
                    splashDelegate.didHide();
                    splash.style.display = '';
                });
            });

            splash.innerHTML = splashHtml;
            twobits.parse(splash)({
                title: params.title || null,
                splash: splashImage || null
            });
            splashDelegate = extend(
                { didShow: noop, didHide: noop },
                splashJs({ loadExperience: loadExperience }, null, splash)
            );
        });
    }

    embed.className = 'c6embed-' + experienceId;
    embed.style.position = 'relative';
    embed.style.width = params.width;
    embed.style.height = params.height;

    return (standalone ? q() : createSplash()).then(function go() {
        player.once('bootstrap', function addPlayerListeners() {
            player.session.on('open', function() {
                styleController.apply();
                player.frame.style.zIndex = '100';
            });
            player.session.on('close', function() {
                styleController.clear();
                player.frame.style.zIndex = PLAYER_STYLES.zIndex;
            });
            player.session.on('responsiveStyles', function(styles) {
                styleController.set(styles);

                if (player.shown) { styleController.apply(); }
            });

            if (isLightbox) {
                player.session.on('open', function fullscreen() {
                    player.frame.style.position = 'fixed';
                    player.frame.style.zIndex = '9007199254740992';
                });
                player.session.on('close', function unfullscreen() {
                    player.frame.style.position = PLAYER_STYLES.position;
                });
            }
        });

        beforeElement.parentNode.insertBefore(embed, beforeElement);

        if (preload || autoLaunch) {
            loadExperience(null, true);
        }

        return embed;
    });
}

module.exports = c6embed;
