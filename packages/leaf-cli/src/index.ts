#!/usr/bin/env node

import { readdirSync, existsSync } from "fs";
import { join, normalize } from "path";
import { Command, program } from "commander";
import chalk from "chalk";
import figures from "figures";

import { getThemeRoot } from "./utils";
import initCommand from "./commands/init";

// Register init command directly
initCommand(program);

const workingDirectory = process.cwd();

// Check command being run - if it's init, skip theme root check
const isInitCommand =
  process.argv.length > 2 &&
  (process.argv[2] === "init" || process.argv[2] === "i");

if (!isInitCommand) {
  // Dynamically add in theme commands
  const themeRoot = getThemeRoot(workingDirectory);

  if (!themeRoot) {
    console.log(chalk.red(`  ${figures.cross} No theme found`));
    console.log(
      chalk.blue(
        `  ${figures.info} Run 'leaf init' to initialize a new theme project`,
      ),
    );
    process.exit(1);
  }

  const leafToolsCommandsPath = join(
    themeRoot,
    normalize("/node_modules/leaf-cli-shopify-tools/lib/commands"),
  );

  if (existsSync(leafToolsCommandsPath)) {
    readdirSync(leafToolsCommandsPath)
      .filter((file) => ~file.search(/^[^\.].*\.js$/))
      .forEach((file) => {
        const installCommmand: (program: Command) => void = require(
          join(leafToolsCommandsPath, file),
        )?.default as (program: Command) => void;

        installCommmand(program);
      });
  } else {
    console.log(
      chalk.yellow(`  ${figures.warning} leaf-cli-shopify-tools not found`),
    );
    console.log(
      chalk.blue(
        `  ${figures.info} Run 'npm install leaf-cli-shopify-tools' to install the required tools`,
      ),
    );
  }
}

// Unknown command
program.on("*", () => {
  console.log("");
  console.log(
    chalk.red(`  ${figures.cross} Unknown command: ${program.args.join(" ")}`),
  );
  console.log("");
  program.help();
});

program.parse(process.argv);

// output help if no commands or options passed
if (!process.argv.slice(2).length) {
  program.help();
}
