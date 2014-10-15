module.exports = {
    dist: {
        options: {
            removeComments: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true,
            removeAttributeQuotes: true,
            removeRedundantAttributes: true,
            removeEmptyAttributes: true,
            removeScriptTypeAttributes: true,
            removeOptionalTags: true,
            minifyJS: true,
            minifyCSS: true
        },
        files: [
            {
                src: 'src/standalone.html',
                dest: '<%= settings.distDir %>/standalone.html'
            },
            {
                src: 'app/preview.html',
                dest: '<%= settings.distDir %>/preview.html'
            }
        ]
    }
};
