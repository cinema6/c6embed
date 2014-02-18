(function() {
    'use strict';

    module.exports = {
        dist: {
            files: [
                {
                    src: [
                        '<%= settings.appDir %>/assets/scripts/app.js',
                        '<%= settings.appDir %>/assets/scripts/**/*.js',
                        '.tmp/templates.js',
                        '!<%= settings.appDir %>/assets/scripts/main.js'
                    ],
                    dest: '<%= _versionDir %>/scripts/c6app.min.js'
                },
                {
                    src: '.tmp/main.js',
                    dest: '<%= _versionDir %>/scripts/main.js'
                }
            ]
        }
    };
}());
