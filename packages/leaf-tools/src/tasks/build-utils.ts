import gulp from "gulp";
import gulpif from "gulp-if";
import del from "del";
import size from "gulp-size";
import plumber from "gulp-plumber";

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

const themeSettingsAssets = [
  config.tmp.templates,
  config.tmp.config,
  config.tmp.sectionsJson,
  config.tmp.blocksJson,
  config.tmp.locales,
];

/**
 * Copies files from one fold to another, creating a new dir if doesn't exists and
 * overwriting if it does exist
 */
function copyFiles(
  files: string[],
  srcOptions: any,
  dest: string,
  log = false,
): Promise<NodeJS.ReadWriteStream> {
  return gulp
    .src(files, srcOptions)
    .pipe(plumber(utilities.errorHandler))
    .pipe(gulpif(log, size({ showFiles: true, pretty: true })))
    .pipe(gulp.dest(dest));
}

/**
 * Clean up build dirs/files whenever doing a full/clean (re)build.
 */
gulp.task("clean", () => {
  return del(["upload", "dist", "tmp", "src/*.zip", "*.zip"]);
});

/**
 * Duplicates /src directory into a /tmp directory
 */
gulp.task("generate:tmp", () => {
  messages.logProcessFiles("Generating tmp folder...");
  return copyFiles(assetsPaths, { base: config.src.root }, config.tmp.root);
});

/**
 * Syncronizes the theme settings of /tmp directory into our src directory
 */
gulp.task("sync-settings:tmp:src", () => {
  messages.logProcessFiles("Syncronizing /tmp theme settings with /src");
  return copyFiles(
    themeSettingsAssets,
    { base: config.tmp.root },
    config.src.root,
  );
});

/**
 * Syncronizes the theme settings of /tmp directory into our src directory
 */
gulp.task("sync-settings:tmp:src", () => {
  messages.logProcessFiles("Syncronizing /tmp theme settings with /src");
  return copyFiles(
    themeSettingsAssets,
    { base: config.tmp.root },
    config.src.root,
  );
});

/**
 * Copies zip from dist to src
 */
gulp.task("copy:zip", () => {
  return copyFiles(
    [config.dist.zip],
    { base: config.dist.root },
    config.themeRoot,
    true,
  );
});
