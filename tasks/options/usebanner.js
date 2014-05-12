module.exports = {
    dist: {
        options: {
            banner: [
                '/*',
                ' * Copyright © Cinema6 2014 All Rights Reserved. No part of this library',
                ' * may be reproduced without Cinema6\'s express consent.',
                ' *',
                ' * Build Version: <%= git_tag %>',
                ' * Build Date: ' + new Date().toString(),
                ' */'
            ].join('\n')
        },
        files: {
            src: ['<%= settings.distDir %>/**/*.js']
        }
    }
};
