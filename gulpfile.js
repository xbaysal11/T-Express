const gulp = require("gulp");
const sass = require("gulp-sass");
const nunjucks = require("gulp-nunjucks-html");
const browserSync = require("browser-sync").create();
const sourceMaps = require("gulp-sourcemaps");
const gulpIf = require("gulp-if");
const del = require("del");
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
const eslint = require("gulp-eslint");

// const Fiber = require("fibers");
// const debug = require("gulp-debug");
// const gulpCopy = require("gulp-copy");
// const concat = require('gulp-concat');

const SCSS_FOLDER = "./scss/**/*.scss";
const TEMPALTES_FOLDER = "./templates/**/*.nj";

const isDevelopment =
  !process.env.NODE_ENV || process.env.NODE_ENV == "development";

gulp.task("sass", function() {
  return (
    gulp
      .src("./scss/*.scss")
      .pipe(
        plumber({
          errorHandler: notify.onError(function(err) {
            return {
              title: "SCSS",
              message: err.message
            };
          })
        })
      )
      // .pipe(debug({ title: "FINDING scss" }))
      // .pipe(gulpIf(isDevelopment, sourceMaps.init()))
      .pipe(sass())
      // .pipe(debug({ title: "MAPPING css" }))
      // .pipe(concat("all.css")) //importing '@import "./___.css"'
      // .pipe(gulpIf(isDevelopment, sourceMaps.write()))
      .pipe(gulp.dest("./build/css"))
      // .pipe(debug({ title: "CONVERTING to css" }))
      .pipe(browserSync.stream())
  );
});

gulp.task("nunjucks", function(cb) {
  gulp
    .src("./templates/*.nj")
    .pipe(
      nunjucks({
        searchPaths: ["./templates/chunks", "./templates/layout"],
        ext: ".html"
      })
    )
    .pipe(gulp.dest("./build/"));
  browserSync.reload();
  cb();
});

gulp.task("browser-sync", function() {
  browserSync.init({
    server: {
      baseDir: "./build"
    }
  });

  gulp.watch(SCSS_FOLDER, gulp.parallel("sass"));
  gulp.watch(TEMPALTES_FOLDER, gulp.parallel("nunjucks"));
});

gulp.task("sass:watch", function() {
  return gulp.watch(SCSS_FOLDER, gulp.series("sass"));
});

gulp.task("gulp-copy", function() {
  return gulp.src("./assets/**/*.*").pipe(gulp.dest("./build"));
});

gulp.task("clean", function() {
  return del("build");
});

//gitHook
gulp.task("lint", function() {
  return gulp
    .src("/build/js/*.js")
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task(
  "build",
  gulp.series(
    "clean",
    gulp.parallel("gulp-copy", "lint", "sass", "nunjucks", "browser-sync")
  )
);
