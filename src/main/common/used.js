/*
* @name: 公共方法
* @overview: 
* @required: null
* @return: obj [description]
* @author: she
*/

define([ "defer"], 
    function ( Defer ) {
    "use strict";

    var result = {};

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
        $loaiing : $("#J__m_loading"),
        show: function(mess){
            mess = (mess ? mess : '加载中');
            if (this.$loaiing.length) {
                this.$loaiing.find(".J__loadingmess").html(mess);
            } else {
                this.$loaiing = $('<div id="J__loadingF" class="m_loading"/>');
                this.$loaiing.html('<div class="loading__img"></div><div class="loading__mess"><span class="J__loadingmess">' + mess + '</span><span class="dotloading"></span></div>').appendTo('body');
            }
            this.$loaiing.addClass("on");
        },
        hide : function() {
            this.$loaiing.removeClass("on");
        }
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
                  callback();
                }
              }
            }, 750);


        }).on('touchmove', child, function(e) {
            e.originalEvent && (e = e.originalEvent);
            
            touch.x2 = e.touches[0].pageX;
            touch.y2 = e.touches[0].pageY;
        }).on('touchend', child, function() {
            if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) || (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30)) {
                if (type === swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)) {
                    callback();
                }
                touch = {};
            }
            if (touch.isDoubleTap) {
                if (type === "doubleClick") {
                    callback();
                }
                touch = {};
            }
            longHoldTimeout && clearTimeout(longHoldTimeout);
        });
    }

    // 去除前后空格
    result.trim = function(str) {
        str = (typeof str === "string") ? str.replace(/(^\s*)|(\s*$)/g, "") : "";
        return str;
    }

    // 改变时间格式
    result.changeTime = function(str, format) {
        if (!str) return "";
        if (!format) {
            format = "yyyy-mm-dd";  //  hh:ii
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

    function Initscroll(obj){

            var _this = this;
           
             // 返回对象
            if (!(_this instanceof Initscroll)) {
                // var args = arguments;
                // function F() {
                //     return Initscroll.apply(this, args);
                // }
                // F.prototype = Initscroll.prototype;
                // return new F(); 
                return new Initscroll(obj); 
                
            }

            if (!obj.ele) return;
            if (obj.ele.length) {
                obj.ele = obj.ele.get(0);
            } else if (typeof obj.ele === "string") {
                obj.ele = document.getElementById(obj.ele);
            }
            obj.parms = obj.parms || {};
            obj.refreshFlag = (typeof obj.refreshFlag !== "undefined") ? obj.refreshFlag : false;

            var 
                // 当前页码
                page = 1,

                // 标志位，判断是否可以加载下一页
                nextFlag = true,

                // 标志位，判断是否可以重新加载，出现在加载出错
                reloadFlag = false,

                // top dom
                $topDom = $("<div class='m_topDom'></div>"),
                // <div class='topDom__logo'></div>重新加载中

                // 底部dom
                downDom = document.createElement("div"),
                downDom_text = document.createElement("div"),
                downDom_logo = document.createElement("div"),

                // 滚动的dom
                ele_childDom = obj.ele.children[0],

                // 处理底部dom
                downDomAction = {
                    startLoading : function(){
                        // downDom.style.display = "block";
                        $(downDom).removeClass("m_downDom_reload");
                        $(downDom).addClass("m_downDom_loading");
                        downDom.children[1].innerHTML = "正在加载，请稍后";
                    },
                    endLoading : function(){
                        // downDom.style.display = "none";
                        //  $(downDom).removeClass("downDom_loading");
                        $(downDom).removeClass("m_downDom_reload");
                        obj.refreshFlag && $topDom.removeClass("on");

                    },
                    last : function(nodate){
                        // downDom.style.display = "block";
                        $(downDom).removeClass("m_downDom_reload m_downDom_loading");
                        downDom.children[1].innerHTML = nodate ? "暂无数据" : "最后一页";
                        obj.refreshFlag && $topDom.removeClass("on");
                    },
                    error : function(){
                        // downDom.style.display = "block";
                        $(downDom).removeClass("m_downDom_loading");
                        $(downDom).addClass("m_downDom_reload");
                        downDom.children[1].innerHTML = "点击重新加载";
                        obj.refreshFlag && $topDom.removeClass("on");
                    }
                },

                // 加载
                next = function(p) {
                    page = p;
                    // console.log(p)
                    _loadingStart();
                    obj.getDateFromPage && obj.getDateFromPage.apply(_this, [p, _this]);
                };

                // 核心代码，滚动
                obj.ele.addEventListener("scroll", function(e){
                  var tar = e.target;
                  // 滚到底部了
                  if (tar.scrollTop + tar.clientHeight >= (tar.scrollHeight - 10) ) {
                    if (nextFlag && next) {
                        nextFlag = false;
                        next(++page);
                    }
                  }
                });
                if(obj.refreshFlag){
                    result.touchEvent($(obj.ele), "swipeDown", function(){
                        if (obj.ele.scrollTop > 0) return;
                        $topDom.addClass("on");
                        next(1);
                    });
                }
            


            // 重新加载事件
            downDom.addEventListener("click", function(){
                if (reloadFlag) {
                    next(page);
                    downDomAction.startLoading();
                }
            });

            // 可以下一页的动作
            function _loadingStart(){
                nextFlag = false;
                reloadFlag = false;
                downDomAction.startLoading();
            }
            function _loadingEnd(){
                nextFlag = true;
                reloadFlag = false;
                downDomAction.endLoading();
            }

            // 最后一页的动作
            function _last(allpage){
                nextFlag = false;
                reloadFlag = false;
                if (allpage === 0) {
                    downDomAction.last(true);
                } else {
                    downDomAction.last(false);
                }
            }

            // ------ 需要抛出的方法
            
            // 错误处理
            _this.error = function(){
                nextFlag = false;
                reloadFlag = true;
                downDomAction.error();

            }

            // 成功处理：接收页码，处理当前页的状态
            _this.success = function(allpage){
                page < allpage ? _loadingEnd() : _last(allpage);    

                // 当页不够满时， 还有下一页时加载下一页
                if ( (ele_childDom.clientHeight - 60 < obj.ele.clientHeight) && (page < allpage) ) {
                    next(++page);
                }

            }
            // 加载第一页
            _this.load = function(){
                next(1);
                obj.ele.scrollTop = 0;
            }

            // ajax 参数
            _this.parms = obj.parms;

            // ----------- 执行
            $(downDom).addClass("m_downDom");
            $(downDom_logo).addClass("m_downDom__logo");
            $(downDom_text).addClass("m_downDom__text");
            downDom.appendChild(downDom_logo);
            downDom.appendChild(downDom_text);
            obj.ele.children[0].appendChild(downDom);
            if(obj.refreshFlag){
                $(obj.ele.children[0]).prepend($topDom);
                // $(obj.ele.children[0]).scrollTop(280);
                // obj.ele.scrollTop = 80;
            }
            // 要不要先加载
            if (!obj.notLoadFirst) {
                _this.load();
            }

            return _this;
    }
    result.Initscroll = Initscroll;

    // tab 页
    function Tab(obj){
        var _this = this,
            nowPage = 0,
            largePage = 0;
        
        // 返回对象
        if (!(_this instanceof Tab)) {
            // var args = arguments;
            // function F() {
            //     return Tab.apply(this, args);
            // }
            // F.prototype = Tab.prototype;
            // return new F(); 
            return new Tab(obj); 
        }

        var o = $.extend(true, {

        }, obj);

        var $menu = o.sel.find(".J__tab__menu"),
            $block = o.sel.find(".J__tab__con"),
            $prev = o.sel.find(".J__tab__prev"),
            $next = o.sel.find(".J__tab__next"),
            largePage = $menu.length - 1,
            tempHash = {},
            change = function(i){
                i = i || 0;
                nowPage = i;
                if (nowPage >= largePage) {
                    $next.addClass("disable");
                } else {
                    $next.removeClass("disable");
                }
                if (nowPage <= 0) {
                    $prev.addClass("disable");
                } else {
                    $prev.removeClass("disable");
                }
                $menu.removeClass("on").eq(i).addClass("on");
                $block.addClass("none").eq(i).removeClass("none");

                if (!tempHash[i]) {
                    o.callbackOne && o.callbackOne(i);
                }
                o.callback && o.callback(i);
                tempHash[i] = true;
            },
            next = function(){
                if (nowPage < largePage) {
                    change(++nowPage);
                }
            },
            prev = function(){
                if (nowPage > 0) {
                    change(--nowPage);
                }
            };

        $menu.on("click", function(){
            var i = $menu.index($(this));
            change(i);
        });

        $prev.on("click", function(){
            prev();
        });
        $next.on("click", function(){
            next();
        });

        if (!o.notLoadFirst) {
            change(0);
        }

        return {
            change : change,
            next : next,
            prev : prev
        }
    }
    result.Tab = Tab;



    return result;
});

