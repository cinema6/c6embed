module.exports = function(deps) {
    'use strict';

    var $document = deps.document,
        $window = deps.window;

    function Selector(nodes) {
        var index = 0,
            length = nodes.length;

        for ( ; index < length; index++) {
            this[index] = nodes[index];
        }

        this.length = length;
    }
    Selector.prototype = {
        forEach: function(iterator) {
            var index = 0,
                length = this.length;

            for ( ; index < length; index++) {
                iterator(this[index], index);
            }
        },
        forEachNode: function(iterator) {
            function iterate(node) {
                var $children;

                if (node instanceof $window.Text) { return; }

                $children = new Selector(node.childNodes || []);

                iterator(node, node.parentNode);

                $children.forEach(iterate);
            }

            this.forEach(iterate);
        },
        classes: function() {
            var classes = [],
                self = this;

            this.forEach(function(node) {
                var theseClasses = node.className.split(' ');

                self.forEach.call(theseClasses, function(className) {
                    if (classes.indexOf(className) < 0) {
                        classes.push(className);
                    }
                });
            });

            return classes;
        },
        addClass: function(className) {
            this.forEach(function(node) {
                var $node = new Selector([node]),
                    classes = $node.classes();

                classes.push(className);

                node.className = classes.join(' ');
            });
        },
        removeClass: function(className) {
            this.forEach(function(node) {
                var $node = new Selector([node]),
                    classes = $node.classes();

                classes.splice(classes.indexOf(className), 1);

                node.className = classes.join(' ');
            });
        },
        css: function(config, value) {
            var self = this,
                configObj = config;

            function get(property) {
                return $window.getComputedStyle(self[0])[property];
            }

            function set(config) {
                self.forEach(function(node) {
                    var prop;

                    for (prop in config) {
                        node.style[prop] = config[prop];
                    }
                });
            }

            if (typeof value !== 'undefined') {
                configObj = {};
                configObj[config] = value;

                set(configObj);
            }

            if (typeof config === 'string') {
                return get(config);
            }

            set(configObj);
        }
    };

    function c6Query(nodes) {
        if (typeof nodes === 'string') {
            return new Selector($document.querySelectorAll(nodes));
        }

        if (!nodes.length) {
            return new Selector([nodes]);
        }

        return new Selector(nodes);
    }

    return c6Query;
};
