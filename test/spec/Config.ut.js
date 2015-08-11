(function() {
    'use strict';

    describe('Config', function() {
        var Config,
            config;

        var Location,
            $location;

        var $window;

        beforeEach(function() {
            Config = require('../../src/app/Config');
            Location = require('../../src/app/utils/Location');

            $window = { location : { protocol: 'http:' } };
            $location = new Location({ window: $window, document: document });

            config = new Config({ window: $window, location: $location });
        });

        it('should exist', function() {
            expect(config).toEqual(jasmine.any(Object));
        });

        it('should set Config.debug to false if __C6_DEBUG__ is not set', function(){
            config = new Config({ window: $window, location: $location });
            expect(config.debug).toEqual(false);
        });

        it('should set Config.debug to __C6_DEBUG__ if __C6_DEBUG__ is set', function(){
            $window.__C6_DEBUG__ = true;
            config = new Config({ window: $window, location: $location });
            expect(config.debug).toEqual(true);
        });

        it('should set urlBase to $location.protocl + //portal.cinema6.com if __C6_URL_ROOT__ is not set',function(){
            $window.location.protocol = 'applewebdata:';
            config = new Config({ window: $window, location: $location });
            expect(config.urlRoot).toBe('http://portal.cinema6.com');
        });

        it('should set urlBase to __C6_URL_ROOT__ if set',function(){
            $window.__C6_URL_ROOT__ = 'http://staging.cinema6.com';
            config = new Config({ window: $window, location: $location });
            expect(config.urlRoot).toBe('http://staging.cinema6.com');
        });

        it('should set the apiBase based on urlBase', function() {
            $window.__C6_URL_ROOT__ = 'http://staging.cinema6.com';
            config = new Config({ window: $window, location: $location });
            expect(config.apiBase).toBe('http://staging.cinema6.com/api');
        });

        it('should set the appBase based on urlBase', function() {
            $window.__C6_URL_ROOT__ = 'http://staging.cinema6.com';
            config = new Config({ window: $window, location: $location });
            expect(config.appBase).toBe('http://staging.cinema6.com/apps');
        });
    });
}());
