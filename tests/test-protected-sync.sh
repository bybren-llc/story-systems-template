#!/bin/bash
# test-protected-sync.sh — proves scripts/restore-protected-paths.sh preserves fork-owned
# protected paths across an upstream template merge.
#
# Scenario (the STO-22 data-loss case):
#   - fork owns a protected screenplay (*.fountain) and session state (.wtfb/session/**)
#   - upstream OVERWRITES the screenplay, OVERWRITES session state, ADDS a file under a
#     protected path, and legitimately updates a syncPath file
#   - after merge + enforcement: protected files keep the FORK's content, the protected
#     addition is dropped, and the syncPath change is allowed through.
#
# Self-contained: builds throwaway git repos in a temp dir. bash 3.2 compatible.

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
ENFORCER="$SCRIPT_DIR/scripts/restore-protected-paths.sh"

fail() { echo "FAIL: $1"; exit 1; }
pass() { echo "PASS: $1"; }

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

export GIT_AUTHOR_NAME=test GIT_AUTHOR_EMAIL=test@test
export GIT_COMMITTER_NAME=test GIT_COMMITTER_EMAIL=test@test

# --- Build the fork repo -----------------------------------------------------
FORK="$TMP/fork"
mkdir -p "$FORK"
cd "$FORK"
git init -q
git config commit.gpgsign false

mkdir -p .wtfb/session scripts
cat > .wtfb/project.json <<'JSON'
{
  "protectedPaths": ["*.fountain", ".wtfb/session/**"],
  "syncPaths": ["scripts/**"]
}
JSON
printf 'FORK SCREENPLAY\n' > screenplay.fountain
printf 'FORK PROGRESS\n' > .wtfb/session/progress.md
printf 'fork tool v1\n' > scripts/tool.sh
git add -A
git commit -qm "fork base"
git branch -M main   # normalize branch name (CI git may default to 'master')

# --- Build upstream as a branch that diverges --------------------------------
git checkout -qb upstream
printf 'UPSTREAM SCREENPLAY\n' > screenplay.fountain            # overwrite protected
printf 'UPSTREAM PROGRESS\n' > .wtfb/session/progress.md        # overwrite protected
printf 'UPSTREAM ADDED\n' > .wtfb/session/upstream-note.md      # ADD under protected
printf 'upstream tool v2\n' > scripts/tool.sh                   # legit syncPath change
git add -A
git commit -qm "upstream changes"

# --- Simulate the sync: merge upstream, then enforce -------------------------
git checkout -q main
git merge upstream --no-commit --no-ff >/dev/null 2>&1 || true
bash "$ENFORCER" HEAD >/dev/null

# --- Assertions --------------------------------------------------------------
# 1. Protected screenplay keeps FORK content in the worktree.
grep -q 'FORK SCREENPLAY' screenplay.fountain || fail "screenplay.fountain was overwritten by upstream"
pass "protected *.fountain kept fork content"

# 2. Protected screenplay is NOT part of the staged merge (no diff vs HEAD).
if git diff --cached --name-only | grep -qx 'screenplay.fountain'; then
  fail "screenplay.fountain still staged as a change (upstream version would be committed)"
fi
pass "protected *.fountain not staged for commit"

# 3. Protected session state keeps FORK content.
grep -q 'FORK PROGRESS' .wtfb/session/progress.md || fail ".wtfb/session/progress.md was overwritten"
pass "protected .wtfb/session/** kept fork content"

# 4. Upstream-ADDED file under a protected path was dropped.
if [ -e .wtfb/session/upstream-note.md ]; then
  fail "upstream-added file under protected path survived (should be dropped)"
fi
pass "upstream addition under protected path dropped"

# 5. Legit syncPath change WAS allowed through.
grep -q 'upstream tool v2' scripts/tool.sh || fail "syncPath change (scripts/tool.sh) was blocked"
pass "syncPath change allowed through"

echo "ALL PROTECTED-SYNC TESTS PASSED"
