/*
 * @name: 公共方法
 * @overview:
 * @required: null
 * @return: obj [description]
 * @author: she
 */

define(["config", "defer"],
    function(CONFIG, Defer) {
        "use strict";

        var result = {};

        // 请求接口
        result.ajax = function(url, jsonParam) {

            var defer = Defer(),
                ajaxJquery;

            jsonParam = jsonParam || {};


            ajaxJquery = $.ajax({
                url: url,
                type: "post",
                data: jsonParam,
                dataType: "json",
                async: true,
                success: function(json) {
                    defer.resolve(json);
                },
                error: function(err) {
                    if (err.statusText !== "timeout") {
                        USED.alert("网络异常");
                        defer.reject();
                    } else {
                        USED.alert("超时");
                        defer.reject();

                    }
                }
            });



            defer.abort = function() {
                ajaxJquery && ajaxJquery.abort();
                // USED.alert("取消请求");
                defer.reject();
            }
            return defer;
        };

        // 去除前后空格
        result.trim = function(str) {
            str = (typeof str === "string") ? str.replace(/(^\s*)|(\s*$)/g, "") : "";
            return str;
        }

        // 改变时间格式
        result.changeTime = function(str, format) {
            if (!str) return "";
            if (!format) {
                format = "yyyy-mm-dd"; //  hh:ii
            };

            if (typeof str === "string") {
                date = new Date(str.replace(/-/g, "/").replace(/T/g, " ").replace(/\+.*$/g, ""));
            } else {
                date = str;
            }

            var objForReplace = {
                y: function(length) {
                    length = length < 2 ? 4 : length;
                    return date.getFullYear().toString().slice(4 - length, 4);
                },
                m: function() {
                    var s = date.getMonth() + 1 + "";
                    if (s.length < 2) {
                        s = "0" + s;
                    }
                    return s;
                },
                d: function() {
                    var s = date.getDate() + "";
                    if (s.length < 2) {
                        s = "0" + s;
                    }
                    return s;
                },
                h: function() {
                    var s = date.getHours() + "";
                    if (s.length < 2) {
                        s = "0" + s;
                    }
                    return s;
                },
                i: function() {
                    var s = date.getMinutes() + "";
                    if (s.length < 2) {
                        s = "0" + s;
                    }
                    return s
                },
                s: function() {
                    var s = date.getSeconds() + "";
                    if (s.length < 2) {
                        s = "0" + s;
                    }
                    return s;
                },
                w: function() {
                    var s = date.getDay();
                    return "周" + "日一二三四五六".charAt(s);
                },
                p: function() {
                    var s = date.getDay();
                    return "6012345".charAt(s);;
                }
            };
            var reg = /y+|m+|d+|h+|i+|s+|w+|p+/gi
            var rtStr = format.replace(reg, function(r) {
                var len = r.length;
                var type = r.charAt(0);
                return objForReplace[type](len);
            });

            return rtStr;
        }

        // 提示
        var $tool = $("#J__m_tooltips");
        result.alert = function(mess, time) {
            var defer = Defer();

            if ($tool.length) {
                $tool.find(".tooltip-text").html(mess);
            } else {
                $tool = $('<div id="J__m_tooltips" class="m_tooltips"/>');
                $('<div class="tooltip-text"/>').html(mess).appendTo($tool);
                $tool.appendTo('body');
            }

            $tool.get(0).offsetHeight;
            $tool.addClass("on");

            setTimeout(function() {
                $tool.removeClass("on");
                defer.resolve();
            }, time || 2000);
            return defer;
        }

        // loading
        result.loading = {
            $loaiing: $("#J__m_loading"),
            show: function(mess) {
                mess = (mess ? mess : '加载中');
                if (this.$loaiing.length) {
                    this.$loaiing.find(".J__loadingmess").html(mess);
                } else {
                    this.$loaiing = $('<div id="J__loadingF" class="m_loading"/>');
                    this.$loaiing.html('<div class="loading__img"></div><div class="loading__mess"><span class="J__loadingmess">' + mess + '</span><span class="dotloading"></span></div>').appendTo('body');
                }
                this.$loaiing.addClass("on");
            },
            hide: function() {
                this.$loaiing.removeClass("on");
            }
        }




        return result;
    });
