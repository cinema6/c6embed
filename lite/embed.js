(function(win) {
    'use strict';
    var config = (function(scripts) {
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

            return result;
        }(document.getElementsByTagName('script'))),
        c6 = win.c6 = {
            embeds: {},
            push: function(script) {
                
            }
        };

    c6.embeds[config.exp] = {
        script: config.script,
        load: false
    };

}(window));
