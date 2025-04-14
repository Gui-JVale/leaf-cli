import gulp from "gulp";
import gulpif from "gulp-if";
import uglifyjs from "uglify-js";
import composer from "gulp-uglify/composer";
import include from "gulp-include";
import plumber from "gulp-plumber";
import chokidar from "chokidar";

const minify = composer(uglifyjs, console);

import { utilities } from "./includes/utilities";
import { config } from "./includes/config";
import { messages } from "./includes/messages";

function processThemeJs() {
  messages.logProcessFiles("build:js");

  return gulp
    .src([config.roots.js, `!${config.roots.vendorJs}`], { allowEmpty: true })
    .pipe(plumber(utilities.errorHandler))
    .pipe(include({ separateInputs: true }))
    .pipe(gulpif(config.optimize, minify()))
    .pipe(gulp.dest(config.dist.assets));
}

function processVendorJs() {
  messages.logProcessFiles("build:vendor-js");
  return gulp
    .src(config.roots.vendorJs, { allowEmpty: true })
    .pipe(plumber())
    .pipe(include())
    .pipe(
      minify({
        mangle: true,
        compress: true,
      }),
    )
    .pipe(gulp.dest(config.dist.assets));
}

gulp.task("build:js", () => {
  return processThemeJs();
});

gulp.task("watch:js", () => {
  chokidar
    .watch(
      [config.src.js, `!${config.roots.vendorJs}`, `!${config.src.vendorJs}`],
      { ignoreInitial: true },
    )
    .on("all", (event, path) => {
      messages.logFileEvent(event, path);
      processThemeJs();
    });
});

gulp.task("build:vendor-js", () => {
  return processVendorJs();
});

gulp.task("watch:vendor-js", () => {
  chokidar
    .watch([config.roots.vendorJs, config.src.vendorJs], {
      ignoreInitial: true,
    })
    .on("all", (event, path) => {
      messages.logFileEvent(event, path);
      processVendorJs();
    });
});
