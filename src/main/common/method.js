/*
* @name: 公共方法
* @overview:
* @required: null
* @return: obj [description]
* @author: she
*/

define(["config", "defer", "used"], 
    function (  CONFIG, Defer, USED ) {
    "use strict";

    var result = {};

    // 设备准好了
    var isDeivceReady = Defer(function(r){
        r.resolve();
        // if (CONFIG.isBingoDegbug) {
        //     document.addEventListener("deviceready", function() {
        //         r.resolve();
        //     }, false);
        // } else {
        //     r.resolve();
        // }
    });
    result.isDeivceReady = isDeivceReady;

    // 请求接口
    result.ajax = function(methodName, jsonParam) {

        var defer = Defer(),
            ajaxJquery,
            url =  methodName; //CONFIG.url.base +

        jsonParam = jsonParam || {};

        var getData = function(){
            if ( typeof Cordova !== "undefined" ) {
                app.post(url, jsonParam, function(res) {
                    var json = null;
                    try {
                        // bingo.alert(res);
                        var data = res.returnValue;
                        json = JSON.parse(data);
                        if (json.code === 200) {
                            defer.resolve(json);
                        } else {
                            USED.alert(json.mess);
                            defer.reject();
                        }
                    } catch (e) {
                        defer.reject({
                            type: 3,
                            mess: "数据解析出错"
                        });
                    }
                }, function(err) {
                    USED.alert("网络问题");
                    defer.reject({
                        type: 2,
                        mess: "网络问题"
                    });
                });
            } else {
                ajaxJquery = $.ajax({
                    url: url,
                    type: "POST",
                    data: jsonParam,
                    dataType: "json",
                    timeout: 20000,
                    async: true,
                    success: function(json) {
                        // console.log(json);
                        // if (json.code === 200) {
                            defer.resolve(json);
                        // } else {
                            // USED.alert(json.mess);
                            // defer.reject();
                        // }
                    },
                    error: function(err) {
                        if (err.statusText !== "timeout") {
                            USED.alert("网络问题");
                            defer.reject({
                                type: 2,
                                mess: "网络问题"
                            });
                        } else {
                            USED.alert("超时");
                            defer.reject({
                                type: 1,
                                mess: "超时"
                            });
                        }
                    }
                });
            }
        };

        getData();


        defer.abort = function(){
            ajaxJquery && ajaxJquery.abort();
            defer.reject({
                type: 4,
                mess: "取消请求"
            });
        }
        return defer;
    };

    // 返回
    result.back = function(){
        CONFIG.tempBack = true;
        window.history.go(-1);
    }


    return result;
});
