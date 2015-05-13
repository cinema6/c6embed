module.exports = {
    dist: {
        src: ['.tmp/build/<%= settings.distDir %>/**/*.{js,html}'],
        overwrite: true,
        replacements: [
            {
                from: '/app.min.js',
                to: '/app--<%= git_tag %>.min.js'
            },
            {
                from: '/app.js',
                to: '/app--<%= git_tag %>.js'
            }
        ]
    }
};
