module.exports = function(config) {
    // Karma configuration
    'use strict';

    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '..',

        frameworks: ['jasmine', 'commonjs'],

        plugins: [
            'karma-commonjs',
            'karma-jasmine',
            'karma-junit-reporter',
            'karma-phantomjs-launcher',
            'karma-chrome-launcher'
        ],

        // list of files / patterns to load in the browser
        files: [
            'node_modules/q/q.js',
            'node_modules/asEvented/asevented.js',
            { pattern: 'src/embed.js', included: false },
            { pattern: 'src/widget.js', included: false },
            { pattern: 'test/helpers/collateral/**/*.js', included: false },
            { pattern: 'test/helpers/api/**/*.js', included: false },
            'lib/**/*.js',
            'src/**/*.js',
            'test/spec/**/*.js',
            'test/helpers/**/*.js'
        ],

        exclude: [
            'src/main.js'
        ],

        preprocessors: {
            'node_modules/q/q.js': ['commonjs'],
            'node_modules/asEvented/asevented.js': ['commonjs'],
            'lib/**/*.js': ['commonjs'],
            'src/**/!(embed|widget).js': ['commonjs'],
            'test/spec/**/*.js': ['commonjs'],
            'test/helpers/*.js': ['commonjs']
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
        singleRun: true
    });
};
