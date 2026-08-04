#!/bin/bash
# restore-protected-paths.sh — enforce protectedPaths after an upstream template merge.
#
# After `git merge upstream/main --no-commit`, upstream's version of every changed file is
# staged — including files the fork owns. This script restores the fork's protected paths to
# our committed version so a template sync can NEVER overwrite them, and drops any files the
# merge ADDED under a protected path.
#
# It is the single enforcement point shared by scripts/sync-upstream.sh (interactive) and
# .github/workflows/sync-upstream.yml (scheduled). Run it AFTER the merge, BEFORE committing.
#
# Usage: scripts/restore-protected-paths.sh [ref]
#   ref  Git ref holding the fork's authoritative version (default: HEAD — correct during a
#        `--no-commit` merge, since HEAD is still the fork commit).
#
# Notes:
#   - bash 3.2 compatible (macOS default): no `mapfile`, no `declare -A`.
#   - Uses git pathspec matching (exact path semantics), NOT substring matching — so a short
#     pattern can't over-match unrelated files.
#   - Also resolves protected-file merge CONFLICTS in the fork's favour (checkout takes REF).

set -e

REF="${1:-HEAD}"
CONFIG=".wtfb/project.json"

if [ ! -f "$CONFIG" ]; then
  echo "restore-protected-paths: $CONFIG not found; nothing to protect." >&2
  exit 0
fi

if ! command -v jq >/dev/null 2>&1; then
  echo "restore-protected-paths: jq is required but not installed." >&2
  exit 1
fi

PATTERNS="$(jq -r '.protectedPaths[]? // empty' "$CONFIG")"
if [ -z "$PATTERNS" ]; then
  echo "restore-protected-paths: no protectedPaths declared; nothing to do."
  exit 0
fi

restored_any=0
removed_any=0

# Heredoc (not a pipe) so the loop runs in THIS shell and the counters persist (bash 3.2 safe).
while IFS= read -r pattern; do
  [ -z "$pattern" ] && continue

  # 1) Restore the fork's version of any modified/deleted/conflicted protected file.
  #    A pattern that matches nothing in REF is not an error — swallow it and move on.
  if git checkout "$REF" -- "$pattern" 2>/dev/null; then
    restored_any=1
  fi

  # 2) Drop files the merge ADDED under this protected path (checkout won't delete new files).
  #    Only remove additions that do not exist in REF — i.e. genuinely upstream-new content
  #    landing inside a fork-owned area.
  adds="$(git diff --cached --name-only --diff-filter=A -- "$pattern" 2>/dev/null || true)"
  if [ -n "$adds" ]; then
    printf '%s\n' "$adds" | while IFS= read -r f; do
      [ -z "$f" ] && continue
      if ! git cat-file -e "$REF:$f" 2>/dev/null; then
        git rm -f --quiet -- "$f" 2>/dev/null || true
      fi
    done
    removed_any=1
  fi
done <<EOF
$PATTERNS
EOF

if [ "$restored_any" = "1" ] || [ "$removed_any" = "1" ]; then
  echo "restore-protected-paths: protected paths reconciled to '$REF' (fork versions preserved)."
else
  echo "restore-protected-paths: no protected paths were touched by this merge."
fi
