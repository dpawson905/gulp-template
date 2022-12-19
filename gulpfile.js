const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const terser = require("gulp-terser");
const { src, dest, watch, series } = require("gulp");
const autoprefixer = require('autoprefixer');
const cssnano = require("cssnano");
const browersync = require("browser-sync").create();

// Sass Task
function scssTask() {
  var plugins = [
    autoprefixer(),
    // cssnano()
  ]
  return src("app/scss/style.scss", { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss(plugins))
    .pipe(dest("dist/css", { sourcemaps: "." }));
}

// Javascript Task
function jsTask() {
  return src("app/js/script.js", { sourcemaps: true })
    .pipe(terser())
    .pipe(dest("dist/js", { sourcemaps: "." }));
}

// BrowserSync Task
function browersyncServe(cb) {
  browersync.init({
    server: {
      baseDir: ".",
    },
  });
  cb();
}

function browersyncReload(cb) {
  browersync.reload();
  cb();
}

// Watch Task
function watchTask() {
  watch("*.html", browersyncReload);
  watch(
    ["app/scss/**/*.scss", "app/js/**/*.js"],
    series(scssTask, jsTask, browersyncReload)
  );
}

// Defalt Gulp task
exports.default = series(scssTask, jsTask, browersyncServe, watchTask);
