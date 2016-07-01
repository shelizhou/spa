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

    // 限制最多缓存多少个页面
    var maxPageLength = 50;

    // 是否是返回
    var isBacking = false;

    // 是否是前进
    var isLoadfont = false;

    // 转场类型 fade inlr
    var _lastTran, // 上一个转场
        _nowTran; // 当前转场

    var _backlength = 1; // 返回的页数

    var $wrap = $("#J__wrap"),
        $loading = $("#J__m_loading"),
        $pages = $("#J__pages"),
        lastPageHash = "",
        _config = {},
        _history = window.history,
        historyArr = [], // 历史记录
        hadLoadObj = {},
        hadLoadArr = [];


    // 加载页面核心方法
    function load(){

        var hashObj = getHashObj(),
            hashCon = _config.hashConfig[hashObj.name];

        hashObj.con = hashCon;

        _lastTran = _lastTran ? _nowTran : (hashObj.con.tran || "inlr");
        _nowTran = hashObj.con.tran || "inlr";

        setHistory(hashObj.name);

        loadPage(hashObj);


    }

    // 加载页面
    function loadPage(hashObj){

        var hash = hashObj.name,
            $prev = (lastPageHash && hadLoadObj[lastPageHash]) ? hadLoadObj[lastPageHash].dom : null;

        if (hadLoadObj[lastPageHash]) {
             GLOBAL_MESS.emmit && GLOBAL_MESS.emmit.fire("deactive");
             hadLoadObj[lastPageHash].js.deactive();
             $loading.removeClass("on");
        }


        lastPageHash = hash;

        var exthtml = "",
            extjs = "";

        hashObj.con = hashObj.con || {};
        if( !hadLoadObj[hash] ) {
            if (!hashObj.con.asyn) {
                exthtml = "./pages/"+ hash +"/index.html";
                extjs = "./pages/"+ hash +"/index";
            } else {
                $loading.addClass("on");
                exthtml = hashObj.con.pathhtml.replace("/main/", "");
                extjs = hashObj.con.pathjs.replace(".js", "").replace("/main/", "");
            }
            require(["text!" + exthtml, extjs], function(html, js){
                if (hashObj.con.asyn) {
                    $loading.removeClass("on");
                }
                hadLoadObj[hash] = {
                    dom: null,
                    html: html,
                    js : js,
                };
                clearLashDom(doHadloadArr(hash));
                doPage(hadLoadObj[hash], hashObj, $prev, hash);
            }, function(err){
                console.error(err);
                // alert("加载错误");
            });
        } else {

            clearLashDom(doHadloadArr(hash));
            doPage(hadLoadObj[hash], hashObj, $prev, hash);
        }

    }

    function doHadloadArr(hash){

        var isExit = hadLoadArr.some(function(v, i){
            if (v === hash) {
                hadLoadArr.splice(i,1);
                return true;
            } else {
                return false;
            }
        }).length > 0 ? true : false;

        hadLoadArr.push(hash);

        var clearDomHash;
        // 不存在
        if (!isExit) {
            if (hadLoadArr.length > maxPageLength) {
                clearDomHash = hadLoadArr[0];
                hadLoadArr.splice(0,1);
            }
        }
        // console.log(hadLoadArr);
        return clearDomHash;
    }

    function clearLashDom(hash){
        if (!hash) return;
        hadLoadObj[hash].dom.remove();
        hadLoadObj[hash].dom = null;
    }

    // 执行转场和js
    function doPage(obj, hashObj, $prev, hash) {
        if (!obj.dom) {
            obj.dom = $("<div class='J__page s_page' data-hash='"+ hash +"'>");
            obj.dom.html(obj.html);
            $pages.append(obj.dom);
            transPage($prev, obj.dom);
            GLOBAL_MESS.emmit && GLOBAL_MESS.emmit.fire("init", hashObj.con);
            obj.js.init && obj.js.init(obj.dom, hashObj.parm);
        } else {
            transPage($prev, obj.dom);
        }
        GLOBAL_MESS.emmit && GLOBAL_MESS.emmit.fire("active", hashObj.con);
        obj.js.active && obj.js.active(obj.dom, hashObj.parm);

    }


    // 过度页面
    function transPage($prev, $next){
        // console.log(_lastTran, _nowTran);
        if (_lastTran === "fade" && _nowTran === "fade") {
            // 淡入效果
            if ($prev) {
                $prev.removeClass("in reverse fade inlr").addClass("out");
            }
            // if ($prev === $next) {
            //     $next.get(0).clientHeight;
            // }
            $next.removeClass("out");
            $next.addClass("fade in");
            // $next.get(0).clientHeight;
            // $next.addClass("in");

        } else {
            // 左右转场
            if ($prev) {
                $prev.removeClass("in reverse fade inlr").addClass("out")
            }
            $next.removeClass("out");
            if (isBacking) {
                $next.addClass("inlr reverse");
            } else {
                $next.addClass("inlr");
            }
            $next.get(0).clientHeight;
            $next.addClass("in");
        }


        isBacking = false;
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

        if(h === "" || !_config.hashConfig[name]) {
            h = name = _config.defaultHash;
        }
        return {
            parm : r,
            name : name,
            all : h
        }
    }

    // 处理历史记录
    function setHistory(hash) {
        if (!isLoadfont) {
            if (historyArr.length > 1) {
                // if (historyArr[historyArr.length - 2] === hash) {
                if (historyArr[historyArr.length - (_backlength + 1)] === hash) {
                    isBacking = true;
                }
            }
        }
        isLoadfont = false;

        if (!isBacking) {
            historyArr.push(hash);
        } else {
            for (var i = 0; i < _backlength; i++) {
                historyArr.pop();
            }
        }
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
                var page = $(this).attr("data-page"),
                    wpage = $(this).attr("data-wp");

                if (page) {
                    // 表示是前进
                    isLoadfont = true;
                    me.load(page);
                } else if (wpage) {
                    window.location.href = wpage;
                }

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
            // console.log(historyArr);
        },

        // 返回
        back : function(n){
            n = n || -1;
            // alert(_history.length + "  " + n)
            if (_history.length < Math.abs(n)) {
                n = -_history.length;
            }
            _backlength = Math.abs(n);
            // console.log(historyArr);
            // alert(historyArr.length)
            if (historyArr.length > 1) {
                _history.go(n);
            } else {
                window.location.hash = _config.defaultHash;
            }
        },

        // 先返回在goto
        backAndGo : function(n, page){
            var me = this;
            // $loading.addClass("on");
            $wrap.addClass("none");
            me.back(n);
            setTimeout(function () {
                me.load(page);
                setTimeout(function () {
                    $wrap.removeClass("none");
                }, 300);
            }, 300);

        }


    }


});
