/*
* @name: Vue
* @overview:
* @required: null
* @return: Vue [mvvm]
* @author: she
*/

define([ "./plugins/vue/vue" ],
    function ( Vue ) {
    "use strict";

    // 指令
    Vue.directive('value', {
        bind: function () {
        },
        update: function(value){
            this.el.innerHTML = value;
        }
    });


    return Vue;
});
