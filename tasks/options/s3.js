(function() {
    'use strict';

    module.exports = {
        options: {
            key:    '<%= settings.aws.accessKeyId %>',
            secret: '<%= settings.aws.secretAccessKey %>',
            access: 'public-read'
        },
        test: {
            options: {
                bucket: '<%= settings.s3.test.bucket %>'
            },
            upload: [
                {
                    src: '<%= settings.distDir %>/**/*.js',
                    dest: '<%= settings.s3.test.app %>',
                    rel : '<%= settings.distDir %>/',
                    options: {
                        CacheControl: 'max-age=0'
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
        production: {
            options: {
                bucket: '<%= settings.s3.production.bucket %>'
            },
            upload: [
                {
                    src: '<%= settings.distDir %>/**/*.js',
                    dest: '<%= settings.s3.production.app %>',
                    rel : '<%= settings.distDir %>/',
                    options: {
                        CacheControl: 'max-age=0'
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
    };
}());
