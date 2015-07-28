describe('ga_helpers', function() {
    'use strict';

    describe('pagePath(id, params)', function() {
        var pagePath = require('../../src/ga_helpers').pagePath;
        var id, params;
        var result;

        beforeEach(function() {
            id = 'e-c16e077bc59beb';
            params = { bd: 'brand', ex: 'my experiment', vr: 'a variant' };

            result = pagePath(id, params);
        });

        it('should create a URL-like string', function() {
            expect(result).toBe('/embed/' + id + '/?bd=brand&ex=' + encodeURIComponent('my experiment') + '&vr=' + encodeURIComponent('a variant'));
        });

        describe('if no params are specified', function() {
            beforeEach(function() {
                params = {};
                result = pagePath(id, params);
            });

            it('should not include a search string', function() {
                expect(result).toBe('/embed/' + id + '/');
            });
        });

        describe('if some params are null or undefined', function() {
            beforeEach(function() {
                params = { bd: null, ex: 'exp', foo: 0, vr: undefined, bar: false };
                result = pagePath(id, params);
            });

            it('should not include those params', function() {
                expect(result).toBe('/embed/' + id + '/?ex=exp&foo=0&bar=false');
            });
        });
    });
});
