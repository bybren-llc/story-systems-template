#!/usr/bin/env bash
#
# UserPromptSubmit hook — remind to branch off main for substantive work.
# Non-blocking: always exits 0.

BRANCH=$(git branch --show-current 2>/dev/null || echo "")
if [ "$BRANCH" = "main" ]; then
  echo "⚠️  REMINDER: You are on 'main'. Create a feature branch for major screenplay changes."
fi

exit 0
