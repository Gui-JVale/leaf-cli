import { normalize } from 'path';
import findRoot from 'find-root';

/**
 * Find closest package.json to be at root of theme.
 */
export function getThemeRoot(directory: string): string | null {
  try {
    return normalize(findRoot(directory));
  } catch (err) {
    console.error(err);
    return null;
  }
}
