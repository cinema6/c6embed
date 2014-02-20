(function() {
    'use strict';

    module.exports = {
        options: {
            hostname: '0.0.0.0'
        },
        server: {
            options: {
                port: '<%= settings.sandboxPort %>',
                base: 'app',
                livereload: true
            }
        }
    };
})();
