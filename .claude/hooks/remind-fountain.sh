#!/usr/bin/env bash
#
# PreToolUse(Write|Edit) hook — Fountain formatting reminder.
#
# The matcher matches the tool NAME ("Write" or "Edit"); the target file arrives
# as JSON on stdin (tool_input.file_path). Non-blocking: always exits 0.

INPUT=$(cat)

FILE=$(printf '%s' "$INPUT" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{let f="";try{const t=JSON.parse(s).tool_input||{};f=t.file_path||t.path||""}catch(e){}process.stdout.write(String(f))})' 2>/dev/null)

case "$FILE" in
  *.fountain)
    echo "📝 REMINDER: Writing a Fountain file. Ensure proper formatting:"
    echo "   - Scene headings: INT./EXT. LOCATION - TIME"
    echo "   - Character names: UPPERCASE"
    echo "   - Blank line before character names"
    ;;
esac

exit 0
