import fs from "fs";
import { join } from "path";
import logger from "debug";
import findRoot from "find-root";
import tailwindcss from "tailwindcss";
import cssnano from "cssnano";
import pxtorem from "postcss-pxtorem";
import reporter from "postcss-reporter";
import minimist from "minimist";

const argv = minimist(process.argv.slice(2));

const themeRoot = findRoot(process.cwd());
const tailwindConfig = "tailwind.config.js";

let pkg = {};

try {
  pkg = require(join(themeRoot, "package.json"));
} catch (err) {
  logger(err);
}

export const config = {
  environment:
    argv.environment === "undefined" || !argv.environment
      ? "development"
      : argv.environment,
  store: argv.store === "undefined" || !argv.store ? null : argv.store,
  storePassword:
    argv["store-password"] === "undefined" || !argv["store-password"]
      ? null
      : argv["store-password"],
  optimize: !argv["dev"],
  nodelete: !argv["delete"],
  themeRoot,
  packageJson: pkg,

  tailwindConfig,

  usesTailwind: fs.existsSync(join(themeRoot, tailwindConfig)),

  leafConfig: "leaf.config.json",

  shopifyIgnore: join(themeRoot, ".shopifyignore"),

  src: {
    root: "src/",
    js: "src/scripts/**/*.{js,ts,js.liquid}",
    vendorJs: "src/scripts/vendor/*.js",
    json: "src/**/*.json",
    css: "src/styles/**/*.css",
    scss: "src/styles/**/*.scss",
    cssLint: "src/styles/**/*.{css,scss}",
    vendorCss: "src/styles/vendor/*.{css,scss}",
    assets: "src/assets/**/*",
    icons: "src/icons/**/*.svg",
    templates: "src/templates/**/*",
    snippets: "src/snippets/*",
    sections: "src/sections/*",
    blocks: "src/blocks/*",
    locales: "src/locales/*",
    config: "src/config/*",
    layout: "src/layout/*",
    zip: "src/**/*.zip",
  },

  tmp: {
    root: "tmp/",
    js: "tmp/scripts/**/*.{js,ts,js.liquid}",
    vendorJs: "tmp/scripts/vendor/*.js",
    json: "tmp/**/*.json",
    css: "tmp/styles/**/*.css",
    scss: "tmp/styles/**/*.scss",
    cssLint: "tmp/styles/**/*.{css,scss}",
    vendorCss: "tmp/styles/vendor/*.{css,scss}",
    assets: "tmp/assets/**/*",
    icons: "tmp/icons/**/*.svg",
    templates: "tmp/templates/**/*",
    snippets: "tmp/snippets/*",
    sections: "tmp/sections/*",
    sectionsJson: "tmp/sections/*.json",
    blocks: "tmp/blocks/*",
    blocksJson: "tmp/blocks/*.json",
    locales: "tmp/locales/*",
    config: "tmp/config/*",
    layout: "tmp/layout/*",
    zip: "tmp/**/*.zip",
  },

  dist: {
    root: "dist/",
    assets: "dist/assets/",
    snippets: "dist/snippets/",
    sections: "dist/sections/",
    blocks: "dist/blocks",
    layout: "dist/layout/",
    templates: "dist/templates/",
    locales: "dist/locales/",
    zip: "dist/*.zip",
  },

  roots: {
    js: "src/scripts/*.{js,ts,js.liquid}",
    vendorJs: "src/scripts/vendor.js",
    css: "src/styles/*.css",
    scss: "src/styles/*.scss",
  },

  plugins: {
    // Added at runtime
    postcss: [require("postcss-import")],
  },
};

if (config.usesTailwind) {
  config.plugins.postcss.push(
    tailwindcss({ config: join(themeRoot, tailwindConfig) }),
  );
}

config.plugins.postcss.push(require("autoprefixer"));

config.plugins.postcss.push(
  pxtorem({
    rootValue: 16,
    unitPrecision: 5,
    propList: ["*"],
    selectorBlackList: [],
    replace: true,
    mediaQuery: true,
    exclude: /node_modules/i,
  }),
);

if (config.optimize) {
  config.plugins.postcss.push(cssnano({ preset: "default" }));
}

config.plugins.postcss.push(reporter({ clearReportedMessages: true }));
