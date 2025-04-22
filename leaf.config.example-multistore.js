/**
 * @type {import('leaf-cli-shopify-tools').Config}
 */
module.exports = {
  stores: {
    production: {
      store: "temp.myshopify.com",
      themes: {
        themeA: null,
        themeB: null,
      },
    },
    development: {
      store: "temp.myshopify.com",
      themes: {
        themeA: null,
        themeB: null,
      },
    },
  },
  build: {
    js: {
      inputs: ["./src/scripts/theme.js"],
    },
  },
};
