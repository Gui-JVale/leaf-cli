import { existsSync, writeFileSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";
import { Command } from "commander";
import chalk from "chalk";
import figures from "figures";
import prompts from "prompts";

import {
  PACKAGE_JSON_TEMPLATE,
  SINGLE_STORE_CONFIG,
  MULTI_STORE_CONFIG,
} from "../constants";

interface InitOptions {
  multistore?: boolean;
  yes?: boolean;
}

/**
 * Creates a package.json file if it doesn't exist
 * @param currentDir - Directory to create the file in
 * @param skipPrompts - Whether to skip confirmation prompts
 * @returns - Whether the package.json was created or already existed
 */
async function setupPackageJson(
  currentDir: string,
  skipPrompts: boolean,
): Promise<boolean> {
  const packageJsonPath = join(currentDir, "package.json");

  if (existsSync(packageJsonPath)) {
    console.log(chalk.blue(`${figures.info} package.json already exists`));
    return true;
  }

  let createPackageJson = true;

  if (!skipPrompts) {
    const response = await prompts({
      type: "confirm",
      name: "create",
      message: "No package.json found. Would you like to create one?",
      initial: true,
    });
    createPackageJson = response.create;
  }

  if (createPackageJson) {
    console.log(chalk.blue(`${figures.info} Creating package.json...`));
    try {
      writeFileSync(
        packageJsonPath,
        JSON.stringify(PACKAGE_JSON_TEMPLATE, null, 2),
        "utf8",
      );
      console.log(chalk.green(`${figures.tick} Created package.json`));
      return true;
    } catch (error) {
      console.error(chalk.red(`${figures.cross} Error creating package.json:`));
      console.error(error);
      return false;
    }
  } else {
    console.log(
      chalk.yellow(`${figures.warning} Skipping package.json creation`),
    );
    return false;
  }
}

/**
 * Creates a leaf.config.js file if it doesn't exist
 * @param currentDir - Directory to create the file in
 * @param isMultistore - Whether to use the multistore template
 * @param skipPrompts - Whether to skip confirmation prompts
 * @returns - Whether the config file was created or already existed
 */
async function setupConfigFile(
  currentDir: string,
  isMultistore: boolean,
  skipPrompts: boolean,
): Promise<boolean> {
  const configPath = join(currentDir, "leaf.config.js");

  if (existsSync(configPath)) {
    console.log(
      chalk.yellow(`${figures.warning} leaf.config.js already exists`),
    );
    return true;
  }

  let createConfig = true;

  if (!skipPrompts) {
    const response = await prompts({
      type: "confirm",
      name: "create",
      message: "Would you like to create a leaf.config.js file?",
      initial: true,
    });
    createConfig = response.create;
  }

  if (createConfig) {
    console.log(chalk.blue(`${figures.info} Creating leaf.config.js...`));
    try {
      // Choose template based on option
      const template = isMultistore ? MULTI_STORE_CONFIG : SINGLE_STORE_CONFIG;
      writeFileSync(configPath, template, "utf8");
      console.log(chalk.green(`${figures.tick} Created leaf.config.js`));
      return true;
    } catch (error) {
      console.error(
        chalk.red(`${figures.cross} Error creating leaf.config.js:`),
      );
      console.error(error);
      return false;
    }
  } else {
    console.log(
      chalk.yellow(`${figures.warning} Skipping leaf.config.js creation`),
    );
    return false;
  }
}

/**
 * Installs leaf-cli-shopify-tools if confirmed by user
 * @param currentDir - Directory to install the package in
 * @param skipPrompts - Whether to skip confirmation prompts
 * @returns - Whether the tools were installed successfully
 */
async function installLeafTools(
  currentDir: string,
  skipPrompts: boolean,
): Promise<boolean> {
  let installTools = true;

  if (!skipPrompts) {
    const response = await prompts({
      type: "confirm",
      name: "install",
      message: "Would you like to install leaf-cli-shopify-tools?",
      initial: true,
    });
    installTools = response.install;
  }

  if (installTools) {
    console.log(
      chalk.blue(`${figures.info} Installing leaf-cli-shopify-tools...`),
    );
    try {
      execSync("npm install leaf-cli-shopify-tools --save", {
        stdio: "inherit",
        cwd: currentDir,
      });
      console.log(
        chalk.green(
          `${figures.tick} Installed leaf-cli-shopify-tools successfully`,
        ),
      );
      return true;
    } catch (error) {
      console.error(
        chalk.red(`${figures.cross} Error installing dependencies:`),
      );
      console.error(error);
      return false;
    }
  } else {
    console.log(
      chalk.yellow(
        `${figures.warning} Skipping installation of leaf-cli-shopify-tools`,
      ),
    );
    return false;
  }
}

/**
 * Displays next steps after initialization
 */
function showNextSteps(): void {
  console.log("");
  console.log(chalk.green(`${figures.tick} Project setup completed!`));
  console.log(chalk.blue(`${figures.info} Next steps:`));
  console.log(
    chalk.blue("  1. Update your leaf.config.js with your store details"),
  );
  console.log(
    chalk.blue("  2. Create your theme structure in the src/ directory"),
  );
  console.log(chalk.blue("  3. Run 'leaf build' to build your theme"));
}

export default function (program: Command) {
  program
    .command("init")
    .alias("i")
    .description("Initialize a new Shopify theme project with leaf-cli")
    .option(
      "-m, --multistore",
      "Generate a config template for multiple stores",
      false,
    )
    .option("-y, --yes", "Skip all prompts and use default values", false)
    .action(async (options: InitOptions = {}) => {
      const currentDir = process.cwd();
      const skipPrompts = !!options.yes;
      const isMultistore = !!options.multistore;

      console.log(
        chalk.blue(
          `${figures.info} Initializing Leaf CLI project in ${currentDir}`,
        ),
      );

      try {
        // Step 1: Setup package.json
        await setupPackageJson(currentDir, skipPrompts);

        // Step 2: Setup leaf.config.js
        await setupConfigFile(currentDir, isMultistore, skipPrompts);

        // Step 3: Install leaf-tools
        await installLeafTools(currentDir, skipPrompts);

        // Step 4: Show next steps
        showNextSteps();
      } catch (error) {
        console.error(
          chalk.red(`${figures.cross} Error initializing project:`),
        );
        console.error(error);
      }
    });
}
