/*
 * @name: Initscroll
 * @overview:
 * @required: null
 * @return: obj [description]
 * @author: she
 */

define(["method"],
    function(METHOD) {
        "use strict";

        function Initscroll(obj) {

            var _this = this;

            // 返回对象
            if (!(_this instanceof Initscroll)) {
                return new Initscroll(obj);
            }

            if (!obj.ele) return;
            if (obj.ele.length) {
                obj.ele = obj.ele.get(0);
            } else if (typeof obj.ele === "string") {
                obj.ele = document.getElementById(obj.ele);
            }
            obj.refreshFlag = (typeof obj.refreshFlag !== "undefined") ? obj.refreshFlag : false;

            obj.lastText = obj.lastText || "最后一页";
            obj.nodataText = obj.nodataText || "暂无数据";

            var ele_childDom = obj.ele.children[0];
            // console.log(ele_childDom);
            var
                // 当前页码
                page = 1,

                // 标志位，判断是否可以加载下一页
                nextFlag = true,

                // 标志位，判断是否可以重新加载，出现在加载出错
                reloadFlag = false,

                // top dom
                $topDom = $("<div class='m_topDom'></div>"),

                // 底部dom
                downDom = document.createElement("div"),
                downDom_text = document.createElement("div"),
                downDom_logo = document.createElement("div"),

                // 处理头部Tom
                topDomAction = {
                    hide: function() {
                        $topDom.removeClass("on");
                    },
                    show: function(h) {
                        $topDom.addClass("on");
                        downDom.children[1].innerHTML = "正在加载，请稍后";
                    }
                },

                // 处理底部dom
                downDomAction = {
                    startLoading: function() {
                        $(downDom).removeClass("m_downDom_reload");
                        $(downDom).addClass("m_downDom_loading");
                        downDom.children[1].innerHTML = "正在加载，请稍后";
                    },
                    endLoading: function() {
                        $(downDom).removeClass("m_downDom_reload");
                        obj.refreshFlag && topDomAction.hide();

                    },
                    last: function(nodate) {
                        $(downDom).removeClass("m_downDom_reload m_downDom_loading");
                        downDom.children[1].innerHTML = nodate ? obj.nodataText : obj.lastText;
                        obj.refreshFlag && topDomAction.hide();
                    },
                    error: function() {
                        $(downDom).removeClass("m_downDom_loading");
                        $(downDom).addClass("m_downDom_reload");
                        downDom.children[1].innerHTML = "点击重新加载";
                        obj.refreshFlag && topDomAction.hide();
                    }
                },

                // 加载
                next = function(p) {
                    page = p;
                    _loadingStart();
                    obj.callback && obj.callback.apply(_this, [p]);
                };

            // 核心代码，滚动
            obj.ele.addEventListener("scroll", function(e) {
                var tar = e.target;
                // 滚到底部了
                if (tar.scrollTop + tar.clientHeight >= (tar.scrollHeight - 10)) {
                    if (nextFlag && next) {
                        nextFlag = false;
                        next(++page);
                    }
                }
            });
            // var pandown = false;
            if (obj.refreshFlag) {
                // $(obj.ele).on("touchmove", function(e){
                //     if (obj.ele.scrollTop <= 0) { // e.preventDefault(); }
                // });
                METHOD.touchEvent( $(obj.ele), "swipeDown", function(){

                // new Hammer(obj.ele).on("pandown", function(e) {
                    // e.preventDefault();
                    if (obj.ele.scrollTop > 0) return;
                    // console.log(e.distance);
                    // if (e.distance > 100) {
                        // pandown = true;
                        topDomAction.show();
                        setTimeout(function () {
                            // pandown = false;
                            next(1);
                        }, 200);
                    // }
                });

                // $topDom.on("webkitTransitionEnd", function() {
                //     pandown = false;
                //     next(1);
                // });

            }



            // 重新加载事件
            downDom.addEventListener("click", function() {
                if (reloadFlag) {
                    next(page);
                    downDomAction.startLoading();
                }
            });

            // 可以下一页的动作
            function _loadingStart() {
                nextFlag = false;
                reloadFlag = false;
                downDomAction.startLoading();
            }

            function _loadingEnd() {
                nextFlag = true;
                reloadFlag = false;
                downDomAction.endLoading();
            }

            // 最后一页的动作
            function _last(allpage) {
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
            _this.error = function() {
                nextFlag = false;
                reloadFlag = true;
                downDomAction.error();

            }

            // 成功处理：接收html和页码，处理当前页的状态
            _this.success = function(allpage) {

                page < allpage ? _loadingEnd() : _last(allpage);

                // 当页不够满时， 还有下一页时加载下一页
                if (!obj.notAutoLoad) {
                    if ((ele_childDom.clientHeight - 60 < obj.ele.clientHeight) && (page < allpage)) {
                        next(++page);
                    }
                }

            }
            // 加载第一页
            _this.load = function() {
                next(1);
                obj.ele.scrollTop = 0;
            }


            // ----------- 执行
            $(downDom).addClass("m_downDom");
            $(downDom_logo).addClass("m_downDom_logo");
            $(downDom_text).addClass("m_downDom_text");
            downDom.appendChild(downDom_logo);
            downDom.appendChild(downDom_text);
            obj.ele.appendChild(downDom);
            downDomAction.startLoading(); // 一开始loading
            if (obj.refreshFlag) {
                $(obj.ele).prepend($topDom);
            }
            // 要不要先加载
            if (!obj.notLoadFirst) {
                _this.load();
            }

            return _this;
        }


        return Initscroll;
});
