/*
* @name: 公共配置
* @overview:
* @required: null
* @return: obj [description]
* @author: she
*/

define([  ],
    function (  ) {
    "use strict";

    var result = {};

    // 是否在微信浏览器
    result.isWeChat = /micromessenger/.test(GLOBAL_MESS.ua.toLowerCase()) ? true : false;
    // 是android
    result.isAndroid = GLOBAL_MESS.ua.match(/Android/i) ? true : false;
    // 是Safari
    result.isSafari = GLOBAL_MESS.ua.match(/Safari/i) ? true : false;

    // 缓存永久字段 localStorage
    result.word = (function() {
        var w = {
            // searchList: "_sasfdeassdf1", // 搜索历史
        };
        return {
            get: function(name) {
                if (typeof w[name] === "undefined") {
                    alert("请先存标志字段");
                    return null;
                }
                return localStorage.getItem(w[name]);
            },
            set: function(name, val) {
                if (!result.isLocalStorageSupported) return;
                if (typeof w[name] === "undefined") {
                    alert("请先存标志字段");
                    return;
                }
                localStorage.setItem(w[name], val);
            },
            remove: function(name) {
                if (typeof w[name] === "undefined") {
                    alert("请先存标志字段");
                    return;
                }
                localStorage.removeItem(w[name]);
            },
            boradCast: function(name, fn) {
                // window.removeEventListener("storage");
                window.addEventListener("storage",function(e){
                    // console.log("yess----" + e);
                    // e.key newValue: "22"oldValue: "1"
                    if (e.key === w[name]) {
                        fn && fn(e);
                    }
                },false);
            }
        }
    }());
    result.session = (function() {
        var w = {
            // loginPage: "_aabldf1",  // 登录调整
        };
        return {
            get: function(name) {
                if (typeof w[name] === "undefined") {
                    alert("请先存标志字段");
                    return null;
                }
                return sessionStorage.getItem(w[name]);
            },
            set: function(name, val) {
                if (typeof w[name] === "undefined") {
                    alert("请先存标志字段");
                    return;
                }
                sessionStorage.setItem(w[name], val);
            },
            remove: function(name) {
                if (typeof w[name] === "undefined") {
                    alert("请先存标志字段");
                    return;
                }
                sessionStorage.removeItem(w[name]);
            }
        }
    })();

    // 是否支持缓存
    result.isLocalStorageSupported = (function() {
        var testKey = 'test',
            storage = window.localStorage;
        try {
            storage.setItem(testKey, 'testValue');
            storage.removeItem(testKey);
            return true;
        } catch (error) {
            return false;
        }
    })();


    // 注册事件
    result.emmit = (function(){
        // 事件注册
        var handlers = {
            "init" : [], // 初始页面
            "active" : [], // 进入页面
            "deactive" : [], // 离开页面
        };
        return {
            on : function(name, fn) {
                if (typeof handlers[name] === "undefined") {
                    alert("未定义");
                    return;
                } else if (typeof fn !== "function") {
                    alert("未添加function");
                    return;
                }
                handlers[name].push(fn);
            },
            fire : function(name, data){
                if (typeof handlers[name] === "undefined") {
                    alert("未定义");
                    return;
                }
                if( handlers[name] instanceof Array ) {
                    handlers[name].forEach(function(fn){
                        if (typeof fn === "function") {
                            fn.call(null, data);
                        }
                    });
                }
            },
            off : function(name) {
                if (typeof handlers[name] === "undefined") {
                    alert("未定义");
                    return;
                }
                handlers[name] = [];
            }
        }
    })();

    return result;
});
