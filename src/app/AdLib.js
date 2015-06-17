module.exports = function(deps) {
    'use strict';

    var c6Ajax = deps.c6Ajax;
    var q = deps.q;
    var _private = { config: {} };

/*
Urls to handle:
https://adserver.adtechus.com/addyn/3.0/5491.1/3507986/0/-1/ADTECH;target=_blank;adid=6434882;bnid=1;sub1=e-1dba568083f443;grp=336;screenheight=1200;screenwidth=1920;screendensity=1;kvscreenheight=1200;kvscreenwidth=1920;kvscreendensity=1;misc=1434483567036

https://adserver.adtechus.com/multiad/3.0/5491.1/0/0/-1/mode=json;plcids=3507986;target=_blank;Allowedsizes=2x2;kwlp1=cam-db1e05c5d5f257;kwlp3=comedy+music+people_blogs;sub1=e-1dba568083f443;grp=336;screenheight=1200;screenwidth=1920;screendensity=1;kvscreenheight=1200;kvscreenwidth=1920;kvscreendensity=1;misc=1434483567853
*/
    
    //TODO: comment, test. Maybe simplify this?
    _private.buildUrl = function(tagType, placement, params) {
        var parts = [
                _private.config.server,
                tagType,
                '3.0',
                _private.config.network,
                placement, // Note: this should actually be 0 for multiad requests
                '0',
                '-1'
            ];
            
        params = params || {};
        params.target = params.target || '_blank';
        params.misc = params.misc || new Date().valueOf();
        params.cfp = 1;
        
        var paramString = Object.keys(params).map(function(key) {
            return key + '=' + params[key];
        }).join(';');
        
        return '//' + parts.join('/') + '/' + paramString;
    };
    
    //TODO: comment, test
    _private.parseBanner = function(str) {
        var regex = /^window.c6.addSponsoredCard\('(\d+)','(\d+)','([\w-]+)','([^']+)','([^']+)'/,
            matchObj = (str || '').match(regex);
        
        if (!matchObj) {
            return null;
        }
        
        return {
            placementId : matchObj[1],
            campaignId  : matchObj[2],
            extId       : matchObj[3],
            clickUrl    : matchObj[4],
            countUrl    : matchObj[5]
        };
    };
    
    //TODO: comment, test
    this.configure = function(cfg) {
        cfg = cfg || {};
        _private.config.network = cfg.network;
        _private.config.server = cfg.server;
    };
    
    //TODO: comment, test
    this.loadAd = function(placement, campaignId, bannerId) {
        var url = _private.buildUrl('addyn', placement, {
            adid    : campaignId,
            bnid    : bannerId
        });
        
        return c6Ajax.get(url).then(function parseLoadAdResponse(response) {
            return _private.parseBanner(response.data);
        })
        .catch(function(error) {
            if (error.data) {
                return q.reject('request failed - code = ' + error.status + ', ' + error.data);
            } else {
                return q.reject('request failed - ' + error);
            }
        });
    };
    
    //TODO: comment, test
    /*jslint camelcase: false */
    this.multiAd = function(num, placement, sizes, keywords) {
        keywords = keywords || {};

        var url = _private.buildUrl('multiad', 0, {
            mode            : 'json',
            plcids          : Array.apply(null, new Array(num)).map(function() { return placement; }).join(','), // CSV string repeating placement num times
            Allowedsizes    : sizes,
            kwlp1           : keywords.kwlp1, // TODO: try to hide this if undefined?
            kwlp3           : keywords.kwlp3
        });
        
        return c6Ajax.get(url).then(
            function parseMultiAdResponse(response) {
                try {
                    var data = JSON.parse(response.data);
                    
                    return data.ADTECH_MultiAd.map(function(bannerJson) {
                        return _private.parseBanner(bannerJson.Ad.AdCode);
                    });
                } catch(e) {
                    return q.reject('Invalid response for multiAd request: ' + JSON.stringify(response));
                }
            }, function(error) {
                if (error.data) {
                    return q.reject('request failed - code = ' + error.status + ', ' + error.data);
                } else {
                    return q.reject('request failed - ' + error);
                }
            }
        );
    };
    /*jslint camelcase: true */

    if (window.__karma__) { this._private = _private; }
};
