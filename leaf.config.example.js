/**
 * @type {import('leaf-cli-shopify-tools').Config}
 */
module.exports = {
  store: {
    domain: "temp.myshopify.com",
    storePassword: "password",
    themes: {
      development: null,
      production: null,
    },
  },
  build: {
    js: {
      inputs: ["./src/scripts/theme.js"],
    },
  },
};
