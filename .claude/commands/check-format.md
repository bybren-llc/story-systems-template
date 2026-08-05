---
description: Validate Fountain syntax and formatting.
---

# /check-format

Validate Fountain syntax and formatting.

## Arguments
- `[file]` - Optional: specific .fountain file (default: main screenplay)

## Workflow

### Step 1: Run the validator

**Run `npm run lint:fountain`** — or `node scripts/validate-fountain.js [file]` for one file.

This is the deterministic pass. It checks scene-heading shape, character-name capitalization,
transition format, and parenthetical case, and it reports exact line numbers. Report its output
as given; do not re-derive those findings by reading, and do not paraphrase them.

It is advisory by default and exits 0 even with findings, so it will not interrupt the session.
Do not add `--strict` here — that flag is for CI.

If it reports nothing, say so. A clean validator run is a result, not an absence of one.

### Step 2: Read for what the validator cannot catch

Load the file and review it for the issues below. These are judgement calls a linter cannot
make — scene logic, dialogue attribution, structural drift. Skip anything Step 1 already
reported.

### Step 3: Syntax Validation

#### Title Page Check
```markdown
## Title Page
- [ ] Title present
- [ ] Author/Credit present
- [ ] Contact information
- [ ] Draft date (recommended)
```

#### Scene Headings Check
```markdown
## Scene Headings
Total: [X] scenes

Issues:
- Line [Y]: Missing time of day
- Line [Z]: Invalid prefix (should be INT/EXT)
```

#### Character/Dialogue Check
```markdown
## Character & Dialogue
Characters found: [X]

Issues:
- Line [Y]: Character without dialogue
- Line [Z]: Orphaned parenthetical
```

#### Element Check
```markdown
## Element Validation

| Element | Count | Issues |
|---------|-------|--------|
| Scene Headings | X | Y |
| Characters | X | Y |
| Dialogue Blocks | X | Y |
| Parentheticals | X | Y |
| Transitions | X | Y |
| Notes | X | Y |
```

### Step 4: Generate Report

```markdown
## Fountain Validation: [FILENAME]

### Status: [VALID / X ERRORS / Y WARNINGS]

The validator emits no severity, so **every validator finding counts as a warning (Y)**.
Only entries you add under *Errors (Must Fix)* count as errors (X). `Ready for Export` is NO
when X is above zero; validator warnings alone do not block it. Without this rule two runs on
the same file can report different counts.

### Validator (`npm run lint:fountain`) — [N findings / clean]
[Paste the validator's output verbatim — its per-file lines and its closing summary, whether
 that is "Found N potential issue(s)" or "All fountain files validated successfully!".
 Do not summarize it or replace a clean run with a shorter sentence.]

### Errors (Must Fix)
[List breaking issues found by reading, beyond what the validator caught]

### Warnings (Should Review)
[List non-breaking issues found by reading]

### Statistics
- Pages: ~[X]
- Scenes: [Y]
- Characters: [Z]

### Ready for Export: [YES/NO]
```

## Common Issues Detected

### Errors (Blocking)
| Issue | Description | Fix |
|-------|-------------|-----|
| Bad scene heading | Doesn't start with INT/EXT | Add proper prefix |
| Orphaned dialogue | No character name | Add character |
| Broken dual dialogue | Missing ^ | Add ^ to second character |

### Warnings (Review)
| Issue | Description | Fix |
|-------|-------------|-----|
| Long action block | 5+ lines | Consider breaking up |
| Missing title page | No metadata | Add title page |
| Inconsistent names | JOHN vs JOHNNY | Standardize |

## Success Criteria
- [ ] All scenes have valid headings
- [ ] All dialogue has character names
- [ ] No orphaned elements
- [ ] Title page complete
- [ ] Export-ready status determined

## Example Output

```markdown
## Fountain Validation: seoul identity.fountain

### Status: 2 ERRORS / 1 WARNING

### Errors (Must Fix)
1. Line 45: Scene heading missing time of day
   Current: `INT. WAREHOUSE`
   Fix: `INT. WAREHOUSE - NIGHT`

2. Line 128: Orphaned parenthetical
   Current: `(beat)` with no following dialogue
   Fix: Add dialogue or convert to action

### Warnings (Should Review)
1. Line 89: Action block is 7 lines
   Consider: Break into shorter paragraphs

### Statistics
- Pages: ~45
- Scenes: 32
- Characters: 8 (speaking)

### Ready for Export: NO (fix errors first)
```
