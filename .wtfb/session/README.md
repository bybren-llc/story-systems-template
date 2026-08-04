# Session Memory

Persistent, cross-session state so you and your AI team can **resume where you left off** —
following Anthropic's "effective harnesses for long-running agents" pattern, adapted to writing.

The command integrations below land in **STO-9** — until then these are starter templates you edit
by hand.

| File | Purpose | Written by (STO-9) | Read by (STO-9) |
|------|---------|--------------------|-----------------|
| `progress.md` | Smallest snapshot of where the draft stands (focus, checklist, arcs) | `/end-session` | `/start-scene`, `/stuck` |
| `draft-state.md` | Plot-consistency working truth (established facts, open threads, timeline) | you + `/end-session` | `/check-continuity`, `/stuck` |
| `session-log.md` | Dated log, **newest first** | `/end-session` | you |

These files are **your project's state** — protected from template sync and meant to be committed,
so the resume-context travels with the repo.

Once wired (STO-9): `/start-scene` will read `progress.md` on open; `/end-session` will write
`progress.md` + `draft-state.md` and **prepend a new entry** to `session-log.md` (newest first);
`/stuck` will read all three. The SessionStart banner (STO-10) surfaces real scene/page counts.

> **Optional (beta):** durable series memory can also be backed by Anthropic's memory tool +
> context editing (`context-management` beta) — opt-in and reversible.
