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
                src: 'src/standalone/standalone.html',
                dest: '.tmp/build/<%= settings.distDir %>/standalone.html'
            },
            {
                src: 'src/preview/preview.html',
                dest: '.tmp/build/<%= settings.distDir %>/preview.html'
            }
        ]
    }
};
