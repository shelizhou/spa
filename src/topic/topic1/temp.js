;(function(doc, win) {
    var docEl = doc.documentElement,
        rstyle = doc.createElement("style"),
        resizeEvt = 'orientationchange' in win ? 'orientationchange' : 'resize',
        ua = navigator.userAgent,
        head = doc.querySelector('head'),
        viewport = head.querySelector('meta[name="viewport"]'),
        t = 1,
        initialContent = "",
        recalc = function() {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            // if (!ua.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i) && clientWidth > 1024) {
            //     clientWidth = 640;
            // }
            rstyle.innerHTML = "html{font-size:" + 0.1 * clientWidth + "px !important;;}body{font-size:" + 14 * (clientWidth / 320) + "px !important;";
        };
    if (win.devicePixelRatio) {
        t = 1 / win.devicePixelRatio;
        // 如果缩放无效，可加上, target-densitydpi=" + (win.devicePixelRatio * 160)
        initialContent = "initial-scale=" + t + ", maximum-scale=" + t + ", minimum-scale=" + t + ", user-scalable=no";
        // if (ua.match(/Android/i)) { } else { }

        if (!viewport) {
            viewport = doc.createElement('meta');
            viewport.setAttribute('name', 'viewport');
            viewport.content = initialContent;
            head.appendChild(viewport);
        } else {
            viewport.content = initialContent;
        }
    }
    head.appendChild(rstyle);

    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);

})(document, window);
