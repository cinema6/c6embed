(function() {
    'use strict';

    describe('C6DB integration', function() {
        describe('using the fixture adapter', function() {
            var C6DB,
                FixtureAdapter,
                q,
                c6Db,
                adapter;

            var c6Ajax;

            var fixtures,
                resultSpy;

            beforeEach(function() {
                resultSpy = jasmine.createSpy('resultSpy');

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

                C6DB = require('../../lib/c6db/C6DB');
                FixtureAdapter = require('../../lib/c6db/adapters/Fixture');
                q = require('../../node_modules/q/q.js');

                c6Ajax = jasmine.createSpy('c6Ajax()')
                    .and.callFake(function(config) {
                        if (config.url === 'assets/mock/fixtures.json' &&
                            config.method === 'GET') {

                            return q.when({ status: 200, data: fixtures, headers: function() { return {}; } });
                        }

                        return q.reject({ status: 404, data: 'FAIL!', headers: function() { return {}; } });
                    });
                c6Ajax.get = function(url, config) {
                    config = config || {};

                    config.url = url;
                    config.method = 'GET';

                    return c6Ajax(config);
                };

                c6Db = new C6DB({ q: q });
                adapter = new FixtureAdapter({ q: q, c6Ajax: c6Ajax });

                adapter.jsonSrc = 'assets/mock/fixtures.json';
                c6Db.adapter = adapter;
            });

            it('should support finding all records', function(done) {
                c6Db.findAll('experience').then(resultSpy);

                setTimeout(function() {
                    expect(resultSpy).toHaveBeenCalledWith(fixtures.experience);
                }, 5);

                c6Db.findAll('user').then(resultSpy);

                setTimeout(function() {
                    expect(resultSpy).toHaveBeenCalledWith(fixtures.user);
                    done();
                }, 10);
            });

            it('should support finding a single record by id', function(done) {
                c6Db.find('user', 'u-bc03d43a69c86d').then(resultSpy);

                setTimeout(function() {
                    expect(resultSpy).toHaveBeenCalledWith(fixtures.user[0]);
                }, 5);

                c6Db.find('experience', 'e-f8515db773f478').then(resultSpy);

                setTimeout(function() {
                    expect(resultSpy).toHaveBeenCalledWith(fixtures.experience[3]);
                    done();
                }, 10);
            });

            it('should support finding records with queries', function(done) {
                var experiences = fixtures.experience;

                c6Db.findAll('experience', { type: 'minireel' }).then(resultSpy);

                setTimeout(function() {
                    expect(resultSpy).toHaveBeenCalledWith([experiences[0], experiences[1], experiences[3]]);
                }, 5);

                c6Db.findAll('experience', { type: 'screenjack', user: 'u-38b61e71b25d1e' }).then(resultSpy);

                setTimeout(function() {
                    expect(resultSpy).toHaveBeenCalledWith([experiences[2]]);
                    done();
                }, 10);
            });
        });
    });
}());
