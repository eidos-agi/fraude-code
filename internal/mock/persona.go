package mock

import "hash/fnv"

// The fraud has a personality: eager, cutesy, and cheerfully honest that it isn't thinking.
// Lines are picked deterministically from the input so the same request always reads the
// same way (and so it's testable).

var thinking = []string{
	"✷ frauding…",
	"✷ pretending to think…",
	"✷ consulting the void (free of charge)…",
	"✷ vibing, not computing…",
}

var doing = []string{
	"Sure thing! (no thoughts, only actions)",
	"On it — for real this time, that part's not fake:",
	"Absolutely. The AI is a costume; the work is real:",
	"You got it. Zero tokens spent, promise:",
}

var chat = []string{
	"I'm a fraud, remember? I can read, write, and run things — but I can't actually think. Try `read <file>`, `run <cmd>`, `write <file>: <text>`, or `/help`.",
	"That one needs a real brain, and mine's a bandana. Give me a file to read or a command to run and I'll do it for real.",
	"I'd love to reason about that, but I'm strictly a mime of Claude. Real tools only — `/help` for the list.",
}

// pick chooses a line deterministically from the input.
func pick(lines []string, seed string) string {
	h := fnv.New32a()
	_, _ = h.Write([]byte(seed))
	return lines[int(h.Sum32())%len(lines)]
}

func Thinking(seed string) string { return pick(thinking, seed) }
func Doing(seed string) string    { return pick(doing, seed) }
func Chatter(seed string) string  { return pick(chat, seed) }
