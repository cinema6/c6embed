(function() {
    'use strict';

    describe('embed.js', function() {
        var C6Query;

        var $;

        beforeEach(function() {
            C6Query = require('../../lib/C6Query');

            $ = new C6Query({ window: window, document: document });
        });

        describe('common functionality', function() {
            var $div, $script;

            [
                {
                    'data-exp': 'e-123'
                }
            ].forEach(function(config) {
                describe('with config: ' + config, function() {
                    beforeEach(function(done) {
                        var $body = $('body'),
                            script = document.createElement('script');

                        $div = $('<div id="test"></div>');
                        $body.append($div);

                        script.src = '/base/lite/embed.js';
                        for (var key in config) {
                            script.setAttribute(key, config[key]);
                        }

                        $script = $(script);
                        $script[0].onload = done;
                        $div.append($script);
                    });

                    afterEach(function() {
                        $div.remove();
                        delete window.c6;
                    });

                    describe('the c6 object', function() {
                        it('should exist', function() {
                            expect(window.c6).toEqual({
                                embeds: {
                                    'e-123': {
                                        script: $script[0],
                                        load: false
                                    }
                                },
                                push: jasmine.any(Function)
                            });
                        });

                        describe('methods', function() {
                            describe('push(script)', function() {
                                var script = {
                                    attributes: [
                                        {
                                            name: 'src',
                                            value: '/base/lite/embed.js'
                                        },
                                        {
                                            name: 'data-exp',
                                            value: 'e-abc'
                                        }
                                    ]
                                };

                                beforeEach(function() {
                                    script = {};

                                    window.c6.push(script);
                                });

                                it('should add the embed to its hash', function() {
                                    expect(window.c6.embeds['e-abc']).toEqual({
                                        script: script,
                                        load: false
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
}());
