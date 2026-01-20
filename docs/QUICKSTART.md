# Quick Start Guide

**For live demos and new users**

This guide walks you through creating your first WTFB project step-by-step.

> **Time to first success**: ~10 minutes

---

## Choose Your Platform

| You're using... | Terminal... | Follow... |
|-----------------|-------------|-----------|
| macOS | Terminal.app or iTerm2 | [macOS/Linux](#macos--linux) |
| Linux | Default terminal | [macOS/Linux](#macos--linux) |
| Windows + WSL | Ubuntu terminal | [Windows (WSL)](#windows-wsl) |
| Windows (native) | PowerShell or Windows Terminal | [Windows (PowerShell)](#windows-powershell) |

---

## Prerequisites by Platform

### macOS

**Install with Homebrew** (recommended):

```bash
# Install Homebrew if not present
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install required tools
brew install git node

# Install GitHub CLI (optional - only needed for one-command repo creation)
brew install gh

# Install Claude Code
npm install -g @anthropic-ai/claude-code

# Authenticate Claude Code
claude auth
```

**Verify installation:**

| Check | Command |
|-------|---------|
| Git | `git --version` |
| Node.js 18+ | `node --version` |
| npm | `npm --version` |
| Claude Code | `claude --version` |
| GitHub CLI (optional) | `gh --version` |

---

### Linux (Debian/Ubuntu)

```bash
# Update package lists
sudo apt update

# Install Git and Node.js
sudo apt install git nodejs npm

# Install GitHub CLI (optional)
sudo apt install gh
# or: sudo snap install gh

# Install Claude Code
npm install -g @anthropic-ai/claude-code

# Authenticate Claude Code
claude auth
```

**For other distributions:**
- Fedora/RHEL: Use `dnf` instead of `apt`
- Arch: Use `pacman -S git nodejs npm`

---

### Windows (WSL)

WSL gives you a full Linux environment on Windows. This is **recommended for development parity** with macOS/Linux users.

**Step 1: Enable WSL**

Open PowerShell as Administrator and run:

```powershell
wsl --install
```

Restart your computer when prompted.

**Step 2: Open Ubuntu**

After restart, open "Ubuntu" from the Start menu. Complete the initial setup (username/password).

**Step 3: Follow Linux instructions**

Once in Ubuntu terminal, follow the [Linux (Debian/Ubuntu)](#linux-debianubuntu) instructions above.

---

### Windows (PowerShell)

For native Windows without WSL.

**Option A: Install with winget** (Windows 10 1709+ / Windows 11):

```powershell
# Install Git
winget install Git.Git

# Install Node.js LTS
winget install OpenJS.NodeJS.LTS

# Install GitHub CLI (optional)
winget install GitHub.cli

# Restart terminal, then install Claude Code
npm install -g @anthropic-ai/claude-code

# Authenticate Claude Code
claude auth
```

**Option B: Manual download**

- Node.js: Download from [nodejs.org](https://nodejs.org) (LTS version)
- Git: Download from [git-scm.com](https://git-scm.com)
- GitHub CLI: Download from [cli.github.com](https://cli.github.com)

**Verify installation:**

```powershell
git --version
node --version
npm --version
claude --version
```

---

## Setup Steps

### macOS / Linux

**Step 1: Get the template**

Choose one:

**Option A (git clone):**
```bash
git clone https://github.com/bybren-llc/story-systems-template.git my-screenplay
cd my-screenplay
git remote remove origin  # Disconnects from template repo (add your own later)
```

**Option B (GitHub CLI - creates your own repo):**
```bash
gh repo create my-screenplay --template bybren-llc/story-systems-template --clone --public
cd my-screenplay
```

**Step 2: Initialize your project**

```bash
./scripts/init-project.sh
```

You'll be prompted for project name and type (screenplay/novel/film-production).

**Step 3: Install dependencies**

```bash
npm install
```

**Step 4: Open in your editor**

```bash
code .
# or: cursor .
```

**Step 5: Start Claude Code**

```bash
claude
```

**Step 6: Start writing!**

```
/start-scene Opening confrontation in the bar
```

Your AI team is ready. All 11 agents, 24 skills, and 30 commands work out of the box.

**Optional: Install Marketplace Plugins**

For enhanced workflows (showrunner mode, advanced methodology), you can install plugins:

```
/plugin install wtfb-screenwriting@github.com/bybren-llc/wtfb-claude-marketplace/plugins/screenwriting
```

---

### Windows (WSL)

Once you have Ubuntu terminal open, follow the [macOS / Linux](#macos--linux) steps above.

---

### Windows (PowerShell)

**Step 1: Get the template**

Choose one:

**Option A (git clone):**
```powershell
git clone https://github.com/bybren-llc/story-systems-template.git my-screenplay
cd my-screenplay
git remote remove origin  # Disconnects from template repo (add your own later)
```

**Option B (GitHub CLI - creates your own repo):**
```powershell
gh repo create my-screenplay --template bybren-llc/story-systems-template --clone --public
cd my-screenplay
```

**Step 2: Initialize your project**

```powershell
.\scripts\init-project.ps1
```

If you get an execution policy error, run:
```powershell
PowerShell -ExecutionPolicy Bypass -File .\scripts\init-project.ps1
```

You'll be prompted for project name and type (screenplay/novel/film-production).

**Step 3: Install dependencies**

```powershell
npm install
```

**Step 4: Open in your editor**

```powershell
code .
# or: cursor .
```

**Step 5: Start Claude Code**

```powershell
claude
```

**Step 6: Start writing!**

```
/start-scene Opening confrontation in the bar
```

Your AI team is ready. All 11 agents, 24 skills, and 30 commands work out of the box.

**Optional: Install Marketplace Plugins**

For enhanced workflows (showrunner mode, advanced methodology), you can install plugins:

```
/plugin install wtfb-screenwriting@github.com/bybren-llc/wtfb-claude-marketplace/plugins/screenwriting
```

---

## What Gets Created

When you run the init script, you'll see:

| Type | Main File | Additional |
|------|-----------|------------|
| `screenplay` | `{name}.fountain` | Beat sheet, character registry |
| `novel` | `manuscript/chapters/` | Outline, character sheets |
| `film-production` | `production/schedule.json` | Budget, crew contacts |

**Project structure:**
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

## Troubleshooting

### All Platforms

**"npm: command not found"**
- Install Node.js from [nodejs.org](https://nodejs.org)
- Windows: Restart terminal after installing

**Plugin install fails**
```bash
npm update -g @anthropic-ai/claude-code
```

### macOS / Linux / WSL

**"Permission denied" on init script**
```bash
chmod +x scripts/init-project.sh
./scripts/init-project.sh
```

**"gh: command not found"**
- macOS: `brew install gh`
- Linux: `sudo apt install gh`
- Or use `git clone` option instead

### Windows (PowerShell)

**Script blocked by execution policy**
```powershell
PowerShell -ExecutionPolicy Bypass -File .\scripts\init-project.ps1
```

**"CLAUDE.md created as copy" message**
- Normal on Windows without Developer Mode
- To enable symlinks: Settings > Developer settings > Developer Mode: On
- The copy works identically; symlinks are just a minor convenience

**"git: command not found"**
- Restart PowerShell after installing Git
- Or use Git Bash instead

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
   - [GitHub Discussions](https://github.com/bybren-llc/story-systems-template/discussions)
   - [Report Issues](https://github.com/bybren-llc/story-systems-template/issues)

---

<p align="center">
  <strong>Words To Film By</strong><br>
  <em>"Your creative AI team, ready to work."</em>
</p>
