(function() {
    'use strict';

    var app,
        q,
        asEvented;

    var $document,
        c6Db,
        c6Ajax,
        experience,
        config;

    var iframe,
        exp,
        session,
        indexHTML;

    function Parent() {
        this.insertBefore = jasmine.createSpy('parent.insertBefore()')
            .and.callFake(function(newElement) {
                return newElement;
            });
    }

    function Sibling() {

    }

    function Script() {
        this.parentNode = new Parent();
        this.nextSibling = new Sibling();
    }

    function Iframe() {
        this.src = null;
        this.contentWindow = {
            document: {
                open: jasmine.createSpy('document.open()'),
                write: jasmine.createSpy('document.write()'),
                close: jasmine.createSpy('document.close()')
            }
        };
        this.style = {};
    }

    function Session() {
        asEvented.call(this);

        spyOn(this, 'on').and.callThrough();

        session = this;
    }

    function run() {
        app({ document: $document, config: config, q: q, c6Db: c6Db, c6Ajax: c6Ajax, experience: experience });
    }

    beforeEach(function() {
        app = require('../../src/app');
        q = require('../../node_modules/q/q.js');
        asEvented = require('../../node_modules/asEvented/asevented.js');

        exp = {
            id: 'e-dbc8133f4d41a7',
            appUri: 'minireel'
        };

        indexHTML = [
            '<html>',
            '    <head>',
            '        <title>My Title</title>',
            '    </head>',
            '    <body>',
            '        <h1>This is the file!</h1>',
            '    </body>',
            '</html>'
        ].join('\n');

        $document = {
            createElement: jasmine.createSpy('$document.createElement()')
                .and.callFake(function(tag) {
                    if (tag.toLowerCase() === 'iframe') {
                        iframe = new Iframe();
                        return iframe;
                    }
                })
        };

        config = {
            experienceId: 'e-dbc8133f4d41a7',
            script: new Script(),
            width: '100%',
            height: '200'
        };

        experience = {
            registerExperience: jasmine.createSpy('experience.registerExperience()')
                .and.callFake(function() {
                    return new Session();
                })
        };

        c6Ajax = jasmine.createSpy('c6Ajax()')
            .and.callFake(function(config) {
                if (config.method === 'GET') {
                    if (config.url === 'http://s3.amazonaws.com/c6.dev/content/minireel/index.html' ||
                        config.url === 'http://cinema6.com/experiences/minireel/index.html') {

                        return q.when({
                            status: 200,
                            data: indexHTML,
                            headers: function() { return {}; }
                        });
                    }
                }
            });
        c6Ajax.get = jasmine.createSpy('c6Ajax.get()')
            .and.callFake(function(url, config) {
                config = config || {};

                config.method = 'GET';
                config.url = url;

                return c6Ajax(config);
            });

        c6Db = {
            find: jasmine.createSpy('c6Db.find()')
                .and.callFake(function(type, id) {
                    if (type === 'experience' && id === 'e-dbc8133f4d41a7') {
                        return q.when(exp);
                    }
                })
        };
    });

    describe('creating the iframe', function() {
        beforeEach(run);

        it('should create an empty iframe after the script tag', function() {
            var script = config.script,
                parent = config.script.parentNode;

            expect(iframe.src).toBe('about:blank');
            expect(iframe.height).toBe(config.height);
            expect(iframe.width).toBe(config.width);
            expect(iframe.style.border).toBe('none');
            expect(iframe.scrolling).toBe('yes');

            expect(parent.insertBefore).toHaveBeenCalledWith(iframe, script.nextSibling);
        });
    });

    describe('fetching the experience', function() {
        beforeEach(function(done) {
            run();
            setTimeout(done, 1);
        });

        it('should fetch the experience', function() {
            expect(c6Db.find).toHaveBeenCalledWith('experience', config.experienceId);
        });
    });

    describe('fetching index.html', function() {
        describe('if in debug mode', function() {
            beforeEach(function(done) {
                config.debug = true;

                run();
                setTimeout(done, 2);
            });

            it('should fetch the index file from the dev box', function() {
                expect(c6Ajax.get).toHaveBeenCalledWith('http://s3.amazonaws.com/c6.dev/content/minireel/index.html');
            });
        });

        describe('if not in debug mode', function() {
            beforeEach(function(done) {
                run();
                setTimeout(done, 2);
            });

            it('should fetch the index file from the dev box', function() {
                expect(c6Ajax.get).toHaveBeenCalledWith('http://cinema6.com/experiences/minireel/index.html');
            });
        });
    });

    describe('loading the app into the iframe', function() {
        beforeEach(function(done) {
            run();
            setTimeout(done, 3);
        });

        it('should write the contents of index.html into the iframe with a base tag to fix relative urls', function() {
            var iframeDoc = iframe.contentWindow.document;

            expect(iframeDoc.open).toHaveBeenCalled();
            expect(iframeDoc.write).toHaveBeenCalledWith(indexHTML);
            expect(iframeDoc.write).toHaveBeenCalledWith('<base href="http://cinema6.com/experiences/minireel/">');
            expect(iframeDoc.close).toHaveBeenCalled();
        });
    });

    describe('communicating with the application', function() {
        beforeEach(function(done) {
            run();
            setTimeout(done, 4);
        });

        it('should register the experience', function() {
            expect(experience.registerExperience).toHaveBeenCalledWith(exp, iframe.contentWindow);
        });

        describe('when the session is ready', function() {
            beforeEach(function() {
                session.trigger('ready', true);
            });

            it('should listen for the fullscreenMode event', function() {
                expect(session.on).toHaveBeenCalledWith('fullscreenMode', jasmine.any(Function));
            });

            describe('when the experience requests fullscreen', function() {
                beforeEach(function() {
                    session.trigger('fullscreenMode', true);
                });

                it('should give the iframe fullscreen styles', function() {
                    var style = iframe.style;

                    expect(style.position).toBe('fixed');
                    expect(style.top).toBe(0);
                    expect(style.right).toBe(0);
                    expect(style.bottom).toBe(0);
                    expect(style.left).toBe(0);
                    expect(style.width).toBe('100%');
                    expect(style.height).toBe('100%');
                    expect(style.zIndex).toBe(999999999999999);
                });
            });

            describe('when the experience requests to leave fullscreen', function() {
                beforeEach(function() {
                    session.trigger('fullscreenMode', true);
                    session.trigger('fullscreenMode', false);
                });

                it('should give the iframe default styles', function() {
                    var style = iframe.style;

                    expect(style.position).toBe('');
                    expect(style.top).toBe('');
                    expect(style.right).toBe('');
                    expect(style.bottom).toBe('');
                    expect(style.left).toBe('');
                    expect(style.width).toBe('');
                    expect(style.height).toBe('');
                    expect(style.zIndex).toBe('');
                });
            });
        });
    });
}());
