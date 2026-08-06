# Dependencies

This document covers everything the template needs to run — the npm packages it installs, and
the external tools some commands invoke but do **not** install for you.

---

## Overview

### Installed by `npm install`

| Package | Purpose | Type |
|---------|---------|------|
| `cspell` | Spell checking | Dev |
| `fountain-js` | Fountain screenplay parsing | Dev |
| `husky` | Git hooks | Dev |
| `lint-staged` | Run linters on staged files | Dev |
| `markdownlint-cli2` | Markdown linting | Dev |

### Not installed — you must provide these

Nothing in `npm install` brings these in. The commands that need them say so inline, but the
command will fail at the point of use if the tool is absent.

| Tool | Needed by | Install | Verified against |
|------|-----------|---------|------------------|
| `@wtfb/cli` | `/init-readme`, `/start-project`, `npm run init` | `npm i -g @wtfb/cli` or invoked via `npx @wtfb/cli` | 1.0.4 |
| `afterwriting` | `/export-pdf`, `/export-html`, `/export-all` | `npm install -g afterwriting` | 1.17.3 |
| `screenplain` | `/export-fdx`, `/export-all` | `pipx install screenplain` | — |
| `pipx` + Python 3.8+ | prerequisite for `screenplain` | see pipx docs | — |

The **Verified against** column records the version each tool was last exercised at, not a pin.
The install commands are intentionally unpinned so you get fixes; if you need reproducibility,
pin to the verified version. This file has already carried a stale pin once — `markdownlint-cli2`
was documented at `^0.15.0` against `^0.20.0` in `package.json` — which is why versions live in
one column here rather than inside install commands scattered across the docs.

**The package is `@wtfb/cli`, not `wtfb`.** Bare `npx wtfb` resolves an unpublished package and
returns 404, and a globally installed `wtfb` binary does not rescue it — `npx` still goes to the
registry.

**`screenplain` pulls in a Python toolchain.** It is the only non-Node prerequisite in the
template, and it is needed only for FDX export.

**You may not need any of them.** The recommended export path is Better Fountain in VS Code
(`.vscode/extensions.json` recommends it), which requires none of the CLI tools above.

---

## Detailed Breakdown

### cspell

**Version:** ^8.0.0
**Purpose:** Spell checking for Markdown and Fountain files
**Website:** [cspell.org](https://cspell.org/)

Catches typos in your screenplay, novel, or documentation. Supports:
- Custom project dictionaries (`.cspell/project-words.txt`)
- Character names, location names, made-up words
- Multiple file types (.md, .fountain, .txt)

**Configuration:** `cspell.json`

```bash
# Run spell check
npm run lint:spell
```

---

### fountain-js

**Version:** ^1.2.4
**Purpose:** Parse and validate Fountain screenplay format
**Website:** [fountain.io](https://fountain.io/)

Parses `.fountain` files into structured data for:
- Syntax validation
- Scene extraction
- Character detection
- Export preparation

**Usage:** Used by `scripts/validate-fountain.js`

```bash
# Validate Fountain files
npm run lint:fountain
```

---

### husky

**Version:** ^9.0.0
**Purpose:** Git hooks made easy
**Website:** [typicode.github.io/husky](https://typicode.github.io/husky/)

Automatically runs validation before commits. Prevents:
- Committing files with syntax errors
- Pushing code that fails validation
- Breaking the CI pipeline

**Configuration:** `.husky/` directory

---

### lint-staged

**Version:** ^15.0.0
**Purpose:** Run linters on staged files only
**Website:** [github.com/lint-staged/lint-staged](https://github.com/lint-staged/lint-staged)

Works with Husky to run the right linter for each file type:
- `.md` files → markdownlint + cspell
- `.fountain` files → fountain validation + cspell

**Configuration:** `package.json` under `"lint-staged"`

---

### markdownlint-cli2

**Version:** ^0.20.0
**Purpose:** Markdown linting and formatting
**Website:** [github.com/DavidAnson/markdownlint-cli2](https://github.com/DavidAnson/markdownlint-cli2)

Ensures consistent Markdown formatting across:
- Documentation
- Character sheets
- Beat sheets
- Story outlines

**Configuration:** `.markdownlint-cli2.yaml`

```bash
# Lint Markdown files
npm run lint:md
```

---

## npm Scripts

All dependencies are orchestrated through npm scripts:

`npm run validate` chains the linters below. **Read `package.json` for the authoritative
list** — a count written here goes stale, and this file has already carried a stale one:

| Script | Runs |
|--------|------|
| `validate` | every `lint:*` and `validate:*` script below, in order |
| `lint:fountain` | `scripts/validate-fountain.js` — advisory; `lint:fountain:strict` exits non-zero |
| `lint:md` | `markdownlint-cli2` |
| `lint:spell` | `cspell` |
| `validate:capabilities` | `scripts/validate-capabilities.js` — agent/command/skill parity + doc parity |
| `lint:bible` | `scripts/validate-bible.js` — advisory; **CI runs `lint:bible:strict`** |
| `lint:models` | `scripts/validate-models.js` |
| `lint:plugin` | `scripts/validate-plugin.js` |
| `bible:drift` | `scripts/check-bible-drift.js` — not in `validate`, not in CI |
| `init` | `scripts/init-project.sh` |

> **`validate` and CI are not identical.** `validate` runs `lint:bible`, CI runs
> `lint:bible:strict`, so a local run can be green where CI is red. Run
> `npm run lint:bible:strict` before pushing if you have touched `story-bible/`.

---

## Installation

All dependencies are dev dependencies (not needed in production):

```bash
npm install
```

This installs everything needed for validation and pre-commit hooks.

---

## The WTFB CLI

`@wtfb/cli` is **required**, not an alternative. `npm run init` and `/init-readme` invoke it,
and `CLAUDE.md` routes agent tooling through it. `npx` fetches it on demand, so a global
install is optional — but the package must be reachable either way.

```bash
npm install -g @wtfb/cli    # optional; npx @wtfb/cli works without it
```

Without a global install, every command works through `npx`:

```bash
npx @wtfb/cli init-readme --title "My Screenplay"
npx @wtfb/cli validate
npx @wtfb/cli export-pdf
npx @wtfb/cli export-fdx
npx @wtfb/cli export-html
```

Then use:
```bash
wtfb validate    # Run all validation
wtfb export-pdf  # Export to PDF
wtfb export-fdx  # Export to Final Draft
wtfb export-html # Export to HTML
```

See [@wtfb/cli on npm](https://www.npmjs.com/package/@wtfb/cli) or [GitHub](https://github.com/cheddarfox/wtfb-packages) for details.

---

## Updating Dependencies

Check for updates:
```bash
npm outdated
```

Update to latest:
```bash
npm update
```

---

## Troubleshooting

### "Module not found" errors

```bash
rm -rf node_modules package-lock.json
npm install
```

### Pre-commit hooks not running

```bash
npm run prepare
```

### Spell check flagging valid words

Add words to `.cspell/project-words.txt` (one per line).

---

## Related Documentation

- [CONTRIBUTING.md](CONTRIBUTING.md) - Validation workflow
- [REFERENCE.md](REFERENCE.md) - Configuration files
- [QUICKSTART.md](QUICKSTART.md) - Getting started
