(function() {
    'use strict';

    describe('C6DB', function() {
        var C6DB,
            q,
            c6Db,
            _private,
            adapter;

        function Adapter() {
            this._deferreds = {
                find: q.defer(),
                findAll: q.defer(),
                findQuery: q.defer()
            };

            this.find = jasmine.createSpy('adapter.find()')
                .and.returnValue(this._deferreds.find.promise);

            this.findAll = jasmine.createSpy('adapter.findAll()')
                .and.returnValue(this._deferreds.findAll.promise);

            this.findQuery = jasmine.createSpy('adapter.findQuery()')
                .and.returnValue(this._deferreds.findQuery.promise);
        }

        beforeEach(function() {
            C6DB = require('../../lib/c6db/C6DB');
            q = require('../../node_modules/q/q.js');

            adapter = new Adapter();
            c6Db = new C6DB({ q: q });
            _private = c6Db._private;
            c6Db.adapter = adapter;
        });

        describe('@public', function() {
            describe('methods', function() {
                describe('find(type, id)', function() {
                    var result,
                        findSpy;

                    beforeEach(function(done) {
                        result = [
                            {
                                id: 'e-2ff054584731c6',
                                type: 'minireel',
                                user: 'u-38b61e71b25d1e'
                            }
                        ];

                        findSpy = jasmine.createSpy('find spy');

                        c6Db.find('experience', 'e-2ff054584731c6').then(findSpy);
                        setTimeout(done, 1);
                    });

                    it('should call the adapter\'s find method', function() {
                        expect(adapter.find).toHaveBeenCalledWith('experience', 'e-2ff054584731c6');
                    });

                    it('should resolve with the singular result of the adapter', function(done) {
                        expect(findSpy).not.toHaveBeenCalled();

                        adapter._deferreds.find.resolve(result);
                        setTimeout(function() {
                            expect(findSpy).toHaveBeenCalledWith(result[0]);
                            done();
                        }, 1);
                    });

                    it('should cache the item by type and id', function(done) {
                        adapter._deferreds.find.resolve(result);

                        setTimeout(function() {
                            expect(_private.cache['experience:e-2ff054584731c6']).toBe(result[0]);
                            done();
                        }, 1);
                    });

                    it('should consult the cache before call the adapter', function(done) {
                        var exp = {
                            id: 'abc123'
                        };

                        adapter.find.calls.reset();
                        _private.cache['experience:abc123'] = exp;

                        c6Db.find('experience', 'abc123').then(findSpy);

                        setTimeout(function() {
                            expect(adapter.find).not.toHaveBeenCalled();
                            expect(findSpy).toHaveBeenCalledWith(exp);
                            done();
                        }, 1);
                    });
                });

                describe('findAll(type, matcher)', function() {
                    var findSpy;

                    beforeEach(function() {
                        findSpy = jasmine.createSpy('find spy');
                    });

                    describe('if no matcher is provided', function() {
                        var results;

                        beforeEach(function(done) {
                            results = [
                                {
                                    id: 'e-2ff054584731c6',
                                    type: 'minireel',
                                    user: 'u-38b61e71b25d1e'
                                },
                                {
                                    id: 'e-04464ceeded4fc',
                                    type: 'minireel',
                                    user: 'u-38b61e71b25d1e'
                                }
                            ];

                            c6Db.findAll('experience').then(findSpy);
                            setTimeout(done, 1);
                        });

                        it('should call the adapter\'s findAll method', function() {
                            expect(adapter.findAll).toHaveBeenCalledWith('experience');
                        });

                        it('should resolve with the result of the adapter', function(done) {
                            expect(findSpy).not.toHaveBeenCalled();

                            adapter._deferreds.findAll.resolve(results);
                            setTimeout(function() {
                                expect(findSpy).toHaveBeenCalledWith(results);
                                done();
                            }, 1);
                        });

                        it('should cache all the items by type and id', function(done) {
                            var cache = _private.cache;

                            adapter._deferreds.findAll.resolve(results);

                            setTimeout(function() {
                                expect(cache['experience:e-2ff054584731c6']).toBe(results[0]);
                                expect(cache['experience:e-04464ceeded4fc']).toBe(results[1]);
                                done();
                            }, 1);
                        });
                    });

                    describe('if a query is provided as a matcher', function() {
                        var query,
                            results;

                        beforeEach(function(done) {
                            query = { id: ['e-b1384eed3c9dcc', 'e-f8515db773f478', 'e-04b624ab9a7227'] };

                            results = [
                                {
                                    id: 'e-b1384eed3c9dcc',
                                    type: 'screenjack',
                                    user: 'u-38b61e71b25d1e'
                                },
                                {
                                    id: 'e-f8515db773f478',
                                    type: 'minireel',
                                    user: 'u-567d9671aaacb8'
                                },
                                {
                                    id: 'e-04b624ab9a7227',
                                    type: 'screenjack',
                                    user: 'u-567d9671aaacb8'
                                }
                            ];

                            c6Db.findAll('experience', query).then(findSpy);
                            setTimeout(done, 1);
                        });

                        it('should call the adapter\'s findQuery method', function() {
                            expect(adapter.findQuery).toHaveBeenCalledWith('experience', query);
                        });

                        it('should resolve with the result of the adapter', function(done) {
                            expect(findSpy).not.toHaveBeenCalled();

                            adapter._deferreds.findQuery.resolve(results);
                            setTimeout(function() {
                                expect(findSpy).toHaveBeenCalledWith(results);
                                done();
                            }, 1);
                        });

                        it('should cache all the items by type and id', function(done) {
                            var cache = _private.cache;

                            adapter._deferreds.findQuery.resolve(results);

                            setTimeout(function() {
                                expect(cache['experience:e-b1384eed3c9dcc']).toBe(results[0]);
                                expect(cache['experience:e-f8515db773f478']).toBe(results[1]);
                                expect(cache['experience:e-04b624ab9a7227']).toBe(results[2]);
                                done();
                            }, 1);
                        });
                    });
                });
            });
        });
    });
}());
