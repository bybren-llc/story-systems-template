# Model Routing

> Per-role model assignments for the WTFB 11-agent harness.
> **Phase 0 (this doc):** the routing policy, documented. **Phase 3 (STO-11):** the
> `model:` field gets wired into each agent's YAML frontmatter so dispatch is automatic.

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
- This is **policy**, not enforcement — enforcement lands in Phase 3 (STO-11) via agent
  frontmatter `model:` fields.
- `.wtfb/ai-harness/schema.json` currently carries `model` on the **8 canonical schema
  agents**; the remaining roles (Scene Annotator, Standards Reviewer, Session Manager) are
  reconciled into the schema in Phase 3 (STO-12).
- **Gemini/Codex parity is deferred.** These are Claude Code hooks/models; `.gemini/` keeps
  its own harness and cannot route to Claude model IDs, so per-role model routing is a
  Claude-surface concern for now.
