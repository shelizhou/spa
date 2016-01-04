/*
* @name: 公共方法
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

    result.defaultHash = "index"; 
    result.hashConfig = {
        "index" : { title:""},
        "test" : {title:""}
    };


    return result;
});

