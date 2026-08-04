---
name: writers-room
wtfbId: wtfb:writers-room
description: |
  This skill convenes a 6-seat collaborative pre-production session — Story Architect,
  Story Analyst, Dialogue Writer, Scene Writer, Standards Reviewer, and Research Specialist
  pitch their creative visions before writing begins. Optionally convenes the seats across
  MULTIPLE models/providers (Claude + self-hosted vLLM + cloud) for genuine diversity.

  Use when: starting a new screenplay, planning major rewrites,
  reimagining existing material, or seeking diverse expert perspectives.
---

# Writer's Room Skill

## Purpose

A collaborative pre-production workflow where multiple specialized agents pitch their creative visions before any writing begins. This creates diverse perspectives, healthy creative tension, and a synthesized approach that draws from the best ideas.

## When to Use

- Before starting a new screenplay or major rewrite
- When reimagining existing material
- When the creative direction is uncertain
- When you want multiple expert perspectives before committing

## Participants

The Writer's Room convenes 6 specialized agents, each with a distinct role:

### Story Architect
**Focus:** Structure and form
- Alternative three-act structures
- Non-linear possibilities
- Scene sequence options
- Climax variations
- Pacing strategies

### Story Analyst
**Focus:** Character and meaning
- Character arc potential
- Thematic depth opportunities
- Aristotle's Six Components evaluation
- What the story is *really* about
- Theophrastus archetype analysis

### Dialogue Writer
**Focus:** Voice and tone
- Character voice distinctions
- Comedic/dramatic rhythm
- Language approach (profanity, dialect, period)
- Signature lines and moments
- Subtext opportunities

### Scene Writer
**Focus:** Visual storytelling
- Key visual setpieces
- Physical comedy/action beats
- Power dynamics per scene
- Compression opportunities
- "Show don't tell" moments

### Standards Reviewer
**Focus:** Quality and originality
- What makes each proposed element A-grade?
- Weak points to avoid
- Cliche identification
- Fresh vs. derivative analysis
- Genre boundary awareness

### Research Specialist
**Focus:** Authenticity and grounding
- Setting accuracy requirements
- Technical/professional accuracy
- Historical or cultural considerations
- Real-world logic checks
- Reference material needs

## Process

### Step 1: Brief the Room
Provide all participants with:
- The core premise/logline
- Any existing material (V1 script, source material, notes)
- Target tone and audience
- Constraints (runtime, budget considerations, rating)
- What's "sacred" vs. open for reimagining

### Step 2: Individual Pitches
Each agent prepares their perspective:
- What excites them about the material
- Their proposed approach
- Specific recommendations
- Potential concerns or warnings

### Step 3: Synthesis
Combine the best elements from all pitches into:
- A unified creative direction
- Key scenes that must exist
- Tone and voice guidelines
- What's explicitly off-limits
- The "North Star" for the project

## Multi-Model Council (opt-in)

By default every seat is played by its routed Claude model (see `.claude/model-routing.md`) —
"diverse perspectives" from diverse *prompts*. The council upgrade lets the room convene diverse
*minds*: some seats on Claude, some on a self-hosted vLLM model, some on another cloud. This is
additive — the default behavior is unchanged.

### Modes

- **`solo` (default):** all six seats = their routed Claude models. No registry or endpoints
  needed. This is exactly the classic Writer's Room.
- **`diverse`:** seats spread across providers, plus optional **guest seats** on rostered
  non-Claude models (e.g. a local Qwen/Llama wildcard, a Gemini seat).
- **`custom`:** an explicit seat→model roster provided at invocation.

### How the council runs

The **Session Manager** conducts:

1. **Read the roster.** `node scripts/model-consult.js list` (or the `list_models` MCP tool if the
   `model-consult` server is enabled) returns the available models, redacted, with a `ready` flag
   per model. Assign each seat a `model_id` — default is the seat's affinity → Claude model.
2. **Gather pitches in parallel — one mind per seat:**
   - **Claude seats:** dispatch the seat's native subagent ("Acting as the Story Architect…") on
     its routed model, as today.
   - **Guest (non-Claude) seats:** call `consult_model(model_id, seat, system, prompt)` (MCP), or
     `node scripts/model-consult.js consult <model_id> --seat <seat> --prompt "…"`. The `system`
     prompt is the seat's role framing; the `prompt` is the brief from Step 1.
3. **Synthesize with provenance.** A single Claude Opus pass consolidates all pitches into one
   direction and **credits which seat/model each surviving idea came from** — so you can see
   whether the local model or the cloud guest actually moved the needle.
4. **Degrade gracefully — never fake.** If a guest seat's provider is unreachable or
   not configured, the connector returns a structured error (not a completion). **Skip that seat**
   and record it under "Seats skipped" with the reason. The room continues with the seats it has;
   the roster header states who spoke and who was skipped (no silent drops).

### Configuring guests

Guest endpoints and keys live in `.env` (see `.env.example`); the registry
(`.wtfb/ai-harness/model-registry.json`) references only the env-var **names**. To enable the MCP
path, install the SDK and register the server per `scripts/model-consult-mcp.mjs`. With nothing
configured, the room simply runs in `solo` mode.

## Output Format

```markdown
# Writer's Room Creative Direction

## Project: [Title]
## Date: [Session Date]
## Mode: [solo | diverse | custom]

### Council Roster
| Seat | Model | Provider | Spoke? |
|------|-------|----------|--------|
| Story Architect | claude-opus-4-8 | anthropic | ✅ |
| Story Analyst | claude-opus-4-8 | anthropic | ✅ |
| Dialogue Writer | claude-fable-5 | anthropic | ✅ |
| Scene Writer | claude-fable-5 | anthropic | ✅ |
| Standards Reviewer | claude-opus-4-8 | anthropic | ✅ |
| Research Specialist | claude-opus-4-8 | anthropic | ✅ |
| *(guest)* Wildcard | vllm-local | openai-compatible | ✅ / ⏭️ skipped |

*Seats skipped:* [none] — or "Wildcard (vllm-local): NETWORK_ERROR — endpoint unreachable".

---

## The Pitch (From Story Architect · claude-opus-4-8)
[Structure and form recommendations]

## The Heart (From Story Analyst · claude-opus-4-8)
[Character and thematic core]

## The Voice (From Dialogue Writer · claude-fable-5)
[Tone and language approach]

## The Spectacle (From Scene Writer · claude-fable-5)
[Visual setpieces and key moments]

## The Standard (From Standards Reviewer · claude-opus-4-8)
[Quality benchmarks and originality notes]

## The Foundation (From Research Specialist · claude-opus-4-8)
[Authenticity requirements]

---

## Synthesized Creative Direction

### Core Approach
[Unified vision statement]

### Must-Have Scenes
1. [Scene description]
2. [Scene description]
3. [Scene description]

### Tone Guidelines
- [Guideline]
- [Guideline]

### Off-Limits
- [What to avoid]

### North Star
[Single guiding principle for all creative decisions]
```

## Benefits

1. **Diverse Perspectives:** No single creative blind spot
2. **Quality Bar:** Standards Reviewer prevents lazy choices
3. **Grounded Creativity:** Research Specialist prevents plausibility errors
4. **Unified Vision:** Synthesis creates alignment before writing begins
5. **Reusable Asset:** Creative Direction document guides entire production

## Integration

The Writer's Room output feeds directly into:
- `/theme-discovery` - Validates thematic direction
- `/character-interview` - Guides character development priorities
- `/story-check` - Establishes success criteria
- `/scene-writer` agent - Provides visual direction
- `/dialogue-writer` agent - Sets voice parameters

## Example Invocation

```
/writers-room

Project: Racoon Rescue V2
Premise: A drunk Navy petty officer uses an unconscious raccoon to bypass his breathalyzer interlock.
Existing: V1 screenplay (15 min short, dark comedy)
Target: Smart R (Fargo-level), complete reimagining
Sacred: Core premise only - everything else open
Constraints: Keep at ~15 min, sophisticated adult humor
```
