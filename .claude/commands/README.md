# WTFB Commands

These commands are part of the **Words To Film By™** multi-agent harness.

## License

**License:** MIT (see [/LICENSE](/LICENSE))
**Copyright:** © 2026 J. Scott Graham ([@cheddarfox](https://github.com/cheddarfox)) / [Bybren LLC](https://github.com/bybren-llc)
**Attribution:** Required per [/NOTICE](/NOTICE)

## Intellectual Property

The command system architecture and workflow methodology are intellectual property of Bybren LLC.

## Command Structure

Each command uses **YAML frontmatter** for metadata, enabling both human invocation and agent automation:

```markdown
---
description: Brief description of what the command does.
---

# /command-name

Full documentation follows...
```

### Frontmatter Fields

| Field | Required | Purpose |
|-------|----------|---------|
| `description` | Yes | One-line description (used by agents and help systems) |

### Why Frontmatter Matters

The YAML frontmatter allows:
- **Agents** to understand command purpose without parsing full documentation
- **Validation** to ensure all commands have proper descriptions
- **Help systems** to generate command listings automatically
- **IDE integrations** to provide autocomplete and tooltips

## Commands by Category

### Workflow

| Command | Description |
|---------|-------------|
| `/start-scene` | Begin work on a scene with proper workflow setup |
| `/start-project` | Welcome new users and set up screenplay project |
| `/end-session` | Complete session cleanly with state preservation |
| `/stuck` | Analyze project state and provide context-aware guidance |
| `/import` | Import existing screenplay or source material |

### Writing

| Command | Description |
|---------|-------------|
| `/new-scene` | Insert a properly formatted scene heading |
| `/new-character` | Add a new character with proper introduction and tracking |
| `/format-dialogue` | Structure a dialogue block correctly in Fountain format |
| `/add-transition` | Insert a transition element in proper Fountain format |
| `/add-note` | Add a Fountain note (hidden in output) to the screenplay |

### Analysis

| Command | Description |
|---------|-------------|
| `/analyze-structure` | Perform three-act structure analysis |
| `/analyze-character` | Analyze a character's arc, appearances, and development |
| `/scene-list` | List all scenes with page estimates and metadata |
| `/page-count` | Estimate current page count and runtime |
| `/arc-check` | Track and validate character arcs throughout screenplay |
| `/story-check` | Validate screenplay against 12 essential story questions |
| `/power-analysis` | Analyze power dynamics and conflict structure |
| `/check-format` | Validate Fountain syntax and formatting |
| `/check-continuity` | Validate consistency across the screenplay |
| `/rewrite-check` | Apply the WTFB 6-step rewriting methodology |

### Development

| Command | Description |
|---------|-------------|
| `/logline` | Create a compelling logline using WTFB hook structure |
| `/synopsis` | Generate a one-page synopsis per WTFB requirements |
| `/pitch-worksheet` | Generate a structured pitch worksheet |
| `/character-interview` | Conduct in-depth character interview (80-question methodology) |
| `/theme-discovery` | Run interactive theme exploration exercise |
| `/writers-room` | Convene 6-agent collaborative pre-production session |

### Export

| Command | Description |
|---------|-------------|
| `/export-pdf` | Generate a formatted PDF from Fountain screenplay |
| `/export-fdx` | Generate a Final Draft XML file from Fountain |
| `/export-html` | Generate an HTML preview of the screenplay |
| `/export-all` | Generate all output formats (PDF, FDX, HTML) at once |

## Usage

Commands are invoked in Claude Code with a forward slash:

```
/start-scene Opening confrontation in the bar
/check-format
/export-pdf
```

## Adding New Commands

New commands must follow the [Capability Contract](/docs/guides/CAPABILITY_CONTRACT.md):

1. Create `command-name.md` in this directory
2. Include YAML frontmatter with `description` field
3. Use `# /command-name` as the first heading
4. Document arguments, workflow, and success criteria
5. Run `npm run validate:capabilities` to verify compliance

For complete documentation, see [/docs/REFERENCE.md](/docs/REFERENCE.md).
