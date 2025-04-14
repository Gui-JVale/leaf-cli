import { join, normalize } from "path";
import { existsSync } from "fs";
import findRoot from "find-root";

const workingDirectory = process.cwd();
const currentDirectory = __dirname;

const themeRoot = findRoot(workingDirectory);
const defaultGulpPath = join(themeRoot, normalize("node_modules/.bin/gulp"));
// Legacy path for older versions of Node.
const legacyGulpPath = join(
  themeRoot,
  normalize("node_modules/leaf-cli-tools/node_modules/.bin/gulp"),
);

export const config = {
  gulpFile: join(currentDirectory, "gulpfile.js"),
  gulp: existsSync(defaultGulpPath) ? defaultGulpPath : legacyGulpPath,
  themeRoot,
  leafConfig: join(themeRoot, "leaf.config.js"),
};

export default config;
