(function() {
    'use strict';

    module.exports = {
        dist: {
            options: {
                createSets: [/(--high|--med|--low)\.(jpg|webp)/, '.jpg'],
                insertBefore: /(--high|--med|--low)\.(jpg|webp)/,
            },
            expand: true,
            cwd: '<%= settings.collateralDir %>',
            src: '**',
            dest: '.tmp/collateral'
        }
    };
}());
