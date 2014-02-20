module.exports = {
    options: {
        shim: {
            Modernizr: { path: 'ext/modernizr.custom.71747.js', exports: 'Modernizr' }
        }
    },
    dist: {
        files: [
            {
                src: ['src/main.js'],
                dest: '<%= settings.distDir %>/c6embed.js'
            }
        ]
    },
    server: {
        options: {
            debug: true
        },
        files: [
            {
                src: ['src/main.js'],
                dest: '<%= settings.appDir %>/c6embed.js'
            }
        ]
    }
};
