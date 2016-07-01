/*
* @name: 初始化
* @overview:
* @required: null
* @return: obj [description]
* @author: she
*/

define([],function ( ) {
    "use strict";

    var $wrap = $("#J__wrap"),
        $menu = $("#J__menu"),
        $menu_li = $menu.find(".J__load");

    function init() {


        // 由于某些android手机还是对active 兼容有问题，固还是采用js兼容
        $wrap.on("touchstart", ".J__active", function(){
            $(this).addClass("m_active");
        }).on("touchend touchcancel touchmove", ".J__active", function(){
            $(this).removeClass("m_active");
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

            // document.title = obj.title;

        });
        GLOBAL_MESS.emmit.on("deactive", function(){
            // console.log("deactive");
        });

    }


    return {
        init : init
    };
});
