(function() {
    'use strict';

    var q = require('q');

    function withConfig(config) {
        var paths = config.paths || {};
        var shims = config.shim || {};
        var container = config.container || document.head;

        function extractModule(frameWindow, src, exportName) {
            var module = exportName ? frameWindow[exportName] : frameWindow.module.exports;

            importScripts.cache[src] = module;

            return module;
        }

        function importScripts(scripts/*, callback*/) {
            var callback = arguments.length > 1 ? arguments[1] : function() {};

            var modules = [];
            var loaded = 0;
            var total = scripts.length;

            return new q.Promise(function loadScripts(resolve, reject) {
                function finish() {
                    callback.apply(null, modules);
                    resolve(modules);
                }

                function load(module, index) {
                    modules[index] = module;

                    if (++loaded === total) { finish(); }
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

                    iframe.__load__ = function __load__() {
                        load(extractModule(iframe.contentWindow, src, shim.exports), index);
                    };
                    iframe.__error__ = function __error() {
                        reject(new Error('Failed to load script [' + script + '].'));
                    };

                    container.appendChild(iframe);

                    iframe.contentWindow.document.write([
                        '<script>',
                        '(' + function(window) {
                            var href = window.parent.location.href;

                            try {
                                // This hack is needed in order for the browser to send the
                                // "referer" header in Safari.
                                window.history.replaceState(null, null, href);
                            } catch(e) {}
                            window.Text = window.parent.Text;
                            window.module = {
                                exports: {}
                            };
                            window.exports = window.module.exports;
                        }.toString() + '(window))',
                        '<\/script>',
                        '<script>(' + onCreateFrame.toString() + '(window))<\/script>',
                        '<script src="' + src + '"',
                        '    onload="window.frameElement.__load__()"',
                        '    onerror="window.frameElement.__error__()"',
                        '    charset="utf-8">',
                        '<\/script>'
                    ].join('\n'));
                    iframe.contentWindow.document.close();
                });

                if (total < 1) { finish(); }
            });
        }
        importScripts.cache = config.cache || {};
        importScripts.withConfig = withConfig;

        return importScripts;
    }


    module.exports = withConfig({});
}());
