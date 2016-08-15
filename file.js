var FS = require("fs"),
    URL = require("url"),
    HTTP = require("http"),
    PATH = require("path"),
    MARKDOWN = require("markdown").markdown,
    HTTPPROXY = require('http-proxy');
// ZLIB = require('zlib');


var proxy = HTTPPROXY.createProxyServer({});


exports.init = function(serverport, filename) {
    var server = HTTP.createServer(function(req, res) {

    }).listen(serverport, "0.0.0.0");

    // 文件服务
    server.on('request', function(req, res) {

        var pathname = __dirname + "/" + filename + URL.parse(req.url).pathname;
        if (PATH.extname(pathname) == "") {
            pathname += "/";
        }
        if (pathname.charAt(pathname.length - 1) == "/") {
            pathname += "index.html";
        }

        // 文件请求
        if (req.url != '/_buildweb' && req.url.indexOf('/_ajax') === -1) {
            FS.exists(pathname, function(exists) {
                var isMarkdown = false;
                if (exists) {
                    switch (PATH.extname(pathname)) {
                        case ".html":
                            res.writeHead(200, {
                                "Content-Type": "text/html"
                            });
                            break;
                        case ".htm":
                            res.writeHead(200, {
                                "Content-Type": "text/html"
                            });
                            break;
                        case ".js":
                            res.writeHead(200, {
                                "Content-Type": "text/javascript"
                            });
                            break;
                        case ".css":
                            res.writeHead(200, {
                                "Content-Type": "text/css"
                            });
                            break;
                        case ".gif":
                            res.writeHead(200, {
                                "Content-Type": "image/gif"
                            });
                            break;
                        case ".jpg":
                            res.writeHead(200, {
                                "Content-Type": "image/jpeg"
                            });
                            break;
                        case ".png":
                            res.writeHead(200, {
                                "Content-Type": "image/png"
                            });
                            break;
                        case ".md":
                            isMarkdown = true;
                            res.writeHead(200, {
                                "Content-Type": "text/html"
                            });
                            break;
                        default:
                            res.writeHead(200, {
                                "Content-Type": "application/octet-stream"
                            });
                    }

                    FS.readFile(pathname, function(err, data) {
                        if (isMarkdown) {
                            try {
                                res.end( "<meta charset='UTF-8'><link rel='stylesheet' href='md/css.css'>" + MARKDOWN.toHTML(data.toString()) + "<script src='md/js.js'></script>");
                            } catch (e) {
                                console.log(e);
                                res.end(data);
                            }
                        } else {
                            res.end(data);
                        }
                    });
                } else {
                    res.writeHead(404, {
                        "Content-Type": "text/html"
                    });
                    res.end("<h1>404 Not Found</h1>");
                }
            });
        }

    });

    return server;

}
