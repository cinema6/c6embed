(function() {
    'use strict';

    var publicJsSrcs = [
        '<%= settings.distDir %>/**/*.js',
        '!<%= settings.distDir %>/app--<%= git_tag %>.js',
        '!<%= settings.distDir %>/app--<%= git_tag %>.min.js'
    ];

    var appJsSrcs = [
        '<%= settings.distDir %>/app--<%= git_tag %>.js',
        '<%= settings.distDir %>/app--<%= git_tag %>.min.js'
    ];

    module.exports = {
        options: {
            key:    '<%= settings.aws.accessKeyId %>',
            secret: '<%= settings.aws.secretAccessKey %>',
            access: 'public-read',
            ContentEncoding: 'gzip'
        },
        test: {
            options: {
                bucket: '<%= settings.s3.test.bucket %>'
            },
            upload: [
                {
                    src: publicJsSrcs,
                    dest: '<%= settings.s3.test.app %>',
                    rel : '<%= settings.distDir %>/',
                    options: {
                        CacheControl: 'max-age=60'
                    }
                },
                {
                    src: appJsSrcs,
                    dest: '<%= settings.s3.test.app %>',
                    rel : '<%= settings.distDir %>/',
                    options: {
                        CacheControl: 'max-age=31556926'
                    }
                }
            ]
        },
        'test-standalone': {
            options: {
                bucket: '<%= settings.s3.testStandalone.bucket %>'
            },
            upload: [
                {
                    src: '<%= settings.distDir %>/standalone.html',
                    dest: '<%= settings.s3.testStandalone.app %>',
                    rel : '<%= settings.distDir %>/',
                    options: {
                        CacheControl: 'max-age=60',
                        ContentType: 'text/html'
                    }
                }
            ]
        },
        'test-preview': {
            options: {
                bucket: '<%= settings.s3.testPreview.bucket %>'
            },
            upload: [
                {
                    src: '<%= settings.distDir %>/preview.html',
                    dest: '<%= settings.s3.testPreview.app %>',
                    rel : '<%= settings.distDir %>/',
                    options: {
                        CacheControl: 'max-age=60',
                        ContentType: 'text/html'
                    }
                }
            ]
        },
        production: {
            options: {
                bucket: '<%= settings.s3.production.bucket %>'
            },
            upload: [
                {
                    src: publicJsSrcs,
                    dest: '<%= settings.s3.production.app %>',
                    rel : '<%= settings.distDir %>/',
                    options: {
                        CacheControl: 'max-age=60'
                    }
                },
                {
                    src: appJsSrcs,
                    dest: '<%= settings.s3.production.app %>',
                    rel : '<%= settings.distDir %>/',
                    options: {
                        CacheControl: 'max-age=31556926'
                    }
                }
            ]
        },
        'production-standalone': {
            options: {
                bucket: '<%= settings.s3.productionStandalone.bucket %>'
            },
            upload: [
                {
                    src: '<%= settings.distDir %>/standalone.html',
                    dest: '<%= settings.s3.productionStandalone.app %>',
                    rel : '<%= settings.distDir %>/',
                    options: {
                        CacheControl: 'max-age=60',
                        ContentType: 'text/html'
                    }
                }
            ]
        },
        'production-preview': {
            options: {
                bucket: '<%= settings.s3.productionPreview.bucket %>'
            },
            upload: [
                {
                    src: '<%= settings.distDir %>/preview.html',
                    dest: '<%= settings.s3.productionPreview.app %>',
                    rel : '<%= settings.distDir %>/',
                    options: {
                        CacheControl: 'max-age=60',
                        ContentType: 'text/html'
                    }
                }
            ]
        }
    };
}());
