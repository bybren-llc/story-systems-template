# Session Memory

Persistent, cross-session state so you and your AI team can **resume where you left off** —
following Anthropic's "effective harnesses for long-running agents" pattern, adapted to writing.

| File | Purpose | Written by | Read by |
|------|---------|-----------|---------|
| `progress.md` | Smallest snapshot of where the draft stands (focus, checklist, arcs) | `/end-session` | `/start-scene`, `/stuck` |
| `draft-state.md` | Plot-consistency working truth (established facts, open threads, timeline) | you + `/end-session` | `/check-continuity`, `/stuck` |
| `session-log.md` | Dated, append-only log of sessions | `/end-session` | you |

These files are **your project's state** — protected from template sync and meant to be committed,
so the resume-context travels with the repo.

Commands that use this (wired in STO-9): `/start-scene` reads `progress.md` on open;
`/end-session` writes `progress.md` + `draft-state.md` and appends to `session-log.md`; `/stuck`
reads all three. The SessionStart banner (STO-10) surfaces real scene/page counts.

> **Optional (beta):** durable series memory can also be backed by Anthropic's memory tool +
> context editing (`context-management` beta) — opt-in and reversible.
