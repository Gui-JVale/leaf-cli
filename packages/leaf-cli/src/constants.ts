// Template for single store config
export const SINGLE_STORE_CONFIG = `module.exports = {
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
export const MULTI_STORE_CONFIG = `module.exports = {
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
export const PACKAGE_JSON_TEMPLATE = {
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
  dependencies: {},
  keywords: ["shopify", "theme", "leaf-cli"],
  license: "MIT",
};
