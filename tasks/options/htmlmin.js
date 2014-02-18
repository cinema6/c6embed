(function() {
    'use strict';

    module.exports = {
        options: {
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeRedundantAttributes: true,
            removeScriptTypeAttributes: true,
            removeStyleLinkTypeAttributes: true
        },
        dist: {
            files: [
                {
                    expand: true,
                    cwd: '<%= settings.appDir %>',
                    src: '*.html',
                    dest: '<%= settings.distDir %>'
                },
                {
                    expand: true,
                    cwd: '<%= settings.appDir %>/assets',
                    src: [
                        '**/*.html',
                        '!views/**/*.html'
                    ],
                    dest: '<%= _versionDir %>'
                }
            ]
        }
    };
}());
