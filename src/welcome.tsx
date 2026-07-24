import React from 'react';
import os from 'node:os';
import {Box, Text} from 'ink';
import Octopus from './octopus.js';

export const version = '0.3.0';
export const amber = '#e8964f';

// Parody "MCP servers" — criminal knock-offs of the real integrations. None connect; they
// all turned down the job. Add more here as the rap sheet grows.
const accomplices = ['Chrime', 'Gfail', 'Schemes', 'Extort'];

function cwd(): string {
  const dir = process.cwd();
  const home = os.homedir();
  return dir.startsWith(home) ? '~' + dir.slice(home.length) : dir;
}

// Section-for-section faithful to Claude Code's welcome (v2.1.219): the creature sits to
// the LEFT of a three-line title block (name+version / model+plan / cwd); then a one-line
// warning, then a one-line tip. No outer box, no invented panels. The tells stay — the
// $0.00 warning, the bandit hat, the confession in the footer.
export default function Welcome(): React.ReactElement {
  return (
    <Box flexDirection="column">
      <Box>
        <Box marginRight={2}>
          <Octopus />
        </Box>
        <Box flexDirection="column">
          <Text bold color={amber}>
            Fraude Code <Text dimColor>v{version}</Text>
          </Text>
          <Text dimColor>Faux 5 (∞ context) · Fraud Max</Text>
          <Text dimColor>{cwd()}</Text>
        </Box>
      </Box>
      <Box marginTop={1}>
        <Text>
          <Text color="#e8c020">⚠ </Text>
          0 MCP servers connected — {accomplices.join(', ')} wouldn&apos;t take the job{' '}
          <Text dimColor>· $0.00 spent</Text>
        </Text>
      </Box>
      <Box marginTop={1}>
        <Text>
          {' '}Tackle your toughest work with Faux 5 — it can&apos;t think, but the tools
          are real.
        </Text>
      </Box>
    </Box>
  );
}
