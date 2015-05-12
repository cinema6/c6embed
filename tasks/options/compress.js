module.exports = {
    options: {
        mode: 'gzip'
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
