(function() {
    'use strict';

    var publicJsSrcs = [
        '<%= settings.distDir %>/**/*.js'
    ];

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
                    src: publicJsSrcs,
                    dest: '<%= settings.s3.test.app %>',
                    rel : '<%= settings.distDir %>/',
                    options: {
                        CacheControl: 'max-age=0',
                        ContentEncoding: 'gzip'
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
                        CacheControl: 'max-age=0',
                        ContentType: 'text/html',
                        ContentEncoding: 'gzip'
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
                        CacheControl: 'max-age=300',
                        ContentEncoding: 'gzip'
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
                        CacheControl: 'max-age=300',
                        ContentType: 'text/html',
                        ContentEncoding: 'gzip'
                    }
                }
            ]
        }
    };
}());
