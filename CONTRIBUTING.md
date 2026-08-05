# Contributing

This guide is for contributing **to the harness/template itself** — its agents, skills,
commands, hooks, scripts, and docs.

> **Writing a screenplay or novel with this template?** You don't need any of this. See the
> **Git Workflow** in `CLAUDE.md` — writers use `scene/<name>`, `draft/<version>`, and
> `revision/<type>` branches and just write. This document is for people improving the harness.

## Issue tracker: use whatever you have

Every harness change starts from a tracked issue. **We use [Linear](https://linear.app)
(team `STO`), but the harness is project-management-agnostic** — the same conventions work with
Jira, GitHub Issues, or any tracker. The one rule: **put the issue's ID at the front of your
branch name** so your tracker and GitHub link the branch and PR, and move the issue's status
automatically.

| Tracker | Example issue ID | Branch |
| --- | --- | --- |
| Linear (our stack) | `STO-4` | `STO-4-scaffold-story-bible-vault` |
| Jira | `PROJ-123` | `PROJ-123-scaffold-story-bible-vault` |
| GitHub Issues | `123` | `123-scaffold-story-bible-vault` |

No tracker at all? Still prefix a short, stable slug (for example `hooks-fix-...`) — but a
tracked ID is strongly preferred.

### Writing the issue

Run **`/ticket <description>`**. It reads the repo for coordinates before drafting, redacts
secrets and third-party identifiers, shows you the body, and creates the issue only after you
confirm. The output is four sections and nothing else:

| Section | What goes in it |
| --- | --- |
| **Problem** | The defect as observed fact, with `file:line`, dated external state, and the precedent ticket if one exists |
| **Goal** | One sentence, the end state written as if already true |
| **AC** | 4–6 observable end states a reviewer can check without you — not tasks |
| **Dev Notes** | Coordinates, the verification command, traps, and the pattern to copy |

If it runs longer than one screen, it is two tickets.

## Branch naming

**Format:** `<TICKET-ID>-<short-description>` (kebab-case).

- MUST start with the issue ID (`STO-4-...`, `PROJ-123-...`, `123-...`).
- Branch off **`develop`** (the integration branch — see [Branching & merge model](#branching--merge-model)).
- One issue = one branch = one PR.

## Commit messages

**Format:** `type(scope): description [TICKET-ID]`

- Types: `feat`, `fix`, `docs`, `refactor`, `chore`, `skill`, `command`, `ci`.
- End with the issue ID so commits link back:
  `feat(harness): add story-bible drift check [STO-5]`.
- We standardize on brackets `[STO-5]` (matching our SAW reference); the delimiter is cosmetic —
  trackers match the bare ID, so `(STO-5)` links too.
- Writers keep the creative commit types (`scene`, `dialogue`, `action`, ...) — see `CLAUDE.md`.

## Pull requests

- **Title:** `type(scope): description [TICKET-ID]` — CI enforces the `type(scope): ...` shape.
- **Body:** reference the issue with a closing keyword (`Closes STO-4`) and describe what and
  why, plus how you verified.
- **One ticket = one PR.** Keep scope tight for easy review.
- **Merge method:** **squash** feature PRs into `develop`; **merge commit** for `develop → main`
  promotes. **Never rebase-merge** — see [Branching & merge model](#branching--merge-model).

## Branching & merge model

Two long-lived, protected branches (PR-only, required checks, no force-push):

- **`main`** — always releasable. It's the repo's **default branch**, so it's what people get from
  **"Use this template"** and what carries the release tags. Never commit to it directly.
- **`develop`** — the integration branch; feature work lands here first.

**Flow (dev → main):**

1. Branch `STO-<n>-<slug>` off **`develop`**.
2. PR into **`develop`** → **squash merge** (one tidy commit per feature; branch is deleted).
3. At a release, open a promote PR **`develop → main`** → **merge commit**, then tag the release on `main`.
4. If `main` ever gains a change `develop` lacks (e.g. a hotfix), **back-merge `main → develop`** (merge commit).

**Never rebase-merge.** Rebase rewrites commit SHAs, so the same content lands on `main` and `develop`
under *different* SHAs and the two branches permanently drift. The `wtfb-standards` ruleset now allows
only **merge** and **squash** to make that mistake impossible.

**What "in sync" means here:** between releases `develop` is expected to be *ahead* of `main` by its
unreleased commits — that's an integration branch working as intended, not drift. `main` and `develop`
share the same *content* and *connected history*; they need not sit at byte-identical commit SHAs.

CI (the required validation checks) runs on PRs into **both** `main` and `develop`.

## Before you open a PR

```bash
npm run validate   # fountain + markdown + spelling + capability checks
```

CI also validates skill/command frontmatter, markdown, spelling, and the PR-title format.

## How tickets connect to GitHub (with any tracker)

The issue ID in the branch and PR is the connective tissue. How much is automated depends on the
tracker:

- **Linear / Jira:** a branch or PR whose name carries the issue ID is **auto-linked**, and the
  issue **moves** through its states (In Progress → In Review → Done) as the PR opens and merges.
- **GitHub Issues:** use a closing keyword in the PR body (`Closes #123`) to link and auto-close;
  a branch-name prefix alone won't move an issue (GitHub issues have no built-in workflow states
  without GitHub Projects).

Either way, keep the ID at the front of the branch and reference it in the PR — swap Linear for
your own tracker and the workflow is unchanged.

## Setup, tooling & reference

For editor setup (VS Code extensions), the capability contract for skills and commands, the
spell-check dictionary, and protected-content paths, see
**[docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)**. That page is the deep reference; this page is
the canonical source for the **workflow** (branch, commit, PR, and merge conventions).
