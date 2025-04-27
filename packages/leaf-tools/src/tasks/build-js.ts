import fs from "fs";
import gulp from "gulp";
import chokidar from "chokidar";
import rollup from "rollup";
import terser from "@rollup/plugin-terser";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { glob } from "glob";

import { config } from "./includes/config";
import { messages } from "./includes/messages";

const plugins = [nodeResolve()];

if (config.optimize) {
  plugins.push(terser());
}

/**
 * Touch JS files to update their modification time
 * This ensures Shopify's watcher detects the changes
 */
function touchJsFiles() {
  try {
    const jsFiles = glob.sync(`${config.dist.assets}*.js`);
    jsFiles.forEach((file) => {
      // Update the file modification time to trigger Shopify's watcher
      const now = new Date();
      fs.utimesSync(file, now, now);
      messages.logFileEvent("touch", file);
    });
  } catch (error) {
    console.error(`Error touching JS files:`, error);
  }
}

function processThemeJs() {
  messages.logProcessFiles("build:js");

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
      })
      .then(() => {
        // Touch JS files after processing to ensure Shopify detects changes
        setTimeout(() => {
          touchJsFiles();
        }, 500);
      });
  } catch (error) {
    console.error(error);
  }
}

gulp.task("build:js", () => {
  return processThemeJs();
});

gulp.task("watch:js", () => {
  const watcher = rollup.watch({
    input: config.js.inputs,
    output: { dir: "./dist/assets" },
    plugins,
  });

  watcher.on("event", (event) => {
    if (event.code === "END") {
      // Touch JS files after bundle is written
      setTimeout(() => {
        touchJsFiles();
      }, 500);
    }

    if (event.code === "ERROR") {
      console.error(event.error);
    }
  });

  watcher.on("change", (id, change) => {
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
      // Touch any vendor JS files in dist to trigger Shopify's watcher
      setTimeout(() => {
        touchJsFiles();
      }, 500);
    });
});
