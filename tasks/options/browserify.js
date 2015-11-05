module.exports = {
    options: {
        transform: ['browserify-shim']
    },

    dist: {
        files: [
            {
                src: 'src/embed/embed-html.js',
                dest: '.tmp/build/<%= settings.distDir %>/embed-html.js'
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
                src: 'src/embed/embed-html.js',
                dest: 'app/embed-html.js'
            }
        ]
    },
    'embed-js-server': {
        options: {
            debug: true,
            browserifyOptions: {
                standalone: 'c6embed'
            }
        },
        files: [
            {
                src: 'src/embed/embed-js.js',
                dest: 'app/embed-js.js'
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
