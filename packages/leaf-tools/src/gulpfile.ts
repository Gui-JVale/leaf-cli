import gulp from "gulp";

import { utilities } from "./tasks/includes/utilities.js";

// imports gulp tasks from the `tasks` directory
require("require-directory")(module, "./tasks");

/**
 * Handles the error summary at the end if there are errors to output.
 * This task will only be run for the build and zip tasks.
 */
gulp.task("output:errors", (done) => {
  if (utilities.hasErrors()) {
    utilities.outputErrors();
  } else {
    done();
  }
});

/**
 * Does a full clean/rebuild of your theme
 */
gulp.task(
  "build",
  gulp.series(
    "clean",
    gulp.parallel(
      "build:js",
      "build:vendor-js",
      "build:css",
      "build:assets",
      "build:svg",
    ),
  ),
);

/**
 * Does a full clean/rebuild of your theme and creates a `.zip` compatible with
 * shopify.
 */
gulp.task("zip", gulp.series("build", "shopify:package:dist", "copy:zip"));

/**
 * Simple wrapper around src & dist watchers
 *
 * @summary Monitor your codebase for file changes and take the appropriate
 * action
 */
gulp.task(
  "watch",
  gulp.series(
    "build",
    "output:errors",
    gulp.parallel("watch:src", "watch:dist", "shopify:serve:dist"),
  ),
);

/**
 * Pulls theme from specified environment theme into src
 */
gulp.task("pull", gulp.series("shopify:pull:origin:src"));

/**
 * Does a full (re)build and push dist files into specified theme environment,
 * theme using shopify theme push, by default with the --no-delete flag
 */
gulp.task(
  "pull:settings",
  gulp.series(
    "generate:tmp",
    "shopify:pull:origin:tmp",
    "sync-settings:tmp:src",
    "clean",
  ),
);

/**
 * Synchronizes src folder theme settings with local development theme settings,
 * then proceeds to do a full (re)build and push files into specified theme
 * environment theme using shopify theme push, by default with the --no-delete flag
 */
gulp.task("deploy", gulp.series("build", "shopify:push:dist", "clean"));

/**
 * Does a full (re)build and push dist files into specified theme environment,
 * theme using shopify theme push, by default with the --no-delete flag
 */
gulp.task("deploy:no-sync", gulp.series("build", "shopify:push:dist"));
