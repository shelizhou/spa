define([ 'init', 'config', 'method', 'defer', 'vue'],
    function ( INIT, CONFIG, METHOD, Defer, Vue) {
    "use strict";

    return {
        init : function($p, parms){
            new Vue({
                el: $p.get(0),
                data: {
                },
                methods: {

                }
            });
            // let a = 3;
            // console.log(a);
        },
        active : function($p, parms){
        },
        deactive: function(){
        }
    };
});
