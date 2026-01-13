# Scripts Directory

This directory contains automation scripts for project initialization, validation, and maintenance.

## Directory Structure

```
scripts/
├── README.md              # This file
├── init-project.sh        # Project initialization (macOS/Linux/WSL)
├── init-project.ps1       # Project initialization (Windows PowerShell)
├── sync-upstream.sh       # Template sync helper
└── validate-fountain.js   # Fountain format validation
```

## Compatibility Contract

Both init scripts require:

| Dependency | Minimum Version | Notes |
|------------|-----------------|-------|
| Node.js | 18.x or 20.x LTS | For npm and validation scripts |
| Git | 2.x | For version control |
| npm | 9.x+ | Comes with Node.js |
| PowerShell | 5.1+ | Windows built-in; or 7+ cross-platform |
| GitHub CLI | Optional | Only needed for repo creation, not init |

## Init Script Responsibilities

Both `init-project.sh` and `init-project.ps1` **MUST** implement identical behavior:

1. Prompt for project name (lowercase, hyphenated) and type (screenplay/novel/film-production)
2. Validate inputs before proceeding
3. Create `.wtfb/project.json` with project configuration
4. Create `marketing/wtfb-marketing.json` with placeholder values
5. Create type-specific files:
   - **Screenplay**: `{name}.fountain`, `templates/beat-sheet.md`, `templates/character-registry.md`
   - **Novel**: `manuscript/` structure, `world/` structure
   - **Film-production**: `production/`, `assets/`, `crew/` structures
6. Create symlink: `CLAUDE.md` -> `.wtfb/ai-harness/CLAUDE.md` (or copy as fallback on Windows)
7. Update `package.json` name field
8. Create placeholder directories with `.gitkeep` files
9. Print next steps with type-specific plugin recommendation
10. Exit with code 0 on success, non-zero on failure

**Console Output Requirements:**
- Use colored output where supported
- Print what each step is doing
- Print next steps on completion
- Print recovery hints on common failures (missing deps)

## Available Scripts

### init-project.sh

**Purpose:** Initialize a new WTFB project from the template.

**Usage:**
```bash
./scripts/init-project.sh [project-name] [project-type]

# Interactive mode (prompts for inputs)
./scripts/init-project.sh

# Direct mode
./scripts/init-project.sh my-screenplay screenplay
./scripts/init-project.sh my-novel novel
./scripts/init-project.sh my-film film-production
```

**What it does:**
1. Validates project type (screenplay, novel, film-production)
2. Updates `.wtfb/project.json` with project name and type
3. Updates `marketing/wtfb-marketing.json` with project details
4. Creates type-specific files:
   - **Screenplay**: `[name].fountain` with title page, templates
   - **Novel**: `manuscript/` structure with outline
   - **Film Production**: `production/`, `assets/`, `crew/` directories
5. Creates `CLAUDE.md` symlink
6. Updates `package.json` name

**Output:**
- Colored terminal output showing progress
- List of created files
- Next steps and recommended commands

### init-project.ps1

**Purpose:** Initialize a new WTFB project from the template (Windows PowerShell).

**Usage:**
```powershell
# From PowerShell or Windows Terminal
.\scripts\init-project.ps1 [project-name] [project-type]

# Interactive mode (prompts for inputs)
.\scripts\init-project.ps1

# Direct mode
.\scripts\init-project.ps1 my-screenplay screenplay

# If execution policy blocks the script
PowerShell -ExecutionPolicy Bypass -File .\scripts\init-project.ps1
```

**What it does:**

Identical to `init-project.sh` (see Init Script Responsibilities above).

**Windows-specific behavior:**
- Attempts to create symlink for `CLAUDE.md`; falls back to file copy if symlink creation fails (requires Developer Mode or admin rights)
- Uses Windows-native paths and PowerShell commands
- Compatible with PowerShell 5.1+ (Windows built-in) and PowerShell 7+

### sync-upstream.sh

**Purpose:** Manually sync updates from the upstream WTFB template.

**Usage:**
```bash
./scripts/sync-upstream.sh
```

**What it does:**
1. Reads upstream URL from `.wtfb/project.json`
2. Adds/fetches the upstream remote
3. Shows available updates (commits behind)
4. Displays which paths will be synced vs protected
5. Optionally creates a sync branch and merges

**Interactive prompts:**
- Shows diff of available changes
- Asks for confirmation before merging
- Handles merge conflicts gracefully

**When to use:**
- When notified of template updates
- Periodically to stay current
- After major WTFB template releases

### validate-fountain.js

**Purpose:** Validate Fountain screenplay files for common formatting issues.

**Usage:**
```bash
# Via npm script (recommended)
npm run lint:fountain

# Direct execution
node scripts/validate-fountain.js
```

**What it validates:**
- **Scene headings**: Must be `INT./EXT. LOCATION - TIME`
- **Character names**: Should be ALL CAPS
- **Transitions**: Should end with `:`
- **Parentheticals**: Should be lowercase in parentheses

**Output:**
```
Validating 2 fountain file(s)...

✓ my-screenplay.fountain
⚠ scenes/test-scene.fountain
  Line 15: Scene heading may be malformed. Expected format: INT./EXT. LOCATION - TIME
    int coffee shop - day...

Found 1 potential issue(s)
```

**Exit codes:**
- `0`: All files valid (or only warnings)
- Non-zero: Hard errors found

## npm Scripts

These scripts are exposed via `package.json`:

```bash
npm run validate        # Full validation (fountain + markdown + spelling)
npm run lint:fountain   # Fountain syntax only
npm run lint:md         # Markdown linting only
npm run lint:spell      # Spell check only
npm run init            # Run init-project.sh
```

## Adding Custom Scripts

To add a project-specific script:

1. Create the file in `scripts/`
2. Add shebang line: `#!/bin/bash` or `#!/usr/bin/env node`
3. Make executable: `chmod +x scripts/my-script.sh`
4. Optionally add to `package.json` scripts
5. Document in this README

**Script conventions:**
- Use colored output for clarity (see init-project.sh for examples)
- Include usage instructions in script header
- Handle errors gracefully with `set -e`
- Provide `--help` option for complex scripts

## CI/CD Integration

Scripts are used by GitHub Actions workflows:

| Workflow | Script Used |
|----------|-------------|
| `validate.yml` | `validate-fountain.js` via `npm run lint:fountain` |
| `sync-upstream.yml` | Logic similar to `sync-upstream.sh` |

## Script Dependencies

**Bash scripts:**
- `bash` (standard)
- `jq` (for JSON parsing)
- `git` (for version control operations)
- `sed` (for text manipulation)

**Node.js scripts:**
- Node.js 18+ (for modern JavaScript features)
- No external npm dependencies (uses only built-in modules)

## Environment Variables

Scripts may use these environment variables:

| Variable | Purpose | Default |
|----------|---------|---------|
| `PROJECT_NAME` | Override project name | (interactive prompt) |
| `PROJECT_TYPE` | Override project type | (interactive prompt) |

## Troubleshooting

**Script not executable:**
```bash
chmod +x scripts/*.sh scripts/*.js
```

**jq not found:**
```bash
# Ubuntu/Debian
sudo apt install jq

# macOS
brew install jq
```

**Node.js version issues:**
```bash
# Check version (need 18+)
node --version

# Use nvm to install correct version
nvm install 20
nvm use 20
```

**Permission denied on WSL:**
```bash
# If scripts copied from Windows, fix line endings
sed -i 's/\r$//' scripts/*.sh
```
