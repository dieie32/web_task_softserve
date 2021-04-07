const gulp = require("gulp");
const sass = require("gulp-sass");
const babel = require("gulp-babel");
const csso = require("gulp-csso");
const htmlmin = require("gulp-htmlmin");
const del = require("del");
const concat = require("gulp-concat");
const sync = require("browser-sync").create();

function html() {
  return gulp
    .src("src/**.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("dist"));
}

function scss() {
  return gulp
    .src("src/scss/**.scss")
    .pipe(sass())
    .pipe(csso())
    .pipe(concat("style.css"))
    .pipe(gulp.dest("dist/assets/css"));
}

function js() {
  return gulp
    .src("src/js/**.js")
    .pipe(
      babel({
        presets: ["@babel/env"],
        plugins: [
          // "@babel/transform-runtime",
          "@babel/plugin-transform-async-to-generator",
        ],
      })
    )
    .pipe(gulp.dest("dist/assets/js"));
}

function images() {
  return gulp.src("src/images/*").pipe(gulp.dest("dist/assets/images/"));
}

function clear() {
  return del("dist");
}

function watch() {
  sync.init({
    server: "./dist",
  });

  gulp.watch("src/**.html", html).on("change", sync.reload);
  gulp.watch("src/scss/**/*.scss", scss).on("change", sync.reload);
  gulp.watch("src/js/**.js", js).on("change", sync.reload);
  gulp.watch("src/images/*", images).on("change", sync.reload);
}

let build = gulp.series(clear, gulp.parallel(html, scss, js, images, watch));

exports.html = html;
exports.scss = scss;
exports.js = js;
exports.images = images;
exports.clear = clear;
exports.watch = watch;

exports.default = build;
