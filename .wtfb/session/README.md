# Session Memory

Cross-session notes so you and your AI team can **resume where you left off** — following
Anthropic's "effective harnesses for long-running agents" pattern, adapted to writing.

> **These files are maintained by an agent, not by the harness.** Nothing writes them
> automatically. They are updated when — and only when — you run `/end-session` and the agent
> follows its instructions. Close the terminal, run out of context, or skip the command, and the
> session leaves no trace here. Read what is below as *"true as of the last `/end-session`"*,
> not as current state.

| File | Purpose | Updated by | Read by |
|------|---------|-----------|---------|
| `progress.md` | Smallest snapshot of where the draft stands (focus, checklist, arcs) | `/end-session` | `/start-scene`, `/stuck`, SessionStart banner |
| `draft-state.md` | Plot-consistency working truth (established facts, open threads, timeline) | you + `/end-session` | `/start-scene`, `/stuck` |
| `session-log.md` | Dated log, **newest first** | `/end-session` | you |

These files are **your project's state** — protected from template sync and meant to be
committed, so the resume-context travels with the repo.

## How the loop actually closes

- `/end-session` updates all three at its Step 2, *before* the commit — so the state lands in
  that commit rather than after it
- `/start-scene` reads `progress.md` and skims `draft-state.md`
- `/stuck` reads all three
- The SessionStart banner reads `progress.md` for its resume line, and shows nothing when the
  file is still the shipped placeholder

Every one of those is a prompt an agent follows, not a mechanism the harness enforces. No hook,
script, or CI job writes these files, and nothing detects that they have gone stale. If you want
a guarantee rather than a convention, run `/end-session` before you stop.

> **Optional (beta):** durable series memory can also be backed by Anthropic's memory tool +
> context editing (`context-management` beta) — opt-in and reversible.
