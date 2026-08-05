# Changelog

All notable changes to Story Systems Template will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.7.0] - 2026-08-05

**Ticket discipline and gate repair** — one new command and three gates that were not doing
what the repo believed they were doing. No breaking changes.

### Added

- **`/ticket`** — drafts a four-section issue (Problem / Goal / AC / Dev Notes) from repo
  coordinates and creates it in the tracker. Reads the repo before drafting rather than working
  from the description alone; runs only documented, read-only verification commands; redacts
  secrets, personal data, and third-party identifiers; and shows the body for confirmation
  before anything is created. Mirrored to `.gemini/commands/ticket.toml`. (STO-25)
- **Documentation parity gate** in `validate-capabilities.js` — docs that index commands must
  name every command, and an exact stated count must match `.claude/commands/`. Open-ended
  counts (`30+ commands`) are read as a floor and left alone. (STO-27)
- **`/ticket` guidance in `CONTRIBUTING.md`**, including what belongs in each of the four
  sections. (STO-25)

### Fixed

- **`.coderabbit.yaml` was never parsed.** `tone_instructions` ran 373 characters against a
  250-character schema cap, so the file failed validation and CodeRabbit fell back to defaults.
  Every `path_instruction`, all `pre_merge_checks`, and the `path_filters` protecting
  `*.fountain`, `manuscript/**`, and `sourcematerials/**` were inert — including through the
  v1.6.0 release. Trimmed to 245 characters. (STO-26)
- **Feature PRs were never auto-reviewed.** `auto_review` carried no `base_branches`, so only
  PRs into the default branch were reviewed, while STO-24 had moved feature work onto
  `develop`. (STO-26)
- **Five commands were absent from every command index** — `/bible`, `/continuity-sweep`,
  `/init-readme`, `/rewrite-sweep`, `/ticket`. Each had shipped in a green PR, because file
  parity was enforced and prose never was. (STO-27)
- **Stale command counts** in `GEMINI.md` (two places) and `.gemini/README.md`. (STO-27)

### Changed

- `CONTRIBUTING.md` standardizes the dev → main flow: squash into `develop`, merge commit to
  promote, never rebase-merge. (STO-24)
- `README.md` badges aligned with the SAW reference, using the official DeepWiki badge. (STO-23)
- `.claude/README.md` and `CLAUDE.md` now label their command lists as deliberate selections and
  point at `.claude/commands/README.md` as the full index, rather than reading as exhaustive.
  (STO-27)

## [1.6.0] - 2026-08-04

**Story Harness Upgrade** — a large, additive, fully backward-compatible expansion of the
writing harness (22 tracked issues, STO-1…STO-22). No breaking changes: new modes default off,
new providers are opt-in, and existing workflows are unchanged.

### Added

- **Activated hooks** wired into `.claude/settings.json` (SessionStart/End, UserPromptSubmit,
  Pre/PostToolUse), including an invocation-anchored **git guard** that blocks pushes to `main`
  and a "count, don't claim" SessionStart banner (real scene/page counts).
- **Per-role model routing** (`.claude/model-routing.md`) with `model:` on all 11 agents; the
  agents are now real **dispatchable subagents** (YAML frontmatter, least-privilege tool sets).
- **Story Bible vault** (`story-bible/`): card templates, `validate-bible.js` +
  `check-bible-drift.js`, a `validate-bible` CI gate + `npm run lint:bible`, and the `/bible`
  command; `continuity-tracking` extended to author/verify cards (`verified_against` SHA).
- **Session memory** (`.wtfb/session/`): `progress.md` / `draft-state.md` / `session-log.md`,
  wired into `/start-scene`, `/end-session`, `/stuck`.
- **Per-scene sweep commands** `/continuity-sweep` and `/rewrite-sweep` (one subagent per scene →
  consolidated notes), GA-safe (subagent fallback, no hard dependency on preview features).
- **Cross-surface parity gate** in `validate-capabilities.js`: schema ↔ `.claude` ↔ `.gemini`
  agents/commands can no longer silently diverge; schema reconciled to all 11 agents.
- **Multi-model writer's room** (ADR 0001): a provider-aware **model registry**
  (`.wtfb/ai-harness/model-registry.json`), a zero-dep **connector** (`model-consult.js`,
  OpenAI-compatible / self-hosted vLLM) with an opt-in MCP server, and a **council** mode for
  `/writers-room` (solo default / diverse / custom) with synthesis provenance and graceful skip.
- **Opt-in Fountain `--strict`** validation mode.
- **Installable plugin packaging** (`.claude-plugin/plugin.json` + self-hosted
  `marketplace.json`) with a `lint:plugin` gate.
- **Docs & conventions**: repo-wide README refresh, PM-agnostic `CONTRIBUTING.md`, ADR directory,
  and a CodeRabbit config tuned for a writing harness.

### Fixed

- **Template sync no longer overwrites protected files** — `sync-upstream.sh` and the
  `sync-upstream.yml` workflow now enforce `protectedPaths` via `restore-protected-paths.sh`
  (restore fork versions + drop protected additions), covered by a negative-controlled test.

### Security

- **Secret-leak guard** in the model registry validator: a committed endpoint URL or API key
  fails CI. All endpoints/keys live in `.env` (gitignored); the registry references env-var
  names only.

---

## [1.5.2] - 2026-01-20

### Added

- **`/init-readme` command**: Auto-populate project README from IMDb-style template

### Changed

- **Project rename**: "WTFB Projects Template" → "Story Systems Template"
  - Updated README title, marketing config, Jekyll config
  - Updated all user-facing documentation references
  - Updated sync scripts and template relationship docs
- **Repository references**: Updated marketplace name to `cheddarfox-claude-marketplace`
- **License badge**: Moved to first position in README

### Fixed

- **SKILL_COMPLIANCE_CHECKLIST.md**: Fixed repo reference from `wtfb-safe-agentic-workflow` to `safe-agentic-workflow`

---

## [1.4.0] - 2026-01-11

### Added

- **Capability Validation Script** (`scripts/validate-capabilities.js`)
  - Validates all 24 skills and 30 commands against compliance checklist
  - Hard errors for: missing frontmatter, name mismatch, invalid wtfbId, invalid YAML
  - Warnings for: missing "Use when:", description length, imperative voice
  - Supports `--mode=template|marketplace` for hub/spoke reuse
  - New npm script: `npm run validate:capabilities`

- **PR Validation Workflow** (`.github/workflows/pr-validation.yml`)
  - Enforces PR title format: `type(scope): description`
  - API-only (no checkout, no fork code execution)
  - Minimal permissions for security

- **Spoke Author Contract Documentation**
  - Third-party plugin namespace rules in CAPABILITY_CONTRACT.md
  - Multi-marketplace coexistence guide in PLUGIN_ARCHITECTURE.md
  - Hub vs spoke contribution rules in CONTRIBUTING.md

- **Claude Code Installation Instructions**
  - Added to QUICKSTART.md prerequisites
  - Added to README.md Quick Start section

### Changed

- **validate.yml**: Added `validate-capabilities` job
- **PR Template**: Added skill/command compliance checklist
- **CLAUDE.md**: Added CI/CD section with validation commands
- **AGENTS.md**: Added Agent Contributions to CI section
- **CONTRIBUTING.md**: Added PR title format and capability validation docs
- **package.json**: Updated validate script to include capability check

### OSS-Friendly Design

- PR title validation: hard error (blocks merge)
- Commit message validation: skipped (maintainers squash-merge)
- Rebase enforcement: skipped (reduces contributor friction)
- Subjective checks (imperative voice, description length): warnings only

---

## [1.3.2] - 2026-01-11

### Security

- **js-yaml vulnerability fix**: Updated markdownlint-cli2 from 0.15.0 to 0.20.0
  - Fixes GHSA-mh29-5h37-fv8m (prototype pollution in js-yaml merge)
  - Resolves moderate severity Dependabot alert

### Changed

- **markdownlint config**: Disabled MD060 (table-column-style) rule
  - New rule in markdownlint 0.40.0 conflicts with compact table formatting
  - Maintains backward compatibility with existing agent/skill documentation

---

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
