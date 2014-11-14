(function() {
    'use strict';

    module.exports = {
        dist: {
            files: [
                {
                    src: ['<%= settings.distDir %>/app.js'],
                    dest: '<%= settings.distDir %>/app.min.js'
                },
                {
                    src: ['<%= settings.distDir %>/c6embed.js'],
                    dest: '<%= settings.distDir %>/c6embed.min.js'
                },
                {
                    src: ['<%= settings.distDir %>/mr2.js'],
                    dest: '<%= settings.distDir %>/mr2.min.js'
                },
                {
                    src: ['<%= settings.distDir %>/cinema6-jsonp.js'],
                    dest: '<%= settings.distDir %>/cinema6-jsonp.min.js'
                }
            ]
        }
    };
}());
