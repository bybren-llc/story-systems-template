# ADR 0001 — Multi-Model / Multi-Provider Writer's Room

- **Status:** Accepted (spike, STO-15) — design gate for Phase 4
- **Date:** 2026-08-04
- **Deciders:** SAFe ARCHitect (harness), J. Scott Graham
- **Related:** STO-2 (per-role model routing), STO-11 (dispatchable subagents), STO-16 / STO-17 / STO-18 (implementation)

## Context

The writer's room (`.claude/skills/writers-room/SKILL.md`) convenes six seats — Story Architect,
Story Analyst, Dialogue Writer, Scene Writer, Standards Reviewer, Research Specialist — to pitch
before writing begins. Today all six role-play on **one** underlying model. There is no provider
or model diversity: the "diverse perspectives" are diverse *prompts*, not diverse *minds*.

The goal for Phase 4 is to let the room convene genuinely different models for best-effort,
diverse creative work:

- **Claude** (Fable 5 prose, Opus 4.8 reasoning, Haiku 4.5 mechanical) — already routed per role (STO-11).
- **Local models** via a **self-hosted vLLM** OpenAI-compatible service (`/v1/chat/completions`).
- **Other cloud providers** (OpenAI-compatible clouds, Anthropic API, Gemini).

This ADR picks the integration mechanism, the provider abstraction, the seat→model mapping and
orchestration, and where config and secrets live. It then splits the build into STO-16/17/18.

## Decision

### 1. Integration mechanism — a hybrid: native Claude subagents + one MCP "consult" tool

Claude seats stay **native**: the room already dispatches the STO-11 subagents on their routed
Claude models. That path is unchanged and remains the zero-config default.

Non-Claude seats are reached through a small **MCP server** (`model-consult`) exposing two tools:

- `list_models()` → the configured roster (from the registry, secrets redacted).
- `consult_model(model_id, seat, system, prompt, params?)` → one seat's pitch as text + usage.

**Why MCP over the alternatives:**

| Option | Verdict |
|--------|---------|
| **MCP server exposing `consult_model`** | ✅ **Chosen.** Native Claude Code extension point; in-session; no shelling; one place for provider adapters + secret handling; usable by any skill/agent, not just the writer's room. |
| `@wtfb/cli consult <model>` (Bash) | ❌ Requires craft agents to hold `Bash` (we just removed it, STO-11), moves secrets into CLI argv/env per call, and couples orchestration to shell parsing. |
| Agent SDK sub-sessions | ❌ Sub-sessions are Claude-model oriented; they don't abstract arbitrary OpenAI-compatible / vLLM providers, which is the whole point. |

The MCP server is the single choke point where provider adapters, endpoints, and API keys live —
so no agent profile ever handles a secret.

### 2. Provider abstraction — one `ModelAdapter`, OpenAI-compatible first

A single interface, `chat({ model, messages, params }) → { text, usage }`, with adapters:

- **`OpenAICompatibleAdapter`** — covers **self-hosted vLLM** *and* other OpenAI-compatible
  clouds (Together, Fireworks, OpenRouter, Ollama's `/v1`) with just a `baseURL` + `apiKey`.
  vLLM's OpenAI compatibility means the MVP needs **only this one adapter**.
- **`AnthropicAdapter`** (Messages API) and **`GeminiAdapter`** — added when a non-OpenAI-shaped
  provider is actually rostered; not required for MVP.

Adapter selection is by the registry entry's `provider` field. The interface is intentionally
tiny (chat completion + usage) — no streaming, tools, or vision in v1.

### 3. Seat → model mapping and orchestration — diverse panel, then synthesize

The room gains a **council roster**: each seat maps to a registry `model_id`. Three modes:

- **`solo` (default, backward compatible):** every seat = its routed Claude model. No registry
  or endpoints required. Nothing changes for existing users.
- **`diverse`:** seats spread across providers — e.g. Story Architect = Opus, Dialogue Writer =
  Fable, plus **guest seats** on local vLLM models (a Qwen/Llama wildcard) and a Gemini seat.
- **`custom`:** explicit roster passed at invocation.

Orchestration (the **Session Manager** conducts):

1. **Gather pitches in parallel.** Claude seats via native subagents; non-Claude seats via
   `consult_model`. Each returns a structured pitch (vision, risks, signature move).
2. **Synthesize.** A single Claude Opus pass consolidates all pitches into one direction,
   crediting which seat/model each surviving idea came from — the "diverse panel → synthesize"
   pattern, so provenance is visible.
3. **Degrade gracefully.** Any seat whose provider is unreachable (local vLLM down, missing key)
   is **skipped with a logged note**, never faked — the room continues with the seats it has.
   No silent caps: the synthesis header states which seats spoke and which were skipped.

### 4. Config and secrets

- **Registry (committed, no secrets):** `.wtfb/ai-harness/model-registry.json` — provider,
  model id, `baseUrlEnv`, `apiKeyEnv`, default params, role/seat affinity. References env var
  **names**, never values.
- **Secrets (never committed):** real values in `.env` (already gitignored) — e.g.
  `WTFB_VLLM_BASE_URL=http://localhost:8000/v1`, `WTFB_VLLM_API_KEY`, cloud keys. Ship a
  documented `.env.example`.
- **Protection:** `.env` stays out of git and out of template sync; the registry is template-owned
  (a `syncPath`) so improvements propagate, while local endpoints live only in each fork's `.env`.

## Consequences

**Positive:** genuine model diversity; one secure choke point (MCP) for all providers; vLLM
"free" via the OpenAI-compatible adapter; fully backward compatible (`solo` default); reusable
`consult_model` beyond the writer's room (e.g. an adversarial second-model review).

**Negative / risks:** a new runtime dependency (the MCP server) and Node deps for provider SDKs;
local vLLM adds ops burden (the user hosts it); non-determinism and cost across providers — bounded
by the roster + graceful-skip. Quality of local models varies — they are *guest* seats, and the
Claude synthesis pass stays the arbiter.

## Implementation split

| Ticket | Scope |
|--------|-------|
| **STO-16 — Registry** | `model-registry.json` + schema + validation (`npm run lint:models`) + `list_models`. Provider-aware, env-var references, no secrets. |
| **STO-17 — Connector** | `model-consult` MCP server: `OpenAICompatibleAdapter` (vLLM first), `consult_model` + `list_models` tools, `.env.example`, graceful errors. |
| **STO-18 — Orchestration** | Upgrade the writer's-room skill to convene the council (roster, parallel pitch-gathering, synthesis-with-provenance, graceful skip) with the `solo` default. |

## Alternatives considered (and rejected)

- **One giant CLI** doing everything (`@wtfb/cli council`) — rejected: secrets in shell, agents
  need `Bash`, harder to reuse.
- **Bake providers into each agent profile** — rejected: scatters secrets and endpoints across 11
  files; the MCP choke point is safer and DRY.
- **Require vLLM** — rejected: the `solo` default must work with zero external services so the
  base template stays complete out of the box.
