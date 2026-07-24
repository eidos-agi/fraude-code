// The work is real. These actually touch the filesystem and shell — the only fake part of
// fraude is the "understanding" upstream. Same trust model as Claude Code's tools: the
// operator is running their own commands in their own REPL.
import {readFileSync, readdirSync, writeFileSync} from 'node:fs';
import {execSync} from 'node:child_process';
import {Action} from './mock.js';

export function runAction(a: Action): string {
  try {
    switch (a.kind) {
      case 'read':
        return readFile(a.arg);
      case 'list':
        return listDir(a.arg);
      case 'bash':
        return bash(a.arg);
      case 'write':
        return writeFile(a.arg, a.body);
      case 'help':
        return help();
      default:
        return '';
    }
  } catch (err) {
    return `  ✗ ${(err as Error).message} (even frauds have limits)`;
  }
}

function readFile(path: string): string {
  const lines = readFileSync(path, 'utf8').split('\n');
  const body = lines
    .map((ln, i) => `  ${String(i + 1).padStart(4)}  ${ln}`)
    .join('\n');
  return `  ⎿ ${path}\n${body}`;
}

function listDir(dir: string): string {
  const entries = readdirSync(dir, {withFileTypes: true});
  const body = entries
    .map((e) => `    ${e.name}${e.isDirectory() ? '/' : ''}`)
    .join('\n');
  return `  ⎿ ${dir}\n${body}`;
}

function bash(cmd: string): string {
  // ponytail: no allowlist; it IS the shell tool, on purpose. The operator types their own
  // command into their own REPL — pipes and globs must work.
  let out = '';
  try {
    out = execSync(cmd, {encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe']});
  } catch (err) {
    const e = err as {stdout?: string; stderr?: string; status?: number};
    out = (e.stdout ?? '') + (e.stderr ?? '') + `\n    (exit: ${e.status ?? '?'})`;
  }
  const body = out
    .replace(/\n$/, '')
    .split('\n')
    .map((ln) => (ln ? `    ${ln}` : ''))
    .join('\n');
  return `  ⎿ $ ${cmd}\n${body}`;
}

function writeFile(path: string, body: string): string {
  writeFileSync(path, body);
  return `  ⎿ wrote ${Buffer.byteLength(body)} bytes to ${path}`;
}

function help(): string {
  return `  fraude does the real work of Claude Code, minus the brain:

    read <file>              show a file (real)
    ls [dir]                 list a directory (real)
    run <cmd>  /  ! <cmd>    run a shell command (real)
    write <file>: <text>     create/overwrite a file (real)
    /help                    this
    /exit                    leave

  Anything else, it shrugs cutely — it can't actually think.`;
}
