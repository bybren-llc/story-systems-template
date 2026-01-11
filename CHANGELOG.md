# Changelog

All notable changes to WTFB Projects Template will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.1] - 2026-01-11

### Added

- **NOTICE File**: Attribution requirements for WTFB™ harness methodology
  - Required attribution text for derivative works
  - Clear IP acknowledgment for methodology, agent team structure, and skill system

### Changed

- **LICENSE**: Updated with full creator attribution
  - J. Scott Graham (@cheddarfox) as creator
  - Words To Film By™ trademark
  - Reference to NOTICE file for attribution requirements

- **package.json**: Complete author metadata
  - Author object with name, email, and website
  - Contributors array with Bybren LLC

- **README.md**: Added Attribution section
  - Creator, organization, and enterprise credits
  - Link to NOTICE file for requirements

- **CLAUDE.md**: Added attribution header

- **marketing/wtfb-marketing.json**: Full creator details
  - Primary creator with GitHub and website links
  - Organization details with links

---

## [1.3.0] - 2026-01-11

### Added

- **Hub-Spoke Plugin Architecture**: Infinitely extensible ecosystem design
  - Template is the hub (complete 11-agent harness, free, OSS)
  - Plugins are spokes that extend capabilities (free or paid)

- **Capability Contract Specification**: Technical standard for plugin extensibility
  - `wtfbId` canonical identifiers for all capabilities
  - `provides`, `extends`, `replaces` relationship types
  - `requires`, `compat` compatibility gates
  - Selection policy for deterministic capability resolution

- **Documentation Suite** in `docs/guides/`:
  - `CAPABILITY_CONTRACT.md` - Technical spec for plugin authors
  - `PLUGIN_ARCHITECTURE.md` - How plugins extend the template
  - `USER_ACCESS_TIERS.md` - Access levels (Community, Pro, Internal)
  - `TEMPLATE_MARKETPLACE_RELATIONSHIP.md` - Ecosystem overview

- **Plugin Precedence Control**: `.wtfb/project.json` now supports `plugins.precedence` array

### Changed

- All 24 skills now include `wtfbId: wtfb:{name}` metadata for registry identity
- `.claude/README.md` updated with namespace conventions and capability identification
- `README.md` updated with:
  - Hub-spoke architecture documentation
  - Plugin creation guide (free and paid)
  - WTFB community journey (tools → courses → publishing → production)
  - Plugin development guides in documentation table

### Breaking Changes

For marketplace plugin authors:

- Skills in marketplace plugins **MUST** declare `wtfbId`
- Skills **MUST** declare exactly one of: `provides`, `extends`, or `replaces`
- The `wtfb:` namespace is reserved for template capabilities

### Migration Guide

For existing plugins:

1. Add `wtfbId: {your-plugin}:{skill-name}` to all skill frontmatter
2. Add relationship type (`provides`, `extends`, or `replaces`) to declare intent
3. Add `compat.template` version range for compatibility checking

---

## [0.9.x] - Pre-release

Pre-release development versions. See git history for details.
