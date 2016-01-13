/*
* @name: 加载框架
* @overview:
* @required: null
* @return: Kload [description]
* @author: she
*/

define([ ],
    function ( ) {
    "use strict";

    var Kload = (function(){

        var $wrap = $("#J__wrap"),
            $menu = $("#J__menu"),
            $menu_li = $menu.find(".J__load"),
            $pages = $("#J__pages"),
            lastPageHash = "",
            _config = {},
            _history = window.history,
            hadLoadObj = {};

        // 加载页面核心方法
        function load(){
            var hashObj = getHashObj(),
                hashCon = _config.hashConfig[hashObj.name];

            hashObj.con = hashCon;

            setMenu(hashObj.con.isMenu);

            loadPage($pages, hashObj);


        }


        // 加载页面
        function loadPage($wrap, hashObj){

            var hash = hashObj.name,
                $prev = (lastPageHash && hadLoadObj[lastPageHash]) ? hadLoadObj[lastPageHash].dom : null;

            if (hadLoadObj[lastPageHash]) {
                 hadLoadObj[lastPageHash].js.deactive();
            }

            lastPageHash = hash;

            if( !hadLoadObj[hash] ) {
                require(["text!./pages/"+ hash +"/index.html", "./pages/" + hash +"/index"], function(html, js){
                    var $p = $("<div class='J__page s_page' data-hash='"+ hash +"'>");
                    $p.html(html);
                    $wrap.append($p);
                    transPage($prev, $p);
                    hadLoadObj[hash] = {
                        dom: $p,
                        js : js
                    }
                    js.init && js.init($p, hashObj.parm);
                    js.active && js.active($p, hashObj.parm);
                }, function(err){
                    alert("加载错误");
                });
            } else {
                transPage($prev, hadLoadObj[hash].dom);
                hadLoadObj[hash].js.active && hadLoadObj[hash].js.active(hadLoadObj[hash].dom, hashObj.parm);
            }

        }


        // 过度页面
        function transPage($prev, $next){
            $prev && ($prev.removeClass("in").addClass("out"));
            if ($prev === $next) {
                $next.get(0).clientHeight;
            }
            $next.removeClass("out");
            $next.get(0).clientHeight;
            $next.addClass("in");
        }

        // 获取hash 名字和 参数
        function getHashObj(hash){
            var h = hash || window.location.hash.substring(1),
                hIndex = h.indexOf("?"),
                vIndex = -1,
                name = (hIndex === -1) ? h : h.substring(0, hIndex),
                p = (hIndex === -1) ? "" : h.substring(hIndex+1),
                r = {};
            p.split("&").forEach(function(v){
                vIndex = v.indexOf("=");
                if ( vIndex !== -1){
                    r[ v.substring(0, vIndex) ] = v.substring(vIndex+1);
                }
            });

            if(h === "") {
                h = name = _config.defaultHash;
            }
            return {
                parm : r,
                name : name,
                all : h
            }
        }

        // 菜单
        function setMenu(isMenuPage) {
            if (isMenuPage) {
                $menu.removeClass("none");
            } else {
                $menu.addClass("none");
            }
            $menu_li.removeClass("on")
                .filter("[data-page='"+ isMenuPage +"']")
                .addClass("on");
        }


        return {
            init : function(obj){
                _config = obj;

                load();
                $(window).on('hashchange', function(f) {
                    load();
                });
                var me = this;
                // 统一绑定跳转
                $wrap.on("click", ".J__load", function(){
                    var page = $(this).attr("data-page");
                    me.load(page);
                }).on("click", ".J__back", function(){
                    me.back();
                });

            },
            load: function(page) {
                if (!page || !_config.hashConfig[getHashObj(page).name]) {
                    alert("未定义");
                    return;
                } else {
                    window.location.hash = page;
                }
            },

            // 返回
            back : function(n){
                n = n || -1;
                if (_history.length < Math.abs(n)) {
                    n = -_historyy.length;
                }
                _history.go(n);
            }
        }

    })();




    return Kload;
});
