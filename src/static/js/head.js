;(function(doc, win) {
    var docEl = doc.documentElement,
        rstyle = doc.createElement("style"),
        resizeEvt = 'orientationchange' in win ? 'orientationchange' : 'resize',
        ua = navigator.userAgent,
        head = doc.querySelector('head'),
        ratio = win.devicePixelRatio || 1,
        viewport = head.querySelector('meta[name="viewport"]'),
        t = 1,
        initialContent = "",
        recalc = function() {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            clientWidth = clientWidth < 480 ? clientWidth : 480; // 大屏幕限制
            // if (!ua.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i) && clientWidth > 1024) {
            //     clientWidth = 640;
            // }
            // alert(clientWidth);
            // 14 * (clientWidth / 320) px
            rstyle.innerHTML = "html{font-size:" + 0.1 * clientWidth + "px !important;}";
        };

    // 去掉缩放
    // if (ratio > 2) {
    //     ratio = 2;
    // }
    // t = 1 / ratio;

    // 如果缩放无效，可加上, target-densitydpi=" + (ratio * 160)
    // initialContent = "width=device-width , initial-scale=" + t + ", maximum-scale=" + t + ", minimum-scale=" + t + ", user-scalable=no";
    // if (!viewport) {
    //     viewport = doc.createElement('meta');
    //     viewport.setAttribute('name', 'viewport');
    //     viewport.content = initialContent;
    //     head.appendChild(viewport);
    // } else {
    //     viewport.content = initialContent;
    // }
    head.appendChild(rstyle);

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    // doc.addEventListener('DOMContentLoaded', recalc, false);
    recalc();

    // 为html节点加上该设备的 class
    var htmldom = doc.querySelector("html");
    if (ua.match(/Android/i)) {
        htmldom.className = "ua_android";
    } else {
        htmldom.className = "ua_ios";
    }


})(document, window);
