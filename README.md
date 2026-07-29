# fraude-code

<p align="center">
  <img src="assets/welcome.gif" alt="Fraude Code welcome — a bandit-masked octopus in a robber hat beside the title, a status line naming its parody accomplices, and a boxed prompt; cleared to the top like the real thing" width="900"/>
</p>

A little TUI that **looks and acts like Claude Code** — reads files, edits them, runs
shell commands — except it **never calls a model.** The tools are 100% real. The
*thinking* is a costume: a bandit in a hamburglar bandana, cheerfully doing your bidding
for **$0.00**.

*fraude* — French for "fraud." Because it is one, and proud of it.

<p align="center">
  <img src="assets/fraude-use.gif" alt="fraude-code in use: it lists a directory, runs a piped shell command, writes a file and reads it back, then shrugs at a philosophical question — all for $0.00" width="820"/>
</p>

Above: real `ls`, a real piped shell command, a real `write` then `read` — and a cheerful
shrug when you ask it to *think*. The tools are genuine; only the brain is a costume.

## Why

- **Testing** — anything that supervises, drives, or reads coding-agent sessions (a fleet
  daemon, a terminal harness, a browser side-panel) needs *something in the tmux pane that
  behaves like Claude Code*. Driving a real one burns tokens on every nudge. fraude-code
  behaves like the real thing and spends nothing.
- **Demos** — show the shape of an agent workflow without an API key or a bill.
- **The bit** — it's funny. A wanted poster for a model impersonator.

## Install

Built with [Ink](https://github.com/vadimdemedes/ink) — React for terminals, the same
stack Claude Code itself uses. That's why the box, the live input, and the colour
pixel-art octopus render like the real thing.

```
npm install
npm run build
node dist/cli.js          # or: npm link, then `fraude`
```

## Use

It's a REPL. Type in plain-ish language; the fraud "understands" you with cheap
pattern-matching and then does the **real** thing:

```
❯ read src/app.tsx        # actually reads and prints the file
❯ ls src                  # actually lists the directory
❯ run npm test            # actually runs it (pipes/globs work — it's a real shell)
❯ ! git status            # ! is shorthand for run
❯ write hi.txt: hello     # actually writes the file
❯ what's the meaning of life?   # shrugs cutely — it can't think, remember
❯ /help
❯ /exit
```

### Headless — `fraude -p`, the `claude -p` shape for $0.00

The REPL needs a TTY. Schedulers, CI jobs, and container entrypoints don't have one — so
`-p` runs a prompt, prints real tool output, and exits. This is what lets fraude stand in
for `claude -p` in a harness you want to test **without spending tokens**:

```bash
fraude -p "ls ."
fraude -p "run uname -a"

# Each line that starts with a verb is one action, run in order. Lines that don't
# are continuations — so multi-line write bodies survive intact.
fraude -p "run df -h /data
write /data/report.md: # Status
all systems nominal"
```

`--output-format json` emits an envelope close enough to `claude -p --output-format json`
that harnesses reading `.result`, `.session_id`, or `.total_cost_usd` work unchanged:

```json
{ "type": "result", "subtype": "success", "is_error": false, "duration_ms": 5,
  "num_turns": 2, "result": "…", "session_id": "fraude-ms5ik74f", "total_cost_usd": 0 }
```

Exit code is **0** on success, **1** on failure. One deliberate difference from the REPL:
an instruction fraude can't map to a tool is a **hard error**, not a cute shrug — a
scheduler must never read "no brain" as a successful run.

## What's real vs. fake

| Real (it does this) | Fake (it fakes this) |
|---|---|
| reading, listing, writing files | understanding your intent (regex, not a model) |
| running shell commands | the "✷ frauding…" thinking spinner |
| the file contents, the command output | the eager little personality |

Everything that touches your machine is genuine. The only thing missing is the part that
costs money — which is the whole point.

## Not this

Not a jailbreak, not a model, not a wrapper around one. There is no API key field because
there is no API. If it ever tries to charge you, it's not fraude-code — *that* would be
the real fraud.

Bugs → Linear team `Eidos AGI`, project `Fraude Code` (see `.bugs.json`).

MIT licensed. Impersonate responsibly.

## 🎭 The Fraude family

- **[fraude-code](https://github.com/eidos-agi/fraude-code)** — this: a Claude Code look/act-alike that never calls a model.
- **[fraude-os](https://github.com/eidos-agi/fraude-os)** — a parody desktop (Chrime/Gfail/Schemes/Extort) where every GUI action is a WebMCP tool.
- **[chrime](https://github.com/eidos-agi/chrime)** — a browser built *for AI agents* (own the engine, DOM-first). The most real of the bunch.

The brand is a costume; the work is real.
