import React from 'react';
import os from 'node:os';
import {Box, Text} from 'ink';
import Octopus from './octopus.js';

export const version = '0.3.0';
export const amber = '#e8964f';

function cwd(): string {
  const dir = process.cwd();
  const home = os.homedir();
  return dir.startsWith(home) ? '~' + dir.slice(home.length) : dir;
}

// A faithful reskin of Claude Code's welcome: rounded amber box, a bold greeting, the
// bandit octopus, an identity line and cwd on the left; tips + "what's new" on the right,
// split by a vertical divider. The tells stay in — $0.00, the bandana, the confession.
export default function Welcome(): React.ReactElement {
  const user = os.userInfo().username || 'friend';
  return (
    <Box flexDirection="column">
      <Box
        borderStyle="round"
        borderColor={amber}
        paddingX={1}
        flexDirection="column"
      >
        <Box justifyContent="center">
          <Text bold color={amber}>
            Fraude Code <Text dimColor>v{version}</Text>
          </Text>
        </Box>
        <Box marginTop={1}>
          <Box
            flexDirection="column"
            width="42%"
            alignItems="center"
            paddingRight={1}
          >
            <Text bold>Welcome back {user}!</Text>
            <Box marginY={1}>
              <Octopus />
            </Box>
            <Text dimColor>Fraude {version} (∞ context)</Text>
            <Text dimColor>Fraud Max · {user}'s Heist</Text>
            <Text dimColor>{cwd()}</Text>
          </Box>
          <Box
            flexDirection="column"
            flexGrow={1}
            paddingLeft={1}
            borderStyle="single"
            borderColor={amber}
            borderTop={false}
            borderRight={false}
            borderBottom={false}
          >
            <Text bold color={amber}>
              Tips for getting started
            </Text>
            <Text>{'read <file> really reads it; run <cmd> really runs it'}</Text>
            <Box marginTop={1}>
              <Text bold color={amber}>
                What's new
              </Text>
            </Box>
            <Text>Nothing — there is no model to update</Text>
            <Text>Still $0.00. Still a fraud.</Text>
            <Text>Now with a bandana.</Text>
            <Text dimColor italic>
              /release-notes (there are none)
            </Text>
          </Box>
        </Box>
      </Box>
      <Text>
        <Text color="#e8c020">⚠ </Text>
        0 MCP servers connected — we don&apos;t call any{' '}
        <Text dimColor>· $0.00 spent</Text>
      </Text>
      <Box justifyContent="flex-end">
        <Text color="#8a8a8a">● maximum · /effort</Text>
      </Box>
    </Box>
  );
}
