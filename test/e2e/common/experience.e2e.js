(function() {
    'use strict';

    describe('the experience page', function() {
        var ptor = protractor.getInstance(),
            ExperiencePage = require('./pages/ExperiencePage.js')(ptor),
            experiencePage;

        beforeEach(function() {
            experiencePage = new ExperiencePage();

            experiencePage.get();
        });

        it('should display the seatbelt text', function() {
            expect(experiencePage.seatbelt.getText()).toBe('Buckle Your Seatbelt!');
        });
    });
}());
