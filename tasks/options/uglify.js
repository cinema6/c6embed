(function() {
    'use strict';

    module.exports = {
        dist: {
            files: [
                {
                    src: ['.tmp/build/<%= settings.distDir %>/app.js'],
                    dest: '.tmp/build/<%= settings.distDir %>/app.min.js'
                },
                {
                    src: ['.tmp/build/<%= settings.distDir %>/c6embed.js'],
                    dest: '.tmp/build/<%= settings.distDir %>/c6embed.min.js'
                },
                {
                    src: ['.tmp/build/<%= settings.distDir %>/mr2.js'],
                    dest: '.tmp/build/<%= settings.distDir %>/mr2.min.js'
                },
                {
                    src: ['.tmp/build/<%= settings.distDir %>/cinema6-jsonp.js'],
                    dest: '.tmp/build/<%= settings.distDir %>/cinema6-jsonp.min.js'
                }
            ]
        }
    };
}());
