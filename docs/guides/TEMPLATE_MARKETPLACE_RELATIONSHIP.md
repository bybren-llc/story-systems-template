# Template & Marketplace Relationship

This document explains how the WTFB template and marketplace work together, and why they're structured as separate but complementary repositories.

## The WTFB Ecosystem

WTFB provides creative writing tools through two main channels:

```
┌─────────────────────────────────────────────────────────────────┐
│                         WTFB Ecosystem                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────┐    ┌─────────────────────────────┐  │
│  │  wtfb-projects-       │    │  wtfb-claude-marketplace    │  │
│  │  template             │    │                             │  │
│  │  (OSS Foundation)     │◄───┤  (Premium Enhancements)     │  │
│  │                       │    │                             │  │
│  │  • 11 agents          │    │  • wtfb-screenwriting       │  │
│  │  • 24 skills          │    │  • wtfb-novel-writing       │  │
│  │  • 30 commands        │    │  • wtfb-film-production     │  │
│  │  • Hooks & patterns   │    │  • Future plugins           │  │
│  └───────────────────────┘    └─────────────────────────────┘  │
│                                                                 │
│  Free for everyone            Paid subscription required        │
└─────────────────────────────────────────────────────────────────┘
```

## Why Two Repositories?

### Template Repository

**Purpose**: Provide a complete, functional creative writing toolset that works out of the box.

**Philosophy**: "Includes the team and core harness."

The template is designed so that any writer can:
- Clone the repository
- Start writing immediately
- Access all 11 agents and 24 skills
- Export to industry-standard formats (PDF, FDX)
- Validate their work before submission

No plugins required. No subscription needed. Full functionality.

### Marketplace Repository

**Purpose**: Provide professional enhancements for writers who want more.

**Philosophy**: "Adds premium enhancements to the existing team."

The marketplace offers:
- Enhanced versions of template skills
- Professional workflows (showrunner, production)
- Advanced diagnostics and analytics
- Priority support

Plugins enhance or replace template capabilities - they don't duplicate the base team.

## What's In Each

### Template (story-systems-template)

| Category | Contents |
|----------|----------|
| **Agents** | Story Architect, Dialogue Writer, Scene Writer, Continuity Editor, Script Supervisor, Standards Reviewer, Research Specialist, Production Coordinator, Session Manager, Story Analyst, Scene Annotator |
| **Skills** | story-structure, dialogue-craft, fountain-syntax, character-arcs, arc-check, scene-analysis, continuity-tracking, power-analysis, logline, synopsis, theme-discovery, pitch-worksheet, rewriting-methodology, page-estimation, format-export, title-page, scene-headings, character-dialogue, character-interview, action-description, transitions, story-check, glossary-reference, writers-room |
| **Commands** | 30 workflow commands (/export-pdf, /check-format, /analyze-structure, etc.) |
| **Hooks** | Session management, pre-commit validation, format checking |
| **Patterns** | Beat sheets, character registries, templates |

### Marketplace (wtfb-claude-marketplace)

| Plugin | Capabilities |
|--------|--------------|
| **wtfb-screenwriting** | Advanced structural analysis, beat diagnostics, showrunner workflows, production rewrite tools |
| **wtfb-novel-writing** | Chapter pacing, narrative arc tools, word count targets, prose polish |
| **wtfb-film-production** | Call sheets, scheduling, budget tracking, location management |

## The "Dolls and Dresses" Metaphor

Think of it this way:

- **Template = The dolls**: A complete set of action figures (agents) with full articulation and accessories (skills, commands). You can play immediately.

- **Marketplace = The dresses**: Premium outfits and accessories that enhance what the dolls can do. New costumes (enhanced skills), vehicles (workflows), play sets (production tools).

The dolls work without dresses. The dresses enhance the dolls.

## Key Principles

### 1. Template is Complete

The template ships as a fully functional creative writing environment. No capabilities are artificially limited to sell plugins.

### 2. Marketplace is Enhancement

Plugins add value on top of the template. They don't gate basic functionality.

### 3. No Duplication

Marketplace plugins do not copy template content. They use `extends` or `replaces` to relate to template capabilities.

### 4. Clean Separation

- Template uses the `wtfb:` namespace
- Plugins use their own namespace (e.g., `wtfb-screenwriting:`)
- No naming conflicts, clear ownership

### 5. User Choice

Users control which capabilities are active via `.wtfb/project.json` precedence configuration.

## Upgrade Path

### Starting with Template

1. Clone or use the template
2. Write your screenplay/novel
3. Use all 11 agents and 24 skills freely
4. Export to PDF, FDX, HTML

### Adding Marketplace Plugins

When you're ready for more:

1. Subscribe to WTFB Pro
2. Install desired plugins:
   ```
   /plugin install wtfb-screenwriting@github.com/bybren-llc/wtfb-claude-marketplace/plugins/screenwriting
   ```
3. Configure precedence if needed
4. Access enhanced capabilities

### What Happens When You Install a Plugin

| Relationship | Before Plugin | After Plugin |
|--------------|---------------|--------------|
| `provides` | N/A | New capability available |
| `extends` | `wtfb:story-structure` | Both available; `wtfb-screenwriting:advanced-structure` preferred in pro mode |
| `replaces` | `wtfb:story-structure` | `wtfb-screenwriting:story-structure-pro` supersedes base |

## For Contributors

### Contributing to Template

The template welcomes community contributions:
- Bug fixes
- Documentation improvements
- New patterns and templates
- Skill enhancements (following the foundation philosophy)

Open a PR at [story-systems-template](https://github.com/bybren-llc/story-systems-template).

### Contributing to Marketplace

Marketplace plugins require approval:
- Must follow capability contract spec
- Must not duplicate template functionality
- Must provide genuine enhancement value

Contact the team for plugin submission process.

### What NOT to Do

- Don't copy marketplace features into template
- Don't gate template features to force plugin usage
- Don't create duplicate capabilities with same purpose

## Version Compatibility

Plugins declare compatibility with template versions:

```yaml
compat:
  template: ">=1.0.0 <2.0.0"
```

This ensures:
- Plugins work with correct template versions
- Breaking changes don't silently fail
- Upgrade paths are clear

## Summary

| Aspect | Template | Marketplace |
|--------|----------|-------------|
| **Purpose** | Foundation | Enhancement |
| **Access** | Free (OSS) | Paid subscription |
| **Completeness** | Fully functional | Additive |
| **Agents** | 11 (complete team) | New premium agents |
| **Skills** | 24 (foundation) | Enhanced/new skills |
| **Namespace** | `wtfb:` | `{plugin}:` |
| **Contributions** | Community open | Approval required |

The template gives you the team. The marketplace gives them superpowers.

## Related Documentation

- [Capability Contract](./CAPABILITY_CONTRACT.md) - Technical spec for capability identification
- [Plugin Architecture](./PLUGIN_ARCHITECTURE.md) - How plugins extend the template
- [User Access Tiers](./USER_ACCESS_TIERS.md) - Who gets what features
