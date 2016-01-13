require.config({
    baseUrl : "./main",
    urlArgs: IS_DEGUG ? START_TIME.getTime() : "",
    paths: {
        text : "../static/js/require/text",
        kload : "kload",
        config : "common/config",
        method : "common/method",
        modules : "common/modules",
        defer : "plugins/defer/defer",
        fastclick : "plugins/fastclick/fastclick",
        template : "common/template",
        sheSlide : "plugins/sheSlide/sheSlide",
        hammer : "plugins/hammer/hammer.min",
        vue : "common/vue"
    }
});

define('index', [
    'kload',
    'config',
    'method',
    'fastclick'
    ],
    function ( Kload, CONFIG, METHOD,  FastClick) {



    function init(){
        FastClick.attach(document.body);

        Kload.init({
            hashConfig: CONFIG.hashConfig,
            defaultHash: CONFIG.defaultHash
        });
        METHOD.loading.hide();
        console.log( "加载时间：" + (new Date() - START_TIME) + " ms" );

    }


    init();

    return {};
});



require(['index'], function(){});
