(function() {
    'use strict';

    describe('C6Query', function() {
        var C6Query,
            $;

        var testBox,
            elements,
            element;

        function MockElement(tagName) {
            var el = document.createElement(tagName);

            elements.push(el);
            element = el;

            return el;
        }

        beforeEach(function() {
            elements = [];

            C6Query = require('../../lib/C6Query');

            testBox = document.createElement('div');
            testBox.id = 'test-box';
            testBox.style.width = '800px';
            testBox.style.height = '600px';
            testBox.style.position = 'relative';

            testBox.createElement = jasmine.createSpy('$document.createElement()')
                .and.callFake(function(tagName) {
                    return new MockElement(tagName);
                });

            document.getElementsByTagName('body')[0].appendChild(testBox);

            $ = new C6Query({ document: testBox, window: window });
        });

        afterEach(function() {
            document.getElementsByTagName('body')[0].removeChild(testBox);
        });

        it('should exist', function() {
            expect($).toEqual(jasmine.any(Function));
        });

        describe('selecting', function() {
            var nodeList;

            beforeEach(function() {
                testBox.innerHTML = [
                    '<div class="foo" id="foo">Foo</div>',
                    '<span id="hello"><p class="foo">Hello</p></span>',
                    '<input id="input" type="text">'
                ].join('');

                nodeList = testBox.childNodes;
            });

            describe('with a NodeList', function() {
                it('should return a selector object for each element in the NodeList', function() {
                    var $nodes = $(nodeList);

                    expect($nodes.length).toBe(3);
                    expect($nodes[0]).toBe(nodeList[0]);
                    expect($nodes[1]).toBe(nodeList[1]);
                    expect($nodes[2]).toBe(nodeList[2]);

                    expect($nodes).not.toBe(nodeList);
                });
            });

            describe('with a single Element', function() {
                it('should return a selector object with the element as the sole member', function() {
                    var $input = $(nodeList[2]);

                    expect($input[0]).toBe(nodeList[2]);
                    expect($input.length).toBe(1);
                });
            });

            describe('with a string', function() {
                it('should return a Selector object with the elements that match the selector in the document', function() {
                    var $foo = $('.foo');

                    expect($foo[0]).toBe(nodeList[0]);
                    expect($foo[1]).toBe(nodeList[1].firstChild);
                    expect($foo.length).toBe(2);
                });
            });

            describe('with a selector', function() {
                it('should return the selector', function() {
                    var $div = $('<div>');

                    expect($($div)).toBe($div);
                });
            });

            describe('with a comment', function() {
                it('should make the comment element 0', function() {
                    var comment = document.createComment('This is a comment'),
                        $comment = $(comment);

                    expect($comment[0]).toBe(comment);
                });
            });

            describe('if something falsy is passed in', function() {
                it('should return an empty selector', function() {
                    expect($(null).length).toBe(0);
                });
            });
        });

        describe('creating', function() {
            it('should create a new HTML element of the specified type and with the specified attributes and return it in a Selector', function() {
                var $div = $('<div class="my-class" data-test="foo">');

                expect($div.classes()).toEqual(['my-class']);
                expect($div.attr('data-test')).toBe('foo');
            });

            it('should support creating elements whose attributes include spaces', function() {
                var $div = $('<div class="my-class foo" style="border: none;">');

                expect($div.classes()).toEqual(['my-class', 'foo']);
                expect($div.attr('style')).toBe('border: none;');
            });

            it('should support creating elements with contents', function() {
                var $span = $('<span>Hello friend!</span>');

                expect($span[0].firstChild.nodeValue).toBe('Hello friend!');
            });
        });

        describe('Selector', function() {
            beforeEach(function() {
                testBox.innerHTML = [
                    '<div class="c6 howard josh evan scott" style="position: relative; height: 10%; width: 10px;"></div>',
                    '<div class="c6 moo steph"></div>',
                    '<section>',
                    '    <h1>Title</h1>',
                    '    <ul>',
                    '        <li>Hello</li>',
                    '        <li><strong>Strong</strong></li>',
                    '        <li>Person</li>',
                    '    </ul>',
                    '</section>'
                ].join('\n');
            });

            describe('methods', function() {
                describe('addClass', function() {
                    it('should add the class to all the elements of the selector', function() {
                        var $c6 = $('.c6');

                        expect($c6.addClass('team')).toBe($c6);

                        expect($c6[0].className).toBe('c6 howard josh evan scott team');
                        expect($c6[1].className).toBe('c6 moo steph team');
                    });
                });

                describe('removeClass', function() {
                    it('should remove the class from all the elements in the Selector', function() {
                        var $c6 = $('.c6');

                        $c6.removeClass('c6');

                        expect($c6[0].className).toBe('howard josh evan scott');
                        expect($c6[1].className).toBe('moo steph');
                    });
                });

                describe('classes()', function() {
                    it('should return an array of classes for all the elements in the Selector', function() {
                        var $classes = $('.c6');

                        expect($classes.classes()).toEqual(['c6', 'howard', 'josh', 'evan', 'scott', 'moo', 'steph']);
                    });

                    it('should return an empty array if there are no classes', function() {
                        var $div = $('<div>');

                        expect($div.classes()).toEqual([]);
                    });
                });

                describe('forEach(iterator(node, index))', function() {
                    it('should iterate over each element in the Selector', function() {
                        var iterator = jasmine.createSpy('forEach iterator'),
                            $c6 = $('.c6');

                        $c6.forEach(iterator);

                        expect(iterator).toHaveBeenCalledWith($c6[0], 0);
                        expect(iterator).toHaveBeenCalledWith($c6[1], 1);
                    });
                });

                describe('forEachNode(iterator(node, parent))', function() {
                    it('should iterate over all nodes and their children', function() {
                        var $testBox = $(testBox),
                            iterator = jasmine.createSpy('forEachNode iterator');

                        var team1 = $('.c6.howard')[0],
                            team2 = $('.c6.moo')[0],
                            section = $('section')[0],
                            h1 = $('h1')[0],
                            ul = $('ul')[0],
                            $lis = $('li'),
                            li1 = $lis[0],
                            li2 = $lis[1],
                            strong = $('strong')[0],
                            li3 = $lis[2];

                        var nodes = [
                            testBox,
                            team1,
                            team2,
                            section,
                            h1,
                            ul,
                            li1,
                            li2,
                            strong,
                            li3
                        ];

                        $testBox.forEachNode(iterator);

                        expect(iterator.calls.count()).toBe(10);
                        nodes.forEach(function(node) {
                            expect(iterator).toHaveBeenCalledWith(node, node.parentNode);
                        });
                    });
                });

                describe('css(property)', function() {
                    it('should return the computed css value for the given property of the first element in the Selector', function() {
                        expect($('.c6.howard').css('height')).toBe('60px');
                        expect($('.c6.moo').css('position')).toBe('static');
                    });

                    it('should return undefined if it can\'t get the computed css values for an element', function() {
                        var span = document.createElement('span');
                        span.innerHTML = 'Foo';

                        expect($(span.firstChild).css('height')).toBeUndefined();
                    });
                });

                describe('css(config)', function() {
                    it('should set the css properties for all elements in the selector according to the config object', function() {
                        var $c6 = $('.c6');

                        $c6.css({
                            height: '10px',
                            visibility: 'hidden'
                        });

                        $c6.forEach(function(node) {
                            expect(node.style.height).toBe('10px');
                            expect(node.style.visibility).toBe('hidden');
                        });
                    });
                });

                describe('css(property, value)', function() {
                    it('should set the css property to the provided value for each element in the Selector', function() {
                        var $c6 = $('.c6');

                        $c6.css('display', 'none');
                        $c6.forEach(function(node) {
                            expect(node.style.display).toBe('none');
                        });

                        $c6.css('display', '');
                        $c6.forEach(function(node) {
                            expect(node.style.display).toBe('');
                        });
                    });
                });

                describe('hasClass(class)', function() {
                    it('should return a bool indicating if any of the elements in the selector has the class or not', function() {
                        var $c6 = $('.c6'),
                            $dev = $('.c6.howard'),
                            $design = $('.c6.moo');

                        expect($c6.hasClass('steph')).toBe(true);
                        expect($c6.hasClass('evan')).toBe(true);

                        expect($dev.hasClass('josh')).toBe(true);
                        expect($dev.hasClass('steph')).toBe(false);

                        expect($design.hasClass('moo')).toBe(true);
                        expect($design.hasClass('howard')).toBe(false);
                    });
                });

                describe('attr(prop)', function() {
                    it('should get the attribute from the first element in the Selector', function() {
                        var $dev = $('.howard');

                        expect($dev.attr('class')).toBe('c6 howard josh evan scott');
                        expect($dev.attr('style')).toBe('position: relative; height: 10%; width: 10px;');
                    });
                });

                describe('attr(prop, value)', function() {
                    it('should set the attribute to the provided value for every element in the Selector', function() {
                        var $c6 = $('.c6');

                        $c6.attr('data-test', 'foo');

                        $c6.forEach(function(node) {
                            expect(node.getAttribute('data-test')).toBe('foo');
                        });
                    });
                });

                describe('prop(key)', function() {
                    it('should get the object property of the first element', function() {
                        var $dev = $('.howard');

                        $dev[0].c6Foo = 'test';

                        expect($dev.prop('c6Foo')).toBe('test');
                    });
                });

                describe('prop(key, value)', function() {
                    it('should set the element property to the provided value for all elements', function() {
                        var $c6 = $('.c6');

                        $c6.prop('c6Foo', 'hello');

                        $c6.forEach(function(node) {
                            expect(node.c6Foo).toBe('hello');
                        });
                    });
                });

                describe('data(key) and data(key, value)', function() {
                    it('should store data on all elements and retrieve data from the first element', function() {
                        var $c6 = $('.c6'),
                            $dev = $('.howard'),
                            $design = $('.moo'),
                            data = {};

                        $c6.data('foo', data);

                        expect($c6.data('foo')).toBe(data);
                        expect($dev.data('foo')).toBe(data);
                        expect($design.data('foo')).toBe(data);
                    });

                    it('should be undefined if there is no data', function() {
                        expect($('.moo').data('test')).toBeUndefined();
                    });
                });

                describe('createSnapshot() and revertTo(index)', function() {
                    it('should save a copy of the current attributes state and allow you to revert to that state', function() {
                        var $c6 = $('.c6'),
                            $dev = $('.howard'),
                            $design = $('.moo');

                        $c6.createSnapshot();

                        $dev.attr('data-test', 'foo');
                        $dev.css({
                            position: 'fixed'
                        });

                        $dev.createSnapshot();

                        $dev.css({
                            width: '200px'
                        });

                        $design.addClass('foo-class');

                        $dev.revertTo(1);
                        expect($dev.css('width')).toBe('10px');
                        expect($dev.css('position')).toBe('fixed');
                        expect($dev.attr('data-test')).toBe('foo');

                        $c6.revertTo();
                        expect($design.hasClass('foo-class')).toBe(false);
                        expect($dev[0].hasAttribute('data-test')).toBe(false);
                        expect($dev.css('position')).toBe('relative');
                    });

                    it('should do nothing if there is no snapshot to revert to', function() {
                        expect(function() {
                            $('.howard').revertTo();
                        }).not.toThrow();
                    });

                    it('should be resilient to attribute being undefined', function() {
                        var $script = $('<script>');

                        $script.createSnapshot();

                        $script.addClass('foo-class');
                        $script.css({
                            visibility: 'hidden',
                            overflow: 'hidden',
                            height: 0
                        });

                        expect(function() {
                            $script.revertTo(0);
                        }).not.toThrow();
                    });
                });

                describe('insertBefore(selector)', function() {
                    it('should insert the element before the first element in the Selector', function() {
                        var $div = $('<div id="inserted">');

                        expect($div.insertBefore('ul')).toBe($div);

                        expect($('ul')[0].previousSibling).toBe($div[0]);
                    });
                });

                describe('insertAfter(selector)', function() {
                    it('should insert the elements after the first element in the Selector', function() {
                        var $div = $('<div>');

                        expect($div.insertAfter('ul')).toBe($div);

                        expect($('ul')[0].nextSibling).toBe($div[0]);
                    });
                });

                describe('append(selector)', function() {
                    it('should insert the specified selector into the target', function() {
                        var $div = $('<div>'),
                            $child = $('<span>Hello</span>');

                        expect($div.append($child)).toBe($div);

                        expect($child[0].parentNode).toBe($div[0]);
                    });
                });

                describe('remove()', function() {
                    it('should remove the elements of the selector from the DOM', function() {
                        var $lis = $('li');

                        $lis.remove();

                        $lis.forEach(function(li) {
                            expect(li.parentNode).toBeNull();
                        });
                    });
                });
            });
        });
    });
}());
