import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, readFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {splitStatements, runPrompt} from './headless.js';

test('splits on verbs, keeps multi-line write bodies whole', () => {
  const stmts = splitStatements('ls .\nwrite out.md: line one\nline two\nrun echo hi');
  assert.equal(stmts.length, 3);
  assert.equal(stmts[1], 'write out.md: line one\nline two');
});

test('multi-line write actually lands both lines on disk', () => {
  const file = join(mkdtempSync(join(tmpdir(), 'fraude-')), 'r.md');
  const r = runPrompt(`write ${file}: alpha\nbeta`);
  assert.equal(r.isError, false);
  assert.equal(readFileSync(file, 'utf8'), 'alpha\nbeta');
});

test('unrecognised instruction is a hard error, not a shrug', () => {
  // The failure that matters: a harness must never read "no brain" as success.
  const r = runPrompt('please summarise the quarterly results');
  assert.equal(r.isError, true);
});

test('a failing tool marks the run errored', () => {
  assert.equal(runPrompt('read /definitely/not/here.md').isError, true);
});

test('empty prompt errors rather than silently succeeding', () => {
  assert.equal(runPrompt('   \n  ').isError, true);
});
