(function() {
    'use strict';

    module.exports = {
        embed: {
            files: [
                '<%= settings.appDir %>/embed.html',
                'src/**/*.js',
                'lib/**/*.js',
                'lite/**/*.js',
            ],
            options: {
                livereload: true
            },
            tasks: ['browserify:server', 'copy:embed']
        },
        preview: {
            files: [
                'src/preview/preview.html'
            ],
            options: {
                livereload: true
            },
            tasks: ['copy:preview']
        },
        mraid: {
            files: [
                '<%= settings.appDir %>/mraid.html',
                'src/**/*.js',
                'lib/**/*.js'
            ],
            options: {
                livereload: true
            },
            tasks: ['browserify:mraid-server','copy:mraid']
        },
        e2e: {
            files: [
                '<%= settings.appDir %>/*.html',
                '<%= settings.appDir %>/assets/views/**/*.html',
                '<%= settings.appDir %>/assets/styles/**/*.css',
                '<%= settings.appDir %>/assets/scripts/**/*.js',
                '<%= settings.appDir %>/assets/img/**/*.{png,jpg,jpeg,gif,webp,svg}',
                'test/e2e/**/*.e2e.js'
            ],
            tasks: [
                'protractor:<%= grunt.task.current.args[1] %>:local'
            ]
        }
    };
})();
