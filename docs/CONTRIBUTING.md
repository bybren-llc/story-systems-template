# Contributing to WTFB Projects

Thank you for your interest in contributing to this project!

> **Workflow conventions** — branch naming, commit format, PR and merge strategy, and
> ticket linking — now live in the root **[CONTRIBUTING.md](../CONTRIBUTING.md)**. The harness is
> project-management-agnostic (Linear is our tracker; Jira, GitHub Issues, and others work the
> same way). This page covers **setup, tooling, and reference** detail. Where the two differ, the
> root file wins for harness/template contributions.

## Getting Started

1. **Fork and Clone**: Fork this repository and clone your fork locally
2. **Install Dependencies**: Run `npm install` to set up validation tools
3. **Open in VS Code**: Install recommended extensions when prompted
4. **Create a Branch**: Create a feature branch for your work
5. **Make Changes**: Implement your changes following our guidelines
6. **Validate**: Run `npm run validate` before committing
7. **Submit PR**: Create a pull request with a clear description

## Branch Strategy

### Protected Branches

| Branch | Purpose | Protection |
|--------|---------|------------|
| `main` | Production-ready drafts | PR required, no direct pushes |
| `draft/v{N}` | Major versions (e.g., `draft/v1`, `draft/v2`) | PR required |
| `draft/v{N}-{qualifier}` | Named variants (e.g., `draft/v2-polish`) | PR required |

### Working Branches

Pattern: `type/kebab-case-description`

| Type | Purpose | Examples |
|------|---------|----------|
| `scene/{slug}` | Single scene or sequence | `scene/opening`, `scene/midpoint-reveal` |
| `revision/{type}` | Full-script revision pass | `revision/dialogue`, `revision/action` |
| `character/{name}` | Character-focused work | `character/protagonist-arc` |
| `structure/{change}` | Structural reorganization | `structure/reorder-act2` |
| `fix/{issue}` | Targeted fixes | `fix/continuity-sc15`, `fix/format` |
| `export/{format}` | Export preparation | `export/table-read`, `export/competition` |
| `docs/{topic}` | Documentation updates | `docs/workflow`, `docs/readme` |

**Naming rules:** Type prefix + 2-5 words in kebab-case. No special characters except hyphens.

### Workflow

1. **Create working branch**:
   ```bash
   git checkout main  # or draft/v{N}
   git pull origin main
   git checkout -b scene/your-scene-name
   ```

2. **Make changes and commit**:
   ```bash
   git add .
   git commit -m "scene(act1): add opening sequence"
   ```

3. **Push and create PR**:
   ```bash
   git push -u origin scene/your-scene-name
   gh pr create --base main --title "scene: add opening sequence"
   ```

4. **Merge strategy** (creative content branches):
   - **Squash merge**: `scene/*`, `fix/*`, `export/*` (clean history)
   - **Regular merge**: `revision/*`, `structure/*`, `character/*` (preserve history)
   - Harness/template contributions use ticket-linked branches and **rebase-and-merge** —
     see the root [CONTRIBUTING.md](../CONTRIBUTING.md).

5. **Cleanup after merge**:
   ```bash
   git branch -d scene/your-scene-name
   git push origin --delete scene/your-scene-name
   ```

## VS Code Extensions

When you open this project in VS Code, you'll be prompted to install recommended extensions. These are essential for a smooth workflow:

| Extension | Purpose |
|-----------|---------|
| **Better Fountain** | Syntax highlighting, scene navigation, and preview for `.fountain` screenplay files |
| **Code Spell Checker** | Catches typos in your content with project-specific dictionary support |
| **markdownlint** | Ensures consistent Markdown formatting across documentation |
| **Markdown All in One** | Enhanced Markdown editing with shortcuts, TOC generation, and preview |
| **Prettier** | Automatic code/config file formatting |
| **GitLens** | Enhanced Git integration showing blame, history, and comparisons |
| **GitHub Pull Requests** | Manage PRs directly from VS Code |

To manually install all extensions:
```bash
code --install-extension piersdeseilligny.betterfountain
code --install-extension streetsidesoftware.code-spell-checker
code --install-extension davidanson.vscode-markdownlint
code --install-extension yzhang.markdown-all-in-one
code --install-extension esbenp.prettier-vscode
code --install-extension eamodio.gitlens
code --install-extension github.vscode-pull-request-github
```

## Commit Messages

Pattern: `type(scope): description`

| Type | Purpose |
|------|---------|
| `scene` | New or modified scene content |
| `dialogue` | Dialogue improvements |
| `action` | Action line changes |
| `structure` | Structural reorganization |
| `revision` | Revision pass changes |
| `character` | Character development |
| `notes` | Notes and annotations |
| `format` | Formatting fixes |
| `docs` | Documentation updates |
| `chore` | Maintenance tasks |

**Additional types for template contributions:**
- `skill` - New or modified skill
- `command` - New or modified command
- `ci` - CI/CD changes

Examples:
- `scene(act1): add opening coffee shop sequence`
- `dialogue(protagonist): polish voice in apartment scenes`
- `fix(continuity): correct timeline in scenes 15-18`
- `docs(readme): update cast list`
- `skill(story-structure): add midpoint beat analysis`
- `command(export-pdf): fix output path handling`

## PR Title Format

PR titles must match: `type(scope): description`

This is enforced by CI. Examples:
- `feat(skill): add advanced-structure skill`
- `fix(command): correct export-pdf output path`
- `docs(contributing): add spoke author rules`

## Contributing Skills & Commands

### Hub Contributions (This Template)

When contributing skills or commands to this template repository:

1. **Frontmatter Required**: All skills must have YAML frontmatter
2. **wtfbId Format**: Use `wtfb:{name}` (e.g., `wtfb:story-structure`)
3. **Name Matching**: `name` field must match directory name exactly
4. **Description Format**: Include "Use when:" trigger conditions

Example skill frontmatter:
```yaml
---
name: my-skill
wtfbId: wtfb:my-skill
description: |
  This skill provides...

  Use when: you need to...
---
```

### Spoke Contributions (Marketplace Plugins)

When contributing to marketplace plugins:

1. **Unique Namespace**: Use `{your-plugin}:{name}` (NOT `wtfb:`)
2. **Relationship Declared**: Use `provides`, `extends`, or `replaces`
3. **Compatibility**: Include `compat.template` version range

Reserved namespaces (do not use):
- `wtfb:` - Template hub only
- `wtfb-screenwriting:` - Official WTFB plugin
- `wtfb-novel-writing:` - Official WTFB plugin
- `wtfb-film-production:` - Official WTFB plugin

See [Capability Contract](guides/CAPABILITY_CONTRACT.md) for full specification.

## Definition of Done

Before submitting a PR, ensure:

- [ ] `npm run validate` passes (format, continuity, spelling)
- [ ] Self-review completed
- [ ] Scene has clear purpose (for `scene/*` branches)
- [ ] Character voice is consistent (for `character/*` branches)
- [ ] Issue is demonstrably fixed (for `fix/*` branches)

## Code of Conduct

- Be respectful and constructive
- Focus on the work, not the person
- Welcome diverse perspectives
- Maintain creative integrity

## Validation

Before submitting, run validation to catch issues:

```bash
npm run validate              # Full validation (runs all linters + capability check)
npm run validate:capabilities # Skill/command compliance only
npm run lint:fountain         # Fountain syntax (screenplays only)
npm run lint:md               # Markdown linting
npm run lint:spell            # Spell check
```

CI will automatically run validation on all pull requests to `main` and `draft/*` branches.

### Capability Validation

For skill/command contributions, `validate:capabilities` checks:

**Skills (hard errors):**
- Frontmatter exists (file starts with `---`)
- `name` matches directory name
- `wtfbId` follows correct namespace format
- Valid YAML syntax

**Skills (warnings):**
- `description` includes "Use when:" clause
- `description` under 1024 characters

**Commands (hard errors):**
- H1 heading matches filename (`# /command-name`)

**Commands (warnings):**
- Frontmatter recommended
- `description` under 100 characters
- `description` starts with imperative verb

## Linting Configuration

### Markdown Linting

Markdown files are linted using [markdownlint-cli2](https://github.com/DavidAnson/markdownlint-cli2). The configuration in `.markdownlint-cli2.yaml` is relaxed for creative/documentation projects:

- **Line length**: No limit (prose has long paragraphs)
- **Inline HTML**: Allowed for special formatting
- **Duplicate headings**: Allowed (templates repeat section names)
- **Blank lines**: Flexible requirements for readability

If you get markdown errors, check if the issue is stylistic (can be ignored) or structural (should be fixed).

### Spell Checking

Spell checking uses [cSpell](https://cspell.org/) with a project-specific dictionary at `.cspell/project-words.txt`.

**Adding project-specific words:**
1. Open `.cspell/project-words.txt`
2. Add the word on a new line (one word per line)
3. Use comments (`#`) to organize sections

Common additions:
- Character names
- Location names
- Industry terms (e.g., `logline`, `beatsheet`)
- Made-up words in your story

### Fountain Linting

For screenplay projects, Fountain files are validated for:
- Proper scene heading format (`INT.`/`EXT.`)
- Character name consistency
- Parenthetical formatting
- Page break placement

## Protected Content

When syncing from the upstream template, these paths are protected and won't be overwritten:
- `*.fountain` - Your screenplay content
- `manuscript/**` - Novel content
- `sourcematerials/**` - Research and references
- `docs/v*/**` - Versioned documentation
- `README.md` - Your project README
- `marketing/wtfb-marketing.json` - Your marketing config

See `.wtfb/project.json` for the full list of protected and sync paths.

## Questions?

Open an issue or reach out to the project maintainers.
