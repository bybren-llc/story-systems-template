# WTFB Plugin Architecture

This document describes how WTFB plugins extend the template and how the selection policy determines which capabilities are active.

## Overview

WTFB uses a **layered architecture** where:

1. **Template** provides the foundation (agents, skills, commands, hooks)
2. **Plugins** add, extend, or replace template capabilities
3. **Selection Policy** determines which capabilities are active based on configuration

```
┌─────────────────────────────────────────────────────────┐
│  Writer's Project                                       │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Plugin Layer (optional)                          │  │
│  │  wtfb-screenwriting, wtfb-novel-writing, etc.    │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Template Layer (foundation)                      │  │
│  │  11 agents, 24 skills, 30 commands, hooks        │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Plugin Structure

A WTFB plugin follows the Claude Code plugin conventions:

```
wtfb-screenwriting/
├── .claude-plugin/
│   └── plugin.json          # Plugin manifest
├── agents/                   # Additional agents (optional)
├── skills/
│   ├── advanced-structure/
│   │   └── SKILL.md
│   └── showrunner-workflow/
│       └── SKILL.md
├── commands/                 # Additional commands (optional)
├── hooks/                    # Additional hooks (optional)
└── README.md
```

### Plugin Manifest

`.claude-plugin/plugin.json`:

```json
{
  "name": "wtfb-screenwriting",
  "version": "1.0.0",
  "description": "Professional screenwriting enhancements for WTFB",
  "author": "Words To Film By <dev@wordstofilmby.com>",
  "wtfb": {
    "namespace": "wtfb-screenwriting",
    "compat": {
      "template": ">=1.0.0 <2.0.0"
    }
  }
}
```

## Capability Identification

Every capability has a canonical identifier (`wtfbId`) that uniquely identifies it:

| Layer | Namespace | Example |
|-------|-----------|---------|
| Template | `wtfb:` | `wtfb:story-structure` |
| Marketplace | `{plugin}:` | `wtfb-screenwriting:advanced-structure` |

### Requirement by Capability Type

| Capability | wtfbId Required? |
|------------|------------------|
| Skills | **REQUIRED** |
| Commands | **RECOMMENDED** |
| Hooks | **OPTIONAL** |
| Agents | **OPTIONAL** |

## Capability Relationships

Plugin capabilities declare their relationship to template capabilities:

### provides

New capability with no template dependency:

```yaml
---
name: showrunner-workflow
wtfbId: wtfb-screenwriting:showrunner-workflow
provides: true
---
```

### extends

Additive enhancement (both available):

```yaml
---
name: advanced-structure
wtfbId: wtfb-screenwriting:advanced-structure
extends:
  wtfbId: wtfb:story-structure
---
```

### replaces

Explicit override (premium supersedes base):

```yaml
---
name: story-structure-pro
wtfbId: wtfb-screenwriting:story-structure-pro
replaces:
  wtfbId: wtfb:story-structure
---
```

## Installation

### Install a Plugin

```
/plugin install wtfb-screenwriting@github.com/bybren-llc/cheddarfox-claude-marketplace/plugins/screenwriting
```

This updates `.wtfb/project.json`:

```json
{
  "plugins": {
    "installed": ["wtfb-screenwriting"],
    "precedence": ["wtfb-screenwriting"]
  }
}
```

### Verify Installation

```
/plugin list
```

### Remove a Plugin

```
/plugin remove wtfb-screenwriting
```

## Precedence Control

### Configuration

Precedence is controlled in `.wtfb/project.json`:

```json
{
  "plugins": {
    "installed": ["wtfb-screenwriting", "wtfb-film-production"],
    "precedence": ["wtfb-screenwriting", "wtfb-film-production"]
  }
}
```

### Selection Rules

1. **Template loads first** (foundation layer)
2. **Plugins load in precedence order**
3. **Relationship type determines behavior**:
   - `provides`: New capability added
   - `extends`: Both base and enhanced available
   - `replaces`: Premium supersedes base
4. **Later in precedence wins** for conflicts

### Fallback Behavior

- If `precedence` array missing: use installation order
- If compatibility check fails: skip capability, log warning

## Selection Policy Algorithm

The orchestrator (Session Manager) follows this algorithm:

```
1. Load all template capabilities into registry
2. For each installed plugin (in precedence order):
   a. For each capability in plugin:
      i. Check compatibility (compat.template range)
      ii. Check dependencies (requires)
      iii. Based on relationship:
          - provides: Add to registry
          - extends: Add to registry, mark as "enhanced" version
          - replaces: Replace base in registry
3. When capability requested:
   a. Look up by wtfbId
   b. If "extends" exists and user in "pro mode": prefer enhanced
   c. Otherwise: use whatever is in registry
```

## Override Policy by Capability Type

| Capability | extends | replaces | Notes |
|------------|:-------:|:--------:|-------|
| Skills | ✓ | ✓ | Primary extension point |
| Commands | ✓ | Prefer parallel | Add premium commands alongside |
| Hooks | Minimal | Minimal | Keep auditable |
| Agents | Add new | Not allowed | Don't replace template agents |

## Creating a Plugin

### Step 1: Create Plugin Directory

```bash
mkdir -p my-plugin/.claude-plugin
mkdir -p my-plugin/skills/my-skill
```

### Step 2: Create Plugin Manifest

`my-plugin/.claude-plugin/plugin.json`:

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "My custom WTFB plugin",
  "wtfb": {
    "namespace": "my-plugin",
    "compat": {
      "template": ">=1.0.0"
    }
  }
}
```

### Step 3: Create a Skill

`my-plugin/skills/my-skill/SKILL.md`:

```yaml
---
name: my-skill
wtfbId: my-plugin:my-skill
description: My custom skill description.

provides: true

compat:
  template: ">=1.0.0"
---
# My Skill

Skill content here.
```

### Step 4: Test Locally

1. Add plugin to your project's `.wtfb/project.json`:
   ```json
   {
     "plugins": {
       "installed": ["my-plugin"],
       "precedence": ["my-plugin"]
     }
   }
   ```
2. Run `/plugin list` to verify
3. Test your skill with the appropriate invocation

### Step 5: Publish to Marketplace

Contact the WTFB team to submit your plugin for review and inclusion in the marketplace.

## Validation

### Required Checks

Plugins are validated for:

1. **Schema**: All skills have valid `wtfbId`
2. **Contract**: Exactly one of `provides`, `extends`, or `replaces`
3. **Uniqueness**: No duplicate `wtfbId` within plugin
4. **References**: `extends.wtfbId` and `replaces.wtfbId` reference valid template capabilities
5. **Compatibility**: `compat.template` range is valid

### Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| Missing wtfbId | Skill lacks canonical ID | Add `wtfbId: {namespace}:{name}` |
| Multiple relationships | Both extends and replaces | Choose one relationship type |
| Invalid reference | extends/replaces points to non-existent capability | Check template wtfbId exists |
| Compatibility mismatch | Template version out of range | Update compat.template |

## How Multiple Marketplaces Coexist

The WTFB architecture supports multiple independent marketplaces (official and third-party) through namespace isolation and precedence control.

### Namespace Isolation

Each marketplace uses a unique namespace prefix:

```
Template (Hub):       wtfb:story-structure
Official Plugin:      wtfb-screenwriting:advanced-structure
Third-Party Plugin:   acme-writing:custom-beats
```

This prevents identifier collisions. A project can install plugins from multiple sources without conflicts.

### Precedence Control

When plugins provide overlapping capabilities, the project owner controls resolution:

```json
{
  "plugins": {
    "installed": ["wtfb-screenwriting", "acme-writing"],
    "precedence": ["acme-writing", "wtfb-screenwriting"]
  }
}
```

Later entries in `precedence` win for capabilities with the same base `wtfbId`.

### Conflict Scenarios

| Scenario | Resolution |
|----------|------------|
| Two plugins `provides` same wtfbId | Error: duplicate capability |
| Two plugins `extends` same base | Both available; precedence determines default |
| Two plugins `replaces` same base | Later in precedence wins |
| Plugin extends non-existent base | Error: invalid reference |

### Third-Party Author Requirements

1. Use a unique vendor namespace (e.g., `acme-writing:`)
2. Never use reserved namespaces (`wtfb:`, `wtfb-screenwriting:`, etc.)
3. Declare relationships explicitly (`provides`, `extends`, `replaces`)
4. Include `compat.template` version range

See [Capability Contract - Third-Party Plugin Author Rules](./CAPABILITY_CONTRACT.md#third-party-plugin-author-rules) for full specification.

## Related Documentation

- [Capability Contract](./CAPABILITY_CONTRACT.md) - Schema and rules for capabilities
- [User Access Tiers](./USER_ACCESS_TIERS.md) - Who gets what features
- [Template & Marketplace Relationship](./TEMPLATE_MARKETPLACE_RELATIONSHIP.md) - Ecosystem overview
