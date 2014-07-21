module.exports = function() {
    'use strict';

    function appendAfterHead(html, string) {
        var headMatch = html.match(/<head>/),
            insertionPoint = headMatch.index + headMatch[0].length;

        return html.slice(0, insertionPoint) +
            string +
            html.slice(insertionPoint);
    }

    function ParsedDocument(html) {
        this.html = html;
    }
    ParsedDocument.prototype = {
        toString: function() {
            return this.html;
        },
        injectScript: function(fn) {
            this.html = appendAfterHead(
                this.html,
                '<script>(' + fn.toString() + '(window));</script>'
            );

            return this;
        },
        setBase: function(base) {
            var currentBase = (this.html.match(/<base .+?>/) || [null])[0],
                current = (currentBase || '') && currentBase.match(/href="(.*?)"/)[1];

            if (currentBase) {
                this.html = this.html.replace(currentBase, '');
            }

            this.html = appendAfterHead(
                this.html,
                '<base href="' + base + current + '"/>'
            );

            return this;
        },
        setGlobalObject: function(prop, object) {
            return this.injectScript([
                'function(window) {',
                '    window["' + prop + '"] = ' + JSON.stringify(object) + ';',
                '}'
            ].join('\n'));
        }
    };

    return function(html) {
        return new ParsedDocument(html);
    };
};
