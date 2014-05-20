(function() {
    'use strict';

    describe('HostDocument', function() {
        var HostDocument,
            C6Query;

        var hostDocument,
            $;

        var test,
            $window;

        beforeEach(function() {
            test = document.createElement('iframe');

            test.src = 'about:blank';
            document.getElementsByTagName('body')[0].appendChild(test);

            HostDocument = require('../../src/HostDocument');
            C6Query = require('../../lib/C6Query');

            $window = test.contentWindow;

            $ = new C6Query({ window: test.contentWindow, document: test.contentWindow.document });
            hostDocument = new HostDocument({ $: $, window: $window });
        });

        afterEach(function() {
            document.getElementsByTagName('body')[0].removeChild(test);
        });

        it('should exist', function() {
            expect(hostDocument).toEqual(jasmine.any(Object));
        });

        describe('methods', function() {
            describe('shrink(shouldShrink)', function() {
                function orientationchange() {
                    var event = $window.document.createEvent('CustomEvent');

                    event.initCustomEvent('orientationchange');

                    $window.dispatchEvent(event);
                }

                beforeEach(function() {
                    spyOn($window, 'scrollTo');

                    $('head').append([
                        '<style>',
                        '    .header {',
                        '        height: 200px !important;',
                        '    }',
                        '    .floater {',
                        '        position: fixed !important;',
                        '        width: 300px;',
                        '        height: 300px !important;',
                        '    }',
                        '    .content {',
                        '        min-height: 500px !important;',
                        '        overflow: visible !important;',
                        '        margin: 100px;',
                        '    }',
                        '    .footer {',
                        '        position: fixed !important;',
                        '        bottom: 0px;',
                        '        padding: 50px;',
                        '    }',
                        '</style>'
                    ].join(''));

                    $('body').prop('innerHTML', [
                        '<div class="header">',
                        '    <ul class="nav">',
                        '        <li>Link One</li>',
                        '        <li>Link Two</li>',
                        '        <li>Link Three</li>',
                        '    </ul>',
                        '    <section class="floater">',
                        '        <p>Hello</p>',
                        '    </section>',
                        '    <section class="floater c6__cant-touch-this">',
                        '        <p>Duuuhh nuh nuh nuh</p>',
                        '    </section>',
                        '</div>',
                        '<div class="content">',
                        '    <article>',
                        '        <p>Blah Blah Blah blah!</p>',
                        '        <p>More content here...</p>',
                        '    </article>',
                        '</div>',
                        '<div class="content c6__cant-touch-this">',
                        '    <p>Hello</p>',
                        '</div>',
                        '<div class="footer">',
                        '    <p>Here is a footer</p>',
                        '</div>'
                    ].join(''));
                });

                describe('if it should shrink', function() {
                    beforeEach(function() {
                        hostDocument.shrink(true);
                    });

                    it('should make all the top-level elements have a height of 0', function() {
                        $('body>*').forEach(function(node) {
                            var style = test.contentWindow.getComputedStyle(node),
                                margin = parseFloat(style.marginTop) + parseFloat(style.marginBottom),
                                height = node.offsetHeight + margin;

                            if ($(node).hasClass('c6__cant-touch-this')) { return; }

                            expect(height).toBe(0);
                            expect($(node).css('position')).toBe('relative');
                            expect($(node).css('overflow')).toBe('hidden');
                        });
                    });

                    it('should make any position: fixed elements position: relative', function() {
                        expect($('.floater').css('position')).toBe('relative');
                    });

                    it('should not mess with elements with the c6__cant-touch-this class', function() {
                        var contentHeight = (function(node) {
                            var style = test.contentWindow.getComputedStyle(node),
                                margin = parseFloat(style.marginTop) + parseFloat(style.marginBottom),
                                height = node.offsetHeight + margin;

                            return height;
                        }($('.content.c6__cant-touch-this')[0]));

                        expect($('.floater.c6__cant-touch-this').css('position')).toBe('fixed');
                        expect(contentHeight).not.toBe(0);
                    });

                    it('should scroll the window to the top', function() {
                        expect($window.scrollTo).toHaveBeenCalledWith(0, 0);
                    });

                    it('should scroll the window to the top on every orientation change', function() {
                        orientationchange();
                        expect($window.scrollTo.calls.count()).toBe(2);

                        orientationchange();
                        expect($window.scrollTo.calls.count()).toBe(3);

                        $window.scrollTo.calls.all().forEach(function(call) {
                            expect(call.args).toEqual([0, 0]);
                        });
                    });
                });

                describe('if it should unshrink', function() {
                    beforeEach(function() {
                        hostDocument.shrink(true);
                        hostDocument.shrink(false);
                    });

                    it('should make everything the way it was', function() {
                        $('body>*').forEach(function(node) {
                            var style = test.contentWindow.getComputedStyle(node),
                                margin = parseFloat(style.marginTop) + parseFloat(style.marginBottom),
                                height = node.offsetHeight + margin;

                            expect(height).not.toBe(0);
                            ['min-height', 'max-height', 'margin', 'padding'].forEach(function(prop) {
                                expect(node.style[prop]).toBe('', prop);
                            });
                        });

                        expect($('.floater').css('position')).toBe('fixed');
                    });

                    it('should not scroll on an orientationchange anymore', function() {
                        $window.scrollTo.calls.reset();

                        orientationchange();
                        expect($window.scrollTo).not.toHaveBeenCalled();
                    });
                });
            });
        });
    });
}());
