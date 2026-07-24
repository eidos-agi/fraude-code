#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import App from './app.js';

if (process.argv.includes('--version') || process.argv.includes('-v')) {
  console.log('fraude-code 0.3.0');
  process.exit(0);
}

render(<App />);
