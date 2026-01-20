# Technical Reference

Complete reference documentation for the Story Systems Template.

---

## Project Structure

```
your-project/
├── .claude/              # Claude Code harness
│   ├── agents/           # 11 specialized agent profiles
│   ├── commands/         # 30 slash commands
│   ├── skills/           # 26 knowledge modules
│   └── hooks/            # Hook configurations
├── .gemini/              # Gemini CLI harness
│   ├── agents/           # 11 agent profiles (mirrored)
│   ├── commands/         # 17 TOML commands
│   └── skills/           # Core skills
├── .wtfb/                # Project configuration
│   ├── project.json      # Type, plugins, sync settings
│   └── ai-harness/       # Multi-AI instructions
├── patterns/             # Story, scene, dialogue, character patterns
├── templates/            # Beat sheets, registries, worksheets
├── docs/                 # Project documentation
├── exports/              # Generated PDF, FDX, HTML
├── sourcematerials/      # Research, references
├── marketing/            # Platform integration
└── your-screenplay.fountain
```

---

## Agent Team

| Agent | Role | Authority |
|-------|------|-----------|
| **Story Architect** | Structure & beat placement | VETO (structure) |
| **Story Analyst** | Scene-by-scene analysis | Domain |
| **Dialogue Writer** | Character voice & subtext | Domain |
| **Scene Writer** | Visual storytelling | Domain |
| **Continuity Editor** | Timeline & consistency | Domain |
| **Script Supervisor** | Format compliance | GATE (quality) |
| **Standards Reviewer** | Industry standards | Domain |
| **Research Specialist** | Accuracy & authenticity | Domain |
| **Production Coordinator** | Exports & delivery | Domain |
| **Session Manager** | Workflow coordination | Workflow |
| **Scene Annotator** | Notes & organization | Domain |

See [AGENTS.md](../AGENTS.md) for complete agent profiles.

---

## Commands

### Workflow
| Command | Description |
|---------|-------------|
| `/start-scene [description]` | Begin scene work with context |
| `/start-project` | Initialize new project |
| `/end-session` | Complete session, commit progress |
| `/check-format` | Validate Fountain syntax |
| `/check-continuity` | Check consistency across script |
| `/stuck` | Get help when blocked |
| `/import` | Import existing screenplay |

### Writing
| Command | Description |
|---------|-------------|
| `/new-scene [location]` | Add formatted scene heading |
| `/new-character [name]` | Add character with tracking |
| `/format-dialogue [name]` | Format dialogue block |
| `/add-transition [type]` | Insert transition |
| `/add-note` | Add development note |

### Analysis
| Command | Description |
|---------|-------------|
| `/analyze-structure` | Full structure analysis |
| `/analyze-character [name]` | Character arc analysis |
| `/scene-list` | List all scenes |
| `/page-count` | Current page estimate |
| `/arc-check` | Verify character arcs |
| `/synopsis` | Generate story synopsis |

### Export
| Command | Description |
|---------|-------------|
| `/export-pdf` | Generate industry-standard PDF |
| `/export-fdx` | Generate Final Draft XML |
| `/export-html` | Generate HTML preview |
| `/export-all` | All export formats |

### WTFB Methodology
| Command | Description |
|---------|-------------|
| `/writers-room` | Convene 6-agent pre-production session |
| `/theme-discovery` | Personal theme mining |
| `/story-check` | Validate against 12 critical questions |
| `/power-analysis` | Character power dynamics |
| `/character-interview` | Deep character exploration |
| `/pitch-worksheet` | Develop pitch materials |
| `/logline` | Craft logline |
| `/rewrite-check` | Evaluate rewrite needs |

---

## Validation

```bash
# Run all validation
npm run validate

# Individual checks
npm run lint:fountain    # Fountain syntax
npm run lint:md          # Markdown lint
npm run lint:spell       # Spell check
```

### Pre-commit Hooks

Validation runs automatically on staged files via Husky + lint-staged.

---

## Branch Strategy

| Branch | Purpose |
|--------|---------|
| `main` | Stable drafts only |
| `draft/v1`, `draft/v2` | Major versions |
| `scene/[name]` | Scene-specific work |
| `revision/[type]` | Revision passes |
| `character/[name]` | Character development |
| `structure/[type]` | Structure changes |
| `fix/[issue]` | Bug fixes |
| `export/[format]` | Export preparation |

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

## Patterns Library

| Category | Patterns |
|----------|----------|
| **Story Structure** | Three-Act, Save the Cat!, Hero's Journey, Sequence Method |
| **Scene** | Confrontation, Discovery, Action, Montage, Flashback, Intercut |
| **Dialogue** | Exposition, Subtext, Dual Dialogue, Voice Differentiation |
| **Character** | Introduction, Arc Transformation, Relationship Dynamics |

See [patterns/](../patterns/) for complete pattern documentation.

---

## Templates

| Template | Purpose |
|----------|---------|
| `beat-sheet.md` | Scene-by-scene structure |
| `character-registry.md` | Character tracking |
| `treatment-template.md` | Story treatment outline |
| `continuity-report.md` | Continuity tracking |
| `screenplay-template.fountain` | Minimal .fountain starter |
| `synopsis-template.md` | Story synopsis |
| `arc-chart.md` | Character arc visualization |
| `power-worksheet.md` | Power dynamics analysis |
| `scene-grading.md` | Scene quality assessment |
| `parking-lot.md` | Ideas holding area |

---

## Configuration Files

| File | Purpose |
|------|---------|
| `.wtfb/project.json` | Project type, plugins, sync settings |
| `package.json` | npm scripts, dependencies |
| `.markdownlint-cli2.yaml` | Markdown lint rules |
| `cspell.json` | Spell check configuration |
| `.cspell/project-words.txt` | Custom dictionary |

---

## GitHub Workflows

| Workflow | Triggers | Purpose |
|----------|----------|---------|
| `validate.yml` | Push/PR | Type-aware validation |
| `sync-upstream.yml` | Weekly + manual | Template updates |
| `deploy-pages.yml` | Push to main | GitHub Pages deployment |

---

## Fountain Format Reference

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

## Related Documentation

| Document | Description |
|----------|-------------|
| [CLAUDE.md](../CLAUDE.md) | Claude Code instructions |
| [GEMINI.md](../GEMINI.md) | Gemini CLI instructions |
| [AGENTS.md](../AGENTS.md) | Full agent team reference |
| [WORKFLOW.md](WORKFLOW.md) | Git workflow guide |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guidelines |
| [WTFB-HARNESS-PAPER.md](WTFB-HARNESS-PAPER.md) | Architecture overview |
