/*
 * @name: 常用大模块
 * @overview:
 * @required: null
 * @return: obj [description]
 * @author: she
 */

define(["./common/modules/scroll",
        "./common/modules/tab",
        "./common/modules/dialog"
    ],
    function(Scroll, Tab, Dialog) {
        "use strict";

    return {
        Scroll : Scroll, // 上下拉模块
        Tab : Tab,  // tab页
        Dialog : Dialog // 弹出框
    };
});
