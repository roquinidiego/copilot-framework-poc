#!/usr/bin/env node
/**
 * Dev-only helper to (re)seed templates/ from a source repository.
 *
 * Usage:
 *   node scripts/seed.js <sourceDir>
 *
 * Copies the canonical payload from <sourceDir> into ./templates:
 *   .github/agents, .github/prompts, .github/skills, spec/**, AGENTS.md
 *
 * This is NOT part of the release flow. templates/ is the source of truth;
 * use this only for the initial import or an occasional bulk re-import.
 */
import { cpSync, existsSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const packageRoot = join(here, '..');
const templatesDir = join(packageRoot, 'templates');

const PAYLOAD = [
  '.github/agents',
  '.github/prompts',
  '.github/skills',
  'spec',
  'AGENTS.md',
];

function main() {
  const sourceDir = process.argv[2];
  if (!sourceDir) {
    process.stderr.write('Usage: node scripts/seed.js <sourceDir>\n');
    process.exitCode = 2;
    return;
  }

  for (const rel of PAYLOAD) {
    const src = join(sourceDir, rel);
    const dest = join(templatesDir, rel);
    if (!existsSync(src)) {
      process.stdout.write(`skip (missing in source): ${rel}\n`);
      continue;
    }
    rmSync(dest, { recursive: true, force: true });
    cpSync(src, dest, { recursive: true });
    process.stdout.write(`seeded: ${rel}\n`);
  }
  process.stdout.write('Done. Review templates/ before committing.\n');
}

main();
