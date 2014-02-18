(function() {
    /* jshint camelcase:false */
    'use strict';

    module.exports = {
        options: {
            envs: {
                local: {
                    config: {}
                },
                saucelabs: {
                    config: {
                        sauceUser: '<%= settings.saucelabs.user %>',
                        sauceKey: '<%= settings.saucelabs.key %>'
                    }
                },
                browserstack: {
                    config: {
                        seleniumAddress: 'http://hub.browserstack.com/wd/hub',
                        capabilities: {
                            'browserstack.debug': true,
                            'browserstack.user': '<%= settings.browserstack.user %>',
                            'browserstack.key': '<%= settings.browserstack.key %>',
                            'browserstack.tunnel': true
                        }
                    }
                }
            },
            config: {
                seleniumArgs: ['-browserTimeout=60'],
                jasmineNodeOpts: {
                    defaultTimeoutInterval: 45000
                },
                capabilities: {
                    name: '<%= package.name %>',
                },
                specs: [
                    'test/e2e/setup.js',
                    'test/e2e/common/**/*.e2e.js'
                ]
            }
        },
        chrome: {
            config: {
                specs: ['test/e2e/chrome/**/*.e2e.js'],
                capabilities: {
                    browserName: 'chrome',
                    browser: 'Chrome',
                    browser_version: '31.0',
                    os: 'Windows',
                    os_version: '7'
                }
            }
        },
        firefox: {
            config: {
                specs: ['test/e2e/firefox/**/*.e2e.js'],
                capabilities: {
                    browserName: 'firefox',
                    browser: 'Firefox',
                    browser_version: '25.0',
                    os: 'Windows',
                    os_version: '7'
                }
            }
        },
        safari: {
            config: {
                specs: ['test/e2e/safari/**/*.e2e.js'],
                capabilities: {
                    browserName: 'safari',
                    browser: 'Safari',
                    browser_version: '7',
                    os: 'OS X',
                    os_version: 'Mavericks'
                }
            }
        },
        ie: {
            config: {
                specs: ['test/e2e/ie/**/*.e2e.js'],
                capabilities: {
                    browserName: 'internet explorer',
                    browser: 'IE',
                    browser_version: '10',
                    os: 'Windows',
                    os_version: '8'
                }
            }
        },
        ipad: {
            config: {
                specs: ['test/e2e/ipad/**/*.e2e.js'],
                capabilities: {
                    platform: 'MAC',
                    browserName: 'iPad',
                    device: 'iPad 3rd (7.0)'
                }
            }
        },
        iphone: {
            config: {
                specs: ['test/e2e/iphone/**/*.e2e.js'],
                capabilities: {
                    platform: 'MAC',
                    browserName: 'iPhone',
                    device: 'iPhone 5S'
                }
            }
        }
    };
})();
