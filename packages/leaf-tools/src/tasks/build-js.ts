import gulp from "gulp";
import chokidar from "chokidar";
import rollup from "rollup";
import terser from "@rollup/plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";

import { config } from "./includes/config";
import { messages } from "./includes/messages";

function processThemeJs() {
  messages.logProcessFiles("build:js");

  const plugins = [nodeResolve()];

  if (config.optimize) {
    plugins.push(terser());
  }

  try {
    return rollup
      .rollup({
        input: config.js.inputs,
        plugins,
      })
      .then((bundle) => {
        return bundle.write({
          dir: "./dist/assets",
        });
      });
  } catch (error) {
    console.error(error);
  }
}

gulp.task("build:js", () => {
  return processThemeJs();
});

gulp.task("watch:js", () => {
  rollup
    .watch({ input: config.js.inputs, output: { dir: "./dist/assets" } })
    .on("change", (id, change) => {
      messages.logFileEvent(change.event, id);
    });
});

gulp.task("build:vendor-js", () => {
  return Promise.resolve();
});

gulp.task("watch:vendor-js", () => {
  chokidar
    .watch([config.roots.vendorJs, config.src.vendorJs], {
      ignoreInitial: true,
    })
    .on("all", (event, path) => {
      messages.logFileEvent(event, path);
      // processVendorJs();
    });
});
