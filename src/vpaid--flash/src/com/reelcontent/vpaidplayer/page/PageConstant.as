package com.reelcontent.vpaidplayer.page
{
  internal class PageConstant
  {
    private static const EMBED_JS_SCRIPT:String = 
'        (function() {' +
'            \'use strict\';' +

'            var reelcontent = window.reelcontent || (window.reelcontent = {});' +

'            reelcontent.loadVPAID = function (url, uuid) {' +
'                reelcontent.environmentVars = {};' +

'                var iframe = document.createElement(\'iframe\');' +
'                reelcontent.iframe = iframe;' +

'                iframe.id = \'adloaderframe_\' + uuid;' +

'                document.body.appendChild(iframe);' +
'                iframe.contentWindow.document.write(\'<div id="slot"></div><script src="\' + url +' +
'                    \'" onload="parent.reelcontent.onVPAIDReady();"></scr\' + \'ipt>\');' +

'                iframe.scrolling = \'no\';' +
'                iframe.style.position = \'absolute\';' +
'                iframe.style.zIndex = \'2147483647\';' +
'                iframe.frameBorder = \'0\';' +
'                iframe.setAttribute(\'frameBorder\', \'0\');' +
'            };' +

'            reelcontent.onVPAIDReady = function () {' +
'                var fn = reelcontent.iframe.contentWindow.getVPAIDAd;' +

'                if (fn && typeof fn === \'function\') {' +
'                    reelcontent.environmentVars.slot =' +
'                        reelcontent.iframe.contentWindow.document.getElementById(\'slot\');' +

'                    reelcontent.VPAIDAd = fn();' +
'                    reelcontent.sendEvent({' +
'                        event : \'jsvpaidready\'' +
'                    });' +

'                    var callbacks = {' +
'                        AdStarted : function () {' +
'                            reelcontent.onAdEvent(\'AdStarted\');' +
'                        },' +
'                        AdStopped : function () {' +
'                            reelcontent.onAdEvent(\'AdStopped\');' +
'                        },' +
'                        AdSkipped : function () {' +
'                            reelcontent.onAdEvent(\'AdSkipped\');' +
'                        },' +
'                        AdLoaded : function () {' +
'                            reelcontent.onAdEvent(\'AdLoaded\');' +
'                        },' +
'                        AdLinearChange : function () {' +
'                            reelcontent.onAdEvent(\'AdLinearChange\');' +
'                        },' +
'                        AdSizeChange : function () {' +
'                            reelcontent.onAdEvent(\'AdSizeChange\');' +
'                        },' +
'                        AdExpandedChange : function () {' +
'                            reelcontent.onAdEvent(\'AdExpandedChange\');' +
'                        },' +
'                        AdSkippableStateChange : function () {' +
'                            reelcontent.onAdEvent(\'AdSkippableStateChange\');' +
'                        },' +
'                        AdDurationChange : function () {' +
'                            reelcontent.onAdEvent(\'AdDurationChange\');' +
'                        },' +
'                        AdRemainingTimeChange : function () {' +
'                            reelcontent.onAdEvent(\'AdRemainingTimeChange\');' +
'                        },' +
'                        AdVolumeChange : function () {' +
'                            reelcontent.onAdEvent(\'AdVolumeChange\');' +
'                        },' +
'                        AdImpression : function () {' +
'                            reelcontent.onAdEvent(\'AdImpression\');' +
'                        },' +
'                        AdClickThru : function () {' +
'                            reelcontent.onAdEvent(\'AdClickThru\');' +
'                        },' +
'                        AdInteraction : function () {' +
'                            reelcontent.onAdEvent(\'AdInteraction\');' +
'                        },' +
'                        AdVideoStart : function () {' +
'                            reelcontent.onAdEvent(\'AdVideoStart\');' +
'                        },' +
'                        AdVideoFirstQuartile : function () {' +
'                            reelcontent.onAdEvent(\'AdVideoFirstQuartile\');' +
'                        },' +
'                        AdVideoMidpoint : function () {' +
'                            reelcontent.onAdEvent(\'AdVideoMidpoint\');' +
'                        },' +
'                        AdVideoThirdQuartile : function () {' +
'                            reelcontent.onAdEvent(\'AdVideoThirdQuartile\');' +
'                        },' +
'                        AdVideoComplete : function () {' +
'                            reelcontent.onAdEvent(\'AdVideoComplete\');' +
'                        },' +
'                        AdUserAcceptInvitation : function () {' +
'                            reelcontent.onAdEvent(\'AdUserAcceptInvitation\');' +
'                        },' +
'                        AdUserMinimize : function () {' +
'                            reelcontent.onAdEvent(\'AdUserMinimize\');' +
'                        },' +
'                        AdUserClose : function () {' +
'                            reelcontent.onAdEvent(\'AdUserClose\');' +
'                        },' +
'                        AdPaused : function () {' +
'                            reelcontent.onAdEvent(\'AdPaused\');' +
'                        },' +
'                        AdPlaying : function () {' +
'                            reelcontent.onAdEvent(\'AdPlaying\');' +
'                        },' +
'                        AdError : function () {' +
'                            reelcontent.onAdEvent(\'AdError\');' +
'                        },' +
'                        AdLog : function () {' +
'                            reelcontent.onAdEvent(\'AdLog\');' +
'                        }' +
'                    };' +

'                    for (var eventName in callbacks) {' +
'                        reelcontent.VPAIDAd.subscribe(callbacks[eventName], eventName);' +
'                    }' +
'                }' +
'            };' +


'            reelcontent.reposition = function () {' +
'                var divpos = reelcontent.player.getBoundingClientRect();' +

'                if (reelcontent.iframe && reelcontent.player) {' +
'                    reelcontent.iframe.style.width = reelcontent.initAdWidth + \'px\';' +
'                    reelcontent.iframe.style.height = reelcontent.initAdHeight + \'px\';' +
'                    reelcontent.iframe.style.left = (window.scrollX + divpos.left) + \'px\';' +
'                    reelcontent.iframe.style.top = (window.scrollY + divpos.top) + \'px\';' +
'                }' +
'            };' +

'            reelcontent.checkPlayerNode = function (uuid) {' +
'                var nodes = document.getElementsByTagName(\'OBJECT\');' +
'                if (nodes && nodes.length > 0) {' +
'                    for (var i = 0; i < nodes.length; i++) {' +
'                        try {' +
'                            var playerJs = nodes[i].validatePlayerNode(uuid);' +
'                            if (playerJs) {' +
'                                reelcontent.player = nodes[i];' +

'                                reelcontent.loadVPAID(playerJs, uuid);' +
'                                return;' +
'                            }' +
'                        } catch (e) {}' +

'                    }' +
'                }' +
'                nodes = document.getElementsByTagName(\'EMBED\');' +
'                if (nodes && nodes.length > 0) {' +
'                    for (var j = 0; j < nodes.length; j++) {' +
'                        try {' +
'                            var embedPlayerJs = nodes[j].validatePlayerNode(uuid);' +
'                            if (embedPlayerJs) {' +
'                                reelcontent.player = nodes[j];' +

'                                reelcontent.loadVPAID(embedPlayerJs, uuid);' +
'                                return;' +
'                            }' +
'                        } catch (e) {}' +

'                    }' +
'                }' +
'            };' +

'            reelcontent.sendEvent = function (data) {' +
'                if (reelcontent.player) {' +
'                    reelcontent.player.onJSVPAIDEvent(data);' +
'                }' +
'            };' +

'            reelcontent.initAd =' +
'                function (data) {' +
'                reelcontent.initAdWidth = data.width;' +
'                reelcontent.initAdHeight = data.height;' +
'                reelcontent.VPAIDAd.initAd(' +
'                    data.width,' +
'                    data.height,' +
'                    data.viewMode,' +
'                    data.desiredBitrate,' +
'                    data.creativeData,' +
'                    reelcontent.environmentVars);' +
'            };' +

'            reelcontent.onAdEvent = function (eventName) {' +
'                reelcontent.sendEvent({' +
'                    event : eventName' +
'                });' +

'                switch (eventName) {' +
'                case \'AdStarted\':' +
'                    reelcontent.reposition();' +
'                    break;' +
'                }' +
'            };' +

'            reelcontent.stopAd = function () {' +
'                try {' +
'                    reelcontent.VPAIDAd.stopAd();' +
'                } catch (e) {}' +

'                window.removeEventListener(\'resize\', reelcontent.reposition);' +
'                clearInterval(reelcontent.interval);' +
'                reelcontent.iframe.parentNode.removeChild(reelcontent.iframe);' +

'                reelcontent = null;' +
'            };' +

'            reelcontent.resizeAd = function (width, height) {' +
'                reelcontent.VPAIDAd.resizeAd(width, height);' +
'                reelcontent.initAdWidth = width;' +
'                reelcontent.initAdHeight = height;' +
'                reelcontent.reposition();' +
'            };' +

'            window.addEventListener(\'resize\', reelcontent.reposition);' +

'            reelcontent.interval = setInterval(function(){' +
'                reelcontent.reposition();' +

'                if (document.body.contains(reelcontent.player) === false){' +
'                    reelcontent.stopAd();' +
'                }' +
'            }, 250);' +

'            window.addEventListener(\'load\',function() {' +
'                reelcontent.reposition();' +
'            },false);' +
'        }());';

public static function getEmbedJsScript():String {
  return EMBED_JS_SCRIPT;
}
}
}
