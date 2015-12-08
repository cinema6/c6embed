(function() {
    'use strict';

    var realAddEventListener = window.addEventListener;
    var calls;

    beforeEach(function() {
        calls = [];

        window.addEventListener = function addEventListener() {
            calls.push(Array.prototype.slice.call(arguments));
            return realAddEventListener.apply(this, arguments);
        };
    });

    afterEach(function() {
        calls.forEach(function(args) {
            window.removeEventListener.apply(window, args);
        });
    });
}());
