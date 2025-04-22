# Leaf CLI

A CLI tool and utilities for Shopify theme development.

## Installation

Install the CLI globally

```bash
npm install -g leaf-cli-shopify
```

## Getting Started

The easiest way to start a new Shopify theme project with Leaf CLI is to use the init command:

```bash
# Go into a shopify theme directory
cd my-shopify-theme

# Initialize the project interactively
leaf init
```

The init command will guide you through the setup process with prompts:

1. Create a package.json if one doesn't exist (you'll be asked for confirmation)
2. Create a leaf.config.js file (you'll be asked for confirmation)
3. Install leaf-cli-shopify-tools (you'll be asked for confirmation)

For multiple store configuration, use:

```bash
leaf init --multistore
```

To skip all prompts and automatically apply all actions:

```bash
leaf init --yes
```

## Theme Structure

Leaf expects a specific directory structure for your Shopify theme project. It follows the native Shopify theme structure with some additional directories for better organization of assets:

### Source Structure

```
my-shopify-theme/
├── src/
│   ├── assets/           # Theme assets (images, fonts, etc.)
│   ├── config/           # Theme settings schema
│   ├── layout/           # Theme layout files
│   ├── locales/          # Translation files
│   ├── sections/         # Theme sections
│   ├── snippets/         # Theme snippets
│   ├── templates/        # Theme templates
│   ├── scripts/          # JavaScript files
│   │   ├── theme.js      # Main entry point (defined in leaf.config.js)
│   │   ├── .../          # You can setup folder structure as you like
│   │   └── whatever/     # Example
│   ├── styles/           # CSS/SCSS files
│   │   ├── theme.scss    # Main stylesheet
│   │   ├── .../          # Setup folder structure as you like
│   │   └── example/      # Example
│   └── icons/            # SVG icons
├── dist/                 # Built theme files (generated)
├── leaf.config.js        # Leaf configuration
└── package.json          # Project dependencies
```

### Distribution Structure

After running the build command, Leaf generates a `dist` folder structured like a standard Shopify theme:

```
my-shopify-theme/
├── dist/
│   ├── assets/           # All processed assets (JS, CSS, images, fonts)
│   ├── config/           # Theme settings schema (copied from src)
│   ├── layout/           # Theme layout files (copied from src)
│   ├── locales/          # Translation files (copied from src)
│   ├── sections/         # Theme sections (copied from src)
│   ├── snippets/         # Theme snippets (copied from src + processed icons)
│   └── templates/        # Theme templates (copied from src)
```

### Special Directories

#### Scripts Directory

All JavaScript logic lives in the `src/scripts` directory:

- Entry points are defined in the `leaf.config.js` file
- These entry points will be processed by Rollup and placed in the `dist/assets` folder
- You can use ES modules (import/export) and the code will be bundled correctly

Example entry point configuration in `leaf.config.js`:

```javascript
module.exports = {
  store: {
    // Your Shopify store domain
    domain: "your-store.myshopify.com",
    storePassword: "password", // optional, for password-protected stores

    // Theme IDs for different environments
    themes: {
      development: 123456789, // Theme ID for development
      production: 987654321, // Theme ID for production
    },
  },

  // Build configuration
  build: {
    js: {
      inputs: ["src/scripts/theme.js", "src/scripts/checkout.js"],
    },
  },
};
```

#### Styles Directory

CSS and SCSS files live in the `src/styles` directory:

- Leaf supports Tailwind CSS out of the box
- You can use CSS imports (`@import "file.css"`)
- Tailwind directives are fully supported
- Processed CSS files will be placed in the `dist/assets` folder

#### Icons Directory

SVG icons live in the `src/icons` directory:

- Each SVG file will be transformed into a Liquid snippet
- For example, `src/icons/icon-example.svg` becomes `dist/snippets/icon-example.liquid`
- This makes it easy to include icons in your theme using Liquid includes: `{% include 'icon-example' %}`

## Configuration

Setup the `leaf.config.js` file in the root of your Shopify theme project. This file is required for the CLI to work properly and contains information about your Shopify store and themes.

### Basic Configuration

```javascript
module.exports = {
  store: {
    // Your Shopify store domain
    domain: "your-store.myshopify.com",
    storePassword: "password", // optional, for password-protected stores

    // Theme IDs for different environments
    themes: {
      development: 123456789, // Theme ID for development
      production: 987654321, // Theme ID for production
    },
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
      storePassword: "password", // optional, for password-protected stores
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
- `-y, --yes`: Skip all prompts and automatically apply all actions.

The init command will ask for confirmation before:

- Creating a package.json file
- Creating a leaf.config.js file
- Installing the leaf-cli-shopify-tools package

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
