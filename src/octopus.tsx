import React from 'react';
import {Box, Text} from 'ink';

// The suspect: Claude's octopus, but wanted. Colour pixel art, not one-colour ASCII.
// Each text cell is a half-block ▄ carrying TWO pixels — backgroundColor is the pixel
// above, color is the pixel below — so one character row draws two pixel rows. That's
// how you get crisp, cute terminal art (the trick Ink-based TUIs lean on).
const palette: Record<string, string> = {
  o: '#e8964f', // body — Claude orange
  '.': '#b06030', // body shadow / tentacle
  x: '#1a1820', // bandit mask band
  e: '#f5f5f8', // eye glint
  h: '#262430', // robber hat
  b: '#4a4856', // hat band
};

// One char per pixel. 'o' body, '.' shadow, 'x' mask, 'e' eye, 'h' hat, 'b' hat band,
// space = transparent. A wide-brim robber hat (crown+band+brim) sits over a rounded
// mantle; big googly eyes with a downward pupil (cute) inside a dark bandit mask (villain).
const grid = [
  '     hhhhhh     ',
  '     hhhhhh     ',
  '    hhhhhhhh    ',
  '   bbbbbbbbbb   ',
  ' hhhhhhhhhhhhhh ',
  '   oooooooooo   ',
  '  oooooooooooo  ',
  '  oooooooooooooo',
  '  oooooooooooooo',
  '  xxxxxxxxxxxxxx',
  '  xxeeexxxxeeexx',
  '  xxexexxxxexexx',
  '  xxeeexxxxeeexx',
  '  xxxxxxxxxxxxxx',
  '  oooooooooooooo',
  '  oooooooooooooo',
  '   o.oo..oo.o.  ',
  '   o o  oo  o o ',
  '  o  o  oo  o  o',
  '  .  .  ..  .  .',
];

export default function Octopus(): React.ReactElement {
  const width = Math.max(...grid.map((r) => r.length));
  const rows: React.ReactElement[] = [];
  for (let r = 0; r + 1 < grid.length; r += 2) {
    const top = grid[r];
    const bot = grid[r + 1];
    const cells: React.ReactElement[] = [];
    for (let i = 0; i < width; i++) {
      const tc = palette[top[i] ?? ' '];
      const bc = palette[bot[i] ?? ' '];
      if (tc && bc) {
        cells.push(
          <Text key={i} color={bc} backgroundColor={tc}>
            ▄
          </Text>,
        );
      } else if (tc) {
        cells.push(
          <Text key={i} color={tc}>
            ▀
          </Text>,
        );
      } else if (bc) {
        cells.push(
          <Text key={i} color={bc}>
            ▄
          </Text>,
        );
      } else {
        cells.push(<Text key={i}> </Text>);
      }
    }
    rows.push(<Text key={r}>{cells}</Text>);
  }
  return (
    <Box flexDirection="column" alignItems="center">
      {rows}
    </Box>
  );
}
