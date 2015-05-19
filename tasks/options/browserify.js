module.exports = {
    options: {
        shim: {
            Modernizr: { path: 'ext/modernizr.custom.71747.js', exports: 'Modernizr' }
        },
        postBundleCB: function(error, src, next) {
            'use strict';
            next(error, '(function() {var ' + src + '}())');
        }
    },
    dist: {
        files: [
            {
                src: 'src/embed/main.js',
                dest: '.tmp/build/<%= settings.distDir %>/c6embed.js'
            },
            {
                src: 'src/widget/main.js',
                dest: '.tmp/build/<%= settings.distDir %>/mr2.js'
            },
            {
                src: ['src/app/main.js'],
                dest: '.tmp/build/<%= settings.distDir %>/app--<%= git_tag %>.js'
            }
        ]
    },
    server: {
        options: {
            debug: true
        },
        files: [
            {
                src: ['src/embed/main.js'],
                dest: '<%= settings.appDir %>/embed.js'
            },
            {
                src: ['src/widget/main.js'],
                dest: '<%= settings.appDir %>/widget.js'
            },
            {
                src: ['src/app/main.js'],
                dest: '<%= settings.appDir %>/c6embed.js'
            }
        ]
    }
};
