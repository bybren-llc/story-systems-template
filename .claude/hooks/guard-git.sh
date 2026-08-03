#!/usr/bin/env bash
#
# PreToolUse(Bash) hook — git guardrails for the WTFB harness.
#
# Claude Code passes the tool call as JSON on stdin; the matcher only matches the
# tool NAME ("Bash"), so this script inspects tool_input.command itself.
#
# Exit-code contract (Claude Code):
#   0 = allow (stdout shown to user)
#   2 = BLOCK the tool call (stderr fed back to the model)
#
# Detection is INVOCATION-ANCHORED, not substring: the command is split on shell
# operators and only a segment whose leading token (after env assignments) is
# `git push` / `git commit` counts. This avoids false positives on commands that
# merely MENTION the phrase — echo/grep/heredocs/comments/commit messages.
#
# Blocks: push to main (current branch OR an explicit main refspec); push with
#         uncommitted TRACKED changes (unless the same command also commits).
# Reminds: conventional commit-message format on `git commit`.

INPUT=$(cat)

# Classify with node (robust JSON parse + tokenising). Emits {"push","commit","pushMain"}.
CLASS=$(printf '%s' "$INPUT" | node -e '
let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{
  let cmd="";
  try { cmd = (JSON.parse(s).tool_input||{}).command || ""; } catch(e) { cmd = s; }
  const segs = cmd.split(/&&|\|\||[;&|\n]/);
  let push=false, commit=false, pushMain=false;
  for (let seg of segs){
    seg = seg.trim().replace(/^(?:[A-Za-z_][A-Za-z0-9_]*=[^\s]*\s+)+/, ""); // strip leading env vars
    if (/^git\s+push\b/.test(seg)) {
      push = true;
      const rest = seg.replace(/^git\s+push/, "");
      if (/(^|[\s:])main(\s|$)/.test(rest)) pushMain = true;
    } else if (/^git\s+commit\b/.test(seg)) {
      commit = true;
    }
  }
  process.stdout.write(JSON.stringify({push,commit,pushMain}));
});
' 2>/dev/null)

# Fallback (node absent / unparseable): grep raw stdin and fail CLOSED on push.
if [ -z "$CLASS" ]; then
  if printf '%s' "$INPUT" | grep -Eq '(^|[;&|[:space:]])git[[:space:]]+push\b'; then
    CLASS='{"push":true,"commit":false,"pushMain":false}'
  else
    CLASS='{"push":false,"commit":false,"pushMain":false}'
  fi
  echo "⚠️  guard-git: could not parse tool input with node; using conservative fallback." >&2
fi

has() { printf '%s' "$CLASS" | grep -q "\"$1\":true"; }

if has push; then
  BRANCH=$(git branch --show-current 2>/dev/null || echo "")
  if [ "$BRANCH" = "main" ] || has pushMain; then
    echo "❌ BLOCKER: Refusing to push to main. Use a feature branch and open a PR." >&2
    exit 2
  fi
  # Guard uncommitted TRACKED changes only, and only when the push is not paired
  # with a commit in the same command line (e.g. `git commit ... && git push`).
  if ! has commit; then
    if ! git diff --quiet 2>/dev/null || ! git diff --cached --quiet 2>/dev/null; then
      echo "❌ BLOCKER: Uncommitted (tracked) changes detected. Commit changes before pushing." >&2
      exit 2
    fi
  fi
fi

if has commit; then
  echo "📝 REMINDER: Commit message format: type(scope): description"
  echo "   Types: scene, dialogue, action, structure, revision, notes, format, docs"
fi

exit 0
