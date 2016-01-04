define([ 'config', 'method', 'defer'],
    function ( CONFIG, METHOD, Defer) {
    "use strict";


    return {
        init : function($p, parms){
            $("#J__back").on("click", function(){
                METHOD.back();
            })

        },
        active : function($p, parms){

        },
        deactive: function(){
        }
    };
});
