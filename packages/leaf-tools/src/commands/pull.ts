import spawn from "cross-spawn";
import debug from "debug";
import { config } from "../config";
import { Command } from "commander";

const logger = debug("leaf-tools:pull");

export default function (program: Command) {
  program
    .command("pull")
    .alias("p")
    .description(
      "Pulls the specified theme into your src folder. By default, it only pulls theme settings, if you want to pull all files use the --all flag.",
    )
    .option(
      "-e, --env <environment>[,<environment>...]",
      "Shopify store(s) to deploy code to (specified in leaf.config.js)",
      "development",
    )
    .option(
      "-s, --store <store>",
      "Shopify store(s) to deploy code to (specified in leaf.config.js)",
    )
    .option("-a, --all", "Pulls all files from specified theme", false)
    .option(
      "-d, --delete",
      "By default leaf pull doesn't delete any files in you src folder, with this options it will delete any files that diverge from the pulled theme.",
      false,
    )
    .action((options = {}) => {
      logger(`--gulpfile ${config.gulpFile}`);
      logger(`--cwd ${config.themeRoot}`);

      const args = [
        options.all ? "pull" : "pull:settings",
        "--environment",
        options.env,
        "--store",
        options.store,
      ];

      if (options.all) args.push("--all");
      if (options.delete) args.push("--delete");

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
