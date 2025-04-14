import chalk from "chalk";
import log from "fancy-log";

/**
 * Separates filename and directory from a path string. Returns an object containing both.
 */
function separatePath(path: string) {
  const tmp = path.split("/");

  return {
    file: tmp.pop(),
    dir: tmp.join("/"),
  };
}

export const messages = {
  logFileEvent: (event: string, path: string, dist = false) => {
    const pathObject = separatePath(path);

    if (dist) {
      log(
        "updated",
        chalk.green("dist"),
        chalk.magenta(pathObject.dir),
        chalk.white("-"),
        chalk.cyan(event),
        chalk.yellow(pathObject.file),
      );
    } else {
      log(
        "change in",
        chalk.magenta(pathObject.dir),
        chalk.white("-"),
        chalk.cyan(event),
        chalk.yellow(pathObject.file),
      );
    }
  },

  logTransferDone: () => {
    log(
      "Transfer Complete:",
      chalk.green("File changes successfully synced to store"),
    );
  },

  logTransferFailed: (errMsg: string) => {
    log(
      "Transfer Failed:",
      chalk.yellow(
        `${typeof errMsg === "string" ? errMsg : "File(s) failed to upload to store. See log notes in deploy.log"}`,
      ),
    );
  },

  logProcessFiles: (processName: string) => {
    log("running task", chalk.white("-"), chalk.cyan(processName));
  },

  logChildProcess: (cmd: string) => {
    log(
      "running task",
      chalk.bold("[child process]"),
      chalk.white("-"),
      chalk.cyan(cmd),
    );
  },

  logDeploys: (cmd: string, files: string[]) => {
    const timestamp = `Deploy complete @ ${new Date()}. `;
    const action = cmd === "upload" ? "added/changed " : "removed ";
    const amount = `${files.length} file(s): `;
    const fileList = `${files.join(", ")}.\n`;

    return timestamp + action + amount + fileList;
  },

  logDeployErrors: (cmd: string, files: string[], err: string) => {
    const timestamp = `Deploy error @ ${new Date()}. `;
    const action = cmd === "upload" ? "added/changed " : "removed ";
    const amount = `${files.length} file(s): `;
    const fileList = `${files.join(", ")}.\n`;
    const errMsg = `${err} \n`;

    return timestamp + action + amount + fileList + errMsg;
  },

  logBundleJs: () => {
    log("Updating JS Bundle...");
  },

  configChange: () => {
    return (
      "Changes to leaf.config.js Detected: You may need to quit <leaf watch>" +
      " and run a full <leaf deploy> as a result."
    );
  },

  translationsFailed: () => {
    return "Translation errors detected.";
  },

  invalidThemeId: (themeId: string, env: string) => {
    log(
      "Invalid theme id for",
      chalk.cyan(`${env}: ${themeId}`),
      chalk.yellow("`theme_id` must be a string."),
    );
  },

  configError: () => {
    log(
      "File missing:",
      chalk.yellow(
        "`leaf.config.js` does not exist. You need to add a config file before you can make changes to your Shopify store.",
      ),
    );
  },

  deployTo: (environment: string) => {
    log("Environment:", chalk.bold(environment));
  },

  allDeploysComplete: () => {
    log(
      "Multiple environments:",
      chalk.green("Deploy completed for all environments in series"),
    );
  },
};
