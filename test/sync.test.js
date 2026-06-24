import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { sync, check } from '../src/sync.js';
import {
  packageVersion,
  readManifest,
  writeManifest,
  MANIFEST_NAME,
} from '../src/manifest.js';
import { writeFileSafe, hash } from '../src/fsutils.js';

const AGENTS = 'AGENTS.md';
const SPEC = 'spec/project.md';

function tmp() {
  return mkdtempSync(join(tmpdir(), 'hps-sync-'));
}

function actionFor(results, path) {
  return results.find((r) => r.path === path)?.action;
}

test('first sync creates managed + protected files and writes manifest', () => {
  const dir = tmp();
  const { results, version } = sync({ targetDir: dir });

  assert.equal(version, packageVersion());
  assert.ok(existsSync(join(dir, AGENTS)));
  assert.ok(existsSync(join(dir, SPEC)));
  assert.equal(actionFor(results, AGENTS), 'created');
  assert.equal(actionFor(results, SPEC), 'created');

  const manifest = readManifest(dir);
  assert.equal(manifest.version, version);
  // managed files are tracked; protected ones are not
  assert.ok(manifest.files[AGENTS]);
  assert.equal(manifest.files[SPEC], undefined);
});

test('second sync reports everything unchanged', () => {
  const dir = tmp();
  sync({ targetDir: dir });
  const { results } = sync({ targetDir: dir });
  assert.equal(actionFor(results, AGENTS), 'unchanged');
  assert.equal(actionFor(results, SPEC), 'protected-skipped');
});

test('locally edited managed file is overwritten and flagged as drift', () => {
  const dir = tmp();
  sync({ targetDir: dir });
  const original = readFileSync(join(dir, AGENTS));
  writeFileSync(join(dir, AGENTS), 'tampered');

  const { results } = sync({ targetDir: dir });
  assert.equal(actionFor(results, AGENTS), 'overwritten-drift');
  assert.deepEqual(readFileSync(join(dir, AGENTS)), original);
});

test('protected file is preserved without --force and overwritten with it', () => {
  const dir = tmp();
  sync({ targetDir: dir });
  writeFileSync(join(dir, SPEC), 'my customization');

  let res = sync({ targetDir: dir }).results;
  assert.equal(actionFor(res, SPEC), 'protected-skipped');
  assert.equal(readFileSync(join(dir, SPEC), 'utf8'), 'my customization');

  res = sync({ targetDir: dir, force: true }).results;
  assert.equal(actionFor(res, SPEC), 'updated');
  assert.notEqual(readFileSync(join(dir, SPEC), 'utf8'), 'my customization');
});

test('dry-run writes nothing and leaves no manifest', () => {
  const dir = tmp();
  const { results } = sync({ targetDir: dir, dryRun: true });
  assert.equal(actionFor(results, AGENTS), 'would-create');
  assert.ok(!existsSync(join(dir, AGENTS)));
  assert.ok(!existsSync(join(dir, MANIFEST_NAME)));
});

test('sync prunes a previously installed file that is no longer shipped', () => {
  const dir = tmp();
  sync({ targetDir: dir });

  // Simulate an older kit that shipped an extra managed file.
  const stale = '.github/agents/retired.agent.md';
  const content = 'old agent';
  writeFileSafe(join(dir, stale), content);
  const manifest = readManifest(dir);
  manifest.files[stale] = hash(content);
  writeManifest(dir, manifest);

  const { results } = sync({ targetDir: dir });
  assert.equal(actionFor(results, stale), 'removed');
  assert.ok(!existsSync(join(dir, stale)));
  // pruned entry is gone from the refreshed manifest
  assert.equal(readManifest(dir).files[stale], undefined);
});

test('pruning keeps locally modified stale files unless --force', () => {
  const dir = tmp();
  sync({ targetDir: dir });

  const stale = '.github/agents/retired.agent.md';
  writeFileSafe(join(dir, stale), 'original');
  const manifest = readManifest(dir);
  manifest.files[stale] = hash('original');
  writeManifest(dir, manifest);
  // user edits it after install
  writeFileSync(join(dir, stale), 'locally changed');

  let res = sync({ targetDir: dir }).results;
  assert.equal(actionFor(res, stale), 'removed-skipped');
  assert.ok(existsSync(join(dir, stale)));

  // re-record so the manifest still knows about it, then force-remove
  const m2 = readManifest(dir);
  m2.files[stale] = hash('locally changed');
  writeManifest(dir, m2);
  res = sync({ targetDir: dir, force: true }).results;
  assert.equal(actionFor(res, stale), 'removed');
  assert.ok(!existsSync(join(dir, stale)));
});

test('check reports drift, orphans, and version mismatch; clean after sync', () => {
  const dir = tmp();

  // Nothing installed yet: drift for every managed file + outdated manifest.
  let { hasDrift, results } = check({ targetDir: dir });
  assert.ok(hasDrift);
  assert.ok(results.some((r) => r.action === 'drift'));
  assert.ok(results.some((r) => r.action === 'outdated'));

  sync({ targetDir: dir });
  ({ hasDrift, results } = check({ targetDir: dir }));
  assert.equal(hasDrift, false);

  // Inject an orphan into the manifest and confirm check flags it.
  const stale = '.github/agents/retired.agent.md';
  writeFileSafe(join(dir, stale), 'orphan');
  const manifest = readManifest(dir);
  manifest.files[stale] = 'deadbeef';
  writeManifest(dir, manifest);

  ({ hasDrift, results } = check({ targetDir: dir }));
  assert.ok(hasDrift);
  assert.equal(actionFor(results, stale), 'orphaned');
});
