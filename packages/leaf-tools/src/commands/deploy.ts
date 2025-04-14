import spawn from "cross-spawn";
import debug from "debug";
import { Command } from "commander";

import { config } from "../config";

const logger = debug("leaf-tools:deploy");

export default function (program: Command) {
  program
    .command("deploy")
    .alias("d")
    .description(
      "Runs a full deploy of your theme's code to a Shopify store specified in leaf.config.json. This runs shopify theme push with the --nodelete flag, so that files aren't deleted.",
    )
    .option(
      "-e, --env <environment>",
      "Shopify theme to deploy code to (specified in leaf.config.json)",
      "development",
    )
    .option(
      "-s, --store <store>",
      "Shopify store(s) to deploy code to (specified in leaf.config.json)",
    )
    .option(
      "-n, --no-dev",
      "Skips pulling theme settings from local development theme",
      false,
    )
    .option(
      "-d, --dev",
      "Skips asset optimization steps such as compression, minification and purging.",
      false,
    )
    .option(
      "--delete",
      "By default leaf deploy runs 'shopify theme push --nodelete'. With this option it will leave out the --no-delete flag, allowind files to be delete in store theme.",
      false,
    )
    .action((options = {}) => {
      logger(`--gulpfile ${config.gulpFile}`);
      logger(`--cwd ${config.themeRoot}`);

      const args = [
        options.dev ? "deploy" : "deploy:no-sync",
        "--environment",
        options.env,
        "--store",
        options.store,
      ];

      if (options.dev) args.push("--dev");
      if (options.delete) args.push("--delete");

      if (!options.dev) process.env.NODE_ENV = "production";

      spawn(
        config.gulp,
        args.concat(["--gulpfile", config.gulpFile, "--cwd", config.themeRoot]),
        {
          detached: false,
          stdio: "inherit",
        },
      );
    });
}
