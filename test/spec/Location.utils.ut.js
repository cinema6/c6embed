(function() {
    'use strict';

    describe('utils/Location', function() {
        var Location,
            $location;

        var $window;

        beforeEach(function() {
            $window = {
                location: {
                    href: 'http://www.cinema6.com',
                    protocol: 'http:'
                }
            };

            Location = require('../../src/app/utils/Location');
            $location = new Location({ window: $window });
        });

        it('should exist', function() {
            expect($location).toEqual(jasmine.any(Object));
        });

        describe('@public', function() {
            describe('properties', function() {
                describe('origin', function() {
                    it('should be read-only', function() {
                        expect(function() {
                            $location.origin = 'foo';
                        }).toThrow();
                    });

                    it('should be the origin of the current page', function() {
                        expect($location.origin).toBe('http://www.cinema6.com:80');

                        $window.location.href = 'https://my.apple.com:4444/icloud?name=josh';
                        expect($location.origin).toBe('https://my.apple.com:4444');
                    });
                });

                describe('protocol', function() {
                    ['http:', 'https:'].forEach(function(protocol) {
                        describe('if the location.protocol is ' + protocol, function() {
                            beforeEach(function() {
                                $window.location.protocol = protocol;
                            });

                            it('should be the protocol', function() {
                                expect($location.protocol).toBe(protocol);
                            });
                        });
                    });

                    ['applewebdata:'].forEach(function(protocol) {
                        describe('if the location.protocol is ' + protocol, function() {
                            beforeEach(function() {
                                $window.location.protocol = protocol;
                            });

                            it('should be "http:"', function() {
                                expect($location.protocol).toBe('http:');
                            });
                        });
                    });
                });
            });

            describe('methods', function() {
                describe('originOf(url)', function() {
                    it('should parse a full url into an origin', function() {
                        expect($location.originOf('http://www.apple.com/foo/test.html?blah=okay'))
                            .toBe('http://www.apple.com:80');

                        expect($location.originOf('https://dev.google.com')).toBe('https://dev.google.com:443');

                        expect($location.originOf('http://cinema6.com:8080/foo.jpg')).toBe('http://cinema6.com:8080');

                        expect($location.originOf('https://my.cinema6.com/#/test/foo')).toBe('https://my.cinema6.com:443');

                        expect($location.originOf('http://test.com/foo.html')).toBe('http://test.com:80');
                    });

                    it('should return the origin of the current page if a relative url is provided', function() {
                        expect($location.originOf('foo.html')).toBe('http://www.cinema6.com:80');

                        expect($location.originOf('/test/foo.html')).toBe('http://www.cinema6.com:80');

                        expect($location.originOf('/test/foo.html?test')).toBe('http://www.cinema6.com:80');
                    });

                    it('should handle localhost and IP urls', function() {
                        expect($location.originOf('http://localhost:9000')).toBe('http://localhost:9000');

                        expect($location.originOf('http://10.61.32.32:3000')).toBe('http://10.61.32.32:3000');
                    });
                });
            });
        });
    });
}());
