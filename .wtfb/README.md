# .wtfb Directory

This directory contains WTFB-specific configuration that controls how your project integrates with the WTFB ecosystem, including AI assistants, template syncing, and plugin management.

## Directory Structure

```
.wtfb/
├── project.json           # Core project configuration
└── ai-harness/            # Multi-AI instruction files
    ├── CLAUDE.md          # Claude Code instructions
    ├── GEMINI.md          # Google Gemini instructions
    ├── CODEX.md           # OpenAI GPT/Codex instructions
    └── schema.json        # Unified capability schema
```

## project.json

The central configuration file for your WTFB project.

### Project Type

```json
{
  "projectType": "screenplay|novel|film-production",
  "name": "your-project-name",
  "version": "1.0.0"
}
```

The project type determines:
- Which validation rules apply
- Which plugins are recommended
- Which commands are available
- How exports are generated

### Template Syncing

```json
{
  "template": {
    "upstream": "https://github.com/bybren-llc/story-systems-template",
    "version": "1.0.0",
    "lastSync": "2026-01-08T00:00:00Z"
  }
}
```

This enables your project to receive updates from the template while preserving your custom content.

**How it works:**
1. Weekly GitHub Action checks for upstream changes
2. Creates a PR if updates are available
3. Merges only `syncPaths`, protecting your content

### Protected Paths

```json
{
  "protectedPaths": [
    "*.fountain",
    "manuscript/**",
    "sourcematerials/**",
    "docs/v*/**",
    "README.md",
    "marketing/wtfb-marketing.json"
  ]
}
```

These paths will NEVER be overwritten by template sync. Your creative content is always safe.

### Sync Paths

```json
{
  "syncPaths": [
    ".github/workflows/**",
    "scripts/**",
    ".wtfb/ai-harness/**",
    "templates/**"
  ]
}
```

These paths CAN be updated from the upstream template. This keeps your tooling current.

### Plugin Configuration

```json
{
  "plugins": {
    "installed": [
      {
        "name": "wtfb-screenwriting",
        "version": "1.2.0",
        "source": "github.com/bybren-llc/cheddarfox-claude-marketplace/plugins/screenwriting"
      }
    ],
    "optional": [
      {
        "name": "wtfb-film-production",
        "when": "film-production"
      }
    ]
  }
}
```

Plugins extend your project with additional agents, commands, and skills.

## ai-harness Directory

Contains instruction files for multiple AI assistants, enabling your project to work with Claude, Gemini, Codex, and future AI systems.

### Why Multiple AI Files?

Different AI systems have different:
- Instruction formats
- Capability sets
- Tool interfaces
- Context handling

The ai-harness provides portable instructions that each AI can understand.

### schema.json

The unified capability schema defines what any AI assistant can do with your project:

```json
{
  "capabilities": {
    "writing": {
      "scene": true,
      "dialogue": true,
      "action": true
    },
    "analysis": {
      "structure": true,
      "character": true,
      "continuity": true
    }
  },
  "commands": {
    "screenplay": [
      {"name": "start-scene", "args": "[description]"},
      {"name": "check-format", "args": null}
    ]
  },
  "agents": [
    {"id": "story-architect", "role": "Structure design"},
    {"id": "dialogue-writer", "role": "Character voice"}
  ]
}
```

### CLAUDE.md

Primary instruction file for Claude Code. This is symlinked to the root `CLAUDE.md` for easy access.

Contains:
- Project overview and type detection
- Available commands by project type
- Format references (Fountain, Markdown)
- Repository structure guide
- Git workflow conventions
- Validation instructions
- Plugin installation guide

### GEMINI.md

Instructions for Google Gemini. Adapted for Gemini's instruction format with:
- Capability mapping to schema.json
- Command interface documentation
- File location references
- Format requirements

### CODEX.md

Instructions for OpenAI GPT and Codex models. Includes:
- System context setup
- Command table format
- Validation requirements
- Response structure guidelines

## Usage

### Reading Configuration

```bash
# Get project type
jq -r '.projectType' .wtfb/project.json

# Get upstream template URL
jq -r '.template.upstream' .wtfb/project.json

# List installed plugins
jq -r '.plugins.installed[].name' .wtfb/project.json
```

### Modifying Configuration

The `init-project.sh` script updates this file automatically. For manual changes:

```bash
# Update project type
jq '.projectType = "novel"' .wtfb/project.json > tmp.json && mv tmp.json .wtfb/project.json
```

### Adding Custom Protections

To protect additional paths from template sync:

```json
{
  "protectedPaths": [
    "*.fountain",
    "my-custom-directory/**",
    "important-file.md"
  ]
}
```

## Best Practices

1. **Don't delete this directory** - It's essential for WTFB integration
2. **Keep schema.json in sync** - If you add custom capabilities, update the schema
3. **Update AI files together** - Changes to CLAUDE.md should be reflected in GEMINI.md and CODEX.md
4. **Use semantic versioning** - Update `version` in project.json when making significant changes
5. **Document plugin installations** - Keep the `plugins.installed` array current
