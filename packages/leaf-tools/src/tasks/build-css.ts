import path from "path";
import fs from "fs";
import gulp from "gulp";
// import gulpSass from "gulp-sass";
// import sass from "sass";
import postcss from "gulp-postcss";
import plumber from "gulp-plumber";
import chokidar from "chokidar";
import { glob } from "glob";

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
 * Touch CSS files to update their modification time
 * This ensures Shopify's watcher detects the changes
 */
function touchCssFiles() {
  try {
    const cssFiles = glob.sync(`${config.dist.assets}*.css`);
    cssFiles.forEach((file) => {
      // Update the file modification time to trigger Shopify's watcher
      const now = new Date();
      fs.utimesSync(file, now, now);
      messages.logFileEvent("touch", file);
    });
  } catch (error) {
    console.error(`Error touching CSS files:`, error);
  }
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
  chokidar
    .watch(assets, { ignoreInitial: true })
    .on("all", async (event, path) => {
      const isCssFile = /\.s[ac]ss$/i.test(path);

      try {
        // Process the appropriate files
        if (isCssFile) {
          await processSass();
        }
        await processCss();

        // Important: Touch CSS files after processing to ensure Shopify detects changes
        setTimeout(() => {
          touchCssFiles();
        }, 500);

        // Log the event
        messages.logFileEvent(event, path);
      } catch (error) {
        console.error(`Error processing CSS:`, error);
      }
    });
});
