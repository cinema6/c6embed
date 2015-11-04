module.exports = {
    options: {
        transform: ['browserify-shim']
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
                src: 'src/cinema6-jsonp/main.js',
                dest: '.tmp/build/<%= settings.distDir %>/cinema6-jsonp.js'
            },
            {
                src: 'src/embed/embed-html.js',
                dest: '.tmp/build/<%= settings.distDir %>/embed-html.js'
            },
            {
                src: ['src/app/main.js'],
                dest: '.tmp/build/<%= settings.distDir %>/app.js'
            }
        ]
    },
    'mraid-dist': {
        options: {
            browserifyOptions: {
                standalone: 'c6mraid'
            }
        },
        files: [
            {
                src: 'src/c6mraid/c6mraid.js',
                dest: '.tmp/build/<%= settings.distDir %>/c6mraid.js'
            }
        ]
    },
    'vpaid-dist': {
        options: {
            browserifyOptions: {
                standalone: 'getVPAIDAd'
            }
        },
        files: [
            {
                src: 'src/vpaid/vpaid.js',
                dest: '.tmp/build/<%= settings.distDir %>/vpaid.js'
            }
        ]
    },
    'embed-js-dist': {
        options: {
            browserifyOptions: {
                standalone: 'c6embed'
            }
        },
        files: [
            {
                src: 'src/embed/embed-js.js',
                dest: '.tmp/build/<%= settings.distDir %>/embed-js.js'
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
                src: 'src/cinema6-jsonp/main.js',
                dest: 'app/cinema6-jsonp.js'
            },
            {
                src: ['src/app/main.js'],
                dest: '<%= settings.appDir %>/c6embed.js'
            }
        ]
    },
    'mraid-server': {
        options: {
            debug: true,
            browserifyOptions: {
                standalone: 'c6mraid'
            }
        },
        files: [
            {
                src: 'src/c6mraid/c6mraid.js',
                dest: 'app/c6mraid.js'
            }
        ]
    }
};
