# Dependencies

This document explains all npm dependencies used in the Story Systems Template.

---

## Overview

| Package | Purpose | Type |
|---------|---------|------|
| `cspell` | Spell checking | Dev |
| `fountain-js` | Fountain screenplay parsing | Dev |
| `husky` | Git hooks | Dev |
| `lint-staged` | Run linters on staged files | Dev |
| `markdownlint-cli2` | Markdown linting | Dev |

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

**Version:** ^0.15.0
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

```json
{
  "scripts": {
    "validate": "npm run lint:fountain && npm run lint:md && npm run lint:spell",
    "lint:fountain": "node scripts/validate-fountain.js",
    "lint:md": "markdownlint-cli2 '**/*.md' '#node_modules'",
    "lint:spell": "cspell '**/*.{md,fountain,txt}' --no-progress",
    "prepare": "husky"
  }
}
```

---

## Installation

All dependencies are dev dependencies (not needed in production):

```bash
npm install
```

This installs everything needed for validation and pre-commit hooks.

---

## Global CLI Alternative

For a streamlined experience across all projects, install the WTFB CLI globally:

```bash
npm install -g @wtfb/cli
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
