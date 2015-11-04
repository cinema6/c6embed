/* jshint strict: false */
var q = require('q');
var Player = require('../../lib/Player');
var resolveUrl = require('url').resolve;
var extend = require('../../lib/fns').extend;
var importScripts = require('../../lib/importScripts');
var twobits = require('twobits.js');
var BrowserInfo = require('cwrx/lib/browserInfo');

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

function c6embed(beforeElement/*, params*/) {
    var params = extend({
        apiRoot: 'https://portal.cinema6.com/',
        type: 'light',
        container: 'embed',
        mobileType: 'mobile'
    }, arguments[1]);

    var browser = new BrowserInfo(window.navigator.userAgent);
    var apiRoot = params.apiRoot;
    var type = browser.isMobile ? params.mobileType : params.type;
    var isLightbox = LIGHTBOX_TYPES.indexOf(type) > -1;
    var experienceId = params.experience;
    var endpoint = resolveUrl(apiRoot, '/api/public/players/' + type);
    var player = new Player(endpoint, extend(pick(params, [
        'experience', 'campaign', 'container', 'categories',
        'branding', 'placementId', 'wildCardPlacement', 'pageUrl', 'mobileType',
        'hostApp', 'network',
        'playUrls', 'countUrls', 'launchUrls', 'preview'
    ]), { autoLaunch: false, standalone: false, context: 'embed' }));
    var embed = document.createElement('div');
    var splash = document.createElement('div');
    var splashJsUrl = resolveUrl(apiRoot, '/collateral/splash/splash.js');
    var splashHtmlUrl = resolveUrl(apiRoot, '/collateral/splash/' + params.splash.type + '/' +
        params.splash.ratio.split(':').join('-') + '.js');
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

    loadBranding(params.branding, splash);

    embed.className = 'c6embed-' + experienceId;
    embed.style.position = 'relative';
    embed.style.width = params.width;
    embed.style.height = params.height;
    embed.appendChild(splash);

    return new q.Promise(function loadAsyncDeps(resolve) {
        importScripts([
            splashJsUrl, splashHtmlUrl
        ], function(splashJs, splashHtml) {
            var splashDelegate;

            function loadExperience(settings, preload) {
                if (!player.bootstrapped) {
                    player.bootstrap(isLightbox ? lightboxes : embed, PLAYER_STYLES);
                }

                if (!preload) {
                    player.show();
                }
            }

            splash.addEventListener('mouseenter', function handleMouseenter() {
                q().then(function preload() { return loadExperience(null, true); });

                splash.removeEventListener('mouseenter', handleMouseenter, false);
            }, false);

            player.once('bootstrap', function addPlayerListeners() {
                player.session.on('open', function() {
                    splashDelegate.didShow();
                    styleController.apply();
                    player.frame.style.zIndex = '100';
                });
                player.session.on('close', function() {
                    splashDelegate.didHide();
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

            splash.innerHTML = splashHtml;
            twobits.parse(splash)({
                title: params.title,
                splash: resolveUrl(apiRoot, params.image)
            });
            splashDelegate = extend(
                { didShow: noop, didHide: noop },
                splashJs({ loadExperience: loadExperience }, null, splash)
            );

            beforeElement.parentNode.insertBefore(embed, beforeElement);

            if (params.preload) {
                loadExperience(null, true);
            }

            if (params.autoLaunch) {
                loadExperience(null, false);
            }

            resolve(embed);
        });
    });
}

module.exports = c6embed;
