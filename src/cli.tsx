#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import App from './app.js';
import {runPrompt, jsonEnvelope} from './headless.js';

const argv = process.argv.slice(2);

if (argv.includes('--version') || argv.includes('-v')) {
  console.log('fraude-code 0.4.0');
  process.exit(0);
}

// Headless: `fraude -p "ls ."` — no Ink, no TTY needed, exits when done. Must be checked
// before render(), since Ink needs raw-mode stdin that a scheduler or CI job won't have.
const printIdx = argv.findIndex((a) => a === '-p' || a === '--print');
if (printIdx !== -1) {
  const prompt = argv[printIdx + 1] ?? '';
  const fmtIdx = argv.indexOf('--output-format');
  const asJson = fmtIdx !== -1 && argv[fmtIdx + 1] === 'json';

  const started = Date.now();
  const result = runPrompt(prompt);

  if (asJson) {
    console.log(JSON.stringify(jsonEnvelope(result, Date.now() - started), null, 2));
  } else {
    console.log(result.text);
  }
  process.exit(result.isError ? 1 : 0);
}

// Clear screen + scrollback + home, like Claude Code — the welcome starts clean at the top.
if (process.stdout.isTTY) process.stdout.write('\x1b[2J\x1b[3J\x1b[H');

render(<App />);
