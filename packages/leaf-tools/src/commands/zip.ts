import spawn from "cross-spawn";
import debug from "debug";
import { config } from "../config";
import { Command } from "commander";

const logger = debug("leaf-tools:zip");

export default function (program: Command) {
  program
    .command("zip")
    .alias("z")
    .description(
      "Rebuilds the theme's source files and compresses the output. The compressed file is written to <theme>/upload/<theme>.zip (can be used for manual upload).",
    )
    .action(() => {
      logger(`--gulpfile ${config.gulpFile}`);
      logger(`--cwd ${config.themeRoot}`);

      spawn(
        config.gulp,
        ["zip", "--gulpfile", config.gulpFile, "--cwd", config.themeRoot],
        {
          detached: false,
          stdio: "inherit",
        },
      );
    });
}
