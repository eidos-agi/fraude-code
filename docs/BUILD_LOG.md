# Build log — how fraude-code was made

A record of how this was built, so the next person (or the next AI) doesn't have to
reverse-engineer the intent.

## The idea

A TUI that **looks and acts like Claude Code but never calls a model.** The insight: Claude
Code spends money on exactly one thing — *understanding what you asked.* Everything else
(reading files, editing, running commands) is plain mechanical I/O that costs nothing. So
fake only the understanding, keep the tools real. The result is genuinely useful (a zero-cost
local file/shell REPL) and a joke (a bandit impersonating a language model).

## Architecture

Three small pieces, deliberately:

- **`internal/mock/interpret.go`** — the entire "brain." `Interpret(input) Action` maps
  plain-ish text to a real action with a handful of regexes. Deterministic (same input →
  same action), so it's trivially unit-tested and never surprises. This is the *only* faked
  part.
- **`internal/mock/persona.go`** — the costume. Cutesy narration lines, picked by a hash of
  the input so a given request always reads the same way.
- **`main.go`** — a REPL that renders the banner and **executes the action for real**:
  `os.ReadFile`, `os.ReadDir`, `os.WriteFile`, and `exec.Command("bash","-c", …)`. The
  `bash -c` is intentional — it *is* the shell tool; the operator types their own command
  into their own REPL, the same trust model as Claude Code's Bash tool.

Pure standard library, `CGO_ENABLED=0`, single static binary. Language choice is Go by house
rule (typed + compiled + a build step; never Python or plain JS for new tools).

## Proving it works

`internal/mock` is unit-tested (parsing + determinism). The real proof is the smoke test:
drive the REPL non-interactively and confirm the tools *actually* touched disk —

```
write /tmp/x: hello   → wrote 18 bytes   (verified by cat)
read /tmp/x           → hello
run echo $((6*7))     → real shell 42
what is love          → *shrugs* (it can't think — that's the joke)
```

## Making it look like the real thing

Compared fraude's welcome to Claude Code's, both captured with **charm.land VHS** (real PTY,
so the TUI renders fully):

```
vhs fraude.tape   # Type "fraude"  → Screenshot the welcome
vhs claude.tape   # Type "claude"  → Screenshot, then Ctrl+C (no prompt sent = no tokens)
```

VHS 0.11 gotchas paid so the next person doesn't: **quote every path** (`Output "/tmp/x.gif"`
— an unquoted `/tmp/...` is parsed as separate commands), `Output` only does gif/webm/mp4,
and `Screenshot "<path>.png"` is the way to grab a still frame.

The still-frame diff produced `docs/make-it-look-like-claude.md` — the concrete list of what
still isn't identical (full-width box, two columns, orange theme, the status/effort/footer
lines) and how to close it.

## Distribution

- `make install` puts `fraude` and `fraude-code` on `~/.local/bin` so you can just type
  `fraude`.
- Public on GitHub (`eidos-agi/fraude-code`). MIT. The mascot and splash art live in
  `assets/`.

## The one rule

The forgery must confess in the footnotes: the bandana stays on the critter, `$0.00 spent`
stays on the banner, and "wanted for impersonating a language model" stays somewhere. A
perfect fake that tells on itself.
