
var FIlE = require('./file'),
    GULP = require('./gulpfile'),
    QUERYSTRING = require('querystring'),
    SPAWN = require('child_process').spawn,
    PORT = parseInt(process.argv[2], 10) || 9090,
    OS = require('os');


// for (var i = 0; i < OS.networkInterfaces().en0.length; i++) {
//     if (OS.networkInterfaces().en0[i].family == 'IPv4') {
//         IPv4 = OS.networkInterfaces().en0[i].address;
//     }
// }

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

SPAWN('open', [url + PORT + "/index.html"]);

GULP.getGulp().run(["sass", "sass:watch"]);

// SPAWN("gulp", ["sass"]).stdout.on('data', function (data) {
//     // console.log(data + "");
// });
// SPAWN("gulp", ["sass:watch"]).stdout.on('data', function (data) {
//     // console.log(data + "");
// });

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
                GULP.setPrefix(info.text);
                GULP.getGulp().task('out_run', ['last'], function(){
                    console.log("构建成功");
                    res.end(JSON.stringify({ajaxtype:info.ajaxtype, success:true}));
                });
                GULP.getGulp().run(['out_run']);
                // SPAWN("gulp").stdout.on('data', function (data) {
                //     console.log(data + "");
                // });
            } else if (info.ajaxtype === "exit") {
                res.end(JSON.stringify({ajaxtype:info.ajaxtype}));
                process.exit();
            } else if (info.ajaxtype === "opensrc") {
                SPAWN('open', [url + (PORT + 1) + "/index.html"]);
                res.end(JSON.stringify({ajaxtype:info.ajaxtype}));

            } else if (info.ajaxtype === "opendist") {
                SPAWN('open', [url + (PORT + 2) + "/index.html"]);
                res.end(JSON.stringify({ajaxtype:info.ajaxtype}));
            }
        });
    }
});
