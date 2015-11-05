module.exports = {
    embed: {
        files: [
            {
                src: 'app/embed.html',
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
                src: 'styles/**',
                dest: 'app/',
                expand: true,
                cwd: 'src/preview/'
            },
            {
                src: 'img/**',
                dest: 'app/',
                expand: true,
                cwd: 'src/preview/'
            }
        ]
    },
    mraid: {
        files: [
            {
                src: 'app/mraid.html',
                dest: 'app/index.html'
            }
        ]
    },
    tmp: {
        files: [
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
