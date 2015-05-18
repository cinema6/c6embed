module.exports = {
    options: {
        shim: {
            Modernizr: { path: 'ext/modernizr.custom.71747.js', exports: 'Modernizr' }
        }
    },
    dist: {
        files: [
            {
                src: ['src/app/main.js'],
                dest: '.tmp/build/<%= settings.distDir %>/app--<%= git_tag %>.js'
            }
        ]
    },
    server: {
        options: {
            debug: true
        },
        files: [
            {
                src: ['src/app/main.js'],
                dest: '<%= settings.appDir %>/c6embed.js'
            }
        ]
    }
};
