// Он пустой?
// да
const gulp = require("gulp");
const sass = require("gulp-sass");
const nunjucks = require("gulp-nunjucks-html");
const browserSync = require("browser-sync").create();

const SCSS_FOLDER = "./scss/**/*.scss";
const TEMPALTES_FOLDER = "./templates/**/*.html";

gulp.task("sass", function(cb) {
  return gulp
    .src("./scss/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("./build/css"))
    .pipe(browserSync.stream());
});

gulp.task("nunjucks", function(cb) {
  gulp
    .src("./templates/*.html")
    .pipe(
      nunjucks({
        searchPaths: ["./templates/chunks", "./templates"]
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

  gulp.watch(SCSS_FOLDER, gulp.series("sass"));
  gulp.watch(TEMPALTES_FOLDER, gulp.series("nunjucks"));
});

gulp.task("sass:watch", function() {
  return gulp.watch(SCSS_FOLDER, gulp.series("sass"));
});
