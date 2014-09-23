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
