/*
* @name: Vue
* @overview:
* @required: null
* @return: Vue [mvvm]
* @author: she
*/

define([ "vue_plugins" ],
    function ( Vue ) {
    "use strict";

    Vue.filter('ecURI', function(v){
        return encodeURIComponent(v);
    });

    // 轮播 指令
    Vue.directive('slide', {
        slide : null,
        bind: function () {

        },
        update: function(value){

            var el = this.el;
            if (value && value.length) {
                Vue.nextTick(function() {
                    if (!this.slide) {
                        this.slide = new SheSlide({
                            slideCell : el,
                            auto : true
                        });
                    } else {
                        this.slide.reset();
                    }
                });
            }
        }
    });

    // 指令
    // Vue.directive('value', {
    //     bind: function () {
    //     },
    //     update: function(value){
    //         this.el.innerHTML = value;
    //     }
    // });


    return Vue;
});
