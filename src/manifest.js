import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readIfExists, writeFileSafe } from './fsutils.js';

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, '..');

export const MANIFEST_NAME = '.hps-ai-kit.json';

/** Read this package's own version from package.json. */
export function packageVersion() {
  const pkg = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8'));
  return pkg.version;
}

/**
 * Read the consumer manifest from a target directory.
 * @returns {{ version: string, files: Record<string,string> } | null}
 */
export function readManifest(targetDir) {
  const buf = readIfExists(join(targetDir, MANIFEST_NAME));
  if (!buf) {
    return null;
  }
  try {
    const data = JSON.parse(buf.toString('utf8'));
    return {
      version: data.version ?? null,
      files: data.files ?? {},
    };
  } catch {
    return null;
  }
}

/**
 * Write the consumer manifest.
 * @param {string} targetDir
 * @param {{ version: string, files: Record<string,string> }} manifest
 */
export function writeManifest(targetDir, manifest) {
  const body = {
    name: '@roquinidiego/copilot-framework-poc',
    version: manifest.version,
    updatedAt: new Date().toISOString(),
    files: manifest.files,
  };
  writeFileSafe(
    join(targetDir, MANIFEST_NAME),
    `${JSON.stringify(body, null, 2)}\n`,
  );
}
