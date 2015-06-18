module.exports = function(deps) {
    'use strict';

    var c6Ajax = deps.c6Ajax;
    var q = deps.q;
    var $window = deps.window;
    var _private = { config: {} };

    
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
        params.cors = 'yes';
        
        // can't make cross-origin requests with cookies using XDR, so need this param instead
        if (!!$window.XDomainRequest) {
            params.cfp = 1;
        }
        
        var paramString = Object.keys(params).map(function(key) {
            return key + '=' + params[key];
        }).join(';');
        
        return $window.location.protocol + '//' + parts.join('/') + '/' + paramString;
    };
    
    //TODO: comment, test
    _private.parseBanner = function(str) {
        var regex = /^window\.c6\.addSponsoredCard\('\s*(\d+)'\s*,\s*'(\d+)'\s*,\s*'([\w-]+)'\s*,\s*'([^']+)'\s*,\s*'([^']+)'/,
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
        
        return c6Ajax.get(url, { withCredentials: true }).then(function(response) {
            return _private.parseBanner(response.data);
        })
        .catch(function(error) {
            if (error.data) {
                return q.reject('request failed - code = ' + error.status + ', body = ' + error.data);
            } else {
                return q.reject('request failed - ' + error);
            }
        });
    };
    
    //TODO: comment, test
    /*jslint camelcase: false */
    this.multiAd = function(num, placement, sizes, keywords) {
        var plcids = Array.apply(null, new Array(num)).map(function() { return placement; }).join(','); // CSV string repeating placement num times

        keywords = keywords || {};

        var url = _private.buildUrl('multiad', 0, {
            mode            : 'json',
            plcids          : plcids,
            Allowedsizes    : sizes,
            kwlp1           : keywords.kwlp1,
            kwlp3           : keywords.kwlp3
        });
        
        return c6Ajax.get(url, { withCredentials: true }).then(
            function parseMultiAdResponse(response) {
                try {
                    return response.data.ADTECH_MultiAd.map(function(bannerJson) {
                        return _private.parseBanner(bannerJson.Ad.AdCode);
                    });
                } catch(e) {
                    return q.reject('Invalid response for multiAd request: ' + JSON.stringify(response));
                }
            }, function(error) {
                if (error.data) {
                    return q.reject('request failed - code = ' + error.status + ', body = ' + error.data);
                } else {
                    return q.reject('request failed - ' + error);
                }
            }
        );
    };
    /*jslint camelcase: true */

    if (window.__karma__) { this._private = _private; }
};
