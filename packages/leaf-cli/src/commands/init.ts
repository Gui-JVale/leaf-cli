import { existsSync, writeFileSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";
import { Command } from "commander";
import chalk from "chalk";
import figures from "figures";
import prompts from "prompts";

// Template for single store config
const singleStoreTemplate = `module.exports = {
  // Your Shopify store domain
  store: "your-store.myshopify.com",
  
  // Theme IDs for different environments
  themes: {
    development: null, // Theme ID for development
    production: null, // Theme ID for production
  },
  
  // Build configuration
  build: {
    js: {
      // JavaScript entry points
      inputs: ["src/scripts/theme.js"],
    },
  },
};
`;

// Template for multi-store config
const multiStoreTemplate = `module.exports = {
  // Default store when no --store flag is provided
  store: {
    domain: "default-store.myshopify.com",
    themes: {
      development: null,
      production: null
    }
  },
  
  // Multiple stores configuration
  stores: {
    store1: {
      domain: "store1.myshopify.com",
      themes: {
        development: null,
        production: null
      }
    },
    store2: {
      domain: "store2.myshopify.com",
      themes: {
        development: null,
        production: null
      }
    }
  },
  
  // Build configuration
  build: {
    js: {
      inputs: ["src/scripts/theme.js"],
    }
  }
};
`;

// Template for package.json
const packageJsonTemplate = {
  name: "shopify-theme",
  version: "1.0.0",
  description: "Shopify theme project",
  scripts: {
    build: "leaf build",
    watch: "leaf watch",
    deploy: "leaf deploy",
    pull: "leaf pull",
    zip: "leaf zip",
  },
  dependencies: {
    "leaf-cli-shopify-tools": "^0.2.2",
  },
  keywords: ["shopify", "theme", "leaf-cli"],
  license: "MIT",
};

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
    .action(async (options = {}) => {
      const currentDir = process.cwd();
      const packageJsonPath = join(currentDir, "package.json");
      const configPath = join(currentDir, "leaf.config.js");

      // If --yes flag is provided, skip all prompts
      const skipPrompts = options.yes;

      console.log(
        chalk.blue(
          `${figures.info} Initializing Leaf CLI project in ${currentDir}`,
        ),
      );

      // Step 1: Check if package.json exists, if not ask to create it
      if (!existsSync(packageJsonPath)) {
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
              JSON.stringify(packageJsonTemplate, null, 2),
              "utf8",
            );
            console.log(chalk.green(`${figures.tick} Created package.json`));
          } catch (error) {
            console.error(
              chalk.red(`${figures.cross} Error creating package.json:`),
            );
            console.error(error);
            return;
          }
        } else {
          console.log(
            chalk.yellow(`${figures.warning} Skipping package.json creation`),
          );
        }
      } else {
        console.log(chalk.blue(`${figures.info} package.json already exists`));
      }

      // Step 2: Check if leaf.config.js exists, if not ask to create it
      if (!existsSync(configPath)) {
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
            const template = options.multistore
              ? multiStoreTemplate
              : singleStoreTemplate;
            writeFileSync(configPath, template, "utf8");
            console.log(chalk.green(`${figures.tick} Created leaf.config.js`));
          } catch (error) {
            console.error(
              chalk.red(`${figures.cross} Error creating leaf.config.js:`),
            );
            console.error(error);
            return;
          }
        } else {
          console.log(
            chalk.yellow(`${figures.warning} Skipping leaf.config.js creation`),
          );
        }
      } else {
        console.log(
          chalk.yellow(`${figures.warning} leaf.config.js already exists`),
        );
      }

      // Step 3: Ask to install leaf-tools
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
        } catch (error) {
          console.error(
            chalk.red(`${figures.cross} Error installing dependencies:`),
          );
          console.error(error);
          return;
        }
      } else {
        console.log(
          chalk.yellow(
            `${figures.warning} Skipping installation of leaf-cli-shopify-tools`,
          ),
        );
      }

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
    });
}
