# Model Routing

> Per-role model assignments for the WTFB 11-agent harness.
> This is the routing **policy**. The `model:` field is wired into each agent's YAML frontmatter
> (STO-11) so dispatch is automatic — this doc stays the human-readable source.

## Why route by role

Different creative tasks reward different models. Prose voice and subtext benefit from the
strongest creative-writing model; structural reasoning and continuity benefit from the
strongest reasoning model; mechanical chores (counting pages, listing scenes, validating
format) should run on the fastest, cheapest model. Routing per role keeps quality high
where it matters and cost low where it doesn't.

## Model tiers (as of 2026-08)

| Tier | Model | Model ID | Best for |
|------|-------|----------|----------|
| **Prose** | Claude Fable 5 | `claude-fable-5` | Voice, subtext, dialogue, scene prose (premier creative model; ~2× Opus output cost) |
| **Reasoning** | Claude Opus 4.8 | `claude-opus-4-8` | Structure, continuity, standards judgment, orchestration |
| **Balanced** | Claude Sonnet 5 | `claude-sonnet-5` | Economical default for mixed drafting + tooling (optional) |
| **Mechanical** | Claude Haiku 4.5 | `claude-haiku-4-5` | Page counts, scene lists, format validation, registry updates |

## Role → model

| Agent | Model | Rationale |
|-------|-------|-----------|
| Story Architect | `claude-opus-4-8` | Three-act/beat structure, plot logic (VETO authority) |
| Story Analyst | `claude-opus-4-8` | Scene-by-scene analysis, audience/market reasoning |
| Dialogue Writer | `claude-fable-5` | Character voice, subtext — prose quality is the product |
| Scene Writer | `claude-fable-5` | Action/visual prose — prose quality is the product |
| Scene Annotator | `claude-haiku-4-5` | Notes, synopses, organization — mostly mechanical |
| Continuity Editor | `claude-opus-4-8` | Timeline/prop/character consistency reasoning |
| Script Supervisor | `claude-opus-4-8` | Format & syntax compliance (GATE authority) |
| Standards Reviewer | `claude-opus-4-8` | Industry-standard + capability compliance judgment |
| Research Specialist | `claude-opus-4-8` | Accuracy, fact-checking, authenticity |
| Production Coordinator | `claude-haiku-4-5` | Exports & delivery — mechanical toolchain |
| Session Manager | `claude-opus-4-8` | Task routing / orchestration reliability |

## Command / task → model

Mechanical commands should run on the mechanical tier regardless of which agent invokes
them:

| Command / task | Model |
|----------------|-------|
| `/page-count`, `/scene-list` | `claude-haiku-4-5` |
| `/check-format`, `lint:fountain` | `claude-haiku-4-5` |
| Continuity/character registry updates | `claude-haiku-4-5` |
| `/analyze-structure`, `/story-check`, `/power-analysis` | `claude-opus-4-8` |
| `/writers-room`, scene/dialogue drafting | `claude-fable-5` |

## Notes

- IDs above are current as of 2026-08; update when Anthropic ships successors.
- `claude-sonnet-5` is a valid economical substitute anywhere Opus is listed when cost
  matters more than the last increment of quality.
- The `model:` field in each agent's frontmatter is the enforcement (STO-11); this doc is the
  human-readable policy behind it.
- `.wtfb/ai-harness/schema.json` carries `model` on **all 11 agents** (reconciled in STO-12);
  a CI parity gate keeps schema models and agent frontmatter in agreement.
- **Gemini/Codex parity is deferred.** These are Claude Code hooks/models; `.gemini/` keeps
  its own harness and cannot route to Claude model IDs, so per-role model routing is a
  Claude-surface concern for now.

## Beyond Claude — the multi-model council

Per-role routing above is Claude-only. To convene **other** models (self-hosted vLLM, other
cloud) alongside Claude in the writer's room, see the provider-aware roster at
`.wtfb/ai-harness/model-registry.json` (validated by `npm run lint:models`) and the design in
[`docs/adr/0001-multi-model-writers-room.md`](../docs/adr/0001-multi-model-writers-room.md).
The registry references env-var **names** only — real endpoints/keys live in `.env`.
