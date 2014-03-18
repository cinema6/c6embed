(function() {
    'use strict';

    describe('BrowserInfo', function() {
        var BrowserInfo,
            C6Query,
            browserInfo,
            $;

        var userAgent,
            modernizr,
            mockWindow,
            testFrame,
            testDoc;

        beforeEach(function(done) {
            var body = document.getElementsByTagName('body')[0];

            function waitForReady() {
                if (testDoc.readyState === 'complete') {
                    done();
                } else {
                    setTimeout(waitForReady, 50);
                }
            }

            testFrame = document.createElement('iframe');

            testFrame.src = 'about:blank';
            testFrame.width = '800';
            testFrame.height = '600';

            body.appendChild(testFrame);
            testDoc = testFrame.contentWindow.document;

            testDoc.open('text/html', 'replace');
            testDoc.write([
                '<html>',
                '    <head>',
                '        <title>My Page</title>',
                '    </head>',
                '    <body>',
                '        <p>Hello World!</p>',
                '    </body>',
                '</html>'
            ].join('\n'));
            testDoc.close();

            setTimeout(waitForReady, 50);

            BrowserInfo = require('../../lib/BrowserInfo');
            C6Query = require('../../lib/C6Query');

            mockWindow = {
                screen: {
                    width: 1920,
                    height: 1080
                },
                navigator: {
                    mimeTypes: {}
                }
            };

            modernizr = {
                touch: 'touch',
                canvas: 'canvas',
                localstorage: 'localstorage',
                prefixed: jasmine.createSpy('modernizr prefixed').and.returnValue(function() {}),
                webp: false,
                cors: false
            };

            userAgent = {
                app: {
                    name: null,
                    version: null
                },
                device: {
                    isIPhone: function() { return false; },
                    isIPod: function() { return false; },
                    isIPad: function() { return false; },
                    isIOS: function() { return this.isIPhone() || this.isIPod() || this.isIPad(); },
                    isMobile: function() { return false; }
                },
                os: {
                    name: null,
                    version: null
                }
            };

            $ = new C6Query({ window: testFrame.contentWindow, document: testDoc });

            browserInfo = new BrowserInfo({ userAgent: userAgent, modernizr: modernizr, window: mockWindow, $: $ });
        });

        afterEach(function() {
            document.getElementsByTagName('body')[0].removeChild(testFrame);
        });

        it('should exist', function() {
            expect(browserInfo).toEqual(jasmine.any(Object));
        });

        describe('@public', function() {
            describe('properties', function() {
                describe('profile', function() {
                    it('should be set to the result of the generateProfile() method', function() {
                        expect(browserInfo.profile).toEqual(browserInfo.generateProfile());
                    });
                });
            });

            describe('methods', function() {
                describe('generateProfile()', function() {
                    var profile;

                    describe('on an iOS device running >= iOS 7.1', function() {
                        beforeEach(function() {
                            userAgent.app.name = 'safari';
                            userAgent.os.name = 'ios';
                            userAgent.os.version = '7.1.0';
                            userAgent.device.isIOS = function() { return true; };
                        });

                        describe('minimalUi', function() {
                            describe('if there are no viewport metatags', function() {
                                beforeEach(function() {
                                    profile = browserInfo.generateProfile();
                                });

                                it('should be false', function() {
                                    expect(profile.minimalUi).toBe(false);
                                });
                            });

                            describe('if there are viewport metatags, but minimal-ui is not set', function() {
                                beforeEach(function() {
                                    var $viewport1 = $('<meta name="viewport" content="width=device-width">'),
                                        $viewport2 = $('<meta name="viewport" content="initial-scale=2.3, user-scalable=no">'),
                                        $head = $('head');

                                    $head.append($viewport1);
                                    $head.append($viewport2);

                                    profile = browserInfo.generateProfile();
                                });

                                it('should be false', function() {
                                    expect(profile.minimalUi).toBe(false);
                                });
                            });

                            describe('if the minimal-ui value is set', function() {
                                beforeEach(function() {
                                    var $viewport1 = $('<meta name="viewport" content="width=device-width">'),
                                        $viewport2 = $('<meta name="viewport" content="initial-scale=2.3,user-scalable=no, minimal-ui">'),
                                        $head = $('head');

                                    $head.append($viewport1);
                                    $head.append($viewport2);

                                    profile = browserInfo.generateProfile();
                                });

                                it('should be true', function() {
                                    expect(profile.minimalUi).toBe(true);
                                });
                            });
                        });
                    });

                    describe('on an iOS device running < iOS 7.1', function() {
                        beforeEach(function() {
                            userAgent.app.name = 'safari';
                            userAgent.os.name = 'ios';
                            userAgent.os.version = '7.0.6';
                            userAgent.device.isIOS = function() { return true; };
                        });

                        describe('minimalUi', function() {
                            describe('if the minimal-ui value is set', function() {
                                beforeEach(function() {
                                    var $viewport1 = $('<meta name="viewport" content="width=device-width,minimal-ui">'),
                                        $viewport2 = $('<meta name="viewport" content="initial-scale=2.3,user-scalable=no">'),
                                        $head = $('head');

                                    $head.append($viewport1);
                                    $head.append($viewport2);

                                    profile = browserInfo.generateProfile();
                                });

                                it('should be false', function() {
                                    expect(profile.minimalUi).toBe(false);
                                });
                            });
                        });
                    });

                    describe('on an iOS device running < iOS 7', function() {
                        beforeEach(function() {
                            userAgent.app.name = 'safari';
                            userAgent.os.name = 'ios';
                            userAgent.os.version = '6.1.4';
                            userAgent.device.isIOS = function() { return true; };

                            profile = browserInfo.generateProfile();
                        });

                        it('should be false', function() {
                            expect(profile.raf).toBe(false);
                        });
                    });

                    describe('on an iOS device running greater than iOS 7', function() {
                        beforeEach(function() {
                            userAgent.app.name = 'safari';
                            userAgent.os.name = 'ios';
                            userAgent.os.version = '8.1.2';
                            userAgent.device.isIOS = function() { return true; };

                            profile = browserInfo.generateProfile();
                        });

                        it('should be true', function() {
                            expect(profile.raf).toBe(true);
                        });
                    });

                    describe('on an iphone', function() {
                        beforeEach(function() {
                            userAgent.app.name = 'safari';
                            userAgent.app.version = '6';
                            userAgent.os.version = '6.1.2';
                            userAgent.device.isIPhone = function() { return true; };

                            profile = browserInfo.generateProfile();
                        });

                        describe('inlineVideo', function() {
                            it('should be false', function() {
                                expect(profile.inlineVideo).toBe(false);
                            });
                        });

                        describe('multiPlayer', function() {
                            it('should be false', function() {
                                expect(profile.multiPlayer).toBe(false);
                            });
                        });

                        describe('canvasVideo', function() {
                            it('should be false', function() {
                                expect(profile.canvasVideo).toBe(false);
                            });
                        });
                    });

                    describe('on an ipod', function() {
                        beforeEach(function() {
                            userAgent.app.name = 'safari';
                            userAgent.app.version = '6';
                            userAgent.os.version = '6.1.2';
                            userAgent.device.isIPod = function() { return true; };

                            profile = browserInfo.generateProfile();
                        });

                        describe('inlineVideo', function() {
                            it('should be false', function() {
                                expect(profile.inlineVideo).toBe(false);
                            });
                        });

                        describe('multiPlayer', function() {
                            it('should be false', function() {
                                expect(profile.multiPlayer).toBe(false);
                            });
                        });

                        describe('canvasVideo', function() {
                            it('should be false', function() {
                                expect(profile.canvasVideo).toBe(false);
                            });
                        });
                    });

                    describe('on an iPad', function() {
                        beforeEach(function() {
                            userAgent.app.name = 'safari';
                            userAgent.app.version = '6';
                            userAgent.os.version = '6.1.2';
                            userAgent.device.isIPad = function() { return true; };

                            profile = browserInfo.generateProfile();
                        });

                        describe('inlineVideo', function() {
                            it('should be true', function() {
                                expect(profile.inlineVideo).toBe(true);
                            });
                        });

                        describe('multiPlayer', function() {
                            it('should be false', function() {
                                expect(profile.multiPlayer).toBe(false);
                            });
                        });

                        describe('canvasVideo', function() {
                            it('should be false', function() {
                                expect(profile.canvasVideo).toBe(false);
                            });
                        });
                    });

                    describe('on a Kindle Fire', function() {
                        beforeEach(function() {
                            userAgent.app.name = 'silk';

                            profile = browserInfo.generateProfile();
                        });

                        describe('inlineVideo', function() {
                            it('should be false', function() {
                                expect(profile.inlineVideo).toBe(false);
                            });
                        });

                        describe('multiPlayer', function() {
                            it('should be false', function() {
                                expect(profile.multiPlayer).toBe(false);
                            });
                        });

                        describe('canvasVideo', function() {
                            it('should be false', function() {
                                expect(profile.canvasVideo).toBe(false);
                            });
                        });
                    });

                    describe('on desktop safari', function() {
                        beforeEach(function() {
                            userAgent.app.name = 'safari';
                            userAgent.app.version = '7';
                            userAgent.os.name = 'mac';

                            profile = browserInfo.generateProfile();
                        });

                        describe('inlineVideo', function() {
                            it('should be true', function() {
                                expect(profile.inlineVideo).toBe(true);
                            });
                        });

                        describe('multiPlayer', function() {
                            it('should be true', function() {
                                expect(profile.multiPlayer).toBe(true);
                            });
                        });

                        describe('canvasVideo', function() {
                            describe('mac os 10.6 or less', function() {
                                beforeEach(function() {
                                    userAgent.os.version = '10.6.0';

                                    profile = browserInfo.generateProfile();
                                });

                                it('should be true', function() {
                                    expect(profile.canvasVideo).toBe(true);
                                });
                            });

                            describe('mac os 10.7 or greater', function() {
                                it('should be false', function() {
                                    userAgent.os.version = '10.7.2';
                                    profile = browserInfo.generateProfile();
                                    expect(profile.canvasVideo).toBe(false);

                                    userAgent.os.version = '10.8.7';
                                    profile = browserInfo.generateProfile();
                                    expect(profile.canvasVideo).toBe(false);

                                    userAgent.os.version = '10.9.0';
                                    profile = browserInfo.generateProfile();
                                    expect(profile.canvasVideo).toBe(false);

                                    userAgent.os.version = '10.10.2';
                                    profile = browserInfo.generateProfile();
                                    expect(profile.canvasVideo).toBe(false);
                                });
                            });
                        });
                    });

                    describe('on everything', function() {
                        beforeEach(function() {
                            profile = browserInfo.generateProfile();
                        });

                        describe('touch', function() {
                            it('should use the modernizr touch test', function() {
                                expect(profile.touch).toBe(modernizr.touch);
                            });
                        });

                        describe('canvas', function() {
                            it('should use the modernizr canvas test', function() {
                                expect(profile.canvas).toBe(modernizr.canvas);
                            });
                        });

                        describe('localstorage', function() {
                            it('should use the modernizr localstorage test', function() {
                                expect(profile.localstorage).toBe(modernizr.localstorage);
                            });
                        });

                        describe('raf', function() {
                            it('should use the modernizr prefixed test', function() {
                                expect(modernizr.prefixed).toHaveBeenCalledWith('requestAnimationFrame', mockWindow);
                            });

                            it('should cast the result to a bool', function() {
                                expect(profile.raf).toBe(true);
                            });
                        });

                        describe('resolution', function() {
                            it('should concat the screen resolution into a string', function() {
                                function resolution() {
                                    return browserInfo.generateProfile().resolution;
                                }

                                expect(resolution()).toBe('1920x1080');

                                mockWindow.screen = { width: 800, height: 600 };
                                expect(resolution()).toBe('800x600');
                            });
                        });

                        describe('flash', function() {
                            function flash() {
                                return browserInfo.generateProfile().flash;
                            }

                            describe('on some old version of ie or something', function() {
                                describe('if there is no flash', function() {
                                    it('should be false', function() {
                                        expect(flash()).toBe(false);
                                    });
                                });

                                describe('if there is flash', function() {
                                    beforeEach(function() {
                                        mockWindow.ActiveXObject = function() {};
                                    });

                                    it('should be true', function() {
                                        expect(flash()).toBe(true);
                                    });
                                });
                            });

                            describe('on a modern browser', function() {
                                describe('if there is no flash', function() {
                                    it('should be false', function() {
                                        expect(flash()).toBe(false);
                                    });
                                });

                                describe('if there is flash', function() {
                                    beforeEach(function() {
                                        mockWindow.navigator.mimeTypes['application/x-shockwave-flash'] = {};
                                    });

                                    it('should be true', function() {
                                        expect(flash()).toBe(true);
                                    });
                                });
                            });
                        });

                        describe('webp', function() {
                            it('should use the modernizr test', function() {
                                function webp() {
                                    return browserInfo.generateProfile().webp;
                                }

                                expect(webp()).toBe(false);

                                modernizr.webp = true;
                                expect(webp()).toBe(true);
                            });
                        });

                        describe('device', function() {
                            function device() {
                                return browserInfo.generateProfile().device;
                            }

                            describe('if resolution is <= 518400', function() {
                                beforeEach(function() {
                                    mockWindow.screen = { width: 720, height: 720 };
                                });

                                it('should be a phone', function() {
                                    expect(device()).toBe('phone');

                                    mockWindow.screen = { width: 320, height: 568 };
                                    expect(device()).toBe('phone');

                                    mockWindow.screen = { width: 960, height: 540 };
                                    expect(device()).toBe('phone');
                                });
                            });

                            describe('if resolution is <= 786432', function() {
                                beforeEach(function() {
                                    mockWindow.screen = { width: 1024, height: 768 };
                                });

                                describe('if there is touch', function() {
                                    beforeEach(function() {
                                        modernizr.touch = true;
                                    });

                                    it('should be a tablet', function() {
                                        expect(device()).toBe('tablet');

                                        mockWindow.screen = { width: 1024, height: 600 };
                                        expect(device()).toBe('tablet');
                                    });
                                });

                                describe('if there is no touch', function() {
                                    beforeEach(function() {
                                        modernizr.touch = false;
                                    });

                                    it('should be a netbook', function() {
                                        expect(device()).toBe('netbook');

                                        mockWindow.screen = { width: 1024, height: 600 };
                                        expect(device()).toBe('netbook');
                                    });
                                });
                            });

                            describe('if the resolution is greater than 786432', function() {
                                beforeEach(function() {
                                    mockWindow.screen = { width: 1280, height: 800 };
                                });

                                it('should be a desktop', function() {
                                    expect(device()).toBe('desktop');

                                    mockWindow.screen = { width: 1920, height: 1080 };
                                    expect(device()).toBe('desktop');
                                });
                            });
                        });

                        describe('cors', function() {
                            it('should use the modernizr test', function() {
                                function cors() {
                                    return browserInfo.generateProfile().cors;
                                }

                                expect(cors()).toBe(false);

                                modernizr.cors = true;
                                expect(cors()).toBe(true);
                            });
                        });

                        describe('autoplay', function() {
                            beforeEach(function() {
                                userAgent.device.isMobile = function() { return true; };
                            });

                            it('should be true as long as the device is not mobile', function() {
                                function autoplay() {
                                    return browserInfo.generateProfile().autoplay;
                                }

                                expect(autoplay()).toBe(false);

                                userAgent.device.isMobile = function() { return false; };
                                expect(autoplay()).toBe(true);
                            });
                        });
                    });
                });
            });
        });
    });
}());
