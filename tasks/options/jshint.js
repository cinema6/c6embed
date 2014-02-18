(function() {
    'use strict';

    module.exports = {
        options: {
            jshintrc: '.jshintrc'
        },
        all: [
            'Gruntfile.js',
            '<%= settings.appDir %>/assets/scripts/**/*.js'
        ]
    };
})();
