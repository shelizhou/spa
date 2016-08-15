
var FIlE = require('./file'),
    GULP = require('./gulpfile'),
    QUERYSTRING = require('querystring'),
    PORT = parseInt(process.argv[2], 10) || 7090,
    OS = require('os');

// 打开浏览器
var child_process = require('child_process');
var cmd;
if (process.platform === 'win32') {
    cmd = 'start "%ProgramFiles%\Internet Explorer\iexplore.exe"';
} else if (process.platform === 'linux') {
    cmd = 'xdg-open';
} else if (process.platform === 'darwin') {
    cmd = 'open';
}
function openBrower(url) {
    child_process.exec(cmd + ' "' + url + '"');
}

// 获取ip
function getIPAddress() {
    var interfaces = OS.networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
                return alias.address;
        }
    }
    return '0.0.0.0';
}
var IPv4 = getIPAddress();

var url = "http://" + IPv4 + ":";

var buildServer = FIlE.init(PORT, "buildweb");
var srcServer = FIlE.init(PORT + 1, "src");
var distServer = FIlE.init(PORT + 2, "dist");

openBrower(url + PORT + "/index.html");
GULP.getGulp().run(["sass", "sass:watch"]);


console.log("操控平台:  " + "http://" + IPv4 + ":" + PORT);
console.log("源码工程:  " + "http://" + IPv4 + ":" + (PORT+1));
console.log("构建后工程:  " + "http://" + IPv4 + ":" + (PORT+2));

// 请求服务
buildServer.on('request', function(req, res) {
    if (req.url === '/_buildweb') {
        var info = '';
        req.addListener('data', function(chunk) {
            info += chunk;
        }).addListener('end', function() {
            info = QUERYSTRING.parse(info);
            console.log("执行命令:  " + info.ajaxtype);
            if (info.ajaxtype === "gulp") {
                // console.log(GULP);
                GULP.setConfig({
                    prefix: info.text,
                    isPhp: info.isPhp,
                    baseurl: info.baseurl,
                    distFile: info.distFile
                });
                GULP.getGulp().task('out_run', ['default'], function(){
                    console.log("构建成功");
                    res.end(JSON.stringify({ajaxtype:info.ajaxtype, success:true}));
                });
                GULP.getGulp().run(['out_run']);
            } else if (info.ajaxtype === "exit") {
                res.end(JSON.stringify({ajaxtype:info.ajaxtype}));
                process.exit();
            } else if (info.ajaxtype === "opensrc") {
                openBrower(url + (PORT + 1) + "/index.html");
                res.end(JSON.stringify({ajaxtype:info.ajaxtype}));

            } else if (info.ajaxtype === "opendist") {
                openBrower(url + (PORT + 2) + "/index.html");
                res.end(JSON.stringify({ajaxtype:info.ajaxtype}));

            } else if (info.ajaxtype === "getProxyUrl") {
                res.end(JSON.stringify({ajaxtype:info.ajaxtype, proxyUrl:FIlE.proxyUrl}));

            } else if (info.ajaxtype === "watchsass") {
                GULP.getGulp().run(['sass:watch']);

            }
        });
    }
});
