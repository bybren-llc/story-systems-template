# CODEX.md - OpenAI GPT/Codex Integration

This file provides guidance to OpenAI GPT and Codex models when working with this WTFB creative project.

## System Context

You are assisting with a **WTFB (Words To Film By)** creative project. This template supports screenplays, novels, and film production projects.

## Schema Reference

Full capabilities are defined in: `.wtfb/ai-harness/schema.json`

Project configuration is in: `.wtfb/project.json`

---

## Command Interface

Process commands prefixed with `/`. Available commands vary by project type.

### Universal Commands
| Command | Description |
|---------|-------------|
| `/help` | Show available commands |
| `/status` | Show project status |

### Screenplay Commands
| Command | Description |
|---------|-------------|
| `/start-scene [desc]` | Begin scene work |
| `/check-format` | Validate Fountain syntax |
| `/new-scene [location]` | Add scene heading |
| `/new-character [name]` | Add character |
| `/export-pdf` | Generate PDF |
| `/writers-room` | Multi-agent session |

### Novel Commands
| Command | Description |
|---------|-------------|
| `/start-chapter [num]` | Begin chapter |
| `/outline` | View/edit outline |
| `/character [name]` | Character sheet |
| `/word-count` | Manuscript length |

---

## Validation Requirements

Before suggesting commits:
1. Validate format (Fountain for screenplays, Markdown for prose)
2. Check spelling against project dictionary
3. Verify continuity with existing content
4. Ensure commit message follows format

### Commit Message Format
```
type(scope): description

Types: scene, dialogue, action, structure, revision, notes, format, docs
```

---

## Response Structure

When responding to requests:

1. **Acknowledge** the task and identify project type
2. **Propose changes** with context (file paths, line references)
3. **Validate** - note any format or continuity issues
4. **Suggest next steps** - what the user might want to do next

---

## Project Structure

```
.
├── *.fountain              # Screenplay (or manuscript/ for novels)
├── .wtfb/
│   ├── project.json        # Project configuration
│   └── ai-harness/         # AI instruction files
├── marketing/
│   └── wtfb-marketing.json # Platform integration
├── templates/              # Beat sheets, character registry
├── sourcematerials/        # Research and reference
├── exports/                # Generated outputs
└── docs/                   # Documentation
```

---

## Format Specifications

### Fountain (Screenplays)
- Scene headings: `INT./EXT. LOCATION - TIME`
- Character names: UPPERCASE
- Dialogue: Below character name, indented
- Transitions: Right-aligned, end with `:`
- Notes: `[[hidden notes]]`

### Markdown (Novels/Docs)
- Headings: `#` through `######`
- Emphasis: `*italic*`, `**bold**`
- Dialogue: Quotation marks
- Scene breaks: `---`

---

## Key Principles

1. **Preserve voice** - Maintain the project's established style
2. **Validate first** - Check format before committing
3. **Branch appropriately** - Use `scene/`, `chapter/`, or `revision/` branches
4. **Document changes** - Clear commit messages
5. **Respect protected paths** - Don't modify files in `protectedPaths`
