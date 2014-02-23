(function() {
    'use strict';

    describe('C6AJAX', function() {
        var C6AJAX,
            q,
            c6Ajax;

        var $window,
            $location,
            browserInfo,
            xhrs,
            xhr,
            xdrs,
            xdr;

        function MockXHR() {
            var self = this;

            this.onreadystatechange = null;
            this.readyState = 0;
            this.response = null;
            this.responseText = null;
            Object.defineProperty(this, 'responseType', {
                get: function() {
                    return responseType;
                },
                set: function(value) {
                    if (self.open.calls.count() < 1) {
                        throw new Error('Must call open() before setting responseType!');
                    }

                    responseType = value;
                }
            });
            var responseType = '';
            this.responseXML = null;
            this.status = null;
            this.statusText = null;
            this.timeout = 0;
            this.ontimeout = null;
            this.upload = null;
            this.withCredentials = false;

            this.abort = jasmine.createSpy('xhr.abort()');
            this.getAllResponseHeaders = jasmine.createSpy('xhr.getAllResponseHeaders()');
            this.getResponseHeader = jasmine.createSpy('xhr.getResponseHeader()');
            this.open = jasmine.createSpy('xhr.open(method, url, async, user, password)');
            this.overrideMimeType = jasmine.createSpy('xhr.overrideMimeType()');
            this.send = jasmine.createSpy('xhr.send(data)');
            this.setRequestHeader = jasmine.createSpy('xhr.setRequestHeader(header, value)')
                .and.callFake(function() {
                    if (self.open.calls.count() < 1) {
                        throw new Error('Cannot set request headers before calling open()!');
                    }
                });

            xhrs.push(this);

            xhr = this;
        }

        function MockXDR() {
            this.onerror = null;
            this.onload = null;
            this.onprogress = null;
            this.ontimeout = null;

            this.abort = jasmine.createSpy('xdr.abort()');
            this.open = jasmine.createSpy('xdr.open(method, url)');
            this.send = jasmine.createSpy('xdr.send(string)');

            this.constructor = MockXHR;
            this.contentType = '';
            this.responseText = '';
            this.timeout = 0;

            xdrs.push(this);

            xdr = this;
        }

        beforeEach(function() {
            xhrs = [];
            xdrs = [];

            C6AJAX = require('../../lib/c6ajax/C6AJAX');
            q = require('../../node_modules/q/q.js');

            $window = {
                XMLHttpRequest: MockXHR
            };

            $location = {
                origin: 'http://elitedaily.com:80',
                originOf: jasmine.createSpy('$location.originOf()')
                    .and.returnValue('http://elitedaily.com:80')
            };

            browserInfo = {
                profile: {
                    cors: true
                }
            };

            c6Ajax = new C6AJAX({ q: q, window: $window, location: $location, browserInfo: browserInfo });
        });

        it('should exist', function() {
            expect(c6Ajax).toEqual(jasmine.any(Function));
        });

        it('should make an XHR request with the provided configuration', function() {
            c6Ajax({
                method: 'GET',
                url: 'http://www.foo.com',
                params: {
                    name: 'josh',
                    age: 22
                },
                headers: {
                    'Header1': 'blah blah',
                    'Another-Header': 'foo'
                },
                timeout: 30000,
                responseType: 'json'
            });

            expect(xhr.open).toHaveBeenCalledWith('GET', 'http://www.foo.com?name=josh&age=22', true);
            expect(xhr.setRequestHeader).toHaveBeenCalledWith('Header1', 'blah blah');
            expect(xhr.setRequestHeader).toHaveBeenCalledWith('Another-Header', 'foo');
            expect(xhr.timeout).toBe(30000);
            expect(xhr.responseType).toBe('json');

            expect(xhr.send).toHaveBeenCalled();
        });

        it('should only require a method and url', function() {
            c6Ajax({
                method: 'DELETE',
                url: 'http://www.cinema6.com'
            });

            expect(xhr.open).toHaveBeenCalledWith('DELETE', 'http://www.cinema6.com', true);
            expect(xhr.setRequestHeader).not.toHaveBeenCalled();
            expect(xhr.timeout).toBe(0);
            expect(xhr.responseType).toBe('');

            expect(xhr.send).toHaveBeenCalled();
        });

        it('should support sending data in the request body', function() {
            c6Ajax({
                method: 'POST',
                url: 'http://api.twitter.com/tweets',
                data: {
                    tweets: [
                        {
                            message: 'This is a tweet!'
                        }
                    ]
                }
            });

            expect(xhr.open).toHaveBeenCalledWith('POST', 'http://api.twitter.com/tweets', true);
            expect(xhr.setRequestHeader).not.toHaveBeenCalled();
            expect(xhr.timeout).toBe(0);
            expect(xhr.responseType).toBe('');

            expect(xhr.send).toHaveBeenCalledWith({
                tweets: [
                    {
                        message: 'This is a tweet!'
                    }
                ]
            });
        });

        it('should properly encode params for the url', function() {
            c6Ajax({
                method: 'GET',
                url: 'http://www.test.com',
                params: {
                    url: 'http://www.troll.com?name=joe',
                    'full name': 'Joe Lewis'
                }
            });

            expect(xhr.open).toHaveBeenCalledWith('GET', 'http://www.test.com?url=http%3A%2F%2Fwww.troll.com%3Fname%3Djoe&full%20name=Joe%20Lewis', true);
        });

        it('should return a promise', function() {
            expect(c6Ajax({
                method: 'GET',
                url: 'foo.com'
            }).then).toEqual(jasmine.any(Function));
        });

        describe('when a response comes back', function() {
            var success, failure;

            beforeEach(function() {
                success = jasmine.createSpy('c6Ajax success');
                failure = jasmine.createSpy('c6Ajax failure');

                c6Ajax({
                    method: 'GET',
                    url: 'test.com'
                }).then(success, failure);
            });

            describe('if the readyState is not 4', function() {
                describe('0', function() {
                    beforeEach(function(done) {
                        xhr.readyState = 0;
                        xhr.onreadystatechange();
                        setTimeout(done, 0);
                    });

                    it('should do nothing', function() {
                        expect(success).not.toHaveBeenCalled();
                        expect(failure).not.toHaveBeenCalled();
                    });
                });

                describe('1', function() {
                    beforeEach(function(done) {
                        xhr.readyState = 1;
                        xhr.onreadystatechange();
                        setTimeout(done, 0);
                    });

                    it('should do nothing', function() {
                        expect(success).not.toHaveBeenCalled();
                        expect(failure).not.toHaveBeenCalled();
                    });
                });

                describe('2', function() {
                    beforeEach(function(done) {
                        xhr.readyState = 2;
                        xhr.onreadystatechange();
                        setTimeout(done, 0);
                    });

                    it('should do nothing', function() {
                        expect(success).not.toHaveBeenCalled();
                        expect(failure).not.toHaveBeenCalled();
                    });
                });

                describe('3', function() {
                    beforeEach(function(done) {
                        xhr.readyState = 3;
                        xhr.onreadystatechange();
                        setTimeout(done, 0);
                    });

                    it('should do nothing', function() {
                        expect(success).not.toHaveBeenCalled();
                        expect(failure).not.toHaveBeenCalled();
                    });
                });
            });

            describe('when the readyState is 4', function() {
                beforeEach(function() {
                    xhr.readyState = 4;
                });

                describe('if the status code is not 4xx or 5xx', function() {
                    beforeEach(function(done) {
                        xhr.status = 200;
                        xhr.response = JSON.stringify({
                            name: 'Josh',
                            city: 'Pittstown',
                            state: 'NJ'
                        });

                        xhr.onreadystatechange();
                        setTimeout(done, 0);
                    });

                    it('should resolve the promise with the response', function() {
                        expect(success).toHaveBeenCalledWith({
                            status: 200,
                            data: JSON.parse(xhr.response),
                            headers: jasmine.any(Function)
                        });
                        success.calls.mostRecent().args[0].headers();
                        expect(xhr.getAllResponseHeaders).toHaveBeenCalled();
                        expect(xhr.getAllResponseHeaders.calls.mostRecent().object).toBe(xhr);
                    });
                });

                describe('if the status code is 4xx or 5xx', function() {
                    beforeEach(function(done) {
                        xhr.status = 404;
                        xhr.response = 'It wasn\'t there...';

                        xhr.onreadystatechange();
                        setTimeout(done, 0);
                    });

                    it('should reject the promise with the response', function() {
                        expect(failure).toHaveBeenCalledWith({
                            status: 404,
                            data: xhr.response,
                            headers: jasmine.any(Function)
                        });
                        failure.calls.mostRecent().args[0].headers();
                        expect(xhr.getAllResponseHeaders).toHaveBeenCalled();
                        expect(xhr.getAllResponseHeaders.calls.mostRecent().object).toBe(xhr);
                    });
                });
            });
        });

        describe('methods', function() {
            describe('get(url, config)', function() {
                it('should be shorthand for making a get request', function() {
                    expect(c6Ajax.get('http://www.apple.com', {
                        params: { name: 'howard' }
                    }).then).toEqual(jasmine.any(Function));

                    expect(xhr.open).toHaveBeenCalledWith('GET', 'http://www.apple.com?name=howard', true);
                    expect(xhr.send).toHaveBeenCalled();
                });

                it('should work without providing a config object', function() {
                    c6Ajax.get('foo.com');

                    expect(xhr.open).toHaveBeenCalledWith('GET', 'foo.com', true);
                    expect(xhr.send).toHaveBeenCalled();
                });
            });

            describe('delete(url, config)', function() {
                it('should be shorthand for making a delete request', function() {
                    expect(c6Ajax.delete('http://www.apple.com', {
                        params: { name: 'howard' }
                    }).then).toEqual(jasmine.any(Function));

                    expect(xhr.open).toHaveBeenCalledWith('DELETE', 'http://www.apple.com?name=howard', true);
                    expect(xhr.send).toHaveBeenCalled();
                });

                it('should work without providing a config object', function() {
                    c6Ajax.delete('foo.com');

                    expect(xhr.open).toHaveBeenCalledWith('DELETE', 'foo.com', true);
                    expect(xhr.send).toHaveBeenCalled();
                });
            });

            describe('post(url, data, config)', function() {
                it('should be shorthand for making a post request', function() {
                    expect(c6Ajax.post('http://www.apple.com', { name: 'josh' }, {
                        params: { name: 'howard' }
                    }).then).toEqual(jasmine.any(Function));

                    expect(xhr.open).toHaveBeenCalledWith('POST', 'http://www.apple.com?name=howard', true);
                    expect(xhr.send).toHaveBeenCalledWith({ name: 'josh' });
                });

                it('should work without providing a config object', function() {
                    c6Ajax.post('foo.com', { name: 'josh' });

                    expect(xhr.open).toHaveBeenCalledWith('POST', 'foo.com', true);
                    expect(xhr.send).toHaveBeenCalledWith({ name: 'josh' });
                });
            });

            describe('put(url, data, config)', function() {
                it('should be shorthand for making a put request', function() {
                    expect(c6Ajax.put('http://www.apple.com', { name: 'josh' }, {
                        params: { name: 'howard' }
                    }).then).toEqual(jasmine.any(Function));

                    expect(xhr.open).toHaveBeenCalledWith('PUT', 'http://www.apple.com?name=howard', true);
                    expect(xhr.send).toHaveBeenCalledWith({ name: 'josh' });
                });

                it('should work without providing a config object', function() {
                    c6Ajax.put('foo.com', { name: 'josh' });

                    expect(xhr.open).toHaveBeenCalledWith('PUT', 'foo.com', true);
                    expect(xhr.send).toHaveBeenCalledWith({ name: 'josh' });
                });
            });
        });

        describe('if the request is cross-domain, there is not CORS support, but there is XDomainRequest support (IE8/IE9)', function() {
            beforeEach(function() {
                browserInfo.profile.cors = false;
                $window.XDomainRequest = MockXDR;

                c6Ajax = new C6AJAX({ q: q, window: $window, location: $location, browserInfo: browserInfo });
            });

            describe('GETting', function() {
                beforeEach(function() {
                    $location.originOf.and.returnValue('http://www.foo.com:80');
                });

                it('should send an XDR request to the server', function() {
                    c6Ajax({
                        method: 'GET',
                        url: 'http://www.foo.com',
                        params: {
                            name: 'josh',
                            age: 22
                        },
                        timeout: 30000,
                        responseType: 'json'
                    });

                    expect(xdr.open).toHaveBeenCalledWith('GET', 'http://www.foo.com?name=josh&age=22');
                    expect(xdr.timeout).toBe(30000);
                    expect(xdr.send).toHaveBeenCalledWith('');
                });

                it('should support a minimal amount of configuration', function() {
                    c6Ajax({
                        method: 'GET',
                        url: 'http://www.foo.com/test.html'
                    });

                    expect(xdr.open).toHaveBeenCalledWith('GET', 'http://www.foo.com/test.html');
                    expect(xdr.timeout).toBe(0);
                    expect(xdr.send).toHaveBeenCalledWith('');
                });
            });

            describe('POSTing', function() {
                beforeEach(function() {
                    $location.originOf.and.returnValue('http://cinema6.com:80');
                });

                it('should send an XDR request to the server', function() {
                    c6Ajax({
                        method: 'POST',
                        url: 'http://cinema6.com/api/experiences',
                        data: {
                            experiences: [
                                {
                                    name: 'Awesome Experience'
                                }
                            ]
                        }
                    });

                    expect(xdr.open).toHaveBeenCalledWith('POST', 'http://cinema6.com/api/experiences');
                    expect(xdr.timeout).toBe(0);
                    expect(xdr.send).toHaveBeenCalledWith(JSON.stringify({
                        experiences: [
                            {
                                name: 'Awesome Experience'
                            }
                        ]
                    }));
                });

                it('should support sending non-JSON data', function() {
                    expect(function() {
                        c6Ajax({
                            method: 'POST',
                            url: 'http://cinema6.com/api/experiences',
                            data: 'I\'m just a string!'
                        });
                    }).not.toThrow();

                    expect(xdr.open).toHaveBeenCalledWith('POST', 'http://cinema6.com/api/experiences');
                    expect(xdr.timeout).toBe(0);
                    expect(xdr.send).toHaveBeenCalledWith('I\'m just a string!');
                });
            });

            describe('responding to events', function() {
                var success, fail;

                beforeEach(function() {
                    $location.originOf.and.returnValue('http://www.benfolds.com:80');

                    success = jasmine.createSpy('success');
                    fail = jasmine.createSpy('fail');
                });

                describe('onerror', function() {
                    it('should reject the promise', function(done) {
                        c6Ajax({
                            method: 'GET',
                            url: 'http://www.benfolds.com/test.json'
                        }).then(success, fail);

                        xdr.onerror();

                        setTimeout(function() {
                            expect(fail).toHaveBeenCalledWith({
                                status: null,
                                data: 'The XDomainRequest failed. We\'d tell you more if we could...',
                                headers: jasmine.any(Function)
                            });
                            done();
                        }, 1);
                    });
                });

                describe('ontimeout', function() {
                    it('should reject the promise', function(done) {
                        c6Ajax({
                            method: 'GET',
                            url: 'http://www.benfolds.com',
                            timeout: 10000
                        }).then(success, fail);

                        xdr.ontimeout();

                        setTimeout(function() {
                            expect(fail).toHaveBeenCalledWith({
                                status: null,
                                data: 'The XDomainRequest timed out after 10000ms.',
                                headers: jasmine.any(Function)
                            });
                            done();
                        }, 1);
                    });
                });

                describe('onload', function() {
                    it('should resolve the promise', function(done) {
                        c6Ajax({
                            method: 'GET',
                            url: 'http://www.benfolds.com'
                        }).then(success, fail);

                        xdr.responseText = '<html><head><title>Ben Folds</title></head><body>Homepage</body></html>';
                        xdr.onload();

                        setTimeout(function() {
                            expect(success).toHaveBeenCalledWith({
                                status: null,
                                data: xdr.responseText,
                                headers: jasmine.any(Function)
                            });
                            done();
                        }, 1);
                    });

                    it('should try to convert the text into JSON', function(done) {
                        var obj = {
                            name: 'Josh',
                            age: 22
                        };

                        c6Ajax({
                            method: 'GET',
                            url: 'http://www.benfolds.com/foo.json'
                        }).then(success, fail);

                        xdr.responseText = JSON.stringify(obj);
                        xdr.onload();

                        setTimeout(function() {
                            expect(success).toHaveBeenCalledWith({
                                status: null,
                                data: obj,
                                headers: jasmine.any(Function)
                            });
                            done();
                        }, 1);
                    });
                });
            });
        });
    });
}());
