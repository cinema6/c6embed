module.exports = function(grunt) {
    'use strict';

    var prompt = require('prompt'),
        Q = require('q'),
        helpers = require('./resources/helpers.js');

    grunt.registerTask('createexp', 'Create a Cinema6 experience', function() {
        var settings = grunt.config.get('settings'),
            pkg = grunt.config.get('package'),
            experiences = grunt.file.exists(settings.experiencesJSON) ?
                grunt.file.readJSON(settings.experiencesJSON) : [],
            experience = {
                id: helpers.genId('e'),
                uri: null,
                appUriPrefix: '<%= settings.appUrl %>',
                appUri: null,
                title: null,
                subtitle: null,
                summary: null,
                data: {}
            },
            getInput = Q.nbind(prompt.get, prompt),
            done = this.async();

        function copy(src, dest) {
            for (var key in src) {
                dest[key] = src[key];
            }
        }

        function handleError(error) {
            grunt.fail.fatal(error);
        }

        function modifyProject() {
            grunt.log.writeln('Generated Experience:');
            grunt.log.write(JSON.stringify(experience, null, '    ') + '\n');

            experiences.push(experience);

            // Add to experiences.json and write
            grunt.file.write(settings.experiencesJSON, JSON.stringify(experiences, null, '    '));
            grunt.log.ok('Wrote to ' + settings.experiencesJSON);
        }

        getInput([
            {
                name: 'uri',
                type: 'string',
                description: 'URI (Pretty ID)',
                default: pkg.name
            },
            {
                name: 'appUri',
                type: 'string',
                description: 'App URI (Partial URL Fed to Iframe. Only Change If You Need to Specify Route. E.g., "' + pkg.name + '/#/foo")',
                default: pkg.name
            },
            {
                name: 'title',
                type: 'string',
                description: 'Title'
            },
            {
                name: 'subtitle',
                type: 'string',
                description: 'Subtitle'
            },
            {
                name: 'summary',
                type: 'string',
                description: 'Summary'
            }
        ])
        .then(function(result) {
            copy(result, experience);
        })
        .then(modifyProject)
        .then(done, handleError);
    });
};
