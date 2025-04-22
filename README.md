# Leaf CLI

A CLI tool and utilities for Shopify theme development.

## Installation

```bash
npm install leaf-cli-shopify
```

## Getting Started

The easiest way to start a new Shopify theme project with Leaf CLI is to use the init command:

```bash
# Go into a shopify theme directory
cd my-shopify-theme

# Initialize the project
leaf init
```

This will:

1. Create a package.json if one doesn't exist
2. Install leaf-cli-shopify-tools
3. Create a leaf.config.js file with default settings

For multiple store configuration, use:

```bash
leaf init --multistore
```

## Configuration

Setup the `leaf.config.js` file in the root of your Shopify theme project. This file is required for the CLI to work properly and contains information about your Shopify store and themes.

### Basic Configuration

```javascript
module.exports = {
  // Your Shopify store domain
  store: "your-store.myshopify.com",

  // Theme IDs for different environments
  themes: {
    development: 123456789, // Theme ID for development
    production: 987654321, // Theme ID for production
  },

  // Build configuration
  build: {
    js: {
      // JavaScript entry points
      inputs: ["src/scripts/theme.js", "src/scripts/checkout.js"],
    },
  },
};
```

### Multi-Store Configuration

For projects that manage multiple Shopify stores, you can use the `stores` configuration:

```javascript
module.exports = {
  // Default store when no --store flag is provided
  store: {
    domain: "default-store.myshopify.com",
    themes: {
      development: 123456789,
      production: 987654321,
    },
  },

  // Multiple stores configuration
  stores: {
    store1: {
      domain: "store1.myshopify.com",
      themes: {
        development: 111111111,
        production: 222222222,
      },
    },
    store2: {
      domain: "store2.myshopify.com",
      themes: {
        development: 333333333,
        production: 444444444,
      },
    },
  },

  // Build configuration
  build: {
    js: {
      inputs: ["src/scripts/theme.js"],
    },
  },
};
```

### Theme IDs

Theme IDs are required for the `deploy` and `pull` commands. You can find your theme ID in the Shopify admin:

1. Go to your Shopify admin
2. Navigate to Online Store > Themes
3. Click "Actions" on your theme, then "Edit code"
4. The theme ID is the number in the URL: `https://your-store.myshopify.com/admin/themes/THEME_ID/editor`

## Commands

### Init

Initializes a new Shopify theme project with Leaf CLI.

```bash
leaf init [options]
```

Options:

- `-m, --multistore`: Generate a configuration template for multiple stores.

The init command will:

- Create a package.json if one doesn't exist
- Create a leaf.config.js file with default settings
- Install the leaf-cli-shopify-tools package

### Build

Builds source files into the dist folder.

```bash
leaf build [options]
```

Options:

- `-d, --dev`: Skips asset optimization steps such as compression, minification and purging.

### Watch

Watches files for code changes and immediately deploys updates to dev theme as they occur. Uses Shopify Theme CLI's `serve` command under the hood.

```bash
leaf watch [options]
```

Options:

- `-s, --store <store>`: Used for multi-store projects, specify the store to run the watch command for.
- `-p, --store-password <password>`: Used for store password protected stores.
- `-o, --optimize`: Optimizes assets by compressing, minifying and purging.

### Deploy

Runs a full deploy of your theme's code to a Shopify store specified in leaf.config.js. This runs shopify theme push with the --nodelete flag, so that files aren't deleted.

```bash
leaf deploy [options]
```

Options:

- `-e, --env <environment>`: Shopify theme to deploy code to (specified in leaf.config.js). Default: `development`
- `-s, --store <store>`: Shopify store(s) to deploy code to (specified in leaf.config.js).
- `-n, --no-dev`: Skips pulling theme settings from local development theme.
- `-d, --dev`: Skips asset optimization steps such as compression, minification and purging.
- `--delete`: By default leaf deploy runs 'shopify theme push --nodelete'. With this option it will leave out the --no-delete flag, allowing files to be deleted in store theme.

### Pull

Pulls the specified theme into your src folder. By default, it only pulls theme settings. Use the --all flag to pull all files.

```bash
leaf pull [options]
```

Options:

- `-e, --env <environment>[,<environment>...]`: Shopify theme(s) to pull from (specified in leaf.config.js). Default: `development`
- `-s, --store <store>`: Shopify store(s) to pull from (specified in leaf.config.js).
- `-a, --all`: Pulls all files from specified theme, not just settings.
- `-d, --delete`: By default leaf pull doesn't delete any files in your src folder. With this option, it will delete any files that diverge from the pulled theme.

### Zip

Rebuilds the theme's source files and compresses the output. The compressed file is written to <theme>/upload/<theme>.zip (can be used for manual upload).

```bash
leaf zip
```

## Development

This repository is organized as a monorepo using Lerna:

- `leaf-cli-shopify`: The main CLI tool that provides the command-line interface
- `leaf-cli-shopify-tools`: Development tools for Shopify themes, including build process based on Gulp

### Setup for Development

```bash
# Clone the repository
git clone https://github.com/yourusername/leaf-cli.git
cd leaf-cli

# Install dependencies and bootstrap packages
npm run bootstrap
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```

```
