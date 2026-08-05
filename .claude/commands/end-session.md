---
description: Complete a writing session cleanly with proper state preservation.
---

# /end-session

Complete a writing session cleanly with proper state preservation.

## Workflow

### Step 1: Session Summary
Generate summary of work completed:
- Scenes written/revised
- Pages added/removed
- Major changes made

### Step 2: Update session memory

**No hook or script writes session memory — this step does.** You can also edit the files by
hand, but nothing automated will, so skipping this leaves `.wtfb/session/` showing the previous
session — `/start-scene` and `/stuck`
will then resume from stale state without any indication that they are doing so.

Write `.wtfb/session/` **first**, so these updates are included in the commit below and the next
session resumes cleanly:

- **`progress.md`** — update *Current focus* (working on / next up / blocked on), the
  scene/chapter checklist, arc tracking, and the *Last session* line.
- **`draft-state.md`** — add any newly established facts, opened/closed plot threads, or timeline
  anchors from this session.
- **`session-log.md`** — **prepend** a new dated entry at the top (newest first): what you worked
  on, decisions made, and where the next session starts.
- Note the current page count; update continuity databases / the Story Bible (`/bible`) if modified.

### Step 3: Git Status Check
```bash
git status
```

If uncommitted changes exist (now including the session-memory updates above):
1. Display changes
2. Offer to commit with descriptive message
3. Use commit format:
   ```
   scene(location): Brief description

   - Detail 1
   - Detail 2
   ```

### Step 4: Carryover Notes
Identify items for next session:
- [[TODO:]] notes still open
- [[QUESTION:]] notes needing resolution
- Scenes left incomplete
- Next logical scene to write

### Step 5: Clean Exit
```markdown
📊 Session Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Scenes: [written/revised count]
Pages: [current total] ([+/- change])
Duration: [if tracked]

💾 Git Status: [committed/uncommitted changes]

📝 Next Session
- [Carryover item 1]
- [Carryover item 2]

✅ Session ended cleanly
```

## Success Criteria
- [ ] Changes committed or user declined
- [ ] Session summary generated
- [ ] Carryover items noted
- [ ] Clean state for next session

## Example Output

```
📊 Session Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Scenes: 3 written, 1 revised
Pages: 45 (+8 from session start)

💾 Git Status: All changes committed
   scene(coffee-shop): Sarah confronts John with evidence
   scene(street): John's desperate phone call
   scene(warehouse): Setup for act two climax

📝 Next Session
- Complete warehouse scene (dialogue pass needed)
- [[TODO: Research Seoul warehouse districts]]
- Begin Act Two sequence 4

✅ Session ended cleanly
```
