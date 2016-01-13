define([ 'config', 'method', 'defer'],
    function ( CONFIG, METHOD, Defer) {
    "use strict";

    return {
        init : function($p, parms){
            $(".J_time", $p).html( (new Date() - START_TIME) + " ms" );
        },
        active : function($p, parms){
        },
        deactive: function(){
        }
    };
});
