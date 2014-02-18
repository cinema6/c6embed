(function() {
    'use strict';

    module.exports = {
        dist: {
            expand: true,
            cwd: '<%= settings.appDir %>/assets',
            src: 'styles/**/*.css',
            dest: '<%= _versionDir %>'
        }
    };
}());
