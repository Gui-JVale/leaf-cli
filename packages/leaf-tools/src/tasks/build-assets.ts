import gulp from "gulp";
import plumber from "gulp-plumber";
import chokidar from "chokidar";
import vinylPaths from "vinyl-paths";
import del from "del";
import size from "gulp-size";

import { config } from "./includes/config";
import { utilities } from "./includes/utilities";
import { messages } from "./includes/messages";

const assetsPaths = [
  config.src.assets,
  config.src.templates,
  config.src.sections,
  config.src.snippets,
  config.src.blocks,
  config.src.locales,
  config.src.config,
  config.src.layout,
];

const rootAssets = [config.shopifyIgnore];

/**
 * Copies assets to the `/dist` directory
 *
 * @private
 */
function processAssets(files: string[]): Promise<NodeJS.ReadWriteStream> {
  messages.logProcessFiles("build:assets");
  return gulp
    .src(files, { base: config.src.root })
    .pipe(plumber(utilities.errorHandler))
    .pipe(
      size({
        showFiles: true,
        pretty: true,
      }),
    )
    .pipe(gulp.dest(config.dist.root));
}

/**
 * Copies root assets to the `/dist` directory
 *
 * @param {Array} files
 * @returns {Stream}
 * @private
 */
function processRootAssets(files: string[]): Promise<NodeJS.ReadWriteStream> {
  messages.logProcessFiles("build:assets");
  return gulp
    .src(files, { allowEmpty: true })
    .pipe(plumber(utilities.errorHandler))
    .pipe(
      size({
        showFiles: true,
        pretty: true,
      }),
    )
    .pipe(gulp.dest(config.dist.root));
}

/**
 * Deletes specified files
 *
 * @param {Array} files
 * @returns {Stream}
 * @private
 */
function removeAssets(files: string[]): Promise<NodeJS.ReadWriteStream> {
  messages.logProcessFiles("remove:assets");

  const mapFiles = files.map((file) => {
    const distFile = file.replace(config.src.root, config.dist.root);
    return distFile;
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
 * Copies assets to the `/dist` directory
 */
gulp.task("build:assets", () => {
  processRootAssets(rootAssets);
  return processAssets(assetsPaths);
});

/**
 * Watches assets in the `/src` directory
 */
gulp.task("watch:assets", () => {
  const eventCache = utilities.createEventCache();

  chokidar
    .watch(assetsPaths, {
      ignored: /(^|[/\\])\../,
      ignoreInitial: true,
    })
    .on("all", (event, path) => {
      messages.logFileEvent(event, path);
      eventCache.addEvent(event, path);
      utilities.processCache(eventCache, processAssets, removeAssets);
    });

  chokidar
    .watch(rootAssets, {
      ignoreInitial: true,
    })
    .on("all", (event, path) => {
      messages.logFileEvent(event, path);
      processRootAssets(rootAssets);
    });
});
