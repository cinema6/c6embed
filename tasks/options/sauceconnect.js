(function() {
    'use strict';

    module.exports = {
        options: {
            jar: 'tasks/resources/Sauce-Connect.jar',
            user: '<%= settings.saucelabs.user %>',
            key: '<%= settings.saucelabs.key %>'
        },
        e2e: {}
    };
})();
