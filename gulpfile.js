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



var prefix = "";


// 清除所有
gulp.task('clean', function () {
    return gulp.src( [ "./temp/", "./dist/" ])
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
        .pipe(gulp.dest("./temp/main"));
});

gulp.task('rjs', ['copymain'], function() {

    var arr = getAmdFiles("./temp/main/pages");
    requirejs.optimize({
        baseUrl: "./temp/main",
        paths: {
            text : "../../src/static/js/require/text",
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
        },
        name: "index",
        out: "./temp/main/index.js",
        include: arr, // 强制依赖

    });

});

gulp.task('main-rjs-rev', ['rjs'], function() {

    return gulp.src( ["./temp/main/index.js"])
        .pipe(uglify())
        .pipe(gulp.dest("./temp/main"));

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
            "./temp/**/*.js",
            "!./temp/main/kload.js", "!./temp/main/common/**/*.js", "!./temp/main/pages/**/*.js", "!./temp/main/plugins/**/*.js",
            "./src/**/*.css",
            "./src/**/*.ttf", "./src/**/*.woff",
            "!./src/static/iconfont/**/*.css",
            "./src/**/*.js",
            "!./src/main/**/*.js",
            "!./src/topic/**/*.js",
            "./src/**/*.png","./src/**/*.gif","./src/**/*.jpg"
        ])
        .pipe(rev())
        .pipe(gulpif("*.png", imagemin(imgOption)))
        .pipe(gulpif("*.gif", imagemin(imgOption)))
        .pipe(gulpif("*.jpg", imagemin(imgOption)))
        .pipe(gulpif("*.css", minifyCss()))
        .pipe(gulpif("*.js", uglify()))
        .pipe(gulp.dest("./dist"))
        .pipe(rev.manifest())
        .pipe(gulp.dest('./dist'));

});

// 样式的md5
gulp.task('set-static-rev', ['get-all-rev'], function() {
    var manifest_json = gulp.src("./dist/rev-manifest.json");

    return gulp.src(["./dist/static/*.css"])
        .pipe(revReplace({ manifest: manifest_json, prefix:prefix }))
        .pipe(gulp.dest( "./dist/static" ) );

});
// html或js的md5
gulp.task('set-main-rev', ['get-all-rev'], function() {
    var manifest_json = gulp.src("./dist/rev-manifest.json");

    return gulp.src(["./dist/main/*.js"])
        .pipe(revReplace({ manifest: manifest_json, prefix:prefix  }))
        .pipe(gulp.dest( "./dist/main" ) );

});

// 主构建
gulp.task('main', ['set-static-rev', 'set-main-rev'], function() {

    var manifest_json = gulp.src("./dist/rev-manifest.json");

    return gulp.src(["./src/index.html"])

        // 调试状态
        .pipe(replace(/IS_DEGUG = true/, "IS_DEGUG = false"))

        .pipe(htmlInline({ minifyCss: true, minifyJs: true, ignore: 'ignore' })) // 放在html上面
        .pipe(revReplace({ manifest: manifest_json, prefix:prefix  }))
        .pipe(minifyHTML({ empty: true }))
        .pipe(gulp.dest( "./dist" ) );


});

// 专题复制
gulp.task('topic', ['clean'], function(){
    return gulp.src(["./src/topic/**/*"])
        .pipe(gulp.dest( "./dist/topic" ) );
});

// 最后的清除
gulp.task('last', ['main', 'topic'], function() {
    return gulp.src( [ "./temp/", "./dist/**/rev-manifest.json" ])
        .pipe(clean({force: true}));
});


// 默认任务
gulp.task('default', ['last']);


// 编译sass
gulp.task('sass', function () {
  gulp.src('./src/static/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./src/static'));
});
gulp.task('sass:watch', function () {
  gulp.watch('./src/static/sass/**/*.scss', ['sass']);
});

exports.setPrefix = function(name){
    prefix = name;
}
exports.getGulp = function(){
    return gulp;
}


// 自定义的文件结构
function getAmdFiles(root) {

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
            res = res.concat(getAmdFiles(pathname));
        }
    });
    return res;
}
