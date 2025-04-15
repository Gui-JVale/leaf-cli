import path from "path";
import gulp from "gulp";
// import gulpSass from "gulp-sass";
// import sass from "sass";
import postcss from "gulp-postcss";
import plumber from "gulp-plumber";
import chokidar from "chokidar";

import { config } from "./includes/config";
import { messages } from "./includes/messages";
import { utilities } from "./includes/utilities";

const tailwindConfig = config.usesTailwind
  ? require(path.join(config.themeRoot, config.tailwindConfig))
  : {};

const assets =
  config.usesTailwind || tailwindConfig.mode === "jit"
    ? [
        config.src.css,
        config.src.scss,
        config.src.sections,
        config.src.layout,
        config.src.snippets,
        config.src.assets,
        config.src.templates,
        config.src.js,
        config.src.icons,
        config.tailwindConfig,
      ]
    : [config.src.css, config.src.scss, config.tailwindConfig];

function processCss(): Promise<NodeJS.ReadWriteStream> {
  return new Promise((resolve, reject) => {
    gulp
      .src(config.roots.css, { allowEmpty: true })
      .pipe(plumber(utilities.errorHandler))
      .pipe(postcss(config.plugins.postcss))
      .pipe(gulp.dest(config.dist.assets))
      .on("finish", resolve)
      .on("error", reject);
  });
}

function processSass(): Promise<NodeJS.ReadWriteStream> {
  return new Promise((resolve, reject) => {
    gulp
      .src(config.roots.scss, { allowEmpty: true })
      .pipe(plumber(utilities.errorHandler))
      // .pipe(gulpSass(sass)())
      .pipe(postcss(config.plugins.postcss))
      .pipe(gulp.dest(config.dist.assets))
      .on("finish", resolve)
      .on("error", reject);
  });
}

/**
 * Concatenate css via gulp-cssimport
 */
gulp.task("build:css", () => {
  return Promise.all([processCss(), processSass()]);
});

/**
 * Watches css in the `/src` directory
 */
gulp.task("watch:css", () => {
  chokidar.watch(assets, { ignoreInitial: true }).on("all", (event, path) => {
    const isCssFile = /\.s[ac]ss$/i.test(path);
    // Don't log event twice
    if (isCssFile) {
      processSass();
      messages.logFileEvent(event, path);
    }

    processCss();
  });
});
