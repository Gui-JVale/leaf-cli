#!/usr/bin/env node

import { readdirSync } from "fs";
import { join, normalize } from "path";
import { Command, program } from "commander";
import chalk from "chalk";
import figures from "figures";

import { getThemeRoot } from "./utils";

const workingDirectory = process.cwd();

// Dynamically add in theme commands
const themeRoot = getThemeRoot(workingDirectory);

if (!themeRoot) {
  chalk(`  ${figures.cross} No theme found`);
  process.exit(1);
}

// fjkdjafkl;dasjsf

const leafToolsCommands = join(
  themeRoot,
  normalize("/node_modules/leaf-cli-tools/lib/commands"),
);

readdirSync(leafToolsCommands)
  .filter((file) => ~file.search(/^[^\.].*\.js$/))
  .forEach((file) => {
    const installCommmand: (program: Command) => void = require(
      join(leafToolsCommands, file),
    )?.default as (program: Command) => void;

    installCommmand(program);
  });

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
