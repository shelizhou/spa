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
                        result.alert("网络异常");
                        defer.reject();
                    } else {
                        result.alert("超时");
                        defer.reject();

                    }
                }
            });



            defer.abort = function() {
                ajaxJquery && ajaxJquery.abort();
                // result.alert("取消请求");
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

        // swipeLeft , swipeRight,  swipeUp, swipeDown, longHold, doubleClick
        result.touchEvent = function($dom, type, child, callback) {
            if (typeof child !== 'string') {
                callback = child;
                child = "";
            }
            var touch = {};
            var now, delta, longHoldTimeout;

            function swipeDirection(x1, x2, y1, y2) {
                var xDelta = Math.abs(x1 - x2),
                    yDelta = Math.abs(y1 - y2)
                return xDelta >= yDelta ? (x1 - x2 > 0 ? 'swipeLeft' : 'swipeRight') : (y1 - y2 > 0 ? 'swipeUp' : 'swipeDown')
            }
            $dom.on("touchstart", child, function(e) {
                // console.log(e.originalEvent)
                e.originalEvent && (e = e.originalEvent);
                touch.x1 = e.touches[0].pageX;
                touch.y1 = e.touches[0].pageY;
                now = Date.now();
                delta = now - (touch.last || now);
                if (delta > 0 && delta <= 250) touch.isDoubleTap = true;
                touch.last = now;
                longHoldTimeout = setTimeout(function(){
                  if (type === "longHold") {
                    if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) || (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30)) {
                    } else {
                      callback.apply(this);
                    }
                  }
                }, 750);


            }).on('touchmove', child, function(e) {
                e.originalEvent && (e = e.originalEvent);

                touch.x2 = e.touches[0].pageX;
                touch.y2 = e.touches[0].pageY;

                // fix android 4.4 bug
                if (touch.x2 && Math.abs(touch.x1 - touch.x2) > 10) {
                    e.preventDefault();
                }
            }).on('touchend', child, function() {
                if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) || (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30)) {
                    if (type === swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)) {
                        callback.apply(this);
                    }
                    touch = {};
                }
                if (touch.isDoubleTap) {
                    if (type === "doubleClick") {
                        callback.apply(this);
                    }
                    touch = {};
                }
                longHoldTimeout && clearTimeout(longHoldTimeout);
            });
        }


        var $tool = $("#J__m_tooltips");
        result.alert = function(mess, time) {
            var defer = Defer();
            if ($tool.length) {
                $tool.find(".tooltip-text").html(mess);
            } else {
                $tool = $('<div id="J__m_tooltips" class="m_tooltips none"/>');
                $('<div class="tooltip-text tooltip-content"/>').html(mess).appendTo($tool);
                $tool.appendTo('body');
            }
            $tool.removeClass("down");
            $tool.addClass("full");
            // if( type === 2 ){
            // } else {
                // $tool.removeClass("full");
                // $tool.addClass("down");
            // }
            $tool.removeClass("none");
            $tool.get(0).offsetHeight;
            $tool.addClass("on");

            time = time || 2500;
            setTimeout(function() {
                $tool.removeClass("on");
                $tool.addClass("none");
                defer.resolve();
            }, time);
            return defer;
        }

        // loading
        result.loading = {
            $loaiing: $("#J__m_loading"),
            show: function(mess, type) {
                mess = (mess ? mess : '加载中');
                if (this.$loaiing.length) {
                    this.$loaiing.find(".J__loadingmess").html(mess);
                } else {
                    this.$loaiing = $('<div id="J__loadingF" class="m_loading"/>');
                    this.$loaiing.html('<div><div class="loading__img"></div><div class="loading__mess"><span class="J__loadingmess">' + mess + '</span><span class="dotloading"></span></div></div>').appendTo('body');
                }
                // 全屏的
                if (type === 2) {
                    this.$loaiing.addClass("full");
                }
                this.$loaiing.addClass("on");
            },
            hide: function() {
                this.$loaiing.removeClass("on full");
            }
        }


        return result;
    });
