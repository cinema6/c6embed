(function() {
    'use strict';

    describe('UserAgent', function() {
        var userAgentConfig = {
            macOS : {
                'PHANTOM' : {
                    agentString : 'Mozilla/5.0 (Macintosh; Intel Mac OS X) ' +
                                  'AppleWebKit/534.34 (KHTML, like Gecko) PhantomJS/1.8.1 Safari/534.34',
                    tests : {
                        app     : {
                            name  : function(o) { expect(o.app.name).toEqual('phantomjs'); },
                            version : function(o) { expect(o.app.version).toEqual('1.8.1'); }
                        },
                        device  : {
                            name  : function(o) { expect(o.device.name).toBeNull(); },
                            version : function(o) { expect(o.device.version).toBeNull(); },
                            isKindle : function(o){ expect(o.device.isKindle()).not.toBeTruthy(); },
                            isAndroid : function(o){ expect(o.device.isAndroid()).not.toBeTruthy(); },
                            isIPhone : function(o){ expect(o.device.isIPhone()).not.toBeTruthy(); },
                            isIPod : function(o){ expect(o.device.isIPod()).not.toBeTruthy(); },
                            isIPad : function(o){ expect(o.device.isIPad()).not.toBeTruthy(); },
                            isIOS : function(o){ expect(o.device.isIOS()).not.toBeTruthy(); },
                            isMobile : function(o){ expect(o.device.isMobile()).not.toBeTruthy(); }
                        },
                        os     : {
                            name  : function(o) { expect(o.os.name).toEqual('mac'); },
                            version : function(o) { expect(o.os.version).toBeNull(); }
                        }
                    }
                },
                'SAFARI6' : {
                    agentString : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_4) ' +
                                  'AppleWebKit/536.30.1 (KHTML, like Gecko) ' +
                                  'Version/6.0.5 Safari/536.30.1',
                    tests : {
                        app     : {
                            name  : function(o) { expect(o.app.name).toEqual('safari'); },
                            version : function(o) { expect(o.app.version).toEqual('6.0.5'); }
                        },
                        device  : {
                            name  : function(o) { expect(o.device.name).toBeNull(); },
                            version : function(o) { expect(o.device.version).toBeNull(); },
                            isKindle : function(o){ expect(o.device.isKindle()).not.toBeTruthy(); },
                            isAndroid : function(o){ expect(o.device.isAndroid()).not.toBeTruthy(); },
                            isIPhone : function(o){ expect(o.device.isIPhone()).not.toBeTruthy(); },
                            isIPod : function(o){ expect(o.device.isIPod()).not.toBeTruthy(); },
                            isIPad : function(o){ expect(o.device.isIPad()).not.toBeTruthy(); },
                            isIOS : function(o){ expect(o.device.isIOS()).not.toBeTruthy(); },
                            isMobile : function(o){ expect(o.device.isMobile()).not.toBeTruthy(); }
                        },
                        os     : {
                            name  : function(o) { expect(o.os.name).toEqual('mac'); },
                            version : function(o) { expect(o.os.version).toEqual('10.8.4'); }
                        }
                    }
                },
                'CHROME29' : {
                    agentString : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_4) ' +
                                  'AppleWebKit/537.36 (KHTML, like Gecko) ' +
                                  'Chrome/29.0.1547.65 Safari/537.36',
                    tests : {
                        app     : {
                            name  : function(o) { expect(o.app.name).toEqual('chrome'); },
                            version : function(o) { expect(o.app.version).toEqual('29.0.1547.65'); }
                        },
                        device  : {
                            name  : function(o) { expect(o.device.name).toBeNull(); },
                            version : function(o) { expect(o.device.version).toBeNull(); },
                            isKindle : function(o){ expect(o.device.isKindle()).not.toBeTruthy(); },
                            isAndroid : function(o){ expect(o.device.isAndroid()).not.toBeTruthy(); },
                            isIPhone : function(o){ expect(o.device.isIPhone()).not.toBeTruthy(); },
                            isIPod : function(o){ expect(o.device.isIPod()).not.toBeTruthy(); },
                            isIPad : function(o){ expect(o.device.isIPad()).not.toBeTruthy(); },
                            isIOS : function(o){ expect(o.device.isIOS()).not.toBeTruthy(); },
                            isMobile : function(o){ expect(o.device.isMobile()).not.toBeTruthy(); }
                        },
                        os     : {
                            name  : function(o) { expect(o.os.name).toEqual('mac'); },
                            version : function(o) { expect(o.os.version).toEqual('10.8.4'); }
                        }
                    }
                },
                'FIREFOX23' : {
                    agentString : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:23.0) ' +
                                  'Gecko/20100101 Firefox/23.0',
                    tests : {
                        app     : {
                            name  : function(o) { expect(o.app.name).toEqual('firefox'); },
                            version : function(o) { expect(o.app.version).toEqual('23.0'); }
                        },
                        device  : {
                            name  : function(o) { expect(o.device.name).toBeNull(); },
                            version : function(o) { expect(o.device.version).toBeNull(); },
                            isKindle : function(o){ expect(o.device.isKindle()).not.toBeTruthy(); },
                            isAndroid : function(o){ expect(o.device.isAndroid()).not.toBeTruthy(); },
                            isIPhone : function(o){ expect(o.device.isIPhone()).not.toBeTruthy(); },
                            isIPod : function(o){ expect(o.device.isIPod()).not.toBeTruthy(); },
                            isIPad : function(o){ expect(o.device.isIPad()).not.toBeTruthy(); },
                            isIOS : function(o){ expect(o.device.isIOS()).not.toBeTruthy(); },
                            isMobile : function(o){ expect(o.device.isMobile()).not.toBeTruthy(); }
                        },
                        os     : {
                            name  : function(o) { expect(o.os.name).toEqual('mac'); },
                            version : function(o) { expect(o.os.version).toEqual('10.8'); }
                        }
                    }
                }
            },
            windows7 : {
                'IE9'     : {
                    agentString : 'Mozilla/5.0 (compatible; MSIE 9.0; Windows NT 6.1; ' +
                                  'Trident/5.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; ' +
                                  '.NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E)',
                    tests : {
                        app     : {
                            name  : function(o) { expect(o.app.name).toEqual('msie'); },
                            version : function(o) { expect(o.app.version).toEqual('9.0'); }
                        },
                        device  : {
                            name  : function(o) { expect(o.device.name).toBeNull(); },
                            version : function(o) { expect(o.device.version).toBeNull(); },
                            isKindle : function(o){ expect(o.device.isKindle()).not.toBeTruthy(); },
                            isAndroid : function(o){ expect(o.device.isAndroid()).not.toBeTruthy(); },
                            isIPhone : function(o){ expect(o.device.isIPhone()).not.toBeTruthy(); },
                            isIPod : function(o){ expect(o.device.isIPod()).not.toBeTruthy(); },
                            isIPad : function(o){ expect(o.device.isIPad()).not.toBeTruthy(); },
                            isIOS : function(o){ expect(o.device.isIOS()).not.toBeTruthy(); },
                            isMobile : function(o){ expect(o.device.isMobile()).not.toBeTruthy(); }
                        },
                        os     : {
                            name  : function(o) { expect(o.os.name).toEqual('windows'); },
                            version : function(o) { expect(o.os.version).toEqual('6.1'); }
                        }
                    }
                },
                'IE10'    : {
                    agentString : 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; ' +
                                  'Trident/6.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; ' +
                                  '.NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C)',
                    tests : {
                        app     : {
                            name  : function(o) { expect(o.app.name).toEqual('msie'); },
                            version : function(o) { expect(o.app.version).toEqual('10.0'); }
                        },
                        device  : {
                            name  : function(o) { expect(o.device.name).toBeNull(); },
                            version : function(o) { expect(o.device.version).toBeNull(); },
                            isKindle : function(o){ expect(o.device.isKindle()).not.toBeTruthy(); },
                            isAndroid : function(o){ expect(o.device.isAndroid()).not.toBeTruthy(); },
                            isIPhone : function(o){ expect(o.device.isIPhone()).not.toBeTruthy(); },
                            isIPod : function(o){ expect(o.device.isIPod()).not.toBeTruthy(); },
                            isIPad : function(o){ expect(o.device.isIPad()).not.toBeTruthy(); },
                            isIOS : function(o){ expect(o.device.isIOS()).not.toBeTruthy(); },
                            isMobile : function(o){ expect(o.device.isMobile()).not.toBeTruthy(); }
                        },
                        os     : {
                            name  : function(o) { expect(o.os.name).toEqual('windows'); },
                            version : function(o) { expect(o.os.version).toEqual('6.1'); }
                        }
                    }
                }
            },
            windows8 : {
                'IE10'    : {
                    agentString : 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; ' +
                                  'Trident/6.0; .NET4.0E; .NET4.0C)',
                    tests : {
                        app     : {
                            name  : function(o) { expect(o.app.name).toEqual('msie'); },
                            version : function(o) { expect(o.app.version).toEqual('10.0'); }
                        },
                        device  : {
                            name  : function(o) { expect(o.device.name).toBeNull(); },
                            version : function(o) { expect(o.device.version).toBeNull(); },
                            isKindle : function(o){ expect(o.device.isKindle()).not.toBeTruthy(); },
                            isAndroid : function(o){ expect(o.device.isAndroid()).not.toBeTruthy(); },
                            isIPhone : function(o){ expect(o.device.isIPhone()).not.toBeTruthy(); },
                            isIPod : function(o){ expect(o.device.isIPod()).not.toBeTruthy(); },
                            isIPad : function(o){ expect(o.device.isIPad()).not.toBeTruthy(); },
                            isIOS : function(o){ expect(o.device.isIOS()).not.toBeTruthy(); },
                            isMobile : function(o){ expect(o.device.isMobile()).not.toBeTruthy(); }
                        },
                        os     : {
                            name  : function(o) { expect(o.os.name).toEqual('windows'); },
                            version : function(o) { expect(o.os.version).toEqual('6.2'); }
                        }
                    }
                }
            },
            ios : {
                'IPHONE_SAFARI_OS6'  : {
                    agentString : 'Mozilla/5.0 (iPhone; CPU iPhone OS 6_1_4 like Mac OS X) ' +
                                  'AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 ' +
                                  'Mobile/10B350 Safari/8536.25',
                    tests : {
                        app     : {
                            name  : function(o) { expect(o.app.name).toEqual('safari'); },
                            version : function(o) { expect(o.app.version).toEqual('6.0'); }
                        },
                        device  : {
                            name  : function(o) { expect(o.device.name).toEqual('iphone'); },
                            version : function(o) { expect(o.device.version).toBeNull(); },
                            isKindle : function(o){ expect(o.device.isKindle()).not.toBeTruthy(); },
                            isAndroid : function(o){ expect(o.device.isAndroid()).not.toBeTruthy(); },
                            isIPhone : function(o){ expect(o.device.isIPhone()).toBeTruthy(); },
                            isIPod : function(o){ expect(o.device.isIPod()).not.toBeTruthy(); },
                            isIPad : function(o){ expect(o.device.isIPad()).not.toBeTruthy(); },
                            isIOS : function(o){ expect(o.device.isIOS()).toBeTruthy(); },
                            isMobile : function(o){ expect(o.device.isMobile()).toBeTruthy(); }
                        },
                        os     : {
                            name  : function(o) { expect(o.os.name).toEqual('ios'); },
                            version : function(o) { expect(o.os.version).toEqual('6.1.4'); }
                        }
                    }
                },
                'IPAD_SAFARI_OS7'  : {
                    agentString : 'Mozilla/5.0 (iPad; CPU OS 7_0 like Mac OS X) ' +
                                  'AppleWebKit/537.51.1 (KHTML, like Gecko) Version/7.0 ' +
                                  'Mobile/11A465 Safari/9537.53',
                    tests : {
                        app     : {
                            name  : function(o) { expect(o.app.name).toEqual('safari'); },
                            version : function(o) { expect(o.app.version).toEqual('7.0'); }
                        },
                        device  : {
                            name  : function(o) { expect(o.device.name).toEqual('ipad'); },
                            version : function(o) { expect(o.device.version).toBeNull(); },
                            isKindle : function(o){ expect(o.device.isKindle()).not.toBeTruthy(); },
                            isAndroid : function(o){ expect(o.device.isAndroid()).not.toBeTruthy(); },
                            isIPhone : function(o){ expect(o.device.isIPhone()).not.toBeTruthy(); },
                            isIPod : function(o){ expect(o.device.isIPod()).not.toBeTruthy(); },
                            isIPad : function(o){ expect(o.device.isIPad()).toBeTruthy(); },
                            isIOS : function(o){ expect(o.device.isIOS()).toBeTruthy(); },
                            isMobile : function(o){ expect(o.device.isMobile()).toBeTruthy(); }
                        },
                        os     : {
                            name  : function(o) { expect(o.os.name).toEqual('ios'); },
                            version : function(o) { expect(o.os.version).toEqual('7.0'); }
                        }
                    }
                }
            },
            android : {
                'ANDROID_BROWSER': {
                    agentString: 'Mozilla/5.0 (Linux; U; Android 4.3; en-us; SGH-T999 Build/JSS15J) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
                    tests: {
                        app: {
                            name: function(o) { expect(o.app.name).toBe('android'); },
                            version: function(o) { expect(o.app.version).toBe('4.0'); }
                        },
                        device: {
                            name: function(o) { expect(o.device.name).toBe('android'); },
                            version: function(o) { expect(o.device.version).toBeNull(); },
                            isKindle: function(o) { expect(o.device.isKindle()).toBe(false); },
                            isAndroid: function(o) { expect(o.device.isAndroid()).toBe(true); },
                            isIPhone: function(o) { expect(o.device.isIPhone()).toBe(false); },
                            isIPod: function(o) { expect(o.device.isIPod()).toBe(false); },
                            isIPad: function(o) { expect(o.device.isIPad()).toBe(false); },
                            isIOS: function(o) { expect(o.device.isIOS()).toBe(false); },
                            isMobile: function(o) { expect(o.device.isMobile()).toBe(true); }
                        },
                        os: {
                            name: function(o) { expect(o.os.name).toBe('android'); },
                            version: function(o) { expect(o.os.version).toBe('4.3'); }
                        }
                    }
                },
                'CHROME': {
                    agentString: 'Mozilla/5.0 (Linux; Android 4.3; SGH-T999 Build/JSS15J) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.111 Mobile Safari/537.36',
                    tests: {
                        app: {
                            name: function(o) { expect(o.app.name).toBe('chrome'); },
                            version: function(o) { expect(o.app.version).toBe('42.0.2311.111'); }
                        },
                        device: {
                            name: function(o) { expect(o.device.name).toBe('android'); },
                            version: function(o) { expect(o.device.version).toBeNull(); },
                            isKindle: function(o) { expect(o.device.isKindle()).toBe(false); },
                            isAndroid: function(o) { expect(o.device.isAndroid()).toBe(true); },
                            isIPhone: function(o) { expect(o.device.isIPhone()).toBe(false); },
                            isIPod: function(o) { expect(o.device.isIPod()).toBe(false); },
                            isIPad: function(o) { expect(o.device.isIPad()).toBe(false); },
                            isIOS: function(o) { expect(o.device.isIOS()).toBe(false); },
                            isMobile: function(o) { expect(o.device.isMobile()).toBe(true); }
                        },
                        os: {
                            name: function(o) { expect(o.os.name).toBe('android'); },
                            version: function(o) { expect(o.os.version).toBe('4.3'); }
                        }
                    }
                },
                'DROID_BROWSER'  : {
                    agentString : 'Mozilla/5.0 (Linux; U; Android 4.1.2; en-us; ' +
                                  'DROID4 Build/9.8.2O-72_VZW-18) AppleWebKit/534.30 ' +
                                  '(KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
                    tests : {
                        app     : {
                            name  : function(o) { expect(o.app.name).toEqual('android'); },
                            version : function(o) { expect(o.app.version).toEqual('4.0'); }
                        },
                        device  : {
                            name  : function(o) { expect(o.device.name).toEqual('android'); },
                            version : function(o) { expect(o.device.version).toBeNull(); },
                            isKindle : function(o){ expect(o.device.isKindle()).not.toBeTruthy(); },
                            isAndroid : function(o){ expect(o.device.isAndroid()).toBeTruthy(); },
                            isIPhone : function(o){ expect(o.device.isIPhone()).not.toBeTruthy(); },
                            isIPod : function(o){ expect(o.device.isIPod()).not.toBeTruthy(); },
                            isIPad : function(o){ expect(o.device.isIPad()).not.toBeTruthy(); },
                            isIOS : function(o){ expect(o.device.isIOS()).not.toBeTruthy(); },
                            isMobile : function(o){ expect(o.device.isMobile()).toBeTruthy(); }
                        },
                        os     : {
                            name  : function(o) { expect(o.os.name).toEqual('android'); },
                            version : function(o) { expect(o.os.version).toEqual('4.1.2'); }
                        }
                    }
                },
                'KINDLE_FIRE'  : {
                    agentString : 'Mozilla/5.0 (Linux; U; en-us; KFOT Build/IML74K) ' +
                                  'AppleWebKit/535.19 (KHTML, like Gecko) Silk/3.4 ' +
                                  'Safari/535.19 Silk-Accelerated=true',
                    tests : {
                        app     : {
                            name  : function(o) { expect(o.app.name).toEqual('silk'); },
                            version : function(o) { expect(o.app.version).toEqual('3.4'); }
                        },
                        device  : {
                            name  : function(o) { expect(o.device.name).toEqual('kindle'); },
                            version : function(o) { expect(o.device.version).toBeNull(); },
                            isKindle : function(o){ expect(o.device.isKindle()).toBeTruthy(); },
                            isAndroid : function(o){ expect(o.device.isAndroid()).toBeTruthy(); },
                            isIPhone : function(o){ expect(o.device.isIPhone()).not.toBeTruthy(); },
                            isIPod : function(o){ expect(o.device.isIPod()).not.toBeTruthy(); },
                            isIPad : function(o){ expect(o.device.isIPad()).not.toBeTruthy(); },
                            isIOS : function(o){ expect(o.device.isIOS()).not.toBeTruthy(); },
                            isMobile : function(o){ expect(o.device.isMobile()).toBeTruthy(); }
                        },
                        os     : {
                            name  : function(o) { expect(o.os.name).toEqual('android'); },
                            version : function(o) { expect(o.os.version).toBeNull(); }
                        }
                    }
                }
            }
        };

        var $window = {}, userAgent;

        Object.keys(userAgentConfig).forEach(function($os){
            Object.keys(userAgentConfig[$os]).forEach(function($browser){
                describe('userAgent',function(){
                    $window.navigator = {};

                    describe('with userAgent ' + $os + '.' + $browser,function(){
                        beforeEach(function(){
                            var UserAgent = require('../../lib/UserAgent');

                            $window.navigator.userAgent = userAgentConfig[$os][$browser].agentString;

                            userAgent = new UserAgent({ window: $window });
                        });

                        describe('app',function(){
                            it('name',function(){
                                userAgentConfig[$os][$browser].tests.app.name(userAgent);
                            });
                            it('version',function(){
                                userAgentConfig[$os][$browser].tests.app.version(userAgent);
                            });
                        });

                        describe('device',function(){
                            it('name',function(){
                                userAgentConfig[$os][$browser].tests.device.name(userAgent);
                            });

                            it('version',function(){
                                userAgentConfig[$os][$browser].tests.device.version(userAgent);
                            });

                            it('isKindle',function(){
                                userAgentConfig[$os][$browser].tests.device.isKindle(userAgent);
                            });

                            it('isAndroid',function(){
                                userAgentConfig[$os][$browser].tests.device.isAndroid(userAgent);
                            });

                            it('isIPhone',function(){
                                userAgentConfig[$os][$browser].tests.device.isIPhone(userAgent);
                            });

                            it('isIPod',function(){
                                userAgentConfig[$os][$browser].tests.device.isIPod(userAgent);
                            });

                            it('isIPad',function(){
                                userAgentConfig[$os][$browser].tests.device.isIPad(userAgent);
                            });

                            it('isIOS',function(){
                                userAgentConfig[$os][$browser].tests.device.isIOS(userAgent);
                            });

                            it('isMobile',function(){
                                userAgentConfig[$os][$browser].tests.device.isMobile(userAgent);
                            });

                        });

                        describe('os',function(){
                            it('name',function(){
                                userAgentConfig[$os][$browser].tests.os.name(userAgent);
                            });
                            it('version',function(){
                                userAgentConfig[$os][$browser].tests.os.version(userAgent);
                            });
                        });
                    });
                });
            });
        });
    });
}());
