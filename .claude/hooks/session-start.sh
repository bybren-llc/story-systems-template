#!/usr/bin/env bash
#
# SessionStart hook — "count, don't claim" banner.
#
# Reports REAL project state computed from disk (scene count + page estimate) and the
# current focus from .wtfb/session/progress.md — it never asserts a status it did not
# actually check. A green check for an unperformed check is a lie.

if ls ./*.fountain >/dev/null 2>&1; then
  # --- numbers computed from the .fountain files ---
  TITLE=$(grep -m1 'Title:' -- ./*.fountain 2>/dev/null | head -1 | sed 's/.*\*\*\(.*\)\*\*.*/\1/' | sed 's/Title:[[:space:]]*//' | tr -d '\n')
  SCENES=$(grep -hcE '^(INT\.|EXT\.|INT\./EXT\.|I/E\.)[[:space:]]' -- ./*.fountain 2>/dev/null | awk '{s+=$1} END{print s+0}')
  LINES=$(cat ./*.fountain 2>/dev/null | wc -l | tr -d ' ')
  PAGES=$(( (LINES + 54) / 55 ))   # ~55 lines/page, rounded up

  # --- resume focus from session memory (blank if still the placeholder) ---
  FOCUS=""
  if [ -f .wtfb/session/progress.md ]; then
    FOCUS=$(grep -m1 -- '- \*\*Working on:\*\*' .wtfb/session/progress.md 2>/dev/null \
      | sed 's/.*Working on:\*\*[[:space:]]*//' \
      | sed 's/_([^)]*)_//g' \
      | sed 's/[[:space:]]*$//' | tr -d '\n')
  fi

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
else
  # New project — nothing to count yet, so claim nothing.
  echo "------------------------------------------------------------"
  echo "        Welcome to the Screenwriting Workspace"
  echo "------------------------------------------------------------"
  echo ""
  echo "No .fountain files yet — nothing to count. Let's get you started."
  echo ""
  echo "  /start-project   Set up your screenplay (recommended)"
  echo "  /import          Bring in an existing script"
  echo ""
  echo "Or just tell me your story idea!"
  echo "------------------------------------------------------------"
fi

exit 0
