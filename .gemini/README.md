# Gemini CLI Harness

This directory contains the multi-agent harness for Google's Gemini CLI, providing 11 agents, 30 commands, and 24 skills for screenwriting workflows.

## Structure

```
.gemini/
├── settings.json    # CLI configuration (official schema)
├── agents/          # 11 specialized agent profiles
├── commands/        # 30 slash command definitions (TOML)
├── skills/          # 24 knowledge base modules
└── README.md        # This file
```

## Official Format Compliance

This harness uses the official Gemini CLI formats:

- **Commands**: TOML with `description` + `prompt` fields only
- **Skills**: Directory-based with `SKILL.md` containing YAML frontmatter
- **Settings**: Schema-validated via `$schema` reference

## Agent Team (11 Agents)

The harness coordinates 11 specialized agents organized into four functional areas:

### Story & Structure
- **Story Analyst** - Break down concepts into scene-by-scene analysis
- **Story Architect** - Define and validate narrative structure (VETO AUTHORITY)

### Writing
- **Dialogue Writer** - Create distinct character voices and subtext
- **Scene Writer** - Handle visual storytelling and action description
- **Scene Annotator** - Manage notes, synopses, and organization

### Quality & Continuity
- **Continuity Editor** - Track chronology and consistency
- **Script Supervisor** - Verify format and syntax (GATE AUTHORITY)
- **Standards Reviewer** - Ensure industry-standard compliance

### Research & Production
- **Research Specialist** - Handle accuracy and authenticity
- **Production Coordinator** - Manage exports and delivery
- **Session Manager** - Initialize sessions and coordinate tasks

## Commands (30 Commands)

### Workflow Commands
| Command | Description |
|---------|-------------|
| `/start-project` | Initialize new screenplay project |
| `/start-scene` | Begin new scene development |
| `/end-session` | Complete session, commit progress |
| `/stuck` | Get help when blocked |

### Writing Commands
| Command | Description |
|---------|-------------|
| `/new-scene` | Add formatted scene heading |
| `/new-character` | Add character with tracking |
| `/format-dialogue` | Format dialogue block |
| `/add-transition` | Insert transition element |
| `/add-note` | Add Fountain note |
| `/import` | Import existing screenplay |

### Analysis Commands
| Command | Description |
|---------|-------------|
| `/analyze-structure` | Review narrative structure |
| `/analyze-character` | Analyze character arc |
| `/scene-list` | List all scenes |
| `/page-count` | Calculate page estimation |
| `/arc-check` | Validate character arcs |
| `/story-check` | Validate against 12 critical questions |
| `/power-analysis` | Analyze conflict dynamics |
| `/rewrite-check` | Apply 6-step rewriting methodology |

### Validation Commands (Quality Gates)
| Command | Description |
|---------|-------------|
| `/check-format` | Validate Fountain syntax (BLOCKING) |
| `/check-continuity` | Verify consistency (BLOCKING) |

### Export Commands
| Command | Description |
|---------|-------------|
| `/export-pdf` | Generate industry-standard PDF |
| `/export-fdx` | Generate Final Draft XML |
| `/export-html` | Generate HTML preview |
| `/export-all` | Generate all formats |

### Development Commands
| Command | Description |
|---------|-------------|
| `/logline` | Create compelling logline |
| `/synopsis` | Generate one-page synopsis |
| `/pitch-worksheet` | Generate pitch worksheet |
| `/character-interview` | Conduct 80-question interview |
| `/theme-discovery` | Interactive theme exploration |
| `/writers-room` | Convene multi-agent session |

## Skills (24 Skills)

### Craft Skills
| Skill | Purpose |
|-------|---------|
| `fountain-syntax` | Complete Fountain format reference |
| `scene-headings` | Scene heading formatting rules |
| `title-page` | Title page formatting |
| `character-dialogue` | Character and dialogue formatting |
| `action-description` | Action writing techniques |
| `transitions` | Transition conventions |

### Story Skills
| Skill | Purpose |
|-------|---------|
| `story-structure` | Three-act structure framework |
| `story-check` | 12 critical story questions |
| `scene-analysis` | Scene evaluation techniques |
| `power-analysis` | Conflict dynamics analysis |

### Character Skills
| Skill | Purpose |
|-------|---------|
| `character-arcs` | Arc development frameworks |
| `arc-check` | Character arc validation |
| `character-interview` | 80-question interview framework |
| `dialogue-craft` | Dialogue writing techniques |

### Development Skills
| Skill | Purpose |
|-------|---------|
| `logline` | Hook/logline writing |
| `synopsis` | One-page synopsis writing |
| `pitch-worksheet` | Pitch development framework |
| `theme-discovery` | Personal theme mining |
| `writers-room` | Collaborative pre-production |

### Process Skills
| Skill | Purpose |
|-------|---------|
| `continuity-tracking` | Consistency systems |
| `rewriting-methodology` | 6-step rewrite process |
| `format-export` | Export procedures |
| `page-estimation` | Page count calculation |
| `glossary-reference` | Industry terminology |

## Core Writer Loop

Evidence-based workflow:
1. `/start-scene` - Begin work with context loaded
2. `/check-format` - Validate Fountain syntax
3. `/check-continuity` - Verify story consistency
4. `/export-pdf` - Generate output artifact
5. `/end-session` - Commit and close cleanly

## Stop-the-Line Gates

Two agents have authority to halt work:
- **Story Architect**: Structural issues
- **Script Supervisor**: Format/quality issues

## Usage

Agents and skills are loaded via the root `GEMINI.md` file using imports:

```markdown
@.gemini/agents/story-analyst.md
@.gemini/skills/story-structure/SKILL.md
```

## Customization

Add project-specific agents, commands, or skills by creating new files in the appropriate directories. Update `GEMINI.md` to import them.

## Validation

Run the project validation pipeline:
```bash
npm run validate
```

## See Also

- `GEMINI.md` - Root configuration with imports
- `AGENTS.md` - Complete agent team reference
- `docs/CONTRIBUTING.md` - Contribution guidelines
