(function() {
    'use strict';

    ddescribe('widget.js', function() {
        var $, $div, c6;
        beforeEach(function(done) {
            window.mockReadyState = 'loading';
            window.__C6_URL_ROOT__ = 'base/test/helpers';
            window.__C6_APP_JS__ = 'http://staging.cinema6.com/foo.js';

            var C6Query = require('../../lib/C6Query');
            $ = new C6Query({ window: window, document: document });
            $div = $('<div id="test"></div>');
            $('body').append($div);
            
            var script;
            script = document.createElement('script');
            script.src = '/base/src/widget.js';
            script.onload = function() {
                c6 = window.c6;
                done();
            };
            $div.append(script);

            spyOn(document,'write');
        });

        afterEach(function() {
            $div.remove();
            delete window.c6;
            delete window.__C6_URL_ROOT__;
        });


        describe('c6 initialization', function() {
            it('should create a c6 object', function() {
                expect(c6).toBeDefined();
                expect(c6.app).toBeNull();
                expect(c6.embeds).toEqual([]);
                expect(c6.branding).toEqual({});
                expect(c6.requireCache).toEqual({});
                expect(c6.contentCache).toEqual({});
                expect(c6.gaAcctIdPlayer).toEqual('UA-44457821-2');
                expect(c6.gaAcctIdEmbed).toEqual('UA-44457821-3');
            });
        });

        describe('c6.addReel',function(){
            it('inits storage for a placementId',function(){
                expect(c6.contentCache.abc123).not.toBeDefined();
                c6.addReel('e-123','abc123','http://ex.co');
                expect(c6.contentCache.abc123).toBeDefined();
                expect(c6.contentCache.abc123[0].expId).toEqual('e-123');
                expect(c6.contentCache.abc123[0].clickUrl).toEqual('http://ex.co');
            });

            it('stores multiple reels for multiple placements',function(){
                c6.addReel('e-123','abc111','http://ex.co/123');
                c6.addReel('e-456','abc111','http://ex.co/456');
                c6.addReel('e-123','def999','http://ex.co/123');
                c6.addReel('e-456','def999','http://ex.co/456');
                expect(c6.contentCache.abc111).toEqual([
                    { expId: 'e-123', clickUrl: 'http://ex.co/123' },
                    { expId: 'e-456', clickUrl: 'http://ex.co/456' }
                ]);

                expect(c6.contentCache.def999).toEqual([
                    { expId: 'e-123', clickUrl: 'http://ex.co/123' },
                    { expId: 'e-456', clickUrl: 'http://ex.co/456' }
                ]);
            });
        });
    });
}());
