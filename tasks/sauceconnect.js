module.exports = function(grunt) {
    'use strict';

    var spawn = require('child_process').spawn;

    grunt.registerMultiTask('sauceconnect', 'start a tunneling session with saucelabs', function() {
        var done = this.async(),
            options = this.options(),
            sauceConnect = spawn('java', ['-jar', options.jar, options.user, options.key]);

        process.on('exit', function() {
            sauceConnect.kill();
        });

        sauceConnect.stdout.setEncoding('utf8');

        sauceConnect.stdout.on('data', function(data) {
            grunt.log.write(data);

            if (data.indexOf('Connected') > -1) {
                grunt.log.ok('Success!');
                done(true);
            }
        });
    });
};
