---
description: Convene a collaborative pre-production session where 6 specialized agents pitch their creative visions before writing begins.
---

# /writers-room

Convene a collaborative pre-production session where 6 specialized agents pitch their creative visions before writing begins.

## Usage

```
/writers-room [mode]
```

- `[mode]` — Optional: `solo` (default, all Claude), `diverse` (spread seats across
  providers + guest models), or `custom` (explicit seat→model roster). See the
  **Multi-Model Council** section of the `writers-room` skill.

## What It Does

1. **Gathers Context:** Collects premise, existing material, constraints, and creative goals
2. **Convenes Agents:** Runs 6 specialized agents in parallel:
   - **Story Architect** - Structure and form
   - **Story Analyst** - Character and meaning
   - **Dialogue Writer** - Voice and tone
   - **Scene Writer** - Visual setpieces
   - **Standards Reviewer** - Quality and originality
   - **Research Specialist** - Authenticity
3. **Synthesizes Direction:** Combines best ideas into unified creative direction, crediting
   which seat/model each surviving idea came from
4. **Outputs Document:** Creates `creative-direction.md` to guide production

### Multi-model (opt-in)

In `diverse`/`custom` mode the room convenes seats across **multiple models/providers** —
Claude seats run as native subagents; guest seats (self-hosted vLLM or cloud) are consulted via
the `model-consult` connector. A guest whose provider is unreachable is **skipped with a logged
reason**, never faked. With nothing configured the room runs in `solo` mode. Configure guests in
`.env` (see `.env.example`) against the roster in `.wtfb/ai-harness/model-registry.json`.

## When to Use

- Starting a new screenplay
- Beginning a major rewrite or reimagining
- When creative direction is uncertain
- When you want expert perspectives before committing to an approach

## Required Input

- **Premise/Logline:** What's the story about?
- **Existing Material:** Any previous versions, source material, notes
- **Target Tone:** Comedy, drama, thriller, etc. + rating level
- **Constraints:** Runtime, budget tier, sacred elements
- **Freedom Level:** What can change vs. what's fixed

## Output

A `creative-direction.md` file containing:
- Individual agent pitches and perspectives
- Synthesized unified vision
- Must-have scenes list
- Tone and voice guidelines
- Explicit "off-limits" list
- Single "North Star" guiding principle

## Example

```
/writers-room

I want to reimagine my 15-minute dark comedy about a drunk sailor
and a raccoon. Keep the premise but make it smarter, more adult
(Fargo-level), and potentially restructure everything. The V1
script is at racoon-rescue.fountain.
```

## Integration

The Writer's Room output directly informs:
- Theme discovery and validation
- Character interview priorities
- Story structure decisions
- Scene writing direction
- Dialogue voice parameters
- Quality benchmarks for review

## See Also

- `/theme-discovery` - Deep thematic exploration
- `/pitch-worksheet` - Structured pitch development
- `/story-check` - 12-point story validation
- `/logline` - Hook refinement
