# Contributing to WTFB Projects

Thank you for your interest in contributing to this project!

## Getting Started

1. **Fork and Clone**: Fork this repository and clone your fork locally
2. **Install Dependencies**: Run `npm install` to set up validation tools
3. **Open in VS Code**: Install recommended extensions when prompted
4. **Create a Branch**: Create a feature branch for your work
5. **Make Changes**: Implement your changes following our guidelines
6. **Validate**: Run `npm run validate` before committing
7. **Submit PR**: Create a pull request with a clear description

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

## Branch Naming

Use these prefixes for your branches:

- `feature/` - New content, scenes, chapters
- `fix/` - Bug fixes, continuity corrections
- `revision/` - Full-script revision passes
- `docs/` - Documentation updates

## Commit Messages

Follow this format:

```
type(scope): description

Types: scene, dialogue, action, structure, revision, notes, format, docs
```

Examples:
- `scene(opening): add bar confrontation`
- `dialogue(character): refine monologue`
- `docs(readme): update cast list`

## Code of Conduct

- Be respectful and constructive
- Focus on the work, not the person
- Welcome diverse perspectives
- Maintain creative integrity

## Validation

Before submitting, run validation to catch issues:

```bash
npm run validate        # Full validation (runs all linters)
npm run lint:fountain   # Fountain syntax (screenplays only)
npm run lint:md         # Markdown linting
npm run lint:spell      # Spell check
```

CI will automatically run validation on all pull requests to `master` and `dev` branches.

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
