(function() {
    'use strict';

    describe('the landing page', function() {
        var ptor = protractor.getInstance(),
            LandingPage = require('./pages/LandingPage.js')(ptor),
            landingPage;

        beforeEach(function() {
            landingPage = new LandingPage();

            landingPage.get();
        });

        describe('the hero box', function() {
            it('should be displayed', function() {
                expect(landingPage.hero.isDisplayed()).toBe(true);
            });
        });

        describe('the play button', function() {
            it('should take you to the experience', function() {
                landingPage.playBtn.click().then(function() {
                    expect($('#seatbelt').isDisplayed()).toBe(true);
                });
            });
        });
    });
})();
