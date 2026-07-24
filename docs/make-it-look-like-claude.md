**v0.3.0 — PIVOTED TO INK (React for terminals), Claude Code's actual stack.** The Go
version is retired (in git history at v0.2.0). Ink gives the box, two columns, the live
bordered input, and — the reason for the pivot — a *colour half-block pixel-art octopus*
(cute googly eyes + dark bandit mask) that matches Claude's Ink-rendered creature. The
remaining v0.2 items (live input box, boxing) fall out of Ink for free. Source: `src/`
(`app.tsx`, `welcome.tsx`, `octopus.tsx`, `mock.ts`, `tools.ts`). Left to do: narrow-term
collapse (flex should mostly handle it) and the optional exact-version gag.

**v0.2.0 (Go, retired): box, columns, theme, status, effort, footer shipped.**

# Making fraude's welcome a pixel-faithful Claude Code reskin

The gag only lands if, at a glance, `fraude` **is** Claude Code — and only the fine print
gives it away. Today it's a cute custom box. This is the gap, measured from side-by-side VHS
captures of both real welcome screens (2026-07-24), and the to-do list to close it.

## What Claude Code's welcome has (that fraude doesn't)

| Element | Claude Code | fraude today |
|---|---|---|
| Container | one **full-width** rounded box, title on the top border (`─ Claude Code v2.1.218 ─`) | small centered box, no title on border |
| Colour | orange/amber accent (border + headings) | monochrome |
| Layout | **two columns** with a vertical divider | single small box + text floating to its right |
| Greeting | **"Welcome back Daniel!"** (bold, centered) | none |
| Identity line | `Opus 4.8 (1M context) · Claude Max · <email>'s Organization` | `the AI is a costume` |
| cwd | shown, centered under identity | not shown |
| Right panel | "Tips for getting started" + "What's new" + `/release-notes` | none |
| Status line | `⚠ 1 MCP server needs authentication · run /mcp` | none |
| Effort tag | `● high · /effort` bottom-right | none |
| Input | wrapped in a bordered box with `❯` | bare `❯` |
| Footer | `⏵⏵ auto mode on (shift+tab to cycle) · ← for agents` | none |

The **one difference to KEEP**: fraude's critter wears the hamburglar bandana. That's the
tell. Everything else should converge.

## To-do — make it identical (reskinned)

- [x] **Full-width rounded box** with the title on the top border: `─ Fraude Code v0.1.0 ─`.
      Responsive to terminal width, like Claude's.
- [x] **Orange/amber theme** via ANSI (border + section headings) to match Claude's accent.
- [x] **Two-column interior** with a vertical divider.
- [ ] Left column: **"Welcome back {$USER}!"** (bold, centered), the **bandana critter**
      (keep the mask), then the identity line and the cwd.
- [x] **Identity line, reskinned:** `Fraude 0.1.0 (∞ context) · Fraud Max · {user}'s Heist`.
- [ ] Right column: **"Tips for getting started"** + one joke tip; a divider; **"What's new"**
      + 3 joke bullets; `/release-notes (there are none)`.
- [x] **Status line:** `⚠ 0 MCP servers connected — we don't call any · $0.00 spent`.
- [ ] **`● maximum · /effort`** bottom-right (theatrical).
- [ ] **Box the input line** (top + bottom rules) with `❯`.
- [ ] **Footer:** `⏵⏵ auto mode on (shift+tab to cycle) · ← for agents`.
- [ ] Handle narrow terminals (wrap/collapse the two columns) so it never looks broken.
- [ ] (optional gag) report the version as Claude's exact build (`v2.1.218`) to fully
      impersonate — the splash art already does this.

## The tell (never remove)

Bandana on the critter, `$0.00 spent`, and "wanted for impersonating a language model"
somewhere. The joke is a perfect forgery that confesses in the footnotes.
