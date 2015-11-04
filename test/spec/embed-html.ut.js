var proxyquire = require('proxyquireify')(require);

describe('<script src="c6embed.js"></script>', function() {
    'use strict';

    var q;

    var container;
    var execute;

    var c6embed;
    var stubs;

    function load(attributes, setCurrentScript) {
        var script = document.createElement('script');
        var target = document.getElementById('target');

        script.setAttribute('src', 'c6embed.js');

        var attribute;
        for (attribute in attributes) {
            script.setAttribute(attribute, attributes[attribute]);
        }

        target.parentNode.insertBefore(script, target.nextSibling);

        if (setCurrentScript) {
            document.currentScript = script;
        }
        execute();
        document.currentScript = null;

        return script;
    }

    beforeEach(function() {
        container = document.createElement('div');
        container.innerHTML = [
            '<script src="embed.js" data-experience="e-446664208c1820" data-splash="text-only/1:1"></script>',
            '<script src="jquery.js"></script>',
            '<span id="target"></script>',
            '<script src="bootstrap.js"></script>',
            '<script src="custom.js"></script>'
        ].join('\n');
        document.body.appendChild(container);

        q = require('q');

        c6embed = jasmine.createSpy('c6embed()').and.returnValue(q(document.createElement('div')));

        stubs = {
            './embed-js': c6embed,

            '@noCallThru': true
        };

        execute = proxyquire('../../src/embed/embed-html', stubs);
    });

    afterEach(function() {
        document.body.removeChild(container);
    });

    describe('when executed', function() {
        var script;

        beforeEach(function() {
            script = load({
                'data-api-root': 'https://dev.cinema6.com/',
                'data-type': 'desktop-card',
                'data-experience': 'e-3f3b58482741e3',
                'data-campaign': 'cam-f71ce1be881d10',
                'data-branding': 'theinertia',
                'data-placement-id': '7475348',
                'data-container': 'digitaljournal',
                'data-wild-card-placement': '485738459',
                'data-page-url': 'cinema6.com',
                'data-host-app': 'Google Chrome',
                'data-network': 'cinema6',
                //'data-preview': false,
                'data-categories': 'food, tech',
                'data-play-urls': 'play1.gif,play2.gif',
                'data-count-urls': 'count1.gif,   count2.gif',
                'data-launch-urls': 'launch1.gif, launch2.gif',
                'data-mobile-type': 'swipe',
                'data-width': '800px',
                'data-height': '600px',
                //'data-auto-launch': false,
                'data-splash': 'img-text-overlay/16:9',
                'data-ex': 'my-experiment',
                'data-vr': 'some-variant'
                //'data-preload': false
            }, true);
        });

        it('should parse the configuration and call c6embed()', function() {
            expect(c6embed).toHaveBeenCalledWith(script, {
                apiRoot: 'https://dev.cinema6.com/',
                type: 'desktop-card',
                experience: 'e-3f3b58482741e3',
                campaign: 'cam-f71ce1be881d10',
                branding: 'theinertia',
                placementId: '7475348',
                container: 'digitaljournal',
                wildCardPlacement: '485738459',
                pageUrl: 'cinema6.com',
                hostApp: 'Google Chrome',
                network: 'cinema6',
                preview: false,
                categories: ['food', 'tech'],
                playUrls: ['play1.gif', 'play2.gif'],
                countUrls: ['count1.gif', 'count2.gif'],
                launchUrls: ['launch1.gif', 'launch2.gif'],
                mobileType: 'swipe',
                width: '800px',
                height: '600px',
                autoLaunch: false,
                splash: {
                    type: 'img-text-overlay',
                    ratio: '16:9'
                },
                ex: 'my-experiment',
                vr: 'some-variant',
                preload: false
            });
        });

        it('should set __c6Handled__ to true on the <script>', function() {
            expect(script.__c6Handled__).toBe(true);
        });

        describe('with the boolean parameters present', function() {
            beforeEach(function() {
                c6embed.calls.reset();
                script = load({
                    'data-api-root': 'https://dev.cinema6.com/',
                    'data-type': 'desktop-card',
                    'data-experience': 'e-3f3b58482741e3',
                    'data-campaign': 'cam-f71ce1be881d10',
                    'data-branding': 'theinertia',
                    'data-placement-id': '7475348',
                    'data-container': 'digitaljournal',
                    'data-wild-card-placement': '485738459',
                    'data-page-url': 'cinema6.com',
                    'data-host-app': 'Google Chrome',
                    'data-network': 'cinema6',
                    'data-preview': '', // boolean
                    'data-categories': 'food, tech',
                    'data-play-urls': 'play1.gif,play2.gif',
                    'data-count-urls': 'count1.gif,   count2.gif',
                    'data-launch-urls': 'launch1.gif, launch2.gif',
                    'data-mobile-type': 'swipe',
                    'data-width': '800px',
                    'data-height': '600px',
                    'data-auto-launch': '', // boolean
                    'data-splash': 'img-text-overlay/16:9',
                    'data-ex': 'my-experiment',
                    'data-vr': 'some-variant',
                    'data-preload': '' // boolean
                }, true);
            });

            it('should call c6embed() with their values set to true', function() {
                expect(c6embed).toHaveBeenCalledWith(script, jasmine.objectContaining({
                    preview: true,
                    autoLaunch: true,
                    preload: true
                }));
            });
        });

        describe('if document.currentScript is not supported', function() {
            beforeEach(function() {
                c6embed.calls.reset();
                script = load({
                    'data-api-root': 'https://dev.cinema6.com/',
                    'data-type': 'desktop-card',
                    'data-experience': 'e-3f3b58482741e3',
                    'data-campaign': 'cam-f71ce1be881d10',
                    'data-branding': 'theinertia',
                    'data-placement-id': '7475348',
                    'data-container': 'digitaljournal',
                    'data-wild-card-placement': '485738459',
                    'data-page-url': 'cinema6.com',
                    'data-host-app': 'Google Chrome',
                    'data-network': 'cinema6',
                    //'data-preview': '', // boolean
                    'data-categories': 'food, tech',
                    'data-play-urls': 'play1.gif,play2.gif',
                    'data-count-urls': 'count1.gif,   count2.gif',
                    'data-launch-urls': 'launch1.gif, launch2.gif',
                    'data-mobile-type': 'swipe',
                    'data-width': '800px',
                    'data-height': '600px',
                    //'data-auto-launch': '', // boolean
                    'data-splash': 'img-text-overlay/16:9',
                    'data-ex': 'my-experiment',
                    'data-vr': 'some-variant'
                    //'data-preload': '' // boolean
                }, false);
            });

            it('should find the <script> by looking for the last one', function() {
                expect(c6embed).toHaveBeenCalledWith(script, {
                    apiRoot: 'https://dev.cinema6.com/',
                    type: 'desktop-card',
                    experience: 'e-3f3b58482741e3',
                    campaign: 'cam-f71ce1be881d10',
                    branding: 'theinertia',
                    placementId: '7475348',
                    container: 'digitaljournal',
                    wildCardPlacement: '485738459',
                    pageUrl: 'cinema6.com',
                    hostApp: 'Google Chrome',
                    network: 'cinema6',
                    preview: false,
                    categories: ['food', 'tech'],
                    playUrls: ['play1.gif', 'play2.gif'],
                    countUrls: ['count1.gif', 'count2.gif'],
                    launchUrls: ['launch1.gif', 'launch2.gif'],
                    mobileType: 'swipe',
                    width: '800px',
                    height: '600px',
                    autoLaunch: false,
                    splash: {
                        type: 'img-text-overlay',
                        ratio: '16:9'
                    },
                    ex: 'my-experiment',
                    vr: 'some-variant',
                    preload: false
                });
            });

            describe('and a script has already been handled', function() {
                beforeEach(function() {
                    c6embed.calls.reset();
                    script = load({
                        'data-experience': 'e-2d60f3edb80d03',
                        'data-splash': 'img-only/6:5'
                    }, false);
                });

                it('should not parse that <script> again', function() {
                    expect(c6embed).toHaveBeenCalledWith(script, {
                        experience: 'e-2d60f3edb80d03',
                        splash: {
                            type: 'img-only',
                            ratio: '6:5'
                        },
                        preload: false,
                        autoLaunch: false,
                        preview: false
                    });
                });
            });
        });
    });
});
