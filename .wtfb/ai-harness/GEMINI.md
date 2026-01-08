# GEMINI.md - Google Gemini Integration

This file provides guidance to Google Gemini when working with this WTFB creative project.

## Project Context

This is a **WTFB (Words To Film By)** creative project. The project type and configuration are defined in `.wtfb/project.json`.

## Capability Mapping

Reference `.wtfb/ai-harness/schema.json` for full capability definitions.

### Available Operations

1. **Content Creation**
   - Create scenes, chapters, dialogue, descriptions
   - Draft action lines and visual descriptions
   - Develop character voices

2. **Analysis**
   - Structure analysis (beat sheets, act breaks)
   - Character arc tracking
   - Continuity verification
   - Theme identification

3. **Validation**
   - Format checking (Fountain for screenplays, Markdown for novels)
   - Spelling and grammar
   - Industry standard compliance

4. **Export**
   - Generate PDF, FDX (Final Draft), HTML, EPUB formats

---

## Instruction Format

Commands use `/command-name [args]` format.

### Common Commands
- `/help` - Show available commands
- `/status` - Show project status

### Screenplay Commands
- `/start-scene [description]` - Begin work on a scene
- `/check-format` - Validate Fountain syntax
- `/new-character [name]` - Add character to registry
- `/export-pdf` - Generate screenplay PDF

### Novel Commands
- `/start-chapter [number]` - Begin chapter work
- `/outline` - View story outline
- `/word-count` - Current manuscript length

---

## File Locations

| Purpose | Path |
|---------|------|
| Main content | `*.fountain` (screenplay) or `manuscript/` (novel) |
| Project config | `.wtfb/project.json` |
| Marketing config | `marketing/wtfb-marketing.json` |
| Templates | `templates/` |
| Source materials | `sourcematerials/` |
| Exports | `exports/` |

---

## Format Requirements

### Screenplays (Fountain Format)
```fountain
INT. LOCATION - TIME

Action description in present tense.

CHARACTER NAME
(parenthetical)
Dialogue goes here.
```

### Novels (Markdown Format)
```markdown
# Chapter Title

Prose content in past or present tense, depending on narrative style.

"Dialogue uses quotation marks," she said.
```

---

## Output Requirements

1. Use **Fountain format** for screenplays
2. Use **Markdown** for prose and documentation
3. Maintain existing style and voice from the project
4. Follow commit message format: `type(scope): description`
5. Validate before suggesting commits

---

## Validation Commands

```bash
npm run validate        # Full validation
npm run lint:fountain   # Fountain syntax
npm run lint:md         # Markdown linting
npm run lint:spell      # Spell check
```

---

## Key Files to Reference

1. `.wtfb/project.json` - Project type and configuration
2. `.wtfb/ai-harness/schema.json` - Full capability definitions
3. `marketing/wtfb-marketing.json` - Platform integration
4. `templates/` - Available templates for the project type
