#!/usr/bin/env bash
#
# SessionStart hook — "count, don't claim" banner.
#
# Reports REAL project state computed from disk (scene count + page estimate) and the
# current focus from .wtfb/session/progress.md — it never asserts a status it did not
# actually check. A green check for an unperformed check is a lie.

# --- find the writer's screenplay wherever it lives ---
# This used to glob ./*.fountain, the repo root only. A writer keeping their script in
# drafts/ or screenplay/ was told "No .fountain files yet" and pointed at /start-project,
# which scaffolds over existing work (STO-30). Reporting nothing to count while a
# screenplay sits on disk is exactly the failure this banner exists to prevent.
#
# templates/ is excluded so a fresh checkout — whose only .fountain is the blank stub —
# still reads as a new project instead of claiming "~1 pages · 1 scenes".
# -prune stops traversal rather than filtering output: -not -path './node_modules/*' only
# matched a ROOT-level node_modules, so a nested one still contributed .fountain files and
# still got walked. templates is pruned at root only — a writer's own templates/ subdirectory
# is their work, not our stub.
# -type f excludes FIFOs and directories, either of which could hang grep or cat.
# -print0 with read -d '' keeps a filename containing a newline as one entry.
#
# Discovery errors are captured, never swallowed. A permission error used to produce the
# same "No .fountain files yet" message as a genuinely empty project — so an unreadable
# directory pointed the writer at /start-project, which scaffolds over their work. Failing
# open on a scan is the same defect as globbing the wrong directory.
#
# No predictable /tmp fallback: a fixed path like /tmp/wtfb-find-err.$$ can be pre-created
# as a symlink by a local user, and the 2> redirect would follow it and truncate whatever it
# points at (CWE-377). If mktemp -d fails we treat that as a scan failure instead.
#
# find and sort run into files rather than a pipeline so their real exit statuses are
# visible — process substitution discards them, which is how a failed scan could still have
# looked like an empty project.
FOUNTAIN_FILES=()
FIND_ERRORS=""
_scan_dir="$(mktemp -d 2>/dev/null)"
if [ -z "$_scan_dir" ] || [ ! -d "$_scan_dir" ]; then
  FIND_ERRORS="could not create a private temporary directory for the scan"
else
  trap 'rm -rf -- "$_scan_dir"' EXIT INT TERM
  if ! find . \( -name node_modules -o -name .git \) -prune -o \
            -path './templates' -prune -o \
            -type f -name '*.fountain' -print0 \
            >"$_scan_dir/out" 2>"$_scan_dir/err"; then
    FIND_ERRORS="find exited non-zero while scanning for .fountain files"
  fi
  if [ -s "$_scan_dir/err" ]; then
    FIND_ERRORS="$(head -3 -- "$_scan_dir/err")"
  fi
  if [ -z "$FIND_ERRORS" ]; then
    if ! sort -z <"$_scan_dir/out" >"$_scan_dir/sorted" 2>/dev/null; then
      FIND_ERRORS="could not sort the scan results"
    else
      while IFS= read -r -d '' f; do
        FOUNTAIN_FILES+=("$f")
      done <"$_scan_dir/sorted"
    fi
  fi
  rm -rf -- "$_scan_dir"
  trap - EXIT INT TERM
fi

# --- resume focus from session memory (blank if still the placeholder) ---
# Read outside the screenplay branch: a writer outlining in progress.md before any
# .fountain exists should still see where they left off.
FOCUS=""
if [ -f .wtfb/session/progress.md ]; then
  FOCUS=$(grep -m1 -- '- \*\*Working on:\*\*' .wtfb/session/progress.md 2>/dev/null \
    | sed 's/.*Working on:\*\*[[:space:]]*//' \
    | sed 's/_([^)]*)_//g' \
    | sed 's/[[:space:]]*$//' | tr -d '\n')
fi

if [ ${#FOUNTAIN_FILES[@]} -gt 0 ]; then
  # --- numbers computed from the .fountain files ---
  # -h suppresses the filename prefix grep adds once more than one file matches.
  TITLE=$(grep -h -m1 'Title:' -- "${FOUNTAIN_FILES[@]}" 2>/dev/null | head -1 | sed 's/.*\*\*\(.*\)\*\*.*/\1/' | sed 's/Title:[[:space:]]*//' | tr -d '\n')
  SCENES=$(grep -hcE '^(INT\.|EXT\.|INT\./EXT\.|I/E\.)[[:space:]]' -- "${FOUNTAIN_FILES[@]}" 2>/dev/null | awk '{s+=$1} END{print s+0}')
  LINES=$(cat -- "${FOUNTAIN_FILES[@]}" 2>/dev/null | wc -l | tr -d ' ')
  PAGES=$(( (LINES + 54) / 55 ))   # ~55 lines/page, rounded up

  echo "------------------------------------------------------------"
  echo "     \"${TITLE:-Untitled Screenplay}\""
  echo "     ~${PAGES} pages · ${SCENES} scenes   (estimated from your .fountain files)"
  echo "------------------------------------------------------------"
  echo ""
  if [ -n "$FOCUS" ]; then
    echo "Resuming — last focus: ${FOCUS}"
    echo ""
  fi
  echo "Quick Commands:"
  echo "  /start-scene      Continue writing (resumes from session memory)"
  echo "  /scene-list       See all scenes"
  echo "  /page-count       Exact page estimate"
  echo "  /export-pdf       Generate PDF"
  echo ""
  echo "Need help?"
  echo "  /stuck            Not sure what to do next"
  echo "  /check-format     Validate formatting"
elif [ -n "$FIND_ERRORS" ]; then
  # The scan did not finish. Do NOT say the project is empty — that is the message that
  # sends a writer to /start-project and over their own draft. Report what failed instead.
  echo "------------------------------------------------------------"
  echo "        Could not finish scanning for screenplays"
  echo "------------------------------------------------------------"
  echo ""
  echo "$FIND_ERRORS"
  echo ""
  echo "No screenplay was found, but the scan hit the errors above — so this is NOT a"
  echo "claim that your project is empty. Resolve them and start a new session."
  echo ""
  if [ -n "$FOCUS" ]; then
    echo "Resuming — last focus: ${FOCUS}"
    echo ""
  fi
  echo "  /stuck            Help working out what went wrong"
  echo "------------------------------------------------------------"
else
  # New project — nothing to count yet, so claim nothing.
  echo "------------------------------------------------------------"
  echo "        Welcome to the Screenwriting Workspace"
  echo "------------------------------------------------------------"
  echo ""
  echo "No .fountain files yet — nothing to count. Let's get you started."
  echo ""
  if [ -n "$FOCUS" ]; then
    echo "Resuming — last focus: ${FOCUS}"
    echo ""
  fi
  echo "  /start-project   Set up your screenplay (recommended)"
  echo "  /import          Bring in an existing script"
  echo ""
  echo "Or just tell me your story idea!"
  echo "------------------------------------------------------------"
fi

exit 0
