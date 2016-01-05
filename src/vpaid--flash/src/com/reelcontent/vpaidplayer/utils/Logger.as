package com.reelcontent.vpaidplayer.utils {
    import flash.external.ExternalInterface;

    public class Logger {
        public static function log(msg:String):void {
            trace("VPAID Player:" + msg);

            if (ExternalInterface.available) {
                try {
                    ExternalInterface.call("console.log", "ReelContent:" + msg);
                } catch (e:Error) {
                }
            }
        }
    }
}
