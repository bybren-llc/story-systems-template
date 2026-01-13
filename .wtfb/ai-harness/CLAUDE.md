# CLAUDE.md

> **Words To Film By™** harness by J. Scott Graham ([@cheddarfox](https://github.com/cheddarfox)) / [Bybren LLC](https://github.com/bybren-llc)

This file provides guidance to Claude Code when working with this WTFB creative project.

## Project Overview

This is a **WTFB (Words To Film By)** creative project. Check `.wtfb/project.json` for the project type (screenplay, novel, or film-production).

## Multi-Agent Harness

This project uses an 11-agent team for collaborative development. See `AGENTS.md` for the complete team reference.

### Agents as UX

Writers don't need to learn CLI commands. **Agents handle all tooling via `@wtfb/cli`.**

- When a writer asks to export, the Production Coordinator runs `wtfb export-pdf`
- When a writer asks to validate, the Script Supervisor runs `wtfb validate`

The CLI is infrastructure for agents, not interface for humans.

### Harness Location
- **Agents**: `.claude/agents/` - 11 specialized agent profiles
- **Commands**: `.claude/commands/` - Slash command definitions
- **Skills**: `.claude/skills/` - Knowledge base modules
- **Hooks**: `.claude/hooks/` - Hook configurations

### Agent Invocation
```
Acting as the Story Architect, evaluate the three-act structure...
Acting as the Dialogue Writer, refine the voice for [character]...
```

## Quick Reference

### Capability Schema
See `.wtfb/ai-harness/schema.json` for full capability definitions.

### Project Configuration
- **Type & Plugins**: `.wtfb/project.json`
- **Marketing Config**: `marketing/wtfb-marketing.json`
- **Templates**: `templates/`
- **Patterns**: `patterns/`
- **Source Materials**: `sourcematerials/`

---

## Commands by Project Type

### Screenplay Projects

#### Workflow
```
/start-scene [description]  - Begin scene work with context
/end-session               - Complete session, commit progress
/check-format              - Validate Fountain syntax
/check-continuity          - Check consistency across script
```

#### Writing
```
/new-scene [location]      - Add formatted scene heading
/new-character [name]      - Add character with tracking
/format-dialogue [name]    - Format dialogue block
/add-transition [type]     - Insert transition
```

#### Analysis
```
/analyze-structure         - Structure analysis
/analyze-character [name]  - Character arc analysis
/scene-list                - List all scenes
/page-count                - Current page estimate
```

#### Export
```
/export-pdf                - Generate industry-standard PDF
/export-fdx                - Generate Final Draft XML
/export-html               - Generate HTML preview
```

#### WTFB Methodology
```
/writers-room              - Convene 6-agent pre-production session
/theme-discovery           - Personal theme mining
/story-check               - Validate against 12 critical questions
/power-analysis            - Character power dynamics
```

### Novel Projects

#### Workflow
```
/start-chapter [number]    - Begin chapter work
/outline                   - View/edit story outline
/character [name]          - View/edit character sheet
```

#### Analysis
```
/word-count                - Current manuscript length
/timeline                  - View story timeline
/pacing-check              - Analyze narrative pacing
```

### Film Production Projects

#### Production
```
/create-schedule           - Build production schedule
/call-sheet [date]         - Generate call sheet
/budget-check              - Review budget status
/location-scout [name]     - Add location details
```

---

## Fountain Format Reference (Screenplays)

### Scene Headings
```fountain
INT. COFFEE SHOP - DAY
EXT. CITY STREET - NIGHT
INT./EXT. CAR (MOVING) - CONTINUOUS
```

### Character & Dialogue
```fountain
SARAH
(hesitant)
I don't know about this.

JOHN (V.O.)
Trust me.
```

### Extensions
- `(V.O.)` - Voice Over
- `(O.S.)` - Off Screen
- `(CONT'D)` - Continued
- `^` after name - Dual dialogue

### Transitions
```fountain
CUT TO:
FADE OUT.
>SMASH CUT TO:
```

### Notes & Sections
```fountain
[[This is a note - hidden in output]]
# Act One
## Sequence 1
= Synopsis text here
```

---

## Repository Structure

```
project-name.fountain      Main screenplay (or manuscript/ for novels)
sourcematerials/           Research, PDFs, reference docs
exports/                   Generated outputs (PDF, FDX, HTML)
  ├── pdf/
  ├── fdx/
  └── html/
templates/                 Beat sheets, character registry
docs/                      Project documentation
  ├── v1-original/         Version archives
  └── v2-development/      Current development docs
marketing/                 Platform integration
  ├── wtfb-marketing.json  Commerce & analytics config
  ├── assets/              Poster, banner, social cards
  └── pages/               GitHub Pages content
.wtfb/                     Project configuration
  ├── project.json         Type, plugins, sync settings
  └── ai-harness/          Multi-AI instructions
```

---

## Validation

Run validation before commits:
```bash
npm run validate              # Full validation (all linters + capability check)
npm run validate:capabilities # Skill/command compliance only
npm run lint:fountain         # Fountain syntax only (screenplay)
npm run lint:md               # Markdown linting
npm run lint:spell            # Spell check
```

Pre-commit hooks run automatically on staged files.

---

## CI/CD

All PRs are automatically validated for:
- Skill frontmatter compliance (name, wtfbId, description)
- Command format compliance (heading, description)
- Markdown and spelling
- PR title format: `type(scope): description`

Valid PR title types: `feat`, `fix`, `docs`, `refactor`, `chore`, `skill`, `command`, `ci`

Example: `feat(skill): add advanced-structure skill`

---

## Git Workflow

### Branch Strategy
- `main` - Stable drafts only
- `draft/v1`, `draft/v2` - Major versions
- `scene/[name]` or `chapter/[name]` - Unit-specific work
- `revision/[type]` - Revision passes (dialogue, action, etc.)

### Commit Format
```
type(scope): description

Types: scene, dialogue, action, structure, revision, notes, format, docs
```

Examples:
- `scene(opening): add bar confrontation`
- `dialogue(danny): refine raccoon monologue`
- `revision(continuity): fix timeline inconsistency`

---

## Key Principles

1. **Validate before commit**: Run `/check-format` before pushing
2. **Use branches**: Keep main clean for stable drafts
3. **Track continuity**: Maintain character, timeline, prop consistency
4. **Export often**: Check your work in final format
5. **Protect custom content**: `protectedPaths` in project.json won't be overwritten by template sync

---

## Optional: Marketplace Plugins

**The base template is complete.** All 11 agents, 24 skills, and 30 commands work out of the box. You can start writing immediately with `/start-scene`.

For enhanced workflows (showrunner mode, advanced methodology), you can optionally install marketplace plugins:

```bash
# Screenplay projects
/plugin install wtfb-screenwriting@github.com/bybren-llc/wtfb-claude-marketplace/plugins/screenwriting

# Novel projects (when available)
/plugin install wtfb-novel-writing@github.com/bybren-llc/wtfb-claude-marketplace/plugins/novel-writing
```

---

## Marketing & Platform Integration

This project integrates with the WTFB platform via `marketing/wtfb-marketing.json`:
- **Commerce**: Digital downloads, merchandise, services
- **Analytics**: PostHog event tracking
- **Funding**: Crowdfunding tiers
- **Rights**: Ownership and licensing info

See the marketing config for details on platform integration.
