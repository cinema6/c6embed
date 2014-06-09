module.exports = function(deps) {
    'use strict';

    var $document = deps.document,
        $window = deps.window;

    var cache = {},
        creator = $document.createElement('div');

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

            return this;
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
                var theseClasses = node.className ?
                    node.className.split(' ') : [];

                self.forEach.call(theseClasses, function(className) {
                    if (classes.indexOf(className) < 0) {
                        classes.push(className);
                    }
                });
            });

            return classes;
        },
        addClass: function(className) {
            return this.forEach(function(node) {
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
                return ($window.getComputedStyle(self[0]) || {})[property];
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
        },
        hasClass: function(className) {
            var results = [];

            this.forEach(function(node) {
                var classes = new Selector([node]).classes();

                results.push(classes.indexOf(className) > -1);
            });

            return results.indexOf(true) > -1;
        },
        attr: function(prop, value) {
            if (arguments.length > 1) {
                this.forEach(function(node) {
                    node.setAttribute(prop, value);
                });
            }

            return this[0].getAttribute(prop);
        },
        prop: function(key, value) {
            if (arguments.length > 1) {
                this.forEach(function(node) {
                    node[key] = value;
                });
            }

            return this[0][key];
        },
        data: function(key, value) {
            if (arguments.length > 1) {
                this.forEach(function(node) {
                    var dataKey,
                        data;

                    function createKey() {
                        function random() {
                            var text = '',
                                possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789$_',
                                index = 0;

                            for( ; index < 15; index++ ) {
                                text += possible.charAt(Math.floor(Math.random() * possible.length));
                            }

                            return text;
                        }

                        for (var keyAttempt = random(); cache[key]; keyAttempt = random()) {}

                        return keyAttempt;
                    }

                    node.c6DataKey = dataKey = node.c6DataKey || createKey();
                    data = cache[dataKey] = cache[dataKey] || {};

                    data[key] = value;
                });
            }

            return (cache[this[0].c6DataKey] || {})[key];
        },
        createSnapshot: function() {
            var self = this;

            this.forEach(function(node) {
                var $node = new Selector([node]),
                    snapshots = $node.data('c6Snapshots') || $node.data('c6Snapshots', []);

                function copyAttrs(node) {
                    var copy = {};

                    self.forEach.call(node.attributes, function(attr) {
                        copy[attr.name] = attr.value;
                    });

                    return copy;
                }

                snapshots.push(copyAttrs(node));
            });
        },
        revertTo: function(index) {
            index = index || 0;

            this.forEach(function(node) {
                var $node = new Selector([node]),
                    desiredAttrs = ($node.data('c6Snapshots') || [])[index],
                    attributes = node.attributes,
                    attributesLength = attributes.length,
                    prop;

                if (!desiredAttrs) { return; }

                for (prop in desiredAttrs) {
                    $node.attr(prop, desiredAttrs[prop]);
                }

                while (attributesLength--) {
                    if (!desiredAttrs[attributes[attributesLength].name]) {
                        node.removeAttribute(attributes[attributesLength].name);
                    }
                }
            });
        },
        insertBefore: function(selector) {
            var sibling = c6Query(selector)[0],
                parent = sibling.parentNode;

            this.forEach(function(node) {
                parent.insertBefore(node, sibling);
            });

            return this;
        },
        insertAfter: function(selector) {
            var $target = c6Query(selector),
                parent = $target[0].parentNode,
                sibling = $target[0].nextSibling;

            this.forEach(function(node) {
                parent.insertBefore(node, sibling);
            });

            return this;
        },
        append: function(selector) {
            var $child = c6Query(selector),
                firstNode = this[0];

            $child.forEach(function(node) {
                firstNode.appendChild(node);
            });

            return this;
        },
        remove: function() {
            this.forEach(function(node) {
                node.parentNode.removeChild(node);
            });
        }
    };

    function createElement(string) {
        var tagName = string.match(/<\w+/)[0].slice(1),
            endTag = '</' + tagName + '>',
            hasEndTag = !!string.match(new RegExp('<\/' + tagName + '>$')),
            html = string + (hasEndTag ? '' : endTag),
            element;

        creator.innerHTML = html;
        element = creator.firstChild;
        creator.innerHTML = '';

        return new Selector([element]);
    }

    function c6Query(nodes) {
        function isArrayLike(object) {
            var length = object.length;

            return length && (length > 1 ? (0 in object) : true);
        }

        if (!nodes) {
            return new Selector([]);
        }

        if (nodes instanceof Selector) {
            return nodes;
        }

        if (typeof nodes === 'string') {
            if (!!nodes.match(/^<.+>$/)) {
                return createElement(nodes);
            }

            return new Selector($document.querySelectorAll(nodes));
        }

        if (!isArrayLike(nodes)) {
            return new Selector([nodes]);
        }

        return new Selector(nodes);
    }

    return c6Query;
};
