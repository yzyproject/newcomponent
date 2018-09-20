var gulp = require('gulp');
var parsing = require("./gulp_parseHtml.js");
var concat = require("gulp-concat");
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');
var minCSS = require('gulp-clean-css');
var parseCommonJS = require("./gulp_parseCommon.js");
//合并js的任务。
gulp.task('mergeJS',function(){
  return gulp.src(['./recvle.js','./scripts/components/**/*.js'])
  .pipe(concat('recvle.js'))
  .pipe(gulp.dest('./dist'));
});
//移动模板文件
gulp.task('moveTemplate',function(){
  return gulp.src(['./src/**/_template/*.html'])
  .pipe(gulp.dest('./views'));
});
//移动页面js与css
gulp.task('movePageJsAndCss',function(){
  return gulp.src(['./src/**/*.js','./src/**/*.css','./src/**/*.json'])
  .pipe(gulp.dest('./views'));
});
//合并css并放到_styles目录
gulp.task('moveCSS',function(){
  return gulp.src(['./styles/blueStyle/*.css'])
  .pipe(concat('style.css'))
  .pipe(gulp.dest('./_styles'));
});
//合并并压缩css到_styles
gulp.task('minCSS',['moveCSS'],function(){
  return gulp.src(['./_styles/style.css'])
  .pipe(minCSS())
  .pipe(rename({suffix: '.min'}))
  .pipe(gulp.dest('./_styles'));
});
//合并scripts/api下的文件  并输出到_scripts
gulp.task('mergeApI' ,function() {
  return gulp.src(['./scripts/api/*.js'])
  .pipe(concat('common-api.js'))
  .pipe(gulp.dest('./_scripts/api'));
});
//压缩scripts文件夹下 common 下的js到_scripts
gulp.task('minCommonJs',function(){
  gulp.src(['./scripts/common/*.js'])
  .pipe(parseCommonJS())
  .pipe(uglify())
  .pipe(gulp.dest('./_scripts/common'));
});
//压缩scripts文件夹下 components 下 所有的js到_scripts
gulp.task('minComponentsJs',function(){
  gulp.src(['./scripts/components/**/*.js'])
  .pipe(uglify())
  .pipe(gulp.dest('./_scripts/components'));
});
//初始化页面的任务。
gulp.task('initHtml',['mergeJS','moveTemplate','movePageJsAndCss','mergeApI','minCommonJs','minComponentsJs',"minCSS"] ,function() {
  return gulp.src(['./src/**/*.html','!./src/**/_template/*.html'])
  .pipe(parsing())
  .pipe(gulp.dest('./views'));
});



//重新命名所有的页面名字，以cb-开头，以保留原始的文件
gulp.task('renameHtml',function(){
  gulp.src(['./views/*/**/*.html','!./views/*/**/_template/*.html'])
  .pipe(rename(function (path) {
    path.basename="_"+path.basename;
  }))
  .pipe(gulp.dest('./views'));
});
//移动所有页面 到开发目录下
gulp.task('moveHtml',function(){
  gulp.src(['./views/**/*'])
  .pipe(gulp.dest('./src'));
});
//清除不需要的html
gulp.task('clean', function() {
    del('./views/**/*')
});
