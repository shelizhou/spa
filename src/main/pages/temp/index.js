define([ 'config', 'method', 'modules', 'vue', 'template', 'sheSlide', 'kload'],
    function ( CONFIG, METHOD, Modules, Vue, Template, SheSlide, Kload) {
    "use strict";


    return {
        init : function($p, parms){
            // console.log($p, parms);
            new SheSlide({
                slideCell : ".J_slider"
            });


            var thtml = $(".J_script", $p).html();
            Modules.Scroll({
                ele: $(".J_list", $p),
                inner : $(".J_list_inner", $p),
                refreshFlag: true,
                notLoadFirst: false,
                callback: function(n) {
                    var me = this;
                    setTimeout(function() {
                        me.success(thtml, 3);
                    }, 300);
                }
            });


            // 弹出框
            var dialog = Modules.Dialog({
                title: 'xxx',
                content: 'cccc',
                wrap: $p,
                text4Btn: ["确定", "取消"],
                class4Btn: null,
                handler4Btn: function(i){
                    this.hideUI();
                },
                hasMask: true,
                maskClose: false,
                hasShow: false,
                contentClass : "",
                pifuClass : ""
            });
            $p.on("click", ".J_showdialog", function(){
                dialog.showUI();
            });


            Modules.Tab({
                sel: $(".J_tab", $p),
                callback: function(i) {
                    console.log(i);
                }
            });



            $p.on("click", ".J_to", function(){
                Kload.load("me");
            });
            $p.on("click", ".J_alert", function(){
                window.localStorage.clear();
                window.sessionStorage.clear();
                METHOD.alert("清除缓存");
            });
            $p.on("click", ".J_loading", function(){
                METHOD.loading.show();
                // METHOD.loading.hide();
            });


            var vm = new Vue({
                el: $p.get(0),
                data: {
                    message: 'Vue',
                }
            });

            // METHOD.ajax("_ajax/pdTag/getTags.do").done(function(json){
            //     console.log(json);
            // });
        },
        active : function($p, parms){

        },
        deactive: function(){
        }
    };
});
