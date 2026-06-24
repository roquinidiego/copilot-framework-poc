import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  walk,
  hash,
  hashFile,
  toPosix,
  writeFileSafe,
  removeFileSafe,
} from '../src/fsutils.js';

function tmp() {
  return mkdtempSync(join(tmpdir(), 'hps-fsutils-'));
}

test('hash is stable and matches hashFile', () => {
  const dir = tmp();
  const file = join(dir, 'a.txt');
  writeFileSync(file, 'hello');
  assert.equal(hashFile(file), hash('hello'));
  assert.equal(hashFile(join(dir, 'missing.txt')), null);
});

test('walk returns sorted POSIX-style relative paths', () => {
  const dir = tmp();
  writeFileSafe(join(dir, 'b.txt'), 'b');
  writeFileSafe(join(dir, 'nested', 'a.txt'), 'a');
  const files = walk(dir);
  assert.deepEqual(files, ['b.txt', 'nested/a.txt']);
  assert.equal(toPosix('nested\\a.txt'.replace('\\', '/')), 'nested/a.txt');
});

test('removeFileSafe deletes file and prunes empty parent dirs up to stopAt', () => {
  const root = tmp();
  const file = join(root, 'a', 'b', 'c.txt');
  writeFileSafe(file, 'x');
  removeFileSafe(file, root);
  assert.ok(!existsSync(file));
  // empty intermediate dirs removed, but the root boundary is preserved
  assert.ok(!existsSync(join(root, 'a')));
  assert.ok(existsSync(root));
});

test('removeFileSafe keeps non-empty parent dirs', () => {
  const root = tmp();
  writeFileSafe(join(root, 'a', 'keep.txt'), 'keep');
  const file = join(root, 'a', 'gone.txt');
  writeFileSafe(file, 'gone');
  removeFileSafe(file, root);
  assert.ok(!existsSync(file));
  assert.ok(existsSync(join(root, 'a', 'keep.txt')));
});

test('removeFileSafe on a missing file is a no-op', () => {
  const root = tmp();
  assert.doesNotThrow(() => removeFileSafe(join(root, 'nope.txt'), root));
});
