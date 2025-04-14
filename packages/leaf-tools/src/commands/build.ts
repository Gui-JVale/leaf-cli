import spawn from "cross-spawn";
import debug from "debug";
import config from "../config";
import { Command } from "commander";

const logger = debug("leaf-tools:build");

export default function (program: Command) {
  program
    .command("build")
    .alias("b")
    .description("Builds ./src files into dist folder")
    .option(
      "-d, --dev",
      "Skips asset optimization steps such as compression, minification and purging.",
      false,
    )
    .action((options = {}) => {
      logger(`--gulpfile ${config.gulpFile}`);
      logger(`--cwd ${config.themeRoot}`);

      const args = ["build"];

      if (options.dev) args.push("--dev");

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
