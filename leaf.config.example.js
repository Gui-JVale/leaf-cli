/**
 * @type {import('leaf-cli-shopify-tools').Config}
 */
module.exports = {
  store: "temp.myshopify.com",
  themes: {
    development: null,
    production: null,
  },
  build: {
    js: {
      inputs: ["./src/scripts/theme.js"],
    },
  },
};
