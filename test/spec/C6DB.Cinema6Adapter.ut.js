(function() {
    'use strict';

    describe('C6DB.Adapters.Cinema6', function() {
        var Cinema6Adapter,
            adapter,
            q;

        var c6Ajax;

        beforeEach(function() {
            Cinema6Adapter = require('../../lib/c6db/adapters/Cinema6');
            q = require('../../node_modules/q/q.js');

            c6Ajax = jasmine.createSpy('c6Ajax()');
            c6Ajax.get = jasmine.createSpy('c6Ajax.get()');

            adapter = new Cinema6Adapter({ c6Ajax: c6Ajax, q: q });
        });

        it('should exist', function() {
            expect(adapter).toEqual(jasmine.any(Object));
        });

        describe('@private', function() {
            beforeEach(function() {
                adapter.apiBase = 'http://cinema6.com/api';
            });

            describe('_serviceForType(type)', function() {
                it('should be "content" for "experience"', function() {
                    expect(adapter._serviceForType('experience')).toBe('content');
                });

                it('should be undefined for everything else', function() {
                    expect(adapter._serviceForType('expgroup')).toBeUndefined();
                    expect(adapter._serviceForType('address')).toBeUndefined();
                });
            });

            describe('_services.content.findAll(type)', function() {
                var result,
                    success, failure;

                beforeEach(function() {
                    success = jasmine.createSpy('findAll() success');
                    failure = jasmine.createSpy('findAll() failure');

                    result = { data: [{}, {}, {}], status: 200 };

                    c6Ajax.get.and.returnValue(q.when(result));
                });

                it('should fetch all content of the specified type', function(done) {
                    adapter._services.content.findAll('experience')
                        .then(success, failure)
                        .finally(function() {
                            expect(success).toHaveBeenCalledWith(result.data);
                            done();
                        });

                    expect(c6Ajax.get).toHaveBeenCalledWith('http://cinema6.com/api/content/experiences');
                });
            });

            describe('_services.content.find(type, id)', function() {
                var result,
                    success, failure;

                beforeEach(function() {
                    success = jasmine.createSpy('find() success');
                    failure = jasmine.createSpy('find() failure');

                    result = {
                        data: {
                            id: 'e1',
                            data: {
                                test: 'foo'
                            }
                        },
                        status: 200
                    };

                    c6Ajax.get.and.returnValue(q.when(result));
                });

                it('should fetch a single item', function(done) {
                    adapter._services.content.find('expgroup', 'e1')
                        .then(success, failure)
                        .finally(function() {
                            expect(success).toHaveBeenCalledWith([result.data]);
                            done();
                        });

                    expect(c6Ajax.get).toHaveBeenCalledWith('http://cinema6.com/api/content/expgroup/e1');
                });
            });

            describe('_services.content.findQuery(type, query)', function() {
                var result,
                    success, failure;

                beforeEach(function() {
                    success = jasmine.createSpy('findQuery() success');
                    failure = jasmine.createSpy('findQuery() failure');

                    result = {
                        data: [
                            {
                                id: 'e3',
                                type: 'foo'
                            }
                        ],
                        status: 200
                    };

                    c6Ajax.get.and.returnValue(q.when(result));
                });

                it('should fetch items that match a query', function(done) {
                    var query = { type: 'minireel' };

                    adapter._services.content.findQuery('experience', query)
                        .then(success, failure)
                        .finally(function() {
                            expect(success).toHaveBeenCalledWith(result.data);
                            done();
                        });

                    expect(c6Ajax.get).toHaveBeenCalledWith('http://cinema6.com/api/content/experiences', {
                        params: query
                    });
                });
            });
        });

        describe('@public', function() {
            describe('findAll(type)', function() {
                var success, failure;

                beforeEach(function() {
                    success = jasmine.createSpy('findAll() success');
                    failure = jasmine.createSpy('findAll() failure');
                });

                describe('if the type is "experience"', function() {
                    var returnValue;

                    beforeEach(function() {
                        returnValue = q.when([{}]);

                        spyOn(adapter._services.content, 'findAll')
                            .and.returnValue(returnValue);
                    });

                    it('should findAll from the content adapter', function() {
                        expect(adapter.findAll('experience')).toBe(returnValue);
                        expect(adapter._services.content.findAll).toHaveBeenCalledWith('experience');
                    });
                });

                describe('if the type is unkown', function() {
                    it('should return a rejected promise', function(done) {
                        adapter.findAll('foo')
                            .then(success, failure)
                            .finally(function() {
                                expect(failure).toHaveBeenCalledWith('Don\'t know how to handle type: foo.');
                                done();
                            });
                    });
                });
            });

            describe('find(type, id)', function() {
                var success, failure;

                beforeEach(function() {
                    success = jasmine.createSpy('findAll() success');
                    failure = jasmine.createSpy('findAll() failure');
                });

                describe('if the type is "experience"', function() {
                    var returnValue;

                    beforeEach(function() {
                        returnValue = q.when([{
                            id: 'e1'
                        }]);

                        spyOn(adapter._services.content, 'find')
                            .and.returnValue(returnValue);
                    });

                    it('should find from the content adapter', function() {
                        expect(adapter.find('experience', 'e1')).toBe(returnValue);
                        expect(adapter._services.content.find).toHaveBeenCalledWith('experience', 'e1');
                    });
                });

                describe('if the type is unkown', function() {
                    it('should return a rejected promise', function(done) {
                        adapter.find('foo', 'e1')
                            .then(success, failure)
                            .finally(function() {
                                expect(failure).toHaveBeenCalledWith('Don\'t know how to handle type: foo.');
                                done();
                            });
                    });
                });
            });

            describe('findQuery(type, query)', function() {
                var success, failure,
                    query;

                beforeEach(function() {
                    success = jasmine.createSpy('findAll() success');
                    failure = jasmine.createSpy('findAll() failure');

                    query = { type: 'screenjack' };
                });

                describe('if the type is "experience"', function() {
                    var returnValue;

                    beforeEach(function() {
                        returnValue = q.when([{
                            id: 'e1',
                            type: 'screenjack'
                        }]);

                        spyOn(adapter._services.content, 'findQuery')
                            .and.returnValue(returnValue);
                    });

                    it('should find from the content adapter', function() {
                        expect(adapter.findQuery('experience', query)).toBe(returnValue);
                        expect(adapter._services.content.findQuery).toHaveBeenCalledWith('experience', query);
                    });
                });

                describe('if the type is unkown', function() {
                    it('should return a rejected promise', function(done) {
                        adapter.findQuery('foo', query)
                            .then(success, failure)
                            .finally(function() {
                                expect(failure).toHaveBeenCalledWith('Don\'t know how to handle type: foo.');
                                done();
                            });
                    });
                });
            });
        });
    });
}());
