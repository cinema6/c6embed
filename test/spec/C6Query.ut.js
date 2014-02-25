(function() {
    'use strict';

    describe('C6Query', function() {
        var C6Query,
            $;

        var testBox;

        beforeEach(function() {
            C6Query = require('../../lib/C6Query');

            testBox = document.createElement('div');
            testBox.id = 'test-box';
            testBox.style.width = '800px';
            testBox.style.height = '600px';
            testBox.style.position = 'relative';

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
        });

        describe('Selector', function() {
            beforeEach(function() {
                testBox.innerHTML = [
                    '<div class="c6 howard josh evan scott" style="position: relative; height: 10%;"></div>',
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

                        $c6.addClass('team');

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
            });
        });
    });
}());
