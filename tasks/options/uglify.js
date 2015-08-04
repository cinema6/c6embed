(function() {
    'use strict';

    module.exports = {
        dist: {
            files: [
                {
                    expand: true,
                    cwd: '.tmp/build/<%= settings.distDir %>',
                    src: '*.js',
                    dest: '.tmp/build/<%= settings.distDir %>',
                    extDot: 'last',
                    ext: '.min.js'
                }
            ]
        }
    };
}());
