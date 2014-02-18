(function() {
    'use strict';

    module.exports = {
        options: {
            credentials: '<%= settings.aws %>',
            s3Url: '<%= settings.libUrl %>'
        },
        app: {
            files: [
                {
                    src: '<%= settings.appDir %>/index.html',
                    dest: '<%= settings.appDir %>/index.html'
                },
                {
                    src: '<%= settings.appDir %>/assets/scripts/main.js',
                    dest: '<%= settings.appDir %>/assets/scripts/main.js'
                },
                {
                    src: 'test/test-main.js',
                    dest: 'test/test-main.js'
                }
            ]
        }
    };
}());
