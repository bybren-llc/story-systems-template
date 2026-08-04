---
description: Run a per-scene continuity sweep, one subagent per scene, into a notes file.
---

# /continuity-sweep

Fan out **one Continuity Editor subagent per scene** across the whole script, then
consolidate every finding into a single dated notes file. Where `/check-continuity`
makes one whole-script pass, this sweep gives each scene its own focused reviewer —
better recall on long scripts, and every scene is checked against the Story Bible as
ground truth.

## Arguments

- `[scope]` — Optional: `full` (default), `act1` | `act2` | `act3`, or `scenes X-Y`.
- `[file]` — Optional path to the `.fountain` (or novel chapter) to sweep.

## Mechanism (GA-safe)

The sweep fans out one subagent per scene. Use whatever dispatch is available, in order
of preference — **do not hard-depend on a preview feature**:

1. **Dynamic workflow** (if enabled in this environment) — one `continuity-editor` agent per
   scene, run in parallel with a concurrency cap.
2. **Native subagent dispatch** (always available) — invoke the `continuity-editor` subagent
   per scene ("Acting as the Continuity Editor, review scene N…"), batching large scripts.

The **Session Manager** orchestrates; the **Continuity Editor** performs each scene review.

## Workflow

### Step 1: Segment the script into scenes

Split on scene headings — lines matching `^(INT\.|EXT\.|INT\./EXT\.|I/E\.)` for screenplays,
or chapter markers for novels. Number them 1..N. Honor `[scope]` if narrower than `full`.

### Step 2: Load ground truth once

Read `story-bible/` cards (characters, props, timeline, locations) and the `continuity-tracking`
skill. Pass the relevant cards to each per-scene subagent so findings cite canon, not guesses.

### Step 3: Fan out — one subagent per scene

Each `continuity-editor` subagent receives **only its scene + the Story Bible context** and returns
structured findings:

```markdown
### Scene N — INT./EXT. LOCATION - TIME
| Kind | Finding | Cites | Severity |
|------|---------|-------|----------|
| timeline | NIGHT after CONTINUOUS-from-DAY | story-bible/timeline/... | ⚠️ |
| character | Mara knows X she can't yet | story-bible/characters/mara.md | ⚠️ |
| prop | Gun present, never introduced | — | ⚠️ |
```

### Step 4: Consolidate

Merge all per-scene results into **`.wtfb/session/sweeps/continuity-sweep-notes.md`**
(overwrite; it is a regenerated artifact). Group by kind, order by severity then scene, and
add a one-line summary header:

```markdown
# Continuity Sweep — [TITLE]
Swept N scenes · verified_against: <git rev-parse --short HEAD> · status: [CLEAN / X ISSUES]
```

### Step 5: Report

Print the header + the top issues to the writer, and point them at the notes file for the full
list. Do **not** edit the script — a sweep reports; the writer decides.

## Success Criteria

- [ ] Every in-scope scene got its own subagent pass
- [ ] Findings cite Story Bible cards where relevant
- [ ] Consolidated notes written to `.wtfb/session/sweeps/continuity-sweep-notes.md`
- [ ] `verified_against` stamped with the current commit
- [ ] Script left unmodified

## See Also

- **/check-continuity** — single whole-script pass (faster; less per-scene depth).
- **continuity-tracking** skill — the per-scene reviewer's playbook.
- **/bible** — persist a confirmed finding as canon.
