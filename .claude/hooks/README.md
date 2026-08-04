# Claude Code Hooks

These hooks are wired into the runtime via [`.claude/settings.json`](../settings.json) — Claude
Code loads hooks from `settings.json`, not from a standalone file. Each `settings.json` entry runs
one of the scripts here.

| Event | Script | What it does |
|-------|--------|--------------|
| SessionStart | `session-start.sh` | Welcome banner (new vs. existing project) |
| SessionEnd | `session-end.sh` | Warn about uncommitted work at session close |
| UserPromptSubmit | `warn-branch.sh` | Remind to branch off `main` |
| PreToolUse (Write/Edit/MultiEdit) | `remind-fountain.sh` | Fountain-format reminder on `.fountain` edits |
| PreToolUse (Bash) | `guard-git.sh` | **Blocks** push to `main` (branch or `:main` refspec) and push with uncommitted tracked changes; commit-format reminder |
| PostToolUse (Write/Edit/MultiEdit) | `post-fountain.sh` | Suggest `/check-format` after `.fountain` edits |

## Conventions

- **Matchers match the tool NAME** (e.g. `Bash`, `Write|Edit|MultiEdit`); the tool payload
  arrives as JSON on **stdin**, parsed with `node`.
- **A blocking `PreToolUse` hook exits 2** (exit 0 allows). `guard-git.sh` uses
  invocation-anchored detection (it tokenizes the command on shell operators), so a command that
  merely *mentions* `git push` / `git commit` is not falsely blocked; it also fails **closed** if
  `node` is unavailable. A paired `git commit … && git push` (the commit runs before the push in
  one command) is allowed.
- Scripts are executable (`chmod +x`); `.claude/settings.json` invokes each via
  `bash "$CLAUDE_PROJECT_DIR/.claude/hooks/<script>"`.

## Customizing

Edit `.claude/settings.json` to add/remove events, and drop a matching script here. Keep hooks
fast and dependency-light.
