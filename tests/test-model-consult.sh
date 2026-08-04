#!/bin/bash
# test-model-consult.sh — proves the model-consult connector talks to an OpenAI-compatible
# endpoint and degrades gracefully (STO-17). Spins up a tiny mock /v1/chat/completions server
# in Node, points the registry's vllm-local entry at it via env vars, and asserts:
#   1. `consult` returns the model's completion text.
#   2. `list` reports the endpoint as configured, without leaking secrets.
#   3. an unreachable endpoint yields a structured error (never a faked completion), exit 1.
#   4. consulting an anthropic model is refused (runs natively, not via the connector).

set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

fail() { echo "FAIL: $1"; [ -n "$MOCK_PID" ] && kill "$MOCK_PID" 2>/dev/null; exit 1; }
pass() { echo "PASS: $1"; }

# --- Start a mock OpenAI-compatible server on an ephemeral port -----------------
MOCK_OUT="$(mktemp)"
node -e '
const http = require("http");
const server = http.createServer((req, res) => {
  if (req.method === "POST" && req.url === "/v1/chat/completions") {
    let body = "";
    req.on("data", c => body += c);
    req.on("end", () => {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({
        choices: [{ message: { role: "assistant", content: "MOCK PITCH: three-act with a cold open." } }],
        usage: { prompt_tokens: 10, completion_tokens: 8 }
      }));
    });
  } else { res.statusCode = 404; res.end("nope"); }
});
server.listen(0, "127.0.0.1", () => console.log(server.address().port));
' > "$MOCK_OUT" &
MOCK_PID=$!

# Wait for the port line
PORT=""
for _ in $(seq 1 50); do
  PORT="$(head -n1 "$MOCK_OUT" 2>/dev/null | tr -dc '0-9')"
  [ -n "$PORT" ] && break
  sleep 0.1
done
[ -n "$PORT" ] || fail "mock server did not start"
pass "mock OpenAI-compatible server up on :$PORT"

export WTFB_VLLM_BASE_URL="http://127.0.0.1:$PORT/v1"
export WTFB_VLLM_API_KEY="test-key"

# --- 1. consult returns the completion ------------------------------------------
OUT="$(node scripts/model-consult.js consult vllm-local --seat guest --prompt 'pitch me an opening' 2>/dev/null)"
echo "$OUT" | grep -q 'MOCK PITCH' || fail "consult did not return the mock completion (got: $OUT)"
pass "consult returned the model completion"

# --- 2. list reports configured, no secret leak ---------------------------------
LIST="$(node scripts/model-consult.js list 2>/dev/null)"
echo "$LIST" | grep -q '"endpointConfigured": true' || fail "list did not report endpoint configured"
if echo "$LIST" | grep -q "test-key"; then fail "list leaked the API key"; fi
if echo "$LIST" | grep -q "127.0.0.1"; then fail "list leaked the endpoint URL"; fi
pass "list reports configured without leaking secrets"

# --- 3. unreachable endpoint → structured error, exit 1 -------------------------
kill "$MOCK_PID" 2>/dev/null; wait "$MOCK_PID" 2>/dev/null || true; MOCK_PID=""
set +e
ERR="$(node scripts/model-consult.js consult vllm-local --seat guest --prompt 'x' 2>&1)"
CODE=$?
set -e
[ "$CODE" = "1" ] || fail "expected exit 1 on unreachable endpoint, got $CODE"
echo "$ERR" | grep -q 'NETWORK_ERROR' || fail "expected structured NETWORK_ERROR (got: $ERR)"
echo "$ERR" | grep -qi 'MOCK PITCH' && fail "faked a completion on failure"
pass "unreachable endpoint degrades to a structured error (no fake)"

# --- 4. anthropic model is refused (native, not via connector) ------------------
set +e
AERR="$(node scripts/model-consult.js consult claude-opus --seat story-architect --prompt 'x' 2>&1)"
ACODE=$?
set -e
[ "$ACODE" = "1" ] || fail "expected exit 1 consulting an anthropic model, got $ACODE"
echo "$AERR" | grep -q 'PROVIDER_UNSUPPORTED' || fail "expected PROVIDER_UNSUPPORTED for anthropic (got: $AERR)"
pass "anthropic model correctly refused (runs natively)"

echo "ALL MODEL-CONSULT TESTS PASSED"
