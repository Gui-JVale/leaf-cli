import { red, yellow } from "chalk";
import figures from "figures";
import spawn from "cross-spawn";
import { join } from "path";
import { config } from "./config";
import { ChildProcess } from "child_process";

/**
 * Wrappers for Shopify CLI commands
 */
export const shopifyCLI = {
  /**
   * shopify login
   */
  login: (store: string) => {
    const args = ["switch", "--store", store];
    const options = {
      env: process.env,
      stdio: "inherit",
      shell: true,
    };

    // @ts-ignore
    return spawn.sync("shopify", args, options);
  },

  /**
   * shopify theme dev
   */
  serve: (store: string, options = {}) => {
    return spawn("shopify theme", ["dev", "--store", store, "--path", "dist"], {
      env: process.env,
      stdio: "inherit",
      shell: true,
      ...options,
    });
  },

  /**
   * shopify theme push
   */
  pull: (
    store: string,
    themeId: string | null = null,
    dir = "./src",
    nodelete = true,
  ) => {
    let args = ["pull", "--store", store];
    if (themeId) args = args.concat(["--theme", themeId, "--path", dir]);

    if (nodelete) args.push("--nodelete");

    return spawn("shopify theme", args, {
      env: process.env,
      stdio: "inherit",
      shell: true,
    });
  },

  /**
   * shopify theme push
   */
  push: (store: string, themeId: string | null = null, nodelete = true) => {
    let args = ["push", "--store", store, "--path", "dist"];
    if (themeId) args = args.concat(["--theme", themeId]);

    if (nodelete) args.push("--nodelete");

    return spawn("shopify theme", args, {
      env: process.env,
      stdio: "inherit",
      shell: true,
    });
  },

  /**
   * shopify theme package
   */
  package: () => {
    return spawn("shopify theme", ["package", "--path", "dist"], {
      env: process.env,
      stdio: "inherit",
      shell: true,
    });
  },
};

/**
 * Get leaf.config.js from project root dir
 */
export function getLeafConfig(themeRoot: string) {
  return require(join(themeRoot, "leaf.config.js"));
}

/**
 * Get store name from leaf.config.js
 */
export function getStoreName(themeRoot: string, store: string) {
  return store
    ? getLeafConfig(themeRoot).stores[store].domain
    : getLeafConfig(themeRoot).store.domain;
}

/**
 * Get theme ID from leaf.config.js
 */
export function getThemeID(
  themeRoot: string,
  environment: string,
  store: string,
) {
  return store
    ? getLeafConfig(themeRoot).stores[store].themes[environment]
    : getLeafConfig(themeRoot).store.themes[environment];
}

/**
 * Logs out to terminal the output of a piped child process
 */
export function logChildProcessOutput(process: ChildProcess) {
  process.stdout?.on("data", (data) => {
    console.log(data);
  });
}

/**
 * Logs into leaf config shopify store while logging useful messages
 * and handling errors.
 */
export function login(store: string) {
  const domain = getStoreName(config.themeRoot, store);

  if (!domain) {
    storeErrorMessage(store);
    return false;
  }

  console.log(`Logging into ${yellow(domain)} with Shopify CLI...`);
  const loginProcess = shopifyCLI.login(domain);
  if (loginProcess.error) {
    console.log("");
    console.log(
      red(
        `  ${figures.cross} Failed logging into ${domain}, are you sure you're using the correct account?`,
      ),
    );
    console.log("");
    return false;
  }

  return true;
}

/**
 * Outputs error message if there's no store field in leaf config
 */
export function storeErrorMessage(store: string) {
  if (store) {
    console.log("");
    console.log(red(`  The store ${store} does not exist in leaf.config.js`));
    console.log(
      "    Check to see if you spelled the store correctly on leaf config and when running the command.",
    );
    console.log("");
  } else {
    console.log("");
    console.log(
      red(
        `  ${figures.cross} no store field in leaf.config.js. Did you forget the --store <store> argument?`,
      ),
    );
    console.log(
      "    If this is a multi-store project, please specify which store to watch, else add 'store: <store.myshopify.com>' to your project leaf.config.js",
    );
    console.log("");
  }
}
