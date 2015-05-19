module.exports = {
    embed: {
        files: [
            {
                src: 'app/embed.html',
                dest: 'app/index.html'
            }
        ]
    },
    widget: {
        files: [
            {
                src: 'app/widget.html',
                dest: 'app/index.html'
            }
        ]
    },
    standalone: {
        files: [
            {
                src: 'src/standalone/standalone.html',
                dest: 'app/index.html'
            }
        ]
    },
    preview: {
        files: [
            {
                src: 'src/preview/preview.html',
                dest: 'app/index.html'
            },
            {
                src: 'src/styles/**',
                dest: 'app/',
                expand: true,
                cwd: 'src'
            },
            {
                src: 'src/img/**',
                dest: 'app/',
                expand: true,
                cwd: 'src'
            }
        ]
    },
    jsonp: {
        files: [
            {
                src: 'src/cinema6-jsonp/cinema6-jsonp.js',
                dest: 'app/cinema6-jsonp.js'
            },
            {
                src: 'app/jsonp.html',
                dest: 'app/index.html'
            }
        ]
    },
    tmp: {
        files: [
            {
                src: 'src/cinema6-jsonp/cinema6-jsonp.js',
                dest: '.tmp/build/<%= settings.distDir %>/cinema6-jsonp.js'
            },
            {
                src: 'styles/**',
                dest: '.tmp/build/<%= settings.distDir %>/',
                expand: true,
                cwd: 'src/preview'
            },
            {
                src: 'img/**',
                dest: '.tmp/build/<%= settings.distDir %>/',
                expand: true,
                cwd: 'src/preview'
            }
        ]
    }
};
