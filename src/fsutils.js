import { createHash } from 'node:crypto';
import {
  mkdirSync,
  readdirSync,
  readFileSync,
  rmdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, relative, sep } from 'node:path';

/**
 * Recursively walk a directory and return POSIX-style relative paths of every file.
 * @param {string} root absolute directory to walk
 * @returns {string[]} relative file paths using "/" separators
 */
export function walk(root) {
  /** @type {string[]} */
  const out = [];
  walkInto(root, root, out);
  return out.sort();
}

function walkInto(root, current, out) {
  for (const entry of readdirSync(current, { withFileTypes: true })) {
    const abs = join(current, entry.name);
    if (entry.isDirectory()) {
      walkInto(root, abs, out);
    } else if (entry.isFile()) {
      out.push(toPosix(relative(root, abs)));
    }
  }
}

/** Convert an OS-specific path to POSIX separators. */
export function toPosix(p) {
  return p.split(sep).join('/');
}

/** sha256 of a buffer or string, hex encoded. */
export function hash(content) {
  return createHash('sha256').update(content).digest('hex');
}

/** sha256 of a file on disk, or null if it does not exist. */
export function hashFile(absPath) {
  try {
    return hash(readFileSync(absPath));
  } catch {
    return null;
  }
}

/** Read a file as a Buffer, or null if it does not exist. */
export function readIfExists(absPath) {
  try {
    return readFileSync(absPath);
  } catch {
    return null;
  }
}

/** Ensure the parent directory of a file exists. */
export function ensureDir(absFilePath) {
  mkdirSync(dirname(absFilePath), { recursive: true });
}

/** Write a buffer/string to disk, creating parent directories as needed. */
export function writeFileSafe(absFilePath, content) {
  ensureDir(absFilePath);
  writeFileSync(absFilePath, content);
}

/**
 * Delete a file if it exists, then remove any parent directories left empty,
 * walking up until (but not including) the optional `stopAt` boundary.
 */
export function removeFileSafe(absFilePath, stopAt) {
  try {
    rmSync(absFilePath, { force: true });
  } catch {
    return;
  }
  if (!stopAt) {
    return;
  }
  let dir = dirname(absFilePath);
  while (dir !== stopAt && dir.startsWith(stopAt)) {
    try {
      if (readdirSync(dir).length > 0) {
        break;
      }
      rmdirSync(dir);
    } catch {
      break;
    }
    dir = dirname(dir);
  }
}

/** True if the path exists and is a file. */
export function isFile(absPath) {
  try {
    return statSync(absPath).isFile();
  } catch {
    return false;
  }
}
