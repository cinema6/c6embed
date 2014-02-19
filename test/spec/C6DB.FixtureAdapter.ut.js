(function() {
    'use strict';

    describe('cinema6Provider.fixtures.adapter', function() {
        var FixtureAdapter,
            q,
            adapter;

        var c6Ajax,
            fixtures;

        beforeEach(function() {
            fixtures = {
                experience: [
                    {
                        id: 'e-2ff054584731c6',
                        type: 'minireel',
                        user: 'u-38b61e71b25d1e'
                    },
                    {
                        id: 'e-04464ceeded4fc',
                        type: 'minireel',
                        user: 'u-38b61e71b25d1e'
                    },
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
                ],
                user: [
                    {
                        id: 'u-bc03d43a69c86d',
                        name: 'Josh'
                    },
                    {
                        id: 'u-53de94d3424f14',
                        name: 'Evan'
                    }
                ]
            };

            FixtureAdapter = require('../../lib/c6db/adapters/Fixture');
            q = require('../../node_modules/q/q.js');

            c6Ajax = jasmine.createSpy('c6Ajax()')
                .and.callFake(function(config) {
                    var method = config.method,
                        url = config.url;

                    function reject() {
                        return q.reject({
                            status: 404,
                            data: 'Not found.'
                        });
                    }

                    switch (method) {
                    case 'GET':
                        switch (url) {
                            case 'assets/mock/fixtures.json':
                                return q.when({
                                    status: 200,
                                    data: fixtures,
                                    headers: function() { return {}; }
                                });
                            default:
                                return reject();
                        }
                        break;
                    default:
                        return reject();
                    }
                });

            c6Ajax.get = function(url, config) {
                config = config || {};

                config.url = url;
                config.method = 'GET';

                return c6Ajax(config);
            };

            adapter = new FixtureAdapter({ c6Ajax: c6Ajax, q: q });
        });

        it('should exist', function() {
            expect(adapter).toEqual(jasmine.any(Object));
        });

        describe('private', function() {
            describe('_getJSON(src)', function() {
                var spy;

                beforeEach(function(done) {
                    spy = jasmine.createSpy('_getJSON success');

                    adapter._getJSON('assets/mock/fixtures.json').then(spy);
                    setTimeout(done, 1);
                });

                it('should cache the response', function(done) {
                    expect(adapter._cache['assets/mock/fixtures.json']).toEqual([200, fixtures, {}]);

                    adapter._getJSON('assets/mock/fixtures.json').then(spy);
                    setTimeout(function() {
                        expect(spy.calls.count()).toBe(2);
                        expect(spy.calls.mostRecent().args[0]).toEqual(fixtures);
                        expect(c6Ajax.calls.count()).toBe(1);
                        done();
                    }, 1);
                });

                it('should resolve to the json', function() {
                    expect(spy).toHaveBeenCalledWith(fixtures);
                });
            });
        });

        describe('public', function() {
            beforeEach(function() {
                adapter.jsonSrc = 'assets/mock/fixtures.json';

                spyOn(adapter, '_getJSON').and.returnValue(q.when(fixtures));
            });

            describe('findAll(type)', function() {
                var spy;

                beforeEach(function() {
                    spy = jasmine.createSpy('findAll success');
                });

                it('should return an array of all objects of a given type', function(done) {
                    adapter.findAll('experience').then(spy);
                    setTimeout(function() {
                        expect(spy).toHaveBeenCalledWith(fixtures.experience);
                    }, 1);

                    adapter.findAll('user').then(spy);
                    setTimeout(function() {
                        expect(spy).toHaveBeenCalledWith(fixtures.user);
                    }, 2);

                    expect(adapter._getJSON).toHaveBeenCalledWith(adapter.jsonSrc);

                    setTimeout(done, 3);
                });
            });

            describe('find(type, id)', function() {
                var spy;

                beforeEach(function() {
                    spy = jasmine.createSpy('findAll success');
                });

                it('should return an array with the single found object in it', function(done) {
                    adapter.find('experience', 'e-2ff054584731c6').then(spy);
                    setTimeout(function() {
                        expect(spy).toHaveBeenCalledWith([fixtures.experience[0]]);
                    }, 1);

                    adapter.find('experience', 'e-b1384eed3c9dcc').then(spy);
                    setTimeout(function() {
                        expect(spy).toHaveBeenCalledWith([fixtures.experience[2]]);
                    }, 2);

                    adapter.find('user', 'u-53de94d3424f14').then(spy);
                    setTimeout(function() {
                        expect(spy).toHaveBeenCalledWith([fixtures.user[1]]);
                    }, 3);

                    expect(adapter._getJSON).toHaveBeenCalledWith(adapter.jsonSrc);

                    setTimeout(done, 4);
                });
            });

            describe('findQuery(type, query)', function() {
                var spy;

                beforeEach(function() {
                    spy = jasmine.createSpy('findQuery success');
                });

                it('should return all items that match the selected query', function(done) {
                    var experiences = fixtures.experience,
                        users = fixtures.user;

                    adapter.findQuery('experience', { type: 'minireel' }).then(spy);
                    setTimeout(function() {
                        expect(spy).toHaveBeenCalledWith([experiences[0], experiences[1], experiences[3]]);
                    }, 1);

                    adapter.findQuery('experience', { type: 'minireel', user: 'u-38b61e71b25d1e' }).then(spy);
                    setTimeout(function() {
                        expect(spy).toHaveBeenCalledWith([experiences[0], experiences[1]]);
                    }, 2);

                    adapter.findQuery('experience', { type: 'minireel', id: ['e-2ff054584731c6', 'e-b1384eed3c9dcc'] }).then(spy);
                    setTimeout(function() {
                        expect(spy).toHaveBeenCalledWith([experiences[0]]);
                    }, 3);

                    adapter.findQuery('user', { name: 'Josh' }).then(spy);
                    setTimeout(function() {
                        expect(spy).toHaveBeenCalledWith([users[0]]);
                    }, 4);

                    expect(adapter._getJSON).toHaveBeenCalledWith(adapter.jsonSrc);

                    setTimeout(done, 5);
                });
            });
        });
    });
}());
