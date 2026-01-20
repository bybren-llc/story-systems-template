# WTFB User Access Tiers

This document defines the access tiers for WTFB tools and who gets what based on their relationship with the ecosystem.

## Overview

WTFB provides creative writing tools through a tiered access model:

| Tier | Access | Cost |
|------|--------|------|
| Community | OSS Template | Free |
| Pro | Template + Marketplace Plugins | Paid subscription |
| Internal | Everything + Dev tools | Team access |

## Tier 1: Community (OSS Template)

**Who**: Anyone who uses the `story-systems-template` repository.

**Access**: Full template capabilities

**What's Included**:

| Category | Count | Examples |
|----------|-------|----------|
| Agents | 11 | Story Architect, Dialogue Writer, Scene Writer, etc. |
| Skills | 24 | story-structure, dialogue-craft, fountain-syntax, etc. |
| Commands | 30 | /export-pdf, /check-format, /analyze-structure, etc. |
| Hooks | 5 | Pre-commit validation, session management |
| Patterns | 6 | Beat sheets, character registries, templates |

**Support**: Community GitHub issues at [story-systems-template](https://github.com/bybren-llc/story-systems-template/issues)

**Best For**:
- Individual screenwriters starting out
- Writers who want a complete, functional toolset
- Contributors who want to improve the OSS ecosystem

## Tier 2: Pro (Marketplace Plugins)

**Who**: Paid subscribers with access to the WTFB Claude Marketplace.

**Access**: Everything in Community tier PLUS marketplace plugins

**What's Added**:

| Plugin | Features |
|--------|----------|
| wtfb-screenwriting | Enhanced structural analysis, showrunner workflows, beat diagnostics |
| wtfb-novel-writing | Chapter pacing, narrative arc tools, word count targets |
| wtfb-film-production | Call sheets, scheduling, budget tracking |

**Plugin Behavior**:
- Plugins **enhance** template capabilities (via `extends`)
- Some plugins may **replace** template capabilities (via `replaces`)
- User controls behavior via `.wtfb/project.json` precedence config

**Support**: Priority support channel

**Best For**:
- Professional screenwriters
- Writers' rooms and production teams
- Show runners managing multiple projects

## Tier 3: Internal (bybren-llc Team)

**Who**: Internal team members with org access.

**Access**: Everything in Pro tier PLUS development tools

**What's Added**:

| Category | Description |
|----------|-------------|
| Dev plugins | Unreleased features, experimental capabilities |
| Analytics | Usage tracking, capability metrics |
| Admin tools | Template sync management, marketplace publishing |
| CI/CD access | Automated testing, deployment pipelines |

**Support**: Direct team Slack/Discord access

**Best For**:
- Template maintainers
- Plugin developers
- Ecosystem contributors

## Feature Comparison Matrix

| Feature | Community | Pro | Internal |
|---------|:---------:|:---:|:--------:|
| **Agent Team** | | | |
| 11 specialized agents | ✓ | ✓ | ✓ |
| Agent authority model | ✓ | ✓ | ✓ |
| Custom agent definitions | - | - | ✓ |
| **Skills** | | | |
| 24 foundation skills | ✓ | ✓ | ✓ |
| Enhanced skills | - | ✓ | ✓ |
| Showrunner workflows | - | ✓ | ✓ |
| Beta/experimental skills | - | - | ✓ |
| **Commands** | | | |
| 30 workflow commands | ✓ | ✓ | ✓ |
| Premium export options | - | ✓ | ✓ |
| Admin commands | - | - | ✓ |
| **Export Formats** | | | |
| PDF (industry-standard) | ✓ | ✓ | ✓ |
| FDX (Final Draft) | ✓ | ✓ | ✓ |
| HTML preview | ✓ | ✓ | ✓ |
| Custom watermarks | - | ✓ | ✓ |
| **Support** | | | |
| Community GitHub issues | ✓ | ✓ | ✓ |
| Priority support channel | - | ✓ | ✓ |
| Direct team access | - | - | ✓ |

## Upgrade Path

### Community → Pro

1. Subscribe to WTFB Pro via [wordstofilmby.com](https://wordstofilmby.com)
2. Gain access to the WTFB Claude Marketplace
3. Install plugins using:
   ```
   /plugin install wtfb-screenwriting@github.com/bybren-llc/cheddarfox-claude-marketplace/plugins/screenwriting
   ```
4. Configure precedence in `.wtfb/project.json` if needed

### Pro → Internal

Internal access is reserved for bybren-llc team members and approved contributors. Contact the team for onboarding.

## Plugin Precedence

When you have both template and marketplace capabilities, precedence determines which is used:

```json
{
  "plugins": {
    "installed": ["wtfb-screenwriting"],
    "precedence": ["wtfb-screenwriting"]
  }
}
```

**Rules**:
- Template loads first (foundation)
- Plugins load in precedence order
- `extends` capabilities: both available, premium preferred
- `replaces` capabilities: premium supersedes base

See [Plugin Architecture](./PLUGIN_ARCHITECTURE.md) for details.

## Related Documentation

- [Capability Contract](./CAPABILITY_CONTRACT.md) - Technical spec for capability identification
- [Plugin Architecture](./PLUGIN_ARCHITECTURE.md) - How plugins extend the template
- [Template & Marketplace Relationship](./TEMPLATE_MARKETPLACE_RELATIONSHIP.md) - Ecosystem overview
