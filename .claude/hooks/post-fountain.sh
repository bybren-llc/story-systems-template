#!/usr/bin/env bash
#
# PostToolUse(Write|Edit) hook — suggest format validation after Fountain edits.
# Non-blocking: always exits 0.

INPUT=$(cat)

FILE=$(printf '%s' "$INPUT" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{let f="";try{const t=JSON.parse(s).tool_input||{};f=t.file_path||t.path||""}catch(e){}process.stdout.write(String(f))})' 2>/dev/null)

case "$FILE" in
  *.fountain)
    echo "✨ Fountain file updated. Consider running /check-format to validate."
    ;;
esac

exit 0
