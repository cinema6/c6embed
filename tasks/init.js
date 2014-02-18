module.exports = function(grunt) {
    'use strict';

    var prompt = require('prompt'),
        Q = require('q'),
        escapeRegExp = require('escape-regexp');

    grunt.registerTask('init', 'Initialize the Stub project', function() {
        var settings = grunt.file.readJSON('settings.json'),
            pkg = grunt.file.readJSON('package.json'),
            originalModule = grunt.template.process(settings.appModule),
            getInput = Q.nbind(prompt.get, prompt),
            done = this.async();

        function process(template) {
            return grunt.template.process(template, {
                data: {
                    package: pkg,
                    settings: settings
                }
            });
        }

        function format(description, rawDefault) {
            var processedDefault = process(rawDefault + '');

            return description + ' [' + processedDefault + ']';
        }

        function copyResult(result, config) {
            for (var key in result) {
                config[key] = result[key];
            }
        }

        function handleError(error) {
            grunt.fail.fatal(error);
        }

        function makeModifications() {
            var scripts = grunt.file.expand([
                settings.appDir + '/assets/scripts/**/*.js',
                'test/spec/**/*.{ut,it}.js'
            ]);

            // Write new package.json
            grunt.file.write('package.json', JSON.stringify(pkg, null, '  '));
            grunt.config.set('package', pkg);
            grunt.log.ok('Wrote package.json');

            // Write new settings.json
            grunt.file.write('settings.json', JSON.stringify(settings, null, '    '));
            grunt.config.set('settings', settings);
            grunt.log.ok('Wrote settings.json');

            // Insert module name into scripts
            scripts.forEach(function(script) {
                var file = grunt.file.read(script);

                file = file.replace(new RegExp(escapeRegExp(originalModule), 'g'), process(settings.appModule));

                grunt.file.write(script, file);
                grunt.log.ok('Wrote ' + script);
            });
        }

        function writeInitFile() {
            grunt.file.write('.c6stubinit', Date.now());
            grunt.log.ok('Wrote init file (.c6stubinit)');
        }

        getInput([{
            name: 'name',
            type: 'string',
            description: format('Name for this app', pkg.name),
            default: pkg.name
        }])
            .then(function(result) {
                copyResult(result, pkg);
                pkg.keywords = [result.name];

                return getInput([{
                    name: 'version',
                    type: 'string',
                    description: format('Version number', '0.0.1'),
                    default: '0.0.1'
                }]);
            })
            .then(function(result) {
                copyResult(result, pkg);

                return getInput([{
                    name: 'repoUrl',
                    type: 'string',
                    description: format('Git repo url', pkg.repository.url),
                    default: pkg.repository.url
                }]);
            })
            .then(function(result) {
                pkg.repository.url = result.repoUrl;

                return getInput([{
                    name: 'appDir',
                    type: 'string',
                    description: format('App directory', settings.appDir),
                    default: settings.appDir
                }]);
            })
            .then(function(result) {
                copyResult(result, settings);

                return getInput([{
                    name: 'distDir',
                    type: 'string',
                    description: format('Dist Directory (for building)', settings.distDir),
                    default: settings.distDir
                }]);
            })
            .then(function(result) {
                copyResult(result, settings);

                return getInput([{
                    name: 'appUrl',
                    type: 'string',
                    description: format('App URL (url to put in iframe)', settings.appUrl),
                    default: settings.appUrl
                }]);
            })
            .then(function(result) {
                copyResult(result, settings);

                return getInput([{
                    name: 'appModule',
                    type: 'string',
                    description: format('Angular App Module Name', settings.appModule),
                    default: settings.appModule
                }]);
            })
            .then(function(result) {
                copyResult(result, settings);

                return getInput([{
                    name: 'sandboxPort',
                    type: 'string',
                    description: format('Port for Dev Server', settings.sandboxPort),
                    default: settings.sandboxPort
                }]);
            })
            .then(function(result) {
                settings.sandboxPort = parseInt(result.sandboxPort, 10);

                return getInput([{
                    name: 'collateralDir',
                    type: 'string',
                    description: format('Collateral Asset Directory', settings.collateralDir),
                    default: settings.collateralDir
                }]);
            })
            .then(function(result) {
                copyResult(result, settings);

                return getInput([{
                    name: 'experiencesJSON',
                    type: 'string',
                    description: format('Mock experiences.json File Location', settings.experiencesJSON),
                    default: settings.experiencesJSON
                }]);
            })
            .then(function(result) {
                copyResult(result, settings);

                return getInput([{
                    name: 'libUrl',
                    type: 'string',
                    description: format('Location of Lib Assets for Use in Unit Tests', settings.libUrl),
                    default: settings.libUrl
                }]);
            })
            .then(function(result) {
                copyResult(result, settings);

                return getInput([{
                    name: 'awsJSON',
                    type: 'string',
                    description: format('Location of AWS Keys JSON File Relative to Home Dir', settings.awsJSON),
                    default: settings.awsJSON
                }]);
            })
            .then(function(result) {
                copyResult(result, settings);

                return getInput([{
                    name: 'saucelabsJSON',
                    type: 'string',
                    description: format('Location of SauceLabs Keys JSON File Relative to Home Dir', settings.saucelabsJSON),
                    default: settings.saucelabsJSON
                }]);
            })
            .then(function(result) {
                copyResult(result, settings);

                return getInput([{
                    name: 'browserstackJSON',
                    type: 'string',
                    description: format('Location of BrowserStack Keys JSON File Relative to Home Dir', settings.browserstackJSON),
                    default: settings.browserstackJSON
                }]);
            })
            .then(function(result) {
                copyResult(result, settings);

                return getInput([{
                    name: 'defaultE2EEnv',
                    type: 'string',
                    message: format('Default E2E Testing Environment. Can be local, saucelabs or browserstack.', settings.defaultE2EEnv),
                    validator: /(local|saucelabs|browserstack)/,
                    default: settings.defaultE2EEnv
                }]);
            })
            .then(function(result) {
                copyResult(result, settings);

                return getInput([{
                    name: 's3TestBucket',
                    type: 'string',
                    description: format('S3 Bucket for Testing', settings.s3.test.bucket),
                    default: settings.s3.test.bucket
                }]);
            })
            .then(function(result) {
                settings.s3.test.bucket = result.s3TestBucket;

                return getInput([{
                    name: 's3TestCollateral',
                    type: 'string',
                    description: format('S3 Collateral Dir for Testing', settings.s3.test.collateral),
                    default: settings.s3.test.collateral
                }]);
            })
            .then(function(result) {
                settings.s3.test.collateral = result.s3TestCollateral;

                return getInput([{
                    name: 's3TestApp',
                    type: 'string',
                    description: format('S3 App Dir for Testing', settings.s3.test.app),
                    default: settings.s3.test.app
                }]);
            })
            .then(function(result) {
                settings.s3.test.app = result.s3TestApp;

                return getInput([{
                    name: 's3ProdBucket',
                    type: 'string',
                    description: format('S3 Bucket for Production', settings.s3.production.bucket),
                    default: settings.s3.production.bucket
                }]);
            })
            .then(function(result) {
                settings.s3.production.bucket = result.s3ProdBucket;

                return getInput([{
                    name: 's3ProdCollateral',
                    type: 'string',
                    description: format('S3 Collateral Dir for Production', settings.s3.production.collateral),
                    default: settings.s3.production.collateral
                }]);
            })
            .then(function(result) {
                settings.s3.production.collateral = result.s3ProdCollateral;

                return getInput([{
                    name: 's3ProdApp',
                    type: 'string',
                    description: format('S3 App Dir for Production', settings.s3.production.app),
                    default: settings.s3.production.app
                }]);
            })
            .then(function(result) {
                settings.s3.production.app = result.s3ProdApp;
            })
            .then(makeModifications)
            .then(function() {
                return getInput([{
                    name: 'createExp',
                    type: 'string',
                    message: 'Would you like to create an experience now? [y/n]',
                    validator: /y[es]*|n[o]?/,
                    warning: 'Must respond "y" or "n"',
                    default: 'y'
                }]);
            })
            .then(function(result) {
                var createExp = result.createExp;

                if (createExp === 'y' || createExp === 'yes') {
                    grunt.task.run('createexp');
                }
            })
            .then(writeInitFile)
            .then(done, handleError);
    });
};
