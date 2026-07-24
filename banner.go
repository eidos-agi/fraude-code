package main

import (
	"os"
	"os/exec"
	"strconv"
	"strings"
	"unicode/utf8"
)

// This file makes fraude's welcome a pixel-faithful reskin of Claude Code's: a full-width
// rounded box with the title on the border, two columns split by a divider, the amber
// accent, the status line, the effort tag, and the auto-mode footer. The tells stay in
// (bandana, $0.00, "impersonating a language model") — a perfect forgery that confesses.

const (
	reset  = "\033[0m"
	bold   = "\033[1m"
	dim    = "\033[2m"
	italic = "\033[3m"
	amber  = "\033[38;5;214m" // Claude's welcome accent
	yellow = "\033[38;5;220m"
	gray   = "\033[38;5;245m"
)

// The suspect, in a bandana. Width-1 runes only, so columns stay aligned.
var critter = []string{
	"▟▛████████▜▙",
	" ▀▀      ▀▀ ",
	"  ▂    ▂    ",
	"   ╲__╱     ",
}

// termWidth is zero-dependency: ask the terminal, fall back sanely off a tty (pipes/tests).
func termWidth() int {
	if c := os.Getenv("COLUMNS"); c != "" {
		if n, err := strconv.Atoi(strings.TrimSpace(c)); err == nil && n >= 40 {
			return capw(n)
		}
	}
	if out, err := exec.Command("tput", "cols").Output(); err == nil {
		if n, err := strconv.Atoi(strings.TrimSpace(string(out))); err == nil && n >= 40 {
			return capw(n)
		}
	}
	return 92
}

func capw(n int) int {
	if n > 110 {
		return 110
	}
	return n
}

func vlen(s string) int { return utf8.RuneCountInString(stripANSI(s)) }

func stripANSI(s string) string {
	var b strings.Builder
	inEsc := false
	for _, r := range s {
		switch {
		case r == '\033':
			inEsc = true
		case inEsc && (r == 'm'):
			inEsc = false
		case !inEsc:
			b.WriteRune(r)
		}
	}
	return b.String()
}

func padRight(s string, w int) string {
	if n := vlen(s); n < w {
		return s + strings.Repeat(" ", w-n)
	}
	return s
}

func center(s string, w int) string {
	n := vlen(s)
	if n >= w {
		return s
	}
	left := (w - n) / 2
	return strings.Repeat(" ", left) + s + strings.Repeat(" ", w-n-left)
}

// renderWelcome returns the whole Claude-identical welcome as one string.
func renderWelcome() string {
	w := termWidth()
	user := os.Getenv("USER")
	if user == "" {
		user = "friend"
	}
	cwd, _ := os.Getwd()
	if home := os.Getenv("HOME"); home != "" && strings.HasPrefix(cwd, home) {
		cwd = "~" + cwd[len(home):]
	}

	// Column geometry: outer │ + left(Lw) + divider │ + right(Rw) + outer │ == w.
	inner := w - 3
	Lw := inner * 38 / 100
	Rw := inner - Lw

	left := []string{
		bold + center("Welcome back "+user+"!", Lw-2) + reset,
		"",
	}
	for _, c := range critter {
		left = append(left, amber+center(c, Lw-2)+reset)
	}
	left = append(left,
		"",
		dim+center("Fraude "+version+" (∞ context) ·", Lw-2)+reset,
		dim+center("Fraud Max · "+user+"'s Heist", Lw-2)+reset,
		dim+center(cwd, Lw-2)+reset,
	)

	right := []string{
		amber + bold + "Tips for getting started" + reset,
		"read <file> really reads it; run <cmd> really runs it",
		"",
		amber + bold + "What's new" + reset,
		"Nothing — there is no model to update",
		"Still $0.00. Still a fraud.",
		"Now with a bandana.",
		dim + italic + "/release-notes (there are none)" + reset,
	}

	rows := len(left)
	if len(right) > rows {
		rows = len(right)
	}

	var b strings.Builder
	// Top border with the title notched in, like Claude's.
	title := amber + bold + "Fraude Code" + reset + amber + " v" + version + reset
	head := "╭─ " + title + " "
	fill := w - vlen(head) - 1
	if fill < 0 {
		fill = 0
	}
	b.WriteString(amber + "╭─ " + reset + title + amber + " " + strings.Repeat("─", fill) + "╮" + reset + "\n")

	for i := 0; i < rows; i++ {
		l, r := "", ""
		if i < len(left) {
			l = left[i]
		}
		if i < len(right) {
			r = right[i]
		}
		b.WriteString(amber + "│" + reset + " " + padRight(l, Lw-1) +
			amber + "│" + reset + " " + padRight(r, Rw-1) +
			amber + "│" + reset + "\n")
	}
	b.WriteString(amber + "╰" + strings.Repeat("─", w-2) + "╯" + reset + "\n")

	// Status line (the tell: we call zero models).
	b.WriteString(yellow + "⚠ " + reset + "0 MCP servers connected — we don't call any " +
		dim + "· $0.00 spent" + reset + "\n\n")

	// Effort tag, bottom-right, like Claude's "● high · /effort".
	effort := gray + "● maximum " + reset + dim + "· /effort" + reset
	pad := w - vlen(effort)
	if pad < 0 {
		pad = 0
	}
	b.WriteString(strings.Repeat(" ", pad) + effort + "\n")
	// A live bordered input box (top rule, ❯, bottom rule) that wraps the cursor needs a
	// real TUI loop — that's a research item (bubbletea migration), tracked in the roadmap.
	return b.String()
}

// footerLine is printed under the input, like Claude's auto-mode footer — with the
// confession appended.
func footerLine() string {
	return "  " + amber + "⏵⏵ " + reset + bold + "auto mode on " + reset +
		dim + "(shift+tab to cycle) · ← for agents · wanted for impersonating a language model" + reset
}
