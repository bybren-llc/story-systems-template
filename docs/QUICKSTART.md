# Quick Start Guide

**For live demos and new users**

This guide walks you through creating your first WTFB project step-by-step.

---

## Prerequisites

Before starting, ensure you have:

| Requirement | Check Command | Install |
|-------------|---------------|---------|
| **Git** | `git --version` | [git-scm.com](https://git-scm.com) |
| **GitHub CLI** | `gh --version` | [cli.github.com](https://cli.github.com) |
| **Node.js 18+** | `node --version` | [nodejs.org](https://nodejs.org) |
| **GitHub Account** | - | [github.com](https://github.com) |

**GitHub CLI Authentication:**
```bash
gh auth login
```

---

## Step 1: Create Your Repository

Open your terminal and run:

```bash
gh repo create {your-project} --template bybren-llc/wtfb-projects-template --clone --public
```

**Replace `{your-project}` with your project name** (lowercase, hyphens only).

Examples:
- `my-first-screenplay`
- `untitled-thriller`
- `coffee-shop-romance`

**What happens:**
- Creates a new repo in your GitHub account
- Clones it to your computer
- Copies all template files

---

## Step 2: Enter Your Project

```bash
cd {your-project}
```

You should see this structure:
```
{your-project}/
├── .claude/           # AI agent configurations
├── .wtfb/             # Project settings
├── docs/              # Documentation
├── exports/           # Output files (PDF, FDX, HTML)
├── marketing/         # Platform integration
├── patterns/          # Story patterns
├── scripts/           # Utility scripts
├── sourcematerials/   # Research & references
├── templates/         # Beat sheets, character sheets
├── AGENTS.md          # AI team reference
├── CLAUDE.md          # AI instructions
├── package.json       # Dependencies
└── README.md          # Project info
```

---

## Step 3: Initialize Your Project

Run the initialization script:

```bash
./scripts/init-project.sh
```

**You'll be prompted for:**

1. **Project name** (lowercase, hyphenated)
   ```
   Project name (lowercase, hyphenated): my-screenplay
   ```

2. **Project type**
   ```
   Project types:
     1) screenplay
     2) novel
     3) film-production
   Select project type [1-3]: 1
   ```

**What this creates:**

| Type | Main File | Additional |
|------|-----------|------------|
| `screenplay` | `{name}.fountain` | Beat sheet, character registry |
| `novel` | `manuscript/chapters/` | Outline, character sheets |
| `film-production` | `production/schedule.json` | Budget, crew contacts |

---

## Step 4: Install Dependencies

```bash
npm install
```

This installs validation tools for:
- Fountain syntax checking
- Spell checking
- Markdown linting

---

## Step 5: Open in Your Editor

**VS Code / Cursor:**
```bash
code .
# or
cursor .
```

When prompted, install the recommended extensions (Better Fountain, spell checker, etc.).

---

## Step 6: Start Claude Code

```bash
claude
```

---

## Step 7: Install the AI Team Plugin

In Claude Code, run:

```
/plugin install wtfb-screenwriting@github.com/bybren-llc/wtfb-claude-marketplace/plugins/screenwriting
```

**What you get:**
- 11 specialized AI agents
- 30+ slash commands
- 17 craft patterns
- Industry-standard exports

---

## Step 8: Start Writing!

```
/start-scene Opening confrontation in the bar
```

Your AI team is now active:
- **Story Architect** ensures structure
- **Dialogue Writer** refines voices
- **Script Supervisor** catches formatting issues
- **Continuity Editor** tracks consistency

---

## Quick Command Reference

| Command | Purpose |
|---------|---------|
| `/start-scene [description]` | Begin scene work |
| `/writers-room` | Multi-agent brainstorm |
| `/check-format` | Validate Fountain syntax |
| `/check-continuity` | Check for inconsistencies |
| `/export-pdf` | Generate industry PDF |
| `/end-session` | Save and commit progress |

---

## All-in-One (Copy-Paste Version)

For experienced users, here's everything in one block:

```bash
# Create and enter project
gh repo create my-screenplay --template bybren-llc/wtfb-projects-template --clone --public
cd my-screenplay

# Initialize (interactive)
./scripts/init-project.sh

# Install dependencies
npm install

# Open editor
cursor .

# Start Claude Code (in terminal)
claude

# Install plugin (in Claude Code)
/plugin install wtfb-screenwriting@github.com/bybren-llc/wtfb-claude-marketplace/plugins/screenwriting

# Start writing
/start-scene Opening scene
```

---

## Troubleshooting

### "gh: command not found"
Install GitHub CLI: https://cli.github.com

### "Permission denied" on init script
```bash
chmod +x scripts/init-project.sh
./scripts/init-project.sh
```

### "npm: command not found"
Install Node.js: https://nodejs.org

### Plugin install fails
Ensure you have the latest Claude Code:
```bash
npm update -g @anthropic-ai/claude-code
```

---

## Next Steps

1. **Read the docs:**
   - [AGENTS.md](../AGENTS.md) - Meet your AI team
   - [REFERENCE.md](REFERENCE.md) - Full command list
   - [WORKFLOW.md](WORKFLOW.md) - Git workflow guide

2. **Customize your project:**
   - Edit `marketing/wtfb-marketing.json` with your details
   - Add research to `sourcematerials/`
   - Fill out `templates/beat-sheet.md`

3. **Join the community:**
   - [GitHub Discussions](https://github.com/bybren-llc/wtfb-projects-template/discussions)
   - [Report Issues](https://github.com/bybren-llc/wtfb-projects-template/issues)

---

<p align="center">
  <strong>Words To Film By</strong><br>
  <em>"Your creative AI team, ready to work."</em>
</p>
