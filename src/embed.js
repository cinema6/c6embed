(function(win) {
    'use strict';

    var appJs = win.__C6_APP_JS__ || '//lib.cinema6.com/c6embed/app.js',
        config = (function(scripts) {
            var script = scripts[scripts.length - 1],
                attributes = script.attributes,
                length = attributes.length,
                attribute,
                prop,
                value,
                result = {};

            while (length--) {
                attribute = attributes[length];
                prop = attribute.name.replace(/^data-/, '');
                value = attribute.value;

                if (prop.charAt(0) === ':') {
                    prop = prop.slice(1);
                    value = atob(value);
                }

                result[prop] = value;
            }

            result.script = script;
            result.responsive = !result.height;
            result.splash = (function() {
                var parts = result.splash.split(':');

                return {
                    style: parts[0],
                    ratio: parts[1].split('/').map(parseFloat)
                };
            }());

            return result;
        }(document.getElementsByTagName('script'))),
        script = config.script,
        c6 = win.c6 || (win.c6 = {
            embeds: {},
            app: null,
            loadExperience: function(embed) {
                var app = this.app || (this.app = document.createElement('script')),
                    head = document.getElementsByTagName('head')[0];

                embed.load = true;

                if (!app.parentNode) {
                    app.src = appJs;
                    head.appendChild(app);
                }
            }
        }),
        responsiveStyles = {},
        staticStyles = {
            width: config.width,
            height: config.height
        },
        containerStyles = (config.width && config.height) ? staticStyles : responsiveStyles,
        div = document.createElement('div'),
        attr = null;

    div.setAttribute('id', 'c6embed-' + config.exp);
    div.style.position = 'relative';

    for (attr in containerStyles) {
        div.style[attr] = containerStyles[attr];
    }

    script.parentNode.insertBefore(div, script);

    c6.embeds[config.exp] = {
        embed: div,
        load: false,
        config: config
    };

}(window));
