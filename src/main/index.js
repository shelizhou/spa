require.config({
    baseUrl : "./main",
    paths: {
        text : "../js/require/text",
        config : "common/config",
        method : "common/method",
        used : "common/used",
        dialog : "common/dialog",
        defer : "plugins/defer/defer",
        fastclick : "plugins/fastclick/fastclick",
        template : "common/template",
        sheSlide : "plugins/sheSlide/sheSlide",
        vue : "common/vue"
    }
});

define('index', [
    'config',
    'method',
    'defer',
    'fastclick',
    'used'
    ],
    function ( CONFIG, METHOD, Defer, FastClick, USED) {

    var Kload = (function(){

        var $pages = $("#J__pages"),
            nowPageHash = "",
            nowPageChildHash = "",
            nowDefer,
            hadLoadObj = {};

        // 加载页面核心方法
        function load(){
            var hashObj = getHashObj(),
                hashCon = CONFIG.hashConfig[hashObj.name];

            hashObj.con = hashCon;

            if (!hashCon) {
                USED.alert("未定义");
                return;
            }
            if (hashCon.parent) {
                if (!hadLoadObj[hashCon.parent]) {
                    loadPage($pages, hashCon.parent, {}).done(function($p){
                        loadPage($p.find(".J__pages__childs"), hashObj.name, hashObj);
                    });
                } else {
                    loadPage(hadLoadObj[hashCon.parent].dom.find(".J__pages__childs"), hashObj.name, hashObj);
                }
            } else {

                loadPage($pages, hashObj.name, hashObj);
            }



        }
        function loadPage($wrap, hash, hashObj){
            var resultDefer = new Defer();

            hadLoadObj[nowPageChildHash] && hadLoadObj[nowPageChildHash].js.deactive();
            hadLoadObj[nowPageChildHash] && hadLoadObj[nowPageChildHash].dom.removeClass("in").addClass("out");

            if (hashObj.con && hashObj.con.parent) {
                if (nowPageHash !==  hashObj.con.parent) {
                    transPage(hadLoadObj[hashObj.con.parent].dom);

                    hadLoadObj[nowPageHash] && hadLoadObj[nowPageHash].dom.removeClass("in").addClass("out");
                    hadLoadObj[nowPageHash] && hadLoadObj[nowPageHash].js.deactive();

                }
            } else {
                hadLoadObj[nowPageHash] && hadLoadObj[nowPageHash].dom.removeClass("in").addClass("out");
                hadLoadObj[nowPageHash] && hadLoadObj[nowPageHash].js.deactive();
            }



            if (hashObj.con && hashObj.con.parent) {
                nowPageHash = hashObj.con.parent;
                nowPageChildHash = hash;
            } else {
                nowPageHash = hash;
                nowPageChildHash = "";
            }

            if( !hadLoadObj[hash] ) {
                // USED.loading.show();

                if (nowDefer && nowDefer.state() === "notyet") {
                    nowDefer.reject();
                }
                nowDefer = new Defer();
                require(["text!./pages/"+ hash +"/index.html"], function(html){
                    require(["./pages/" + hash +"/index"], function(js){
                        nowDefer.resolve(html, js);
                    }, function(err){
                        nowDefer.reject(err);
                    });
                }, function(err){
                    nowDefer.reject(err);
                });

                nowDefer.done(function(html, js){
                    // USED.loading.hide();
                    var $p = $("<div class='J__page page' data-hash='"+ hash +"'>");
                    $p.html(html);
                    $wrap.append($p);
                    transPage($p);

                    js.init && js.init($p, hashObj.parm);
                    js.active && js.active($p, hashObj.parm);
                    hadLoadObj[hash] = {
                        dom: $p,
                        js : js
                    }

                    resultDefer.resolve($p);
                });
                nowDefer.fail(function(err){
                    // USED.loading.hide();
                    if (err) {
                        // console.log(err);
                        USED.alert("加载错误");
                    }
                    resultDefer.reject();
                });


            } else {
                transPage(hadLoadObj[hash].dom);
                hadLoadObj[hash].js.active && hadLoadObj[hash].js.active(hadLoadObj[hash].dom, hashObj.parm);
                resultDefer.resolve(hadLoadObj[hash].dom);
            }

            return resultDefer;
        }


        // 过度页面
        function transPage($next){
            // console.dir($next);
            $next.get(0).clientHeight;
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
                h = name = CONFIG.defaultHash;
            }
            return {
                parm : r,
                name : name,
                all : h
            }
        }

        return {
            init : function(){
                USED.loading.hide();
                console.log( "加载时间：" + (new Date() - START_TIME) + " ms" );
                load();
                $(window).on('hashchange', function(f) {
                    load();
                });
            }
        }

    })();




    function init(){
        Kload.init();

        FastClick.attach(document.body);

    }


    init();

    return {};
});



require(['index'], function(){});
