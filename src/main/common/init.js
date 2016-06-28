

define([],function ( ) {
    "use strict";

    var $wrap = $("#J__wrap"),
        $menu = $("#J__menu"),
        $menu_li = $menu.find(".J__load");

    function init() {


        // 由于某些android手机还是对active 兼容有问题，固还是采用js兼容
        $wrap.on("touchstart", ".m_active_bgw", function(){
            $(this).addClass("m_active_bgw_active");
        }).on("touchend touchcancel touchmove", ".m_active_bgw", function(){
            $(this).removeClass("m_active_bgw_active");
        });
        $wrap.on("touchstart", ".m_active_bgg", function(){
            $(this).addClass("m_active_bgg_active");
        }).on("touchend touchcancel touchmove", ".m_active_bgg", function(){
            $(this).removeClass("m_active_bgg_active");
        });

        $wrap.on("touchstart", ".m_active_op", function(){
            $(this).addClass("m_active_op_active");
        }).on("touchend touchcancel touchmove", ".m_active_op", function(){
            $(this).removeClass("m_active_op_active");
        });


        // 页面控制
        GLOBAL_MESS.emmit.on("init", function(obj){
            // console.log("init");
        });
        GLOBAL_MESS.emmit.on("active", function(obj){
            // console.log("active");
            if (obj.isMenu) {
                $menu.removeClass("none");
            } else {
                $menu.addClass("none");
            }
            $menu_li.removeClass("on");

            $menu_li.filter("[data-page='"+ obj.isMenu +"']")
                .addClass("on");

        });
        GLOBAL_MESS.emmit.on("deactive", function(){
            // console.log("deactive");
        });

    }


    return {
        init : init
    };
});
