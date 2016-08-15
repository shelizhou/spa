var gulp = require('gulp');

// 清除
var clean = require('gulp-clean');

// 压缩html
var minifyHTML = require('gulp-minify-html');

// requirejs
var requirejs = require('requirejs');

// 压缩混淆js
var uglify = require('gulp-uglify');

// 图片
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');

// 压缩css
var minifyCss = require('gulp-minify-css');

// 合并
var concat = require('gulp-concat');
var htmlInline = require('gulp-html-inline');
var useref = require('gulp-useref');

var gulpif = require('gulp-if');

var fs = require('fs');

// 版本控制
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');

// 简单替换文本
var replace = require('gulp-replace');

// 编译sass
var sass = require('gulp-sass');

// 改名字
var rename = require('gulp-rename');

// 清除所有
gulp.task('clean', function () {
    return gulp.src( [ "./temp/", configObj.distFile ])
        .pipe(clean({force: true}));
});

// 合并
gulp.task('concat', function() {
    return gulp.src( ["./src/static/js/zepto/zepto.min.js", "./src/static/js/require/require.js"] )
        .pipe(concat("combine.js"))
        .pipe(uglify())
        .pipe(gulp.dest("./src/static/js"));
});
// 构建rjs
gulp.task('copymain', ['clean'], function() {
    return gulp.src( ["./src/main/**/*"] )
        .pipe(gulpif("*.html", minifyHTML({ empty: true })))
        .pipe(gulpif("*.js", replace(/BASEURL = \".*\";/g, "BASEURL = \"" + configObj.baseurl + "\";")))
        .pipe(gulpif("*.js", replace("var _dev = getQueryParms\('dev'\);", "")))
        .pipe(gulpif("*.js", replace("if\(_dev\)\{option.data.dev=_dev;\}", "")))
        .pipe(gulp.dest("./temp/main"));
});

gulp.task('rjs', ['copymain'], function() {

    // 页面依赖
    var pagesArr = getAmdPagesFiles("./temp/main/pages");

    // 公共模块依赖
    var commomArr = [
        'text', 'kload', 'fastclick',
        // 'md5',
        'defer', 'sheSlide', 'vue_plugins',  'wx_plugins'
        // , 'mobiscroll'
    ];

    return requirejs.optimize({
        baseUrl: "./temp/main",
        paths: {
            text : "../../src/static/js/require/text",
            // 以下可能会变动
            kload : "kload",
            init : "common/init",
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
        },
        // name: "index",
        // out: "./temp/main/index.js",
        // include: pagesArr // 强制依赖

        modules: [{
           name: "index",
           include: commomArr,
        },{
            name: "pages",
            exclude: commomArr,
            include: pagesArr
        }],
       dir: "./temp/dist"
    });


});

gulp.task('main-rjs-rev-wait', ['rjs'], function() {
    // 需要等待，why?
    return gulp.src( ["./temp/dist/index.js", "./temp/dist/pages.js"]);

});

gulp.task('main-rjs-rev', ['main-rjs-rev-wait'], function() {

    return gulp.src( ["./temp/dist/index.js", "./temp/dist/pages.js"])
        .pipe(uglify())
        .pipe(gulp.dest("./temp/copy/main"));

});


// 生成md5
gulp.task('get-all-rev', ['clean', 'main-rjs-rev', 'concat'], function() {

    var imgOption = {
       progressive: true,
       optimizationLevel: 1,
       svgoPlugins: [{removeViewBox: false}],
       use: [pngquant()]
    };

    return gulp.src([
            "./temp/copy/**/*.js",
            "./src/**/*.css",
            "./src/**/*.ttf", "./src/**/*.woff", "./src/**/*.svg",
            "!./src/static/iconfont/**/*.css",
            "./src/**/*.js",

            // 为了asyn的js
            "!./src/main/pages/**/*.js",
            "!./src/main/plugins/**/*.js",
            "!./src/main/common/**/*.js",
            "!./src/main/*.js",
            // "!./src/main/**/*.js",

            // 为了asyn的html
            "./src/**/*.html",
            "!./src/*.html",
            "!./src/topic/**/*.html",
            "!./src/main/pages/**/*.html",
            "!./src/static/**/*.html",

            "!./src/topic/**/*.js",
            "./src/**/*.png","./src/**/*.gif","./src/**/*.jpg"
        ])
        .pipe(rev())
        .pipe(gulpif("*.png", imagemin(imgOption)))
        .pipe(gulpif("*.gif", imagemin(imgOption)))
        .pipe(gulpif("*.jpg", imagemin(imgOption)))
        .pipe(gulpif("*.css", minifyCss()))
        .pipe(gulpif("*.js", uglify()))
        .pipe(gulp.dest(configObj.distFile))
        .pipe(rev.manifest())
        .pipe(gulp.dest(configObj.distFile));

});

// 样式的md5
gulp.task('set-static-rev', ['get-all-rev'], function() {
    var manifest_json = gulp.src(configObj.distFile + "rev-manifest.json");

    return gulp.src([configObj.distFile + "static/*.css"])
        .pipe(revReplace({ manifest: manifest_json, prefix: configObj.prefix }))
        .pipe(gulp.dest( configObj.distFile + "static" ) );

});
// html或js的md5
gulp.task('set-main-rev', ['get-all-rev'], function() {
    var manifest_json = gulp.src(configObj.distFile + "rev-manifest.json");

    return gulp.src([configObj.distFile + "main/*.js"])
        .pipe(revReplace({ manifest: manifest_json, prefix: configObj.prefix  }))
        .pipe(gulp.dest( configObj.distFile + "main" ) );

});

var configObj = {
    prefix: "",
    distFile: "",
    baseurl: ""
}
exports.setConfig = function(obj){
    configObj = obj;
}

// 主构建
gulp.task('main', ['set-static-rev', 'set-main-rev'], function() {

    var manifest_json = gulp.src(configObj.distFile + "rev-manifest.json");

    return gulp.src(["./src/index.html"])
        .pipe(replace(/IS_DEGUG = true/, "IS_DEGUG = false"))
        .pipe(htmlInline({ minifyCss: true, minifyJs: true, ignore: 'ignore' })) // 放在html上面
        .pipe(revReplace({ manifest: manifest_json, prefix: configObj.prefix  }))
        .pipe(minifyHTML({ empty: true }))
        .pipe(gulp.dest( configObj.distFile ) );


});

// 专题复制
gulp.task('topic', ['clean'], function(){
    // return gulp.src(["./src/topic/**/*"])
        // .pipe(gulp.dest( configObj.distFile + "topic" ) );
});

// 最后的清除
gulp.task('last', ['main', 'topic'], function() {
    return gulp.src( [ "./temp/", configObj.distFile + "**/rev-manifest.json" ])
        .pipe(clean({force: true}));
});

gulp.task('lastCopy', ['last'], function(){
    // return gulp.src([configObj.distFile + "**/*"])
        // .pipe(gulp.dest( "../" ) );
});

// 默认任务
gulp.task('default', ['lastCopy']);


// 编译sass
var sasserrortimes = 1;
gulp.task('sass', function () {
  gulp.src('./src/static/sass/*.scss')
    .pipe(sass().on('error', function(err){
        console.error("-------sass---start-------");
        console.error("错误叠加编码：" + sasserrortimes++);
        console.error('compile sass file error: %s', err.message);
        console.error("-------sass---end-------");
        console.error("    ");
        // sass.logError();
    }))
    .pipe(gulp.dest('./src/static'));
});
gulp.task('sass:watch', function () {
  gulp.watch('./src/static/sass/**/*.scss', ['sass']);
});



exports.getGulp = function(){
    return gulp;
}


// 自定义的文件结构
function getAmdPagesFiles(root) {

    // "text!./pages/home/index.html",
    // "./pages/home/index",
    var res = [],
        files = fs.readdirSync(root);
    files.forEach(function(file) {
        var pathname = root + '/' + file,
            stat = fs.lstatSync(pathname);
        if (!stat.isDirectory()) {
            if (pathname.indexOf(".DS_Store") !== -1 || pathname.indexOf(".svn") !== -1) return null;
            pathname = pathname.replace("./temp/main/", "./").replace("index.js", "index");
            if (pathname.indexOf("index.html") !== -1) {
                pathname = "text!" + pathname;
            };
            res.push(pathname);
        } else {
            res = res.concat(getAmdPagesFiles(pathname));
        }
    });
    return res;
}
