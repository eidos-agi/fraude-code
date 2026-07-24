// Package mock is the fraud: it fakes the one thing Claude Code pays a model for —
// understanding what you asked — with cheap deterministic pattern-matching, then runs the
// REAL tool. Files really get read, edits really happen, bash really runs. Only the
// "thinking" is a costume.
package mock

import (
	"regexp"
	"strings"
)

// Kind is what fraude decided you want. Every kind but Chat maps to a real action.
type Kind int

const (
	Chat  Kind = iota // no tool matched — say something cute, do nothing
	Read              // show a file
	List              // list a directory
	Bash              // run a shell command for real
	Write             // create/overwrite a file
	Help
	Quit
)

// Action is the fraud's "decision": a tool and its argument. main.go executes it for real.
type Action struct {
	Kind Kind
	Arg  string // path, dir, or command
	Body string // for Write: the file contents
}

var (
	reRead  = regexp.MustCompile(`(?i)^\s*(?:read|show|open|cat|view)\s+(.+?)\s*$`)
	reList  = regexp.MustCompile(`(?i)^\s*(?:ls|list|dir)\s*(.*?)\s*$`)
	reBang  = regexp.MustCompile(`^\s*!\s*(.+?)\s*$`)
	reBash  = regexp.MustCompile(`(?i)^\s*(?:run|bash|exec|sh)\s+(.+?)\s*$`)
	reWrite = regexp.MustCompile(`(?is)^\s*(?:write|create|save)\s+(\S+?)\s*(?::|with|=)\s*(.*)$`)
)

// Interpret is the whole "brain". Deterministic, free, and honest about being a fraud:
// the same input always yields the same action, so it is trivially testable.
func Interpret(input string) Action {
	t := strings.TrimSpace(input)
	switch {
	case t == "":
		return Action{Kind: Chat}
	case t == "/help" || t == "help" || t == "?":
		return Action{Kind: Help}
	case t == "/exit" || t == "/quit" || t == "exit" || t == "quit":
		return Action{Kind: Quit}
	}

	if m := reWrite.FindStringSubmatch(t); m != nil {
		return Action{Kind: Write, Arg: m[1], Body: m[2]}
	}
	if m := reBang.FindStringSubmatch(t); m != nil {
		return Action{Kind: Bash, Arg: m[1]}
	}
	if m := reBash.FindStringSubmatch(t); m != nil {
		return Action{Kind: Bash, Arg: m[1]}
	}
	if m := reRead.FindStringSubmatch(t); m != nil {
		return Action{Kind: Read, Arg: m[1]}
	}
	if m := reList.FindStringSubmatch(t); m != nil {
		dir := m[1]
		if dir == "" {
			dir = "."
		}
		return Action{Kind: List, Arg: dir}
	}
	return Action{Kind: Chat, Arg: t}
}
