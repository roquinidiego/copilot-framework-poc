import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readFileSync } from 'node:fs';
import {
  hash,
  hashFile,
  removeFileSafe,
  walk,
  writeFileSafe,
} from './fsutils.js';
import { loadPolicy } from './policy.js';
import {
  packageVersion,
  readManifest,
  writeManifest,
} from './manifest.js';

const here = dirname(fileURLToPath(import.meta.url));
const templatesDir = join(here, '..', 'templates');

/**
 * Plan and (optionally) apply the sync of template files into a target directory.
 *
 * @param {{ targetDir: string, dryRun?: boolean, force?: boolean }} options
 * @returns {{ results: {action:string, path:string, warning?:string}[], version:string }}
 */
export function sync({ targetDir, dryRun = false, force = false }) {
  const { classify } = loadPolicy();
  const version = packageVersion();
  const manifest = readManifest(targetDir) ?? { version: null, files: {} };

  const templateFiles = walk(templatesDir);
  /** @type {{action:string, path:string, warning?:string}[]} */
  const results = [];
  /** @type {Record<string,string>} */
  const nextManifestFiles = {};

  for (const rel of templateFiles) {
    const srcAbs = join(templatesDir, rel);
    const destAbs = join(targetDir, rel);
    const kind = classify(rel);
    const srcContent = readFileSync(srcAbs);
    const srcHash = hash(srcContent);
    const destHash = hashFile(destAbs);
    const exists = destHash !== null;

    if (kind === 'protected') {
      // Create only if missing, unless forced.
      if (exists && !force) {
        results.push({ action: 'protected-skipped', path: rel });
        continue;
      }
      const action = exists ? 'updated' : 'created';
      write(destAbs, srcContent, dryRun);
      results.push({ action: dryRun ? toWould(action) : action, path: rel });
      continue;
    }

    if (kind === 'managed') {
      nextManifestFiles[rel] = srcHash;

      if (!exists) {
        write(destAbs, srcContent, dryRun);
        results.push({ action: dryRun ? 'would-create' : 'created', path: rel });
        continue;
      }

      if (destHash === srcHash) {
        results.push({ action: 'unchanged', path: rel });
        continue;
      }

      // Managed file differs. Detect local drift: the consumer's current file
      // does not match what we last recorded in the manifest.
      const recorded = manifest.files[rel];
      const locallyModified = recorded !== undefined && recorded !== destHash;

      if (locallyModified) {
        write(destAbs, srcContent, dryRun);
        results.push({
          action: dryRun ? 'would-overwrite-drift' : 'overwritten-drift',
          path: rel,
          warning: 'local modifications were overwritten',
        });
      } else {
        write(destAbs, srcContent, dryRun);
        results.push({ action: dryRun ? 'would-update' : 'updated', path: rel });
      }
      continue;
    }

    // Unknown classification: treat as managed-create to avoid silent loss,
    // but do not track in manifest.
    if (!exists) {
      write(destAbs, srcContent, dryRun);
      results.push({ action: dryRun ? 'would-create' : 'created', path: rel });
    } else {
      results.push({ action: 'skipped', path: rel });
    }
  }

  // Prune managed files that were installed previously but are no longer
  // shipped by the kit. Locally modified files are kept unless --force.
  for (const rel of Object.keys(manifest.files)) {
    if (nextManifestFiles[rel] !== undefined) {
      continue;
    }
    const destAbs = join(targetDir, rel);
    const destHash = hashFile(destAbs);
    if (destHash === null) {
      continue;
    }
    const recorded = manifest.files[rel];
    const locallyModified = recorded !== undefined && recorded !== destHash;
    if (locallyModified && !force) {
      results.push({
        action: 'removed-skipped',
        path: rel,
        warning: 'no longer shipped, but kept due to local modifications (use --force to remove)',
      });
      continue;
    }
    if (!dryRun) {
      removeFileSafe(destAbs, targetDir);
    }
    results.push({ action: dryRun ? 'would-remove' : 'removed', path: rel });
  }

  if (!dryRun) {
    writeManifest(targetDir, { version, files: nextManifestFiles });
  }

  return { results, version };
}

function toWould(action) {
  return action === 'created' ? 'would-create' : 'would-update';
}

function write(destAbs, content, dryRun) {
  if (dryRun) {
    return;
  }
  writeFileSafe(destAbs, content);
}

/**
 * Read-only drift check used by the `check` command.
 * Returns drift entries and whether the installed manifest version is current.
 *
 * @param {{ targetDir: string }} options
 */
export function check({ targetDir }) {
  const { classify } = loadPolicy();
  const version = packageVersion();
  const manifest = readManifest(targetDir);

  const templateFiles = walk(templatesDir);
  /** @type {{action:string, path:string}[]} */
  const results = [];

  const shippedManaged = new Set();
  for (const rel of templateFiles) {
    if (classify(rel) !== 'managed') {
      continue;
    }
    shippedManaged.add(rel);
    const srcHash = hash(readFileSync(join(templatesDir, rel)));
    const destHash = hashFile(join(targetDir, rel));
    if (destHash === null || destHash !== srcHash) {
      results.push({ action: 'drift', path: rel });
    }
  }

  // Files recorded in the manifest that the kit no longer ships but still
  // exist in the consumer repo: stale and should be removed by a sync.
  if (manifest) {
    for (const rel of Object.keys(manifest.files)) {
      if (shippedManaged.has(rel)) {
        continue;
      }
      if (hashFile(join(targetDir, rel)) !== null) {
        results.push({ action: 'orphaned', path: rel });
      }
    }
  }

  const versionMismatch = !manifest || manifest.version !== version;
  if (versionMismatch) {
    results.push({
      action: 'outdated',
      path: `manifest version ${manifest?.version ?? 'none'} != package ${version}`,
    });
  }

  const hasDrift = results.length > 0;
  return { results, version, hasDrift };
}
