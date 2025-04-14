import spawn from "cross-spawn";
import { Command } from "commander";
import debug from "debug";

import { config } from "../config";

const logger = debug("leaf-tools:watch");

export default function (program: Command) {
  program
    .command("watch")
    .alias("w")
    .description(
      "Watches files for code changes and immediately deploys updates to dev theme as they occur. " +
        "This uses shopify theme serve under the hood.",
    )
    .option(
      "-s, --store <store>",
      "Used for multi-store projects, specify the store to run the watch command for.",
      false,
    )
    .option(
      "-p, --store-password <password>",
      "Used for store password protected stores.",
      false,
    )
    .option(
      "-o, --optimize",
      "Optimizes assets by compressing, minifying and purging.",
      false,
    )
    .action((options = {}) => {
      logger(`--gulpfile ${config.gulpFile}`);
      logger(`--cwd ${config.themeRoot}`);

      const gulpArgs = [
        "watch",
        "--gulpfile",
        config.gulpFile,
        "--cwd",
        config.themeRoot,
        "--environment",
        options.env,
      ];

      if (options.store) {
        gulpArgs.push("--store");
        gulpArgs.push(options.store);
      }

      if (options.storePassword) {
        gulpArgs.push("--store-password");
        gulpArgs.push(options.storePassword);
      }

      if (!options.optimize) gulpArgs.push("--dev");

      process.env.NODE_ENV = options.optimize ? "production" : "development";

      spawn(config.gulp, gulpArgs, {
        detached: false,
        stdio: "inherit",
      });
    });
}
