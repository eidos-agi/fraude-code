// Headless mode — the `claude -p` shape, minus the brain. One prompt in, real tool
// output out, process exits. This is what lets fraude stand in for `claude -p` inside
// schedulers, CI, and any harness that can't allocate a TTY for the Ink REPL.
import {interpret} from './mock.js';
import {runAction} from './tools.js';

// A line starts a NEW statement only if it opens with a verb fraude knows. Anything else
// is a continuation of the previous body — which is what keeps multi-line
// `write f.md: ...` bodies intact instead of shredding them one line per action.
const VERB =
  /^(?:write|create|save|read|show|cat|open|view|ls|list|dir|tree|run|bash|sh|exec|!|\$|\/?(?:help|exit|quit|q|bye|\?))\b/i;

export function splitStatements(prompt: string): string[] {
  const groups: string[] = [];
  for (const line of prompt.split('\n')) {
    if (groups.length === 0 || VERB.test(line.trim())) {
      if (line.trim()) groups.push(line);
    } else {
      groups[groups.length - 1] += '\n' + line;
    }
  }
  return groups;
}

export interface HeadlessResult {
  text: string;
  isError: boolean;
  turns: number;
}

export function runPrompt(prompt: string): HeadlessResult {
  const statements = splitStatements(prompt);
  if (statements.length === 0) {
    return {text: '  ✗ empty prompt', isError: true, turns: 0};
  }

  const out: string[] = [];
  let isError = false;
  let turns = 0;

  for (const statement of statements) {
    const action = interpret(statement);
    if (action.kind === 'quit') break;
    turns++;

    // In the REPL an unrecognised line gets a cute shrug. Headless, that would be a
    // silent no-op the caller mistakes for success — so it's a hard failure instead.
    if (action.kind === 'chat') {
      out.push(`  ✗ fraude has no brain — not a command: ${statement.split('\n')[0]}`);
      isError = true;
      continue;
    }

    const result = runAction(action);
    out.push(result);
    if (result.includes('✗')) isError = true;
  }

  return {text: out.join('\n'), isError, turns};
}

// Mirrors `claude -p --output-format json` closely enough that harnesses reading
// .result / .session_id / .total_cost_usd work unchanged. The cost is always 0 —
// that is the entire point of this program.
export function jsonEnvelope(r: HeadlessResult, durationMs: number) {
  return {
    type: 'result',
    subtype: r.isError ? 'error' : 'success',
    is_error: r.isError,
    duration_ms: durationMs,
    num_turns: r.turns,
    result: r.text,
    session_id: `fraude-${Date.now().toString(36)}`,
    total_cost_usd: 0,
  };
}
