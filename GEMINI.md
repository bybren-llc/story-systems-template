# WTFB Project - Gemini CLI Instructions

> This file provides guidance to Google's Gemini CLI for this creative project.

## Project Overview

This is a WTFB (Words To Film By) creative project. Check `.wtfb/project.json` for project type (screenplay, novel, film-production).

## Multi-Agent Harness

This project uses an 11-agent team for collaborative development. See `AGENTS.md` for the complete team reference.

### Loading Agents
@.gemini/agents/story-analyst.md
@.gemini/agents/story-architect.md
@.gemini/agents/dialogue-writer.md
@.gemini/agents/scene-writer.md
@.gemini/agents/scene-annotator.md
@.gemini/agents/continuity-editor.md
@.gemini/agents/script-supervisor.md
@.gemini/agents/standards-reviewer.md
@.gemini/agents/research-specialist.md
@.gemini/agents/production-coordinator.md
@.gemini/agents/session-manager.md

### Loading Skills (24 Skills)
@.gemini/skills/fountain-syntax/SKILL.md
@.gemini/skills/story-structure/SKILL.md
@.gemini/skills/dialogue-craft/SKILL.md
@.gemini/skills/scene-analysis/SKILL.md
@.gemini/skills/continuity-tracking/SKILL.md
@.gemini/skills/story-check/SKILL.md
@.gemini/skills/arc-check/SKILL.md
@.gemini/skills/character-arcs/SKILL.md
@.gemini/skills/character-dialogue/SKILL.md
@.gemini/skills/character-interview/SKILL.md
@.gemini/skills/action-description/SKILL.md
@.gemini/skills/transitions/SKILL.md
@.gemini/skills/scene-headings/SKILL.md
@.gemini/skills/title-page/SKILL.md
@.gemini/skills/logline/SKILL.md
@.gemini/skills/synopsis/SKILL.md
@.gemini/skills/pitch-worksheet/SKILL.md
@.gemini/skills/power-analysis/SKILL.md
@.gemini/skills/theme-discovery/SKILL.md
@.gemini/skills/writers-room/SKILL.md
@.gemini/skills/rewriting-methodology/SKILL.md
@.gemini/skills/format-export/SKILL.md
@.gemini/skills/page-estimation/SKILL.md
@.gemini/skills/glossary-reference/SKILL.md

## Project Structure

```
*.fountain           # Main screenplay (if screenplay project)
manuscript/          # Novel content (if novel project)
sourcematerials/     # Research, references, images
exports/             # Generated outputs (PDF, FDX, HTML)
templates/           # Beat sheets, character registries
patterns/            # Reusable structural patterns
docs/                # Project documentation
marketing/           # Marketing materials and config
.gemini/             # This harness
  settings.json      # CLI configuration
  agents/            # 11 specialized agent profiles
  commands/          # 30 slash command definitions (TOML)
  skills/            # 24 knowledge base modules
```

## Available Commands (30 Commands)

### Workflow Commands
| Command | Purpose |
|---------|---------|
| `/start-project` | Initialize new screenplay project |
| `/start-scene` | Begin new scene development |
| `/end-session` | Complete session, commit progress |
| `/stuck` | Get help when blocked |

### Writing Commands
| Command | Purpose |
|---------|---------|
| `/new-scene` | Add formatted scene heading |
| `/new-character` | Add character with tracking |
| `/format-dialogue` | Format dialogue block |
| `/add-transition` | Insert transition element |
| `/add-note` | Add Fountain note |
| `/import` | Import existing screenplay |

### Analysis Commands
| Command | Purpose |
|---------|---------|
| `/analyze-structure` | Review narrative structure |
| `/analyze-character` | Analyze character arc |
| `/scene-list` | List all scenes |
| `/page-count` | Calculate page estimation |
| `/arc-check` | Validate character arcs |
| `/story-check` | Validate against 12 critical questions |
| `/power-analysis` | Analyze conflict dynamics |
| `/rewrite-check` | Apply 6-step rewriting methodology |

### Validation Commands (Quality Gates)
| Command | Purpose |
|---------|---------|
| `/check-format` | Validate Fountain syntax (BLOCKING) |
| `/check-continuity` | Verify consistency (BLOCKING) |

### Export Commands
| Command | Purpose |
|---------|---------|
| `/export-pdf` | Generate industry-standard PDF |
| `/export-fdx` | Generate Final Draft XML |
| `/export-html` | Generate HTML preview |
| `/export-all` | Generate all formats |

### Development Commands
| Command | Purpose |
|---------|---------|
| `/logline` | Create compelling logline |
| `/synopsis` | Generate one-page synopsis |
| `/pitch-worksheet` | Generate pitch worksheet |
| `/character-interview` | Conduct 80-question interview |
| `/theme-discovery` | Interactive theme exploration |
| `/writers-room` | Convene multi-agent session |

## Git Workflow

### Branch Patterns
- `scene/{slug}` - Single scene work
- `revision/{type}` - Full-script passes
- `character/{name}` - Character-focused work
- `structure/{change}` - Reorganization
- `fix/{issue}` - Targeted fixes
- `export/{format}` - Export preparation

### Commit Format
```
type(scope): description

Types: scene, dialogue, action, structure, revision, character, notes, format, docs, chore
```

## Validation Requirements

Before committing:
1. `/check-format` - Format validation must pass
2. `/check-continuity` - Consistency verified
3. Spell check passes
4. Self-review completed

## Agent Invocation

Invoke agents by role:
```
Acting as the Story Architect, evaluate the three-act structure...
Acting as the Dialogue Writer, refine the voice for [character]...
Acting as the Continuity Editor, verify timeline consistency...
```

## Quality Gates

The Script Supervisor controls quality gates:
- Pre-commit validation
- PR merge requirements
- Export readiness

The Story Architect has stop-the-line authority for structural issues.

## Core Writer Loop

The evidence-based writer loop:
1. `/start-scene` - Begin work with context
2. `/check-format` - Validate Fountain syntax
3. `/check-continuity` - Verify consistency
4. `/export-pdf` - Generate output
5. `/end-session` - Commit and close cleanly

## See Also

- `AGENTS.md` - Complete agent team reference
- `.gemini/README.md` - Harness documentation
- `.gemini/settings.json` - CLI configuration
- `docs/WORKFLOW.md` - Full workflow documentation
- `docs/CONTRIBUTING.md` - Contribution guidelines
