/*
 * @name: Tab
 * @overview:
 * @required: null
 * @return: obj [description]
 * @author: she
 */

define([],
    function() {
        "use strict";

        // tab 页
        function Tab(obj) {
            var _this = this,
                nowPage,
                largePage = 0;

            // 返回对象
            if (!(_this instanceof Tab)) {
                return new Tab(obj);
            }

            var o = $.extend(true, {}, obj);

            var $menu = o.sel.find(".J_tab_menu"),
                $block = o.sel.find(".J_tab_con"),
                $prev = o.sel.find(".J_tab_prev"),
                $next = o.sel.find(".J_tab_next"),
                largePage = $menu.length - 1,
                tempHash = {},
                change = function(i) {
                    i = i || 0;
                    if (nowPage === i) return;
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
                next = function() {
                    if (nowPage < largePage) {
                        change(++nowPage);
                    }
                },
                prev = function() {
                    if (nowPage > 0) {
                        change(--nowPage);
                    }
                };

            $menu.on("click", function() {
                var i = $menu.index($(this));
                change(i);
            });

            $prev.on("click", function() {
                prev();
            });
            $next.on("click", function() {
                next();
            });

            if (!o.notLoadFirst) {
                change(0);
            }

            return {
                change: change,
                next: next,
                prev: prev
            }
        }


        return Tab;
});
