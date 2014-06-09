module.exports = {
    embed: {
        files: [
            {
                src: 'src/embed.js',
                dest: 'app/embed.js'
            }
        ]
    },
    dist: {
        files: [
            {
                src: 'src/embed.js',
                dest: '<%= settings.distDir %>/c6embed.js'
            }
        ]
    }
};
