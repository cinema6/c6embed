module.exports = function(grunt) {
    'use strict';

    var path = require('path'),
        _ =require('underscore');

    var settings = grunt.file.readJSON('settings.json'),
        c6Settings = (function(settings) {
            function loadGlobalConfig(relPath) {
                var configPath = path.join(process.env.HOME, relPath),
                    configExists = grunt.file.exists(configPath);

                return configExists ? grunt.file.readJSON(configPath) : {};
            }

            _.extend(this, settings);

            this.openBrowser = process.env.GRUNT_BROWSER;

            this.saucelabs = loadGlobalConfig(settings.saucelabsJSON);
            this.browserstack = loadGlobalConfig(settings.browserstackJSON);
            this.aws = loadGlobalConfig(settings.awsJSON);

            return this;
        }.call({}, settings));

    if (!grunt.file.exists('.c6stubinit') && grunt.cli.tasks[0] !== 'init') {
        grunt.fail.warn('This project has not been initialized. Please run "grunt init".');
    }

    require('load-grunt-config')(grunt, {
        configPath: path.join(__dirname, 'tasks/options'),
        config: {
            settings: c6Settings
        }
    });

    grunt.loadTasks('tasks');

    /*********************************************************************************************
     *
     * SERVER TASKS
     *
     *********************************************************************************************/

    grunt.registerTask('server', 'start a development server', [
        'connect:sandbox',
        'open:server',
        'watch:livereload'
    ]);

    /*********************************************************************************************
     *
     * TEST TASKS
     *
     *********************************************************************************************/

    grunt.registerTask('test', 'run unit and E2E tests', [
        'test:unit',
        'test:e2e:all'
    ]);

    grunt.registerTask('test:unit', 'run unit tests', [
        'jshint:all',
        'clean:build',
        'ngtemplates:test',
        'karma:unit'
    ]);

    grunt.registerTask('test:unit:debug', 'run unit tests whenever files change', [
        'clean:build',
        'ngtemplates:test',
        'karma:debug',
        'watch:unit'
    ]);

    grunt.registerTask('test:e2e', 'run e2e tests on specified browser', function(browser, env) {
        var protractorTask;

        env = env || settings.defaultE2EEnv;
        protractorTask = 'protractor:' + ((browser === 'all') ? '' : browser) + ':' + (env);

        grunt.task.run('connect:sandbox');
        if (env === 'saucelabs') {
            grunt.task.run('sauceconnect:e2e');
        } else if (env === 'browserstack') {
            grunt.task.run('browserstacktunnel:e2e');
        } else if (env === 'local') {
            grunt.task.run('updatewebdriver');
        }
        grunt.task.run(protractorTask);
    });

    grunt.registerTask('test:e2e:debug', 'run e2e tests locally whenever files change', function(browser) {
        grunt.task.run('test:e2e:' + (browser || '') + ':local');
        grunt.task.run('watch:e2e:' + (browser || ''));
    });

    /*********************************************************************************************
     *
     * BUILD TASKS
     *
     *********************************************************************************************/

    grunt.registerTask('build', 'build app into distDir', [
        'test:unit',
        'git_last_commit',
        'clean:build',
        'copy:dist',
        'ngtemplates:dist',
        'htmlmin:dist',
        'sed',
        'cssmin:dist',
        'uglify:dist'
    ]);

    /*********************************************************************************************
     *
     * UPLOAD TASKS
     *
     *********************************************************************************************/

    grunt.registerTask('publish:collateral', 'upload collateral assets to s3', function(target) {
        grunt.task.run('versionator:dist');
        grunt.task.run('s3:collateral-' + target);
    });

    grunt.registerTask('publish:app', 'build and upload the application to s3', function(target) {
        grunt.task.run('build');
        grunt.task.run('s3:' + target);
    });

    grunt.registerTask('publish', 'upload the collateral assets and app to s3', function(target) {
        grunt.task.run('publish:collateral:' + target);
        grunt.task.run('publish:app:' + target);
    });
};
