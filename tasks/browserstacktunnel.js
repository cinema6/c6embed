module.exports = function(grunt) {
    'use strict';

    var spawn = require('child_process').spawn;

    grunt.registerMultiTask('browserstacktunnel', 'start a tunneling session with BrowserStack', function() {
        var options = this.options(),
            args = ['-jar', options.jar, options.key],
            params = '',
            done = this.async(),
            tunnel;

        function addServerConfigToParams(config, params) {
            return (params ? ',' : '') + config.host + ',' + config.port + ',' + (config.ssl ? 1 : 0);
        }

        options.servers.forEach(function(config) {
            params += addServerConfigToParams(config, params);
        });

        args.push(params);

        tunnel = spawn('java', args);

        tunnel.stdout.setEncoding('utf8');
        tunnel.stdout.on('data', function(data) {
            grunt.log.write(data);

            if (data.indexOf('Press Ctrl-C to exit') > -1) {
                done(true);
            }
        });

        process.on('exit', function() {
            tunnel.kill();
        });
    });
};
