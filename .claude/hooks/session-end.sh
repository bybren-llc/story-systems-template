#!/usr/bin/env bash
#
# SessionEnd hook — warn about uncommitted work at session close.
# Non-blocking: always exits 0.

if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
  echo "⚠️  Session ending with uncommitted changes. Use /end-session to complete cleanly."
else
  echo "✅ Clean session end - no uncommitted changes."
fi

exit 0
