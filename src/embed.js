(function(win) {
    'use strict';

    var base = win.__C6_URL_ROOT__ || '//portal.cinema6.com',
        appJs = win.__C6_APP_JS__ || '//lib.cinema6.com/c6embed/app.js',
        config = (function(scripts) {
            var script = scripts[scripts.length - 1],
                attributes = script.attributes,
                length = attributes.length,
                attribute,
                result = {};

            while (length--) {
                attribute = attributes[length];

                result[attribute.name.replace(/data-/, '')] = attribute.value;
            }

            result.script = script;
            result.responsive = !result.height;

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
        responsiveStyles = {
            width: '100%',
            height: '0px',
            boxSizing: 'border-box',
            '-moz-box-sizing': 'border-box',
            fontSize: '16px',
            minWidth: '18.75em',
            minHeight: '19.625em',
            padding: '8.125em 0px 63% 0px'
        },
        staticStyles = {
            width: config.width,
            height: config.height
        },
        containerStyles = (config.width && config.height) ? staticStyles : responsiveStyles,
        iframeAttrs = {
            height: '100%',
            width: '100%',
            scrolling: 'no',
            style: 'border: none; position: absolute; top: 0px; left: 0px;',
            src: base + '/collateral/splash/' + config.splash + '/index.html' +
                '?exp=' + encodeURIComponent(config.exp)
        },
        div = document.createElement('div'),
        iframe = document.createElement('iframe'),
        attr = null;

    win.addEventListener('message', function(event) {
        var data;

        if (!event.origin.match(/cinema6\.com$/)) { return; }

        try {
            data = JSON.parse(event.data);
        } catch(e) {}

        if (!data.exp) { return; }

        c6.loadExperience(c6.embeds[data.exp]);
    }, false);

    div.setAttribute('id', 'c6embed-' + config.exp);
    div.style.position = 'relative';

    for (attr in containerStyles) {
        div.style[attr] = containerStyles[attr];
    }

    for (attr in iframeAttrs) {
        iframe.setAttribute(attr, iframeAttrs[attr]);
    }

    div.appendChild(iframe);
    script.parentNode.insertBefore(div, script);

    c6.embeds[config.exp] = {
        embed: div,
        load: false,
        config: config
    };

}(window));
