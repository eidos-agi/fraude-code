import React, {useState} from 'react';
import {Box, Text, Static, useApp} from 'ink';
import TextInput from 'ink-text-input';
import Welcome, {amber} from './welcome.js';
import {interpret, thinking, doing, chat} from './mock.js';
import {runAction} from './tools.js';

interface Entry {
  prompt: string;
  think: string;
  out: string;
}
type Item = {kind: 'welcome'} | ({kind: 'entry'} & Entry);

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

  // Welcome + every completed command are permanent — render them ONCE via <Static> so Ink
  // never repaints them. That kills the full-frame flicker; only the live region below
  // (effort tag + input + footer) redraws on a keystroke.
  const items: Item[] = [
    {kind: 'welcome'},
    ...log.map((e) => ({kind: 'entry' as const, ...e})),
  ];

  return (
    <>
      <Static items={items}>
        {(item, i) =>
          item.kind === 'welcome' ? (
            <Welcome key="welcome" />
          ) : (
            <Box key={i} flexDirection="column" marginTop={1}>
              <Text>
                <Text color={amber}>❯ </Text>
                {item.prompt}
              </Text>
              <Text dimColor>  {item.think}</Text>
              {item.out ? <Text>{item.out}</Text> : null}
            </Box>
          )
        }
      </Static>
      <Box flexDirection="column">
        <Box justifyContent="flex-end" marginTop={1}>
          <Text color="#8a8a8a">● maximum · /effort</Text>
        </Box>
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
    </>
  );
}
