import { test } from 'node:test';
import assert from 'node:assert/strict';
import { loadPolicy, globToRegExp } from '../src/policy.js';

test('globToRegExp: "**" matches across separators and zero segments', () => {
  const re = globToRegExp('spec/**');
  assert.ok(re.test('spec/project.md'));
  assert.ok(re.test('spec/backend/topics/testing.md'));
  // "a/**/b" should also match "a/b"
  assert.ok(globToRegExp('a/**/b').test('a/b'));
  assert.ok(globToRegExp('a/**/b').test('a/x/y/b'));
});

test('globToRegExp: single "*" stays within a segment', () => {
  const re = globToRegExp('.github/*');
  assert.ok(re.test('.github/AGENTS.md'));
  assert.ok(!re.test('.github/agents/x.md'));
});

test('globToRegExp: regex metacharacters are escaped', () => {
  const re = globToRegExp('AGENTS.md');
  assert.ok(re.test('AGENTS.md'));
  assert.ok(!re.test('AGENTSXmd'));
});

test('classify: managed, protected, and unknown', () => {
  const { classify } = loadPolicy();
  assert.equal(classify('.github/agents/code-reviewer.agent.md'), 'managed');
  assert.equal(classify('.github/prompts/story-brief.prompt.md'), 'managed');
  assert.equal(classify('.github/skills/jira-ticket-intake/SKILL.md'), 'managed');
  assert.equal(classify('AGENTS.md'), 'managed');
  assert.equal(classify('spec/project.md'), 'protected');
  assert.equal(classify('spec/backend/instructions.md'), 'protected');
  assert.equal(classify('some/random/file.txt'), 'unknown');
});
