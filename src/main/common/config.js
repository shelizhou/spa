/*
* @name: 公共配置
* @overview:
* @required: null
* @return: obj [description]
* @author: she
*/

define([ ],
    function (  ) {
    "use strict";

    var result = {};

    result.isDebug = true;

    // 配置页面
    result.defaultHash = "index";
    result.hashConfig = {
        "index" : { isMenu: "index" },
        "category" : { isMenu: "category" },
        "me" : { isMenu: "me" },
        "temp" : {  }
    };


    return result;
});
