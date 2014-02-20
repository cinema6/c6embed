(function() {
    'use strict';

    module.exports = {
        dist: {
            files: [
                {
                    src: ['<%= settings.distDir %>/c6embed.js'],
                    dest: '<%= settings.distDir %>/c6embed.min.js'
                }
            ]
        }
    };
}());
