(function() {
    'use strict';

    protractor.getInstance().ignoreSynchronization = true;

    browser.driver.manage().timeouts().implicitlyWait(30000);
}());
