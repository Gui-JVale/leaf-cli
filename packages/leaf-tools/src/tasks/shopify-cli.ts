import gulp from "gulp";

import { config } from "./includes/config";
import { messages } from "./includes/messages";
import {
  shopifyCLI,
  logChildProcessOutput,
  getThemeID,
  getStoreName,
} from "../utils";

const environment = config.environment.split(/\s*,\s*|\s+/)[0];
const store = config.store;
const storePassword = config.storePassword;

/**
 * Initiates shopify's cli command 'shopify theme serve' on the dist folder,
 * watching files and uploading them to development store
 */
gulp.task("shopify:serve:dist", () => {
  const domain = getStoreName(config.themeRoot, store);
  messages.logChildProcess(
    `'shopify theme dev --store ${domain}${storePassword ? ` --store-password ${storePassword}` : ""}'  on dist...`,
  );
  const childProcess = shopifyCLI.serve(domain, {
    stdio: ["inherit", "pipe", "inherit"],
  });
  childProcess.stdout?.setEncoding("utf8");
  logChildProcessOutput(childProcess);
  return childProcess;
});

/**
 * Pulls theme files from the leaf config theme environment into tmp
 */
gulp.task("shopify:pull:origin:tmp", () => {
  const domain = getStoreName(config.themeRoot, store);
  messages.logChildProcess(
    `'shopify theme pull --store ${domain} ${environment}${config.nodelete ? " --nodelete" : ""}' into tmp...`,
  );
  return shopifyCLI.pull(
    domain,
    getThemeID(config.themeRoot, environment, store),
    config.tmp.root,
  );
});

/**
 * Pulls theme files from the theme into src
 */
gulp.task("shopify:pull:origin:src", () => {
  const domain = getStoreName(config.themeRoot, store);
  messages.logChildProcess(
    `'shopify theme pull --store ${domain} ${environment}${config.nodelete ? " --nodelete" : ""}' into src...`,
  );
  return shopifyCLI.pull(
    domain,
    getThemeID(config.themeRoot, environment, store),
    config.src.root,
    config.nodelete,
  );
});

/**
 * Initiates shopify's cli command 'shopify theme push' on the dist folder,
 * pushing it to stores theme
 */
gulp.task("shopify:push:dist", () => {
  const domain = getStoreName(config.themeRoot, store);
  messages.logChildProcess(
    `'shopify theme push --store ${domain}${config.nodelete ? " --nodelete" : ""}' on dist folder...`,
  );
  return shopifyCLI.push(
    domain,
    getThemeID(config.themeRoot, config.environment, store),
    config.nodelete,
  );
});

/**
 * Initiates 'shopify theme package' on the dist folder, creating a zip.
 */
gulp.task("shopify:package:dist", () => {
  messages.logChildProcess("shopify theme package on dist folder...");
  return shopifyCLI.package();
});
