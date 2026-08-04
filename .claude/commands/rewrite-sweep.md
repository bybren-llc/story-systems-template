---
description: Run a per-scene rewrite sweep, grading each scene, into a prioritized notes file.
---

# /rewrite-sweep

Fan out **one reviewer subagent per scene** to grade and diagnose every scene, then
consolidate into a single prioritized rewrite plan. Where `/rewrite-check` walks the
whole-script 6-step methodology once, this sweep gives each scene its own grader —
so the weakest scenes surface with concrete, per-scene fixes.

## Arguments

- `[scope]` — Optional: `full` (default), `act1` | `act2` | `act3`, or `scenes X-Y`.
- `[file]` — Optional path to the `.fountain` (or novel chapter) to sweep.

## Mechanism (GA-safe)

Fan out one subagent per scene using whatever dispatch is available — **do not hard-depend
on a preview feature**:

1. **Dynamic workflow** (if enabled) — one grader agent per scene, parallel with a concurrency cap.
2. **Native subagent dispatch** (always available) — invoke a reviewer subagent per scene,
   batching large scripts.

The **Session Manager** orchestrates; the **Standards Reviewer** grades and the **Story Analyst**
supplies arc context. Each per-scene prompt reuses the `rewriting-methodology` and `arc-check` skills.

## Workflow

### Step 1: Segment the script into scenes

Split on scene headings — `^(INT\.|EXT\.|INT\./EXT\.|I/E\.)` for screenplays, chapter markers for
novels. Number them 1..N. Honor `[scope]`.

### Step 2: Establish arc context once

Run a light `arc-check` pass to list the story threads, so each per-scene grade can note which
thread(s) the scene advances (or fails to).

### Step 3: Fan out — grade one subagent per scene

Each subagent grades its scene **A–F** per the `rewriting-methodology` "best scene" standard and
returns:

```markdown
### Scene N — INT./EXT. LOCATION - TIME
- **Grade:** C
- **Advances:** [thread(s)] · or "does not advance any thread"
- **Enters late / exits early:** [yes/no + where]
- **Compression:** [lines that could be cut]
- **Fix:** [one concrete elevation toward the A-scene]
```

### Step 4: Consolidate + prioritize

Merge into **`.wtfb/session/sweeps/rewrite-sweep-notes.md`** (overwrite; regenerated artifact).
Sort **weakest-first** (F → A) so the highest-leverage rewrites are at the top, and add a header:

```markdown
# Rewrite Sweep — [TITLE]
Graded N scenes · verified_against: <git rev-parse --short HEAD>
Distribution: A×_ B×_ C×_ D×_ F×_  ·  Threads with holes: [list or none]
```

### Step 5: Report

Print the grade distribution + the D/F scenes with their fixes, and point the writer at the notes
file. Do **not** rewrite the script — a sweep proposes; the writer decides.

## Success Criteria

- [ ] Every in-scope scene got its own graded pass
- [ ] Each scene notes which thread(s) it advances
- [ ] Consolidated, weakest-first notes at `.wtfb/session/sweeps/rewrite-sweep-notes.md`
- [ ] `verified_against` stamped with the current commit
- [ ] Script left unmodified

## See Also

- **/rewrite-check** — single whole-script 6-step pass.
- **rewriting-methodology** skill — grading + compression playbook.
- **/arc-check** — thread/arc completeness the sweep leans on.
