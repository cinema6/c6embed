(function(win) {
    'use strict';

    var baseUrl = win.__C6_URL_ROOT__ || '//portal.cinema6.com',
        appJs = win.__C6_APP_JS__ || '//lib.cinema6.com/c6embed/app.js',
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
            requireCache: {},
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
        splash = document.createElement('div'),
        attr = null,
        settings = c6.embeds[config.exp] = {
            embed: div,
            splashDelegate: {},
            load: false,
            config: config
        };

    function splashOf(splashConfig) {
        return baseUrl +
            '/collateral/splash/' +
            splashConfig.style + '/' +
            splashConfig.ratio.join('-') + '.js';
    }

    function require(src, cb) {
        if (c6.requireCache[src]) { return cb.call(window, c6.requireCache[src]); }

        var iframe = document.createElement('iframe'),
            head = document.getElementsByTagName('head')[0],
            html = [
                '<script>',
                '(' + function(window) {
                    window.Text = window.parent.Text;
                    window.module = {
                        exports: {}
                    };
                    window.exports = window.module.exports;
                }.toString() + '(window))',
                '</script>',
                '<script src="' + src + '"></script>'
            ].join('\n');

        iframe.addEventListener('load', function() {
            var head = iframe.contentWindow.document.getElementsByTagName('head')[0];

            if (head.childNodes.length < 1) { return; }

            cb.call(window, (c6.requireCache[src] = iframe.contentWindow.module.exports));
        }, false);
        /* jshint scripturl:true */
        iframe.setAttribute('src', 'javascript:\'' + html + '\';');
        /* jshint scripturl:false */

        head.appendChild(iframe);
    }

    div.setAttribute('id', 'c6embed-' + config.exp);
    div.style.position = 'relative';

    for (attr in containerStyles) {
        div.style[attr] = containerStyles[attr];
    }

    div.appendChild(splash);
    script.parentNode.insertBefore(div, script);

    require('//lib.cinema6.com/twobits.js/v0.0.1-0-g7a19518/twobits.min.js', function(tb) {
        require(baseUrl + '/collateral/splash/splash.js', function(splashJS) {
            require(splashOf(config.splash), function(html) {
                splash.innerHTML = html;
                tb.parse(splash)({
                    title: config.title,
                    splash: baseUrl + '/collateral/experiences/' + config.exp + '/splash'
                });
                settings.splashDelegate = splashJS(c6, settings, splash);
            });
        });
    });
}(window));
