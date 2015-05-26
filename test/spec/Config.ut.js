(function() {
    'use strict';

    describe('Config', function() {
        var Config,
            config;

        var $window;

        beforeEach(function() {
            Config = require('../../src/app/Config');

            $window = { location : { } };

            config = new Config({ window: $window });
        });

        it('should exist', function() {
            expect(config).toEqual(jasmine.any(Object));
        });

        it('should set Config.debug to false if __C6_DEBUG__ is not set', function(){
            config = new Config({ window: $window });
            expect(config.debug).toEqual(false);
        });

        it('should set Config.debug to __C6_DEBUG__ if __C6_DEBUG__ is set', function(){
            $window.__C6_DEBUG__ = true;
            config = new Config({ window: $window });
            expect(config.debug).toEqual(true);
        });

        it('should set urlBase to window.location.protocl + //portal.cinema6.com if __C6_URL_ROOT__ is not set',function(){
            $window.location.protocol = 'https:';
            config = new Config({ window: $window });
            expect(config.urlRoot).toBe('https://portal.cinema6.com');
        });

        it('should set urlBase to __C6_URL_ROOT__ if set',function(){
            $window.__C6_URL_ROOT__ = 'http://staging.cinema6.com';
            config = new Config({ window: $window });
            expect(config.urlRoot).toBe('http://staging.cinema6.com');
        });

        it('should set the apiBase based on urlBase', function() {
            $window.__C6_URL_ROOT__ = 'http://staging.cinema6.com';
            config = new Config({ window: $window });
            expect(config.apiBase).toBe('http://staging.cinema6.com/api');
        });

        it('should set the appBase based on urlBase', function() {
            $window.__C6_URL_ROOT__ = 'http://staging.cinema6.com';
            config = new Config({ window: $window });
            expect(config.appBase).toBe('http://staging.cinema6.com/apps');
        });
    });
}());
