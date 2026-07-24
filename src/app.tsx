import React, {useState} from 'react';
import {Box, Text, useApp} from 'ink';
import TextInput from 'ink-text-input';
import Welcome, {amber} from './welcome.js';
import {interpret, thinking, doing, chat} from './mock.js';
import {runAction} from './tools.js';

interface Entry {
  prompt: string;
  think: string;
  out: string;
}

export default function App(): React.ReactElement {
  const {exit} = useApp();
  const [value, setValue] = useState('');
  const [log, setLog] = useState<Entry[]>([]);

  const onSubmit = (raw: string) => {
    const line = raw.trim();
    setValue('');
    if (!line) return;
    const act = interpret(line);
    if (act.kind === 'quit') {
      exit();
      return;
    }
    if (act.kind === 'chat') {
      setLog((p) => [...p, {prompt: line, think: thinking(line), out: '  ' + chat(line)}]);
      return;
    }
    setLog((p) => [
      ...p,
      {prompt: line, think: `${thinking(line)}  ${doing(line)}`, out: runAction(act)},
    ]);
  };

  return (
    <Box flexDirection="column">
      <Welcome />
      {log.map((e, i) => (
        <Box key={i} flexDirection="column" marginTop={1}>
          <Text>
            <Text color={amber}>❯ </Text>
            {e.prompt}
          </Text>
          <Text dimColor>  {e.think}</Text>
          {e.out ? <Text>{e.out}</Text> : null}
        </Box>
      ))}
      {/* effort tag, bottom-right, like Claude's "● high · /effort" */}
      <Box justifyContent="flex-end" marginTop={1}>
        <Text color="#8a8a8a">● maximum · /effort</Text>
      </Box>
      {/* input framed by top + bottom rules (full width), like Claude — not a rounded box */}
      <Box
        borderStyle="single"
        borderColor={amber}
        borderLeft={false}
        borderRight={false}
      >
        <Text color={amber}>❯ </Text>
        <TextInput
          value={value}
          onChange={setValue}
          onSubmit={onSubmit}
          placeholder="read a file, run a command, or just say hi…"
        />
      </Box>
      <Text dimColor>
        {'  '}
        <Text color={amber}>⏵⏵ </Text>
        auto mode on (shift+tab to cycle) · ← for agents · wanted for impersonating a
        language model
      </Text>
    </Box>
  );
}
