module.exports = function(grunt) {
    'use strict';

    grunt.registerTask('updatewebdriver', 'Update webdriver using protracor\'s webriver-manager', function() {
        var done = this.async();

        grunt.util.spawn({
            cmd: './node_modules/protractor/bin/webdriver-manager',
            args: ['update']
        }, function(error, result) {
            if (error) {
                grunt.fail.fatal(error);
            }

            grunt.log.ok(result);
            done(true);
        });
    });
};
