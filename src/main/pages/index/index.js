define([ 'config', 'method', 'defer', 'vue', 'template', 'used', 'dialog'],
    function ( CONFIG, METHOD, Defer, Vue, Template, USED, Dialog) {
    "use strict";


    // 调试
    // console.log(document)
    // console.dir(document)
    // console.table([{a:1,b:2}, {a:3,b:4}])

    // METHOD.ajax("http://liganjianying.sinaapp.com/index.php/Blog/getBlogListJson?page=1").done(function(a){
    //     console.dir(a)
    // });
    return {
        init : function($p, parms){
            // var thtml = $(".J__list__inner", $p).find("script").html();
            // var a = USED.Initscroll({
            //     ele: $(".J__list", $p),
            //     parms: {
            //     },
            //     refreshFlag: true,
            //     notLoadFirst: false,
            //     getDateFromPage: function(n, _this) {
            //         if (n === 1) {
            //             $(".J__list__inner", $p).html( thtml );
            //         } else {
            //             $(".J__list__inner", $p).append( thtml );
            //         }
            //         _this.success(3);
            //     }
            // });
            // a.load(1)

            // new Dialog.Chosen().init({
            //     title: 'xxx',
            //     content: 'cccc',
            //     wrap: $p,
            //     text4Btn: ["确定", "取消"],
            //     class4Btn: null,
            //     handler4Btn: function(i){
            //         this.hideUI();
            //     },
            //     hasMask: true,
            //     maskClose: false,
            //     hasShow: false,
            //     contentClass : "",
            //     pifuClass : ""
            // }).showUI();
            // USED.loading.show();

            var vm = new Vue({
                el: $p.get(0),
                data: {
                    message: 'Hello Vue.js!',
                }
            });

            // $.ajax({
            //     type:"post",
            //     url:"_ajax/pdTag/getTags.do",
            //     dataType:"json",
            //     success:function(json){
            //         console.log(json);
            //     }
            // })
        },
        active : function($p, parms){

        },
        deactive: function(){
        }
    };
});
