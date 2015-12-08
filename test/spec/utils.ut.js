describe('utils.js', function() {
    'use strict';

    var Player;

    var utils;

    beforeAll(function() {
        Player = require('../../lib/Player');

        utils = require('../../src/utils/utils');
    });

    describe('properties:', function() {
        describe('Player', function() {
            it('should be the Player lib', function() {
                expect(utils.Player).toBe(Player);
            });
        });
    });
});
