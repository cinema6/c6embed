package com.reelcontent.vpaidplayer.main {
    import flash.display.DisplayObject;
    import flash.display.Loader;
    import flash.display.MovieClip;
    import flash.display.Sprite;
    import flash.events.Event;
    import flash.events.IOErrorEvent;
    import flash.events.MouseEvent;
    import flash.events.TimerEvent;
    import flash.external.ExternalInterface;
    import flash.net.URLLoader;
    import flash.net.URLRequest;
    import flash.system.ApplicationDomain;
    import flash.system.LoaderContext;
    import flash.system.Security;
    import flash.system.SecurityDomain;
    import flash.text.*;
    import flash.utils.clearInterval;
    import flash.utils.setInterval;
    import flash.utils.Timer;
    import com.reelcontent.vpaidplayer.page.Page;
    import com.reelcontent.vpaidplayer.utils.GUIDUtils;
    import com.reelcontent.vpaidplayer.utils.Logger;
    import com.reelcontent.vpaidplayer.vpaid.IVPAID;
    import com.reelcontent.vpaidplayer.vpaid.VPAIDEvent;

    public class Player extends MovieClip implements IVPAID {
        private static var _guid:String = GUIDUtils.create();
        private static var _mainPlayer:Player;
        private static var _page:Page = new Page(_guid);

        //**** stage objects***//
        public var _black:Sprite = new Sprite();

        private var _initAdWidth:Number = -1;
        private var _initAdHeight:Number = -1;
        private var _viewMode:String;
        private var _desiredBitrate:Object;
        private var _creativeData:String = "";

        private var _data:Object = {};

        private var _destroyTimer:Timer;

        public function Player():void {
            _mainPlayer = this;

            Security.allowDomain("*");
            Security.allowInsecureDomain("*");

            this.visible = false;

            _black.graphics.clear();
            _black.graphics.beginFill(0x000000);
            _black.graphics.drawRect(0, 0, 1, 1);
            _black.graphics.endFill();

            addChild(_black);

            ExternalInterface.addCallback("onJSVPAIDEvent", onJSVPAIDEvent);
        }

        public static function get page():Page {
            return _page;
        }

        private function positionAd(width:Number, height:Number):void {
            _black.width = width;
            _black.height = height;
        }

        override public function get width():Number {
            return _initAdWidth;
        }

        override public function get height():Number {
            return _initAdHeight;
        }

        public static function get mainPlayer():Player {
            return _mainPlayer;
        }

        public function dispatchVPAIDEvent(event:VPAIDEvent):void {
            dispatchEvent(event);
        }

        public function get guid():String {
            return _guid;
        }

        public function onJSVPAIDEvent(data) {
            switch (data.event) {
                case "jsvpaidready":
                    ExternalInterface.call("reelcontent_" + guid + ".initAd", {
                        width: _initAdWidth,
                        height: _initAdHeight,
                        viewMoide: _viewMode,
                        desiredBitrate: _desiredBitrate,
                        creativeData : {AdParameters: _creativeData}
                    });
                    break;
                default:
                    dispatchVPAIDEvent(new VPAIDEvent(data.event));
                    break;
            }
        }

        //vpaid interface
        public function getVPAID():Object {
            Logger.log("getVPAID called");
            return this;
        }

        public function get adLinear():Boolean {
            return ExternalInterface.call("reelcontent_" + guid + ".VPAIDAd.getAdLinear");
        }

        public function get adExpanded():Boolean {
            return ExternalInterface.call("reelcontent_" + guid + ".VPAIDAd.getAdExpanded");
        }

        public function get adRemainingTime():Number {
            return ExternalInterface.call("reelcontent_" + guid + ".VPAIDAd.getAdRemainingTime");
        }

        public function get adVolume():Number {
            return ExternalInterface.call("reelcontent_" + guid + ".VPAIDAd.getAdVolume");
        }

        public function set adVolume(value:Number):void {
            ExternalInterface.call("reelcontent_" + guid + ".VPAIDAd.setAdVolume", value);
        }

        public function get adWidth():Number {
            return ExternalInterface.call("reelcontent_" + guid + ".VPAIDAd.getAdWidth");
        }

        public function get adHeight():Number {
            return ExternalInterface.call("reelcontent_" + guid + ".VPAIDAd.getAdHeight");
        }

        public function get adSkippableState():Boolean {
            return ExternalInterface.call("reelcontent_" + guid + ".VPAIDAd.getAdSkippableState");
        }

        public function get adDuration():Number {
            return ExternalInterface.call("reelcontent_" + guid + ".VPAIDAd.getAdDuration");
        }

        public function get adCompanions():String {
            return ExternalInterface.call("reelcontent_" + guid + ".VPAIDAd.getAdCompanions");
        }

        public function get adIcons():Boolean {
            return ExternalInterface.call("reelcontent_" + guid + ".VPAIDAd.getAdIcons");
        }

        public function handshakeVersion(playerVPAIDVersion:String):String {
            Logger.log("handshakeVersion called with params playerVPAIDVersion=" + playerVPAIDVersion);

            if (playerVPAIDVersion.substr(0,2) === "1."){
                return playerVPAIDVersion;
            }

            return "2.0";
        }

        public function initAd(width:Number, height:Number, viewMode:String, desiredBitrate:Object = null, creativeData:Object = null, environmentVars:Object = null):void {
            Logger.log("initAd called with params width=" + width + ",height=" + height + ",desiredBitrate=" + desiredBitrate + ",creativeData=" + creativeData + ",environmentVars=" + environmentVars);
            _initAdWidth = width;
            _initAdHeight = height;
            _viewMode = viewMode;
            _desiredBitrate = desiredBitrate;
            _creativeData = String(creativeData);

            if (this.loaderInfo.parameters) {
                if (!_creativeData || _creativeData.length == 0) {
                    _creativeData = "";
                    for (var param in this.loaderInfo.parameters) {
                        if (_creativeData.length > 0) _creativeData += "&";
                        _creativeData += param + "=" + encodeURIComponent(this.loaderInfo.parameters[param]);
                    }
                }

                if (this.loaderInfo.parameters.js) {
                    _data.js = this.loaderInfo.parameters.js;
                }

                _page.data = _data;
            }
        }

        public function resizeAd(width:Number, height:Number, viewMode:String):void {
            Logger.log("resizeAd called with params width=" + width + ",height=" + height);

            _initAdWidth = width;
            _initAdHeight = height;

            positionAd(_initAdWidth, _initAdHeight);

            ExternalInterface.call("reelcontent_" + guid + ".resizeAd", _initAdWidth, _initAdHeight);
        }

        public function startAd():void {
            ExternalInterface.call("reelcontent_" + guid + ".VPAIDAd.startAd");
            positionAd(_initAdWidth, _initAdHeight);
        }

        public function stopAd():void {
            ExternalInterface.call("reelcontent_" + guid + ".stopAd");
        }

        public function skipAd():void {
            ExternalInterface.call("reelcontent_" + guid + ".VPAIDAd.skipAd");
        }

        public function pauseAd():void {
            ExternalInterface.call("reelcontent_" + guid + ".VPAIDAd.pauseAd");
        }

        public function resumeAd():void {
            ExternalInterface.call("reelcontent_" + guid + ".VPAIDAd.resumeAd");
        }

        public function expandAd():void {
            ExternalInterface.call("reelcontent_" + guid + ".VPAIDAd.expandAd");
        }

        public function collapseAd():void {
            ExternalInterface.call("reelcontent_" + guid + ".VPAIDAd.collapseAd");
        }
    }
}
