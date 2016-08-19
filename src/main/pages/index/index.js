define([ 'init', 'config', 'method', 'defer', 'vue', 'modules', 'kload'],
    function ( INIT, CONFIG, METHOD, Defer, Vue, Modules, Kload) {
    "use strict";

    var _vm;

    return {
        init : function($p, parms){
            _vm = new Vue({
                el: $p.get(0),
                data: {
                },
                methods: {

                }
            });
        },
        active : function($p, parms){
        },
        deactive: function(){
        }
    };
});
