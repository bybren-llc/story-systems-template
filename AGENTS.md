# Agent Team Reference

This project uses an 11-agent team for collaborative creative development.

## Team Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                        SESSION MANAGER                          │
│                    (Coordination & Workflow)                    │
└─────────────────────────────────────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        │                       │                       │
        ▼                       ▼                       ▼
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│ STORY &       │     │ WRITING       │     │ QUALITY &     │
│ STRUCTURE     │     │               │     │ CONTINUITY    │
├───────────────┤     ├───────────────┤     ├───────────────┤
│ Story Analyst │     │ Dialogue      │     │ Continuity    │
│ Story         │     │   Writer      │     │   Editor      │
│   Architect*  │     │ Scene Writer  │     │ Script        │
│               │     │ Scene         │     │   Supervisor* │
│               │     │   Annotator   │     │ Standards     │
│               │     │               │     │   Reviewer    │
└───────────────┘     └───────────────┘     └───────────────┘
                                                    │
                              ┌─────────────────────┘
                              ▼
                    ┌───────────────┐
                    │ RESEARCH &    │
                    │ PRODUCTION    │
                    ├───────────────┤
                    │ Research      │
                    │   Specialist  │
                    │ Production    │
                    │   Coordinator │
                    └───────────────┘

* Has veto/gate authority
```

## Agents as UX: The Writer's Interface

Writers don't need to learn CLI commands. They just talk.

The agents handle all tooling via `@wtfb/cli`. The CLI is infrastructure, not interface.

### How It Works

```
Writer (conversation)
       ↓
   AI Agent (understands intent)
       ↓
   WTFB Agents (craft expertise + authority)
       ↓
   @wtfb/cli via Bash (execution)
       ↓
   Output (PDF, FDX, HTML, validated files)
```

### Example Interactions

| Writer Says | Agent Runs |
|-------------|------------|
| "Export my script to PDF" | `wtfb export-pdf` |
| "Check my formatting" | `wtfb validate` |
| "I need a Final Draft file" | `wtfb export-fdx` |
| "Make sure everything looks right" | `wtfb validate --fountain` |
| "Give me an HTML preview" | `wtfb export-html` |

### Which Agents Use the CLI?

| Agent | CLI Commands |
|-------|--------------|
| **Script Supervisor** | `wtfb validate`, `wtfb validate --fountain` |
| **Production Coordinator** | `wtfb export-pdf`, `wtfb export-fdx`, `wtfb export-html` |

Other agents focus on craft (story, dialogue, continuity) and don't need CLI tools.

## Agent Profiles

### Story & Structure

| Agent | Role | Authority |
|-------|------|-----------|
| **Story Analyst** | Break down concepts into scene-by-scene analysis | Domain |
| **Story Architect** | Define and validate narrative structure | **VETO** (structure) |

### Writing

| Agent | Role | Authority |
|-------|------|-----------|
| **Dialogue Writer** | Create distinct character voices and subtext | Domain |
| **Scene Writer** | Handle visual storytelling and action | Domain |
| **Scene Annotator** | Manage notes, synopses, organization | Domain |

### Quality & Continuity

| Agent | Role | Authority |
|-------|------|-----------|
| **Continuity Editor** | Track chronology and consistency | Domain |
| **Script Supervisor** | Verify format and syntax | **GATE** (quality) |
| **Standards Reviewer** | Ensure industry-standard compliance | Domain |

### Research & Production

| Agent | Role | Authority |
|-------|------|-----------|
| **Research Specialist** | Handle accuracy and authenticity | Domain |
| **Production Coordinator** | Manage exports and delivery | Domain |
| **Session Manager** | Initialize sessions, coordinate tasks | Workflow |

## Model Routing

Each agent role has a recommended model tier so prose quality, reasoning, and cost each land
where they belong. See **`.claude/model-routing.md`** for the full policy and rationale.

| Tier | Model | Roles |
|------|-------|-------|
| **Prose** | Claude Fable 5 | Dialogue Writer, Scene Writer |
| **Reasoning** | Claude Opus 4.8 | Story Architect, Story Analyst, Continuity Editor, Script Supervisor, Standards Reviewer, Research Specialist, Session Manager |
| **Mechanical** | Claude Haiku 4.5 | Scene Annotator, Production Coordinator; and mechanical commands (`/page-count`, `/scene-list`, `/check-format`) |

This is documented policy today; the `model:` assignment is wired into each agent's
frontmatter in Phase 3. `.wtfb/ai-harness/schema.json` currently carries `model` on the 8
canonical schema agents; the remaining roles are reconciled into the schema in Phase 3.

## Invocation Patterns

### Direct Invocation
```
Acting as the Story Architect, evaluate the three-act structure of this screenplay.
```

### Task-Based Routing
The Session Manager routes tasks to appropriate agents based on context:
- Scene writing → Scene Writer
- Dialogue polish → Dialogue Writer
- Format check → Script Supervisor
- Export → Production Coordinator

### Multi-Agent Collaboration
Complex tasks may involve multiple agents:
```
Story Analyst → Story Architect → Scene Writer → Continuity Editor
```

## Authority Levels

### Domain Authority
Agent has expertise and decision-making power within their specialty.

### Gate Authority (Script Supervisor)
Controls quality checkpoints:
- Pre-commit validation
- PR merge requirements
- Export readiness verification

### Veto Authority (Story Architect)
Can halt work when:
- Structure is fundamentally broken
- Plot logic fails
- Story lacks clear direction

## Equal Voice Principle

Within their domains, all agents have equal voice:
- Each agent's expertise is respected
- Cross-domain discussions welcome collaboration
- Veto authority used sparingly and with justification

## Agent Contributions to CI

The CI pipeline validates work from specialized agents:

| Agent | CI Responsibility |
|-------|-------------------|
| **Script Supervisor** | Format validation approval - Fountain syntax, heading format |
| **Standards Reviewer** | Capability compliance - skill/command frontmatter validation |
| **Production Coordinator** | Export artifact verification - PDF, FDX, HTML generation |
| **Continuity Editor** | Consistency checks - timeline, character, prop validation |

The validation script (`npm run validate:capabilities`) enforces standards that these agents would catch manually.

## See Also

- `.claude/agents/` - Claude agent definitions
- `.gemini/agents/` - Gemini agent definitions
- `CLAUDE.md` - Claude Code instructions
- `GEMINI.md` - Gemini CLI instructions
