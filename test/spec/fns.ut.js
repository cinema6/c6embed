var extend = require('../../lib/fns').extend;

describe('fns', function() {
    'use strict';

    describe('.extend', function() {
        var object1, object2, object3;
        var result;

        beforeEach(function() {
            object1 = {
                name: 'Josh',
                job: 'Software Engineer'
            };

            object2 = {
                age: 24,
                company: 'McDonalds'
            };

            object3 = {
                company: 'Cinema6'
            };

            result = extend(object1, object2, object3);
        });

        it('should combine the properties of the objects with right-most arguments taking precedence', function() {
            expect(result).toEqual({
                name: 'Josh',
                job: 'Software Engineer',
                age: 24,
                company: 'Cinema6'
            });
        });

        describe('if one of the objects is not an object', function() {
            beforeEach(function() {
                object2 = null;

                result = extend(object1, object2, object3);
            });

            it('should ignore that object', function() {
                expect(result).toEqual({
                    name: 'Josh',
                    job: 'Software Engineer',
                    company: 'Cinema6'
                });
            });
        });
    });
});
