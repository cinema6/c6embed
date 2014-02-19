module.exports = function(deps) {
    'use strict';

    var modernizr = deps.modernizr,
        $window = deps.window,
        userAgent = deps.userAgent;

    this.generateProfile = function() {
        var profile = {},
            screen = $window.screen;

        profile.inlineVideo = !(userAgent.device.isIPhone() || userAgent.device.isIPod() || userAgent.app.name === 'silk');

        profile.multiPlayer = !(userAgent.device.isIOS() || userAgent.app.name === 'silk');

        profile.canvasVideo = (function() {
            var macOSXVersion = (function() {
                    var version = (userAgent.os.name === 'mac' &&
                                    (userAgent.os.version) &&
                                    (userAgent.os.version.match(/(\d+\.\d+)/)));
                    return (version || null) && version[0] && version[0].split('.');
                })(),
                badVersion = true;

            if (macOSXVersion){
                macOSXVersion[0] = parseInt(macOSXVersion[0],10);
                macOSXVersion[1] = parseInt(macOSXVersion[1],10);
                if (macOSXVersion[0] < 10) {
                    badVersion = false;
                } else
                if ((macOSXVersion[0] === 10) && (macOSXVersion[1] < 7)){
                    badVersion = false;
                }
            }

            return !(userAgent.device.isIOS() ||
                    userAgent.app.name === 'silk' ||
                    userAgent.app.name === 'safari' && badVersion);
        })();

        profile.touch = modernizr && modernizr.touch;

        profile.canvas = modernizr && modernizr.canvas;

        profile.localstorage = modernizr && modernizr.localstorage;

        profile.raf = (function() {
            var majorIOSVersion;

            if (userAgent.device.isIOS()) {
                majorIOSVersion = userAgent.os.version.split('.')[0];

                if (majorIOSVersion < 7) {
                    return false;
                }
            }

            return modernizr && !!modernizr.prefixed('requestAnimationFrame', $window);
        })();

        profile.resolution = (screen.width + 'x' + screen.height);

        profile.flash = (function() {
            try {
                var flashObject = new $window.ActiveXObject('ShockwaveFlash.ShockwaveFlash');

                return !!flashObject;
            } catch(e) {
                return !!$window.navigator.mimeTypes['application/x-shockwave-flash'];
            }
        })();

        profile.webp = modernizr.webp;

        profile.device = (function() {
            var touch = profile.touch,
                pixels = screen.width * screen.height;

            if (pixels <= 518400) {
                return 'phone';
            } else if (pixels <= 786432) {
                if (touch) {
                    return 'tablet';
                } else {
                    return 'netbook';
                }
            } else {
                return 'desktop';
            }
        }());

        profile.cors = modernizr.cors;

        profile.autoplay = !userAgent.device.isMobile();

        return profile;
    };

    this.profile = this.generateProfile();
};
