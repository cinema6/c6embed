module.exports = function(deps) {
    'use strict';

    var modernizr = deps.modernizr,
        $window = deps.window,
        userAgent = deps.userAgent,
        $ = deps.$;

    this.generateProfile = function() {
        var profile = {},
            screen = $window.screen,
            osVersion;

        function versionInfo(string) {
            var parts = string.split('.').map(function(num) {
                return parseInt(num, 10);
            });

            return {
                major: parts[0],
                minor: parts[1],
                fix: parts[2],
                isAtLeast: function(version) {
                    version = versionInfo(version);

                    if (this.major < version.major) {
                        return false;
                    } else if (this.major > version.major) {
                        return true;
                    }

                    if (this.minor < version.minor) {
                        return false;
                    } else if (this.minor > version.minor) {
                        return true;
                    }

                    if (this.fix < version.fix) {
                        return false;
                    } else if (this.fix > version.fix) {
                        return true;
                    }

                    return true;
                },
                isLessThan: function(version) {
                    version = versionInfo(version);

                    if (this.major > version.major) {
                        return false;
                    } else if (this.major < version.major) {
                        return true;
                    }

                    if (this.minor > version.minor) {
                        return false;
                    } else if (this.minor < version.minor) {
                        return true;
                    }

                    if (this.fix > version.fix) {
                        return false;
                    } else if (this.fix < version.fix) {
                        return true;
                    }

                    return false;
                },
                isEqualTo: function(version) {
                    version = versionInfo(version);

                    return this.major === version.major &&
                        this.minor === version.minor &&
                        this.fix === version.fix;
                }
            };
        }

        osVersion = versionInfo(userAgent.os.version || '');

        profile.inlineVideo = !(userAgent.device.isIPhone() || userAgent.device.isIPod() || userAgent.app.name === 'silk');

        profile.multiPlayer = !(userAgent.device.isIOS() || userAgent.app.name === 'silk');

        profile.canvasVideo = (function() {
            return !(userAgent.device.isIOS() ||
                    userAgent.app.name === 'silk' ||
                    userAgent.app.name === 'safari' && osVersion.isAtLeast('10.7.0'));
        })();

        profile.touch = modernizr && modernizr.touch;

        profile.canvas = modernizr && modernizr.canvas;

        profile.localstorage = modernizr && modernizr.localstorage;

        profile.raf = (function() {
            if (userAgent.device.isIOS() && osVersion.isLessThan('7.0.0')) {
                return false;
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

        profile.minimalUi = (function() {
            var $viewports,
                values;

            if (!userAgent.device.isIOS() ||
                userAgent.device.isIOS() && osVersion.isLessThan('7.1.0')) {
                return false;
            }

            $viewports = $('meta[name=viewport]');

            if (!$viewports.length) {
                return false;
            }

            values = [];

            $viewports.forEach(function(meta) {
                var $meta = $(meta);

                values.push($meta.attr('content'));
            });

            values = values.join(',').split(',').map(function(value) {
                return value.replace(/\s+/g, '');
            });

            return values.indexOf('minimal-ui') > -1;
        }());

        return profile;
    };

    this.profile = this.generateProfile();
};
