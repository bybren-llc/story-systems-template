---
description: Initialize project README from IMDb-style template.
---

# /init-readme

Initialize the project README from the IMDb-style template.

## Arguments
- `[--title <title>]` - Optional: Override project title (defaults to `.wtfb/project.json` name)
- `[--type <type>]` - Optional: Override project type (screenplay|novel|film-production)
- `[--force]` - Overwrite even if README appears customized
- `[--dry-run]` - Show what would be generated without writing

## Workflow

### Step 1: Check Current State

Look for the marker `<!-- wtfb:template-readme -->` in README.md.

**Decision tree:**
- README.md doesn't exist → proceed
- README.md has marker → proceed (safe to overwrite)
- README.md exists without marker → skip (unless `--force`)

If skipping:
```
ℹ️ README.md appears to be customized - leaving it unchanged.
   Use --force to replace it anyway.
```

### Step 2: Run CLI Command

Execute the deterministic CLI:
```bash
npx wtfb init-readme [--title "..."] [--type ...] [--force] [--dry-run]
```

The CLI will:
1. Read project info from `.wtfb/project.json` (flags override if provided)
2. Read `templates/readme-imdb-style.md`
3. Substitute placeholders:
   - `# [Project Title] (Year)` → `# {Title} ({Year})`
   - `[Project Type]` → display label (Screenplay, Novel, Film Production)
4. Remove the template marker from output
5. Write to README.md

### Step 3: Confirm Result

**On success (generated):**
```
✅ README.md created!

  # [Project Title] (2026)
  **[Type]** | **[Genre]** | **[Runtime]**

Fill in the remaining placeholders:
  - Logline and synopsis
  - Character and crew details
  - Technical specifications
```

**On skip (customized):**
```
ℹ️ README.md appears to be customized - leaving it unchanged.
```

**On force overwrite:**
```
✅ README.md regenerated (--force)

  # [Project Title] (2026)
  ...
```

## Type Display Mapping

| Internal Token | Display Label |
|----------------|---------------|
| `screenplay` | Screenplay |
| `novel` | Novel |
| `film-production` | Film Production |

## Exit Codes

| Exit | Meaning |
|------|---------|
| `0` | Success OR skipped (customized README) |
| `1` | Error (template not found, write failed, etc.) |

"Skipped" is informational, not an error.

## Error Handling

| Error | Cause | Fix |
|-------|-------|-----|
| Template not found | Missing `templates/readme-imdb-style.md` | Restore from template repo |
| Project config missing | No `.wtfb/project.json` | Run `npm run init` first |
| Write failed | Permission or disk issue | Check file system |

## Example Usage

### Basic (uses project.json values)
```
/init-readme
```

### With title override
```
/init-readme --title "My Amazing Screenplay"
```

### Force regeneration
```
/init-readme --force
```

### Preview without writing
```
/init-readme --dry-run
```

## Success Criteria
- [ ] CLI command executed successfully
- [ ] README.md contains project title and year
- [ ] Project type shows human-friendly label
- [ ] Template marker removed from output
- [ ] User-modified README not overwritten (without --force)
- [ ] All other placeholders remain for user to fill in
