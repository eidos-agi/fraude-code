package mock

import "testing"

func TestInterpret(t *testing.T) {
	cases := []struct {
		in   string
		kind Kind
		arg  string
		body string
	}{
		{"read main.go", Read, "main.go", ""},
		{"show ./x/y.txt", Read, "./x/y.txt", ""},
		{"cat go.mod", Read, "go.mod", ""},
		{"ls", List, ".", ""},
		{"list internal", List, "internal", ""},
		{"run ls -la", Bash, "ls -la", ""},
		{"! echo hi", Bash, "echo hi", ""},
		{"bash git status", Bash, "git status", ""},
		{"write hi.txt: hello there", Write, "hi.txt", "hello there"},
		{"create note.md = # Title", Write, "note.md", "# Title"},
		{"/help", Help, "", ""},
		{"exit", Quit, "", ""},
		{"what is the meaning of life", Chat, "what is the meaning of life", ""},
		{"", Chat, "", ""},
	}
	for _, c := range cases {
		got := Interpret(c.in)
		if got.Kind != c.kind || got.Arg != c.arg || got.Body != c.body {
			t.Errorf("Interpret(%q) = {%d %q %q}, want {%d %q %q}",
				c.in, got.Kind, got.Arg, got.Body, c.kind, c.arg, c.body)
		}
	}
}

// The fraud must be deterministic — same input, same decision, always.
func TestInterpretDeterministic(t *testing.T) {
	for _, in := range []string{"read x", "run pwd", "hello", "write a: b"} {
		if Interpret(in) != Interpret(in) {
			t.Errorf("Interpret(%q) is not deterministic", in)
		}
	}
}
