var gulp = require('gulp'),
    del = require('gulp-rimraf'),
    less = require('gulp-less'),
    imagemin = require('gulp-imagemin'),
    cssmin = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    usemin = require('gulp-usemin'),
    htmlmin = require('gulp-htmlmin');
//路径设定
var path = 'default';
var paths = {
    distRoot: 'dist/'+path,
    srcRoot: 'src/'+path,
    lessRoot: 'less/'
}
//清理HTML
gulp.task('htmlmin', function () {
    var options = {
        removeComments: true,//清除HTML注释
        collapseWhitespace: true,//压缩HTML
        collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
        removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
        removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
        removeStyleLinkTypeAttributes: true,//删除<style>和<link>的type="text/css"
        minifyJS: true,//压缩页面JS
        minifyCSS: true//压缩页面CSS
    };
    gulp.src(paths.srcRoot+'/*.html')
        .pipe(htmlmin(options))
        .pipe(gulp.dest(paths.distRoot));
});
//编译less文件
gulp.task('less', function(){
    return gulp.src(paths.lessRoot+path+'.less')
        .pipe(less())
        .pipe(gulp.dest(paths.srcRoot+'/css'));
});
//拷贝文件
gulp.task('copy', function() {
    return gulp.src(paths.srcRoot+'/*.php')
        .pipe(gulp.dest(paths.distRoot));
});

//删除dist目录
gulp.task('del', function() {
    return gulp.src(paths.distRoot, {read: false})
        .pipe(del());
});

//图片压缩
gulp.task('minifyimages', function() {
    return gulp.src(paths.srcRoot+'/images/**')
        .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest(paths.distRoot+'/images'));
});

//HTML资源路径调整
gulp.task('usemin', function() {
    return gulp.src(paths.srcRoot+'/*.html')
        .pipe(usemin({
            css: [ cssmin ],
            js: [ uglify ]
        }))
        .pipe(gulp.dest(paths.distRoot));
});

//打包到dist目录
gulp.task('dist', [ 'del','usemin','htmlmin','minifyimages','copy']);
//打包到html目录
gulp.task('html', [ 'del','usemin','htmlmin','minifyimages']);
//监控
gulp.task('watch', function() {
    //监控所有.less
    gulp.watch(paths.lessRoot+'*.less', ['less']);
});