module.exports = {
    options: {
        mode: 'gzip',
        level: 9
    },

    dist: {
        files: [
            {
                src: '**/*.{js,html}',
                cwd: '.tmp/build/<%= settings.distDir %>',
                expand: true,
                dest: '<%= settings.distDir %>'
            }
        ]
    }
};
