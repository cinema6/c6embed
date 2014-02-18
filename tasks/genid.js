module.exports = function(grunt) {
    'use strict';

    var helpers = require('./resources/helpers.js');

    grunt.registerTask('genid', 'Generate UUIDs for Cinema6 database objects', function(prefix) {
        grunt.log.ok(helpers.genId(prefix));
    });
};
