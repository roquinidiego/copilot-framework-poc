import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, '..');

/**
 * Convert a single glob pattern (supporting "**" and "*") into a RegExp.
 * Matching is performed against POSIX-style relative paths.
 */
function globToRegExp(glob) {
  let re = '';
  for (let i = 0; i < glob.length; i += 1) {
    const c = glob[i];
    if (c === '*') {
      if (glob[i + 1] === '*') {
        // "**" matches across path separators
        re += '.*';
        i += 1;
        // consume an immediately following slash so "a/**/b" also matches "a/b"
        if (glob[i + 1] === '/') {
          i += 1;
        }
      } else {
        // single "*" matches within a path segment
        re += '[^/]*';
      }
    } else if ('.+^${}()|[]\\'.includes(c)) {
      re += `\\${c}`;
    } else {
      re += c;
    }
  }
  return new RegExp(`^${re}$`);
}

/**
 * Load policy.json and return a classifier.
 * @returns {{ classify: (relPath: string) => 'managed' | 'protected' | 'unknown' }}
 */
export function loadPolicy() {
  const raw = JSON.parse(readFileSync(join(packageRoot, 'policy.json'), 'utf8'));
  const managed = (raw.managed ?? []).map(globToRegExp);
  const protectedPats = (raw.protected ?? []).map(globToRegExp);

  function classify(relPath) {
    if (managed.some((r) => r.test(relPath))) {
      return 'managed';
    }
    if (protectedPats.some((r) => r.test(relPath))) {
      return 'protected';
    }
    return 'unknown';
  }

  return { classify };
}

export { globToRegExp };
