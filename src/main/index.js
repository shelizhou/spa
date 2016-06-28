require.config({
    waitSeconds : 0,
    baseUrl : "./main",
    urlArgs: IS_DEGUG ? GLOBAL_MESS.startTime.getTime() : "",
    paths: {
        text : "../static/js/require/text",

        kload : "kload",
        config : "common/config",
        method : "common/method",
        modules : "common/modules",
        defer : "plugins/defer/defer",
        // md5 : "plugins/md5/md5",
        fastclick : "plugins/fastclick/index",
        sheSlide : "plugins/sheSlide/sheSlide",
        vue_plugins : "plugins/vue/vue",
        vue : "common/vue",
        wx_plugins : "plugins/wx/jweixin-1.0.0",
        wx : "common/wx",
        mobiscroll : "plugins/mobiscroll/mobiscroll.custom-2.6.2.min"
    }
});


define('index', [ 'kload', 'fastclick' ],
    function ( Kload,  FastClick) {

    function init(){
        FastClick.attach(document.body);

        Kload.init(GLOBAL_MESS.pageConfig);
        $("#J__m_loading").removeClass("on");

        GLOBAL_MESS.loadTime = new Date() - GLOBAL_MESS.startTime;
        if (!IS_DEGUG) {
            // alert( "加载时间：" + GLOBAL_MESS.loadTime + " ms" );
        }

    }


    init();

    return {};
});
