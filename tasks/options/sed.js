(function() {
    'use strict';

    module.exports = {
        main: {
            pattern: 'undefined',
            replacement: '\'<%= _version %>\'',
            path: '.tmp/main.js'
        },
        html: {
            pattern: 'assets',
            replacement: '<%= _version %>',
            path: [
                '.tmp/templates.js',
                '<%= settings.distDir %>/index.html'
            ]
        }
    };
}());
