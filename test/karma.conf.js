module.exports = function(config) {
    // Karma configuration
    'use strict';

    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '..',

        frameworks: ['browserify', 'jasmine'],

        plugins: [
            'karma-jshint',
            'karma-browserify',
            'karma-jasmine',
            'karma-junit-reporter',
            'karma-phantomjs-launcher',
            'karma-chrome-launcher'
        ],

        // list of files / patterns to load in the browser
        files: [
            { pattern: 'test/helpers/collateral/**/*.js', included: false },
            { pattern: 'test/helpers/api/**/*.js', included: false },
            { pattern: 'test/helpers/scripts/**/*.js', included: false },
            { pattern: 'test/helpers/**/*.html', included: false },
            { pattern: 'test/main.js', watched: false },
            { pattern: 'test/spec/**/*.js', watched: false }
        ],

        preprocessors: {
            'lib/**/*.js': ['jshint', 'browserify'],
            'src/app/**/*.js': ['jshint', 'browserify'],
            'src/embed/**/*.js': ['jshint', 'browserify'],
            'src/**/*.js': ['jshint'],
            'test/spec/**/*.js': ['browserify'],
            'test/helpers/*.js': ['browserify']
        },

        // test results reporter to use
        // possible values: dots || progress || growl
        reporters: ['progress'],

        // web server port
        port: 8000,

        // cli runner port
        runnerPort: 9100,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS'],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 5000,

        // Continuous Integration mode
        // if true, it capture browsers, run tests and exit
        singleRun: true,

        browserify: {
            debug: true,
            transform: ['browserify-shim'],
            plugin: ['proxyquireify/plugin']
        }
    });
};
