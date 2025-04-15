import gulp from "gulp";
import vinylPaths from "vinyl-paths";
import del from "del";
import size from "gulp-size";
import chokidar from "chokidar";
// @ts-ignore
import extReplace from "gulp-ext-replace";
import plumber from "gulp-plumber";

import { config } from "./includes/config";
import { utilities } from "./includes/utilities";
import { messages } from "./includes/messages";

/**
 * Processing for SVGs prior to deployment - adds accessibility markup, and converts
 * the file to a liquid snippet.
 */
function processIcons(
  files: string | string[],
) {
  messages.logProcessFiles("build:svg");
  return gulp
    .src(files)
    .pipe(plumber(utilities.errorHandler))
    .pipe(extReplace(".liquid"))
    .pipe(
      size({
        showFiles: true,
        pretty: true,
      }),
    )
    .pipe(gulp.dest(config.dist.snippets));
}

/**
 * Cleanup/remove liquid snippets from the `dist` directory during watch tasks if
 * any underlying SVG files in the `src` folder have been removed.
 */
function removeIcons(files: string[]) {
  messages.logProcessFiles("remove:svg");
  const mapFiles = files.map((file) => {
    const distFile = file.replace("src/icons", "dist/snippets");
    const snippetFile = distFile.replace(".svg", ".liquid");
    return snippetFile;
  });

  return gulp
    .src(mapFiles)
    .pipe(plumber(utilities.errorHandler))
    .pipe(vinylPaths(del))
    .pipe(
      size({
        showFiles: true,
        pretty: true,
      }),
    );
}

/**
 * Pre-processing for svg icons
 */
gulp.task("build:svg", () => {
  return processIcons(config.src.icons);
});

/**
 * Watches source svg icons for changes...
 */
gulp.task("watch:svg", () => {
  const cache = utilities.createEventCache();

  chokidar
    .watch([config.src.icons], { ignoreInitial: true })
    .on("all", (event, path) => {
      messages.logFileEvent(event, path);
      cache.addEvent(event, path);
      utilities.processCache(cache, processIcons, removeIcons);
    });
});
