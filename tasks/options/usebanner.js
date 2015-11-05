module.exports = {
    dist: {
        options: {
            banner: [
                '/*',
                ' * Copyright © Cinema6 2015 All Rights Reserved. No part of this library',
                ' * may be reproduced without Cinema6\'s express consent.',
                ' *',
                ' * Build Version: <%= git_tag %>',
                ' * Build Date: ' + new Date().toString(),
                ' */'
            ].join('\n')
        },
        files: {
            src: ['.tmp/build/<%= settings.distDir %>/**/*.js']
        }
    }
};
