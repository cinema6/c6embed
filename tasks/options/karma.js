(function() {
    'use strict';

    module.exports = {
        options: {
            configFile: 'test/karma.conf.js'
        },
        unit: {
            options: {
                reporters: ['progress', 'junit'],
                junitReporter: {
                    outputFile: 'reports/unit.xml'
                }
            }
        },
        debug: {
            options: {
                singleRun: false,
                background: true
            }
        }
    };
})();
