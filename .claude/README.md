# Claude Code Harness

This directory contains the multi-agent harness for Claude Code.

## Structure

```
.claude/
├── settings.json    # Runtime config — wires the hooks below (git guardrails, format cues, banner)
├── model-routing.md # Per-role model routing (Fable 5 / Opus 4.8 / Haiku 4.5)
├── agents/          # 11 specialized agent profiles
├── commands/        # Slash command definitions (incl. /bible)
├── skills/          # Knowledge base modules (SKILL.md files)
├── hooks/           # Hook helper scripts, invoked by settings.json
├── resources/       # Patterns and reference materials
└── README.md
```

## Harness Mechanics

Beyond the agent team, the harness ships operational machinery:

- **Wired hooks** (`settings.json` → `hooks/*.sh`): block direct pushes to `main` and pushes with
  uncommitted changes, cue Fountain-format + conventional-commit reminders, and print a session
  banner. See [hooks/README.md](hooks/README.md).
- **Per-role model routing** ([model-routing.md](model-routing.md)): Fable 5 for prose roles,
  Opus 4.8 for structure/review/orchestration, Haiku 4.5 for mechanical work.
- **Story Bible** (`story-bible/` at repo root): a validated, drift-aware continuity vault —
  author cards with `/bible`, validate with `npm run lint:bible` (CI-gated), catch stale cards
  with `npm run bible:drift`.
- **CodeRabbit** (`.coderabbit.yaml` at repo root): AI review tuned for a writing harness —
  rigorous on tooling/frontmatter, hands-off on creative content.
- **Contributing** ([/CONTRIBUTING.md](/CONTRIBUTING.md)): project-management-agnostic
  ticket/branch/PR conventions.

## Agent Team

The harness coordinates 11 specialized agents organized into four functional areas:

### Story & Structure
- **Story Analyst** - Break down concepts into scene-by-scene analysis
- **Story Architect** - Define and validate narrative structure (stop-the-line authority)

### Writing
- **Dialogue Writer** - Create distinct character voices and subtext
- **Scene Writer** - Handle visual storytelling and action description
- **Scene Annotator** - Manage notes, synopses, and organization

### Quality & Continuity
- **Continuity Editor** - Track chronology and consistency
- **Script Supervisor** - Verify format and syntax (quality gates)
- **Standards Reviewer** - Ensure industry-standard compliance

### Research & Production
- **Research Specialist** - Handle accuracy and authenticity
- **Production Coordinator** - Manage exports and delivery
- **Session Manager** - Initialize sessions and coordinate tasks

## Available Commands

| Command | Purpose |
|---------|---------|
| `/start-scene` | Begin new scene development |
| `/check-format` | Validate Fountain syntax |
| `/check-continuity` | Verify consistency |
| `/analyze-structure` | Review narrative structure |
| `/analyze-character` | Deep character analysis |
| `/export-pdf` | Generate PDF output |
| `/export-fdx` | Export to Final Draft format |
| `/scene-list` | List all scenes |
| `/page-count` | Calculate page estimation |
| `/new-character` | Add a new character |
| `/writers-room` | Collaborative brainstorming |
| `/stuck` | Get help when blocked |

## Skills Library

Skills provide specialized knowledge modules:

- **Fountain Syntax** - Format fundamentals
- **Story Structure** - Narrative frameworks
- **Dialogue Craft** - Voice and subtext techniques
- **Scene Analysis** - Scene construction patterns
- **Character Arcs** - Arc development
- **Continuity Tracking** - Consistency verification

## Capability Identification

All capabilities in the harness use a canonical identifier (`wtfbId`) for registry and plugin compatibility:

### Namespace Convention

| Source | Namespace | Example |
|--------|-----------|---------|
| Template (this repo) | `wtfb:` | `wtfb:story-structure` |
| Marketplace plugins | `{plugin}:` | `wtfb-screenwriting:advanced-structure` |

### Requirement by Type

| Capability | wtfbId Required? |
|------------|------------------|
| Skills | **REQUIRED** |
| Commands | **RECOMMENDED** |
| Hooks | **OPTIONAL** |
| Agents | **OPTIONAL** |

### Example Skill Frontmatter

```yaml
---
name: story-structure
wtfbId: wtfb:story-structure
description: Three-act screenplay structure with beat placement.
---
```

See [Capability Contract](../docs/guides/CAPABILITY_CONTRACT.md) for full specification.

## Usage

Commands are invoked using slash syntax:

```
/check-format
/analyze-structure focus:acts
/export-pdf watermark:"DRAFT"
```

Agents are invoked by role:

```
Acting as the Story Architect, evaluate the three-act structure...
Acting as the Dialogue Writer, refine the voice for [character]...
```

## Integration with Claude Code

This harness works with Claude Code's plugin system. The root `CLAUDE.md` file loads this harness configuration.

## See Also

- [WTFB Claude Marketplace](https://github.com/bybren-llc/cheddarfox-claude-marketplace) for additional plugins
- `.gemini/` for Gemini CLI harness
- `AGENTS.md` for team reference
