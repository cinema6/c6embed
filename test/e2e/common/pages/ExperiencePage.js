module.exports = function(ptor) {
    'use strict';

    var LandingPage = require('./LandingPage.js')(ptor);

    function ExperiencePage() {
        var self = this;

        this.seatbelt = null;

        this.get = function() {
            var landingPage = new LandingPage();

            landingPage.get();
            landingPage.playBtn.click().then(function() {
                self.seatbelt = $('#seatbelt');
            });
        };
    }

    return ExperiencePage;
};
