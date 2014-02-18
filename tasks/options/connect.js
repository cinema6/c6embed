(function() {
    'use strict';

    module.exports = {
        options: {
            hostname: '0.0.0.0'
        },
        sandbox: {
            options: {
                port: '<%= settings.sandboxPort %>'
            }
        }
    };
})();
