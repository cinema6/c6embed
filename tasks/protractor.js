module.exports = function(grunt) {
    'use strict';

    var spawn = require('child_process').spawn;

    grunt.registerMultiTask('protractor', 'execute protractor in a given environment', function(env) {
        var options = this.options({
                envs: {},
                config: {},
                configFile: 'protractor.conf.json',
                tmpConfig: true
            }),
            configJSON = {
                config: null
            },
            done = this.async(),
            config, masterConfig, envConfig, envObj, protractor;

        env = env || Object.keys(options.envs)[0];
        envObj = options.envs[env] || {};
        masterConfig = options.config;
        envConfig = envObj.config || {};

        config = (function() {
            var result = {};

            function copy(src, dest) {
                for (var prop in src) {
                    if (typeof src[prop] !== 'object') {
                        dest[prop] = src[prop];
                    } else {
                        if (src[prop] instanceof Array) {
                            dest[prop] = (dest[prop] instanceof Array) ? dest[prop] : [];
                            dest[prop].push.apply(dest[prop], src[prop]);
                        } else {
                            dest[prop] = (typeof dest[prop] === 'object') ? dest[prop] : {};
                            copy(src[prop], dest[prop]);
                        }
                    }
                }
            }

            copy(masterConfig, result);
            copy(envConfig, result);
            copy(this.data.config || {}, result);

            return grunt.config.process(result);
        }.call(this));

        configJSON.config = config;

        grunt.file.write(options.configFile, JSON.stringify(configJSON, null, '    '));
        grunt.log.ok('Wrote protractor config to ' + options.configFile);

        protractor = spawn('./node_modules/protractor/bin/protractor', [options.configFile], {
            cwd: process.cwd()
        });

        protractor.stdout.setEncoding('utf8');
        protractor.stdout.on('data', function(data) {
            grunt.log.write(data);
        });
        protractor.on('error', function(err) {
            grunt.fail.fatal(err);
        });
        protractor.on('exit', function() {
            if (options.tmpConfig) {
                grunt.file.delete(options.configFile);
                grunt.log.ok('Deleted ' + options.configFile);
            }

            done(true);
        });
    });
};
