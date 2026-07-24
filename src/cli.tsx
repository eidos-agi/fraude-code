#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import App from './app.js';

if (process.argv.includes('--version') || process.argv.includes('-v')) {
  console.log('fraude-code 0.3.0');
  process.exit(0);
}

// Clear screen + scrollback + home, like Claude Code — the welcome starts clean at the top.
if (process.stdout.isTTY) process.stdout.write('\x1b[2J\x1b[3J\x1b[H');

render(<App />);
