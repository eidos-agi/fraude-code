// fraude-code — a TUI that looks and acts like Claude Code, except it never calls a model.
// The tools are real (files really get read, edits really happen, bash really runs); only
// the "thinking" is a costume. Zero tokens, zero dollars, one bandana.
package main

import (
	"bufio"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"time"

	"github.com/eidos-agi/fraude-code/internal/mock"
)

const version = "0.1.0"

// The suspect. A Claude-ish creature in a hamburglar bandana.
const banner = `
   ╭────────────────────────────────╮
   │        ·  ✷        ✷  ·         │
   │         ╭──────────────╮        │
   │         │ ▟▛████████▜▙  │       │
   │         │  ▀▀      ▀▀   │       │   fraude-code
   │         │   ▂    ▂      │       │   the AI is a costume;
   │         │    ╲__╱       │       │   the work is real.
   │         ╰──────────────╯        │
   │      "wanted for impersonating  │
   │       a language model"         │
   ╰────────────────────────────────╯
`

func main() {
	if len(os.Args) > 1 && (os.Args[1] == "version" || os.Args[1] == "--version" || os.Args[1] == "-v") {
		fmt.Println("fraude-code", version)
		return
	}
	fmt.Print(banner)
	fmt.Printf("  fraude-code v%s · $0.00 spent so far · type /help\n\n", version)

	in := bufio.NewScanner(os.Stdin)
	in.Buffer(make([]byte, 0, 1024*1024), 8*1024*1024)
	for {
		fmt.Print("❯ ")
		if !in.Scan() {
			fmt.Println("\n  (the fraud rests. $0.00 spent. bye!)")
			return
		}
		line := in.Text()
		act := mock.Interpret(line)
		if act.Kind == mock.Quit {
			fmt.Println("  (the fraud rests. $0.00 spent. bye!)")
			return
		}
		flourish(line)
		run(act, line)
		fmt.Println()
	}
}

// flourish is the costume: a fake think, so it feels like the real thing.
func flourish(seed string) {
	fmt.Println("  " + mock.Thinking(seed))
	time.Sleep(180 * time.Millisecond)
}

func run(a mock.Action, seed string) {
	switch a.Kind {
	case mock.Help:
		help()
	case mock.Read:
		fmt.Println("  " + mock.Doing(seed))
		readFile(a.Arg)
	case mock.List:
		fmt.Println("  " + mock.Doing(seed))
		listDir(a.Arg)
	case mock.Bash:
		fmt.Println("  " + mock.Doing(seed))
		bash(a.Arg)
	case mock.Write:
		fmt.Println("  " + mock.Doing(seed))
		writeFile(a.Arg, a.Body)
	default: // Chat
		fmt.Println("  " + mock.Chatter(seed))
	}
}

func help() {
	fmt.Print(`  fraude-code does the real work of Claude Code, minus the brain:

    read <file>            show a file (real)
    ls [dir]               list a directory (real)
    run <cmd>   or  ! <cmd>  run a shell command (real)
    write <file>: <text>   create/overwrite a file (real)
    /help                  this
    /exit                  leave

  Anything else, it'll shrug cutely — it can't actually think.
`)
}

func readFile(path string) {
	b, err := os.ReadFile(path)
	if err != nil {
		oops(err)
		return
	}
	fmt.Printf("  ⎿ %s\n", path)
	for i, ln := range strings.Split(string(b), "\n") {
		fmt.Printf("  %4d  %s\n", i+1, ln)
	}
}

func listDir(dir string) {
	entries, err := os.ReadDir(dir)
	if err != nil {
		oops(err)
		return
	}
	fmt.Printf("  ⎿ %s\n", filepath.Clean(dir))
	for _, e := range entries {
		suffix := ""
		if e.IsDir() {
			suffix = "/"
		}
		fmt.Printf("    %s%s\n", e.Name(), suffix)
	}
}

func bash(cmd string) {
	// bash -c is deliberate and not an injection vector here: this IS the shell tool, the
	// user is typing their own command into their own REPL (pipes/globs must work). Same
	// trust model as Claude Code's Bash tool — the operator and the "attacker" are one
	// person on their own machine. ponytail: no allowlist; it's a shell, on purpose.
	fmt.Printf("  ⎿ $ %s\n", cmd)
	out, err := exec.Command("bash", "-c", cmd).CombinedOutput() //nolint:gosec

	for _, ln := range strings.Split(strings.TrimRight(string(out), "\n"), "\n") {
		if ln != "" {
			fmt.Printf("    %s\n", ln)
		}
	}
	if err != nil {
		fmt.Printf("    (exit: %v)\n", err)
	}
}

func writeFile(path, body string) {
	if err := os.WriteFile(path, []byte(body), 0o644); err != nil {
		oops(err)
		return
	}
	fmt.Printf("  ⎿ wrote %d bytes to %s\n", len(body), path)
}

func oops(err error) {
	fmt.Printf("  ✗ %v (even frauds have limits)\n", err)
}
