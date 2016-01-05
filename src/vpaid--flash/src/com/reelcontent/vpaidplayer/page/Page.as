package com.reelcontent.vpaidplayer.page {
    import flash.external.ExternalInterface;
    import flash.system.Security;
    import com.reelcontent.vpaidplayer.main.Player;
    import com.reelcontent.vpaidplayer.utils.GUIDUtils;

    public class Page {
        private var _url:String;
        private var _title:String;
        private var _referrer:String;
        private var _playerWidth:Number;
        private var _playerHeight:Number;
        private var _data:Object;

        public function Page(uuid:String) {
            if (ExternalInterface.available) {
                try {
                    ExternalInterface.addCallback("validatePlayerNode", validatePlayerNode);

                    var pageConstant:String = PageConstant.getEmbedJsScript();
                    pageConstant = pageConstant.split("reelcontent").join("reelcontent_" + uuid);

                    ExternalInterface.call("eval", pageConstant);
                } catch (e:Error) {
                }
            }
        }

        public function set data(value:Object):void {
            _data = value;

            try {
                ExternalInterface.call("reelcontent_" + Player.mainPlayer.guid + ".checkPlayerNode", Player.mainPlayer.guid);
            } catch (e:Error) {
            }
        }

        public function validatePlayerNode(uuid:String):String {
            if (Player.mainPlayer.guid && uuid && Player.mainPlayer.guid == uuid) {

                return _data.js;
            }

            return null;
        }
    }
}
