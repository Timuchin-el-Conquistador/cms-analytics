// node.js Packages / Dependencies
const gulp = require("gulp");
const sass = require("gulp-sass");
const uglify = require("gulp-uglify");
const rename = require("gulp-rename");
const concat = require("gulp-concat");
const cleanCSS = require("gulp-clean-css");
const htmlmin = require("gulp-htmlmin");
const imageMin = require("gulp-imagemin");
const pngQuint = require("imagemin-pngquant");
const browserSync = require("browser-sync").create();
const autoprefixer = require("gulp-autoprefixer");
const jpgRecompress = require("imagemin-jpeg-recompress");
const clean = require("gulp-clean");

// Paths
var paths = {
  root: {
    www: "./html",
  },
  src: {
    root: "html/assets",
    html: "html/**/*.html",
    css: "html/assets/*.css",
    js: "html/assets/*.js",
    //vendors: "html/assets/vendors/**/*.*",
    imgs: "html/assets/**/*.+(png|jpg|gif|svg)",
    //scss: "html/assets/scss/**/*.scss",
  },
  dist: {
    root: "html/dist",
    css: "html/dist/assets/",
    html: "html/dist/",
    js: "html/dist/assets/",
    imgs: "html/dist/assets/",
    //vendors: "html/dist/assets/vendors",
  },
};

// Compile SCSS
/*gulp.task("sass", function () {
  return gulp
    .src(paths.src.scss)
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(autoprefixer())
    .pipe(gulp.dest(paths.dist.root + "/css"))
    .pipe(browserSync.stream());
});
*/
// Minify + Combine CSS
gulp.task("css", function () {
  return gulp
    .src(paths.src.css)
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(concat("index.css"))
    //.pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(paths.dist.css));
});
gulp.task("pages", function () {
  return gulp
    .src([paths.src.html])
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true,
      })
    )
    .pipe(gulp.dest(paths.dist.html));
});
// Minify + Combine JS
gulp.task("js", function () {
  return gulp
    .src(paths.src.js)
    .pipe(uglify())
    .pipe(concat("index.js"))
    //.pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest(paths.dist.js))
    .pipe(browserSync.stream());
});

// Compress (JPEG, PNG, GIF, SVG, JPG)
gulp.task("img", function () {
  return gulp
    .src(paths.src.imgs)
    .pipe(
      imageMin([
        imageMin.gifsicle(),
        imageMin.jpegtran(),
        imageMin.optipng(),
        imageMin.svgo(),
        pngQuint(),
        jpgRecompress(),
      ])
    )
    .pipe(gulp.dest(paths.dist.imgs));
});
/*
// copy vendors to dist
gulp.task("vendors", function () {
  return gulp.src(paths.src.vendors).pipe(gulp.dest(paths.dist.vendors));
});
*/
// clean dist
gulp.task("clean", function () {
  return gulp.src(paths.dist.root).pipe(clean());
});

// Prepare all assets for production
gulp.task("build", gulp.series( "css", "pages",'img', "js"));

// Watch (SASS, CSS, JS, and HTML) reload browser on change
gulp.task("watch", function () {
  browserSync.init({
    server: {
      baseDir: paths.root.www,
    },
  });
  gulp.watch(paths.src.scss, gulp.series("sass"));
  gulp.watch(paths.src.js).on("change", browserSync.reload);
  gulp.watch(paths.src.html).on("change", browserSync.reload);
});
