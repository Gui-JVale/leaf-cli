import chalk from "chalk";
import log from "fancy-log";
import _ from "lodash";

let errors: any[] = [];

/**
 * Utility and reusable functions used by our Gulp Tasks
 *
 * @summary a set of utility functions used within the gulp tasks of leaf-cli
 */
export const utilities = {
  /**
   * Indicates whether there are errors during build/watch
   */
  hasErrors: () => errors.length > 0,

  /**
   * Handles the output for any errors that might have been captured
   * during the build and zip Gulp tasks.
   */
  outputErrors: () => {
    if (!errors.length) {
      return;
    }

    log(chalk.red(`There were errors during the build:\n`));
    errors.forEach((err) => {
      log(chalk.red(err));
    });

    errors = [];
  },

  /**
   * Generic error handler for streams called in `watch` tasks (used by gulp-plumber).
   * Any error that is thrown inside of a task is added to the errors array.
   */
  errorHandler: (err: Error) => {
    log(chalk.red(err));
    errors.push(err);
  },

  /**
   * Factory for creating an event cache - used with a short debounce to batch any
   * file changes that occur in rapid succession during Watch tasks.
   */
  createEventCache: (options?: any) => {
    _.defaults((options = options || {}), {
      // eslint-disable-line no-param-reassign
      changeEvents: ["add", "change"],
      unlinkEvents: ["unlink"],
    });

    /**
     * A cache object used for caching `[chokidar]{@link https://github.com/paulmillr/chokidar}`
     * events - used with a short `debounce` to batch any file changes that occur in rapid
     * succession during Watch tasks.
     *
     * @typedef {Object} eventCache
     * @prop {Array} change - an array for caching `add` and `change` events
     * @prop {Array} unlink - an array for caching `unlink` events
     * @prop {Function} addEvent - a function to push events to the appropriate `cache` array
     */
    return {
      change: [] as string[],
      unlink: [] as string[],

      /**
       * Pushes events to upload & remove caches for later batch deployment
       */
      addEvent: function (event: string, path: string) {
        _.each(options.changeEvents, (eventType: string) => {
          if (event === eventType) {
            this.change.push(path);
          }
        });

        _.each(options.unlinkEvents, (eventType: string) => {
          if (event === eventType) {
            this.unlink.push(path);
          }
        });
      },
    };
  },

  /**
   * Debounced (320ms) delegator function passing an {@link eventCache} object
   * through to a pair of custom functions for processing batch add/change or unlink events.
   * Clears the appropriate cache array after a change/delete function has been
   * called.
   *
   * @param {eventCache} cache - a specific cache object for tracking file events
   * @param {Function} changeFn - a custom function to process the set of files that have changed
   * @param {Function} delFn - a custom function to remove the set of files that have changed from the `dist` directory
   */
  processCache: _.debounce((cache: any, changeFn: any, delFn: any) => {
    if (cache.change.length) {
      changeFn(cache.change);
      cache.change = [];
    }

    if (cache.unlink.length) {
      delFn(cache.unlink);
      cache.unlink = [];
    }
  }, 320),
};
