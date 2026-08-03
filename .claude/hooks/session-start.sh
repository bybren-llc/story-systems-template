#!/usr/bin/env bash
#
# SessionStart hook — smart welcome banner (new vs. existing project).
#
# NOTE: Phase 2 (STO-10) will upgrade this to a "count, don't claim" banner that
# reports real scene/page counts. For now it ports the existing detection logic
# into a maintainable script (was previously an inline command that never ran).

if ls *.fountain >/dev/null 2>&1; then
  TITLE=$(grep -m1 'Title:' *.fountain 2>/dev/null | head -1 | sed 's/.*\*\*\(.*\)\*\*.*/\1/' | sed 's/Title:[[:space:]]*//' | tr -d '\n')
  echo "------------------------------------------------------------"
  echo "     \"${TITLE:-Your Screenplay}\""
  echo "------------------------------------------------------------"
  echo ""
  echo "Quick Commands:"
  echo "  /start-scene      Continue writing"
  echo "  /scene-list       See all scenes"
  echo "  /page-count       Check page count"
  echo "  /export-pdf       Generate PDF"
  echo ""
  echo "Need help?"
  echo "  /stuck            Not sure what to do next"
  echo "  /check-format     Validate formatting"
  echo ""
  echo "Tip: Just describe what you want to write!"
else
  echo "------------------------------------------------------------"
  echo "        Welcome to the Screenwriting Workspace"
  echo "------------------------------------------------------------"
  echo ""
  echo "Looks like a new project! Let's get you started."
  echo ""
  echo "  /start-project   Set up your screenplay (recommended)"
  echo "  /import          Bring in an existing script"
  echo ""
  echo "Or just tell me your story idea!"
  echo "------------------------------------------------------------"
fi

exit 0
