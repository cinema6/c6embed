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
                    src: '<%= settings.distDir %>/**',
                    dest: '<%= settings.s3.test.app %>',
                    rel : '<%= settings.distDir %>/',
                    options: {
                        CacheControl: 'max-age=31556926'
                    }
                },
                {
                    src: '<%= settings.distDir %>/index.html',
                    dest: '<%= settings.s3.test.app %><%= _version %>/index.html',
                    options: {
                        CacheControl: 'max-age=0'
                    }
                },
                {
                    src: '<%= settings.distDir %>/index.html',
                    dest: '<%= settings.s3.test.app %>index.html',
                    options: {
                        CacheControl: 'max-age=0'
                    }
                }
            ]
        },
        'collateral-test': {
            options: {
                bucket: '<%= settings.s3.test.bucket %>'
            },
            upload: [
                {
                    src: '.tmp/collateral/**',
                    rel: '.tmp/collateral/',
                    dest: '<%= settings.s3.test.collateral %>',
                    options: {
                        CacheControl: 'max-age=31556926'
                    }
                },
                {
                    src: '<%= settings.collateralDir %>/**',
                    rel: '<%= settings.collateralDir %>/',
                    dest: '<%= settings.s3.test.collateral %>',
                    options: {
                        CacheControl: 'max-age=0'
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
                    src: '<%= settings.distDir %>/**',
                    dest: '<%= settings.s3.production.app %>',
                    rel : '<%= settings.distDir %>/',
                    options: {
                        CacheControl: 'max-age=31556926'
                    }
                },
                {
                    src: '<%= settings.distDir %>/index.html',
                    dest: '<%= settings.s3.production.app %><%= _version %>/index.html',
                    options: {
                        CacheControl: 'max-age=0'
                    }
                },
                {
                    src: '<%= settings.distDir %>/index.html',
                    dest: '<%= settings.s3.production.app %>index.html',
                    options: {
                        CacheControl: 'max-age=0'
                    }
                }
            ]
        },
        'collateral-production': {
            options: {
                bucket: '<%= settings.s3.production.bucket %>'
            },
            upload: [
                {
                    src: '.tmp/collateral/**',
                    rel: '.tmp/collateral/',
                    dest: '<%= settings.s3.production.collateral %>',
                    options: {
                        CacheControl: 'max-age=31556926'
                    }
                },
                {
                    src: '<%= settings.collateralDir %>/**',
                    rel: '<%= settings.collateralDir %>/',
                    dest: '<%= settings.s3.production.collateral %>',
                    options: {
                        CacheControl: 'max-age=0'
                    }
                }
            ]
        }
    };
}());
