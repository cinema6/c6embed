require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"VCzfuR":[function(require,module,exports){
(function (global){
(function browserifyShim(module, exports, define, browserify_shim__define__module__export__) {
/* Modernizr 2.6.3 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-canvas-localstorage-touch-prefixed-teststyles-testprop-testallprops-prefixes-domprefixes-fullscreen_api-img_webp-load
 */
;window.Modernizr=function(a,b,c){function y(a){i.cssText=a}function z(a,b){return y(l.join(a+";")+(b||""))}function A(a,b){return typeof a===b}function B(a,b){return!!~(""+a).indexOf(b)}function C(a,b){for(var d in a){var e=a[d];if(!B(e,"-")&&i[e]!==c)return b=="pfx"?e:!0}return!1}function D(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:A(f,"function")?f.bind(d||b):f}return!1}function E(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+n.join(d+" ")+d).split(" ");return A(b,"string")||A(b,"undefined")?C(e,b):(e=(a+" "+o.join(d+" ")+d).split(" "),D(e,b,c))}var d="2.6.3",e={},f=b.documentElement,g="modernizr",h=b.createElement(g),i=h.style,j,k={}.toString,l=" -webkit- -moz- -o- -ms- ".split(" "),m="Webkit Moz O ms",n=m.split(" "),o=m.toLowerCase().split(" "),p={},q={},r={},s=[],t=s.slice,u,v=function(a,c,d,e){var h,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:g+(d+1),l.appendChild(j);return h=["&#173;",'<style id="s',g,'">',a,"</style>"].join(""),l.id=g,(m?l:n).innerHTML+=h,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=f.style.overflow,f.style.overflow="hidden",f.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),f.style.overflow=k),!!i},w={}.hasOwnProperty,x;!A(w,"undefined")&&!A(w.call,"undefined")?x=function(a,b){return w.call(a,b)}:x=function(a,b){return b in a&&A(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=t.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(t.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(t.call(arguments)))};return e}),p.canvas=function(){var a=b.createElement("canvas");return!!a.getContext&&!!a.getContext("2d")},p.touch=function(){var c;return"ontouchstart"in a||a.DocumentTouch&&b instanceof DocumentTouch?c=!0:v(["@media (",l.join("touch-enabled),("),g,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(a){c=a.offsetTop===9}),c},p.localstorage=function(){try{return localStorage.setItem(g,g),localStorage.removeItem(g),!0}catch(a){return!1}};for(var F in p)x(p,F)&&(u=F.toLowerCase(),e[u]=p[F](),s.push((e[u]?"":"no-")+u));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)x(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof enableClasses!="undefined"&&enableClasses&&(f.className+=" "+(b?"":"no-")+a),e[a]=b}return e},y(""),h=j=null,e._version=d,e._prefixes=l,e._domPrefixes=o,e._cssomPrefixes=n,e.testProp=function(a){return C([a])},e.testAllProps=E,e.testStyles=v,e.prefixed=function(a,b,c){return b?E(a,b,c):E(a,"pfx")},e}(this,this.document),function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))},function(){var a=new Image;a.onerror=function(){Modernizr.addTest("webp",!1)},a.onload=function(){Modernizr.addTest("webp",function(){return a.width==1})},a.src="data:image/webp;base64,UklGRiwAAABXRUJQVlA4ICAAAAAUAgCdASoBAAEAL/3+/3+CAB/AAAFzrNsAAP5QAAAAAA=="}(),Modernizr.addTest("fullscreen",function(){for(var a=0;a<Modernizr._domPrefixes.length;a++)if(document[Modernizr._domPrefixes[a].toLowerCase()+"CancelFullScreen"])return!0;return!!document.cancelFullScreen||!1});
; browserify_shim__define__module__export__(typeof Modernizr != "undefined" ? Modernizr : window.Modernizr);

}).call(global, undefined, undefined, undefined, function defineExport(ex) { module.exports = ex; });

}).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],"Modernizr":[function(require,module,exports){
module.exports=require('VCzfuR');
},{}],3:[function(require,module,exports){
module.exports = function(deps) {
    'use strict';

    var modernizr = deps.modernizr,
        $window = deps.window,
        userAgent = deps.userAgent;

    this.generateProfile = function() {
        var profile = {},
            screen = $window.screen;

        profile.inlineVideo = !(userAgent.device.isIPhone() || userAgent.device.isIPod() || userAgent.app.name === 'silk');

        profile.multiPlayer = !(userAgent.device.isIOS() || userAgent.app.name === 'silk');

        profile.canvasVideo = (function() {
            var macOSXVersion = (function() {
                    var version = (userAgent.os.name === 'mac' &&
                                    (userAgent.os.version) &&
                                    (userAgent.os.version.match(/(\d+\.\d+)/)));
                    return (version || null) && version[0] && version[0].split('.');
                })(),
                badVersion = true;

            if (macOSXVersion){
                macOSXVersion[0] = parseInt(macOSXVersion[0],10);
                macOSXVersion[1] = parseInt(macOSXVersion[1],10);
                if (macOSXVersion[0] < 10) {
                    badVersion = false;
                } else
                if ((macOSXVersion[0] === 10) && (macOSXVersion[1] < 7)){
                    badVersion = false;
                }
            }

            return !(userAgent.device.isIOS() ||
                    userAgent.app.name === 'silk' ||
                    userAgent.app.name === 'safari' && badVersion);
        })();

        profile.touch = modernizr && modernizr.touch;

        profile.canvas = modernizr && modernizr.canvas;

        profile.localstorage = modernizr && modernizr.localstorage;

        profile.raf = (function() {
            var majorIOSVersion;

            if (userAgent.device.isIOS()) {
                majorIOSVersion = userAgent.os.version.split('.')[0];

                if (majorIOSVersion < 7) {
                    return false;
                }
            }

            return modernizr && !!modernizr.prefixed('requestAnimationFrame', $window);
        })();

        profile.resolution = (screen.width + 'x' + screen.height);

        profile.flash = (function() {
            try {
                var flashObject = new $window.ActiveXObject('ShockwaveFlash.ShockwaveFlash');

                return !!flashObject;
            } catch(e) {
                return !!$window.navigator.mimeTypes['application/x-shockwave-flash'];
            }
        })();

        profile.webp = modernizr.webp;

        profile.device = (function() {
            var touch = profile.touch,
                pixels = screen.width * screen.height;

            if (pixels <= 518400) {
                return 'phone';
            } else if (pixels <= 786432) {
                if (touch) {
                    return 'tablet';
                } else {
                    return 'netbook';
                }
            } else {
                return 'desktop';
            }
        }());

        profile.cors = modernizr.cors;

        profile.autoplay = !userAgent.device.isMobile();

        return profile;
    };

    this.profile = this.generateProfile();
};

},{}],4:[function(require,module,exports){
module.exports = function(deps) {
    'use strict';

    var postmessage = deps.postmessage,
        q = deps.q,
        browserInfo = deps.browserInfo;

    var _private = {};

    _private.sessions = {};
    _private.decorateSession = function(session, experience) {
        session.experience = experience;
        session.ready = false;
    };

    /* @public */

    this.getSession = function(expId) {
        return (_private.sessions[expId] = _private.sessions[expId] || q.defer()).promise;
    };

    /* @private */

    this.registerExperience = function(experience, expWindow) {
        var session = postmessage.createSession(expWindow),
            expId = experience.id;

        _private.decorateSession(session, experience);

        session.once('handshake', function(data, respond) {
            respond({
                success: true,
                appData: {
                    experience: experience,
                    profile: browserInfo.profile
                }
            });
        });

        session.once('ready', function() {
            session.ready = true;
            (_private.sessions[expId] = _private.sessions[expId] || q.defer()).resolve(session);
        });

        return session;
    };

    this.deregisterExperience = function(expId) {
        var session = _private.sessions[expId];

        postmessage.destroySession(session.id);

        delete _private.sessions[expId];
    };

    if (window.__karma__) { this._private = _private; }
};

},{}],5:[function(require,module,exports){
module.exports = function(deps) {
    'use strict';

    var asEvented = deps.asEvented,
        q = deps.q,
        $window = deps.window;

    var sessionCount = 0,
        sessions = {},
        _private = {};

    _private.ping = function(win, event, type, data) {
        var message = { __c6__: { event: event, type: type, data: data } };

        win.postMessage(JSON.stringify(message), '*');
    };

    _private.newRequestId = function(session) {
        var id = 0;

        while (session._pending[id]) {
            id++;
        }

        return id;
    };

    _private.getSessionByWindow = function(win) {
        var id,
            session;

        for (id in sessions) {
            session = sessions[id];

            if (session.window === win) {
                return session;
            }
        }
    };

    _private.handleMessage = function(event) {
        var eventData = event.data,
            c6,
            eventName,
            type,
            typeName,
            typeId,
            data,
            session,
            done;

        try {
            c6 = JSON.parse(eventData).__c6__;
        } catch (err) {
            c6 = undefined;
        }

        if (!c6) { return; }

        eventName = c6.event;
        type = c6.type.split(':');
        typeName = type[0];
        typeId = type[1];
        data = c6.data;
        session = _private.getSessionByWindow(event.source);

        if (typeName === 'request') {
            done = function(response) {
                _private.ping(event.source, eventName, ('response:' + typeId), response);
            };

            session.trigger(eventName, data, done);
        } else if (typeName === 'response') {
            session._pending[typeId].resolve(data);
        } else if (typeName === 'ping') {
            session.trigger(eventName, data, function() {});
        }
    };

    this.createSession = function(win) {
        var session = {
            id: sessionCount++,
            window: win,
            _pending: {},

            ping: function(event, data) {
                _private.ping(this.window, event, 'ping', data);
            },

            request: function(event, data) {
                var deferred = q.defer(),
                    id = _private.newRequestId(this);

                this._pending[id] = deferred;

                _private.ping(this.window, event, ('request:' + id), data);

                return deferred.promise;
            }
        };

        asEvented.call(session);

        sessions[session.id] = session;

        return session;
    };

    this.destroySession = function(id) {
        var session = sessions[id],
            noop = function() {},
            value;

        for (var key in session) {
            value = session[key];

            if (typeof value === 'function') {
                session[key] = noop;
            } else {
                session[key] = undefined;
            }
        }

        delete sessions[id];
    };

    this.getSession = function(id) {
        return sessions[id];
    };

    $window.addEventListener('message', _private.handleMessage, false);

    if (!!window.__karma__) { this._private = _private; }
};

},{}],6:[function(require,module,exports){
module.exports = function(deps) {
    'use strict';

    var $window = deps.window;

    var ua = $window.navigator.userAgent, match;

    this.app = {
        name    : null,
        version : null
    };

    this.os  = {
        name    : null,
        version : null
    };

    this.device = {
        name        : null,
        version     : null,
        isIPad      : function() { return (this.name === 'ipad'); },
        isIPod      : function() { return (this.name === 'ipod'); },
        isIPhone    : function() { return (this.name === 'iphone'); },
        isIOS       : function() { return (this.isIPhone() || this.isIPad() || this.isIPod()     ); },

        isKindle    : function() { return (this.name === 'kindle'); },
        isAndroid   : function() { return ( this.isKindle() || (this.name === 'android') ); },

        isMobile    : function() { return (this.isIOS() || this.isAndroid()); }
    };

    this.userAgent  = null;

    if (!ua){
        return;
    }
    match= ua.match(
        /(silk|opera|chrome|safari|firefox|msie|phantomjs)\/?\s*(\.?\d+(\.\d+)*)/i);
    if (match !== null){
        this.app.name     = match[1].toLowerCase();
        this.app.version  = match[2];

        if (this.app.name === 'safari'){
            match = ua.match(/Version\/?\s*(\.?\d+(\.\d+)*)/);
            if (match !== null){
                this.app.version  = match[1];
            }
        }
    }

    match = ua.match( /(kfot|android|iphone|ipod|ipad)/i );
    if (match !== null ){
        this.device.name = match[1].toLowerCase();
        if (this.device.name === 'kfot') {
            this.device.name = 'kindle';
        }
    }

    match = ua.match (/(mac os x|windows|linux)/i);
    if (match !== null){
        var os = match[1].toLowerCase();
        if (os === 'mac os x') {
            if (this.device.isIOS()){
                this.os.name         = 'ios';
                match = ua.match(/OS ?\s*(\.?\d+([\.|_]\d+)*) like Mac OS X/);
                if (match !== null){
                    this.os.version  = match[1].replace(/_/g,'.');
                }
            } else {
                this.os.name         = 'mac';
                match = ua.match(/Mac OS X?\s*(\.?\d+([\.|_]\d+)*)/);
                if (match !== null){
                    this.os.version  = match[1].replace(/_/g,'.');
                }
            }
        }
        else
        if (os === 'windows'){
            this.os.name         = 'windows';
            match = ua.match(/Windows NT ([\.\d]+)/);
            if (match !== null){
                this.os.version  = match[1];
            }
        }
        else {
            if (this.device.isAndroid()){
                this.os.name = 'android';
                match = ua.match(/Android ?\s*(\.?\d+([\.|_]\d+)*)/);
                if (match !== null){
                    this.os.version  = match[1].replace(/_/g,'.');
                }
            } else {
                this.os.name = 'linux';
            }
        }
    }


    this.userAgent = ua;
};

},{}],7:[function(require,module,exports){
module.exports = function(deps) {
    'use strict';

    var $window = deps.window,
        q = deps.q,
        browserInfo = deps.browserInfo,
        $location = deps.location;

    var needXdr = !browserInfo.profile.cors && !!$window.XDomainRequest,
        xhr = require('./lib/xhr'),
        xdr = needXdr ? require('./lib/xdr') : null;

    function toQueryParams(params) {
        var key,
            pairs = [];

        if (!params) { return ''; }

        for (key in params) {
            pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(params[key]));
        }

        return '?' + pairs.join('&');
    }

    function ajax(config) {
        var url = config.url,
            isCrossOrigin = $location.origin !== $location.originOf(url),
            useXdr = isCrossOrigin && !!xdr;

        return (useXdr ? xdr : xhr)({
            config: config,
            q: q,
            window: $window,
            toQueryParams: toQueryParams
        });
    }

    ajax.get = function(url, config) {
        config = config || {};

        config.url = url;
        config.method = 'GET';

        return this(config);
    };

    ajax.delete = function(url, config) {
        config = config || {};

        config.url = url;
        config.method = 'DELETE';

        return this(config);
    };

    ajax.post = function(url, data, config) {
        config = config || {};

        config.url = url;
        config.data = data;
        config.method = 'POST';

        return this(config);
    };

    ajax.put = function(url, data, config) {
        config = config || {};

        config.url = url;
        config.data = data;
        config.method = 'PUT';

        return this(config);
    };

    return ajax;
};

},{"./lib/xdr":8,"./lib/xhr":9}],8:[function(require,module,exports){
module.exports = function(deps) {
    'use strict';

    var config = deps.config,
        q = deps.q,
        $window = deps.window,
        toQueryParams = deps.toQueryParams;

    var xdr = new $window.XDomainRequest(),
        url = config.url + toQueryParams(config.params),
        deferred = q.defer();

    function makeResponse(data) {
        return {
            status: null,
            data: data,
            headers: function() {}
        };
    }

    xdr.onerror = function() {
        deferred.reject(
            makeResponse('The XDomainRequest failed. We\'d tell you more if we could...')
        );
    };
    xdr.ontimeout = function() {
        deferred.reject(
            makeResponse('The XDomainRequest timed out after ' + config.timeout + 'ms.')
        );
    };
    xdr.onload = function() {
        var data;

        try {
            data = JSON.parse(xdr.responseText);
        } catch (e) {
            data = xdr.responseText;
        }

        deferred.resolve(makeResponse(data));
    };

    xdr.timeout = config.timeout || 0;

    xdr.open(config.method, url);
    xdr.send(((typeof config.data === 'object') ?
              JSON.stringify(config.data) : config.data) || '');

    return deferred.promise;
};

},{}],9:[function(require,module,exports){
module.exports = function(deps) {
    'use strict';

    var config = deps.config,
        q = deps.q,
        $window = deps.window,
        toQueryParams = deps.toQueryParams;

    var xhr = new $window.XMLHttpRequest(),
        url,
        deferred = q.defer();

    function setHeaders(headers) {
        var header;

        for (header in headers) {
            xhr.setRequestHeader(header, headers[header]);
        }
    }

    url = config.url + toQueryParams(config.params);

    function handleResponse() {
        var response = {
                status: xhr.status,
                data: xhr.response,
                headers: xhr.getAllResponseHeaders
            },
            status = response.status,
            success = !(status >= 400 && status < 600);

        deferred[success ? 'resolve' : 'reject'](response);
    }

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            handleResponse();
        }
    };

    xhr.timeout = config.timeout || 0;
    xhr.responseType = config.responseType || '';

    xhr.open(config.method, url);
    setHeaders(config.headers);
    xhr.send(config.data);

    return deferred.promise;
};

},{}],10:[function(require,module,exports){
module.exports = function(deps) {
    'use strict';

    var q = deps.q;

    var _private = {},
        cache = _private.cache = {};

    function saveToCache(type, items) {
        items.forEach(function(item) {
            cache[type + ':' + item.id] = item;
        });

        return items;
    }

    this.find = function(type, id) {
        var adapter = this.adapter;

        function fetchFromCache() {
            var item = cache[type + ':' + id];

            if (!item) {
                return q.reject('Cannot find ' + (type + ':' + id) + ' in cache.');
            }

            return q.when([item]);
        }

        function fetchFromAdapter() {
            return adapter.find(type, id);
        }

        function extractSingle(items) {
            return items[0];
        }

        return fetchFromCache()
            .catch(fetchFromAdapter)
            .then(function(data) { return saveToCache(type, data); })
            .then(extractSingle);
    };

    this.findAll = function(type, matcher) {
        return this.adapter[matcher ? 'findQuery' : 'findAll'].apply(this.adapter, arguments)
            .then(function(data) { return saveToCache(type, data); });
    };

    if (window.__karma__) { this._private = _private; }
};

},{}],11:[function(require,module,exports){
module.exports = function(deps) {
    'use strict';

    var c6Ajax = deps.c6Ajax,
        q = deps.q;

    var cache = this._cache = {};

    this._getJSON = function(src) {
        var cached = cache[src],
            promise;

        if (cached) {
            promise = q.when({
                status: cached[0],
                data: cached[1],
                headers: function() { return cached[2]; }
            });
        } else {
            promise = c6Ajax.get(src);
        }

        return promise
            .then(function(response) {
                cache[src] = [response.status, response.data, response.headers()];

                return response.data;
            });
    };

    this.findAll = function(type) {
        return this._getJSON(this.jsonSrc)
            .then(function(fixtures) {
                return fixtures[type];
            });
    };

    this.find = function(type, id) {
        return this._getJSON(this.jsonSrc)
            .then(function(fixtures) {
                return fixtures[type].filter(function(object) {
                    return object.id === id;
                });
            });
    };

    this.findQuery = function(type, query) {
        return this._getJSON(this.jsonSrc)
            .then(function(fixtures) {
                var items = fixtures[type],
                    list = (function() {
                        var id = query.id;

                        if (!id) {
                            return items;
                        }

                        id = (id instanceof Array) ? id : [id];

                        return items.filter(function(item) {
                            return id.indexOf(item.id) > -1;
                        });
                    }());

                delete query.id;

                return list.filter(function(item) {
                    for (var key in query) {
                        if (item[key] !== query[key]) {
                            return false;
                        }
                    }

                    return true;
                });
            });
    };
};

},{}],12:[function(require,module,exports){
/**
 * asEvented v0.4.3 - an event emitter mixin which provides the observer pattern to JavaScript object.
 *
 * Copyright 2012, Michal Kuklis
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 **/
(function (name, global, definition) {
  if (typeof module !== 'undefined') {
    module.exports = definition();
  } else if (typeof require !== 'undefined' && typeof define.amd === 'object') {
    define(definition);
  } else {
    global[name] = definition();
  }
})('asEvented', this, function () {
  return (function () {

    var ArrayProto = Array.prototype;
    var nativeIndexOf = ArrayProto.indexOf;
    var slice = ArrayProto.slice;

    function bind(event, fn) {
      var i, part;
      var events = this.events = this.events || {};
      var parts = event.split(/\s+/);
      var num = parts.length;

      for (i = 0; i < num; i++) {
        events[(part = parts[i])] = events[part] || [];
        events[part].push(fn);
      }
      return this;
    }

    function one(event, fn) {
      // [notice] The value of fn and fn1 is not equivalent in the case of the following MSIE.
      // var fn = function fn1 () { alert(fn === fn1) } ie.<9 false
      var fnc = function () {
        fn.apply(this, slice.call(arguments));
        this.unbind(event, fnc);
      };
      this.bind(event, fnc);
      return this;
    }

    function unbind(event, fn) {
      var eventName, i, index, num, parts;
      var events = this.events;

      if (!events) return;

      parts = event.split(/\s+/);
      for (i = 0, num = parts.length; i < num; i++) {
        if ((eventName = parts[i]) in events !== false) {
          index = (fn) ? _indexOf(events[eventName], fn) : 0;
          if (index !== -1) {
            events[eventName].splice(index, 1);
          }
        }
      }
      return this;
    }

    function trigger(event) {
      var args, i;
      var events = this.events;

      if (!events || event in events === false) return;

      args = slice.call(arguments, 1);
      for (i = events[event].length - 1; i >= 0; i--) {
        events[event][i].apply(this, args);
      }
      return this;
    }

    function _indexOf(array, needle) {
      var i, l;

      if (nativeIndexOf && array.indexOf === nativeIndexOf) {
        return array.indexOf(needle);
      }

      for (i = 0, l = array.length; i < l; i++) {
        if (array[i] === needle) {
          return i;
        }
      }
      return -1;
    }

    return function () {
      this.bind = this.on = bind;
      this.unbind = this.off = this.removeListener = unbind;
      this.trigger = this.emit = trigger;
      this.one = this.once = one;

      return this;
    };
  })();
});

},{}],13:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],14:[function(require,module,exports){
(function (process){
// vim:ts=4:sts=4:sw=4:
/*!
 *
 * Copyright 2009-2012 Kris Kowal under the terms of the MIT
 * license found at http://github.com/kriskowal/q/raw/master/LICENSE
 *
 * With parts by Tyler Close
 * Copyright 2007-2009 Tyler Close under the terms of the MIT X license found
 * at http://www.opensource.org/licenses/mit-license.html
 * Forked at ref_send.js version: 2009-05-11
 *
 * With parts by Mark Miller
 * Copyright (C) 2011 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

(function (definition) {
    // Turn off strict mode for this function so we can assign to global.Q
    /* jshint strict: false */

    // This file will function properly as a <script> tag, or a module
    // using CommonJS and NodeJS or RequireJS module formats.  In
    // Common/Node/RequireJS, the module exports the Q API and when
    // executed as a simple <script>, it creates a Q global instead.

    // Montage Require
    if (typeof bootstrap === "function") {
        bootstrap("promise", definition);

    // CommonJS
    } else if (typeof exports === "object") {
        module.exports = definition();

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
        define(definition);

    // SES (Secure EcmaScript)
    } else if (typeof ses !== "undefined") {
        if (!ses.ok()) {
            return;
        } else {
            ses.makeQ = definition;
        }

    // <script>
    } else {
        Q = definition();
    }

})(function () {
"use strict";

var hasStacks = false;
try {
    throw new Error();
} catch (e) {
    hasStacks = !!e.stack;
}

// All code after this point will be filtered from stack traces reported
// by Q.
var qStartingLine = captureLine();
var qFileName;

// shims

// used for fallback in "allResolved"
var noop = function () {};

// Use the fastest possible means to execute a task in a future turn
// of the event loop.
var nextTick =(function () {
    // linked list of tasks (single, with head node)
    var head = {task: void 0, next: null};
    var tail = head;
    var flushing = false;
    var requestTick = void 0;
    var isNodeJS = false;

    function flush() {
        /* jshint loopfunc: true */

        while (head.next) {
            head = head.next;
            var task = head.task;
            head.task = void 0;
            var domain = head.domain;

            if (domain) {
                head.domain = void 0;
                domain.enter();
            }

            try {
                task();

            } catch (e) {
                if (isNodeJS) {
                    // In node, uncaught exceptions are considered fatal errors.
                    // Re-throw them synchronously to interrupt flushing!

                    // Ensure continuation if the uncaught exception is suppressed
                    // listening "uncaughtException" events (as domains does).
                    // Continue in next event to avoid tick recursion.
                    if (domain) {
                        domain.exit();
                    }
                    setTimeout(flush, 0);
                    if (domain) {
                        domain.enter();
                    }

                    throw e;

                } else {
                    // In browsers, uncaught exceptions are not fatal.
                    // Re-throw them asynchronously to avoid slow-downs.
                    setTimeout(function() {
                       throw e;
                    }, 0);
                }
            }

            if (domain) {
                domain.exit();
            }
        }

        flushing = false;
    }

    nextTick = function (task) {
        tail = tail.next = {
            task: task,
            domain: isNodeJS && process.domain,
            next: null
        };

        if (!flushing) {
            flushing = true;
            requestTick();
        }
    };

    if (typeof process !== "undefined" && process.nextTick) {
        // Node.js before 0.9. Note that some fake-Node environments, like the
        // Mocha test runner, introduce a `process` global without a `nextTick`.
        isNodeJS = true;

        requestTick = function () {
            process.nextTick(flush);
        };

    } else if (typeof setImmediate === "function") {
        // In IE10, Node.js 0.9+, or https://github.com/NobleJS/setImmediate
        if (typeof window !== "undefined") {
            requestTick = setImmediate.bind(window, flush);
        } else {
            requestTick = function () {
                setImmediate(flush);
            };
        }

    } else if (typeof MessageChannel !== "undefined") {
        // modern browsers
        // http://www.nonblocking.io/2011/06/windownexttick.html
        var channel = new MessageChannel();
        // At least Safari Version 6.0.5 (8536.30.1) intermittently cannot create
        // working message ports the first time a page loads.
        channel.port1.onmessage = function () {
            requestTick = requestPortTick;
            channel.port1.onmessage = flush;
            flush();
        };
        var requestPortTick = function () {
            // Opera requires us to provide a message payload, regardless of
            // whether we use it.
            channel.port2.postMessage(0);
        };
        requestTick = function () {
            setTimeout(flush, 0);
            requestPortTick();
        };

    } else {
        // old browsers
        requestTick = function () {
            setTimeout(flush, 0);
        };
    }

    return nextTick;
})();

// Attempt to make generics safe in the face of downstream
// modifications.
// There is no situation where this is necessary.
// If you need a security guarantee, these primordials need to be
// deeply frozen anyway, and if you don’t need a security guarantee,
// this is just plain paranoid.
// However, this **might** have the nice side-effect of reducing the size of
// the minified code by reducing x.call() to merely x()
// See Mark Miller’s explanation of what this does.
// http://wiki.ecmascript.org/doku.php?id=conventions:safe_meta_programming
var call = Function.call;
function uncurryThis(f) {
    return function () {
        return call.apply(f, arguments);
    };
}
// This is equivalent, but slower:
// uncurryThis = Function_bind.bind(Function_bind.call);
// http://jsperf.com/uncurrythis

var array_slice = uncurryThis(Array.prototype.slice);

var array_reduce = uncurryThis(
    Array.prototype.reduce || function (callback, basis) {
        var index = 0,
            length = this.length;
        // concerning the initial value, if one is not provided
        if (arguments.length === 1) {
            // seek to the first value in the array, accounting
            // for the possibility that is is a sparse array
            do {
                if (index in this) {
                    basis = this[index++];
                    break;
                }
                if (++index >= length) {
                    throw new TypeError();
                }
            } while (1);
        }
        // reduce
        for (; index < length; index++) {
            // account for the possibility that the array is sparse
            if (index in this) {
                basis = callback(basis, this[index], index);
            }
        }
        return basis;
    }
);

var array_indexOf = uncurryThis(
    Array.prototype.indexOf || function (value) {
        // not a very good shim, but good enough for our one use of it
        for (var i = 0; i < this.length; i++) {
            if (this[i] === value) {
                return i;
            }
        }
        return -1;
    }
);

var array_map = uncurryThis(
    Array.prototype.map || function (callback, thisp) {
        var self = this;
        var collect = [];
        array_reduce(self, function (undefined, value, index) {
            collect.push(callback.call(thisp, value, index, self));
        }, void 0);
        return collect;
    }
);

var object_create = Object.create || function (prototype) {
    function Type() { }
    Type.prototype = prototype;
    return new Type();
};

var object_hasOwnProperty = uncurryThis(Object.prototype.hasOwnProperty);

var object_keys = Object.keys || function (object) {
    var keys = [];
    for (var key in object) {
        if (object_hasOwnProperty(object, key)) {
            keys.push(key);
        }
    }
    return keys;
};

var object_toString = uncurryThis(Object.prototype.toString);

function isObject(value) {
    return value === Object(value);
}

// generator related shims

// FIXME: Remove this function once ES6 generators are in SpiderMonkey.
function isStopIteration(exception) {
    return (
        object_toString(exception) === "[object StopIteration]" ||
        exception instanceof QReturnValue
    );
}

// FIXME: Remove this helper and Q.return once ES6 generators are in
// SpiderMonkey.
var QReturnValue;
if (typeof ReturnValue !== "undefined") {
    QReturnValue = ReturnValue;
} else {
    QReturnValue = function (value) {
        this.value = value;
    };
}

// Until V8 3.19 / Chromium 29 is released, SpiderMonkey is the only
// engine that has a deployed base of browsers that support generators.
// However, SM's generators use the Python-inspired semantics of
// outdated ES6 drafts.  We would like to support ES6, but we'd also
// like to make it possible to use generators in deployed browsers, so
// we also support Python-style generators.  At some point we can remove
// this block.
var hasES6Generators;
try {
    /* jshint evil: true, nonew: false */
    new Function("(function* (){ yield 1; })");
    hasES6Generators = true;
} catch (e) {
    hasES6Generators = false;
}

// long stack traces

var STACK_JUMP_SEPARATOR = "From previous event:";

function makeStackTraceLong(error, promise) {
    // If possible, transform the error stack trace by removing Node and Q
    // cruft, then concatenating with the stack trace of `promise`. See #57.
    if (hasStacks &&
        promise.stack &&
        typeof error === "object" &&
        error !== null &&
        error.stack &&
        error.stack.indexOf(STACK_JUMP_SEPARATOR) === -1
    ) {
        var stacks = [];
        for (var p = promise; !!p; p = p.source) {
            if (p.stack) {
                stacks.unshift(p.stack);
            }
        }
        stacks.unshift(error.stack);

        var concatedStacks = stacks.join("\n" + STACK_JUMP_SEPARATOR + "\n");
        error.stack = filterStackString(concatedStacks);
    }
}

function filterStackString(stackString) {
    var lines = stackString.split("\n");
    var desiredLines = [];
    for (var i = 0; i < lines.length; ++i) {
        var line = lines[i];

        if (!isInternalFrame(line) && !isNodeFrame(line) && line) {
            desiredLines.push(line);
        }
    }
    return desiredLines.join("\n");
}

function isNodeFrame(stackLine) {
    return stackLine.indexOf("(module.js:") !== -1 ||
           stackLine.indexOf("(node.js:") !== -1;
}

function getFileNameAndLineNumber(stackLine) {
    // Named functions: "at functionName (filename:lineNumber:columnNumber)"
    // In IE10 function name can have spaces ("Anonymous function") O_o
    var attempt1 = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(stackLine);
    if (attempt1) {
        return [attempt1[1], Number(attempt1[2])];
    }

    // Anonymous functions: "at filename:lineNumber:columnNumber"
    var attempt2 = /at ([^ ]+):(\d+):(?:\d+)$/.exec(stackLine);
    if (attempt2) {
        return [attempt2[1], Number(attempt2[2])];
    }

    // Firefox style: "function@filename:lineNumber or @filename:lineNumber"
    var attempt3 = /.*@(.+):(\d+)$/.exec(stackLine);
    if (attempt3) {
        return [attempt3[1], Number(attempt3[2])];
    }
}

function isInternalFrame(stackLine) {
    var fileNameAndLineNumber = getFileNameAndLineNumber(stackLine);

    if (!fileNameAndLineNumber) {
        return false;
    }

    var fileName = fileNameAndLineNumber[0];
    var lineNumber = fileNameAndLineNumber[1];

    return fileName === qFileName &&
        lineNumber >= qStartingLine &&
        lineNumber <= qEndingLine;
}

// discover own file name and line number range for filtering stack
// traces
function captureLine() {
    if (!hasStacks) {
        return;
    }

    try {
        throw new Error();
    } catch (e) {
        var lines = e.stack.split("\n");
        var firstLine = lines[0].indexOf("@") > 0 ? lines[1] : lines[2];
        var fileNameAndLineNumber = getFileNameAndLineNumber(firstLine);
        if (!fileNameAndLineNumber) {
            return;
        }

        qFileName = fileNameAndLineNumber[0];
        return fileNameAndLineNumber[1];
    }
}

function deprecate(callback, name, alternative) {
    return function () {
        if (typeof console !== "undefined" &&
            typeof console.warn === "function") {
            console.warn(name + " is deprecated, use " + alternative +
                         " instead.", new Error("").stack);
        }
        return callback.apply(callback, arguments);
    };
}

// end of shims
// beginning of real work

/**
 * Constructs a promise for an immediate reference, passes promises through, or
 * coerces promises from different systems.
 * @param value immediate reference or promise
 */
function Q(value) {
    // If the object is already a Promise, return it directly.  This enables
    // the resolve function to both be used to created references from objects,
    // but to tolerably coerce non-promises to promises.
    if (isPromise(value)) {
        return value;
    }

    // assimilate thenables
    if (isPromiseAlike(value)) {
        return coerce(value);
    } else {
        return fulfill(value);
    }
}
Q.resolve = Q;

/**
 * Performs a task in a future turn of the event loop.
 * @param {Function} task
 */
Q.nextTick = nextTick;

/**
 * Controls whether or not long stack traces will be on
 */
Q.longStackSupport = false;

/**
 * Constructs a {promise, resolve, reject} object.
 *
 * `resolve` is a callback to invoke with a more resolved value for the
 * promise. To fulfill the promise, invoke `resolve` with any value that is
 * not a thenable. To reject the promise, invoke `resolve` with a rejected
 * thenable, or invoke `reject` with the reason directly. To resolve the
 * promise to another thenable, thus putting it in the same state, invoke
 * `resolve` with that other thenable.
 */
Q.defer = defer;
function defer() {
    // if "messages" is an "Array", that indicates that the promise has not yet
    // been resolved.  If it is "undefined", it has been resolved.  Each
    // element of the messages array is itself an array of complete arguments to
    // forward to the resolved promise.  We coerce the resolution value to a
    // promise using the `resolve` function because it handles both fully
    // non-thenable values and other thenables gracefully.
    var messages = [], progressListeners = [], resolvedPromise;

    var deferred = object_create(defer.prototype);
    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, operands) {
        var args = array_slice(arguments);
        if (messages) {
            messages.push(args);
            if (op === "when" && operands[1]) { // progress operand
                progressListeners.push(operands[1]);
            }
        } else {
            nextTick(function () {
                resolvedPromise.promiseDispatch.apply(resolvedPromise, args);
            });
        }
    };

    // XXX deprecated
    promise.valueOf = function () {
        if (messages) {
            return promise;
        }
        var nearerValue = nearer(resolvedPromise);
        if (isPromise(nearerValue)) {
            resolvedPromise = nearerValue; // shorten chain
        }
        return nearerValue;
    };

    promise.inspect = function () {
        if (!resolvedPromise) {
            return { state: "pending" };
        }
        return resolvedPromise.inspect();
    };

    if (Q.longStackSupport && hasStacks) {
        try {
            throw new Error();
        } catch (e) {
            // NOTE: don't try to use `Error.captureStackTrace` or transfer the
            // accessor around; that causes memory leaks as per GH-111. Just
            // reify the stack trace as a string ASAP.
            //
            // At the same time, cut off the first line; it's always just
            // "[object Promise]\n", as per the `toString`.
            promise.stack = e.stack.substring(e.stack.indexOf("\n") + 1);
        }
    }

    // NOTE: we do the checks for `resolvedPromise` in each method, instead of
    // consolidating them into `become`, since otherwise we'd create new
    // promises with the lines `become(whatever(value))`. See e.g. GH-252.

    function become(newPromise) {
        resolvedPromise = newPromise;
        promise.source = newPromise;

        array_reduce(messages, function (undefined, message) {
            nextTick(function () {
                newPromise.promiseDispatch.apply(newPromise, message);
            });
        }, void 0);

        messages = void 0;
        progressListeners = void 0;
    }

    deferred.promise = promise;
    deferred.resolve = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(Q(value));
    };

    deferred.fulfill = function (value) {
        if (resolvedPromise) {
            return;
        }

        become(fulfill(value));
    };
    deferred.reject = function (reason) {
        if (resolvedPromise) {
            return;
        }

        become(reject(reason));
    };
    deferred.notify = function (progress) {
        if (resolvedPromise) {
            return;
        }

        array_reduce(progressListeners, function (undefined, progressListener) {
            nextTick(function () {
                progressListener(progress);
            });
        }, void 0);
    };

    return deferred;
}

/**
 * Creates a Node-style callback that will resolve or reject the deferred
 * promise.
 * @returns a nodeback
 */
defer.prototype.makeNodeResolver = function () {
    var self = this;
    return function (error, value) {
        if (error) {
            self.reject(error);
        } else if (arguments.length > 2) {
            self.resolve(array_slice(arguments, 1));
        } else {
            self.resolve(value);
        }
    };
};

/**
 * @param resolver {Function} a function that returns nothing and accepts
 * the resolve, reject, and notify functions for a deferred.
 * @returns a promise that may be resolved with the given resolve and reject
 * functions, or rejected by a thrown exception in resolver
 */
Q.promise = promise;
function promise(resolver) {
    if (typeof resolver !== "function") {
        throw new TypeError("resolver must be a function.");
    }
    var deferred = defer();
    try {
        resolver(deferred.resolve, deferred.reject, deferred.notify);
    } catch (reason) {
        deferred.reject(reason);
    }
    return deferred.promise;
}

// XXX experimental.  This method is a way to denote that a local value is
// serializable and should be immediately dispatched to a remote upon request,
// instead of passing a reference.
Q.passByCopy = function (object) {
    //freeze(object);
    //passByCopies.set(object, true);
    return object;
};

Promise.prototype.passByCopy = function () {
    //freeze(object);
    //passByCopies.set(object, true);
    return this;
};

/**
 * If two promises eventually fulfill to the same value, promises that value,
 * but otherwise rejects.
 * @param x {Any*}
 * @param y {Any*}
 * @returns {Any*} a promise for x and y if they are the same, but a rejection
 * otherwise.
 *
 */
Q.join = function (x, y) {
    return Q(x).join(y);
};

Promise.prototype.join = function (that) {
    return Q([this, that]).spread(function (x, y) {
        if (x === y) {
            // TODO: "===" should be Object.is or equiv
            return x;
        } else {
            throw new Error("Can't join: not the same: " + x + " " + y);
        }
    });
};

/**
 * Returns a promise for the first of an array of promises to become fulfilled.
 * @param answers {Array[Any*]} promises to race
 * @returns {Any*} the first promise to be fulfilled
 */
Q.race = race;
function race(answerPs) {
    return promise(function(resolve, reject) {
        // Switch to this once we can assume at least ES5
        // answerPs.forEach(function(answerP) {
        //     Q(answerP).then(resolve, reject);
        // });
        // Use this in the meantime
        for (var i = 0, len = answerPs.length; i < len; i++) {
            Q(answerPs[i]).then(resolve, reject);
        }
    });
}

Promise.prototype.race = function () {
    return this.then(Q.race);
};

/**
 * Constructs a Promise with a promise descriptor object and optional fallback
 * function.  The descriptor contains methods like when(rejected), get(name),
 * set(name, value), post(name, args), and delete(name), which all
 * return either a value, a promise for a value, or a rejection.  The fallback
 * accepts the operation name, a resolver, and any further arguments that would
 * have been forwarded to the appropriate method above had a method been
 * provided with the proper name.  The API makes no guarantees about the nature
 * of the returned object, apart from that it is usable whereever promises are
 * bought and sold.
 */
Q.makePromise = Promise;
function Promise(descriptor, fallback, inspect) {
    if (fallback === void 0) {
        fallback = function (op) {
            return reject(new Error(
                "Promise does not support operation: " + op
            ));
        };
    }
    if (inspect === void 0) {
        inspect = function () {
            return {state: "unknown"};
        };
    }

    var promise = object_create(Promise.prototype);

    promise.promiseDispatch = function (resolve, op, args) {
        var result;
        try {
            if (descriptor[op]) {
                result = descriptor[op].apply(promise, args);
            } else {
                result = fallback.call(promise, op, args);
            }
        } catch (exception) {
            result = reject(exception);
        }
        if (resolve) {
            resolve(result);
        }
    };

    promise.inspect = inspect;

    // XXX deprecated `valueOf` and `exception` support
    if (inspect) {
        var inspected = inspect();
        if (inspected.state === "rejected") {
            promise.exception = inspected.reason;
        }

        promise.valueOf = function () {
            var inspected = inspect();
            if (inspected.state === "pending" ||
                inspected.state === "rejected") {
                return promise;
            }
            return inspected.value;
        };
    }

    return promise;
}

Promise.prototype.toString = function () {
    return "[object Promise]";
};

Promise.prototype.then = function (fulfilled, rejected, progressed) {
    var self = this;
    var deferred = defer();
    var done = false;   // ensure the untrusted promise makes at most a
                        // single call to one of the callbacks

    function _fulfilled(value) {
        try {
            return typeof fulfilled === "function" ? fulfilled(value) : value;
        } catch (exception) {
            return reject(exception);
        }
    }

    function _rejected(exception) {
        if (typeof rejected === "function") {
            makeStackTraceLong(exception, self);
            try {
                return rejected(exception);
            } catch (newException) {
                return reject(newException);
            }
        }
        return reject(exception);
    }

    function _progressed(value) {
        return typeof progressed === "function" ? progressed(value) : value;
    }

    nextTick(function () {
        self.promiseDispatch(function (value) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_fulfilled(value));
        }, "when", [function (exception) {
            if (done) {
                return;
            }
            done = true;

            deferred.resolve(_rejected(exception));
        }]);
    });

    // Progress propagator need to be attached in the current tick.
    self.promiseDispatch(void 0, "when", [void 0, function (value) {
        var newValue;
        var threw = false;
        try {
            newValue = _progressed(value);
        } catch (e) {
            threw = true;
            if (Q.onerror) {
                Q.onerror(e);
            } else {
                throw e;
            }
        }

        if (!threw) {
            deferred.notify(newValue);
        }
    }]);

    return deferred.promise;
};

/**
 * Registers an observer on a promise.
 *
 * Guarantees:
 *
 * 1. that fulfilled and rejected will be called only once.
 * 2. that either the fulfilled callback or the rejected callback will be
 *    called, but not both.
 * 3. that fulfilled and rejected will not be called in this turn.
 *
 * @param value      promise or immediate reference to observe
 * @param fulfilled  function to be called with the fulfilled value
 * @param rejected   function to be called with the rejection exception
 * @param progressed function to be called on any progress notifications
 * @return promise for the return value from the invoked callback
 */
Q.when = when;
function when(value, fulfilled, rejected, progressed) {
    return Q(value).then(fulfilled, rejected, progressed);
}

Promise.prototype.thenResolve = function (value) {
    return this.then(function () { return value; });
};

Q.thenResolve = function (promise, value) {
    return Q(promise).thenResolve(value);
};

Promise.prototype.thenReject = function (reason) {
    return this.then(function () { throw reason; });
};

Q.thenReject = function (promise, reason) {
    return Q(promise).thenReject(reason);
};

/**
 * If an object is not a promise, it is as "near" as possible.
 * If a promise is rejected, it is as "near" as possible too.
 * If it’s a fulfilled promise, the fulfillment value is nearer.
 * If it’s a deferred promise and the deferred has been resolved, the
 * resolution is "nearer".
 * @param object
 * @returns most resolved (nearest) form of the object
 */

// XXX should we re-do this?
Q.nearer = nearer;
function nearer(value) {
    if (isPromise(value)) {
        var inspected = value.inspect();
        if (inspected.state === "fulfilled") {
            return inspected.value;
        }
    }
    return value;
}

/**
 * @returns whether the given object is a promise.
 * Otherwise it is a fulfilled value.
 */
Q.isPromise = isPromise;
function isPromise(object) {
    return isObject(object) &&
        typeof object.promiseDispatch === "function" &&
        typeof object.inspect === "function";
}

Q.isPromiseAlike = isPromiseAlike;
function isPromiseAlike(object) {
    return isObject(object) && typeof object.then === "function";
}

/**
 * @returns whether the given object is a pending promise, meaning not
 * fulfilled or rejected.
 */
Q.isPending = isPending;
function isPending(object) {
    return isPromise(object) && object.inspect().state === "pending";
}

Promise.prototype.isPending = function () {
    return this.inspect().state === "pending";
};

/**
 * @returns whether the given object is a value or fulfilled
 * promise.
 */
Q.isFulfilled = isFulfilled;
function isFulfilled(object) {
    return !isPromise(object) || object.inspect().state === "fulfilled";
}

Promise.prototype.isFulfilled = function () {
    return this.inspect().state === "fulfilled";
};

/**
 * @returns whether the given object is a rejected promise.
 */
Q.isRejected = isRejected;
function isRejected(object) {
    return isPromise(object) && object.inspect().state === "rejected";
}

Promise.prototype.isRejected = function () {
    return this.inspect().state === "rejected";
};

//// BEGIN UNHANDLED REJECTION TRACKING

// This promise library consumes exceptions thrown in handlers so they can be
// handled by a subsequent promise.  The exceptions get added to this array when
// they are created, and removed when they are handled.  Note that in ES6 or
// shimmed environments, this would naturally be a `Set`.
var unhandledReasons = [];
var unhandledRejections = [];
var unhandledReasonsDisplayed = false;
var trackUnhandledRejections = true;
function displayUnhandledReasons() {
    if (
        !unhandledReasonsDisplayed &&
        typeof window !== "undefined" &&
        window.console
    ) {
        console.warn("[Q] Unhandled rejection reasons (should be empty):",
                     unhandledReasons);
    }

    unhandledReasonsDisplayed = true;
}

function logUnhandledReasons() {
    for (var i = 0; i < unhandledReasons.length; i++) {
        var reason = unhandledReasons[i];
        console.warn("Unhandled rejection reason:", reason);
    }
}

function resetUnhandledRejections() {
    unhandledReasons.length = 0;
    unhandledRejections.length = 0;
    unhandledReasonsDisplayed = false;

    if (!trackUnhandledRejections) {
        trackUnhandledRejections = true;

        // Show unhandled rejection reasons if Node exits without handling an
        // outstanding rejection.  (Note that Browserify presently produces a
        // `process` global without the `EventEmitter` `on` method.)
        if (typeof process !== "undefined" && process.on) {
            process.on("exit", logUnhandledReasons);
        }
    }
}

function trackRejection(promise, reason) {
    if (!trackUnhandledRejections) {
        return;
    }

    unhandledRejections.push(promise);
    if (reason && typeof reason.stack !== "undefined") {
        unhandledReasons.push(reason.stack);
    } else {
        unhandledReasons.push("(no stack) " + reason);
    }
    displayUnhandledReasons();
}

function untrackRejection(promise) {
    if (!trackUnhandledRejections) {
        return;
    }

    var at = array_indexOf(unhandledRejections, promise);
    if (at !== -1) {
        unhandledRejections.splice(at, 1);
        unhandledReasons.splice(at, 1);
    }
}

Q.resetUnhandledRejections = resetUnhandledRejections;

Q.getUnhandledReasons = function () {
    // Make a copy so that consumers can't interfere with our internal state.
    return unhandledReasons.slice();
};

Q.stopUnhandledRejectionTracking = function () {
    resetUnhandledRejections();
    if (typeof process !== "undefined" && process.on) {
        process.removeListener("exit", logUnhandledReasons);
    }
    trackUnhandledRejections = false;
};

resetUnhandledRejections();

//// END UNHANDLED REJECTION TRACKING

/**
 * Constructs a rejected promise.
 * @param reason value describing the failure
 */
Q.reject = reject;
function reject(reason) {
    var rejection = Promise({
        "when": function (rejected) {
            // note that the error has been handled
            if (rejected) {
                untrackRejection(this);
            }
            return rejected ? rejected(reason) : this;
        }
    }, function fallback() {
        return this;
    }, function inspect() {
        return { state: "rejected", reason: reason };
    });

    // Note that the reason has not been handled.
    trackRejection(rejection, reason);

    return rejection;
}

/**
 * Constructs a fulfilled promise for an immediate reference.
 * @param value immediate reference
 */
Q.fulfill = fulfill;
function fulfill(value) {
    return Promise({
        "when": function () {
            return value;
        },
        "get": function (name) {
            return value[name];
        },
        "set": function (name, rhs) {
            value[name] = rhs;
        },
        "delete": function (name) {
            delete value[name];
        },
        "post": function (name, args) {
            // Mark Miller proposes that post with no name should apply a
            // promised function.
            if (name === null || name === void 0) {
                return value.apply(void 0, args);
            } else {
                return value[name].apply(value, args);
            }
        },
        "apply": function (thisp, args) {
            return value.apply(thisp, args);
        },
        "keys": function () {
            return object_keys(value);
        }
    }, void 0, function inspect() {
        return { state: "fulfilled", value: value };
    });
}

/**
 * Converts thenables to Q promises.
 * @param promise thenable promise
 * @returns a Q promise
 */
function coerce(promise) {
    var deferred = defer();
    nextTick(function () {
        try {
            promise.then(deferred.resolve, deferred.reject, deferred.notify);
        } catch (exception) {
            deferred.reject(exception);
        }
    });
    return deferred.promise;
}

/**
 * Annotates an object such that it will never be
 * transferred away from this process over any promise
 * communication channel.
 * @param object
 * @returns promise a wrapping of that object that
 * additionally responds to the "isDef" message
 * without a rejection.
 */
Q.master = master;
function master(object) {
    return Promise({
        "isDef": function () {}
    }, function fallback(op, args) {
        return dispatch(object, op, args);
    }, function () {
        return Q(object).inspect();
    });
}

/**
 * Spreads the values of a promised array of arguments into the
 * fulfillment callback.
 * @param fulfilled callback that receives variadic arguments from the
 * promised array
 * @param rejected callback that receives the exception if the promise
 * is rejected.
 * @returns a promise for the return value or thrown exception of
 * either callback.
 */
Q.spread = spread;
function spread(value, fulfilled, rejected) {
    return Q(value).spread(fulfilled, rejected);
}

Promise.prototype.spread = function (fulfilled, rejected) {
    return this.all().then(function (array) {
        return fulfilled.apply(void 0, array);
    }, rejected);
};

/**
 * The async function is a decorator for generator functions, turning
 * them into asynchronous generators.  Although generators are only part
 * of the newest ECMAScript 6 drafts, this code does not cause syntax
 * errors in older engines.  This code should continue to work and will
 * in fact improve over time as the language improves.
 *
 * ES6 generators are currently part of V8 version 3.19 with the
 * --harmony-generators runtime flag enabled.  SpiderMonkey has had them
 * for longer, but under an older Python-inspired form.  This function
 * works on both kinds of generators.
 *
 * Decorates a generator function such that:
 *  - it may yield promises
 *  - execution will continue when that promise is fulfilled
 *  - the value of the yield expression will be the fulfilled value
 *  - it returns a promise for the return value (when the generator
 *    stops iterating)
 *  - the decorated function returns a promise for the return value
 *    of the generator or the first rejected promise among those
 *    yielded.
 *  - if an error is thrown in the generator, it propagates through
 *    every following yield until it is caught, or until it escapes
 *    the generator function altogether, and is translated into a
 *    rejection for the promise returned by the decorated generator.
 */
Q.async = async;
function async(makeGenerator) {
    return function () {
        // when verb is "send", arg is a value
        // when verb is "throw", arg is an exception
        function continuer(verb, arg) {
            var result;
            if (hasES6Generators) {
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    return reject(exception);
                }
                if (result.done) {
                    return result.value;
                } else {
                    return when(result.value, callback, errback);
                }
            } else {
                // FIXME: Remove this case when SM does ES6 generators.
                try {
                    result = generator[verb](arg);
                } catch (exception) {
                    if (isStopIteration(exception)) {
                        return exception.value;
                    } else {
                        return reject(exception);
                    }
                }
                return when(result, callback, errback);
            }
        }
        var generator = makeGenerator.apply(this, arguments);
        var callback = continuer.bind(continuer, "next");
        var errback = continuer.bind(continuer, "throw");
        return callback();
    };
}

/**
 * The spawn function is a small wrapper around async that immediately
 * calls the generator and also ends the promise chain, so that any
 * unhandled errors are thrown instead of forwarded to the error
 * handler. This is useful because it's extremely common to run
 * generators at the top-level to work with libraries.
 */
Q.spawn = spawn;
function spawn(makeGenerator) {
    Q.done(Q.async(makeGenerator)());
}

// FIXME: Remove this interface once ES6 generators are in SpiderMonkey.
/**
 * Throws a ReturnValue exception to stop an asynchronous generator.
 *
 * This interface is a stop-gap measure to support generator return
 * values in older Firefox/SpiderMonkey.  In browsers that support ES6
 * generators like Chromium 29, just use "return" in your generator
 * functions.
 *
 * @param value the return value for the surrounding generator
 * @throws ReturnValue exception with the value.
 * @example
 * // ES6 style
 * Q.async(function* () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      return foo + bar;
 * })
 * // Older SpiderMonkey style
 * Q.async(function () {
 *      var foo = yield getFooPromise();
 *      var bar = yield getBarPromise();
 *      Q.return(foo + bar);
 * })
 */
Q["return"] = _return;
function _return(value) {
    throw new QReturnValue(value);
}

/**
 * The promised function decorator ensures that any promise arguments
 * are settled and passed as values (`this` is also settled and passed
 * as a value).  It will also ensure that the result of a function is
 * always a promise.
 *
 * @example
 * var add = Q.promised(function (a, b) {
 *     return a + b;
 * });
 * add(Q(a), Q(B));
 *
 * @param {function} callback The function to decorate
 * @returns {function} a function that has been decorated.
 */
Q.promised = promised;
function promised(callback) {
    return function () {
        return spread([this, all(arguments)], function (self, args) {
            return callback.apply(self, args);
        });
    };
}

/**
 * sends a message to a value in a future turn
 * @param object* the recipient
 * @param op the name of the message operation, e.g., "when",
 * @param args further arguments to be forwarded to the operation
 * @returns result {Promise} a promise for the result of the operation
 */
Q.dispatch = dispatch;
function dispatch(object, op, args) {
    return Q(object).dispatch(op, args);
}

Promise.prototype.dispatch = function (op, args) {
    var self = this;
    var deferred = defer();
    nextTick(function () {
        self.promiseDispatch(deferred.resolve, op, args);
    });
    return deferred.promise;
};

/**
 * Gets the value of a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to get
 * @return promise for the property value
 */
Q.get = function (object, key) {
    return Q(object).dispatch("get", [key]);
};

Promise.prototype.get = function (key) {
    return this.dispatch("get", [key]);
};

/**
 * Sets the value of a property in a future turn.
 * @param object    promise or immediate reference for object object
 * @param name      name of property to set
 * @param value     new value of property
 * @return promise for the return value
 */
Q.set = function (object, key, value) {
    return Q(object).dispatch("set", [key, value]);
};

Promise.prototype.set = function (key, value) {
    return this.dispatch("set", [key, value]);
};

/**
 * Deletes a property in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of property to delete
 * @return promise for the return value
 */
Q.del = // XXX legacy
Q["delete"] = function (object, key) {
    return Q(object).dispatch("delete", [key]);
};

Promise.prototype.del = // XXX legacy
Promise.prototype["delete"] = function (key) {
    return this.dispatch("delete", [key]);
};

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param value     a value to post, typically an array of
 *                  invocation arguments for promises that
 *                  are ultimately backed with `resolve` values,
 *                  as opposed to those backed with URLs
 *                  wherein the posted value can be any
 *                  JSON serializable object.
 * @return promise for the return value
 */
// bound locally because it is used by other methods
Q.mapply = // XXX As proposed by "Redsandro"
Q.post = function (object, name, args) {
    return Q(object).dispatch("post", [name, args]);
};

Promise.prototype.mapply = // XXX As proposed by "Redsandro"
Promise.prototype.post = function (name, args) {
    return this.dispatch("post", [name, args]);
};

/**
 * Invokes a method in a future turn.
 * @param object    promise or immediate reference for target object
 * @param name      name of method to invoke
 * @param ...args   array of invocation arguments
 * @return promise for the return value
 */
Q.send = // XXX Mark Miller's proposed parlance
Q.mcall = // XXX As proposed by "Redsandro"
Q.invoke = function (object, name /*...args*/) {
    return Q(object).dispatch("post", [name, array_slice(arguments, 2)]);
};

Promise.prototype.send = // XXX Mark Miller's proposed parlance
Promise.prototype.mcall = // XXX As proposed by "Redsandro"
Promise.prototype.invoke = function (name /*...args*/) {
    return this.dispatch("post", [name, array_slice(arguments, 1)]);
};

/**
 * Applies the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param args      array of application arguments
 */
Q.fapply = function (object, args) {
    return Q(object).dispatch("apply", [void 0, args]);
};

Promise.prototype.fapply = function (args) {
    return this.dispatch("apply", [void 0, args]);
};

/**
 * Calls the promised function in a future turn.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q["try"] =
Q.fcall = function (object /* ...args*/) {
    return Q(object).dispatch("apply", [void 0, array_slice(arguments, 1)]);
};

Promise.prototype.fcall = function (/*...args*/) {
    return this.dispatch("apply", [void 0, array_slice(arguments)]);
};

/**
 * Binds the promised function, transforming return values into a fulfilled
 * promise and thrown errors into a rejected one.
 * @param object    promise or immediate reference for target function
 * @param ...args   array of application arguments
 */
Q.fbind = function (object /*...args*/) {
    var promise = Q(object);
    var args = array_slice(arguments, 1);
    return function fbound() {
        return promise.dispatch("apply", [
            this,
            args.concat(array_slice(arguments))
        ]);
    };
};
Promise.prototype.fbind = function (/*...args*/) {
    var promise = this;
    var args = array_slice(arguments);
    return function fbound() {
        return promise.dispatch("apply", [
            this,
            args.concat(array_slice(arguments))
        ]);
    };
};

/**
 * Requests the names of the owned properties of a promised
 * object in a future turn.
 * @param object    promise or immediate reference for target object
 * @return promise for the keys of the eventually settled object
 */
Q.keys = function (object) {
    return Q(object).dispatch("keys", []);
};

Promise.prototype.keys = function () {
    return this.dispatch("keys", []);
};

/**
 * Turns an array of promises into a promise for an array.  If any of
 * the promises gets rejected, the whole array is rejected immediately.
 * @param {Array*} an array (or promise for an array) of values (or
 * promises for values)
 * @returns a promise for an array of the corresponding values
 */
// By Mark Miller
// http://wiki.ecmascript.org/doku.php?id=strawman:concurrency&rev=1308776521#allfulfilled
Q.all = all;
function all(promises) {
    return when(promises, function (promises) {
        var countDown = 0;
        var deferred = defer();
        array_reduce(promises, function (undefined, promise, index) {
            var snapshot;
            if (
                isPromise(promise) &&
                (snapshot = promise.inspect()).state === "fulfilled"
            ) {
                promises[index] = snapshot.value;
            } else {
                ++countDown;
                when(
                    promise,
                    function (value) {
                        promises[index] = value;
                        if (--countDown === 0) {
                            deferred.resolve(promises);
                        }
                    },
                    deferred.reject,
                    function (progress) {
                        deferred.notify({ index: index, value: progress });
                    }
                );
            }
        }, void 0);
        if (countDown === 0) {
            deferred.resolve(promises);
        }
        return deferred.promise;
    });
}

Promise.prototype.all = function () {
    return all(this);
};

/**
 * Waits for all promises to be settled, either fulfilled or
 * rejected.  This is distinct from `all` since that would stop
 * waiting at the first rejection.  The promise returned by
 * `allResolved` will never be rejected.
 * @param promises a promise for an array (or an array) of promises
 * (or values)
 * @return a promise for an array of promises
 */
Q.allResolved = deprecate(allResolved, "allResolved", "allSettled");
function allResolved(promises) {
    return when(promises, function (promises) {
        promises = array_map(promises, Q);
        return when(all(array_map(promises, function (promise) {
            return when(promise, noop, noop);
        })), function () {
            return promises;
        });
    });
}

Promise.prototype.allResolved = function () {
    return allResolved(this);
};

/**
 * @see Promise#allSettled
 */
Q.allSettled = allSettled;
function allSettled(promises) {
    return Q(promises).allSettled();
}

/**
 * Turns an array of promises into a promise for an array of their states (as
 * returned by `inspect`) when they have all settled.
 * @param {Array[Any*]} values an array (or promise for an array) of values (or
 * promises for values)
 * @returns {Array[State]} an array of states for the respective values.
 */
Promise.prototype.allSettled = function () {
    return this.then(function (promises) {
        return all(array_map(promises, function (promise) {
            promise = Q(promise);
            function regardless() {
                return promise.inspect();
            }
            return promise.then(regardless, regardless);
        }));
    });
};

/**
 * Captures the failure of a promise, giving an oportunity to recover
 * with a callback.  If the given promise is fulfilled, the returned
 * promise is fulfilled.
 * @param {Any*} promise for something
 * @param {Function} callback to fulfill the returned promise if the
 * given promise is rejected
 * @returns a promise for the return value of the callback
 */
Q.fail = // XXX legacy
Q["catch"] = function (object, rejected) {
    return Q(object).then(void 0, rejected);
};

Promise.prototype.fail = // XXX legacy
Promise.prototype["catch"] = function (rejected) {
    return this.then(void 0, rejected);
};

/**
 * Attaches a listener that can respond to progress notifications from a
 * promise's originating deferred. This listener receives the exact arguments
 * passed to ``deferred.notify``.
 * @param {Any*} promise for something
 * @param {Function} callback to receive any progress notifications
 * @returns the given promise, unchanged
 */
Q.progress = progress;
function progress(object, progressed) {
    return Q(object).then(void 0, void 0, progressed);
}

Promise.prototype.progress = function (progressed) {
    return this.then(void 0, void 0, progressed);
};

/**
 * Provides an opportunity to observe the settling of a promise,
 * regardless of whether the promise is fulfilled or rejected.  Forwards
 * the resolution to the returned promise when the callback is done.
 * The callback can return a promise to defer completion.
 * @param {Any*} promise
 * @param {Function} callback to observe the resolution of the given
 * promise, takes no arguments.
 * @returns a promise for the resolution of the given promise when
 * ``fin`` is done.
 */
Q.fin = // XXX legacy
Q["finally"] = function (object, callback) {
    return Q(object)["finally"](callback);
};

Promise.prototype.fin = // XXX legacy
Promise.prototype["finally"] = function (callback) {
    callback = Q(callback);
    return this.then(function (value) {
        return callback.fcall().then(function () {
            return value;
        });
    }, function (reason) {
        // TODO attempt to recycle the rejection with "this".
        return callback.fcall().then(function () {
            throw reason;
        });
    });
};

/**
 * Terminates a chain of promises, forcing rejections to be
 * thrown as exceptions.
 * @param {Any*} promise at the end of a chain of promises
 * @returns nothing
 */
Q.done = function (object, fulfilled, rejected, progress) {
    return Q(object).done(fulfilled, rejected, progress);
};

Promise.prototype.done = function (fulfilled, rejected, progress) {
    var onUnhandledError = function (error) {
        // forward to a future turn so that ``when``
        // does not catch it and turn it into a rejection.
        nextTick(function () {
            makeStackTraceLong(error, promise);
            if (Q.onerror) {
                Q.onerror(error);
            } else {
                throw error;
            }
        });
    };

    // Avoid unnecessary `nextTick`ing via an unnecessary `when`.
    var promise = fulfilled || rejected || progress ?
        this.then(fulfilled, rejected, progress) :
        this;

    if (typeof process === "object" && process && process.domain) {
        onUnhandledError = process.domain.bind(onUnhandledError);
    }

    promise.then(void 0, onUnhandledError);
};

/**
 * Causes a promise to be rejected if it does not get fulfilled before
 * some milliseconds time out.
 * @param {Any*} promise
 * @param {Number} milliseconds timeout
 * @param {String} custom error message (optional)
 * @returns a promise for the resolution of the given promise if it is
 * fulfilled before the timeout, otherwise rejected.
 */
Q.timeout = function (object, ms, message) {
    return Q(object).timeout(ms, message);
};

Promise.prototype.timeout = function (ms, message) {
    var deferred = defer();
    var timeoutId = setTimeout(function () {
        deferred.reject(new Error(message || "Timed out after " + ms + " ms"));
    }, ms);

    this.then(function (value) {
        clearTimeout(timeoutId);
        deferred.resolve(value);
    }, function (exception) {
        clearTimeout(timeoutId);
        deferred.reject(exception);
    }, deferred.notify);

    return deferred.promise;
};

/**
 * Returns a promise for the given value (or promised value), some
 * milliseconds after it resolved. Passes rejections immediately.
 * @param {Any*} promise
 * @param {Number} milliseconds
 * @returns a promise for the resolution of the given promise after milliseconds
 * time has elapsed since the resolution of the given promise.
 * If the given promise rejects, that is passed immediately.
 */
Q.delay = function (object, timeout) {
    if (timeout === void 0) {
        timeout = object;
        object = void 0;
    }
    return Q(object).delay(timeout);
};

Promise.prototype.delay = function (timeout) {
    return this.then(function (value) {
        var deferred = defer();
        setTimeout(function () {
            deferred.resolve(value);
        }, timeout);
        return deferred.promise;
    });
};

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided as an array, and returns a promise.
 *
 *      Q.nfapply(FS.readFile, [__filename])
 *      .then(function (content) {
 *      })
 *
 */
Q.nfapply = function (callback, args) {
    return Q(callback).nfapply(args);
};

Promise.prototype.nfapply = function (args) {
    var deferred = defer();
    var nodeArgs = array_slice(args);
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Passes a continuation to a Node function, which is called with the given
 * arguments provided individually, and returns a promise.
 * @example
 * Q.nfcall(FS.readFile, __filename)
 * .then(function (content) {
 * })
 *
 */
Q.nfcall = function (callback /*...args*/) {
    var args = array_slice(arguments, 1);
    return Q(callback).nfapply(args);
};

Promise.prototype.nfcall = function (/*...args*/) {
    var nodeArgs = array_slice(arguments);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.fapply(nodeArgs).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Wraps a NodeJS continuation passing function and returns an equivalent
 * version that returns a promise.
 * @example
 * Q.nfbind(FS.readFile, __filename)("utf-8")
 * .then(console.log)
 * .done()
 */
Q.nfbind =
Q.denodeify = function (callback /*...args*/) {
    var baseArgs = array_slice(arguments, 1);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        Q(callback).fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
};

Promise.prototype.nfbind =
Promise.prototype.denodeify = function (/*...args*/) {
    var args = array_slice(arguments);
    args.unshift(this);
    return Q.denodeify.apply(void 0, args);
};

Q.nbind = function (callback, thisp /*...args*/) {
    var baseArgs = array_slice(arguments, 2);
    return function () {
        var nodeArgs = baseArgs.concat(array_slice(arguments));
        var deferred = defer();
        nodeArgs.push(deferred.makeNodeResolver());
        function bound() {
            return callback.apply(thisp, arguments);
        }
        Q(bound).fapply(nodeArgs).fail(deferred.reject);
        return deferred.promise;
    };
};

Promise.prototype.nbind = function (/*thisp, ...args*/) {
    var args = array_slice(arguments, 0);
    args.unshift(this);
    return Q.nbind.apply(void 0, args);
};

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback with a given array of arguments, plus a provided callback.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param {Array} args arguments to pass to the method; the callback
 * will be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nmapply = // XXX As proposed by "Redsandro"
Q.npost = function (object, name, args) {
    return Q(object).npost(name, args);
};

Promise.prototype.nmapply = // XXX As proposed by "Redsandro"
Promise.prototype.npost = function (name, args) {
    var nodeArgs = array_slice(args || []);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

/**
 * Calls a method of a Node-style object that accepts a Node-style
 * callback, forwarding the given variadic arguments, plus a provided
 * callback argument.
 * @param object an object that has the named method
 * @param {String} name name of the method of object
 * @param ...args arguments to pass to the method; the callback will
 * be provided by Q and appended to these arguments.
 * @returns a promise for the value or error
 */
Q.nsend = // XXX Based on Mark Miller's proposed "send"
Q.nmcall = // XXX Based on "Redsandro's" proposal
Q.ninvoke = function (object, name /*...args*/) {
    var nodeArgs = array_slice(arguments, 2);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    Q(object).dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

Promise.prototype.nsend = // XXX Based on Mark Miller's proposed "send"
Promise.prototype.nmcall = // XXX Based on "Redsandro's" proposal
Promise.prototype.ninvoke = function (name /*...args*/) {
    var nodeArgs = array_slice(arguments, 1);
    var deferred = defer();
    nodeArgs.push(deferred.makeNodeResolver());
    this.dispatch("post", [name, nodeArgs]).fail(deferred.reject);
    return deferred.promise;
};

/**
 * If a function would like to support both Node continuation-passing-style and
 * promise-returning-style, it can end its internal promise chain with
 * `nodeify(nodeback)`, forwarding the optional nodeback argument.  If the user
 * elects to use a nodeback, the result will be sent there.  If they do not
 * pass a nodeback, they will receive the result promise.
 * @param object a result (or a promise for a result)
 * @param {Function} nodeback a Node.js-style callback
 * @returns either the promise or nothing
 */
Q.nodeify = nodeify;
function nodeify(object, nodeback) {
    return Q(object).nodeify(nodeback);
}

Promise.prototype.nodeify = function (nodeback) {
    if (nodeback) {
        this.then(function (value) {
            nextTick(function () {
                nodeback(null, value);
            });
        }, function (error) {
            nextTick(function () {
                nodeback(error);
            });
        });
    } else {
        return this;
    }
};

// All code before this point will be filtered from stack traces.
var qEndingLine = captureLine();

return Q;

});

}).call(this,require("/Users/joshminzner/Documents/Cinema6/c6embed/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js"))
},{"/Users/joshminzner/Documents/Cinema6/c6embed/node_modules/grunt-browserify/node_modules/browserify/node_modules/insert-module-globals/node_modules/process/browser.js":13}],15:[function(require,module,exports){
module.exports = function(deps) {
    'use strict';

    var $window = deps.window,
        $document = deps.document;

    var scripts = $document.getElementsByTagName('script'),
        thisScript = scripts[scripts.length - 1];

    this.experienceId = thisScript.getAttribute('data-exp');
    this.width = thisScript.getAttribute('data-width');
    this.height = thisScript.getAttribute('data-height');

    this.src = thisScript.getAttribute('src');
    this.script = thisScript;
    this.debug = !!$window.__C6_DEBUG__;
};

},{}],16:[function(require,module,exports){
module.exports = function(deps) {
    'use strict';

    var $document = deps.document,
        config = deps.config,
        q = deps.q,
        c6Db = deps.c6Db,
        c6Ajax = deps.c6Ajax,
        experienceService = deps.experience;


    /* HELPER FUNCTIONS */
    function appUrl(url) {
        return (config.debug ?
            'http://s3.amazonaws.com/c6.dev/content/' :
            'http://cinema6.com/experiences/') + url;
    }

    function setFullscreen(element, bool) {
        var fullscreenStyles = {
                position: 'fixed',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 999999999999999
            },
            style = element.style,
            prop;

        for (prop in fullscreenStyles) {
            style[prop] = bool ? fullscreenStyles[prop] : '';
        }
    }

    /* SUPER-DUPER ASYNC PROMISE CHANGE STARTS HERE */
    function createFrame() {
        var iframe = $document.createElement('iframe'),
            script = config.script,
            parent = script.parentNode;

        iframe.src = 'about:blank';
        iframe.width = config.width;
        iframe.height = config.height;

        return q.when(parent.insertBefore(iframe, script.nextSibling));
    }

    function fetchExperience(iframe) {
        return q.all([
            c6Db.find('experience', config.experienceId),
            iframe
        ]);
    }

    function fetchIndex(data) {
        var experience = data[0],
            iframe = data[1];

        return q.all([
            experience,
            iframe,
            c6Ajax.get(appUrl(experience.appUri) + '/index.html')
                .then(function(response) {
                    return response.data;
                })
        ]);
    }

    function loadApp(data) {
        var experience = data[0],
            iframe = data[1],
            indexHTML = data[2];

        var frameDoc = iframe.contentWindow.document,
            baseTag = '<base href="' + appUrl(experience.appUri) + '/">';

        frameDoc.open();
        frameDoc.write(indexHTML);
        frameDoc.write(baseTag);
        frameDoc.close();

        return [experience, iframe];
    }

    function communicateWithApp(data) {
        var experience = data[0],
            iframe = data[1];

        var session = experienceService.registerExperience(experience, iframe.contentWindow);

        session.once('ready', function() {
            session.on('fullscreenMode', function(fullscreen) {
                setFullscreen(iframe, fullscreen);
            });
        });

        return 'Success! Every went according to plan!';
    }

    /* Execute the chain */
    return createFrame()
        .then(fetchExperience)
        .then(fetchIndex)
        .then(loadApp)
        .then(communicateWithApp);
};

},{}],17:[function(require,module,exports){
(function() {
    'use strict';

    var app = require('./app');

    /* Create Config */
    var Config = require('./Config'),
        config = new Config({
            window: window,
            document: window.document
        });

    /* Fetch Q */
    var q = require('q');

    /* Fetch Modernizr */
    var modernizr = require('Modernizr');

    /* Fetch asEvented */
    var asEvented = require('asEvented');

    /* Create UserAgent */
    var UserAgent = require('../lib/UserAgent'),
        userAgent = new UserAgent({
            window: window
        });

    /* Create PostMessage */
    var PostMessage = require('../lib/PostMessage'),
        postmessage = new PostMessage({
            asEvented: asEvented,
            q: q,
            window: window
        });

    /* Create Location */
    var Location = require('./utils/Location'),
        $location = new Location({
            window: window
        });

    /* Create BrowserInfo */
    var BrowserInfo = require('../lib/BrowserInfo'),
        browserInfo = new BrowserInfo({
            modernizr: modernizr,
            window: window,
            userAgent: userAgent
        });

    /* Create Experience */
    var Experience = require('../lib/Experience'),
        experience = new Experience({
            postmessage: postmessage,
            q: q,
            browserInfo: browserInfo
        });

    /* Create C6AJAX */
    var C6AJAX = require('../lib/c6ajax/C6AJAX'),
        c6Ajax = new C6AJAX({
            window: window,
            q: q,
            browserInfo: browserInfo,
            location: $location
        });

    /* Create and Configure C6DB */
    var FixtureAdapter = require('../lib/c6db/adapters/Fixture'),
        C6DB = require('../lib/c6db/C6DB'),
        adapter = new FixtureAdapter({
            c6Ajax: c6Ajax,
            q: q
        }),
        c6Db = new C6DB({
            q: q
        });
    adapter.jsonSrc = 'http://s3.amazonaws.com/c6.dev/mock/fixtures.json';
    c6Db.adapter = adapter;

    /* Run the Application! */
    return app({
        document: window.document,
        config: config,
        q: q,
        c6Db: c6Db,
        c6Ajax: c6Ajax,
        experience: experience
    })
        .then(function(result) {
            if (!window.console) { return; }
            window.console.log(result);
        }, function(error) {
            if (!window.console) { return; }
            window.console.error(error);
        });
}());

},{"../lib/BrowserInfo":3,"../lib/Experience":4,"../lib/PostMessage":5,"../lib/UserAgent":6,"../lib/c6ajax/C6AJAX":7,"../lib/c6db/C6DB":10,"../lib/c6db/adapters/Fixture":11,"./Config":15,"./app":16,"./utils/Location":18,"Modernizr":"VCzfuR","asEvented":12,"q":14}],18:[function(require,module,exports){
module.exports = function(deps) {
    'use strict';

    var $window = deps.window;

    this.originOf = function(url) {
        var isAbs = url.search(/^\w+:\/\//) > -1;

        function getOriginOfAbsUrl(url) {
            var protocol = url.match(/^\w+:/)[0].slice(0, -1),
                portMatcher = url.match(/:\d+/),
                port = portMatcher && portMatcher[0].slice(1),
                host = url.match(/\/\/(\w+\.)?\w+\.\w+/)[0].slice(2);

            if (!port) {
                port = (protocol === 'https') ? '443' : '80';
            }

            return protocol + '://' + host + ':' + port;
        }

        return getOriginOfAbsUrl(isAbs ? url : $window.location.href);
    };

    Object.defineProperties(this, {
        origin: {
            get: function() {
                return this.originOf($window.location.href);
            }
        }
    });
};

},{}]},{},[17])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvam9zaG1pbnpuZXIvRG9jdW1lbnRzL0NpbmVtYTYvYzZlbWJlZC9ub2RlX21vZHVsZXMvZ3J1bnQtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2pvc2htaW56bmVyL0RvY3VtZW50cy9DaW5lbWE2L2M2ZW1iZWQvZXh0L21vZGVybml6ci5jdXN0b20uNzE3NDcuanMiLCIvVXNlcnMvam9zaG1pbnpuZXIvRG9jdW1lbnRzL0NpbmVtYTYvYzZlbWJlZC9saWIvQnJvd3NlckluZm8uanMiLCIvVXNlcnMvam9zaG1pbnpuZXIvRG9jdW1lbnRzL0NpbmVtYTYvYzZlbWJlZC9saWIvRXhwZXJpZW5jZS5qcyIsIi9Vc2Vycy9qb3NobWluem5lci9Eb2N1bWVudHMvQ2luZW1hNi9jNmVtYmVkL2xpYi9Qb3N0TWVzc2FnZS5qcyIsIi9Vc2Vycy9qb3NobWluem5lci9Eb2N1bWVudHMvQ2luZW1hNi9jNmVtYmVkL2xpYi9Vc2VyQWdlbnQuanMiLCIvVXNlcnMvam9zaG1pbnpuZXIvRG9jdW1lbnRzL0NpbmVtYTYvYzZlbWJlZC9saWIvYzZhamF4L0M2QUpBWC5qcyIsIi9Vc2Vycy9qb3NobWluem5lci9Eb2N1bWVudHMvQ2luZW1hNi9jNmVtYmVkL2xpYi9jNmFqYXgvbGliL3hkci5qcyIsIi9Vc2Vycy9qb3NobWluem5lci9Eb2N1bWVudHMvQ2luZW1hNi9jNmVtYmVkL2xpYi9jNmFqYXgvbGliL3hoci5qcyIsIi9Vc2Vycy9qb3NobWluem5lci9Eb2N1bWVudHMvQ2luZW1hNi9jNmVtYmVkL2xpYi9jNmRiL0M2REIuanMiLCIvVXNlcnMvam9zaG1pbnpuZXIvRG9jdW1lbnRzL0NpbmVtYTYvYzZlbWJlZC9saWIvYzZkYi9hZGFwdGVycy9GaXh0dXJlLmpzIiwiL1VzZXJzL2pvc2htaW56bmVyL0RvY3VtZW50cy9DaW5lbWE2L2M2ZW1iZWQvbm9kZV9tb2R1bGVzL2FzRXZlbnRlZC9hc2V2ZW50ZWQuanMiLCIvVXNlcnMvam9zaG1pbnpuZXIvRG9jdW1lbnRzL0NpbmVtYTYvYzZlbWJlZC9ub2RlX21vZHVsZXMvZ3J1bnQtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvaW5zZXJ0LW1vZHVsZS1nbG9iYWxzL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCIvVXNlcnMvam9zaG1pbnpuZXIvRG9jdW1lbnRzL0NpbmVtYTYvYzZlbWJlZC9ub2RlX21vZHVsZXMvcS9xLmpzIiwiL1VzZXJzL2pvc2htaW56bmVyL0RvY3VtZW50cy9DaW5lbWE2L2M2ZW1iZWQvc3JjL0NvbmZpZy5qcyIsIi9Vc2Vycy9qb3NobWluem5lci9Eb2N1bWVudHMvQ2luZW1hNi9jNmVtYmVkL3NyYy9hcHAuanMiLCIvVXNlcnMvam9zaG1pbnpuZXIvRG9jdW1lbnRzL0NpbmVtYTYvYzZlbWJlZC9zcmMvbWFpbi5qcyIsIi9Vc2Vycy9qb3NobWluem5lci9Eb2N1bWVudHMvQ2luZW1hNi9jNmVtYmVkL3NyYy91dGlscy9Mb2NhdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDajVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbihmdW5jdGlvbiBicm93c2VyaWZ5U2hpbShtb2R1bGUsIGV4cG9ydHMsIGRlZmluZSwgYnJvd3NlcmlmeV9zaGltX19kZWZpbmVfX21vZHVsZV9fZXhwb3J0X18pIHtcbi8qIE1vZGVybml6ciAyLjYuMyAoQ3VzdG9tIEJ1aWxkKSB8IE1JVCAmIEJTRFxyXG4gKiBCdWlsZDogaHR0cDovL21vZGVybml6ci5jb20vZG93bmxvYWQvIy1jYW52YXMtbG9jYWxzdG9yYWdlLXRvdWNoLXByZWZpeGVkLXRlc3RzdHlsZXMtdGVzdHByb3AtdGVzdGFsbHByb3BzLXByZWZpeGVzLWRvbXByZWZpeGVzLWZ1bGxzY3JlZW5fYXBpLWltZ193ZWJwLWxvYWRcclxuICovXHJcbjt3aW5kb3cuTW9kZXJuaXpyPWZ1bmN0aW9uKGEsYixjKXtmdW5jdGlvbiB5KGEpe2kuY3NzVGV4dD1hfWZ1bmN0aW9uIHooYSxiKXtyZXR1cm4geShsLmpvaW4oYStcIjtcIikrKGJ8fFwiXCIpKX1mdW5jdGlvbiBBKGEsYil7cmV0dXJuIHR5cGVvZiBhPT09Yn1mdW5jdGlvbiBCKGEsYil7cmV0dXJuISF+KFwiXCIrYSkuaW5kZXhPZihiKX1mdW5jdGlvbiBDKGEsYil7Zm9yKHZhciBkIGluIGEpe3ZhciBlPWFbZF07aWYoIUIoZSxcIi1cIikmJmlbZV0hPT1jKXJldHVybiBiPT1cInBmeFwiP2U6ITB9cmV0dXJuITF9ZnVuY3Rpb24gRChhLGIsZCl7Zm9yKHZhciBlIGluIGEpe3ZhciBmPWJbYVtlXV07aWYoZiE9PWMpcmV0dXJuIGQ9PT0hMT9hW2VdOkEoZixcImZ1bmN0aW9uXCIpP2YuYmluZChkfHxiKTpmfXJldHVybiExfWZ1bmN0aW9uIEUoYSxiLGMpe3ZhciBkPWEuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkrYS5zbGljZSgxKSxlPShhK1wiIFwiK24uam9pbihkK1wiIFwiKStkKS5zcGxpdChcIiBcIik7cmV0dXJuIEEoYixcInN0cmluZ1wiKXx8QShiLFwidW5kZWZpbmVkXCIpP0MoZSxiKTooZT0oYStcIiBcIitvLmpvaW4oZCtcIiBcIikrZCkuc3BsaXQoXCIgXCIpLEQoZSxiLGMpKX12YXIgZD1cIjIuNi4zXCIsZT17fSxmPWIuZG9jdW1lbnRFbGVtZW50LGc9XCJtb2Rlcm5penJcIixoPWIuY3JlYXRlRWxlbWVudChnKSxpPWguc3R5bGUsaixrPXt9LnRvU3RyaW5nLGw9XCIgLXdlYmtpdC0gLW1vei0gLW8tIC1tcy0gXCIuc3BsaXQoXCIgXCIpLG09XCJXZWJraXQgTW96IE8gbXNcIixuPW0uc3BsaXQoXCIgXCIpLG89bS50b0xvd2VyQ2FzZSgpLnNwbGl0KFwiIFwiKSxwPXt9LHE9e30scj17fSxzPVtdLHQ9cy5zbGljZSx1LHY9ZnVuY3Rpb24oYSxjLGQsZSl7dmFyIGgsaSxqLGssbD1iLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiksbT1iLmJvZHksbj1tfHxiLmNyZWF0ZUVsZW1lbnQoXCJib2R5XCIpO2lmKHBhcnNlSW50KGQsMTApKXdoaWxlKGQtLSlqPWIuY3JlYXRlRWxlbWVudChcImRpdlwiKSxqLmlkPWU/ZVtkXTpnKyhkKzEpLGwuYXBwZW5kQ2hpbGQoaik7cmV0dXJuIGg9W1wiJiMxNzM7XCIsJzxzdHlsZSBpZD1cInMnLGcsJ1wiPicsYSxcIjwvc3R5bGU+XCJdLmpvaW4oXCJcIiksbC5pZD1nLChtP2w6bikuaW5uZXJIVE1MKz1oLG4uYXBwZW5kQ2hpbGQobCksbXx8KG4uc3R5bGUuYmFja2dyb3VuZD1cIlwiLG4uc3R5bGUub3ZlcmZsb3c9XCJoaWRkZW5cIixrPWYuc3R5bGUub3ZlcmZsb3csZi5zdHlsZS5vdmVyZmxvdz1cImhpZGRlblwiLGYuYXBwZW5kQ2hpbGQobikpLGk9YyhsLGEpLG0/bC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGwpOihuLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobiksZi5zdHlsZS5vdmVyZmxvdz1rKSwhIWl9LHc9e30uaGFzT3duUHJvcGVydHkseDshQSh3LFwidW5kZWZpbmVkXCIpJiYhQSh3LmNhbGwsXCJ1bmRlZmluZWRcIik/eD1mdW5jdGlvbihhLGIpe3JldHVybiB3LmNhbGwoYSxiKX06eD1mdW5jdGlvbihhLGIpe3JldHVybiBiIGluIGEmJkEoYS5jb25zdHJ1Y3Rvci5wcm90b3R5cGVbYl0sXCJ1bmRlZmluZWRcIil9LEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kfHwoRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQ9ZnVuY3Rpb24oYil7dmFyIGM9dGhpcztpZih0eXBlb2YgYyE9XCJmdW5jdGlvblwiKXRocm93IG5ldyBUeXBlRXJyb3I7dmFyIGQ9dC5jYWxsKGFyZ3VtZW50cywxKSxlPWZ1bmN0aW9uKCl7aWYodGhpcyBpbnN0YW5jZW9mIGUpe3ZhciBhPWZ1bmN0aW9uKCl7fTthLnByb3RvdHlwZT1jLnByb3RvdHlwZTt2YXIgZj1uZXcgYSxnPWMuYXBwbHkoZixkLmNvbmNhdCh0LmNhbGwoYXJndW1lbnRzKSkpO3JldHVybiBPYmplY3QoZyk9PT1nP2c6Zn1yZXR1cm4gYy5hcHBseShiLGQuY29uY2F0KHQuY2FsbChhcmd1bWVudHMpKSl9O3JldHVybiBlfSkscC5jYW52YXM9ZnVuY3Rpb24oKXt2YXIgYT1iLmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7cmV0dXJuISFhLmdldENvbnRleHQmJiEhYS5nZXRDb250ZXh0KFwiMmRcIil9LHAudG91Y2g9ZnVuY3Rpb24oKXt2YXIgYztyZXR1cm5cIm9udG91Y2hzdGFydFwiaW4gYXx8YS5Eb2N1bWVudFRvdWNoJiZiIGluc3RhbmNlb2YgRG9jdW1lbnRUb3VjaD9jPSEwOnYoW1wiQG1lZGlhIChcIixsLmpvaW4oXCJ0b3VjaC1lbmFibGVkKSwoXCIpLGcsXCIpXCIsXCJ7I21vZGVybml6cnt0b3A6OXB4O3Bvc2l0aW9uOmFic29sdXRlfX1cIl0uam9pbihcIlwiKSxmdW5jdGlvbihhKXtjPWEub2Zmc2V0VG9wPT09OX0pLGN9LHAubG9jYWxzdG9yYWdlPWZ1bmN0aW9uKCl7dHJ5e3JldHVybiBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShnLGcpLGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGcpLCEwfWNhdGNoKGEpe3JldHVybiExfX07Zm9yKHZhciBGIGluIHApeChwLEYpJiYodT1GLnRvTG93ZXJDYXNlKCksZVt1XT1wW0ZdKCkscy5wdXNoKChlW3VdP1wiXCI6XCJuby1cIikrdSkpO3JldHVybiBlLmFkZFRlc3Q9ZnVuY3Rpb24oYSxiKXtpZih0eXBlb2YgYT09XCJvYmplY3RcIilmb3IodmFyIGQgaW4gYSl4KGEsZCkmJmUuYWRkVGVzdChkLGFbZF0pO2Vsc2V7YT1hLnRvTG93ZXJDYXNlKCk7aWYoZVthXSE9PWMpcmV0dXJuIGU7Yj10eXBlb2YgYj09XCJmdW5jdGlvblwiP2IoKTpiLHR5cGVvZiBlbmFibGVDbGFzc2VzIT1cInVuZGVmaW5lZFwiJiZlbmFibGVDbGFzc2VzJiYoZi5jbGFzc05hbWUrPVwiIFwiKyhiP1wiXCI6XCJuby1cIikrYSksZVthXT1ifXJldHVybiBlfSx5KFwiXCIpLGg9aj1udWxsLGUuX3ZlcnNpb249ZCxlLl9wcmVmaXhlcz1sLGUuX2RvbVByZWZpeGVzPW8sZS5fY3Nzb21QcmVmaXhlcz1uLGUudGVzdFByb3A9ZnVuY3Rpb24oYSl7cmV0dXJuIEMoW2FdKX0sZS50ZXN0QWxsUHJvcHM9RSxlLnRlc3RTdHlsZXM9dixlLnByZWZpeGVkPWZ1bmN0aW9uKGEsYixjKXtyZXR1cm4gYj9FKGEsYixjKTpFKGEsXCJwZnhcIil9LGV9KHRoaXMsdGhpcy5kb2N1bWVudCksZnVuY3Rpb24oYSxiLGMpe2Z1bmN0aW9uIGQoYSl7cmV0dXJuXCJbb2JqZWN0IEZ1bmN0aW9uXVwiPT1vLmNhbGwoYSl9ZnVuY3Rpb24gZShhKXtyZXR1cm5cInN0cmluZ1wiPT10eXBlb2YgYX1mdW5jdGlvbiBmKCl7fWZ1bmN0aW9uIGcoYSl7cmV0dXJuIWF8fFwibG9hZGVkXCI9PWF8fFwiY29tcGxldGVcIj09YXx8XCJ1bmluaXRpYWxpemVkXCI9PWF9ZnVuY3Rpb24gaCgpe3ZhciBhPXAuc2hpZnQoKTtxPTEsYT9hLnQ/bShmdW5jdGlvbigpeyhcImNcIj09YS50P0IuaW5qZWN0Q3NzOkIuaW5qZWN0SnMpKGEucywwLGEuYSxhLngsYS5lLDEpfSwwKTooYSgpLGgoKSk6cT0wfWZ1bmN0aW9uIGkoYSxjLGQsZSxmLGksail7ZnVuY3Rpb24gayhiKXtpZighbyYmZyhsLnJlYWR5U3RhdGUpJiYodS5yPW89MSwhcSYmaCgpLGwub25sb2FkPWwub25yZWFkeXN0YXRlY2hhbmdlPW51bGwsYikpe1wiaW1nXCIhPWEmJm0oZnVuY3Rpb24oKXt0LnJlbW92ZUNoaWxkKGwpfSw1MCk7Zm9yKHZhciBkIGluIHlbY10peVtjXS5oYXNPd25Qcm9wZXJ0eShkKSYmeVtjXVtkXS5vbmxvYWQoKX19dmFyIGo9anx8Qi5lcnJvclRpbWVvdXQsbD1iLmNyZWF0ZUVsZW1lbnQoYSksbz0wLHI9MCx1PXt0OmQsczpjLGU6ZixhOmkseDpqfTsxPT09eVtjXSYmKHI9MSx5W2NdPVtdKSxcIm9iamVjdFwiPT1hP2wuZGF0YT1jOihsLnNyYz1jLGwudHlwZT1hKSxsLndpZHRoPWwuaGVpZ2h0PVwiMFwiLGwub25lcnJvcj1sLm9ubG9hZD1sLm9ucmVhZHlzdGF0ZWNoYW5nZT1mdW5jdGlvbigpe2suY2FsbCh0aGlzLHIpfSxwLnNwbGljZShlLDAsdSksXCJpbWdcIiE9YSYmKHJ8fDI9PT15W2NdPyh0Lmluc2VydEJlZm9yZShsLHM/bnVsbDpuKSxtKGssaikpOnlbY10ucHVzaChsKSl9ZnVuY3Rpb24gaihhLGIsYyxkLGYpe3JldHVybiBxPTAsYj1ifHxcImpcIixlKGEpP2koXCJjXCI9PWI/djp1LGEsYix0aGlzLmkrKyxjLGQsZik6KHAuc3BsaWNlKHRoaXMuaSsrLDAsYSksMT09cC5sZW5ndGgmJmgoKSksdGhpc31mdW5jdGlvbiBrKCl7dmFyIGE9QjtyZXR1cm4gYS5sb2FkZXI9e2xvYWQ6aixpOjB9LGF9dmFyIGw9Yi5kb2N1bWVudEVsZW1lbnQsbT1hLnNldFRpbWVvdXQsbj1iLmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpWzBdLG89e30udG9TdHJpbmcscD1bXSxxPTAscj1cIk1vekFwcGVhcmFuY2VcImluIGwuc3R5bGUscz1yJiYhIWIuY3JlYXRlUmFuZ2UoKS5jb21wYXJlTm9kZSx0PXM/bDpuLnBhcmVudE5vZGUsbD1hLm9wZXJhJiZcIltvYmplY3QgT3BlcmFdXCI9PW8uY2FsbChhLm9wZXJhKSxsPSEhYi5hdHRhY2hFdmVudCYmIWwsdT1yP1wib2JqZWN0XCI6bD9cInNjcmlwdFwiOlwiaW1nXCIsdj1sP1wic2NyaXB0XCI6dSx3PUFycmF5LmlzQXJyYXl8fGZ1bmN0aW9uKGEpe3JldHVyblwiW29iamVjdCBBcnJheV1cIj09by5jYWxsKGEpfSx4PVtdLHk9e30sej17dGltZW91dDpmdW5jdGlvbihhLGIpe3JldHVybiBiLmxlbmd0aCYmKGEudGltZW91dD1iWzBdKSxhfX0sQSxCO0I9ZnVuY3Rpb24oYSl7ZnVuY3Rpb24gYihhKXt2YXIgYT1hLnNwbGl0KFwiIVwiKSxiPXgubGVuZ3RoLGM9YS5wb3AoKSxkPWEubGVuZ3RoLGM9e3VybDpjLG9yaWdVcmw6YyxwcmVmaXhlczphfSxlLGYsZztmb3IoZj0wO2Y8ZDtmKyspZz1hW2ZdLnNwbGl0KFwiPVwiKSwoZT16W2cuc2hpZnQoKV0pJiYoYz1lKGMsZykpO2ZvcihmPTA7ZjxiO2YrKyljPXhbZl0oYyk7cmV0dXJuIGN9ZnVuY3Rpb24gZyhhLGUsZixnLGgpe3ZhciBpPWIoYSksaj1pLmF1dG9DYWxsYmFjaztpLnVybC5zcGxpdChcIi5cIikucG9wKCkuc3BsaXQoXCI/XCIpLnNoaWZ0KCksaS5ieXBhc3N8fChlJiYoZT1kKGUpP2U6ZVthXXx8ZVtnXXx8ZVthLnNwbGl0KFwiL1wiKS5wb3AoKS5zcGxpdChcIj9cIilbMF1dKSxpLmluc3RlYWQ/aS5pbnN0ZWFkKGEsZSxmLGcsaCk6KHlbaS51cmxdP2kubm9leGVjPSEwOnlbaS51cmxdPTEsZi5sb2FkKGkudXJsLGkuZm9yY2VDU1N8fCFpLmZvcmNlSlMmJlwiY3NzXCI9PWkudXJsLnNwbGl0KFwiLlwiKS5wb3AoKS5zcGxpdChcIj9cIikuc2hpZnQoKT9cImNcIjpjLGkubm9leGVjLGkuYXR0cnMsaS50aW1lb3V0KSwoZChlKXx8ZChqKSkmJmYubG9hZChmdW5jdGlvbigpe2soKSxlJiZlKGkub3JpZ1VybCxoLGcpLGomJmooaS5vcmlnVXJsLGgsZykseVtpLnVybF09Mn0pKSl9ZnVuY3Rpb24gaChhLGIpe2Z1bmN0aW9uIGMoYSxjKXtpZihhKXtpZihlKGEpKWN8fChqPWZ1bmN0aW9uKCl7dmFyIGE9W10uc2xpY2UuY2FsbChhcmd1bWVudHMpO2suYXBwbHkodGhpcyxhKSxsKCl9KSxnKGEsaixiLDAsaCk7ZWxzZSBpZihPYmplY3QoYSk9PT1hKWZvcihuIGluIG09ZnVuY3Rpb24oKXt2YXIgYj0wLGM7Zm9yKGMgaW4gYSlhLmhhc093blByb3BlcnR5KGMpJiZiKys7cmV0dXJuIGJ9KCksYSlhLmhhc093blByb3BlcnR5KG4pJiYoIWMmJiEtLW0mJihkKGopP2o9ZnVuY3Rpb24oKXt2YXIgYT1bXS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7ay5hcHBseSh0aGlzLGEpLGwoKX06altuXT1mdW5jdGlvbihhKXtyZXR1cm4gZnVuY3Rpb24oKXt2YXIgYj1bXS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7YSYmYS5hcHBseSh0aGlzLGIpLGwoKX19KGtbbl0pKSxnKGFbbl0saixiLG4saCkpfWVsc2UhYyYmbCgpfXZhciBoPSEhYS50ZXN0LGk9YS5sb2FkfHxhLmJvdGgsaj1hLmNhbGxiYWNrfHxmLGs9aixsPWEuY29tcGxldGV8fGYsbSxuO2MoaD9hLnllcDphLm5vcGUsISFpKSxpJiZjKGkpfXZhciBpLGosbD10aGlzLnllcG5vcGUubG9hZGVyO2lmKGUoYSkpZyhhLDAsbCwwKTtlbHNlIGlmKHcoYSkpZm9yKGk9MDtpPGEubGVuZ3RoO2krKylqPWFbaV0sZShqKT9nKGosMCxsLDApOncoaik/QihqKTpPYmplY3Qoaik9PT1qJiZoKGosbCk7ZWxzZSBPYmplY3QoYSk9PT1hJiZoKGEsbCl9LEIuYWRkUHJlZml4PWZ1bmN0aW9uKGEsYil7elthXT1ifSxCLmFkZEZpbHRlcj1mdW5jdGlvbihhKXt4LnB1c2goYSl9LEIuZXJyb3JUaW1lb3V0PTFlNCxudWxsPT1iLnJlYWR5U3RhdGUmJmIuYWRkRXZlbnRMaXN0ZW5lciYmKGIucmVhZHlTdGF0ZT1cImxvYWRpbmdcIixiLmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsQT1mdW5jdGlvbigpe2IucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixBLDApLGIucmVhZHlTdGF0ZT1cImNvbXBsZXRlXCJ9LDApKSxhLnllcG5vcGU9aygpLGEueWVwbm9wZS5leGVjdXRlU3RhY2s9aCxhLnllcG5vcGUuaW5qZWN0SnM9ZnVuY3Rpb24oYSxjLGQsZSxpLGope3ZhciBrPWIuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKSxsLG8sZT1lfHxCLmVycm9yVGltZW91dDtrLnNyYz1hO2ZvcihvIGluIGQpay5zZXRBdHRyaWJ1dGUobyxkW29dKTtjPWo/aDpjfHxmLGsub25yZWFkeXN0YXRlY2hhbmdlPWsub25sb2FkPWZ1bmN0aW9uKCl7IWwmJmcoay5yZWFkeVN0YXRlKSYmKGw9MSxjKCksay5vbmxvYWQ9ay5vbnJlYWR5c3RhdGVjaGFuZ2U9bnVsbCl9LG0oZnVuY3Rpb24oKXtsfHwobD0xLGMoMSkpfSxlKSxpP2sub25sb2FkKCk6bi5wYXJlbnROb2RlLmluc2VydEJlZm9yZShrLG4pfSxhLnllcG5vcGUuaW5qZWN0Q3NzPWZ1bmN0aW9uKGEsYyxkLGUsZyxpKXt2YXIgZT1iLmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIpLGosYz1pP2g6Y3x8ZjtlLmhyZWY9YSxlLnJlbD1cInN0eWxlc2hlZXRcIixlLnR5cGU9XCJ0ZXh0L2Nzc1wiO2ZvcihqIGluIGQpZS5zZXRBdHRyaWJ1dGUoaixkW2pdKTtnfHwobi5wYXJlbnROb2RlLmluc2VydEJlZm9yZShlLG4pLG0oYywwKSl9fSh0aGlzLGRvY3VtZW50KSxNb2Rlcm5penIubG9hZD1mdW5jdGlvbigpe3llcG5vcGUuYXBwbHkod2luZG93LFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLDApKX0sZnVuY3Rpb24oKXt2YXIgYT1uZXcgSW1hZ2U7YS5vbmVycm9yPWZ1bmN0aW9uKCl7TW9kZXJuaXpyLmFkZFRlc3QoXCJ3ZWJwXCIsITEpfSxhLm9ubG9hZD1mdW5jdGlvbigpe01vZGVybml6ci5hZGRUZXN0KFwid2VicFwiLGZ1bmN0aW9uKCl7cmV0dXJuIGEud2lkdGg9PTF9KX0sYS5zcmM9XCJkYXRhOmltYWdlL3dlYnA7YmFzZTY0LFVrbEdSaXdBQUFCWFJVSlFWbEE0SUNBQUFBQVVBZ0NkQVNvQkFBRUFMLzMrLzMrQ0FCL0FBQUZ6ck5zQUFQNVFBQUFBQUE9PVwifSgpLE1vZGVybml6ci5hZGRUZXN0KFwiZnVsbHNjcmVlblwiLGZ1bmN0aW9uKCl7Zm9yKHZhciBhPTA7YTxNb2Rlcm5penIuX2RvbVByZWZpeGVzLmxlbmd0aDthKyspaWYoZG9jdW1lbnRbTW9kZXJuaXpyLl9kb21QcmVmaXhlc1thXS50b0xvd2VyQ2FzZSgpK1wiQ2FuY2VsRnVsbFNjcmVlblwiXSlyZXR1cm4hMDtyZXR1cm4hIWRvY3VtZW50LmNhbmNlbEZ1bGxTY3JlZW58fCExfSk7XG47IGJyb3dzZXJpZnlfc2hpbV9fZGVmaW5lX19tb2R1bGVfX2V4cG9ydF9fKHR5cGVvZiBNb2Rlcm5penIgIT0gXCJ1bmRlZmluZWRcIiA/IE1vZGVybml6ciA6IHdpbmRvdy5Nb2Rlcm5penIpO1xuXG59KS5jYWxsKGdsb2JhbCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgZnVuY3Rpb24gZGVmaW5lRXhwb3J0KGV4KSB7IG1vZHVsZS5leHBvcnRzID0gZXg7IH0pO1xuXG59KS5jYWxsKHRoaXMsdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGVwcykge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBtb2Rlcm5penIgPSBkZXBzLm1vZGVybml6cixcbiAgICAgICAgJHdpbmRvdyA9IGRlcHMud2luZG93LFxuICAgICAgICB1c2VyQWdlbnQgPSBkZXBzLnVzZXJBZ2VudDtcblxuICAgIHRoaXMuZ2VuZXJhdGVQcm9maWxlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBwcm9maWxlID0ge30sXG4gICAgICAgICAgICBzY3JlZW4gPSAkd2luZG93LnNjcmVlbjtcblxuICAgICAgICBwcm9maWxlLmlubGluZVZpZGVvID0gISh1c2VyQWdlbnQuZGV2aWNlLmlzSVBob25lKCkgfHwgdXNlckFnZW50LmRldmljZS5pc0lQb2QoKSB8fCB1c2VyQWdlbnQuYXBwLm5hbWUgPT09ICdzaWxrJyk7XG5cbiAgICAgICAgcHJvZmlsZS5tdWx0aVBsYXllciA9ICEodXNlckFnZW50LmRldmljZS5pc0lPUygpIHx8IHVzZXJBZ2VudC5hcHAubmFtZSA9PT0gJ3NpbGsnKTtcblxuICAgICAgICBwcm9maWxlLmNhbnZhc1ZpZGVvID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIG1hY09TWFZlcnNpb24gPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2ZXJzaW9uID0gKHVzZXJBZ2VudC5vcy5uYW1lID09PSAnbWFjJyAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHVzZXJBZ2VudC5vcy52ZXJzaW9uKSAmJlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHVzZXJBZ2VudC5vcy52ZXJzaW9uLm1hdGNoKC8oXFxkK1xcLlxcZCspLykpKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICh2ZXJzaW9uIHx8IG51bGwpICYmIHZlcnNpb25bMF0gJiYgdmVyc2lvblswXS5zcGxpdCgnLicpO1xuICAgICAgICAgICAgICAgIH0pKCksXG4gICAgICAgICAgICAgICAgYmFkVmVyc2lvbiA9IHRydWU7XG5cbiAgICAgICAgICAgIGlmIChtYWNPU1hWZXJzaW9uKXtcbiAgICAgICAgICAgICAgICBtYWNPU1hWZXJzaW9uWzBdID0gcGFyc2VJbnQobWFjT1NYVmVyc2lvblswXSwxMCk7XG4gICAgICAgICAgICAgICAgbWFjT1NYVmVyc2lvblsxXSA9IHBhcnNlSW50KG1hY09TWFZlcnNpb25bMV0sMTApO1xuICAgICAgICAgICAgICAgIGlmIChtYWNPU1hWZXJzaW9uWzBdIDwgMTApIHtcbiAgICAgICAgICAgICAgICAgICAgYmFkVmVyc2lvbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0gZWxzZVxuICAgICAgICAgICAgICAgIGlmICgobWFjT1NYVmVyc2lvblswXSA9PT0gMTApICYmIChtYWNPU1hWZXJzaW9uWzFdIDwgNykpe1xuICAgICAgICAgICAgICAgICAgICBiYWRWZXJzaW9uID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gISh1c2VyQWdlbnQuZGV2aWNlLmlzSU9TKCkgfHxcbiAgICAgICAgICAgICAgICAgICAgdXNlckFnZW50LmFwcC5uYW1lID09PSAnc2lsaycgfHxcbiAgICAgICAgICAgICAgICAgICAgdXNlckFnZW50LmFwcC5uYW1lID09PSAnc2FmYXJpJyAmJiBiYWRWZXJzaW9uKTtcbiAgICAgICAgfSkoKTtcblxuICAgICAgICBwcm9maWxlLnRvdWNoID0gbW9kZXJuaXpyICYmIG1vZGVybml6ci50b3VjaDtcblxuICAgICAgICBwcm9maWxlLmNhbnZhcyA9IG1vZGVybml6ciAmJiBtb2Rlcm5penIuY2FudmFzO1xuXG4gICAgICAgIHByb2ZpbGUubG9jYWxzdG9yYWdlID0gbW9kZXJuaXpyICYmIG1vZGVybml6ci5sb2NhbHN0b3JhZ2U7XG5cbiAgICAgICAgcHJvZmlsZS5yYWYgPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgbWFqb3JJT1NWZXJzaW9uO1xuXG4gICAgICAgICAgICBpZiAodXNlckFnZW50LmRldmljZS5pc0lPUygpKSB7XG4gICAgICAgICAgICAgICAgbWFqb3JJT1NWZXJzaW9uID0gdXNlckFnZW50Lm9zLnZlcnNpb24uc3BsaXQoJy4nKVswXTtcblxuICAgICAgICAgICAgICAgIGlmIChtYWpvcklPU1ZlcnNpb24gPCA3KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiBtb2Rlcm5penIgJiYgISFtb2Rlcm5penIucHJlZml4ZWQoJ3JlcXVlc3RBbmltYXRpb25GcmFtZScsICR3aW5kb3cpO1xuICAgICAgICB9KSgpO1xuXG4gICAgICAgIHByb2ZpbGUucmVzb2x1dGlvbiA9IChzY3JlZW4ud2lkdGggKyAneCcgKyBzY3JlZW4uaGVpZ2h0KTtcblxuICAgICAgICBwcm9maWxlLmZsYXNoID0gKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB2YXIgZmxhc2hPYmplY3QgPSBuZXcgJHdpbmRvdy5BY3RpdmVYT2JqZWN0KCdTaG9ja3dhdmVGbGFzaC5TaG9ja3dhdmVGbGFzaCcpO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuICEhZmxhc2hPYmplY3Q7XG4gICAgICAgICAgICB9IGNhdGNoKGUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gISEkd2luZG93Lm5hdmlnYXRvci5taW1lVHlwZXNbJ2FwcGxpY2F0aW9uL3gtc2hvY2t3YXZlLWZsYXNoJ107XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pKCk7XG5cbiAgICAgICAgcHJvZmlsZS53ZWJwID0gbW9kZXJuaXpyLndlYnA7XG5cbiAgICAgICAgcHJvZmlsZS5kZXZpY2UgPSAoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgdG91Y2ggPSBwcm9maWxlLnRvdWNoLFxuICAgICAgICAgICAgICAgIHBpeGVscyA9IHNjcmVlbi53aWR0aCAqIHNjcmVlbi5oZWlnaHQ7XG5cbiAgICAgICAgICAgIGlmIChwaXhlbHMgPD0gNTE4NDAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICdwaG9uZSc7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHBpeGVscyA8PSA3ODY0MzIpIHtcbiAgICAgICAgICAgICAgICBpZiAodG91Y2gpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICd0YWJsZXQnO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAnbmV0Ym9vayc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJ2Rlc2t0b3AnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KCkpO1xuXG4gICAgICAgIHByb2ZpbGUuY29ycyA9IG1vZGVybml6ci5jb3JzO1xuXG4gICAgICAgIHByb2ZpbGUuYXV0b3BsYXkgPSAhdXNlckFnZW50LmRldmljZS5pc01vYmlsZSgpO1xuXG4gICAgICAgIHJldHVybiBwcm9maWxlO1xuICAgIH07XG5cbiAgICB0aGlzLnByb2ZpbGUgPSB0aGlzLmdlbmVyYXRlUHJvZmlsZSgpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGVwcykge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBwb3N0bWVzc2FnZSA9IGRlcHMucG9zdG1lc3NhZ2UsXG4gICAgICAgIHEgPSBkZXBzLnEsXG4gICAgICAgIGJyb3dzZXJJbmZvID0gZGVwcy5icm93c2VySW5mbztcblxuICAgIHZhciBfcHJpdmF0ZSA9IHt9O1xuXG4gICAgX3ByaXZhdGUuc2Vzc2lvbnMgPSB7fTtcbiAgICBfcHJpdmF0ZS5kZWNvcmF0ZVNlc3Npb24gPSBmdW5jdGlvbihzZXNzaW9uLCBleHBlcmllbmNlKSB7XG4gICAgICAgIHNlc3Npb24uZXhwZXJpZW5jZSA9IGV4cGVyaWVuY2U7XG4gICAgICAgIHNlc3Npb24ucmVhZHkgPSBmYWxzZTtcbiAgICB9O1xuXG4gICAgLyogQHB1YmxpYyAqL1xuXG4gICAgdGhpcy5nZXRTZXNzaW9uID0gZnVuY3Rpb24oZXhwSWQpIHtcbiAgICAgICAgcmV0dXJuIChfcHJpdmF0ZS5zZXNzaW9uc1tleHBJZF0gPSBfcHJpdmF0ZS5zZXNzaW9uc1tleHBJZF0gfHwgcS5kZWZlcigpKS5wcm9taXNlO1xuICAgIH07XG5cbiAgICAvKiBAcHJpdmF0ZSAqL1xuXG4gICAgdGhpcy5yZWdpc3RlckV4cGVyaWVuY2UgPSBmdW5jdGlvbihleHBlcmllbmNlLCBleHBXaW5kb3cpIHtcbiAgICAgICAgdmFyIHNlc3Npb24gPSBwb3N0bWVzc2FnZS5jcmVhdGVTZXNzaW9uKGV4cFdpbmRvdyksXG4gICAgICAgICAgICBleHBJZCA9IGV4cGVyaWVuY2UuaWQ7XG5cbiAgICAgICAgX3ByaXZhdGUuZGVjb3JhdGVTZXNzaW9uKHNlc3Npb24sIGV4cGVyaWVuY2UpO1xuXG4gICAgICAgIHNlc3Npb24ub25jZSgnaGFuZHNoYWtlJywgZnVuY3Rpb24oZGF0YSwgcmVzcG9uZCkge1xuICAgICAgICAgICAgcmVzcG9uZCh7XG4gICAgICAgICAgICAgICAgc3VjY2VzczogdHJ1ZSxcbiAgICAgICAgICAgICAgICBhcHBEYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGV4cGVyaWVuY2U6IGV4cGVyaWVuY2UsXG4gICAgICAgICAgICAgICAgICAgIHByb2ZpbGU6IGJyb3dzZXJJbmZvLnByb2ZpbGVcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgc2Vzc2lvbi5vbmNlKCdyZWFkeScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2Vzc2lvbi5yZWFkeSA9IHRydWU7XG4gICAgICAgICAgICAoX3ByaXZhdGUuc2Vzc2lvbnNbZXhwSWRdID0gX3ByaXZhdGUuc2Vzc2lvbnNbZXhwSWRdIHx8IHEuZGVmZXIoKSkucmVzb2x2ZShzZXNzaW9uKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHNlc3Npb247XG4gICAgfTtcblxuICAgIHRoaXMuZGVyZWdpc3RlckV4cGVyaWVuY2UgPSBmdW5jdGlvbihleHBJZCkge1xuICAgICAgICB2YXIgc2Vzc2lvbiA9IF9wcml2YXRlLnNlc3Npb25zW2V4cElkXTtcblxuICAgICAgICBwb3N0bWVzc2FnZS5kZXN0cm95U2Vzc2lvbihzZXNzaW9uLmlkKTtcblxuICAgICAgICBkZWxldGUgX3ByaXZhdGUuc2Vzc2lvbnNbZXhwSWRdO1xuICAgIH07XG5cbiAgICBpZiAod2luZG93Ll9fa2FybWFfXykgeyB0aGlzLl9wcml2YXRlID0gX3ByaXZhdGU7IH1cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRlcHMpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgYXNFdmVudGVkID0gZGVwcy5hc0V2ZW50ZWQsXG4gICAgICAgIHEgPSBkZXBzLnEsXG4gICAgICAgICR3aW5kb3cgPSBkZXBzLndpbmRvdztcblxuICAgIHZhciBzZXNzaW9uQ291bnQgPSAwLFxuICAgICAgICBzZXNzaW9ucyA9IHt9LFxuICAgICAgICBfcHJpdmF0ZSA9IHt9O1xuXG4gICAgX3ByaXZhdGUucGluZyA9IGZ1bmN0aW9uKHdpbiwgZXZlbnQsIHR5cGUsIGRhdGEpIHtcbiAgICAgICAgdmFyIG1lc3NhZ2UgPSB7IF9fYzZfXzogeyBldmVudDogZXZlbnQsIHR5cGU6IHR5cGUsIGRhdGE6IGRhdGEgfSB9O1xuXG4gICAgICAgIHdpbi5wb3N0TWVzc2FnZShKU09OLnN0cmluZ2lmeShtZXNzYWdlKSwgJyonKTtcbiAgICB9O1xuXG4gICAgX3ByaXZhdGUubmV3UmVxdWVzdElkID0gZnVuY3Rpb24oc2Vzc2lvbikge1xuICAgICAgICB2YXIgaWQgPSAwO1xuXG4gICAgICAgIHdoaWxlIChzZXNzaW9uLl9wZW5kaW5nW2lkXSkge1xuICAgICAgICAgICAgaWQrKztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBpZDtcbiAgICB9O1xuXG4gICAgX3ByaXZhdGUuZ2V0U2Vzc2lvbkJ5V2luZG93ID0gZnVuY3Rpb24od2luKSB7XG4gICAgICAgIHZhciBpZCxcbiAgICAgICAgICAgIHNlc3Npb247XG5cbiAgICAgICAgZm9yIChpZCBpbiBzZXNzaW9ucykge1xuICAgICAgICAgICAgc2Vzc2lvbiA9IHNlc3Npb25zW2lkXTtcblxuICAgICAgICAgICAgaWYgKHNlc3Npb24ud2luZG93ID09PSB3aW4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gc2Vzc2lvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBfcHJpdmF0ZS5oYW5kbGVNZXNzYWdlID0gZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIGV2ZW50RGF0YSA9IGV2ZW50LmRhdGEsXG4gICAgICAgICAgICBjNixcbiAgICAgICAgICAgIGV2ZW50TmFtZSxcbiAgICAgICAgICAgIHR5cGUsXG4gICAgICAgICAgICB0eXBlTmFtZSxcbiAgICAgICAgICAgIHR5cGVJZCxcbiAgICAgICAgICAgIGRhdGEsXG4gICAgICAgICAgICBzZXNzaW9uLFxuICAgICAgICAgICAgZG9uZTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgYzYgPSBKU09OLnBhcnNlKGV2ZW50RGF0YSkuX19jNl9fO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGM2ID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFjNikgeyByZXR1cm47IH1cblxuICAgICAgICBldmVudE5hbWUgPSBjNi5ldmVudDtcbiAgICAgICAgdHlwZSA9IGM2LnR5cGUuc3BsaXQoJzonKTtcbiAgICAgICAgdHlwZU5hbWUgPSB0eXBlWzBdO1xuICAgICAgICB0eXBlSWQgPSB0eXBlWzFdO1xuICAgICAgICBkYXRhID0gYzYuZGF0YTtcbiAgICAgICAgc2Vzc2lvbiA9IF9wcml2YXRlLmdldFNlc3Npb25CeVdpbmRvdyhldmVudC5zb3VyY2UpO1xuXG4gICAgICAgIGlmICh0eXBlTmFtZSA9PT0gJ3JlcXVlc3QnKSB7XG4gICAgICAgICAgICBkb25lID0gZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICBfcHJpdmF0ZS5waW5nKGV2ZW50LnNvdXJjZSwgZXZlbnROYW1lLCAoJ3Jlc3BvbnNlOicgKyB0eXBlSWQpLCByZXNwb25zZSk7XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICBzZXNzaW9uLnRyaWdnZXIoZXZlbnROYW1lLCBkYXRhLCBkb25lKTtcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlTmFtZSA9PT0gJ3Jlc3BvbnNlJykge1xuICAgICAgICAgICAgc2Vzc2lvbi5fcGVuZGluZ1t0eXBlSWRdLnJlc29sdmUoZGF0YSk7XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZU5hbWUgPT09ICdwaW5nJykge1xuICAgICAgICAgICAgc2Vzc2lvbi50cmlnZ2VyKGV2ZW50TmFtZSwgZGF0YSwgZnVuY3Rpb24oKSB7fSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgdGhpcy5jcmVhdGVTZXNzaW9uID0gZnVuY3Rpb24od2luKSB7XG4gICAgICAgIHZhciBzZXNzaW9uID0ge1xuICAgICAgICAgICAgaWQ6IHNlc3Npb25Db3VudCsrLFxuICAgICAgICAgICAgd2luZG93OiB3aW4sXG4gICAgICAgICAgICBfcGVuZGluZzoge30sXG5cbiAgICAgICAgICAgIHBpbmc6IGZ1bmN0aW9uKGV2ZW50LCBkYXRhKSB7XG4gICAgICAgICAgICAgICAgX3ByaXZhdGUucGluZyh0aGlzLndpbmRvdywgZXZlbnQsICdwaW5nJywgZGF0YSk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICByZXF1ZXN0OiBmdW5jdGlvbihldmVudCwgZGF0YSkge1xuICAgICAgICAgICAgICAgIHZhciBkZWZlcnJlZCA9IHEuZGVmZXIoKSxcbiAgICAgICAgICAgICAgICAgICAgaWQgPSBfcHJpdmF0ZS5uZXdSZXF1ZXN0SWQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLl9wZW5kaW5nW2lkXSA9IGRlZmVycmVkO1xuXG4gICAgICAgICAgICAgICAgX3ByaXZhdGUucGluZyh0aGlzLndpbmRvdywgZXZlbnQsICgncmVxdWVzdDonICsgaWQpLCBkYXRhKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGFzRXZlbnRlZC5jYWxsKHNlc3Npb24pO1xuXG4gICAgICAgIHNlc3Npb25zW3Nlc3Npb24uaWRdID0gc2Vzc2lvbjtcblxuICAgICAgICByZXR1cm4gc2Vzc2lvbjtcbiAgICB9O1xuXG4gICAgdGhpcy5kZXN0cm95U2Vzc2lvbiA9IGZ1bmN0aW9uKGlkKSB7XG4gICAgICAgIHZhciBzZXNzaW9uID0gc2Vzc2lvbnNbaWRdLFxuICAgICAgICAgICAgbm9vcCA9IGZ1bmN0aW9uKCkge30sXG4gICAgICAgICAgICB2YWx1ZTtcblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gc2Vzc2lvbikge1xuICAgICAgICAgICAgdmFsdWUgPSBzZXNzaW9uW2tleV07XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBzZXNzaW9uW2tleV0gPSBub29wO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZXNzaW9uW2tleV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBkZWxldGUgc2Vzc2lvbnNbaWRdO1xuICAgIH07XG5cbiAgICB0aGlzLmdldFNlc3Npb24gPSBmdW5jdGlvbihpZCkge1xuICAgICAgICByZXR1cm4gc2Vzc2lvbnNbaWRdO1xuICAgIH07XG5cbiAgICAkd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBfcHJpdmF0ZS5oYW5kbGVNZXNzYWdlLCBmYWxzZSk7XG5cbiAgICBpZiAoISF3aW5kb3cuX19rYXJtYV9fKSB7IHRoaXMuX3ByaXZhdGUgPSBfcHJpdmF0ZTsgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGVwcykge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciAkd2luZG93ID0gZGVwcy53aW5kb3c7XG5cbiAgICB2YXIgdWEgPSAkd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQsIG1hdGNoO1xuXG4gICAgdGhpcy5hcHAgPSB7XG4gICAgICAgIG5hbWUgICAgOiBudWxsLFxuICAgICAgICB2ZXJzaW9uIDogbnVsbFxuICAgIH07XG5cbiAgICB0aGlzLm9zICA9IHtcbiAgICAgICAgbmFtZSAgICA6IG51bGwsXG4gICAgICAgIHZlcnNpb24gOiBudWxsXG4gICAgfTtcblxuICAgIHRoaXMuZGV2aWNlID0ge1xuICAgICAgICBuYW1lICAgICAgICA6IG51bGwsXG4gICAgICAgIHZlcnNpb24gICAgIDogbnVsbCxcbiAgICAgICAgaXNJUGFkICAgICAgOiBmdW5jdGlvbigpIHsgcmV0dXJuICh0aGlzLm5hbWUgPT09ICdpcGFkJyk7IH0sXG4gICAgICAgIGlzSVBvZCAgICAgIDogZnVuY3Rpb24oKSB7IHJldHVybiAodGhpcy5uYW1lID09PSAnaXBvZCcpOyB9LFxuICAgICAgICBpc0lQaG9uZSAgICA6IGZ1bmN0aW9uKCkgeyByZXR1cm4gKHRoaXMubmFtZSA9PT0gJ2lwaG9uZScpOyB9LFxuICAgICAgICBpc0lPUyAgICAgICA6IGZ1bmN0aW9uKCkgeyByZXR1cm4gKHRoaXMuaXNJUGhvbmUoKSB8fCB0aGlzLmlzSVBhZCgpIHx8IHRoaXMuaXNJUG9kKCkgICAgICk7IH0sXG5cbiAgICAgICAgaXNLaW5kbGUgICAgOiBmdW5jdGlvbigpIHsgcmV0dXJuICh0aGlzLm5hbWUgPT09ICdraW5kbGUnKTsgfSxcbiAgICAgICAgaXNBbmRyb2lkICAgOiBmdW5jdGlvbigpIHsgcmV0dXJuICggdGhpcy5pc0tpbmRsZSgpIHx8ICh0aGlzLm5hbWUgPT09ICdhbmRyb2lkJykgKTsgfSxcblxuICAgICAgICBpc01vYmlsZSAgICA6IGZ1bmN0aW9uKCkgeyByZXR1cm4gKHRoaXMuaXNJT1MoKSB8fCB0aGlzLmlzQW5kcm9pZCgpKTsgfVxuICAgIH07XG5cbiAgICB0aGlzLnVzZXJBZ2VudCAgPSBudWxsO1xuXG4gICAgaWYgKCF1YSl7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbWF0Y2g9IHVhLm1hdGNoKFxuICAgICAgICAvKHNpbGt8b3BlcmF8Y2hyb21lfHNhZmFyaXxmaXJlZm94fG1zaWV8cGhhbnRvbWpzKVxcLz9cXHMqKFxcLj9cXGQrKFxcLlxcZCspKikvaSk7XG4gICAgaWYgKG1hdGNoICE9PSBudWxsKXtcbiAgICAgICAgdGhpcy5hcHAubmFtZSAgICAgPSBtYXRjaFsxXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICB0aGlzLmFwcC52ZXJzaW9uICA9IG1hdGNoWzJdO1xuXG4gICAgICAgIGlmICh0aGlzLmFwcC5uYW1lID09PSAnc2FmYXJpJyl7XG4gICAgICAgICAgICBtYXRjaCA9IHVhLm1hdGNoKC9WZXJzaW9uXFwvP1xccyooXFwuP1xcZCsoXFwuXFxkKykqKS8pO1xuICAgICAgICAgICAgaWYgKG1hdGNoICE9PSBudWxsKXtcbiAgICAgICAgICAgICAgICB0aGlzLmFwcC52ZXJzaW9uICA9IG1hdGNoWzFdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbWF0Y2ggPSB1YS5tYXRjaCggLyhrZm90fGFuZHJvaWR8aXBob25lfGlwb2R8aXBhZCkvaSApO1xuICAgIGlmIChtYXRjaCAhPT0gbnVsbCApe1xuICAgICAgICB0aGlzLmRldmljZS5uYW1lID0gbWF0Y2hbMV0udG9Mb3dlckNhc2UoKTtcbiAgICAgICAgaWYgKHRoaXMuZGV2aWNlLm5hbWUgPT09ICdrZm90Jykge1xuICAgICAgICAgICAgdGhpcy5kZXZpY2UubmFtZSA9ICdraW5kbGUnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbWF0Y2ggPSB1YS5tYXRjaCAoLyhtYWMgb3MgeHx3aW5kb3dzfGxpbnV4KS9pKTtcbiAgICBpZiAobWF0Y2ggIT09IG51bGwpe1xuICAgICAgICB2YXIgb3MgPSBtYXRjaFsxXS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICBpZiAob3MgPT09ICdtYWMgb3MgeCcpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmRldmljZS5pc0lPUygpKXtcbiAgICAgICAgICAgICAgICB0aGlzLm9zLm5hbWUgICAgICAgICA9ICdpb3MnO1xuICAgICAgICAgICAgICAgIG1hdGNoID0gdWEubWF0Y2goL09TID9cXHMqKFxcLj9cXGQrKFtcXC58X11cXGQrKSopIGxpa2UgTWFjIE9TIFgvKTtcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2ggIT09IG51bGwpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9zLnZlcnNpb24gID0gbWF0Y2hbMV0ucmVwbGFjZSgvXy9nLCcuJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9zLm5hbWUgICAgICAgICA9ICdtYWMnO1xuICAgICAgICAgICAgICAgIG1hdGNoID0gdWEubWF0Y2goL01hYyBPUyBYP1xccyooXFwuP1xcZCsoW1xcLnxfXVxcZCspKikvKTtcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2ggIT09IG51bGwpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9zLnZlcnNpb24gID0gbWF0Y2hbMV0ucmVwbGFjZSgvXy9nLCcuJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2VcbiAgICAgICAgaWYgKG9zID09PSAnd2luZG93cycpe1xuICAgICAgICAgICAgdGhpcy5vcy5uYW1lICAgICAgICAgPSAnd2luZG93cyc7XG4gICAgICAgICAgICBtYXRjaCA9IHVhLm1hdGNoKC9XaW5kb3dzIE5UIChbXFwuXFxkXSspLyk7XG4gICAgICAgICAgICBpZiAobWF0Y2ggIT09IG51bGwpe1xuICAgICAgICAgICAgICAgIHRoaXMub3MudmVyc2lvbiAgPSBtYXRjaFsxXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmRldmljZS5pc0FuZHJvaWQoKSl7XG4gICAgICAgICAgICAgICAgdGhpcy5vcy5uYW1lID0gJ2FuZHJvaWQnO1xuICAgICAgICAgICAgICAgIG1hdGNoID0gdWEubWF0Y2goL0FuZHJvaWQgP1xccyooXFwuP1xcZCsoW1xcLnxfXVxcZCspKikvKTtcbiAgICAgICAgICAgICAgICBpZiAobWF0Y2ggIT09IG51bGwpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9zLnZlcnNpb24gID0gbWF0Y2hbMV0ucmVwbGFjZSgvXy9nLCcuJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9zLm5hbWUgPSAnbGludXgnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG5cbiAgICB0aGlzLnVzZXJBZ2VudCA9IHVhO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGVwcykge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciAkd2luZG93ID0gZGVwcy53aW5kb3csXG4gICAgICAgIHEgPSBkZXBzLnEsXG4gICAgICAgIGJyb3dzZXJJbmZvID0gZGVwcy5icm93c2VySW5mbyxcbiAgICAgICAgJGxvY2F0aW9uID0gZGVwcy5sb2NhdGlvbjtcblxuICAgIHZhciBuZWVkWGRyID0gIWJyb3dzZXJJbmZvLnByb2ZpbGUuY29ycyAmJiAhISR3aW5kb3cuWERvbWFpblJlcXVlc3QsXG4gICAgICAgIHhociA9IHJlcXVpcmUoJy4vbGliL3hocicpLFxuICAgICAgICB4ZHIgPSBuZWVkWGRyID8gcmVxdWlyZSgnLi9saWIveGRyJykgOiBudWxsO1xuXG4gICAgZnVuY3Rpb24gdG9RdWVyeVBhcmFtcyhwYXJhbXMpIHtcbiAgICAgICAgdmFyIGtleSxcbiAgICAgICAgICAgIHBhaXJzID0gW107XG5cbiAgICAgICAgaWYgKCFwYXJhbXMpIHsgcmV0dXJuICcnOyB9XG5cbiAgICAgICAgZm9yIChrZXkgaW4gcGFyYW1zKSB7XG4gICAgICAgICAgICBwYWlycy5wdXNoKGVuY29kZVVSSUNvbXBvbmVudChrZXkpICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHBhcmFtc1trZXldKSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gJz8nICsgcGFpcnMuam9pbignJicpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGFqYXgoY29uZmlnKSB7XG4gICAgICAgIHZhciB1cmwgPSBjb25maWcudXJsLFxuICAgICAgICAgICAgaXNDcm9zc09yaWdpbiA9ICRsb2NhdGlvbi5vcmlnaW4gIT09ICRsb2NhdGlvbi5vcmlnaW5PZih1cmwpLFxuICAgICAgICAgICAgdXNlWGRyID0gaXNDcm9zc09yaWdpbiAmJiAhIXhkcjtcblxuICAgICAgICByZXR1cm4gKHVzZVhkciA/IHhkciA6IHhocikoe1xuICAgICAgICAgICAgY29uZmlnOiBjb25maWcsXG4gICAgICAgICAgICBxOiBxLFxuICAgICAgICAgICAgd2luZG93OiAkd2luZG93LFxuICAgICAgICAgICAgdG9RdWVyeVBhcmFtczogdG9RdWVyeVBhcmFtc1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhamF4LmdldCA9IGZ1bmN0aW9uKHVybCwgY29uZmlnKSB7XG4gICAgICAgIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblxuICAgICAgICBjb25maWcudXJsID0gdXJsO1xuICAgICAgICBjb25maWcubWV0aG9kID0gJ0dFVCc7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMoY29uZmlnKTtcbiAgICB9O1xuXG4gICAgYWpheC5kZWxldGUgPSBmdW5jdGlvbih1cmwsIGNvbmZpZykge1xuICAgICAgICBjb25maWcgPSBjb25maWcgfHwge307XG5cbiAgICAgICAgY29uZmlnLnVybCA9IHVybDtcbiAgICAgICAgY29uZmlnLm1ldGhvZCA9ICdERUxFVEUnO1xuXG4gICAgICAgIHJldHVybiB0aGlzKGNvbmZpZyk7XG4gICAgfTtcblxuICAgIGFqYXgucG9zdCA9IGZ1bmN0aW9uKHVybCwgZGF0YSwgY29uZmlnKSB7XG4gICAgICAgIGNvbmZpZyA9IGNvbmZpZyB8fCB7fTtcblxuICAgICAgICBjb25maWcudXJsID0gdXJsO1xuICAgICAgICBjb25maWcuZGF0YSA9IGRhdGE7XG4gICAgICAgIGNvbmZpZy5tZXRob2QgPSAnUE9TVCc7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMoY29uZmlnKTtcbiAgICB9O1xuXG4gICAgYWpheC5wdXQgPSBmdW5jdGlvbih1cmwsIGRhdGEsIGNvbmZpZykge1xuICAgICAgICBjb25maWcgPSBjb25maWcgfHwge307XG5cbiAgICAgICAgY29uZmlnLnVybCA9IHVybDtcbiAgICAgICAgY29uZmlnLmRhdGEgPSBkYXRhO1xuICAgICAgICBjb25maWcubWV0aG9kID0gJ1BVVCc7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMoY29uZmlnKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIGFqYXg7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkZXBzKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIGNvbmZpZyA9IGRlcHMuY29uZmlnLFxuICAgICAgICBxID0gZGVwcy5xLFxuICAgICAgICAkd2luZG93ID0gZGVwcy53aW5kb3csXG4gICAgICAgIHRvUXVlcnlQYXJhbXMgPSBkZXBzLnRvUXVlcnlQYXJhbXM7XG5cbiAgICB2YXIgeGRyID0gbmV3ICR3aW5kb3cuWERvbWFpblJlcXVlc3QoKSxcbiAgICAgICAgdXJsID0gY29uZmlnLnVybCArIHRvUXVlcnlQYXJhbXMoY29uZmlnLnBhcmFtcyksXG4gICAgICAgIGRlZmVycmVkID0gcS5kZWZlcigpO1xuXG4gICAgZnVuY3Rpb24gbWFrZVJlc3BvbnNlKGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1czogbnVsbCxcbiAgICAgICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgICAgICBoZWFkZXJzOiBmdW5jdGlvbigpIHt9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgeGRyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KFxuICAgICAgICAgICAgbWFrZVJlc3BvbnNlKCdUaGUgWERvbWFpblJlcXVlc3QgZmFpbGVkLiBXZVxcJ2QgdGVsbCB5b3UgbW9yZSBpZiB3ZSBjb3VsZC4uLicpXG4gICAgICAgICk7XG4gICAgfTtcbiAgICB4ZHIub250aW1lb3V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGRlZmVycmVkLnJlamVjdChcbiAgICAgICAgICAgIG1ha2VSZXNwb25zZSgnVGhlIFhEb21haW5SZXF1ZXN0IHRpbWVkIG91dCBhZnRlciAnICsgY29uZmlnLnRpbWVvdXQgKyAnbXMuJylcbiAgICAgICAgKTtcbiAgICB9O1xuICAgIHhkci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGRhdGE7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGRhdGEgPSBKU09OLnBhcnNlKHhkci5yZXNwb25zZVRleHQpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBkYXRhID0geGRyLnJlc3BvbnNlVGV4dDtcbiAgICAgICAgfVxuXG4gICAgICAgIGRlZmVycmVkLnJlc29sdmUobWFrZVJlc3BvbnNlKGRhdGEpKTtcbiAgICB9O1xuXG4gICAgeGRyLnRpbWVvdXQgPSBjb25maWcudGltZW91dCB8fCAwO1xuXG4gICAgeGRyLm9wZW4oY29uZmlnLm1ldGhvZCwgdXJsKTtcbiAgICB4ZHIuc2VuZCgoKHR5cGVvZiBjb25maWcuZGF0YSA9PT0gJ29iamVjdCcpID9cbiAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkoY29uZmlnLmRhdGEpIDogY29uZmlnLmRhdGEpIHx8ICcnKTtcblxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGVwcykge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBjb25maWcgPSBkZXBzLmNvbmZpZyxcbiAgICAgICAgcSA9IGRlcHMucSxcbiAgICAgICAgJHdpbmRvdyA9IGRlcHMud2luZG93LFxuICAgICAgICB0b1F1ZXJ5UGFyYW1zID0gZGVwcy50b1F1ZXJ5UGFyYW1zO1xuXG4gICAgdmFyIHhociA9IG5ldyAkd2luZG93LlhNTEh0dHBSZXF1ZXN0KCksXG4gICAgICAgIHVybCxcbiAgICAgICAgZGVmZXJyZWQgPSBxLmRlZmVyKCk7XG5cbiAgICBmdW5jdGlvbiBzZXRIZWFkZXJzKGhlYWRlcnMpIHtcbiAgICAgICAgdmFyIGhlYWRlcjtcblxuICAgICAgICBmb3IgKGhlYWRlciBpbiBoZWFkZXJzKSB7XG4gICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcihoZWFkZXIsIGhlYWRlcnNbaGVhZGVyXSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cmwgPSBjb25maWcudXJsICsgdG9RdWVyeVBhcmFtcyhjb25maWcucGFyYW1zKTtcblxuICAgIGZ1bmN0aW9uIGhhbmRsZVJlc3BvbnNlKCkge1xuICAgICAgICB2YXIgcmVzcG9uc2UgPSB7XG4gICAgICAgICAgICAgICAgc3RhdHVzOiB4aHIuc3RhdHVzLFxuICAgICAgICAgICAgICAgIGRhdGE6IHhoci5yZXNwb25zZSxcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3RhdHVzID0gcmVzcG9uc2Uuc3RhdHVzLFxuICAgICAgICAgICAgc3VjY2VzcyA9ICEoc3RhdHVzID49IDQwMCAmJiBzdGF0dXMgPCA2MDApO1xuXG4gICAgICAgIGRlZmVycmVkW3N1Y2Nlc3MgPyAncmVzb2x2ZScgOiAncmVqZWN0J10ocmVzcG9uc2UpO1xuICAgIH1cblxuICAgIHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHhoci5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgICAgICBoYW5kbGVSZXNwb25zZSgpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIHhoci50aW1lb3V0ID0gY29uZmlnLnRpbWVvdXQgfHwgMDtcbiAgICB4aHIucmVzcG9uc2VUeXBlID0gY29uZmlnLnJlc3BvbnNlVHlwZSB8fCAnJztcblxuICAgIHhoci5vcGVuKGNvbmZpZy5tZXRob2QsIHVybCk7XG4gICAgc2V0SGVhZGVycyhjb25maWcuaGVhZGVycyk7XG4gICAgeGhyLnNlbmQoY29uZmlnLmRhdGEpO1xuXG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkZXBzKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIHEgPSBkZXBzLnE7XG5cbiAgICB2YXIgX3ByaXZhdGUgPSB7fSxcbiAgICAgICAgY2FjaGUgPSBfcHJpdmF0ZS5jYWNoZSA9IHt9O1xuXG4gICAgZnVuY3Rpb24gc2F2ZVRvQ2FjaGUodHlwZSwgaXRlbXMpIHtcbiAgICAgICAgaXRlbXMuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICBjYWNoZVt0eXBlICsgJzonICsgaXRlbS5pZF0gPSBpdGVtO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gaXRlbXM7XG4gICAgfVxuXG4gICAgdGhpcy5maW5kID0gZnVuY3Rpb24odHlwZSwgaWQpIHtcbiAgICAgICAgdmFyIGFkYXB0ZXIgPSB0aGlzLmFkYXB0ZXI7XG5cbiAgICAgICAgZnVuY3Rpb24gZmV0Y2hGcm9tQ2FjaGUoKSB7XG4gICAgICAgICAgICB2YXIgaXRlbSA9IGNhY2hlW3R5cGUgKyAnOicgKyBpZF07XG5cbiAgICAgICAgICAgIGlmICghaXRlbSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBxLnJlamVjdCgnQ2Fubm90IGZpbmQgJyArICh0eXBlICsgJzonICsgaWQpICsgJyBpbiBjYWNoZS4nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHEud2hlbihbaXRlbV0pO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZmV0Y2hGcm9tQWRhcHRlcigpIHtcbiAgICAgICAgICAgIHJldHVybiBhZGFwdGVyLmZpbmQodHlwZSwgaWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gZXh0cmFjdFNpbmdsZShpdGVtcykge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW1zWzBdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZldGNoRnJvbUNhY2hlKClcbiAgICAgICAgICAgIC5jYXRjaChmZXRjaEZyb21BZGFwdGVyKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZGF0YSkgeyByZXR1cm4gc2F2ZVRvQ2FjaGUodHlwZSwgZGF0YSk7IH0pXG4gICAgICAgICAgICAudGhlbihleHRyYWN0U2luZ2xlKTtcbiAgICB9O1xuXG4gICAgdGhpcy5maW5kQWxsID0gZnVuY3Rpb24odHlwZSwgbWF0Y2hlcikge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGFwdGVyW21hdGNoZXIgPyAnZmluZFF1ZXJ5JyA6ICdmaW5kQWxsJ10uYXBwbHkodGhpcy5hZGFwdGVyLCBhcmd1bWVudHMpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihkYXRhKSB7IHJldHVybiBzYXZlVG9DYWNoZSh0eXBlLCBkYXRhKTsgfSk7XG4gICAgfTtcblxuICAgIGlmICh3aW5kb3cuX19rYXJtYV9fKSB7IHRoaXMuX3ByaXZhdGUgPSBfcHJpdmF0ZTsgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGVwcykge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBjNkFqYXggPSBkZXBzLmM2QWpheCxcbiAgICAgICAgcSA9IGRlcHMucTtcblxuICAgIHZhciBjYWNoZSA9IHRoaXMuX2NhY2hlID0ge307XG5cbiAgICB0aGlzLl9nZXRKU09OID0gZnVuY3Rpb24oc3JjKSB7XG4gICAgICAgIHZhciBjYWNoZWQgPSBjYWNoZVtzcmNdLFxuICAgICAgICAgICAgcHJvbWlzZTtcblxuICAgICAgICBpZiAoY2FjaGVkKSB7XG4gICAgICAgICAgICBwcm9taXNlID0gcS53aGVuKHtcbiAgICAgICAgICAgICAgICBzdGF0dXM6IGNhY2hlZFswXSxcbiAgICAgICAgICAgICAgICBkYXRhOiBjYWNoZWRbMV0sXG4gICAgICAgICAgICAgICAgaGVhZGVyczogZnVuY3Rpb24oKSB7IHJldHVybiBjYWNoZWRbMl07IH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJvbWlzZSA9IGM2QWpheC5nZXQoc3JjKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBwcm9taXNlXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgIGNhY2hlW3NyY10gPSBbcmVzcG9uc2Uuc3RhdHVzLCByZXNwb25zZS5kYXRhLCByZXNwb25zZS5oZWFkZXJzKCldO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgdGhpcy5maW5kQWxsID0gZnVuY3Rpb24odHlwZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0SlNPTih0aGlzLmpzb25TcmMpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihmaXh0dXJlcykge1xuICAgICAgICAgICAgICAgIHJldHVybiBmaXh0dXJlc1t0eXBlXTtcbiAgICAgICAgICAgIH0pO1xuICAgIH07XG5cbiAgICB0aGlzLmZpbmQgPSBmdW5jdGlvbih0eXBlLCBpZCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0SlNPTih0aGlzLmpzb25TcmMpXG4gICAgICAgICAgICAudGhlbihmdW5jdGlvbihmaXh0dXJlcykge1xuICAgICAgICAgICAgICAgIHJldHVybiBmaXh0dXJlc1t0eXBlXS5maWx0ZXIoZnVuY3Rpb24ob2JqZWN0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvYmplY3QuaWQgPT09IGlkO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHRoaXMuZmluZFF1ZXJ5ID0gZnVuY3Rpb24odHlwZSwgcXVlcnkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dldEpTT04odGhpcy5qc29uU3JjKVxuICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24oZml4dHVyZXMpIHtcbiAgICAgICAgICAgICAgICB2YXIgaXRlbXMgPSBmaXh0dXJlc1t0eXBlXSxcbiAgICAgICAgICAgICAgICAgICAgbGlzdCA9IChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpZCA9IHF1ZXJ5LmlkO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1zO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZCA9IChpZCBpbnN0YW5jZW9mIEFycmF5KSA/IGlkIDogW2lkXTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1zLmZpbHRlcihmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGlkLmluZGV4T2YoaXRlbS5pZCkgPiAtMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9KCkpO1xuXG4gICAgICAgICAgICAgICAgZGVsZXRlIHF1ZXJ5LmlkO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGxpc3QuZmlsdGVyKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHF1ZXJ5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaXRlbVtrZXldICE9PSBxdWVyeVtrZXldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9O1xufTtcbiIsIi8qKlxuICogYXNFdmVudGVkIHYwLjQuMyAtIGFuIGV2ZW50IGVtaXR0ZXIgbWl4aW4gd2hpY2ggcHJvdmlkZXMgdGhlIG9ic2VydmVyIHBhdHRlcm4gdG8gSmF2YVNjcmlwdCBvYmplY3QuXG4gKlxuICogQ29weXJpZ2h0IDIwMTIsIE1pY2hhbCBLdWtsaXNcbiAqIER1YWwgbGljZW5zZWQgdW5kZXIgdGhlIE1JVCBvciBHUEwgVmVyc2lvbiAyIGxpY2Vuc2VzLlxuICpcbiAqKi9cbihmdW5jdGlvbiAobmFtZSwgZ2xvYmFsLCBkZWZpbml0aW9uKSB7XG4gIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZGVmaW5pdGlvbigpO1xuICB9IGVsc2UgaWYgKHR5cGVvZiByZXF1aXJlICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PT0gJ29iamVjdCcpIHtcbiAgICBkZWZpbmUoZGVmaW5pdGlvbik7XG4gIH0gZWxzZSB7XG4gICAgZ2xvYmFsW25hbWVdID0gZGVmaW5pdGlvbigpO1xuICB9XG59KSgnYXNFdmVudGVkJywgdGhpcywgZnVuY3Rpb24gKCkge1xuICByZXR1cm4gKGZ1bmN0aW9uICgpIHtcblxuICAgIHZhciBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuICAgIHZhciBuYXRpdmVJbmRleE9mID0gQXJyYXlQcm90by5pbmRleE9mO1xuICAgIHZhciBzbGljZSA9IEFycmF5UHJvdG8uc2xpY2U7XG5cbiAgICBmdW5jdGlvbiBiaW5kKGV2ZW50LCBmbikge1xuICAgICAgdmFyIGksIHBhcnQ7XG4gICAgICB2YXIgZXZlbnRzID0gdGhpcy5ldmVudHMgPSB0aGlzLmV2ZW50cyB8fCB7fTtcbiAgICAgIHZhciBwYXJ0cyA9IGV2ZW50LnNwbGl0KC9cXHMrLyk7XG4gICAgICB2YXIgbnVtID0gcGFydHMubGVuZ3RoO1xuXG4gICAgICBmb3IgKGkgPSAwOyBpIDwgbnVtOyBpKyspIHtcbiAgICAgICAgZXZlbnRzWyhwYXJ0ID0gcGFydHNbaV0pXSA9IGV2ZW50c1twYXJ0XSB8fCBbXTtcbiAgICAgICAgZXZlbnRzW3BhcnRdLnB1c2goZm4pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gb25lKGV2ZW50LCBmbikge1xuICAgICAgLy8gW25vdGljZV0gVGhlIHZhbHVlIG9mIGZuIGFuZCBmbjEgaXMgbm90IGVxdWl2YWxlbnQgaW4gdGhlIGNhc2Ugb2YgdGhlIGZvbGxvd2luZyBNU0lFLlxuICAgICAgLy8gdmFyIGZuID0gZnVuY3Rpb24gZm4xICgpIHsgYWxlcnQoZm4gPT09IGZuMSkgfSBpZS48OSBmYWxzZVxuICAgICAgdmFyIGZuYyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm4uYXBwbHkodGhpcywgc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcbiAgICAgICAgdGhpcy51bmJpbmQoZXZlbnQsIGZuYyk7XG4gICAgICB9O1xuICAgICAgdGhpcy5iaW5kKGV2ZW50LCBmbmMpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdW5iaW5kKGV2ZW50LCBmbikge1xuICAgICAgdmFyIGV2ZW50TmFtZSwgaSwgaW5kZXgsIG51bSwgcGFydHM7XG4gICAgICB2YXIgZXZlbnRzID0gdGhpcy5ldmVudHM7XG5cbiAgICAgIGlmICghZXZlbnRzKSByZXR1cm47XG5cbiAgICAgIHBhcnRzID0gZXZlbnQuc3BsaXQoL1xccysvKTtcbiAgICAgIGZvciAoaSA9IDAsIG51bSA9IHBhcnRzLmxlbmd0aDsgaSA8IG51bTsgaSsrKSB7XG4gICAgICAgIGlmICgoZXZlbnROYW1lID0gcGFydHNbaV0pIGluIGV2ZW50cyAhPT0gZmFsc2UpIHtcbiAgICAgICAgICBpbmRleCA9IChmbikgPyBfaW5kZXhPZihldmVudHNbZXZlbnROYW1lXSwgZm4pIDogMDtcbiAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICBldmVudHNbZXZlbnROYW1lXS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gdHJpZ2dlcihldmVudCkge1xuICAgICAgdmFyIGFyZ3MsIGk7XG4gICAgICB2YXIgZXZlbnRzID0gdGhpcy5ldmVudHM7XG5cbiAgICAgIGlmICghZXZlbnRzIHx8IGV2ZW50IGluIGV2ZW50cyA9PT0gZmFsc2UpIHJldHVybjtcblxuICAgICAgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgIGZvciAoaSA9IGV2ZW50c1tldmVudF0ubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgZXZlbnRzW2V2ZW50XVtpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIF9pbmRleE9mKGFycmF5LCBuZWVkbGUpIHtcbiAgICAgIHZhciBpLCBsO1xuXG4gICAgICBpZiAobmF0aXZlSW5kZXhPZiAmJiBhcnJheS5pbmRleE9mID09PSBuYXRpdmVJbmRleE9mKSB7XG4gICAgICAgIHJldHVybiBhcnJheS5pbmRleE9mKG5lZWRsZSk7XG4gICAgICB9XG5cbiAgICAgIGZvciAoaSA9IDAsIGwgPSBhcnJheS5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgaWYgKGFycmF5W2ldID09PSBuZWVkbGUpIHtcbiAgICAgICAgICByZXR1cm4gaTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGlzLmJpbmQgPSB0aGlzLm9uID0gYmluZDtcbiAgICAgIHRoaXMudW5iaW5kID0gdGhpcy5vZmYgPSB0aGlzLnJlbW92ZUxpc3RlbmVyID0gdW5iaW5kO1xuICAgICAgdGhpcy50cmlnZ2VyID0gdGhpcy5lbWl0ID0gdHJpZ2dlcjtcbiAgICAgIHRoaXMub25lID0gdGhpcy5vbmNlID0gb25lO1xuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICB9KSgpO1xufSk7XG4iLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5wcm9jZXNzLm5leHRUaWNrID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2FuU2V0SW1tZWRpYXRlID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cuc2V0SW1tZWRpYXRlO1xuICAgIHZhciBjYW5Qb3N0ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cucG9zdE1lc3NhZ2UgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXJcbiAgICA7XG5cbiAgICBpZiAoY2FuU2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gd2luZG93LnNldEltbWVkaWF0ZShmKSB9O1xuICAgIH1cblxuICAgIGlmIChjYW5Qb3N0KSB7XG4gICAgICAgIHZhciBxdWV1ZSA9IFtdO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGV2LnNvdXJjZTtcbiAgICAgICAgICAgIGlmICgoc291cmNlID09PSB3aW5kb3cgfHwgc291cmNlID09PSBudWxsKSAmJiBldi5kYXRhID09PSAncHJvY2Vzcy10aWNrJykge1xuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgICAgIHF1ZXVlLnB1c2goZm4pO1xuICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKCdwcm9jZXNzLXRpY2snLCAnKicpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICB9O1xufSkoKTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufVxuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG4iLCIoZnVuY3Rpb24gKHByb2Nlc3Mpe1xuLy8gdmltOnRzPTQ6c3RzPTQ6c3c9NDpcbi8qIVxuICpcbiAqIENvcHlyaWdodCAyMDA5LTIwMTIgS3JpcyBLb3dhbCB1bmRlciB0aGUgdGVybXMgb2YgdGhlIE1JVFxuICogbGljZW5zZSBmb3VuZCBhdCBodHRwOi8vZ2l0aHViLmNvbS9rcmlza293YWwvcS9yYXcvbWFzdGVyL0xJQ0VOU0VcbiAqXG4gKiBXaXRoIHBhcnRzIGJ5IFR5bGVyIENsb3NlXG4gKiBDb3B5cmlnaHQgMjAwNy0yMDA5IFR5bGVyIENsb3NlIHVuZGVyIHRoZSB0ZXJtcyBvZiB0aGUgTUlUIFggbGljZW5zZSBmb3VuZFxuICogYXQgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5odG1sXG4gKiBGb3JrZWQgYXQgcmVmX3NlbmQuanMgdmVyc2lvbjogMjAwOS0wNS0xMVxuICpcbiAqIFdpdGggcGFydHMgYnkgTWFyayBNaWxsZXJcbiAqIENvcHlyaWdodCAoQykgMjAxMSBHb29nbGUgSW5jLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxuICpcbiAqL1xuXG4oZnVuY3Rpb24gKGRlZmluaXRpb24pIHtcbiAgICAvLyBUdXJuIG9mZiBzdHJpY3QgbW9kZSBmb3IgdGhpcyBmdW5jdGlvbiBzbyB3ZSBjYW4gYXNzaWduIHRvIGdsb2JhbC5RXG4gICAgLyoganNoaW50IHN0cmljdDogZmFsc2UgKi9cblxuICAgIC8vIFRoaXMgZmlsZSB3aWxsIGZ1bmN0aW9uIHByb3Blcmx5IGFzIGEgPHNjcmlwdD4gdGFnLCBvciBhIG1vZHVsZVxuICAgIC8vIHVzaW5nIENvbW1vbkpTIGFuZCBOb2RlSlMgb3IgUmVxdWlyZUpTIG1vZHVsZSBmb3JtYXRzLiAgSW5cbiAgICAvLyBDb21tb24vTm9kZS9SZXF1aXJlSlMsIHRoZSBtb2R1bGUgZXhwb3J0cyB0aGUgUSBBUEkgYW5kIHdoZW5cbiAgICAvLyBleGVjdXRlZCBhcyBhIHNpbXBsZSA8c2NyaXB0PiwgaXQgY3JlYXRlcyBhIFEgZ2xvYmFsIGluc3RlYWQuXG5cbiAgICAvLyBNb250YWdlIFJlcXVpcmVcbiAgICBpZiAodHlwZW9mIGJvb3RzdHJhcCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGJvb3RzdHJhcChcInByb21pc2VcIiwgZGVmaW5pdGlvbik7XG5cbiAgICAvLyBDb21tb25KU1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGV4cG9ydHMgPT09IFwib2JqZWN0XCIpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbml0aW9uKCk7XG5cbiAgICAvLyBSZXF1aXJlSlNcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09IFwiZnVuY3Rpb25cIiAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShkZWZpbml0aW9uKTtcblxuICAgIC8vIFNFUyAoU2VjdXJlIEVjbWFTY3JpcHQpXG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygc2VzICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICghc2VzLm9rKCkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlcy5tYWtlUSA9IGRlZmluaXRpb247XG4gICAgICAgIH1cblxuICAgIC8vIDxzY3JpcHQ+XG4gICAgfSBlbHNlIHtcbiAgICAgICAgUSA9IGRlZmluaXRpb24oKTtcbiAgICB9XG5cbn0pKGZ1bmN0aW9uICgpIHtcblwidXNlIHN0cmljdFwiO1xuXG52YXIgaGFzU3RhY2tzID0gZmFsc2U7XG50cnkge1xuICAgIHRocm93IG5ldyBFcnJvcigpO1xufSBjYXRjaCAoZSkge1xuICAgIGhhc1N0YWNrcyA9ICEhZS5zdGFjaztcbn1cblxuLy8gQWxsIGNvZGUgYWZ0ZXIgdGhpcyBwb2ludCB3aWxsIGJlIGZpbHRlcmVkIGZyb20gc3RhY2sgdHJhY2VzIHJlcG9ydGVkXG4vLyBieSBRLlxudmFyIHFTdGFydGluZ0xpbmUgPSBjYXB0dXJlTGluZSgpO1xudmFyIHFGaWxlTmFtZTtcblxuLy8gc2hpbXNcblxuLy8gdXNlZCBmb3IgZmFsbGJhY2sgaW4gXCJhbGxSZXNvbHZlZFwiXG52YXIgbm9vcCA9IGZ1bmN0aW9uICgpIHt9O1xuXG4vLyBVc2UgdGhlIGZhc3Rlc3QgcG9zc2libGUgbWVhbnMgdG8gZXhlY3V0ZSBhIHRhc2sgaW4gYSBmdXR1cmUgdHVyblxuLy8gb2YgdGhlIGV2ZW50IGxvb3AuXG52YXIgbmV4dFRpY2sgPShmdW5jdGlvbiAoKSB7XG4gICAgLy8gbGlua2VkIGxpc3Qgb2YgdGFza3MgKHNpbmdsZSwgd2l0aCBoZWFkIG5vZGUpXG4gICAgdmFyIGhlYWQgPSB7dGFzazogdm9pZCAwLCBuZXh0OiBudWxsfTtcbiAgICB2YXIgdGFpbCA9IGhlYWQ7XG4gICAgdmFyIGZsdXNoaW5nID0gZmFsc2U7XG4gICAgdmFyIHJlcXVlc3RUaWNrID0gdm9pZCAwO1xuICAgIHZhciBpc05vZGVKUyA9IGZhbHNlO1xuXG4gICAgZnVuY3Rpb24gZmx1c2goKSB7XG4gICAgICAgIC8qIGpzaGludCBsb29wZnVuYzogdHJ1ZSAqL1xuXG4gICAgICAgIHdoaWxlIChoZWFkLm5leHQpIHtcbiAgICAgICAgICAgIGhlYWQgPSBoZWFkLm5leHQ7XG4gICAgICAgICAgICB2YXIgdGFzayA9IGhlYWQudGFzaztcbiAgICAgICAgICAgIGhlYWQudGFzayA9IHZvaWQgMDtcbiAgICAgICAgICAgIHZhciBkb21haW4gPSBoZWFkLmRvbWFpbjtcblxuICAgICAgICAgICAgaWYgKGRvbWFpbikge1xuICAgICAgICAgICAgICAgIGhlYWQuZG9tYWluID0gdm9pZCAwO1xuICAgICAgICAgICAgICAgIGRvbWFpbi5lbnRlcigpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHRhc2soKTtcblxuICAgICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGlmIChpc05vZGVKUykge1xuICAgICAgICAgICAgICAgICAgICAvLyBJbiBub2RlLCB1bmNhdWdodCBleGNlcHRpb25zIGFyZSBjb25zaWRlcmVkIGZhdGFsIGVycm9ycy5cbiAgICAgICAgICAgICAgICAgICAgLy8gUmUtdGhyb3cgdGhlbSBzeW5jaHJvbm91c2x5IHRvIGludGVycnVwdCBmbHVzaGluZyFcblxuICAgICAgICAgICAgICAgICAgICAvLyBFbnN1cmUgY29udGludWF0aW9uIGlmIHRoZSB1bmNhdWdodCBleGNlcHRpb24gaXMgc3VwcHJlc3NlZFxuICAgICAgICAgICAgICAgICAgICAvLyBsaXN0ZW5pbmcgXCJ1bmNhdWdodEV4Y2VwdGlvblwiIGV2ZW50cyAoYXMgZG9tYWlucyBkb2VzKS5cbiAgICAgICAgICAgICAgICAgICAgLy8gQ29udGludWUgaW4gbmV4dCBldmVudCB0byBhdm9pZCB0aWNrIHJlY3Vyc2lvbi5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGRvbWFpbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZG9tYWluLmV4aXQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZsdXNoLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRvbWFpbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgZG9tYWluLmVudGVyKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlO1xuXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gSW4gYnJvd3NlcnMsIHVuY2F1Z2h0IGV4Y2VwdGlvbnMgYXJlIG5vdCBmYXRhbC5cbiAgICAgICAgICAgICAgICAgICAgLy8gUmUtdGhyb3cgdGhlbSBhc3luY2hyb25vdXNseSB0byBhdm9pZCBzbG93LWRvd25zLlxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChkb21haW4pIHtcbiAgICAgICAgICAgICAgICBkb21haW4uZXhpdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZmx1c2hpbmcgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBuZXh0VGljayA9IGZ1bmN0aW9uICh0YXNrKSB7XG4gICAgICAgIHRhaWwgPSB0YWlsLm5leHQgPSB7XG4gICAgICAgICAgICB0YXNrOiB0YXNrLFxuICAgICAgICAgICAgZG9tYWluOiBpc05vZGVKUyAmJiBwcm9jZXNzLmRvbWFpbixcbiAgICAgICAgICAgIG5leHQ6IG51bGxcbiAgICAgICAgfTtcblxuICAgICAgICBpZiAoIWZsdXNoaW5nKSB7XG4gICAgICAgICAgICBmbHVzaGluZyA9IHRydWU7XG4gICAgICAgICAgICByZXF1ZXN0VGljaygpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBwcm9jZXNzLm5leHRUaWNrKSB7XG4gICAgICAgIC8vIE5vZGUuanMgYmVmb3JlIDAuOS4gTm90ZSB0aGF0IHNvbWUgZmFrZS1Ob2RlIGVudmlyb25tZW50cywgbGlrZSB0aGVcbiAgICAgICAgLy8gTW9jaGEgdGVzdCBydW5uZXIsIGludHJvZHVjZSBhIGBwcm9jZXNzYCBnbG9iYWwgd2l0aG91dCBhIGBuZXh0VGlja2AuXG4gICAgICAgIGlzTm9kZUpTID0gdHJ1ZTtcblxuICAgICAgICByZXF1ZXN0VGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHByb2Nlc3MubmV4dFRpY2soZmx1c2gpO1xuICAgICAgICB9O1xuXG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygc2V0SW1tZWRpYXRlID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgLy8gSW4gSUUxMCwgTm9kZS5qcyAwLjkrLCBvciBodHRwczovL2dpdGh1Yi5jb20vTm9ibGVKUy9zZXRJbW1lZGlhdGVcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIHJlcXVlc3RUaWNrID0gc2V0SW1tZWRpYXRlLmJpbmQod2luZG93LCBmbHVzaCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXF1ZXN0VGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBzZXRJbW1lZGlhdGUoZmx1c2gpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgTWVzc2FnZUNoYW5uZWwgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgLy8gbW9kZXJuIGJyb3dzZXJzXG4gICAgICAgIC8vIGh0dHA6Ly93d3cubm9uYmxvY2tpbmcuaW8vMjAxMS8wNi93aW5kb3duZXh0dGljay5odG1sXG4gICAgICAgIHZhciBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4gICAgICAgIC8vIEF0IGxlYXN0IFNhZmFyaSBWZXJzaW9uIDYuMC41ICg4NTM2LjMwLjEpIGludGVybWl0dGVudGx5IGNhbm5vdCBjcmVhdGVcbiAgICAgICAgLy8gd29ya2luZyBtZXNzYWdlIHBvcnRzIHRoZSBmaXJzdCB0aW1lIGEgcGFnZSBsb2Fkcy5cbiAgICAgICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXF1ZXN0VGljayA9IHJlcXVlc3RQb3J0VGljaztcbiAgICAgICAgICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gZmx1c2g7XG4gICAgICAgICAgICBmbHVzaCgpO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgcmVxdWVzdFBvcnRUaWNrID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgLy8gT3BlcmEgcmVxdWlyZXMgdXMgdG8gcHJvdmlkZSBhIG1lc3NhZ2UgcGF5bG9hZCwgcmVnYXJkbGVzcyBvZlxuICAgICAgICAgICAgLy8gd2hldGhlciB3ZSB1c2UgaXQuXG4gICAgICAgICAgICBjaGFubmVsLnBvcnQyLnBvc3RNZXNzYWdlKDApO1xuICAgICAgICB9O1xuICAgICAgICByZXF1ZXN0VGljayA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZmx1c2gsIDApO1xuICAgICAgICAgICAgcmVxdWVzdFBvcnRUaWNrKCk7XG4gICAgICAgIH07XG5cbiAgICB9IGVsc2Uge1xuICAgICAgICAvLyBvbGQgYnJvd3NlcnNcbiAgICAgICAgcmVxdWVzdFRpY2sgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZsdXNoLCAwKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmV4dFRpY2s7XG59KSgpO1xuXG4vLyBBdHRlbXB0IHRvIG1ha2UgZ2VuZXJpY3Mgc2FmZSBpbiB0aGUgZmFjZSBvZiBkb3duc3RyZWFtXG4vLyBtb2RpZmljYXRpb25zLlxuLy8gVGhlcmUgaXMgbm8gc2l0dWF0aW9uIHdoZXJlIHRoaXMgaXMgbmVjZXNzYXJ5LlxuLy8gSWYgeW91IG5lZWQgYSBzZWN1cml0eSBndWFyYW50ZWUsIHRoZXNlIHByaW1vcmRpYWxzIG5lZWQgdG8gYmVcbi8vIGRlZXBseSBmcm96ZW4gYW55d2F5LCBhbmQgaWYgeW91IGRvbuKAmXQgbmVlZCBhIHNlY3VyaXR5IGd1YXJhbnRlZSxcbi8vIHRoaXMgaXMganVzdCBwbGFpbiBwYXJhbm9pZC5cbi8vIEhvd2V2ZXIsIHRoaXMgKiptaWdodCoqIGhhdmUgdGhlIG5pY2Ugc2lkZS1lZmZlY3Qgb2YgcmVkdWNpbmcgdGhlIHNpemUgb2Zcbi8vIHRoZSBtaW5pZmllZCBjb2RlIGJ5IHJlZHVjaW5nIHguY2FsbCgpIHRvIG1lcmVseSB4KClcbi8vIFNlZSBNYXJrIE1pbGxlcuKAmXMgZXhwbGFuYXRpb24gb2Ygd2hhdCB0aGlzIGRvZXMuXG4vLyBodHRwOi8vd2lraS5lY21hc2NyaXB0Lm9yZy9kb2t1LnBocD9pZD1jb252ZW50aW9uczpzYWZlX21ldGFfcHJvZ3JhbW1pbmdcbnZhciBjYWxsID0gRnVuY3Rpb24uY2FsbDtcbmZ1bmN0aW9uIHVuY3VycnlUaGlzKGYpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gY2FsbC5hcHBseShmLCBhcmd1bWVudHMpO1xuICAgIH07XG59XG4vLyBUaGlzIGlzIGVxdWl2YWxlbnQsIGJ1dCBzbG93ZXI6XG4vLyB1bmN1cnJ5VGhpcyA9IEZ1bmN0aW9uX2JpbmQuYmluZChGdW5jdGlvbl9iaW5kLmNhbGwpO1xuLy8gaHR0cDovL2pzcGVyZi5jb20vdW5jdXJyeXRoaXNcblxudmFyIGFycmF5X3NsaWNlID0gdW5jdXJyeVRoaXMoQXJyYXkucHJvdG90eXBlLnNsaWNlKTtcblxudmFyIGFycmF5X3JlZHVjZSA9IHVuY3VycnlUaGlzKFxuICAgIEFycmF5LnByb3RvdHlwZS5yZWR1Y2UgfHwgZnVuY3Rpb24gKGNhbGxiYWNrLCBiYXNpcykge1xuICAgICAgICB2YXIgaW5kZXggPSAwLFxuICAgICAgICAgICAgbGVuZ3RoID0gdGhpcy5sZW5ndGg7XG4gICAgICAgIC8vIGNvbmNlcm5pbmcgdGhlIGluaXRpYWwgdmFsdWUsIGlmIG9uZSBpcyBub3QgcHJvdmlkZWRcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgIC8vIHNlZWsgdG8gdGhlIGZpcnN0IHZhbHVlIGluIHRoZSBhcnJheSwgYWNjb3VudGluZ1xuICAgICAgICAgICAgLy8gZm9yIHRoZSBwb3NzaWJpbGl0eSB0aGF0IGlzIGlzIGEgc3BhcnNlIGFycmF5XG4gICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgaWYgKGluZGV4IGluIHRoaXMpIHtcbiAgICAgICAgICAgICAgICAgICAgYmFzaXMgPSB0aGlzW2luZGV4KytdO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCsraW5kZXggPj0gbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IHdoaWxlICgxKTtcbiAgICAgICAgfVxuICAgICAgICAvLyByZWR1Y2VcbiAgICAgICAgZm9yICg7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICAvLyBhY2NvdW50IGZvciB0aGUgcG9zc2liaWxpdHkgdGhhdCB0aGUgYXJyYXkgaXMgc3BhcnNlXG4gICAgICAgICAgICBpZiAoaW5kZXggaW4gdGhpcykge1xuICAgICAgICAgICAgICAgIGJhc2lzID0gY2FsbGJhY2soYmFzaXMsIHRoaXNbaW5kZXhdLCBpbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGJhc2lzO1xuICAgIH1cbik7XG5cbnZhciBhcnJheV9pbmRleE9mID0gdW5jdXJyeVRoaXMoXG4gICAgQXJyYXkucHJvdG90eXBlLmluZGV4T2YgfHwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIC8vIG5vdCBhIHZlcnkgZ29vZCBzaGltLCBidXQgZ29vZCBlbm91Z2ggZm9yIG91ciBvbmUgdXNlIG9mIGl0XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXNbaV0gPT09IHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cbik7XG5cbnZhciBhcnJheV9tYXAgPSB1bmN1cnJ5VGhpcyhcbiAgICBBcnJheS5wcm90b3R5cGUubWFwIHx8IGZ1bmN0aW9uIChjYWxsYmFjaywgdGhpc3ApIHtcbiAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICB2YXIgY29sbGVjdCA9IFtdO1xuICAgICAgICBhcnJheV9yZWR1Y2Uoc2VsZiwgZnVuY3Rpb24gKHVuZGVmaW5lZCwgdmFsdWUsIGluZGV4KSB7XG4gICAgICAgICAgICBjb2xsZWN0LnB1c2goY2FsbGJhY2suY2FsbCh0aGlzcCwgdmFsdWUsIGluZGV4LCBzZWxmKSk7XG4gICAgICAgIH0sIHZvaWQgMCk7XG4gICAgICAgIHJldHVybiBjb2xsZWN0O1xuICAgIH1cbik7XG5cbnZhciBvYmplY3RfY3JlYXRlID0gT2JqZWN0LmNyZWF0ZSB8fCBmdW5jdGlvbiAocHJvdG90eXBlKSB7XG4gICAgZnVuY3Rpb24gVHlwZSgpIHsgfVxuICAgIFR5cGUucHJvdG90eXBlID0gcHJvdG90eXBlO1xuICAgIHJldHVybiBuZXcgVHlwZSgpO1xufTtcblxudmFyIG9iamVjdF9oYXNPd25Qcm9wZXJ0eSA9IHVuY3VycnlUaGlzKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkpO1xuXG52YXIgb2JqZWN0X2tleXMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiAob2JqZWN0KSB7XG4gICAgdmFyIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICAgIGlmIChvYmplY3RfaGFzT3duUHJvcGVydHkob2JqZWN0LCBrZXkpKSB7XG4gICAgICAgICAgICBrZXlzLnB1c2goa2V5KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ga2V5cztcbn07XG5cbnZhciBvYmplY3RfdG9TdHJpbmcgPSB1bmN1cnJ5VGhpcyhPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKTtcblxuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IE9iamVjdCh2YWx1ZSk7XG59XG5cbi8vIGdlbmVyYXRvciByZWxhdGVkIHNoaW1zXG5cbi8vIEZJWE1FOiBSZW1vdmUgdGhpcyBmdW5jdGlvbiBvbmNlIEVTNiBnZW5lcmF0b3JzIGFyZSBpbiBTcGlkZXJNb25rZXkuXG5mdW5jdGlvbiBpc1N0b3BJdGVyYXRpb24oZXhjZXB0aW9uKSB7XG4gICAgcmV0dXJuIChcbiAgICAgICAgb2JqZWN0X3RvU3RyaW5nKGV4Y2VwdGlvbikgPT09IFwiW29iamVjdCBTdG9wSXRlcmF0aW9uXVwiIHx8XG4gICAgICAgIGV4Y2VwdGlvbiBpbnN0YW5jZW9mIFFSZXR1cm5WYWx1ZVxuICAgICk7XG59XG5cbi8vIEZJWE1FOiBSZW1vdmUgdGhpcyBoZWxwZXIgYW5kIFEucmV0dXJuIG9uY2UgRVM2IGdlbmVyYXRvcnMgYXJlIGluXG4vLyBTcGlkZXJNb25rZXkuXG52YXIgUVJldHVyblZhbHVlO1xuaWYgKHR5cGVvZiBSZXR1cm5WYWx1ZSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIFFSZXR1cm5WYWx1ZSA9IFJldHVyblZhbHVlO1xufSBlbHNlIHtcbiAgICBRUmV0dXJuVmFsdWUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIH07XG59XG5cbi8vIFVudGlsIFY4IDMuMTkgLyBDaHJvbWl1bSAyOSBpcyByZWxlYXNlZCwgU3BpZGVyTW9ua2V5IGlzIHRoZSBvbmx5XG4vLyBlbmdpbmUgdGhhdCBoYXMgYSBkZXBsb3llZCBiYXNlIG9mIGJyb3dzZXJzIHRoYXQgc3VwcG9ydCBnZW5lcmF0b3JzLlxuLy8gSG93ZXZlciwgU00ncyBnZW5lcmF0b3JzIHVzZSB0aGUgUHl0aG9uLWluc3BpcmVkIHNlbWFudGljcyBvZlxuLy8gb3V0ZGF0ZWQgRVM2IGRyYWZ0cy4gIFdlIHdvdWxkIGxpa2UgdG8gc3VwcG9ydCBFUzYsIGJ1dCB3ZSdkIGFsc29cbi8vIGxpa2UgdG8gbWFrZSBpdCBwb3NzaWJsZSB0byB1c2UgZ2VuZXJhdG9ycyBpbiBkZXBsb3llZCBicm93c2Vycywgc29cbi8vIHdlIGFsc28gc3VwcG9ydCBQeXRob24tc3R5bGUgZ2VuZXJhdG9ycy4gIEF0IHNvbWUgcG9pbnQgd2UgY2FuIHJlbW92ZVxuLy8gdGhpcyBibG9jay5cbnZhciBoYXNFUzZHZW5lcmF0b3JzO1xudHJ5IHtcbiAgICAvKiBqc2hpbnQgZXZpbDogdHJ1ZSwgbm9uZXc6IGZhbHNlICovXG4gICAgbmV3IEZ1bmN0aW9uKFwiKGZ1bmN0aW9uKiAoKXsgeWllbGQgMTsgfSlcIik7XG4gICAgaGFzRVM2R2VuZXJhdG9ycyA9IHRydWU7XG59IGNhdGNoIChlKSB7XG4gICAgaGFzRVM2R2VuZXJhdG9ycyA9IGZhbHNlO1xufVxuXG4vLyBsb25nIHN0YWNrIHRyYWNlc1xuXG52YXIgU1RBQ0tfSlVNUF9TRVBBUkFUT1IgPSBcIkZyb20gcHJldmlvdXMgZXZlbnQ6XCI7XG5cbmZ1bmN0aW9uIG1ha2VTdGFja1RyYWNlTG9uZyhlcnJvciwgcHJvbWlzZSkge1xuICAgIC8vIElmIHBvc3NpYmxlLCB0cmFuc2Zvcm0gdGhlIGVycm9yIHN0YWNrIHRyYWNlIGJ5IHJlbW92aW5nIE5vZGUgYW5kIFFcbiAgICAvLyBjcnVmdCwgdGhlbiBjb25jYXRlbmF0aW5nIHdpdGggdGhlIHN0YWNrIHRyYWNlIG9mIGBwcm9taXNlYC4gU2VlICM1Ny5cbiAgICBpZiAoaGFzU3RhY2tzICYmXG4gICAgICAgIHByb21pc2Uuc3RhY2sgJiZcbiAgICAgICAgdHlwZW9mIGVycm9yID09PSBcIm9iamVjdFwiICYmXG4gICAgICAgIGVycm9yICE9PSBudWxsICYmXG4gICAgICAgIGVycm9yLnN0YWNrICYmXG4gICAgICAgIGVycm9yLnN0YWNrLmluZGV4T2YoU1RBQ0tfSlVNUF9TRVBBUkFUT1IpID09PSAtMVxuICAgICkge1xuICAgICAgICB2YXIgc3RhY2tzID0gW107XG4gICAgICAgIGZvciAodmFyIHAgPSBwcm9taXNlOyAhIXA7IHAgPSBwLnNvdXJjZSkge1xuICAgICAgICAgICAgaWYgKHAuc3RhY2spIHtcbiAgICAgICAgICAgICAgICBzdGFja3MudW5zaGlmdChwLnN0YWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBzdGFja3MudW5zaGlmdChlcnJvci5zdGFjayk7XG5cbiAgICAgICAgdmFyIGNvbmNhdGVkU3RhY2tzID0gc3RhY2tzLmpvaW4oXCJcXG5cIiArIFNUQUNLX0pVTVBfU0VQQVJBVE9SICsgXCJcXG5cIik7XG4gICAgICAgIGVycm9yLnN0YWNrID0gZmlsdGVyU3RhY2tTdHJpbmcoY29uY2F0ZWRTdGFja3MpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZmlsdGVyU3RhY2tTdHJpbmcoc3RhY2tTdHJpbmcpIHtcbiAgICB2YXIgbGluZXMgPSBzdGFja1N0cmluZy5zcGxpdChcIlxcblwiKTtcbiAgICB2YXIgZGVzaXJlZExpbmVzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaW5lcy5sZW5ndGg7ICsraSkge1xuICAgICAgICB2YXIgbGluZSA9IGxpbmVzW2ldO1xuXG4gICAgICAgIGlmICghaXNJbnRlcm5hbEZyYW1lKGxpbmUpICYmICFpc05vZGVGcmFtZShsaW5lKSAmJiBsaW5lKSB7XG4gICAgICAgICAgICBkZXNpcmVkTGluZXMucHVzaChsaW5lKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZGVzaXJlZExpbmVzLmpvaW4oXCJcXG5cIik7XG59XG5cbmZ1bmN0aW9uIGlzTm9kZUZyYW1lKHN0YWNrTGluZSkge1xuICAgIHJldHVybiBzdGFja0xpbmUuaW5kZXhPZihcIihtb2R1bGUuanM6XCIpICE9PSAtMSB8fFxuICAgICAgICAgICBzdGFja0xpbmUuaW5kZXhPZihcIihub2RlLmpzOlwiKSAhPT0gLTE7XG59XG5cbmZ1bmN0aW9uIGdldEZpbGVOYW1lQW5kTGluZU51bWJlcihzdGFja0xpbmUpIHtcbiAgICAvLyBOYW1lZCBmdW5jdGlvbnM6IFwiYXQgZnVuY3Rpb25OYW1lIChmaWxlbmFtZTpsaW5lTnVtYmVyOmNvbHVtbk51bWJlcilcIlxuICAgIC8vIEluIElFMTAgZnVuY3Rpb24gbmFtZSBjYW4gaGF2ZSBzcGFjZXMgKFwiQW5vbnltb3VzIGZ1bmN0aW9uXCIpIE9fb1xuICAgIHZhciBhdHRlbXB0MSA9IC9hdCAuKyBcXCgoLispOihcXGQrKTooPzpcXGQrKVxcKSQvLmV4ZWMoc3RhY2tMaW5lKTtcbiAgICBpZiAoYXR0ZW1wdDEpIHtcbiAgICAgICAgcmV0dXJuIFthdHRlbXB0MVsxXSwgTnVtYmVyKGF0dGVtcHQxWzJdKV07XG4gICAgfVxuXG4gICAgLy8gQW5vbnltb3VzIGZ1bmN0aW9uczogXCJhdCBmaWxlbmFtZTpsaW5lTnVtYmVyOmNvbHVtbk51bWJlclwiXG4gICAgdmFyIGF0dGVtcHQyID0gL2F0IChbXiBdKyk6KFxcZCspOig/OlxcZCspJC8uZXhlYyhzdGFja0xpbmUpO1xuICAgIGlmIChhdHRlbXB0Mikge1xuICAgICAgICByZXR1cm4gW2F0dGVtcHQyWzFdLCBOdW1iZXIoYXR0ZW1wdDJbMl0pXTtcbiAgICB9XG5cbiAgICAvLyBGaXJlZm94IHN0eWxlOiBcImZ1bmN0aW9uQGZpbGVuYW1lOmxpbmVOdW1iZXIgb3IgQGZpbGVuYW1lOmxpbmVOdW1iZXJcIlxuICAgIHZhciBhdHRlbXB0MyA9IC8uKkAoLispOihcXGQrKSQvLmV4ZWMoc3RhY2tMaW5lKTtcbiAgICBpZiAoYXR0ZW1wdDMpIHtcbiAgICAgICAgcmV0dXJuIFthdHRlbXB0M1sxXSwgTnVtYmVyKGF0dGVtcHQzWzJdKV07XG4gICAgfVxufVxuXG5mdW5jdGlvbiBpc0ludGVybmFsRnJhbWUoc3RhY2tMaW5lKSB7XG4gICAgdmFyIGZpbGVOYW1lQW5kTGluZU51bWJlciA9IGdldEZpbGVOYW1lQW5kTGluZU51bWJlcihzdGFja0xpbmUpO1xuXG4gICAgaWYgKCFmaWxlTmFtZUFuZExpbmVOdW1iZXIpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBmaWxlTmFtZSA9IGZpbGVOYW1lQW5kTGluZU51bWJlclswXTtcbiAgICB2YXIgbGluZU51bWJlciA9IGZpbGVOYW1lQW5kTGluZU51bWJlclsxXTtcblxuICAgIHJldHVybiBmaWxlTmFtZSA9PT0gcUZpbGVOYW1lICYmXG4gICAgICAgIGxpbmVOdW1iZXIgPj0gcVN0YXJ0aW5nTGluZSAmJlxuICAgICAgICBsaW5lTnVtYmVyIDw9IHFFbmRpbmdMaW5lO1xufVxuXG4vLyBkaXNjb3ZlciBvd24gZmlsZSBuYW1lIGFuZCBsaW5lIG51bWJlciByYW5nZSBmb3IgZmlsdGVyaW5nIHN0YWNrXG4vLyB0cmFjZXNcbmZ1bmN0aW9uIGNhcHR1cmVMaW5lKCkge1xuICAgIGlmICghaGFzU3RhY2tzKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0cnkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHZhciBsaW5lcyA9IGUuc3RhY2suc3BsaXQoXCJcXG5cIik7XG4gICAgICAgIHZhciBmaXJzdExpbmUgPSBsaW5lc1swXS5pbmRleE9mKFwiQFwiKSA+IDAgPyBsaW5lc1sxXSA6IGxpbmVzWzJdO1xuICAgICAgICB2YXIgZmlsZU5hbWVBbmRMaW5lTnVtYmVyID0gZ2V0RmlsZU5hbWVBbmRMaW5lTnVtYmVyKGZpcnN0TGluZSk7XG4gICAgICAgIGlmICghZmlsZU5hbWVBbmRMaW5lTnVtYmVyKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBxRmlsZU5hbWUgPSBmaWxlTmFtZUFuZExpbmVOdW1iZXJbMF07XG4gICAgICAgIHJldHVybiBmaWxlTmFtZUFuZExpbmVOdW1iZXJbMV07XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkZXByZWNhdGUoY2FsbGJhY2ssIG5hbWUsIGFsdGVybmF0aXZlKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSBcInVuZGVmaW5lZFwiICYmXG4gICAgICAgICAgICB0eXBlb2YgY29uc29sZS53YXJuID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybihuYW1lICsgXCIgaXMgZGVwcmVjYXRlZCwgdXNlIFwiICsgYWx0ZXJuYXRpdmUgK1xuICAgICAgICAgICAgICAgICAgICAgICAgIFwiIGluc3RlYWQuXCIsIG5ldyBFcnJvcihcIlwiKS5zdGFjayk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KGNhbGxiYWNrLCBhcmd1bWVudHMpO1xuICAgIH07XG59XG5cbi8vIGVuZCBvZiBzaGltc1xuLy8gYmVnaW5uaW5nIG9mIHJlYWwgd29ya1xuXG4vKipcbiAqIENvbnN0cnVjdHMgYSBwcm9taXNlIGZvciBhbiBpbW1lZGlhdGUgcmVmZXJlbmNlLCBwYXNzZXMgcHJvbWlzZXMgdGhyb3VnaCwgb3JcbiAqIGNvZXJjZXMgcHJvbWlzZXMgZnJvbSBkaWZmZXJlbnQgc3lzdGVtcy5cbiAqIEBwYXJhbSB2YWx1ZSBpbW1lZGlhdGUgcmVmZXJlbmNlIG9yIHByb21pc2VcbiAqL1xuZnVuY3Rpb24gUSh2YWx1ZSkge1xuICAgIC8vIElmIHRoZSBvYmplY3QgaXMgYWxyZWFkeSBhIFByb21pc2UsIHJldHVybiBpdCBkaXJlY3RseS4gIFRoaXMgZW5hYmxlc1xuICAgIC8vIHRoZSByZXNvbHZlIGZ1bmN0aW9uIHRvIGJvdGggYmUgdXNlZCB0byBjcmVhdGVkIHJlZmVyZW5jZXMgZnJvbSBvYmplY3RzLFxuICAgIC8vIGJ1dCB0byB0b2xlcmFibHkgY29lcmNlIG5vbi1wcm9taXNlcyB0byBwcm9taXNlcy5cbiAgICBpZiAoaXNQcm9taXNlKHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuXG4gICAgLy8gYXNzaW1pbGF0ZSB0aGVuYWJsZXNcbiAgICBpZiAoaXNQcm9taXNlQWxpa2UodmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBjb2VyY2UodmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmdWxmaWxsKHZhbHVlKTtcbiAgICB9XG59XG5RLnJlc29sdmUgPSBRO1xuXG4vKipcbiAqIFBlcmZvcm1zIGEgdGFzayBpbiBhIGZ1dHVyZSB0dXJuIG9mIHRoZSBldmVudCBsb29wLlxuICogQHBhcmFtIHtGdW5jdGlvbn0gdGFza1xuICovXG5RLm5leHRUaWNrID0gbmV4dFRpY2s7XG5cbi8qKlxuICogQ29udHJvbHMgd2hldGhlciBvciBub3QgbG9uZyBzdGFjayB0cmFjZXMgd2lsbCBiZSBvblxuICovXG5RLmxvbmdTdGFja1N1cHBvcnQgPSBmYWxzZTtcblxuLyoqXG4gKiBDb25zdHJ1Y3RzIGEge3Byb21pc2UsIHJlc29sdmUsIHJlamVjdH0gb2JqZWN0LlxuICpcbiAqIGByZXNvbHZlYCBpcyBhIGNhbGxiYWNrIHRvIGludm9rZSB3aXRoIGEgbW9yZSByZXNvbHZlZCB2YWx1ZSBmb3IgdGhlXG4gKiBwcm9taXNlLiBUbyBmdWxmaWxsIHRoZSBwcm9taXNlLCBpbnZva2UgYHJlc29sdmVgIHdpdGggYW55IHZhbHVlIHRoYXQgaXNcbiAqIG5vdCBhIHRoZW5hYmxlLiBUbyByZWplY3QgdGhlIHByb21pc2UsIGludm9rZSBgcmVzb2x2ZWAgd2l0aCBhIHJlamVjdGVkXG4gKiB0aGVuYWJsZSwgb3IgaW52b2tlIGByZWplY3RgIHdpdGggdGhlIHJlYXNvbiBkaXJlY3RseS4gVG8gcmVzb2x2ZSB0aGVcbiAqIHByb21pc2UgdG8gYW5vdGhlciB0aGVuYWJsZSwgdGh1cyBwdXR0aW5nIGl0IGluIHRoZSBzYW1lIHN0YXRlLCBpbnZva2VcbiAqIGByZXNvbHZlYCB3aXRoIHRoYXQgb3RoZXIgdGhlbmFibGUuXG4gKi9cblEuZGVmZXIgPSBkZWZlcjtcbmZ1bmN0aW9uIGRlZmVyKCkge1xuICAgIC8vIGlmIFwibWVzc2FnZXNcIiBpcyBhbiBcIkFycmF5XCIsIHRoYXQgaW5kaWNhdGVzIHRoYXQgdGhlIHByb21pc2UgaGFzIG5vdCB5ZXRcbiAgICAvLyBiZWVuIHJlc29sdmVkLiAgSWYgaXQgaXMgXCJ1bmRlZmluZWRcIiwgaXQgaGFzIGJlZW4gcmVzb2x2ZWQuICBFYWNoXG4gICAgLy8gZWxlbWVudCBvZiB0aGUgbWVzc2FnZXMgYXJyYXkgaXMgaXRzZWxmIGFuIGFycmF5IG9mIGNvbXBsZXRlIGFyZ3VtZW50cyB0b1xuICAgIC8vIGZvcndhcmQgdG8gdGhlIHJlc29sdmVkIHByb21pc2UuICBXZSBjb2VyY2UgdGhlIHJlc29sdXRpb24gdmFsdWUgdG8gYVxuICAgIC8vIHByb21pc2UgdXNpbmcgdGhlIGByZXNvbHZlYCBmdW5jdGlvbiBiZWNhdXNlIGl0IGhhbmRsZXMgYm90aCBmdWxseVxuICAgIC8vIG5vbi10aGVuYWJsZSB2YWx1ZXMgYW5kIG90aGVyIHRoZW5hYmxlcyBncmFjZWZ1bGx5LlxuICAgIHZhciBtZXNzYWdlcyA9IFtdLCBwcm9ncmVzc0xpc3RlbmVycyA9IFtdLCByZXNvbHZlZFByb21pc2U7XG5cbiAgICB2YXIgZGVmZXJyZWQgPSBvYmplY3RfY3JlYXRlKGRlZmVyLnByb3RvdHlwZSk7XG4gICAgdmFyIHByb21pc2UgPSBvYmplY3RfY3JlYXRlKFByb21pc2UucHJvdG90eXBlKTtcblxuICAgIHByb21pc2UucHJvbWlzZURpc3BhdGNoID0gZnVuY3Rpb24gKHJlc29sdmUsIG9wLCBvcGVyYW5kcykge1xuICAgICAgICB2YXIgYXJncyA9IGFycmF5X3NsaWNlKGFyZ3VtZW50cyk7XG4gICAgICAgIGlmIChtZXNzYWdlcykge1xuICAgICAgICAgICAgbWVzc2FnZXMucHVzaChhcmdzKTtcbiAgICAgICAgICAgIGlmIChvcCA9PT0gXCJ3aGVuXCIgJiYgb3BlcmFuZHNbMV0pIHsgLy8gcHJvZ3Jlc3Mgb3BlcmFuZFxuICAgICAgICAgICAgICAgIHByb2dyZXNzTGlzdGVuZXJzLnB1c2gob3BlcmFuZHNbMV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJlc29sdmVkUHJvbWlzZS5wcm9taXNlRGlzcGF0Y2guYXBwbHkocmVzb2x2ZWRQcm9taXNlLCBhcmdzKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8vIFhYWCBkZXByZWNhdGVkXG4gICAgcHJvbWlzZS52YWx1ZU9mID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAobWVzc2FnZXMpIHtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBuZWFyZXJWYWx1ZSA9IG5lYXJlcihyZXNvbHZlZFByb21pc2UpO1xuICAgICAgICBpZiAoaXNQcm9taXNlKG5lYXJlclZhbHVlKSkge1xuICAgICAgICAgICAgcmVzb2x2ZWRQcm9taXNlID0gbmVhcmVyVmFsdWU7IC8vIHNob3J0ZW4gY2hhaW5cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmVhcmVyVmFsdWU7XG4gICAgfTtcblxuICAgIHByb21pc2UuaW5zcGVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCFyZXNvbHZlZFByb21pc2UpIHtcbiAgICAgICAgICAgIHJldHVybiB7IHN0YXRlOiBcInBlbmRpbmdcIiB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXNvbHZlZFByb21pc2UuaW5zcGVjdCgpO1xuICAgIH07XG5cbiAgICBpZiAoUS5sb25nU3RhY2tTdXBwb3J0ICYmIGhhc1N0YWNrcykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIC8vIE5PVEU6IGRvbid0IHRyeSB0byB1c2UgYEVycm9yLmNhcHR1cmVTdGFja1RyYWNlYCBvciB0cmFuc2ZlciB0aGVcbiAgICAgICAgICAgIC8vIGFjY2Vzc29yIGFyb3VuZDsgdGhhdCBjYXVzZXMgbWVtb3J5IGxlYWtzIGFzIHBlciBHSC0xMTEuIEp1c3RcbiAgICAgICAgICAgIC8vIHJlaWZ5IHRoZSBzdGFjayB0cmFjZSBhcyBhIHN0cmluZyBBU0FQLlxuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIC8vIEF0IHRoZSBzYW1lIHRpbWUsIGN1dCBvZmYgdGhlIGZpcnN0IGxpbmU7IGl0J3MgYWx3YXlzIGp1c3RcbiAgICAgICAgICAgIC8vIFwiW29iamVjdCBQcm9taXNlXVxcblwiLCBhcyBwZXIgdGhlIGB0b1N0cmluZ2AuXG4gICAgICAgICAgICBwcm9taXNlLnN0YWNrID0gZS5zdGFjay5zdWJzdHJpbmcoZS5zdGFjay5pbmRleE9mKFwiXFxuXCIpICsgMSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBOT1RFOiB3ZSBkbyB0aGUgY2hlY2tzIGZvciBgcmVzb2x2ZWRQcm9taXNlYCBpbiBlYWNoIG1ldGhvZCwgaW5zdGVhZCBvZlxuICAgIC8vIGNvbnNvbGlkYXRpbmcgdGhlbSBpbnRvIGBiZWNvbWVgLCBzaW5jZSBvdGhlcndpc2Ugd2UnZCBjcmVhdGUgbmV3XG4gICAgLy8gcHJvbWlzZXMgd2l0aCB0aGUgbGluZXMgYGJlY29tZSh3aGF0ZXZlcih2YWx1ZSkpYC4gU2VlIGUuZy4gR0gtMjUyLlxuXG4gICAgZnVuY3Rpb24gYmVjb21lKG5ld1Byb21pc2UpIHtcbiAgICAgICAgcmVzb2x2ZWRQcm9taXNlID0gbmV3UHJvbWlzZTtcbiAgICAgICAgcHJvbWlzZS5zb3VyY2UgPSBuZXdQcm9taXNlO1xuXG4gICAgICAgIGFycmF5X3JlZHVjZShtZXNzYWdlcywgZnVuY3Rpb24gKHVuZGVmaW5lZCwgbWVzc2FnZSkge1xuICAgICAgICAgICAgbmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIG5ld1Byb21pc2UucHJvbWlzZURpc3BhdGNoLmFwcGx5KG5ld1Byb21pc2UsIG1lc3NhZ2UpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIHZvaWQgMCk7XG5cbiAgICAgICAgbWVzc2FnZXMgPSB2b2lkIDA7XG4gICAgICAgIHByb2dyZXNzTGlzdGVuZXJzID0gdm9pZCAwO1xuICAgIH1cblxuICAgIGRlZmVycmVkLnByb21pc2UgPSBwcm9taXNlO1xuICAgIGRlZmVycmVkLnJlc29sdmUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgaWYgKHJlc29sdmVkUHJvbWlzZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgYmVjb21lKFEodmFsdWUpKTtcbiAgICB9O1xuXG4gICAgZGVmZXJyZWQuZnVsZmlsbCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICBpZiAocmVzb2x2ZWRQcm9taXNlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBiZWNvbWUoZnVsZmlsbCh2YWx1ZSkpO1xuICAgIH07XG4gICAgZGVmZXJyZWQucmVqZWN0ID0gZnVuY3Rpb24gKHJlYXNvbikge1xuICAgICAgICBpZiAocmVzb2x2ZWRQcm9taXNlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBiZWNvbWUocmVqZWN0KHJlYXNvbikpO1xuICAgIH07XG4gICAgZGVmZXJyZWQubm90aWZ5ID0gZnVuY3Rpb24gKHByb2dyZXNzKSB7XG4gICAgICAgIGlmIChyZXNvbHZlZFByb21pc2UpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGFycmF5X3JlZHVjZShwcm9ncmVzc0xpc3RlbmVycywgZnVuY3Rpb24gKHVuZGVmaW5lZCwgcHJvZ3Jlc3NMaXN0ZW5lcikge1xuICAgICAgICAgICAgbmV4dFRpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHByb2dyZXNzTGlzdGVuZXIocHJvZ3Jlc3MpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sIHZvaWQgMCk7XG4gICAgfTtcblxuICAgIHJldHVybiBkZWZlcnJlZDtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgTm9kZS1zdHlsZSBjYWxsYmFjayB0aGF0IHdpbGwgcmVzb2x2ZSBvciByZWplY3QgdGhlIGRlZmVycmVkXG4gKiBwcm9taXNlLlxuICogQHJldHVybnMgYSBub2RlYmFja1xuICovXG5kZWZlci5wcm90b3R5cGUubWFrZU5vZGVSZXNvbHZlciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChlcnJvciwgdmFsdWUpIHtcbiAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICBzZWxmLnJlamVjdChlcnJvcik7XG4gICAgICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgICAgIHNlbGYucmVzb2x2ZShhcnJheV9zbGljZShhcmd1bWVudHMsIDEpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNlbGYucmVzb2x2ZSh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9O1xufTtcblxuLyoqXG4gKiBAcGFyYW0gcmVzb2x2ZXIge0Z1bmN0aW9ufSBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBub3RoaW5nIGFuZCBhY2NlcHRzXG4gKiB0aGUgcmVzb2x2ZSwgcmVqZWN0LCBhbmQgbm90aWZ5IGZ1bmN0aW9ucyBmb3IgYSBkZWZlcnJlZC5cbiAqIEByZXR1cm5zIGEgcHJvbWlzZSB0aGF0IG1heSBiZSByZXNvbHZlZCB3aXRoIHRoZSBnaXZlbiByZXNvbHZlIGFuZCByZWplY3RcbiAqIGZ1bmN0aW9ucywgb3IgcmVqZWN0ZWQgYnkgYSB0aHJvd24gZXhjZXB0aW9uIGluIHJlc29sdmVyXG4gKi9cblEucHJvbWlzZSA9IHByb21pc2U7XG5mdW5jdGlvbiBwcm9taXNlKHJlc29sdmVyKSB7XG4gICAgaWYgKHR5cGVvZiByZXNvbHZlciAhPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJyZXNvbHZlciBtdXN0IGJlIGEgZnVuY3Rpb24uXCIpO1xuICAgIH1cbiAgICB2YXIgZGVmZXJyZWQgPSBkZWZlcigpO1xuICAgIHRyeSB7XG4gICAgICAgIHJlc29sdmVyKGRlZmVycmVkLnJlc29sdmUsIGRlZmVycmVkLnJlamVjdCwgZGVmZXJyZWQubm90aWZ5KTtcbiAgICB9IGNhdGNoIChyZWFzb24pIHtcbiAgICAgICAgZGVmZXJyZWQucmVqZWN0KHJlYXNvbik7XG4gICAgfVxuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufVxuXG4vLyBYWFggZXhwZXJpbWVudGFsLiAgVGhpcyBtZXRob2QgaXMgYSB3YXkgdG8gZGVub3RlIHRoYXQgYSBsb2NhbCB2YWx1ZSBpc1xuLy8gc2VyaWFsaXphYmxlIGFuZCBzaG91bGQgYmUgaW1tZWRpYXRlbHkgZGlzcGF0Y2hlZCB0byBhIHJlbW90ZSB1cG9uIHJlcXVlc3QsXG4vLyBpbnN0ZWFkIG9mIHBhc3NpbmcgYSByZWZlcmVuY2UuXG5RLnBhc3NCeUNvcHkgPSBmdW5jdGlvbiAob2JqZWN0KSB7XG4gICAgLy9mcmVlemUob2JqZWN0KTtcbiAgICAvL3Bhc3NCeUNvcGllcy5zZXQob2JqZWN0LCB0cnVlKTtcbiAgICByZXR1cm4gb2JqZWN0O1xufTtcblxuUHJvbWlzZS5wcm90b3R5cGUucGFzc0J5Q29weSA9IGZ1bmN0aW9uICgpIHtcbiAgICAvL2ZyZWV6ZShvYmplY3QpO1xuICAgIC8vcGFzc0J5Q29waWVzLnNldChvYmplY3QsIHRydWUpO1xuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBJZiB0d28gcHJvbWlzZXMgZXZlbnR1YWxseSBmdWxmaWxsIHRvIHRoZSBzYW1lIHZhbHVlLCBwcm9taXNlcyB0aGF0IHZhbHVlLFxuICogYnV0IG90aGVyd2lzZSByZWplY3RzLlxuICogQHBhcmFtIHgge0FueSp9XG4gKiBAcGFyYW0geSB7QW55Kn1cbiAqIEByZXR1cm5zIHtBbnkqfSBhIHByb21pc2UgZm9yIHggYW5kIHkgaWYgdGhleSBhcmUgdGhlIHNhbWUsIGJ1dCBhIHJlamVjdGlvblxuICogb3RoZXJ3aXNlLlxuICpcbiAqL1xuUS5qb2luID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICByZXR1cm4gUSh4KS5qb2luKHkpO1xufTtcblxuUHJvbWlzZS5wcm90b3R5cGUuam9pbiA9IGZ1bmN0aW9uICh0aGF0KSB7XG4gICAgcmV0dXJuIFEoW3RoaXMsIHRoYXRdKS5zcHJlYWQoZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgaWYgKHggPT09IHkpIHtcbiAgICAgICAgICAgIC8vIFRPRE86IFwiPT09XCIgc2hvdWxkIGJlIE9iamVjdC5pcyBvciBlcXVpdlxuICAgICAgICAgICAgcmV0dXJuIHg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBqb2luOiBub3QgdGhlIHNhbWU6IFwiICsgeCArIFwiIFwiICsgeSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG5cbi8qKlxuICogUmV0dXJucyBhIHByb21pc2UgZm9yIHRoZSBmaXJzdCBvZiBhbiBhcnJheSBvZiBwcm9taXNlcyB0byBiZWNvbWUgZnVsZmlsbGVkLlxuICogQHBhcmFtIGFuc3dlcnMge0FycmF5W0FueSpdfSBwcm9taXNlcyB0byByYWNlXG4gKiBAcmV0dXJucyB7QW55Kn0gdGhlIGZpcnN0IHByb21pc2UgdG8gYmUgZnVsZmlsbGVkXG4gKi9cblEucmFjZSA9IHJhY2U7XG5mdW5jdGlvbiByYWNlKGFuc3dlclBzKSB7XG4gICAgcmV0dXJuIHByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIC8vIFN3aXRjaCB0byB0aGlzIG9uY2Ugd2UgY2FuIGFzc3VtZSBhdCBsZWFzdCBFUzVcbiAgICAgICAgLy8gYW5zd2VyUHMuZm9yRWFjaChmdW5jdGlvbihhbnN3ZXJQKSB7XG4gICAgICAgIC8vICAgICBRKGFuc3dlclApLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgLy8gfSk7XG4gICAgICAgIC8vIFVzZSB0aGlzIGluIHRoZSBtZWFudGltZVxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYW5zd2VyUHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIFEoYW5zd2VyUHNbaV0pLnRoZW4ocmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5Qcm9taXNlLnByb3RvdHlwZS5yYWNlID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnRoZW4oUS5yYWNlKTtcbn07XG5cbi8qKlxuICogQ29uc3RydWN0cyBhIFByb21pc2Ugd2l0aCBhIHByb21pc2UgZGVzY3JpcHRvciBvYmplY3QgYW5kIG9wdGlvbmFsIGZhbGxiYWNrXG4gKiBmdW5jdGlvbi4gIFRoZSBkZXNjcmlwdG9yIGNvbnRhaW5zIG1ldGhvZHMgbGlrZSB3aGVuKHJlamVjdGVkKSwgZ2V0KG5hbWUpLFxuICogc2V0KG5hbWUsIHZhbHVlKSwgcG9zdChuYW1lLCBhcmdzKSwgYW5kIGRlbGV0ZShuYW1lKSwgd2hpY2ggYWxsXG4gKiByZXR1cm4gZWl0aGVyIGEgdmFsdWUsIGEgcHJvbWlzZSBmb3IgYSB2YWx1ZSwgb3IgYSByZWplY3Rpb24uICBUaGUgZmFsbGJhY2tcbiAqIGFjY2VwdHMgdGhlIG9wZXJhdGlvbiBuYW1lLCBhIHJlc29sdmVyLCBhbmQgYW55IGZ1cnRoZXIgYXJndW1lbnRzIHRoYXQgd291bGRcbiAqIGhhdmUgYmVlbiBmb3J3YXJkZWQgdG8gdGhlIGFwcHJvcHJpYXRlIG1ldGhvZCBhYm92ZSBoYWQgYSBtZXRob2QgYmVlblxuICogcHJvdmlkZWQgd2l0aCB0aGUgcHJvcGVyIG5hbWUuICBUaGUgQVBJIG1ha2VzIG5vIGd1YXJhbnRlZXMgYWJvdXQgdGhlIG5hdHVyZVxuICogb2YgdGhlIHJldHVybmVkIG9iamVjdCwgYXBhcnQgZnJvbSB0aGF0IGl0IGlzIHVzYWJsZSB3aGVyZWV2ZXIgcHJvbWlzZXMgYXJlXG4gKiBib3VnaHQgYW5kIHNvbGQuXG4gKi9cblEubWFrZVByb21pc2UgPSBQcm9taXNlO1xuZnVuY3Rpb24gUHJvbWlzZShkZXNjcmlwdG9yLCBmYWxsYmFjaywgaW5zcGVjdCkge1xuICAgIGlmIChmYWxsYmFjayA9PT0gdm9pZCAwKSB7XG4gICAgICAgIGZhbGxiYWNrID0gZnVuY3Rpb24gKG9wKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVqZWN0KG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICBcIlByb21pc2UgZG9lcyBub3Qgc3VwcG9ydCBvcGVyYXRpb246IFwiICsgb3BcbiAgICAgICAgICAgICkpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBpZiAoaW5zcGVjdCA9PT0gdm9pZCAwKSB7XG4gICAgICAgIGluc3BlY3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4ge3N0YXRlOiBcInVua25vd25cIn07XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgdmFyIHByb21pc2UgPSBvYmplY3RfY3JlYXRlKFByb21pc2UucHJvdG90eXBlKTtcblxuICAgIHByb21pc2UucHJvbWlzZURpc3BhdGNoID0gZnVuY3Rpb24gKHJlc29sdmUsIG9wLCBhcmdzKSB7XG4gICAgICAgIHZhciByZXN1bHQ7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpZiAoZGVzY3JpcHRvcltvcF0pIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBkZXNjcmlwdG9yW29wXS5hcHBseShwcm9taXNlLCBhcmdzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gZmFsbGJhY2suY2FsbChwcm9taXNlLCBvcCwgYXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgICAgICAgcmVzdWx0ID0gcmVqZWN0KGV4Y2VwdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc29sdmUpIHtcbiAgICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBwcm9taXNlLmluc3BlY3QgPSBpbnNwZWN0O1xuXG4gICAgLy8gWFhYIGRlcHJlY2F0ZWQgYHZhbHVlT2ZgIGFuZCBgZXhjZXB0aW9uYCBzdXBwb3J0XG4gICAgaWYgKGluc3BlY3QpIHtcbiAgICAgICAgdmFyIGluc3BlY3RlZCA9IGluc3BlY3QoKTtcbiAgICAgICAgaWYgKGluc3BlY3RlZC5zdGF0ZSA9PT0gXCJyZWplY3RlZFwiKSB7XG4gICAgICAgICAgICBwcm9taXNlLmV4Y2VwdGlvbiA9IGluc3BlY3RlZC5yZWFzb247XG4gICAgICAgIH1cblxuICAgICAgICBwcm9taXNlLnZhbHVlT2YgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgaW5zcGVjdGVkID0gaW5zcGVjdCgpO1xuICAgICAgICAgICAgaWYgKGluc3BlY3RlZC5zdGF0ZSA9PT0gXCJwZW5kaW5nXCIgfHxcbiAgICAgICAgICAgICAgICBpbnNwZWN0ZWQuc3RhdGUgPT09IFwicmVqZWN0ZWRcIikge1xuICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGluc3BlY3RlZC52YWx1ZTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbn1cblxuUHJvbWlzZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIFwiW29iamVjdCBQcm9taXNlXVwiO1xufTtcblxuUHJvbWlzZS5wcm90b3R5cGUudGhlbiA9IGZ1bmN0aW9uIChmdWxmaWxsZWQsIHJlamVjdGVkLCBwcm9ncmVzc2VkKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHZhciBkZWZlcnJlZCA9IGRlZmVyKCk7XG4gICAgdmFyIGRvbmUgPSBmYWxzZTsgICAvLyBlbnN1cmUgdGhlIHVudHJ1c3RlZCBwcm9taXNlIG1ha2VzIGF0IG1vc3QgYVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2luZ2xlIGNhbGwgdG8gb25lIG9mIHRoZSBjYWxsYmFja3NcblxuICAgIGZ1bmN0aW9uIF9mdWxmaWxsZWQodmFsdWUpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgZnVsZmlsbGVkID09PSBcImZ1bmN0aW9uXCIgPyBmdWxmaWxsZWQodmFsdWUpIDogdmFsdWU7XG4gICAgICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIHJlamVjdChleGNlcHRpb24pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX3JlamVjdGVkKGV4Y2VwdGlvbikge1xuICAgICAgICBpZiAodHlwZW9mIHJlamVjdGVkID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIG1ha2VTdGFja1RyYWNlTG9uZyhleGNlcHRpb24sIHNlbGYpO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVqZWN0ZWQoZXhjZXB0aW9uKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKG5ld0V4Y2VwdGlvbikge1xuICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QobmV3RXhjZXB0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVqZWN0KGV4Y2VwdGlvbik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gX3Byb2dyZXNzZWQodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHR5cGVvZiBwcm9ncmVzc2VkID09PSBcImZ1bmN0aW9uXCIgPyBwcm9ncmVzc2VkKHZhbHVlKSA6IHZhbHVlO1xuICAgIH1cblxuICAgIG5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi5wcm9taXNlRGlzcGF0Y2goZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICBpZiAoZG9uZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRvbmUgPSB0cnVlO1xuXG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKF9mdWxmaWxsZWQodmFsdWUpKTtcbiAgICAgICAgfSwgXCJ3aGVuXCIsIFtmdW5jdGlvbiAoZXhjZXB0aW9uKSB7XG4gICAgICAgICAgICBpZiAoZG9uZSkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRvbmUgPSB0cnVlO1xuXG4gICAgICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKF9yZWplY3RlZChleGNlcHRpb24pKTtcbiAgICAgICAgfV0pO1xuICAgIH0pO1xuXG4gICAgLy8gUHJvZ3Jlc3MgcHJvcGFnYXRvciBuZWVkIHRvIGJlIGF0dGFjaGVkIGluIHRoZSBjdXJyZW50IHRpY2suXG4gICAgc2VsZi5wcm9taXNlRGlzcGF0Y2godm9pZCAwLCBcIndoZW5cIiwgW3ZvaWQgMCwgZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHZhciBuZXdWYWx1ZTtcbiAgICAgICAgdmFyIHRocmV3ID0gZmFsc2U7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBuZXdWYWx1ZSA9IF9wcm9ncmVzc2VkKHZhbHVlKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgdGhyZXcgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKFEub25lcnJvcikge1xuICAgICAgICAgICAgICAgIFEub25lcnJvcihlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhyZXcpIHtcbiAgICAgICAgICAgIGRlZmVycmVkLm5vdGlmeShuZXdWYWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbi8qKlxuICogUmVnaXN0ZXJzIGFuIG9ic2VydmVyIG9uIGEgcHJvbWlzZS5cbiAqXG4gKiBHdWFyYW50ZWVzOlxuICpcbiAqIDEuIHRoYXQgZnVsZmlsbGVkIGFuZCByZWplY3RlZCB3aWxsIGJlIGNhbGxlZCBvbmx5IG9uY2UuXG4gKiAyLiB0aGF0IGVpdGhlciB0aGUgZnVsZmlsbGVkIGNhbGxiYWNrIG9yIHRoZSByZWplY3RlZCBjYWxsYmFjayB3aWxsIGJlXG4gKiAgICBjYWxsZWQsIGJ1dCBub3QgYm90aC5cbiAqIDMuIHRoYXQgZnVsZmlsbGVkIGFuZCByZWplY3RlZCB3aWxsIG5vdCBiZSBjYWxsZWQgaW4gdGhpcyB0dXJuLlxuICpcbiAqIEBwYXJhbSB2YWx1ZSAgICAgIHByb21pc2Ugb3IgaW1tZWRpYXRlIHJlZmVyZW5jZSB0byBvYnNlcnZlXG4gKiBAcGFyYW0gZnVsZmlsbGVkICBmdW5jdGlvbiB0byBiZSBjYWxsZWQgd2l0aCB0aGUgZnVsZmlsbGVkIHZhbHVlXG4gKiBAcGFyYW0gcmVqZWN0ZWQgICBmdW5jdGlvbiB0byBiZSBjYWxsZWQgd2l0aCB0aGUgcmVqZWN0aW9uIGV4Y2VwdGlvblxuICogQHBhcmFtIHByb2dyZXNzZWQgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIG9uIGFueSBwcm9ncmVzcyBub3RpZmljYXRpb25zXG4gKiBAcmV0dXJuIHByb21pc2UgZm9yIHRoZSByZXR1cm4gdmFsdWUgZnJvbSB0aGUgaW52b2tlZCBjYWxsYmFja1xuICovXG5RLndoZW4gPSB3aGVuO1xuZnVuY3Rpb24gd2hlbih2YWx1ZSwgZnVsZmlsbGVkLCByZWplY3RlZCwgcHJvZ3Jlc3NlZCkge1xuICAgIHJldHVybiBRKHZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQsIHByb2dyZXNzZWQpO1xufVxuXG5Qcm9taXNlLnByb3RvdHlwZS50aGVuUmVzb2x2ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLnRoZW4oZnVuY3Rpb24gKCkgeyByZXR1cm4gdmFsdWU7IH0pO1xufTtcblxuUS50aGVuUmVzb2x2ZSA9IGZ1bmN0aW9uIChwcm9taXNlLCB2YWx1ZSkge1xuICAgIHJldHVybiBRKHByb21pc2UpLnRoZW5SZXNvbHZlKHZhbHVlKTtcbn07XG5cblByb21pc2UucHJvdG90eXBlLnRoZW5SZWplY3QgPSBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgcmV0dXJuIHRoaXMudGhlbihmdW5jdGlvbiAoKSB7IHRocm93IHJlYXNvbjsgfSk7XG59O1xuXG5RLnRoZW5SZWplY3QgPSBmdW5jdGlvbiAocHJvbWlzZSwgcmVhc29uKSB7XG4gICAgcmV0dXJuIFEocHJvbWlzZSkudGhlblJlamVjdChyZWFzb24pO1xufTtcblxuLyoqXG4gKiBJZiBhbiBvYmplY3QgaXMgbm90IGEgcHJvbWlzZSwgaXQgaXMgYXMgXCJuZWFyXCIgYXMgcG9zc2libGUuXG4gKiBJZiBhIHByb21pc2UgaXMgcmVqZWN0ZWQsIGl0IGlzIGFzIFwibmVhclwiIGFzIHBvc3NpYmxlIHRvby5cbiAqIElmIGl04oCZcyBhIGZ1bGZpbGxlZCBwcm9taXNlLCB0aGUgZnVsZmlsbG1lbnQgdmFsdWUgaXMgbmVhcmVyLlxuICogSWYgaXTigJlzIGEgZGVmZXJyZWQgcHJvbWlzZSBhbmQgdGhlIGRlZmVycmVkIGhhcyBiZWVuIHJlc29sdmVkLCB0aGVcbiAqIHJlc29sdXRpb24gaXMgXCJuZWFyZXJcIi5cbiAqIEBwYXJhbSBvYmplY3RcbiAqIEByZXR1cm5zIG1vc3QgcmVzb2x2ZWQgKG5lYXJlc3QpIGZvcm0gb2YgdGhlIG9iamVjdFxuICovXG5cbi8vIFhYWCBzaG91bGQgd2UgcmUtZG8gdGhpcz9cblEubmVhcmVyID0gbmVhcmVyO1xuZnVuY3Rpb24gbmVhcmVyKHZhbHVlKSB7XG4gICAgaWYgKGlzUHJvbWlzZSh2YWx1ZSkpIHtcbiAgICAgICAgdmFyIGluc3BlY3RlZCA9IHZhbHVlLmluc3BlY3QoKTtcbiAgICAgICAgaWYgKGluc3BlY3RlZC5zdGF0ZSA9PT0gXCJmdWxmaWxsZWRcIikge1xuICAgICAgICAgICAgcmV0dXJuIGluc3BlY3RlZC52YWx1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdmFsdWU7XG59XG5cbi8qKlxuICogQHJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gb2JqZWN0IGlzIGEgcHJvbWlzZS5cbiAqIE90aGVyd2lzZSBpdCBpcyBhIGZ1bGZpbGxlZCB2YWx1ZS5cbiAqL1xuUS5pc1Byb21pc2UgPSBpc1Byb21pc2U7XG5mdW5jdGlvbiBpc1Byb21pc2Uob2JqZWN0KSB7XG4gICAgcmV0dXJuIGlzT2JqZWN0KG9iamVjdCkgJiZcbiAgICAgICAgdHlwZW9mIG9iamVjdC5wcm9taXNlRGlzcGF0Y2ggPT09IFwiZnVuY3Rpb25cIiAmJlxuICAgICAgICB0eXBlb2Ygb2JqZWN0Lmluc3BlY3QgPT09IFwiZnVuY3Rpb25cIjtcbn1cblxuUS5pc1Byb21pc2VBbGlrZSA9IGlzUHJvbWlzZUFsaWtlO1xuZnVuY3Rpb24gaXNQcm9taXNlQWxpa2Uob2JqZWN0KSB7XG4gICAgcmV0dXJuIGlzT2JqZWN0KG9iamVjdCkgJiYgdHlwZW9mIG9iamVjdC50aGVuID09PSBcImZ1bmN0aW9uXCI7XG59XG5cbi8qKlxuICogQHJldHVybnMgd2hldGhlciB0aGUgZ2l2ZW4gb2JqZWN0IGlzIGEgcGVuZGluZyBwcm9taXNlLCBtZWFuaW5nIG5vdFxuICogZnVsZmlsbGVkIG9yIHJlamVjdGVkLlxuICovXG5RLmlzUGVuZGluZyA9IGlzUGVuZGluZztcbmZ1bmN0aW9uIGlzUGVuZGluZyhvYmplY3QpIHtcbiAgICByZXR1cm4gaXNQcm9taXNlKG9iamVjdCkgJiYgb2JqZWN0Lmluc3BlY3QoKS5zdGF0ZSA9PT0gXCJwZW5kaW5nXCI7XG59XG5cblByb21pc2UucHJvdG90eXBlLmlzUGVuZGluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5pbnNwZWN0KCkuc3RhdGUgPT09IFwicGVuZGluZ1wiO1xufTtcblxuLyoqXG4gKiBAcmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlbiBvYmplY3QgaXMgYSB2YWx1ZSBvciBmdWxmaWxsZWRcbiAqIHByb21pc2UuXG4gKi9cblEuaXNGdWxmaWxsZWQgPSBpc0Z1bGZpbGxlZDtcbmZ1bmN0aW9uIGlzRnVsZmlsbGVkKG9iamVjdCkge1xuICAgIHJldHVybiAhaXNQcm9taXNlKG9iamVjdCkgfHwgb2JqZWN0Lmluc3BlY3QoKS5zdGF0ZSA9PT0gXCJmdWxmaWxsZWRcIjtcbn1cblxuUHJvbWlzZS5wcm90b3R5cGUuaXNGdWxmaWxsZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuaW5zcGVjdCgpLnN0YXRlID09PSBcImZ1bGZpbGxlZFwiO1xufTtcblxuLyoqXG4gKiBAcmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlbiBvYmplY3QgaXMgYSByZWplY3RlZCBwcm9taXNlLlxuICovXG5RLmlzUmVqZWN0ZWQgPSBpc1JlamVjdGVkO1xuZnVuY3Rpb24gaXNSZWplY3RlZChvYmplY3QpIHtcbiAgICByZXR1cm4gaXNQcm9taXNlKG9iamVjdCkgJiYgb2JqZWN0Lmluc3BlY3QoKS5zdGF0ZSA9PT0gXCJyZWplY3RlZFwiO1xufVxuXG5Qcm9taXNlLnByb3RvdHlwZS5pc1JlamVjdGVkID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmluc3BlY3QoKS5zdGF0ZSA9PT0gXCJyZWplY3RlZFwiO1xufTtcblxuLy8vLyBCRUdJTiBVTkhBTkRMRUQgUkVKRUNUSU9OIFRSQUNLSU5HXG5cbi8vIFRoaXMgcHJvbWlzZSBsaWJyYXJ5IGNvbnN1bWVzIGV4Y2VwdGlvbnMgdGhyb3duIGluIGhhbmRsZXJzIHNvIHRoZXkgY2FuIGJlXG4vLyBoYW5kbGVkIGJ5IGEgc3Vic2VxdWVudCBwcm9taXNlLiAgVGhlIGV4Y2VwdGlvbnMgZ2V0IGFkZGVkIHRvIHRoaXMgYXJyYXkgd2hlblxuLy8gdGhleSBhcmUgY3JlYXRlZCwgYW5kIHJlbW92ZWQgd2hlbiB0aGV5IGFyZSBoYW5kbGVkLiAgTm90ZSB0aGF0IGluIEVTNiBvclxuLy8gc2hpbW1lZCBlbnZpcm9ubWVudHMsIHRoaXMgd291bGQgbmF0dXJhbGx5IGJlIGEgYFNldGAuXG52YXIgdW5oYW5kbGVkUmVhc29ucyA9IFtdO1xudmFyIHVuaGFuZGxlZFJlamVjdGlvbnMgPSBbXTtcbnZhciB1bmhhbmRsZWRSZWFzb25zRGlzcGxheWVkID0gZmFsc2U7XG52YXIgdHJhY2tVbmhhbmRsZWRSZWplY3Rpb25zID0gdHJ1ZTtcbmZ1bmN0aW9uIGRpc3BsYXlVbmhhbmRsZWRSZWFzb25zKCkge1xuICAgIGlmIChcbiAgICAgICAgIXVuaGFuZGxlZFJlYXNvbnNEaXNwbGF5ZWQgJiZcbiAgICAgICAgdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuICAgICAgICB3aW5kb3cuY29uc29sZVxuICAgICkge1xuICAgICAgICBjb25zb2xlLndhcm4oXCJbUV0gVW5oYW5kbGVkIHJlamVjdGlvbiByZWFzb25zIChzaG91bGQgYmUgZW1wdHkpOlwiLFxuICAgICAgICAgICAgICAgICAgICAgdW5oYW5kbGVkUmVhc29ucyk7XG4gICAgfVxuXG4gICAgdW5oYW5kbGVkUmVhc29uc0Rpc3BsYXllZCA9IHRydWU7XG59XG5cbmZ1bmN0aW9uIGxvZ1VuaGFuZGxlZFJlYXNvbnMoKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB1bmhhbmRsZWRSZWFzb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciByZWFzb24gPSB1bmhhbmRsZWRSZWFzb25zW2ldO1xuICAgICAgICBjb25zb2xlLndhcm4oXCJVbmhhbmRsZWQgcmVqZWN0aW9uIHJlYXNvbjpcIiwgcmVhc29uKTtcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHJlc2V0VW5oYW5kbGVkUmVqZWN0aW9ucygpIHtcbiAgICB1bmhhbmRsZWRSZWFzb25zLmxlbmd0aCA9IDA7XG4gICAgdW5oYW5kbGVkUmVqZWN0aW9ucy5sZW5ndGggPSAwO1xuICAgIHVuaGFuZGxlZFJlYXNvbnNEaXNwbGF5ZWQgPSBmYWxzZTtcblxuICAgIGlmICghdHJhY2tVbmhhbmRsZWRSZWplY3Rpb25zKSB7XG4gICAgICAgIHRyYWNrVW5oYW5kbGVkUmVqZWN0aW9ucyA9IHRydWU7XG5cbiAgICAgICAgLy8gU2hvdyB1bmhhbmRsZWQgcmVqZWN0aW9uIHJlYXNvbnMgaWYgTm9kZSBleGl0cyB3aXRob3V0IGhhbmRsaW5nIGFuXG4gICAgICAgIC8vIG91dHN0YW5kaW5nIHJlamVjdGlvbi4gIChOb3RlIHRoYXQgQnJvd3NlcmlmeSBwcmVzZW50bHkgcHJvZHVjZXMgYVxuICAgICAgICAvLyBgcHJvY2Vzc2AgZ2xvYmFsIHdpdGhvdXQgdGhlIGBFdmVudEVtaXR0ZXJgIGBvbmAgbWV0aG9kLilcbiAgICAgICAgaWYgKHR5cGVvZiBwcm9jZXNzICE9PSBcInVuZGVmaW5lZFwiICYmIHByb2Nlc3Mub24pIHtcbiAgICAgICAgICAgIHByb2Nlc3Mub24oXCJleGl0XCIsIGxvZ1VuaGFuZGxlZFJlYXNvbnMpO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5mdW5jdGlvbiB0cmFja1JlamVjdGlvbihwcm9taXNlLCByZWFzb24pIHtcbiAgICBpZiAoIXRyYWNrVW5oYW5kbGVkUmVqZWN0aW9ucykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdW5oYW5kbGVkUmVqZWN0aW9ucy5wdXNoKHByb21pc2UpO1xuICAgIGlmIChyZWFzb24gJiYgdHlwZW9mIHJlYXNvbi5zdGFjayAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICB1bmhhbmRsZWRSZWFzb25zLnB1c2gocmVhc29uLnN0YWNrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB1bmhhbmRsZWRSZWFzb25zLnB1c2goXCIobm8gc3RhY2spIFwiICsgcmVhc29uKTtcbiAgICB9XG4gICAgZGlzcGxheVVuaGFuZGxlZFJlYXNvbnMoKTtcbn1cblxuZnVuY3Rpb24gdW50cmFja1JlamVjdGlvbihwcm9taXNlKSB7XG4gICAgaWYgKCF0cmFja1VuaGFuZGxlZFJlamVjdGlvbnMpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBhdCA9IGFycmF5X2luZGV4T2YodW5oYW5kbGVkUmVqZWN0aW9ucywgcHJvbWlzZSk7XG4gICAgaWYgKGF0ICE9PSAtMSkge1xuICAgICAgICB1bmhhbmRsZWRSZWplY3Rpb25zLnNwbGljZShhdCwgMSk7XG4gICAgICAgIHVuaGFuZGxlZFJlYXNvbnMuc3BsaWNlKGF0LCAxKTtcbiAgICB9XG59XG5cblEucmVzZXRVbmhhbmRsZWRSZWplY3Rpb25zID0gcmVzZXRVbmhhbmRsZWRSZWplY3Rpb25zO1xuXG5RLmdldFVuaGFuZGxlZFJlYXNvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgLy8gTWFrZSBhIGNvcHkgc28gdGhhdCBjb25zdW1lcnMgY2FuJ3QgaW50ZXJmZXJlIHdpdGggb3VyIGludGVybmFsIHN0YXRlLlxuICAgIHJldHVybiB1bmhhbmRsZWRSZWFzb25zLnNsaWNlKCk7XG59O1xuXG5RLnN0b3BVbmhhbmRsZWRSZWplY3Rpb25UcmFja2luZyA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXNldFVuaGFuZGxlZFJlamVjdGlvbnMoKTtcbiAgICBpZiAodHlwZW9mIHByb2Nlc3MgIT09IFwidW5kZWZpbmVkXCIgJiYgcHJvY2Vzcy5vbikge1xuICAgICAgICBwcm9jZXNzLnJlbW92ZUxpc3RlbmVyKFwiZXhpdFwiLCBsb2dVbmhhbmRsZWRSZWFzb25zKTtcbiAgICB9XG4gICAgdHJhY2tVbmhhbmRsZWRSZWplY3Rpb25zID0gZmFsc2U7XG59O1xuXG5yZXNldFVuaGFuZGxlZFJlamVjdGlvbnMoKTtcblxuLy8vLyBFTkQgVU5IQU5ETEVEIFJFSkVDVElPTiBUUkFDS0lOR1xuXG4vKipcbiAqIENvbnN0cnVjdHMgYSByZWplY3RlZCBwcm9taXNlLlxuICogQHBhcmFtIHJlYXNvbiB2YWx1ZSBkZXNjcmliaW5nIHRoZSBmYWlsdXJlXG4gKi9cblEucmVqZWN0ID0gcmVqZWN0O1xuZnVuY3Rpb24gcmVqZWN0KHJlYXNvbikge1xuICAgIHZhciByZWplY3Rpb24gPSBQcm9taXNlKHtcbiAgICAgICAgXCJ3aGVuXCI6IGZ1bmN0aW9uIChyZWplY3RlZCkge1xuICAgICAgICAgICAgLy8gbm90ZSB0aGF0IHRoZSBlcnJvciBoYXMgYmVlbiBoYW5kbGVkXG4gICAgICAgICAgICBpZiAocmVqZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICB1bnRyYWNrUmVqZWN0aW9uKHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlamVjdGVkID8gcmVqZWN0ZWQocmVhc29uKSA6IHRoaXM7XG4gICAgICAgIH1cbiAgICB9LCBmdW5jdGlvbiBmYWxsYmFjaygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSwgZnVuY3Rpb24gaW5zcGVjdCgpIHtcbiAgICAgICAgcmV0dXJuIHsgc3RhdGU6IFwicmVqZWN0ZWRcIiwgcmVhc29uOiByZWFzb24gfTtcbiAgICB9KTtcblxuICAgIC8vIE5vdGUgdGhhdCB0aGUgcmVhc29uIGhhcyBub3QgYmVlbiBoYW5kbGVkLlxuICAgIHRyYWNrUmVqZWN0aW9uKHJlamVjdGlvbiwgcmVhc29uKTtcblxuICAgIHJldHVybiByZWplY3Rpb247XG59XG5cbi8qKlxuICogQ29uc3RydWN0cyBhIGZ1bGZpbGxlZCBwcm9taXNlIGZvciBhbiBpbW1lZGlhdGUgcmVmZXJlbmNlLlxuICogQHBhcmFtIHZhbHVlIGltbWVkaWF0ZSByZWZlcmVuY2VcbiAqL1xuUS5mdWxmaWxsID0gZnVsZmlsbDtcbmZ1bmN0aW9uIGZ1bGZpbGwodmFsdWUpIHtcbiAgICByZXR1cm4gUHJvbWlzZSh7XG4gICAgICAgIFwid2hlblwiOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH0sXG4gICAgICAgIFwiZ2V0XCI6IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWVbbmFtZV07XG4gICAgICAgIH0sXG4gICAgICAgIFwic2V0XCI6IGZ1bmN0aW9uIChuYW1lLCByaHMpIHtcbiAgICAgICAgICAgIHZhbHVlW25hbWVdID0gcmhzO1xuICAgICAgICB9LFxuICAgICAgICBcImRlbGV0ZVwiOiBmdW5jdGlvbiAobmFtZSkge1xuICAgICAgICAgICAgZGVsZXRlIHZhbHVlW25hbWVdO1xuICAgICAgICB9LFxuICAgICAgICBcInBvc3RcIjogZnVuY3Rpb24gKG5hbWUsIGFyZ3MpIHtcbiAgICAgICAgICAgIC8vIE1hcmsgTWlsbGVyIHByb3Bvc2VzIHRoYXQgcG9zdCB3aXRoIG5vIG5hbWUgc2hvdWxkIGFwcGx5IGFcbiAgICAgICAgICAgIC8vIHByb21pc2VkIGZ1bmN0aW9uLlxuICAgICAgICAgICAgaWYgKG5hbWUgPT09IG51bGwgfHwgbmFtZSA9PT0gdm9pZCAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlLmFwcGx5KHZvaWQgMCwgYXJncyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZVtuYW1lXS5hcHBseSh2YWx1ZSwgYXJncyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwiYXBwbHlcIjogZnVuY3Rpb24gKHRoaXNwLCBhcmdzKSB7XG4gICAgICAgICAgICByZXR1cm4gdmFsdWUuYXBwbHkodGhpc3AsIGFyZ3MpO1xuICAgICAgICB9LFxuICAgICAgICBcImtleXNcIjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIG9iamVjdF9rZXlzKHZhbHVlKTtcbiAgICAgICAgfVxuICAgIH0sIHZvaWQgMCwgZnVuY3Rpb24gaW5zcGVjdCgpIHtcbiAgICAgICAgcmV0dXJuIHsgc3RhdGU6IFwiZnVsZmlsbGVkXCIsIHZhbHVlOiB2YWx1ZSB9O1xuICAgIH0pO1xufVxuXG4vKipcbiAqIENvbnZlcnRzIHRoZW5hYmxlcyB0byBRIHByb21pc2VzLlxuICogQHBhcmFtIHByb21pc2UgdGhlbmFibGUgcHJvbWlzZVxuICogQHJldHVybnMgYSBRIHByb21pc2VcbiAqL1xuZnVuY3Rpb24gY29lcmNlKHByb21pc2UpIHtcbiAgICB2YXIgZGVmZXJyZWQgPSBkZWZlcigpO1xuICAgIG5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHByb21pc2UudGhlbihkZWZlcnJlZC5yZXNvbHZlLCBkZWZlcnJlZC5yZWplY3QsIGRlZmVycmVkLm5vdGlmeSk7XG4gICAgICAgIH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuICAgICAgICAgICAgZGVmZXJyZWQucmVqZWN0KGV4Y2VwdGlvbik7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn1cblxuLyoqXG4gKiBBbm5vdGF0ZXMgYW4gb2JqZWN0IHN1Y2ggdGhhdCBpdCB3aWxsIG5ldmVyIGJlXG4gKiB0cmFuc2ZlcnJlZCBhd2F5IGZyb20gdGhpcyBwcm9jZXNzIG92ZXIgYW55IHByb21pc2VcbiAqIGNvbW11bmljYXRpb24gY2hhbm5lbC5cbiAqIEBwYXJhbSBvYmplY3RcbiAqIEByZXR1cm5zIHByb21pc2UgYSB3cmFwcGluZyBvZiB0aGF0IG9iamVjdCB0aGF0XG4gKiBhZGRpdGlvbmFsbHkgcmVzcG9uZHMgdG8gdGhlIFwiaXNEZWZcIiBtZXNzYWdlXG4gKiB3aXRob3V0IGEgcmVqZWN0aW9uLlxuICovXG5RLm1hc3RlciA9IG1hc3RlcjtcbmZ1bmN0aW9uIG1hc3RlcihvYmplY3QpIHtcbiAgICByZXR1cm4gUHJvbWlzZSh7XG4gICAgICAgIFwiaXNEZWZcIjogZnVuY3Rpb24gKCkge31cbiAgICB9LCBmdW5jdGlvbiBmYWxsYmFjayhvcCwgYXJncykge1xuICAgICAgICByZXR1cm4gZGlzcGF0Y2gob2JqZWN0LCBvcCwgYXJncyk7XG4gICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gUShvYmplY3QpLmluc3BlY3QoKTtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBTcHJlYWRzIHRoZSB2YWx1ZXMgb2YgYSBwcm9taXNlZCBhcnJheSBvZiBhcmd1bWVudHMgaW50byB0aGVcbiAqIGZ1bGZpbGxtZW50IGNhbGxiYWNrLlxuICogQHBhcmFtIGZ1bGZpbGxlZCBjYWxsYmFjayB0aGF0IHJlY2VpdmVzIHZhcmlhZGljIGFyZ3VtZW50cyBmcm9tIHRoZVxuICogcHJvbWlzZWQgYXJyYXlcbiAqIEBwYXJhbSByZWplY3RlZCBjYWxsYmFjayB0aGF0IHJlY2VpdmVzIHRoZSBleGNlcHRpb24gaWYgdGhlIHByb21pc2VcbiAqIGlzIHJlamVjdGVkLlxuICogQHJldHVybnMgYSBwcm9taXNlIGZvciB0aGUgcmV0dXJuIHZhbHVlIG9yIHRocm93biBleGNlcHRpb24gb2ZcbiAqIGVpdGhlciBjYWxsYmFjay5cbiAqL1xuUS5zcHJlYWQgPSBzcHJlYWQ7XG5mdW5jdGlvbiBzcHJlYWQodmFsdWUsIGZ1bGZpbGxlZCwgcmVqZWN0ZWQpIHtcbiAgICByZXR1cm4gUSh2YWx1ZSkuc3ByZWFkKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpO1xufVxuXG5Qcm9taXNlLnByb3RvdHlwZS5zcHJlYWQgPSBmdW5jdGlvbiAoZnVsZmlsbGVkLCByZWplY3RlZCkge1xuICAgIHJldHVybiB0aGlzLmFsbCgpLnRoZW4oZnVuY3Rpb24gKGFycmF5KSB7XG4gICAgICAgIHJldHVybiBmdWxmaWxsZWQuYXBwbHkodm9pZCAwLCBhcnJheSk7XG4gICAgfSwgcmVqZWN0ZWQpO1xufTtcblxuLyoqXG4gKiBUaGUgYXN5bmMgZnVuY3Rpb24gaXMgYSBkZWNvcmF0b3IgZm9yIGdlbmVyYXRvciBmdW5jdGlvbnMsIHR1cm5pbmdcbiAqIHRoZW0gaW50byBhc3luY2hyb25vdXMgZ2VuZXJhdG9ycy4gIEFsdGhvdWdoIGdlbmVyYXRvcnMgYXJlIG9ubHkgcGFydFxuICogb2YgdGhlIG5ld2VzdCBFQ01BU2NyaXB0IDYgZHJhZnRzLCB0aGlzIGNvZGUgZG9lcyBub3QgY2F1c2Ugc3ludGF4XG4gKiBlcnJvcnMgaW4gb2xkZXIgZW5naW5lcy4gIFRoaXMgY29kZSBzaG91bGQgY29udGludWUgdG8gd29yayBhbmQgd2lsbFxuICogaW4gZmFjdCBpbXByb3ZlIG92ZXIgdGltZSBhcyB0aGUgbGFuZ3VhZ2UgaW1wcm92ZXMuXG4gKlxuICogRVM2IGdlbmVyYXRvcnMgYXJlIGN1cnJlbnRseSBwYXJ0IG9mIFY4IHZlcnNpb24gMy4xOSB3aXRoIHRoZVxuICogLS1oYXJtb255LWdlbmVyYXRvcnMgcnVudGltZSBmbGFnIGVuYWJsZWQuICBTcGlkZXJNb25rZXkgaGFzIGhhZCB0aGVtXG4gKiBmb3IgbG9uZ2VyLCBidXQgdW5kZXIgYW4gb2xkZXIgUHl0aG9uLWluc3BpcmVkIGZvcm0uICBUaGlzIGZ1bmN0aW9uXG4gKiB3b3JrcyBvbiBib3RoIGtpbmRzIG9mIGdlbmVyYXRvcnMuXG4gKlxuICogRGVjb3JhdGVzIGEgZ2VuZXJhdG9yIGZ1bmN0aW9uIHN1Y2ggdGhhdDpcbiAqICAtIGl0IG1heSB5aWVsZCBwcm9taXNlc1xuICogIC0gZXhlY3V0aW9uIHdpbGwgY29udGludWUgd2hlbiB0aGF0IHByb21pc2UgaXMgZnVsZmlsbGVkXG4gKiAgLSB0aGUgdmFsdWUgb2YgdGhlIHlpZWxkIGV4cHJlc3Npb24gd2lsbCBiZSB0aGUgZnVsZmlsbGVkIHZhbHVlXG4gKiAgLSBpdCByZXR1cm5zIGEgcHJvbWlzZSBmb3IgdGhlIHJldHVybiB2YWx1ZSAod2hlbiB0aGUgZ2VuZXJhdG9yXG4gKiAgICBzdG9wcyBpdGVyYXRpbmcpXG4gKiAgLSB0aGUgZGVjb3JhdGVkIGZ1bmN0aW9uIHJldHVybnMgYSBwcm9taXNlIGZvciB0aGUgcmV0dXJuIHZhbHVlXG4gKiAgICBvZiB0aGUgZ2VuZXJhdG9yIG9yIHRoZSBmaXJzdCByZWplY3RlZCBwcm9taXNlIGFtb25nIHRob3NlXG4gKiAgICB5aWVsZGVkLlxuICogIC0gaWYgYW4gZXJyb3IgaXMgdGhyb3duIGluIHRoZSBnZW5lcmF0b3IsIGl0IHByb3BhZ2F0ZXMgdGhyb3VnaFxuICogICAgZXZlcnkgZm9sbG93aW5nIHlpZWxkIHVudGlsIGl0IGlzIGNhdWdodCwgb3IgdW50aWwgaXQgZXNjYXBlc1xuICogICAgdGhlIGdlbmVyYXRvciBmdW5jdGlvbiBhbHRvZ2V0aGVyLCBhbmQgaXMgdHJhbnNsYXRlZCBpbnRvIGFcbiAqICAgIHJlamVjdGlvbiBmb3IgdGhlIHByb21pc2UgcmV0dXJuZWQgYnkgdGhlIGRlY29yYXRlZCBnZW5lcmF0b3IuXG4gKi9cblEuYXN5bmMgPSBhc3luYztcbmZ1bmN0aW9uIGFzeW5jKG1ha2VHZW5lcmF0b3IpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAvLyB3aGVuIHZlcmIgaXMgXCJzZW5kXCIsIGFyZyBpcyBhIHZhbHVlXG4gICAgICAgIC8vIHdoZW4gdmVyYiBpcyBcInRocm93XCIsIGFyZyBpcyBhbiBleGNlcHRpb25cbiAgICAgICAgZnVuY3Rpb24gY29udGludWVyKHZlcmIsIGFyZykge1xuICAgICAgICAgICAgdmFyIHJlc3VsdDtcbiAgICAgICAgICAgIGlmIChoYXNFUzZHZW5lcmF0b3JzKSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gZ2VuZXJhdG9yW3ZlcmJdKGFyZyk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QoZXhjZXB0aW9uKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdC5kb25lKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQudmFsdWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHdoZW4ocmVzdWx0LnZhbHVlLCBjYWxsYmFjaywgZXJyYmFjayk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBGSVhNRTogUmVtb3ZlIHRoaXMgY2FzZSB3aGVuIFNNIGRvZXMgRVM2IGdlbmVyYXRvcnMuXG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gZ2VuZXJhdG9yW3ZlcmJdKGFyZyk7XG4gICAgICAgICAgICAgICAgfSBjYXRjaCAoZXhjZXB0aW9uKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc1N0b3BJdGVyYXRpb24oZXhjZXB0aW9uKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGV4Y2VwdGlvbi52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZWplY3QoZXhjZXB0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gd2hlbihyZXN1bHQsIGNhbGxiYWNrLCBlcnJiYWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2YXIgZ2VuZXJhdG9yID0gbWFrZUdlbmVyYXRvci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB2YXIgY2FsbGJhY2sgPSBjb250aW51ZXIuYmluZChjb250aW51ZXIsIFwibmV4dFwiKTtcbiAgICAgICAgdmFyIGVycmJhY2sgPSBjb250aW51ZXIuYmluZChjb250aW51ZXIsIFwidGhyb3dcIik7XG4gICAgICAgIHJldHVybiBjYWxsYmFjaygpO1xuICAgIH07XG59XG5cbi8qKlxuICogVGhlIHNwYXduIGZ1bmN0aW9uIGlzIGEgc21hbGwgd3JhcHBlciBhcm91bmQgYXN5bmMgdGhhdCBpbW1lZGlhdGVseVxuICogY2FsbHMgdGhlIGdlbmVyYXRvciBhbmQgYWxzbyBlbmRzIHRoZSBwcm9taXNlIGNoYWluLCBzbyB0aGF0IGFueVxuICogdW5oYW5kbGVkIGVycm9ycyBhcmUgdGhyb3duIGluc3RlYWQgb2YgZm9yd2FyZGVkIHRvIHRoZSBlcnJvclxuICogaGFuZGxlci4gVGhpcyBpcyB1c2VmdWwgYmVjYXVzZSBpdCdzIGV4dHJlbWVseSBjb21tb24gdG8gcnVuXG4gKiBnZW5lcmF0b3JzIGF0IHRoZSB0b3AtbGV2ZWwgdG8gd29yayB3aXRoIGxpYnJhcmllcy5cbiAqL1xuUS5zcGF3biA9IHNwYXduO1xuZnVuY3Rpb24gc3Bhd24obWFrZUdlbmVyYXRvcikge1xuICAgIFEuZG9uZShRLmFzeW5jKG1ha2VHZW5lcmF0b3IpKCkpO1xufVxuXG4vLyBGSVhNRTogUmVtb3ZlIHRoaXMgaW50ZXJmYWNlIG9uY2UgRVM2IGdlbmVyYXRvcnMgYXJlIGluIFNwaWRlck1vbmtleS5cbi8qKlxuICogVGhyb3dzIGEgUmV0dXJuVmFsdWUgZXhjZXB0aW9uIHRvIHN0b3AgYW4gYXN5bmNocm9ub3VzIGdlbmVyYXRvci5cbiAqXG4gKiBUaGlzIGludGVyZmFjZSBpcyBhIHN0b3AtZ2FwIG1lYXN1cmUgdG8gc3VwcG9ydCBnZW5lcmF0b3IgcmV0dXJuXG4gKiB2YWx1ZXMgaW4gb2xkZXIgRmlyZWZveC9TcGlkZXJNb25rZXkuICBJbiBicm93c2VycyB0aGF0IHN1cHBvcnQgRVM2XG4gKiBnZW5lcmF0b3JzIGxpa2UgQ2hyb21pdW0gMjksIGp1c3QgdXNlIFwicmV0dXJuXCIgaW4geW91ciBnZW5lcmF0b3JcbiAqIGZ1bmN0aW9ucy5cbiAqXG4gKiBAcGFyYW0gdmFsdWUgdGhlIHJldHVybiB2YWx1ZSBmb3IgdGhlIHN1cnJvdW5kaW5nIGdlbmVyYXRvclxuICogQHRocm93cyBSZXR1cm5WYWx1ZSBleGNlcHRpb24gd2l0aCB0aGUgdmFsdWUuXG4gKiBAZXhhbXBsZVxuICogLy8gRVM2IHN0eWxlXG4gKiBRLmFzeW5jKGZ1bmN0aW9uKiAoKSB7XG4gKiAgICAgIHZhciBmb28gPSB5aWVsZCBnZXRGb29Qcm9taXNlKCk7XG4gKiAgICAgIHZhciBiYXIgPSB5aWVsZCBnZXRCYXJQcm9taXNlKCk7XG4gKiAgICAgIHJldHVybiBmb28gKyBiYXI7XG4gKiB9KVxuICogLy8gT2xkZXIgU3BpZGVyTW9ua2V5IHN0eWxlXG4gKiBRLmFzeW5jKGZ1bmN0aW9uICgpIHtcbiAqICAgICAgdmFyIGZvbyA9IHlpZWxkIGdldEZvb1Byb21pc2UoKTtcbiAqICAgICAgdmFyIGJhciA9IHlpZWxkIGdldEJhclByb21pc2UoKTtcbiAqICAgICAgUS5yZXR1cm4oZm9vICsgYmFyKTtcbiAqIH0pXG4gKi9cblFbXCJyZXR1cm5cIl0gPSBfcmV0dXJuO1xuZnVuY3Rpb24gX3JldHVybih2YWx1ZSkge1xuICAgIHRocm93IG5ldyBRUmV0dXJuVmFsdWUodmFsdWUpO1xufVxuXG4vKipcbiAqIFRoZSBwcm9taXNlZCBmdW5jdGlvbiBkZWNvcmF0b3IgZW5zdXJlcyB0aGF0IGFueSBwcm9taXNlIGFyZ3VtZW50c1xuICogYXJlIHNldHRsZWQgYW5kIHBhc3NlZCBhcyB2YWx1ZXMgKGB0aGlzYCBpcyBhbHNvIHNldHRsZWQgYW5kIHBhc3NlZFxuICogYXMgYSB2YWx1ZSkuICBJdCB3aWxsIGFsc28gZW5zdXJlIHRoYXQgdGhlIHJlc3VsdCBvZiBhIGZ1bmN0aW9uIGlzXG4gKiBhbHdheXMgYSBwcm9taXNlLlxuICpcbiAqIEBleGFtcGxlXG4gKiB2YXIgYWRkID0gUS5wcm9taXNlZChmdW5jdGlvbiAoYSwgYikge1xuICogICAgIHJldHVybiBhICsgYjtcbiAqIH0pO1xuICogYWRkKFEoYSksIFEoQikpO1xuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIFRoZSBmdW5jdGlvbiB0byBkZWNvcmF0ZVxuICogQHJldHVybnMge2Z1bmN0aW9ufSBhIGZ1bmN0aW9uIHRoYXQgaGFzIGJlZW4gZGVjb3JhdGVkLlxuICovXG5RLnByb21pc2VkID0gcHJvbWlzZWQ7XG5mdW5jdGlvbiBwcm9taXNlZChjYWxsYmFjaykge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBzcHJlYWQoW3RoaXMsIGFsbChhcmd1bWVudHMpXSwgZnVuY3Rpb24gKHNlbGYsIGFyZ3MpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjay5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbn1cblxuLyoqXG4gKiBzZW5kcyBhIG1lc3NhZ2UgdG8gYSB2YWx1ZSBpbiBhIGZ1dHVyZSB0dXJuXG4gKiBAcGFyYW0gb2JqZWN0KiB0aGUgcmVjaXBpZW50XG4gKiBAcGFyYW0gb3AgdGhlIG5hbWUgb2YgdGhlIG1lc3NhZ2Ugb3BlcmF0aW9uLCBlLmcuLCBcIndoZW5cIixcbiAqIEBwYXJhbSBhcmdzIGZ1cnRoZXIgYXJndW1lbnRzIHRvIGJlIGZvcndhcmRlZCB0byB0aGUgb3BlcmF0aW9uXG4gKiBAcmV0dXJucyByZXN1bHQge1Byb21pc2V9IGEgcHJvbWlzZSBmb3IgdGhlIHJlc3VsdCBvZiB0aGUgb3BlcmF0aW9uXG4gKi9cblEuZGlzcGF0Y2ggPSBkaXNwYXRjaDtcbmZ1bmN0aW9uIGRpc3BhdGNoKG9iamVjdCwgb3AsIGFyZ3MpIHtcbiAgICByZXR1cm4gUShvYmplY3QpLmRpc3BhdGNoKG9wLCBhcmdzKTtcbn1cblxuUHJvbWlzZS5wcm90b3R5cGUuZGlzcGF0Y2ggPSBmdW5jdGlvbiAob3AsIGFyZ3MpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgdmFyIGRlZmVycmVkID0gZGVmZXIoKTtcbiAgICBuZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNlbGYucHJvbWlzZURpc3BhdGNoKGRlZmVycmVkLnJlc29sdmUsIG9wLCBhcmdzKTtcbiAgICB9KTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbi8qKlxuICogR2V0cyB0aGUgdmFsdWUgb2YgYSBwcm9wZXJ0eSBpbiBhIGZ1dHVyZSB0dXJuLlxuICogQHBhcmFtIG9iamVjdCAgICBwcm9taXNlIG9yIGltbWVkaWF0ZSByZWZlcmVuY2UgZm9yIHRhcmdldCBvYmplY3RcbiAqIEBwYXJhbSBuYW1lICAgICAgbmFtZSBvZiBwcm9wZXJ0eSB0byBnZXRcbiAqIEByZXR1cm4gcHJvbWlzZSBmb3IgdGhlIHByb3BlcnR5IHZhbHVlXG4gKi9cblEuZ2V0ID0gZnVuY3Rpb24gKG9iamVjdCwga2V5KSB7XG4gICAgcmV0dXJuIFEob2JqZWN0KS5kaXNwYXRjaChcImdldFwiLCBba2V5XSk7XG59O1xuXG5Qcm9taXNlLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2goXCJnZXRcIiwgW2tleV0pO1xufTtcblxuLyoqXG4gKiBTZXRzIHRoZSB2YWx1ZSBvZiBhIHByb3BlcnR5IGluIGEgZnV0dXJlIHR1cm4uXG4gKiBAcGFyYW0gb2JqZWN0ICAgIHByb21pc2Ugb3IgaW1tZWRpYXRlIHJlZmVyZW5jZSBmb3Igb2JqZWN0IG9iamVjdFxuICogQHBhcmFtIG5hbWUgICAgICBuYW1lIG9mIHByb3BlcnR5IHRvIHNldFxuICogQHBhcmFtIHZhbHVlICAgICBuZXcgdmFsdWUgb2YgcHJvcGVydHlcbiAqIEByZXR1cm4gcHJvbWlzZSBmb3IgdGhlIHJldHVybiB2YWx1ZVxuICovXG5RLnNldCA9IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgICByZXR1cm4gUShvYmplY3QpLmRpc3BhdGNoKFwic2V0XCIsIFtrZXksIHZhbHVlXSk7XG59O1xuXG5Qcm9taXNlLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgIHJldHVybiB0aGlzLmRpc3BhdGNoKFwic2V0XCIsIFtrZXksIHZhbHVlXSk7XG59O1xuXG4vKipcbiAqIERlbGV0ZXMgYSBwcm9wZXJ0eSBpbiBhIGZ1dHVyZSB0dXJuLlxuICogQHBhcmFtIG9iamVjdCAgICBwcm9taXNlIG9yIGltbWVkaWF0ZSByZWZlcmVuY2UgZm9yIHRhcmdldCBvYmplY3RcbiAqIEBwYXJhbSBuYW1lICAgICAgbmFtZSBvZiBwcm9wZXJ0eSB0byBkZWxldGVcbiAqIEByZXR1cm4gcHJvbWlzZSBmb3IgdGhlIHJldHVybiB2YWx1ZVxuICovXG5RLmRlbCA9IC8vIFhYWCBsZWdhY3lcblFbXCJkZWxldGVcIl0gPSBmdW5jdGlvbiAob2JqZWN0LCBrZXkpIHtcbiAgICByZXR1cm4gUShvYmplY3QpLmRpc3BhdGNoKFwiZGVsZXRlXCIsIFtrZXldKTtcbn07XG5cblByb21pc2UucHJvdG90eXBlLmRlbCA9IC8vIFhYWCBsZWdhY3lcblByb21pc2UucHJvdG90eXBlW1wiZGVsZXRlXCJdID0gZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiB0aGlzLmRpc3BhdGNoKFwiZGVsZXRlXCIsIFtrZXldKTtcbn07XG5cbi8qKlxuICogSW52b2tlcyBhIG1ldGhvZCBpbiBhIGZ1dHVyZSB0dXJuLlxuICogQHBhcmFtIG9iamVjdCAgICBwcm9taXNlIG9yIGltbWVkaWF0ZSByZWZlcmVuY2UgZm9yIHRhcmdldCBvYmplY3RcbiAqIEBwYXJhbSBuYW1lICAgICAgbmFtZSBvZiBtZXRob2QgdG8gaW52b2tlXG4gKiBAcGFyYW0gdmFsdWUgICAgIGEgdmFsdWUgdG8gcG9zdCwgdHlwaWNhbGx5IGFuIGFycmF5IG9mXG4gKiAgICAgICAgICAgICAgICAgIGludm9jYXRpb24gYXJndW1lbnRzIGZvciBwcm9taXNlcyB0aGF0XG4gKiAgICAgICAgICAgICAgICAgIGFyZSB1bHRpbWF0ZWx5IGJhY2tlZCB3aXRoIGByZXNvbHZlYCB2YWx1ZXMsXG4gKiAgICAgICAgICAgICAgICAgIGFzIG9wcG9zZWQgdG8gdGhvc2UgYmFja2VkIHdpdGggVVJMc1xuICogICAgICAgICAgICAgICAgICB3aGVyZWluIHRoZSBwb3N0ZWQgdmFsdWUgY2FuIGJlIGFueVxuICogICAgICAgICAgICAgICAgICBKU09OIHNlcmlhbGl6YWJsZSBvYmplY3QuXG4gKiBAcmV0dXJuIHByb21pc2UgZm9yIHRoZSByZXR1cm4gdmFsdWVcbiAqL1xuLy8gYm91bmQgbG9jYWxseSBiZWNhdXNlIGl0IGlzIHVzZWQgYnkgb3RoZXIgbWV0aG9kc1xuUS5tYXBwbHkgPSAvLyBYWFggQXMgcHJvcG9zZWQgYnkgXCJSZWRzYW5kcm9cIlxuUS5wb3N0ID0gZnVuY3Rpb24gKG9iamVjdCwgbmFtZSwgYXJncykge1xuICAgIHJldHVybiBRKG9iamVjdCkuZGlzcGF0Y2goXCJwb3N0XCIsIFtuYW1lLCBhcmdzXSk7XG59O1xuXG5Qcm9taXNlLnByb3RvdHlwZS5tYXBwbHkgPSAvLyBYWFggQXMgcHJvcG9zZWQgYnkgXCJSZWRzYW5kcm9cIlxuUHJvbWlzZS5wcm90b3R5cGUucG9zdCA9IGZ1bmN0aW9uIChuYW1lLCBhcmdzKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2goXCJwb3N0XCIsIFtuYW1lLCBhcmdzXSk7XG59O1xuXG4vKipcbiAqIEludm9rZXMgYSBtZXRob2QgaW4gYSBmdXR1cmUgdHVybi5cbiAqIEBwYXJhbSBvYmplY3QgICAgcHJvbWlzZSBvciBpbW1lZGlhdGUgcmVmZXJlbmNlIGZvciB0YXJnZXQgb2JqZWN0XG4gKiBAcGFyYW0gbmFtZSAgICAgIG5hbWUgb2YgbWV0aG9kIHRvIGludm9rZVxuICogQHBhcmFtIC4uLmFyZ3MgICBhcnJheSBvZiBpbnZvY2F0aW9uIGFyZ3VtZW50c1xuICogQHJldHVybiBwcm9taXNlIGZvciB0aGUgcmV0dXJuIHZhbHVlXG4gKi9cblEuc2VuZCA9IC8vIFhYWCBNYXJrIE1pbGxlcidzIHByb3Bvc2VkIHBhcmxhbmNlXG5RLm1jYWxsID0gLy8gWFhYIEFzIHByb3Bvc2VkIGJ5IFwiUmVkc2FuZHJvXCJcblEuaW52b2tlID0gZnVuY3Rpb24gKG9iamVjdCwgbmFtZSAvKi4uLmFyZ3MqLykge1xuICAgIHJldHVybiBRKG9iamVjdCkuZGlzcGF0Y2goXCJwb3N0XCIsIFtuYW1lLCBhcnJheV9zbGljZShhcmd1bWVudHMsIDIpXSk7XG59O1xuXG5Qcm9taXNlLnByb3RvdHlwZS5zZW5kID0gLy8gWFhYIE1hcmsgTWlsbGVyJ3MgcHJvcG9zZWQgcGFybGFuY2VcblByb21pc2UucHJvdG90eXBlLm1jYWxsID0gLy8gWFhYIEFzIHByb3Bvc2VkIGJ5IFwiUmVkc2FuZHJvXCJcblByb21pc2UucHJvdG90eXBlLmludm9rZSA9IGZ1bmN0aW9uIChuYW1lIC8qLi4uYXJncyovKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2goXCJwb3N0XCIsIFtuYW1lLCBhcnJheV9zbGljZShhcmd1bWVudHMsIDEpXSk7XG59O1xuXG4vKipcbiAqIEFwcGxpZXMgdGhlIHByb21pc2VkIGZ1bmN0aW9uIGluIGEgZnV0dXJlIHR1cm4uXG4gKiBAcGFyYW0gb2JqZWN0ICAgIHByb21pc2Ugb3IgaW1tZWRpYXRlIHJlZmVyZW5jZSBmb3IgdGFyZ2V0IGZ1bmN0aW9uXG4gKiBAcGFyYW0gYXJncyAgICAgIGFycmF5IG9mIGFwcGxpY2F0aW9uIGFyZ3VtZW50c1xuICovXG5RLmZhcHBseSA9IGZ1bmN0aW9uIChvYmplY3QsIGFyZ3MpIHtcbiAgICByZXR1cm4gUShvYmplY3QpLmRpc3BhdGNoKFwiYXBwbHlcIiwgW3ZvaWQgMCwgYXJnc10pO1xufTtcblxuUHJvbWlzZS5wcm90b3R5cGUuZmFwcGx5ID0gZnVuY3Rpb24gKGFyZ3MpIHtcbiAgICByZXR1cm4gdGhpcy5kaXNwYXRjaChcImFwcGx5XCIsIFt2b2lkIDAsIGFyZ3NdKTtcbn07XG5cbi8qKlxuICogQ2FsbHMgdGhlIHByb21pc2VkIGZ1bmN0aW9uIGluIGEgZnV0dXJlIHR1cm4uXG4gKiBAcGFyYW0gb2JqZWN0ICAgIHByb21pc2Ugb3IgaW1tZWRpYXRlIHJlZmVyZW5jZSBmb3IgdGFyZ2V0IGZ1bmN0aW9uXG4gKiBAcGFyYW0gLi4uYXJncyAgIGFycmF5IG9mIGFwcGxpY2F0aW9uIGFyZ3VtZW50c1xuICovXG5RW1widHJ5XCJdID1cblEuZmNhbGwgPSBmdW5jdGlvbiAob2JqZWN0IC8qIC4uLmFyZ3MqLykge1xuICAgIHJldHVybiBRKG9iamVjdCkuZGlzcGF0Y2goXCJhcHBseVwiLCBbdm9pZCAwLCBhcnJheV9zbGljZShhcmd1bWVudHMsIDEpXSk7XG59O1xuXG5Qcm9taXNlLnByb3RvdHlwZS5mY2FsbCA9IGZ1bmN0aW9uICgvKi4uLmFyZ3MqLykge1xuICAgIHJldHVybiB0aGlzLmRpc3BhdGNoKFwiYXBwbHlcIiwgW3ZvaWQgMCwgYXJyYXlfc2xpY2UoYXJndW1lbnRzKV0pO1xufTtcblxuLyoqXG4gKiBCaW5kcyB0aGUgcHJvbWlzZWQgZnVuY3Rpb24sIHRyYW5zZm9ybWluZyByZXR1cm4gdmFsdWVzIGludG8gYSBmdWxmaWxsZWRcbiAqIHByb21pc2UgYW5kIHRocm93biBlcnJvcnMgaW50byBhIHJlamVjdGVkIG9uZS5cbiAqIEBwYXJhbSBvYmplY3QgICAgcHJvbWlzZSBvciBpbW1lZGlhdGUgcmVmZXJlbmNlIGZvciB0YXJnZXQgZnVuY3Rpb25cbiAqIEBwYXJhbSAuLi5hcmdzICAgYXJyYXkgb2YgYXBwbGljYXRpb24gYXJndW1lbnRzXG4gKi9cblEuZmJpbmQgPSBmdW5jdGlvbiAob2JqZWN0IC8qLi4uYXJncyovKSB7XG4gICAgdmFyIHByb21pc2UgPSBRKG9iamVjdCk7XG4gICAgdmFyIGFyZ3MgPSBhcnJheV9zbGljZShhcmd1bWVudHMsIDEpO1xuICAgIHJldHVybiBmdW5jdGlvbiBmYm91bmQoKSB7XG4gICAgICAgIHJldHVybiBwcm9taXNlLmRpc3BhdGNoKFwiYXBwbHlcIiwgW1xuICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgIGFyZ3MuY29uY2F0KGFycmF5X3NsaWNlKGFyZ3VtZW50cykpXG4gICAgICAgIF0pO1xuICAgIH07XG59O1xuUHJvbWlzZS5wcm90b3R5cGUuZmJpbmQgPSBmdW5jdGlvbiAoLyouLi5hcmdzKi8pIHtcbiAgICB2YXIgcHJvbWlzZSA9IHRoaXM7XG4gICAgdmFyIGFyZ3MgPSBhcnJheV9zbGljZShhcmd1bWVudHMpO1xuICAgIHJldHVybiBmdW5jdGlvbiBmYm91bmQoKSB7XG4gICAgICAgIHJldHVybiBwcm9taXNlLmRpc3BhdGNoKFwiYXBwbHlcIiwgW1xuICAgICAgICAgICAgdGhpcyxcbiAgICAgICAgICAgIGFyZ3MuY29uY2F0KGFycmF5X3NsaWNlKGFyZ3VtZW50cykpXG4gICAgICAgIF0pO1xuICAgIH07XG59O1xuXG4vKipcbiAqIFJlcXVlc3RzIHRoZSBuYW1lcyBvZiB0aGUgb3duZWQgcHJvcGVydGllcyBvZiBhIHByb21pc2VkXG4gKiBvYmplY3QgaW4gYSBmdXR1cmUgdHVybi5cbiAqIEBwYXJhbSBvYmplY3QgICAgcHJvbWlzZSBvciBpbW1lZGlhdGUgcmVmZXJlbmNlIGZvciB0YXJnZXQgb2JqZWN0XG4gKiBAcmV0dXJuIHByb21pc2UgZm9yIHRoZSBrZXlzIG9mIHRoZSBldmVudHVhbGx5IHNldHRsZWQgb2JqZWN0XG4gKi9cblEua2V5cyA9IGZ1bmN0aW9uIChvYmplY3QpIHtcbiAgICByZXR1cm4gUShvYmplY3QpLmRpc3BhdGNoKFwia2V5c1wiLCBbXSk7XG59O1xuXG5Qcm9taXNlLnByb3RvdHlwZS5rZXlzID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmRpc3BhdGNoKFwia2V5c1wiLCBbXSk7XG59O1xuXG4vKipcbiAqIFR1cm5zIGFuIGFycmF5IG9mIHByb21pc2VzIGludG8gYSBwcm9taXNlIGZvciBhbiBhcnJheS4gIElmIGFueSBvZlxuICogdGhlIHByb21pc2VzIGdldHMgcmVqZWN0ZWQsIHRoZSB3aG9sZSBhcnJheSBpcyByZWplY3RlZCBpbW1lZGlhdGVseS5cbiAqIEBwYXJhbSB7QXJyYXkqfSBhbiBhcnJheSAob3IgcHJvbWlzZSBmb3IgYW4gYXJyYXkpIG9mIHZhbHVlcyAob3JcbiAqIHByb21pc2VzIGZvciB2YWx1ZXMpXG4gKiBAcmV0dXJucyBhIHByb21pc2UgZm9yIGFuIGFycmF5IG9mIHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlc1xuICovXG4vLyBCeSBNYXJrIE1pbGxlclxuLy8gaHR0cDovL3dpa2kuZWNtYXNjcmlwdC5vcmcvZG9rdS5waHA/aWQ9c3RyYXdtYW46Y29uY3VycmVuY3kmcmV2PTEzMDg3NzY1MjEjYWxsZnVsZmlsbGVkXG5RLmFsbCA9IGFsbDtcbmZ1bmN0aW9uIGFsbChwcm9taXNlcykge1xuICAgIHJldHVybiB3aGVuKHByb21pc2VzLCBmdW5jdGlvbiAocHJvbWlzZXMpIHtcbiAgICAgICAgdmFyIGNvdW50RG93biA9IDA7XG4gICAgICAgIHZhciBkZWZlcnJlZCA9IGRlZmVyKCk7XG4gICAgICAgIGFycmF5X3JlZHVjZShwcm9taXNlcywgZnVuY3Rpb24gKHVuZGVmaW5lZCwgcHJvbWlzZSwgaW5kZXgpIHtcbiAgICAgICAgICAgIHZhciBzbmFwc2hvdDtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICBpc1Byb21pc2UocHJvbWlzZSkgJiZcbiAgICAgICAgICAgICAgICAoc25hcHNob3QgPSBwcm9taXNlLmluc3BlY3QoKSkuc3RhdGUgPT09IFwiZnVsZmlsbGVkXCJcbiAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgIHByb21pc2VzW2luZGV4XSA9IHNuYXBzaG90LnZhbHVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICArK2NvdW50RG93bjtcbiAgICAgICAgICAgICAgICB3aGVuKFxuICAgICAgICAgICAgICAgICAgICBwcm9taXNlLFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb21pc2VzW2luZGV4XSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKC0tY291bnREb3duID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVmZXJyZWQucmVzb2x2ZShwcm9taXNlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGRlZmVycmVkLnJlamVjdCxcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKHByb2dyZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWZlcnJlZC5ub3RpZnkoeyBpbmRleDogaW5kZXgsIHZhbHVlOiBwcm9ncmVzcyB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHZvaWQgMCk7XG4gICAgICAgIGlmIChjb3VudERvd24gPT09IDApIHtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUocHJvbWlzZXMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xuICAgIH0pO1xufVxuXG5Qcm9taXNlLnByb3RvdHlwZS5hbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGFsbCh0aGlzKTtcbn07XG5cbi8qKlxuICogV2FpdHMgZm9yIGFsbCBwcm9taXNlcyB0byBiZSBzZXR0bGVkLCBlaXRoZXIgZnVsZmlsbGVkIG9yXG4gKiByZWplY3RlZC4gIFRoaXMgaXMgZGlzdGluY3QgZnJvbSBgYWxsYCBzaW5jZSB0aGF0IHdvdWxkIHN0b3BcbiAqIHdhaXRpbmcgYXQgdGhlIGZpcnN0IHJlamVjdGlvbi4gIFRoZSBwcm9taXNlIHJldHVybmVkIGJ5XG4gKiBgYWxsUmVzb2x2ZWRgIHdpbGwgbmV2ZXIgYmUgcmVqZWN0ZWQuXG4gKiBAcGFyYW0gcHJvbWlzZXMgYSBwcm9taXNlIGZvciBhbiBhcnJheSAob3IgYW4gYXJyYXkpIG9mIHByb21pc2VzXG4gKiAob3IgdmFsdWVzKVxuICogQHJldHVybiBhIHByb21pc2UgZm9yIGFuIGFycmF5IG9mIHByb21pc2VzXG4gKi9cblEuYWxsUmVzb2x2ZWQgPSBkZXByZWNhdGUoYWxsUmVzb2x2ZWQsIFwiYWxsUmVzb2x2ZWRcIiwgXCJhbGxTZXR0bGVkXCIpO1xuZnVuY3Rpb24gYWxsUmVzb2x2ZWQocHJvbWlzZXMpIHtcbiAgICByZXR1cm4gd2hlbihwcm9taXNlcywgZnVuY3Rpb24gKHByb21pc2VzKSB7XG4gICAgICAgIHByb21pc2VzID0gYXJyYXlfbWFwKHByb21pc2VzLCBRKTtcbiAgICAgICAgcmV0dXJuIHdoZW4oYWxsKGFycmF5X21hcChwcm9taXNlcywgZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgICAgIHJldHVybiB3aGVuKHByb21pc2UsIG5vb3AsIG5vb3ApO1xuICAgICAgICB9KSksIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlcztcbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cblByb21pc2UucHJvdG90eXBlLmFsbFJlc29sdmVkID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBhbGxSZXNvbHZlZCh0aGlzKTtcbn07XG5cbi8qKlxuICogQHNlZSBQcm9taXNlI2FsbFNldHRsZWRcbiAqL1xuUS5hbGxTZXR0bGVkID0gYWxsU2V0dGxlZDtcbmZ1bmN0aW9uIGFsbFNldHRsZWQocHJvbWlzZXMpIHtcbiAgICByZXR1cm4gUShwcm9taXNlcykuYWxsU2V0dGxlZCgpO1xufVxuXG4vKipcbiAqIFR1cm5zIGFuIGFycmF5IG9mIHByb21pc2VzIGludG8gYSBwcm9taXNlIGZvciBhbiBhcnJheSBvZiB0aGVpciBzdGF0ZXMgKGFzXG4gKiByZXR1cm5lZCBieSBgaW5zcGVjdGApIHdoZW4gdGhleSBoYXZlIGFsbCBzZXR0bGVkLlxuICogQHBhcmFtIHtBcnJheVtBbnkqXX0gdmFsdWVzIGFuIGFycmF5IChvciBwcm9taXNlIGZvciBhbiBhcnJheSkgb2YgdmFsdWVzIChvclxuICogcHJvbWlzZXMgZm9yIHZhbHVlcylcbiAqIEByZXR1cm5zIHtBcnJheVtTdGF0ZV19IGFuIGFycmF5IG9mIHN0YXRlcyBmb3IgdGhlIHJlc3BlY3RpdmUgdmFsdWVzLlxuICovXG5Qcm9taXNlLnByb3RvdHlwZS5hbGxTZXR0bGVkID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnRoZW4oZnVuY3Rpb24gKHByb21pc2VzKSB7XG4gICAgICAgIHJldHVybiBhbGwoYXJyYXlfbWFwKHByb21pc2VzLCBmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICAgICAgcHJvbWlzZSA9IFEocHJvbWlzZSk7XG4gICAgICAgICAgICBmdW5jdGlvbiByZWdhcmRsZXNzKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlLmluc3BlY3QoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlLnRoZW4ocmVnYXJkbGVzcywgcmVnYXJkbGVzcyk7XG4gICAgICAgIH0pKTtcbiAgICB9KTtcbn07XG5cbi8qKlxuICogQ2FwdHVyZXMgdGhlIGZhaWx1cmUgb2YgYSBwcm9taXNlLCBnaXZpbmcgYW4gb3BvcnR1bml0eSB0byByZWNvdmVyXG4gKiB3aXRoIGEgY2FsbGJhY2suICBJZiB0aGUgZ2l2ZW4gcHJvbWlzZSBpcyBmdWxmaWxsZWQsIHRoZSByZXR1cm5lZFxuICogcHJvbWlzZSBpcyBmdWxmaWxsZWQuXG4gKiBAcGFyYW0ge0FueSp9IHByb21pc2UgZm9yIHNvbWV0aGluZ1xuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgdG8gZnVsZmlsbCB0aGUgcmV0dXJuZWQgcHJvbWlzZSBpZiB0aGVcbiAqIGdpdmVuIHByb21pc2UgaXMgcmVqZWN0ZWRcbiAqIEByZXR1cm5zIGEgcHJvbWlzZSBmb3IgdGhlIHJldHVybiB2YWx1ZSBvZiB0aGUgY2FsbGJhY2tcbiAqL1xuUS5mYWlsID0gLy8gWFhYIGxlZ2FjeVxuUVtcImNhdGNoXCJdID0gZnVuY3Rpb24gKG9iamVjdCwgcmVqZWN0ZWQpIHtcbiAgICByZXR1cm4gUShvYmplY3QpLnRoZW4odm9pZCAwLCByZWplY3RlZCk7XG59O1xuXG5Qcm9taXNlLnByb3RvdHlwZS5mYWlsID0gLy8gWFhYIGxlZ2FjeVxuUHJvbWlzZS5wcm90b3R5cGVbXCJjYXRjaFwiXSA9IGZ1bmN0aW9uIChyZWplY3RlZCkge1xuICAgIHJldHVybiB0aGlzLnRoZW4odm9pZCAwLCByZWplY3RlZCk7XG59O1xuXG4vKipcbiAqIEF0dGFjaGVzIGEgbGlzdGVuZXIgdGhhdCBjYW4gcmVzcG9uZCB0byBwcm9ncmVzcyBub3RpZmljYXRpb25zIGZyb20gYVxuICogcHJvbWlzZSdzIG9yaWdpbmF0aW5nIGRlZmVycmVkLiBUaGlzIGxpc3RlbmVyIHJlY2VpdmVzIHRoZSBleGFjdCBhcmd1bWVudHNcbiAqIHBhc3NlZCB0byBgYGRlZmVycmVkLm5vdGlmeWBgLlxuICogQHBhcmFtIHtBbnkqfSBwcm9taXNlIGZvciBzb21ldGhpbmdcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIHRvIHJlY2VpdmUgYW55IHByb2dyZXNzIG5vdGlmaWNhdGlvbnNcbiAqIEByZXR1cm5zIHRoZSBnaXZlbiBwcm9taXNlLCB1bmNoYW5nZWRcbiAqL1xuUS5wcm9ncmVzcyA9IHByb2dyZXNzO1xuZnVuY3Rpb24gcHJvZ3Jlc3Mob2JqZWN0LCBwcm9ncmVzc2VkKSB7XG4gICAgcmV0dXJuIFEob2JqZWN0KS50aGVuKHZvaWQgMCwgdm9pZCAwLCBwcm9ncmVzc2VkKTtcbn1cblxuUHJvbWlzZS5wcm90b3R5cGUucHJvZ3Jlc3MgPSBmdW5jdGlvbiAocHJvZ3Jlc3NlZCkge1xuICAgIHJldHVybiB0aGlzLnRoZW4odm9pZCAwLCB2b2lkIDAsIHByb2dyZXNzZWQpO1xufTtcblxuLyoqXG4gKiBQcm92aWRlcyBhbiBvcHBvcnR1bml0eSB0byBvYnNlcnZlIHRoZSBzZXR0bGluZyBvZiBhIHByb21pc2UsXG4gKiByZWdhcmRsZXNzIG9mIHdoZXRoZXIgdGhlIHByb21pc2UgaXMgZnVsZmlsbGVkIG9yIHJlamVjdGVkLiAgRm9yd2FyZHNcbiAqIHRoZSByZXNvbHV0aW9uIHRvIHRoZSByZXR1cm5lZCBwcm9taXNlIHdoZW4gdGhlIGNhbGxiYWNrIGlzIGRvbmUuXG4gKiBUaGUgY2FsbGJhY2sgY2FuIHJldHVybiBhIHByb21pc2UgdG8gZGVmZXIgY29tcGxldGlvbi5cbiAqIEBwYXJhbSB7QW55Kn0gcHJvbWlzZVxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgdG8gb2JzZXJ2ZSB0aGUgcmVzb2x1dGlvbiBvZiB0aGUgZ2l2ZW5cbiAqIHByb21pc2UsIHRha2VzIG5vIGFyZ3VtZW50cy5cbiAqIEByZXR1cm5zIGEgcHJvbWlzZSBmb3IgdGhlIHJlc29sdXRpb24gb2YgdGhlIGdpdmVuIHByb21pc2Ugd2hlblxuICogYGBmaW5gYCBpcyBkb25lLlxuICovXG5RLmZpbiA9IC8vIFhYWCBsZWdhY3lcblFbXCJmaW5hbGx5XCJdID0gZnVuY3Rpb24gKG9iamVjdCwgY2FsbGJhY2spIHtcbiAgICByZXR1cm4gUShvYmplY3QpW1wiZmluYWxseVwiXShjYWxsYmFjayk7XG59O1xuXG5Qcm9taXNlLnByb3RvdHlwZS5maW4gPSAvLyBYWFggbGVnYWN5XG5Qcm9taXNlLnByb3RvdHlwZVtcImZpbmFsbHlcIl0gPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICBjYWxsYmFjayA9IFEoY2FsbGJhY2spO1xuICAgIHJldHVybiB0aGlzLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFjay5mY2FsbCgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICB9KTtcbiAgICB9LCBmdW5jdGlvbiAocmVhc29uKSB7XG4gICAgICAgIC8vIFRPRE8gYXR0ZW1wdCB0byByZWN5Y2xlIHRoZSByZWplY3Rpb24gd2l0aCBcInRoaXNcIi5cbiAgICAgICAgcmV0dXJuIGNhbGxiYWNrLmZjYWxsKCkudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB0aHJvdyByZWFzb247XG4gICAgICAgIH0pO1xuICAgIH0pO1xufTtcblxuLyoqXG4gKiBUZXJtaW5hdGVzIGEgY2hhaW4gb2YgcHJvbWlzZXMsIGZvcmNpbmcgcmVqZWN0aW9ucyB0byBiZVxuICogdGhyb3duIGFzIGV4Y2VwdGlvbnMuXG4gKiBAcGFyYW0ge0FueSp9IHByb21pc2UgYXQgdGhlIGVuZCBvZiBhIGNoYWluIG9mIHByb21pc2VzXG4gKiBAcmV0dXJucyBub3RoaW5nXG4gKi9cblEuZG9uZSA9IGZ1bmN0aW9uIChvYmplY3QsIGZ1bGZpbGxlZCwgcmVqZWN0ZWQsIHByb2dyZXNzKSB7XG4gICAgcmV0dXJuIFEob2JqZWN0KS5kb25lKGZ1bGZpbGxlZCwgcmVqZWN0ZWQsIHByb2dyZXNzKTtcbn07XG5cblByb21pc2UucHJvdG90eXBlLmRvbmUgPSBmdW5jdGlvbiAoZnVsZmlsbGVkLCByZWplY3RlZCwgcHJvZ3Jlc3MpIHtcbiAgICB2YXIgb25VbmhhbmRsZWRFcnJvciA9IGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAvLyBmb3J3YXJkIHRvIGEgZnV0dXJlIHR1cm4gc28gdGhhdCBgYHdoZW5gYFxuICAgICAgICAvLyBkb2VzIG5vdCBjYXRjaCBpdCBhbmQgdHVybiBpdCBpbnRvIGEgcmVqZWN0aW9uLlxuICAgICAgICBuZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBtYWtlU3RhY2tUcmFjZUxvbmcoZXJyb3IsIHByb21pc2UpO1xuICAgICAgICAgICAgaWYgKFEub25lcnJvcikge1xuICAgICAgICAgICAgICAgIFEub25lcnJvcihlcnJvcik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IGVycm9yO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gQXZvaWQgdW5uZWNlc3NhcnkgYG5leHRUaWNrYGluZyB2aWEgYW4gdW5uZWNlc3NhcnkgYHdoZW5gLlxuICAgIHZhciBwcm9taXNlID0gZnVsZmlsbGVkIHx8IHJlamVjdGVkIHx8IHByb2dyZXNzID9cbiAgICAgICAgdGhpcy50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQsIHByb2dyZXNzKSA6XG4gICAgICAgIHRoaXM7XG5cbiAgICBpZiAodHlwZW9mIHByb2Nlc3MgPT09IFwib2JqZWN0XCIgJiYgcHJvY2VzcyAmJiBwcm9jZXNzLmRvbWFpbikge1xuICAgICAgICBvblVuaGFuZGxlZEVycm9yID0gcHJvY2Vzcy5kb21haW4uYmluZChvblVuaGFuZGxlZEVycm9yKTtcbiAgICB9XG5cbiAgICBwcm9taXNlLnRoZW4odm9pZCAwLCBvblVuaGFuZGxlZEVycm9yKTtcbn07XG5cbi8qKlxuICogQ2F1c2VzIGEgcHJvbWlzZSB0byBiZSByZWplY3RlZCBpZiBpdCBkb2VzIG5vdCBnZXQgZnVsZmlsbGVkIGJlZm9yZVxuICogc29tZSBtaWxsaXNlY29uZHMgdGltZSBvdXQuXG4gKiBAcGFyYW0ge0FueSp9IHByb21pc2VcbiAqIEBwYXJhbSB7TnVtYmVyfSBtaWxsaXNlY29uZHMgdGltZW91dFxuICogQHBhcmFtIHtTdHJpbmd9IGN1c3RvbSBlcnJvciBtZXNzYWdlIChvcHRpb25hbClcbiAqIEByZXR1cm5zIGEgcHJvbWlzZSBmb3IgdGhlIHJlc29sdXRpb24gb2YgdGhlIGdpdmVuIHByb21pc2UgaWYgaXQgaXNcbiAqIGZ1bGZpbGxlZCBiZWZvcmUgdGhlIHRpbWVvdXQsIG90aGVyd2lzZSByZWplY3RlZC5cbiAqL1xuUS50aW1lb3V0ID0gZnVuY3Rpb24gKG9iamVjdCwgbXMsIG1lc3NhZ2UpIHtcbiAgICByZXR1cm4gUShvYmplY3QpLnRpbWVvdXQobXMsIG1lc3NhZ2UpO1xufTtcblxuUHJvbWlzZS5wcm90b3R5cGUudGltZW91dCA9IGZ1bmN0aW9uIChtcywgbWVzc2FnZSkge1xuICAgIHZhciBkZWZlcnJlZCA9IGRlZmVyKCk7XG4gICAgdmFyIHRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QobmV3IEVycm9yKG1lc3NhZ2UgfHwgXCJUaW1lZCBvdXQgYWZ0ZXIgXCIgKyBtcyArIFwiIG1zXCIpKTtcbiAgICB9LCBtcyk7XG5cbiAgICB0aGlzLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgICAgICBkZWZlcnJlZC5yZXNvbHZlKHZhbHVlKTtcbiAgICB9LCBmdW5jdGlvbiAoZXhjZXB0aW9uKSB7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0SWQpO1xuICAgICAgICBkZWZlcnJlZC5yZWplY3QoZXhjZXB0aW9uKTtcbiAgICB9LCBkZWZlcnJlZC5ub3RpZnkpO1xuXG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG4vKipcbiAqIFJldHVybnMgYSBwcm9taXNlIGZvciB0aGUgZ2l2ZW4gdmFsdWUgKG9yIHByb21pc2VkIHZhbHVlKSwgc29tZVxuICogbWlsbGlzZWNvbmRzIGFmdGVyIGl0IHJlc29sdmVkLiBQYXNzZXMgcmVqZWN0aW9ucyBpbW1lZGlhdGVseS5cbiAqIEBwYXJhbSB7QW55Kn0gcHJvbWlzZVxuICogQHBhcmFtIHtOdW1iZXJ9IG1pbGxpc2Vjb25kc1xuICogQHJldHVybnMgYSBwcm9taXNlIGZvciB0aGUgcmVzb2x1dGlvbiBvZiB0aGUgZ2l2ZW4gcHJvbWlzZSBhZnRlciBtaWxsaXNlY29uZHNcbiAqIHRpbWUgaGFzIGVsYXBzZWQgc2luY2UgdGhlIHJlc29sdXRpb24gb2YgdGhlIGdpdmVuIHByb21pc2UuXG4gKiBJZiB0aGUgZ2l2ZW4gcHJvbWlzZSByZWplY3RzLCB0aGF0IGlzIHBhc3NlZCBpbW1lZGlhdGVseS5cbiAqL1xuUS5kZWxheSA9IGZ1bmN0aW9uIChvYmplY3QsIHRpbWVvdXQpIHtcbiAgICBpZiAodGltZW91dCA9PT0gdm9pZCAwKSB7XG4gICAgICAgIHRpbWVvdXQgPSBvYmplY3Q7XG4gICAgICAgIG9iamVjdCA9IHZvaWQgMDtcbiAgICB9XG4gICAgcmV0dXJuIFEob2JqZWN0KS5kZWxheSh0aW1lb3V0KTtcbn07XG5cblByb21pc2UucHJvdG90eXBlLmRlbGF5ID0gZnVuY3Rpb24gKHRpbWVvdXQpIHtcbiAgICByZXR1cm4gdGhpcy50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICB2YXIgZGVmZXJyZWQgPSBkZWZlcigpO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGRlZmVycmVkLnJlc29sdmUodmFsdWUpO1xuICAgICAgICB9LCB0aW1lb3V0KTtcbiAgICAgICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG4gICAgfSk7XG59O1xuXG4vKipcbiAqIFBhc3NlcyBhIGNvbnRpbnVhdGlvbiB0byBhIE5vZGUgZnVuY3Rpb24sIHdoaWNoIGlzIGNhbGxlZCB3aXRoIHRoZSBnaXZlblxuICogYXJndW1lbnRzIHByb3ZpZGVkIGFzIGFuIGFycmF5LCBhbmQgcmV0dXJucyBhIHByb21pc2UuXG4gKlxuICogICAgICBRLm5mYXBwbHkoRlMucmVhZEZpbGUsIFtfX2ZpbGVuYW1lXSlcbiAqICAgICAgLnRoZW4oZnVuY3Rpb24gKGNvbnRlbnQpIHtcbiAqICAgICAgfSlcbiAqXG4gKi9cblEubmZhcHBseSA9IGZ1bmN0aW9uIChjYWxsYmFjaywgYXJncykge1xuICAgIHJldHVybiBRKGNhbGxiYWNrKS5uZmFwcGx5KGFyZ3MpO1xufTtcblxuUHJvbWlzZS5wcm90b3R5cGUubmZhcHBseSA9IGZ1bmN0aW9uIChhcmdzKSB7XG4gICAgdmFyIGRlZmVycmVkID0gZGVmZXIoKTtcbiAgICB2YXIgbm9kZUFyZ3MgPSBhcnJheV9zbGljZShhcmdzKTtcbiAgICBub2RlQXJncy5wdXNoKGRlZmVycmVkLm1ha2VOb2RlUmVzb2x2ZXIoKSk7XG4gICAgdGhpcy5mYXBwbHkobm9kZUFyZ3MpLmZhaWwoZGVmZXJyZWQucmVqZWN0KTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbi8qKlxuICogUGFzc2VzIGEgY29udGludWF0aW9uIHRvIGEgTm9kZSBmdW5jdGlvbiwgd2hpY2ggaXMgY2FsbGVkIHdpdGggdGhlIGdpdmVuXG4gKiBhcmd1bWVudHMgcHJvdmlkZWQgaW5kaXZpZHVhbGx5LCBhbmQgcmV0dXJucyBhIHByb21pc2UuXG4gKiBAZXhhbXBsZVxuICogUS5uZmNhbGwoRlMucmVhZEZpbGUsIF9fZmlsZW5hbWUpXG4gKiAudGhlbihmdW5jdGlvbiAoY29udGVudCkge1xuICogfSlcbiAqXG4gKi9cblEubmZjYWxsID0gZnVuY3Rpb24gKGNhbGxiYWNrIC8qLi4uYXJncyovKSB7XG4gICAgdmFyIGFyZ3MgPSBhcnJheV9zbGljZShhcmd1bWVudHMsIDEpO1xuICAgIHJldHVybiBRKGNhbGxiYWNrKS5uZmFwcGx5KGFyZ3MpO1xufTtcblxuUHJvbWlzZS5wcm90b3R5cGUubmZjYWxsID0gZnVuY3Rpb24gKC8qLi4uYXJncyovKSB7XG4gICAgdmFyIG5vZGVBcmdzID0gYXJyYXlfc2xpY2UoYXJndW1lbnRzKTtcbiAgICB2YXIgZGVmZXJyZWQgPSBkZWZlcigpO1xuICAgIG5vZGVBcmdzLnB1c2goZGVmZXJyZWQubWFrZU5vZGVSZXNvbHZlcigpKTtcbiAgICB0aGlzLmZhcHBseShub2RlQXJncykuZmFpbChkZWZlcnJlZC5yZWplY3QpO1xuICAgIHJldHVybiBkZWZlcnJlZC5wcm9taXNlO1xufTtcblxuLyoqXG4gKiBXcmFwcyBhIE5vZGVKUyBjb250aW51YXRpb24gcGFzc2luZyBmdW5jdGlvbiBhbmQgcmV0dXJucyBhbiBlcXVpdmFsZW50XG4gKiB2ZXJzaW9uIHRoYXQgcmV0dXJucyBhIHByb21pc2UuXG4gKiBAZXhhbXBsZVxuICogUS5uZmJpbmQoRlMucmVhZEZpbGUsIF9fZmlsZW5hbWUpKFwidXRmLThcIilcbiAqIC50aGVuKGNvbnNvbGUubG9nKVxuICogLmRvbmUoKVxuICovXG5RLm5mYmluZCA9XG5RLmRlbm9kZWlmeSA9IGZ1bmN0aW9uIChjYWxsYmFjayAvKi4uLmFyZ3MqLykge1xuICAgIHZhciBiYXNlQXJncyA9IGFycmF5X3NsaWNlKGFyZ3VtZW50cywgMSk7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG5vZGVBcmdzID0gYmFzZUFyZ3MuY29uY2F0KGFycmF5X3NsaWNlKGFyZ3VtZW50cykpO1xuICAgICAgICB2YXIgZGVmZXJyZWQgPSBkZWZlcigpO1xuICAgICAgICBub2RlQXJncy5wdXNoKGRlZmVycmVkLm1ha2VOb2RlUmVzb2x2ZXIoKSk7XG4gICAgICAgIFEoY2FsbGJhY2spLmZhcHBseShub2RlQXJncykuZmFpbChkZWZlcnJlZC5yZWplY3QpO1xuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9O1xufTtcblxuUHJvbWlzZS5wcm90b3R5cGUubmZiaW5kID1cblByb21pc2UucHJvdG90eXBlLmRlbm9kZWlmeSA9IGZ1bmN0aW9uICgvKi4uLmFyZ3MqLykge1xuICAgIHZhciBhcmdzID0gYXJyYXlfc2xpY2UoYXJndW1lbnRzKTtcbiAgICBhcmdzLnVuc2hpZnQodGhpcyk7XG4gICAgcmV0dXJuIFEuZGVub2RlaWZ5LmFwcGx5KHZvaWQgMCwgYXJncyk7XG59O1xuXG5RLm5iaW5kID0gZnVuY3Rpb24gKGNhbGxiYWNrLCB0aGlzcCAvKi4uLmFyZ3MqLykge1xuICAgIHZhciBiYXNlQXJncyA9IGFycmF5X3NsaWNlKGFyZ3VtZW50cywgMik7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG5vZGVBcmdzID0gYmFzZUFyZ3MuY29uY2F0KGFycmF5X3NsaWNlKGFyZ3VtZW50cykpO1xuICAgICAgICB2YXIgZGVmZXJyZWQgPSBkZWZlcigpO1xuICAgICAgICBub2RlQXJncy5wdXNoKGRlZmVycmVkLm1ha2VOb2RlUmVzb2x2ZXIoKSk7XG4gICAgICAgIGZ1bmN0aW9uIGJvdW5kKCkge1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrLmFwcGx5KHRoaXNwLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgICAgIFEoYm91bmQpLmZhcHBseShub2RlQXJncykuZmFpbChkZWZlcnJlZC5yZWplY3QpO1xuICAgICAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbiAgICB9O1xufTtcblxuUHJvbWlzZS5wcm90b3R5cGUubmJpbmQgPSBmdW5jdGlvbiAoLyp0aGlzcCwgLi4uYXJncyovKSB7XG4gICAgdmFyIGFyZ3MgPSBhcnJheV9zbGljZShhcmd1bWVudHMsIDApO1xuICAgIGFyZ3MudW5zaGlmdCh0aGlzKTtcbiAgICByZXR1cm4gUS5uYmluZC5hcHBseSh2b2lkIDAsIGFyZ3MpO1xufTtcblxuLyoqXG4gKiBDYWxscyBhIG1ldGhvZCBvZiBhIE5vZGUtc3R5bGUgb2JqZWN0IHRoYXQgYWNjZXB0cyBhIE5vZGUtc3R5bGVcbiAqIGNhbGxiYWNrIHdpdGggYSBnaXZlbiBhcnJheSBvZiBhcmd1bWVudHMsIHBsdXMgYSBwcm92aWRlZCBjYWxsYmFjay5cbiAqIEBwYXJhbSBvYmplY3QgYW4gb2JqZWN0IHRoYXQgaGFzIHRoZSBuYW1lZCBtZXRob2RcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIG5hbWUgb2YgdGhlIG1ldGhvZCBvZiBvYmplY3RcbiAqIEBwYXJhbSB7QXJyYXl9IGFyZ3MgYXJndW1lbnRzIHRvIHBhc3MgdG8gdGhlIG1ldGhvZDsgdGhlIGNhbGxiYWNrXG4gKiB3aWxsIGJlIHByb3ZpZGVkIGJ5IFEgYW5kIGFwcGVuZGVkIHRvIHRoZXNlIGFyZ3VtZW50cy5cbiAqIEByZXR1cm5zIGEgcHJvbWlzZSBmb3IgdGhlIHZhbHVlIG9yIGVycm9yXG4gKi9cblEubm1hcHBseSA9IC8vIFhYWCBBcyBwcm9wb3NlZCBieSBcIlJlZHNhbmRyb1wiXG5RLm5wb3N0ID0gZnVuY3Rpb24gKG9iamVjdCwgbmFtZSwgYXJncykge1xuICAgIHJldHVybiBRKG9iamVjdCkubnBvc3QobmFtZSwgYXJncyk7XG59O1xuXG5Qcm9taXNlLnByb3RvdHlwZS5ubWFwcGx5ID0gLy8gWFhYIEFzIHByb3Bvc2VkIGJ5IFwiUmVkc2FuZHJvXCJcblByb21pc2UucHJvdG90eXBlLm5wb3N0ID0gZnVuY3Rpb24gKG5hbWUsIGFyZ3MpIHtcbiAgICB2YXIgbm9kZUFyZ3MgPSBhcnJheV9zbGljZShhcmdzIHx8IFtdKTtcbiAgICB2YXIgZGVmZXJyZWQgPSBkZWZlcigpO1xuICAgIG5vZGVBcmdzLnB1c2goZGVmZXJyZWQubWFrZU5vZGVSZXNvbHZlcigpKTtcbiAgICB0aGlzLmRpc3BhdGNoKFwicG9zdFwiLCBbbmFtZSwgbm9kZUFyZ3NdKS5mYWlsKGRlZmVycmVkLnJlamVjdCk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG4vKipcbiAqIENhbGxzIGEgbWV0aG9kIG9mIGEgTm9kZS1zdHlsZSBvYmplY3QgdGhhdCBhY2NlcHRzIGEgTm9kZS1zdHlsZVxuICogY2FsbGJhY2ssIGZvcndhcmRpbmcgdGhlIGdpdmVuIHZhcmlhZGljIGFyZ3VtZW50cywgcGx1cyBhIHByb3ZpZGVkXG4gKiBjYWxsYmFjayBhcmd1bWVudC5cbiAqIEBwYXJhbSBvYmplY3QgYW4gb2JqZWN0IHRoYXQgaGFzIHRoZSBuYW1lZCBtZXRob2RcbiAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIG5hbWUgb2YgdGhlIG1ldGhvZCBvZiBvYmplY3RcbiAqIEBwYXJhbSAuLi5hcmdzIGFyZ3VtZW50cyB0byBwYXNzIHRvIHRoZSBtZXRob2Q7IHRoZSBjYWxsYmFjayB3aWxsXG4gKiBiZSBwcm92aWRlZCBieSBRIGFuZCBhcHBlbmRlZCB0byB0aGVzZSBhcmd1bWVudHMuXG4gKiBAcmV0dXJucyBhIHByb21pc2UgZm9yIHRoZSB2YWx1ZSBvciBlcnJvclxuICovXG5RLm5zZW5kID0gLy8gWFhYIEJhc2VkIG9uIE1hcmsgTWlsbGVyJ3MgcHJvcG9zZWQgXCJzZW5kXCJcblEubm1jYWxsID0gLy8gWFhYIEJhc2VkIG9uIFwiUmVkc2FuZHJvJ3NcIiBwcm9wb3NhbFxuUS5uaW52b2tlID0gZnVuY3Rpb24gKG9iamVjdCwgbmFtZSAvKi4uLmFyZ3MqLykge1xuICAgIHZhciBub2RlQXJncyA9IGFycmF5X3NsaWNlKGFyZ3VtZW50cywgMik7XG4gICAgdmFyIGRlZmVycmVkID0gZGVmZXIoKTtcbiAgICBub2RlQXJncy5wdXNoKGRlZmVycmVkLm1ha2VOb2RlUmVzb2x2ZXIoKSk7XG4gICAgUShvYmplY3QpLmRpc3BhdGNoKFwicG9zdFwiLCBbbmFtZSwgbm9kZUFyZ3NdKS5mYWlsKGRlZmVycmVkLnJlamVjdCk7XG4gICAgcmV0dXJuIGRlZmVycmVkLnByb21pc2U7XG59O1xuXG5Qcm9taXNlLnByb3RvdHlwZS5uc2VuZCA9IC8vIFhYWCBCYXNlZCBvbiBNYXJrIE1pbGxlcidzIHByb3Bvc2VkIFwic2VuZFwiXG5Qcm9taXNlLnByb3RvdHlwZS5ubWNhbGwgPSAvLyBYWFggQmFzZWQgb24gXCJSZWRzYW5kcm8nc1wiIHByb3Bvc2FsXG5Qcm9taXNlLnByb3RvdHlwZS5uaW52b2tlID0gZnVuY3Rpb24gKG5hbWUgLyouLi5hcmdzKi8pIHtcbiAgICB2YXIgbm9kZUFyZ3MgPSBhcnJheV9zbGljZShhcmd1bWVudHMsIDEpO1xuICAgIHZhciBkZWZlcnJlZCA9IGRlZmVyKCk7XG4gICAgbm9kZUFyZ3MucHVzaChkZWZlcnJlZC5tYWtlTm9kZVJlc29sdmVyKCkpO1xuICAgIHRoaXMuZGlzcGF0Y2goXCJwb3N0XCIsIFtuYW1lLCBub2RlQXJnc10pLmZhaWwoZGVmZXJyZWQucmVqZWN0KTtcbiAgICByZXR1cm4gZGVmZXJyZWQucHJvbWlzZTtcbn07XG5cbi8qKlxuICogSWYgYSBmdW5jdGlvbiB3b3VsZCBsaWtlIHRvIHN1cHBvcnQgYm90aCBOb2RlIGNvbnRpbnVhdGlvbi1wYXNzaW5nLXN0eWxlIGFuZFxuICogcHJvbWlzZS1yZXR1cm5pbmctc3R5bGUsIGl0IGNhbiBlbmQgaXRzIGludGVybmFsIHByb21pc2UgY2hhaW4gd2l0aFxuICogYG5vZGVpZnkobm9kZWJhY2spYCwgZm9yd2FyZGluZyB0aGUgb3B0aW9uYWwgbm9kZWJhY2sgYXJndW1lbnQuICBJZiB0aGUgdXNlclxuICogZWxlY3RzIHRvIHVzZSBhIG5vZGViYWNrLCB0aGUgcmVzdWx0IHdpbGwgYmUgc2VudCB0aGVyZS4gIElmIHRoZXkgZG8gbm90XG4gKiBwYXNzIGEgbm9kZWJhY2ssIHRoZXkgd2lsbCByZWNlaXZlIHRoZSByZXN1bHQgcHJvbWlzZS5cbiAqIEBwYXJhbSBvYmplY3QgYSByZXN1bHQgKG9yIGEgcHJvbWlzZSBmb3IgYSByZXN1bHQpXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBub2RlYmFjayBhIE5vZGUuanMtc3R5bGUgY2FsbGJhY2tcbiAqIEByZXR1cm5zIGVpdGhlciB0aGUgcHJvbWlzZSBvciBub3RoaW5nXG4gKi9cblEubm9kZWlmeSA9IG5vZGVpZnk7XG5mdW5jdGlvbiBub2RlaWZ5KG9iamVjdCwgbm9kZWJhY2spIHtcbiAgICByZXR1cm4gUShvYmplY3QpLm5vZGVpZnkobm9kZWJhY2spO1xufVxuXG5Qcm9taXNlLnByb3RvdHlwZS5ub2RlaWZ5ID0gZnVuY3Rpb24gKG5vZGViYWNrKSB7XG4gICAgaWYgKG5vZGViYWNrKSB7XG4gICAgICAgIHRoaXMudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIG5leHRUaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBub2RlYmFjayhudWxsLCB2YWx1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgICBuZXh0VGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgbm9kZWJhY2soZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn07XG5cbi8vIEFsbCBjb2RlIGJlZm9yZSB0aGlzIHBvaW50IHdpbGwgYmUgZmlsdGVyZWQgZnJvbSBzdGFjayB0cmFjZXMuXG52YXIgcUVuZGluZ0xpbmUgPSBjYXB0dXJlTGluZSgpO1xuXG5yZXR1cm4gUTtcblxufSk7XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiL1VzZXJzL2pvc2htaW56bmVyL0RvY3VtZW50cy9DaW5lbWE2L2M2ZW1iZWQvbm9kZV9tb2R1bGVzL2dydW50LWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2luc2VydC1tb2R1bGUtZ2xvYmFscy9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzXCIpKSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGVwcykge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciAkd2luZG93ID0gZGVwcy53aW5kb3csXG4gICAgICAgICRkb2N1bWVudCA9IGRlcHMuZG9jdW1lbnQ7XG5cbiAgICB2YXIgc2NyaXB0cyA9ICRkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnc2NyaXB0JyksXG4gICAgICAgIHRoaXNTY3JpcHQgPSBzY3JpcHRzW3NjcmlwdHMubGVuZ3RoIC0gMV07XG5cbiAgICB0aGlzLmV4cGVyaWVuY2VJZCA9IHRoaXNTY3JpcHQuZ2V0QXR0cmlidXRlKCdkYXRhLWV4cCcpO1xuICAgIHRoaXMud2lkdGggPSB0aGlzU2NyaXB0LmdldEF0dHJpYnV0ZSgnZGF0YS13aWR0aCcpO1xuICAgIHRoaXMuaGVpZ2h0ID0gdGhpc1NjcmlwdC5nZXRBdHRyaWJ1dGUoJ2RhdGEtaGVpZ2h0Jyk7XG5cbiAgICB0aGlzLnNyYyA9IHRoaXNTY3JpcHQuZ2V0QXR0cmlidXRlKCdzcmMnKTtcbiAgICB0aGlzLnNjcmlwdCA9IHRoaXNTY3JpcHQ7XG4gICAgdGhpcy5kZWJ1ZyA9ICEhJHdpbmRvdy5fX0M2X0RFQlVHX187XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkZXBzKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyICRkb2N1bWVudCA9IGRlcHMuZG9jdW1lbnQsXG4gICAgICAgIGNvbmZpZyA9IGRlcHMuY29uZmlnLFxuICAgICAgICBxID0gZGVwcy5xLFxuICAgICAgICBjNkRiID0gZGVwcy5jNkRiLFxuICAgICAgICBjNkFqYXggPSBkZXBzLmM2QWpheCxcbiAgICAgICAgZXhwZXJpZW5jZVNlcnZpY2UgPSBkZXBzLmV4cGVyaWVuY2U7XG5cblxuICAgIC8qIEhFTFBFUiBGVU5DVElPTlMgKi9cbiAgICBmdW5jdGlvbiBhcHBVcmwodXJsKSB7XG4gICAgICAgIHJldHVybiAoY29uZmlnLmRlYnVnID9cbiAgICAgICAgICAgICdodHRwOi8vczMuYW1hem9uYXdzLmNvbS9jNi5kZXYvY29udGVudC8nIDpcbiAgICAgICAgICAgICdodHRwOi8vY2luZW1hNi5jb20vZXhwZXJpZW5jZXMvJykgKyB1cmw7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0RnVsbHNjcmVlbihlbGVtZW50LCBib29sKSB7XG4gICAgICAgIHZhciBmdWxsc2NyZWVuU3R5bGVzID0ge1xuICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxuICAgICAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgICAgICByaWdodDogMCxcbiAgICAgICAgICAgICAgICBib3R0b206IDAsXG4gICAgICAgICAgICAgICAgbGVmdDogMCxcbiAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgICAgICAgICAgIHpJbmRleDogOTk5OTk5OTk5OTk5OTk5XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3R5bGUgPSBlbGVtZW50LnN0eWxlLFxuICAgICAgICAgICAgcHJvcDtcblxuICAgICAgICBmb3IgKHByb3AgaW4gZnVsbHNjcmVlblN0eWxlcykge1xuICAgICAgICAgICAgc3R5bGVbcHJvcF0gPSBib29sID8gZnVsbHNjcmVlblN0eWxlc1twcm9wXSA6ICcnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyogU1VQRVItRFVQRVIgQVNZTkMgUFJPTUlTRSBDSEFOR0UgU1RBUlRTIEhFUkUgKi9cbiAgICBmdW5jdGlvbiBjcmVhdGVGcmFtZSgpIHtcbiAgICAgICAgdmFyIGlmcmFtZSA9ICRkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKSxcbiAgICAgICAgICAgIHNjcmlwdCA9IGNvbmZpZy5zY3JpcHQsXG4gICAgICAgICAgICBwYXJlbnQgPSBzY3JpcHQucGFyZW50Tm9kZTtcblxuICAgICAgICBpZnJhbWUuc3JjID0gJ2Fib3V0OmJsYW5rJztcbiAgICAgICAgaWZyYW1lLndpZHRoID0gY29uZmlnLndpZHRoO1xuICAgICAgICBpZnJhbWUuaGVpZ2h0ID0gY29uZmlnLmhlaWdodDtcblxuICAgICAgICByZXR1cm4gcS53aGVuKHBhcmVudC5pbnNlcnRCZWZvcmUoaWZyYW1lLCBzY3JpcHQubmV4dFNpYmxpbmcpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmZXRjaEV4cGVyaWVuY2UoaWZyYW1lKSB7XG4gICAgICAgIHJldHVybiBxLmFsbChbXG4gICAgICAgICAgICBjNkRiLmZpbmQoJ2V4cGVyaWVuY2UnLCBjb25maWcuZXhwZXJpZW5jZUlkKSxcbiAgICAgICAgICAgIGlmcmFtZVxuICAgICAgICBdKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmZXRjaEluZGV4KGRhdGEpIHtcbiAgICAgICAgdmFyIGV4cGVyaWVuY2UgPSBkYXRhWzBdLFxuICAgICAgICAgICAgaWZyYW1lID0gZGF0YVsxXTtcblxuICAgICAgICByZXR1cm4gcS5hbGwoW1xuICAgICAgICAgICAgZXhwZXJpZW5jZSxcbiAgICAgICAgICAgIGlmcmFtZSxcbiAgICAgICAgICAgIGM2QWpheC5nZXQoYXBwVXJsKGV4cGVyaWVuY2UuYXBwVXJpKSArICcvaW5kZXguaHRtbCcpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmRhdGE7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgXSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9hZEFwcChkYXRhKSB7XG4gICAgICAgIHZhciBleHBlcmllbmNlID0gZGF0YVswXSxcbiAgICAgICAgICAgIGlmcmFtZSA9IGRhdGFbMV0sXG4gICAgICAgICAgICBpbmRleEhUTUwgPSBkYXRhWzJdO1xuXG4gICAgICAgIHZhciBmcmFtZURvYyA9IGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50LFxuICAgICAgICAgICAgYmFzZVRhZyA9ICc8YmFzZSBocmVmPVwiJyArIGFwcFVybChleHBlcmllbmNlLmFwcFVyaSkgKyAnL1wiPic7XG5cbiAgICAgICAgZnJhbWVEb2Mub3BlbigpO1xuICAgICAgICBmcmFtZURvYy53cml0ZShpbmRleEhUTUwpO1xuICAgICAgICBmcmFtZURvYy53cml0ZShiYXNlVGFnKTtcbiAgICAgICAgZnJhbWVEb2MuY2xvc2UoKTtcblxuICAgICAgICByZXR1cm4gW2V4cGVyaWVuY2UsIGlmcmFtZV07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY29tbXVuaWNhdGVXaXRoQXBwKGRhdGEpIHtcbiAgICAgICAgdmFyIGV4cGVyaWVuY2UgPSBkYXRhWzBdLFxuICAgICAgICAgICAgaWZyYW1lID0gZGF0YVsxXTtcblxuICAgICAgICB2YXIgc2Vzc2lvbiA9IGV4cGVyaWVuY2VTZXJ2aWNlLnJlZ2lzdGVyRXhwZXJpZW5jZShleHBlcmllbmNlLCBpZnJhbWUuY29udGVudFdpbmRvdyk7XG5cbiAgICAgICAgc2Vzc2lvbi5vbmNlKCdyZWFkeScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2Vzc2lvbi5vbignZnVsbHNjcmVlbk1vZGUnLCBmdW5jdGlvbihmdWxsc2NyZWVuKSB7XG4gICAgICAgICAgICAgICAgc2V0RnVsbHNjcmVlbihpZnJhbWUsIGZ1bGxzY3JlZW4pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiAnU3VjY2VzcyEgRXZlcnkgd2VudCBhY2NvcmRpbmcgdG8gcGxhbiEnO1xuICAgIH1cblxuICAgIC8qIEV4ZWN1dGUgdGhlIGNoYWluICovXG4gICAgcmV0dXJuIGNyZWF0ZUZyYW1lKClcbiAgICAgICAgLnRoZW4oZmV0Y2hFeHBlcmllbmNlKVxuICAgICAgICAudGhlbihmZXRjaEluZGV4KVxuICAgICAgICAudGhlbihsb2FkQXBwKVxuICAgICAgICAudGhlbihjb21tdW5pY2F0ZVdpdGhBcHApO1xufTtcbiIsIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgYXBwID0gcmVxdWlyZSgnLi9hcHAnKTtcblxuICAgIC8qIENyZWF0ZSBDb25maWcgKi9cbiAgICB2YXIgQ29uZmlnID0gcmVxdWlyZSgnLi9Db25maWcnKSxcbiAgICAgICAgY29uZmlnID0gbmV3IENvbmZpZyh7XG4gICAgICAgICAgICB3aW5kb3c6IHdpbmRvdyxcbiAgICAgICAgICAgIGRvY3VtZW50OiB3aW5kb3cuZG9jdW1lbnRcbiAgICAgICAgfSk7XG5cbiAgICAvKiBGZXRjaCBRICovXG4gICAgdmFyIHEgPSByZXF1aXJlKCdxJyk7XG5cbiAgICAvKiBGZXRjaCBNb2Rlcm5penIgKi9cbiAgICB2YXIgbW9kZXJuaXpyID0gcmVxdWlyZSgnTW9kZXJuaXpyJyk7XG5cbiAgICAvKiBGZXRjaCBhc0V2ZW50ZWQgKi9cbiAgICB2YXIgYXNFdmVudGVkID0gcmVxdWlyZSgnYXNFdmVudGVkJyk7XG5cbiAgICAvKiBDcmVhdGUgVXNlckFnZW50ICovXG4gICAgdmFyIFVzZXJBZ2VudCA9IHJlcXVpcmUoJy4uL2xpYi9Vc2VyQWdlbnQnKSxcbiAgICAgICAgdXNlckFnZW50ID0gbmV3IFVzZXJBZ2VudCh7XG4gICAgICAgICAgICB3aW5kb3c6IHdpbmRvd1xuICAgICAgICB9KTtcblxuICAgIC8qIENyZWF0ZSBQb3N0TWVzc2FnZSAqL1xuICAgIHZhciBQb3N0TWVzc2FnZSA9IHJlcXVpcmUoJy4uL2xpYi9Qb3N0TWVzc2FnZScpLFxuICAgICAgICBwb3N0bWVzc2FnZSA9IG5ldyBQb3N0TWVzc2FnZSh7XG4gICAgICAgICAgICBhc0V2ZW50ZWQ6IGFzRXZlbnRlZCxcbiAgICAgICAgICAgIHE6IHEsXG4gICAgICAgICAgICB3aW5kb3c6IHdpbmRvd1xuICAgICAgICB9KTtcblxuICAgIC8qIENyZWF0ZSBMb2NhdGlvbiAqL1xuICAgIHZhciBMb2NhdGlvbiA9IHJlcXVpcmUoJy4vdXRpbHMvTG9jYXRpb24nKSxcbiAgICAgICAgJGxvY2F0aW9uID0gbmV3IExvY2F0aW9uKHtcbiAgICAgICAgICAgIHdpbmRvdzogd2luZG93XG4gICAgICAgIH0pO1xuXG4gICAgLyogQ3JlYXRlIEJyb3dzZXJJbmZvICovXG4gICAgdmFyIEJyb3dzZXJJbmZvID0gcmVxdWlyZSgnLi4vbGliL0Jyb3dzZXJJbmZvJyksXG4gICAgICAgIGJyb3dzZXJJbmZvID0gbmV3IEJyb3dzZXJJbmZvKHtcbiAgICAgICAgICAgIG1vZGVybml6cjogbW9kZXJuaXpyLFxuICAgICAgICAgICAgd2luZG93OiB3aW5kb3csXG4gICAgICAgICAgICB1c2VyQWdlbnQ6IHVzZXJBZ2VudFxuICAgICAgICB9KTtcblxuICAgIC8qIENyZWF0ZSBFeHBlcmllbmNlICovXG4gICAgdmFyIEV4cGVyaWVuY2UgPSByZXF1aXJlKCcuLi9saWIvRXhwZXJpZW5jZScpLFxuICAgICAgICBleHBlcmllbmNlID0gbmV3IEV4cGVyaWVuY2Uoe1xuICAgICAgICAgICAgcG9zdG1lc3NhZ2U6IHBvc3RtZXNzYWdlLFxuICAgICAgICAgICAgcTogcSxcbiAgICAgICAgICAgIGJyb3dzZXJJbmZvOiBicm93c2VySW5mb1xuICAgICAgICB9KTtcblxuICAgIC8qIENyZWF0ZSBDNkFKQVggKi9cbiAgICB2YXIgQzZBSkFYID0gcmVxdWlyZSgnLi4vbGliL2M2YWpheC9DNkFKQVgnKSxcbiAgICAgICAgYzZBamF4ID0gbmV3IEM2QUpBWCh7XG4gICAgICAgICAgICB3aW5kb3c6IHdpbmRvdyxcbiAgICAgICAgICAgIHE6IHEsXG4gICAgICAgICAgICBicm93c2VySW5mbzogYnJvd3NlckluZm8sXG4gICAgICAgICAgICBsb2NhdGlvbjogJGxvY2F0aW9uXG4gICAgICAgIH0pO1xuXG4gICAgLyogQ3JlYXRlIGFuZCBDb25maWd1cmUgQzZEQiAqL1xuICAgIHZhciBGaXh0dXJlQWRhcHRlciA9IHJlcXVpcmUoJy4uL2xpYi9jNmRiL2FkYXB0ZXJzL0ZpeHR1cmUnKSxcbiAgICAgICAgQzZEQiA9IHJlcXVpcmUoJy4uL2xpYi9jNmRiL0M2REInKSxcbiAgICAgICAgYWRhcHRlciA9IG5ldyBGaXh0dXJlQWRhcHRlcih7XG4gICAgICAgICAgICBjNkFqYXg6IGM2QWpheCxcbiAgICAgICAgICAgIHE6IHFcbiAgICAgICAgfSksXG4gICAgICAgIGM2RGIgPSBuZXcgQzZEQih7XG4gICAgICAgICAgICBxOiBxXG4gICAgICAgIH0pO1xuICAgIGFkYXB0ZXIuanNvblNyYyA9ICdodHRwOi8vczMuYW1hem9uYXdzLmNvbS9jNi5kZXYvbW9jay9maXh0dXJlcy5qc29uJztcbiAgICBjNkRiLmFkYXB0ZXIgPSBhZGFwdGVyO1xuXG4gICAgLyogUnVuIHRoZSBBcHBsaWNhdGlvbiEgKi9cbiAgICByZXR1cm4gYXBwKHtcbiAgICAgICAgZG9jdW1lbnQ6IHdpbmRvdy5kb2N1bWVudCxcbiAgICAgICAgY29uZmlnOiBjb25maWcsXG4gICAgICAgIHE6IHEsXG4gICAgICAgIGM2RGI6IGM2RGIsXG4gICAgICAgIGM2QWpheDogYzZBamF4LFxuICAgICAgICBleHBlcmllbmNlOiBleHBlcmllbmNlXG4gICAgfSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzdWx0KSB7XG4gICAgICAgICAgICBpZiAoIXdpbmRvdy5jb25zb2xlKSB7IHJldHVybjsgfVxuICAgICAgICAgICAgd2luZG93LmNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICBpZiAoIXdpbmRvdy5jb25zb2xlKSB7IHJldHVybjsgfVxuICAgICAgICAgICAgd2luZG93LmNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICB9KTtcbn0oKSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRlcHMpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgJHdpbmRvdyA9IGRlcHMud2luZG93O1xuXG4gICAgdGhpcy5vcmlnaW5PZiA9IGZ1bmN0aW9uKHVybCkge1xuICAgICAgICB2YXIgaXNBYnMgPSB1cmwuc2VhcmNoKC9eXFx3KzpcXC9cXC8vKSA+IC0xO1xuXG4gICAgICAgIGZ1bmN0aW9uIGdldE9yaWdpbk9mQWJzVXJsKHVybCkge1xuICAgICAgICAgICAgdmFyIHByb3RvY29sID0gdXJsLm1hdGNoKC9eXFx3KzovKVswXS5zbGljZSgwLCAtMSksXG4gICAgICAgICAgICAgICAgcG9ydE1hdGNoZXIgPSB1cmwubWF0Y2goLzpcXGQrLyksXG4gICAgICAgICAgICAgICAgcG9ydCA9IHBvcnRNYXRjaGVyICYmIHBvcnRNYXRjaGVyWzBdLnNsaWNlKDEpLFxuICAgICAgICAgICAgICAgIGhvc3QgPSB1cmwubWF0Y2goL1xcL1xcLyhcXHcrXFwuKT9cXHcrXFwuXFx3Ky8pWzBdLnNsaWNlKDIpO1xuXG4gICAgICAgICAgICBpZiAoIXBvcnQpIHtcbiAgICAgICAgICAgICAgICBwb3J0ID0gKHByb3RvY29sID09PSAnaHR0cHMnKSA/ICc0NDMnIDogJzgwJztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHByb3RvY29sICsgJzovLycgKyBob3N0ICsgJzonICsgcG9ydDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBnZXRPcmlnaW5PZkFic1VybChpc0FicyA/IHVybCA6ICR3aW5kb3cubG9jYXRpb24uaHJlZik7XG4gICAgfTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIHtcbiAgICAgICAgb3JpZ2luOiB7XG4gICAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm9yaWdpbk9mKCR3aW5kb3cubG9jYXRpb24uaHJlZik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG4iXX0=
