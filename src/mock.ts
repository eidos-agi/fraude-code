// The costume. No model is ever called — regexes map your words to a real action, and a
// hash of your input picks a cutesy line so it *feels* like something is thinking. It isn't.

export type Kind = 'chat' | 'read' | 'list' | 'bash' | 'write' | 'help' | 'quit';
export interface Action {
  kind: Kind;
  arg: string;
  body: string;
}

export function interpret(input: string): Action {
  const s = input.trim();
  const none = (kind: Kind): Action => ({kind, arg: '', body: ''});

  if (/^\/?(exit|quit|q|bye)$/i.test(s)) return none('quit');
  if (/^\/?(help|\?|h)$/i.test(s)) return none('help');

  let m: RegExpMatchArray | null;
  // write <file>: <text>   (create/overwrite — real)
  if ((m = s.match(/^(?:write|create|save)\s+(\S+)\s*:\s*([\s\S]*)$/i))) {
    return {kind: 'write', arg: m[1], body: m[2]};
  }
  // read <file>
  if ((m = s.match(/^(?:read|show|cat|open|view)\s+(.+)$/i))) {
    return {kind: 'read', arg: m[1].trim(), body: ''};
  }
  // ls [dir]
  if ((m = s.match(/^(?:ls|list|dir|tree)\s*(.*)$/i))) {
    return {kind: 'list', arg: m[1].trim() || '.', body: ''};
  }
  // run <cmd> | ! <cmd> | $ <cmd>
  if ((m = s.match(/^(?:!|\$|run|bash|sh|exec)\s+([\s\S]+)$/i))) {
    return {kind: 'bash', arg: m[1].trim(), body: ''};
  }
  return {kind: 'chat', arg: s, body: ''};
}

// Deterministic pick: same input -> same line, so it reads as a personality, not RNG.
function pick(list: string[], seed: string): string {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return list[Math.abs(h) % list.length];
}

const thoughts = [
  'squinting at it really hard…',
  'pretending to reason…',
  'consulting my imaginary weights…',
  'rummaging through the costume box…',
  'thinking* (*grepping)…',
  'putting on my serious face…',
];
const doings = [
  'okay, actually doing it now',
  'no model, all elbow grease',
  'the real part starts here',
  'rolling up my sleeves',
];
const chatter = [
  "I can't actually think — but I can read, list, run, and write for real. Try `ls` or `read <file>`.",
  "That's above my pay grade (my pay grade is $0.00). I do tools, not thoughts.",
  '*shrugs cutely in bandana* — give me a `read`, `ls`, `run`, or `write` and watch it really happen.',
  "No brain in here, just a hamburglar with a shell. `run <cmd>` and I'll prove it.",
];

export const thinking = (seed: string) => pick(thoughts, seed);
export const doing = (seed: string) => pick(doings, seed);
export const chat = (seed: string) => pick(chatter, seed);
