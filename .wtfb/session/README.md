# Session Memory

Persistent, cross-session state so you and your AI team can **resume where you left off** —
following Anthropic's "effective harnesses for long-running agents" pattern, adapted to writing.

| File | Purpose | Written by | Read by |
|------|---------|-----------|---------|
| `progress.md` | Smallest snapshot of where the draft stands (focus, checklist, arcs) | `/end-session` | `/start-scene`, `/stuck` |
| `draft-state.md` | Plot-consistency working truth (established facts, open threads, timeline) | you + `/end-session` | `/start-scene`, `/check-continuity`, `/stuck` |
| `session-log.md` | Dated log, **newest first** | `/end-session` | you |

These files are **your project's state** — protected from template sync and meant to be committed,
so the resume-context travels with the repo.

`/start-scene` reads `progress.md` (and skims `draft-state.md`) on open; `/end-session` writes
`progress.md` + `draft-state.md` and **prepends a new entry** to `session-log.md` (newest first);
`/stuck` reads all three. The SessionStart banner (STO-10) surfaces real scene/page counts.

> **Optional (beta):** durable series memory can also be backed by Anthropic's memory tool +
> context editing (`context-management` beta) — opt-in and reversible.
