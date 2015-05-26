(function() {
    'use strict';

    function withConfig(config) {
        var paths = config.paths || {};
        var shims = config.shim || {};
        var container = config.container || document.head;

        function extractModule(frameWindow, src, exportName) {
            var module = exportName ? frameWindow[exportName] : frameWindow.module.exports;

            importScripts.cache[src] = module;

            return module;
        }

        function importScripts(scripts, callback) {
            var modules = [];
            var loaded = 0;
            var total = scripts.length;

            function load(module, index) {
                modules[index] = module;

                if (++loaded === total) {
                    callback.apply(null, modules);
                }
            }

            scripts.forEach(function(script, index) {
                var src = paths[script] || script;
                var shim = shims[script] || {};
                var onCreateFrame = shim.onCreateFrame || function() {};

                if (importScripts.cache[src]) {
                    return load(importScripts.cache[src], index);
                }

                var iframe = document.createElement('iframe');
                iframe.setAttribute('src', 'about:blank');
                iframe.setAttribute('data-module', script);

                iframe.addEventListener('load', function() {
                    var frameWindow = iframe.contentWindow;

                    if (frameWindow.document.head.childNodes.length < 1) { return; }

                    load(extractModule(frameWindow, src, shim.exports), index);
                }, false);

                container.appendChild(iframe);

                iframe.contentWindow.document.write([
                    '<script>',
                    '(' + function(window) {
                        try {
                            // This hack is needed in order for the browser to send the
                            // "referer" header in Safari.
                            window.history.replaceState(null, null, window.parent.location.href);
                        } catch(e) {}
                        window.Text = window.parent.Text;
                        window.module = {
                            exports: {}
                        };
                        window.exports = window.module.exports;
                    }.toString() + '(window))',
                    '<\/script>',
                    '<script>(' + onCreateFrame.toString() + '(window))<\/script>',
                    '<script src="' + src + '" charset="utf-8"><\/script>'
                ].join('\n'));
                iframe.contentWindow.document.close();
            });

            if (total < 1) { callback(); }
        }
        importScripts.cache = config.cache || {};
        importScripts.withConfig = withConfig;

        return importScripts;
    }


    module.exports = withConfig({});
}());
