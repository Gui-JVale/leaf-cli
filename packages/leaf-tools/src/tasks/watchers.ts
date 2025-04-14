import gulp from "gulp";
import chokidar from "chokidar";

import { messages } from "./includes/messages";
import { config } from "./includes/config";
import { utilities } from "./includes/utilities";

const cache = utilities.createEventCache();

/**
 * Aggregate task watching for file changes in `src` and
 * building/cleaning/updating `dist` accordingly.  *Made up of individual tasks
 * referenced in other files
 */
gulp.task("watch:src", () => {
  return gulp.parallel(
    "watch:css",
    "watch:js",
    "watch:vendor-js",
    "watch:assets",
    "watch:svg",
  )();
});

/**
 * Watches for changes in the `./dist` folder and passes event data to the
 * `cache` via {@link pushToCache}.
 */
gulp.task("watch:dist", () => {
  const watcher = chokidar.watch(["./"], {
    cwd: config.dist.root,
    ignored: /(^|[/\\])\../,
    ignoreInitial: true,
  });

  watcher.on("all", (event, path) => {
    if (!utilities.hasErrors()) {
      messages.logFileEvent(event, path, true);
      cache.addEvent(event, path);
    }
  });
});
