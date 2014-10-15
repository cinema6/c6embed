module.exports = {
    embed: {
        files: [
            {
                src: 'src/embed.js',
                dest: 'app/embed.js'
            },
            {
                src: 'app/embed.html',
                dest: 'app/index.html'
            }
        ]
    },
    widget: {
        files: [
            {
                src: 'src/widget.js',
                dest: 'app/widget.js'
            },
            {
                src: 'app/widget.html',
                dest: 'app/index.html'
            }
        ]
    },
    standalone: {
        files: [
            {
                src: 'src/standalone.html',
                dest: 'app/index.html'
            }
        ]
    },
    preview: {
        files: [
            {
                src: 'src/preview.html',
                dest: 'app/index.html'
            },
            {
              src: 'styles/**',
              dest: 'app/',
              expand: true,
              cwd: 'src'
            },
            {
              src: 'img/**',
              dest: 'app/',
              expand: true,
              cwd: 'src'
            }
        ]
    },
    dist: {
        files: [
            {
                src: 'src/embed.js',
                dest: '<%= settings.distDir %>/c6embed.js'
            },
            {
                src: 'src/widget.js',
                dest: '<%= settings.distDir %>/mr2.js'
            }
        ]
    }
};
