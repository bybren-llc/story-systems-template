---
description: Begin work on a scene with proper workflow setup.
---

# /start-scene

Begin work on a scene with proper workflow setup.

## Arguments
- `[scene-description]` - Optional brief description of the scene

## Workflow

### Step 0: Resume from session memory

Read `.wtfb/session/progress.md` to pick up where you left off — the current focus, "next up",
anything you were blocked on, the scene/chapter checklist, and arc state. Skim
`.wtfb/session/draft-state.md` for established facts and open threads relevant to this scene. (See
`.wtfb/session/README.md`.)

### Step 1: Identify Scene Context
1. If no argument provided, ask:
   - What is the scene about?
   - Where does it take place?
   - Who is in the scene?

2. If continuing existing screenplay:
   - Identify current position in script
   - Load continuity context
   - Review recent scenes for flow

### Step 2: Pre-Scene Checklist
- [ ] Scene purpose is clear (what changes?)
- [ ] Characters present have reason to be there
- [ ] Time of day established
- [ ] Location established or referenced

### Step 3: Scene Setup
1. Confirm scene heading format:
   ```fountain
   INT./EXT. LOCATION - TIME OF DAY
   ```

2. Check against existing locations for consistency

3. Verify timeline continuity with previous scene

### Step 4: Begin Writing
- Load relevant skills: `fountain-syntax`, `scene-headings`, `action-description`
- Have `character-dialogue` ready for dialogue work
- Reference `continuity-tracking` if needed

## Success Criteria
- [ ] Scene heading properly formatted
- [ ] Scene purpose defined
- [ ] Continuity verified
- [ ] Ready to write

## Example

```
User: /start-scene coffee shop confrontation
Assistant: Starting scene work: Coffee Shop Confrontation

Scene Context:
- Location: Coffee Shop (existing location)
- Previous scene: INT. SARAH'S APARTMENT - NIGHT (Sarah discovers evidence)
- Timeline: Next morning (DAY appropriate)

Scene Heading:
INT. COFFEE SHOP - DAY

Scene Purpose: Sarah confronts John with the evidence.

Ready to write. What happens when Sarah enters?
```
