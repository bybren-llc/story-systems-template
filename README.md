<!-- wtfb:template-readme -->
# Story Systems Template

<p align="center">
  <a href="https://github.com/bybren-llc/story-systems-template/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/bybren-llc/story-systems-template?style=flat-square" alt="License">
  </a>
  <a href="https://github.com/bybren-llc/story-systems-template/releases/latest">
    <img src="https://img.shields.io/github/v/release/bybren-llc/story-systems-template?include_prereleases&style=flat-square&color=blue" alt="Version">
  </a>
  <a href="https://github.com/bybren-llc/story-systems-template/actions/workflows/validate.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/bybren-llc/story-systems-template/validate.yml?style=flat-square&label=validation" alt="Validation">
  </a>
  <a href="https://github.com/bybren-llc/story-systems-template/stargazers">
    <img src="https://img.shields.io/github/stars/bybren-llc/story-systems-template?style=flat-square" alt="Stars">
  </a>
  <a href="https://deepwiki.com/bybren-llc/story-systems-template">
    <img src="https://img.shields.io/badge/DeepWiki-AI_Docs-blue?style=flat-square&logo=artificial-intelligence" alt="DeepWiki">
  </a>
  <a href="https://www.npmjs.com/package/@wtfb/cli">
    <img src="https://img.shields.io/npm/v/@wtfb/cli?style=flat-square&logo=npm&label=@wtfb/cli" alt="npm">
  </a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Claude_Code-Full_Support-blueviolet?style=flat-square&logo=anthropic" alt="Claude Code">
  <img src="https://img.shields.io/badge/Gemini_CLI-Full_Support-orange?style=flat-square&logo=google" alt="Gemini CLI">
</p>

<p align="center">
  <em>"Machines are for speed, repetition, and necessity.<br>
  Humans are for novelty, myth, and meaning.<br>
  Most people identify with traits of a machine."</em><br>
  — <strong>J. Scott Graham</strong>
</p>

> **AI Agents:** For comprehensive documentation, visit [DeepWiki](https://deepwiki.com/bybren-llc/story-systems-template)

---

## What if AI worked like a real creative team?

When you're making a movie, you don't ask one person to write the script, direct, handle the budget, design costumes, AND edit the final cut. You hire a team of specialists who each bring their expertise to the table.

**That's exactly what we built for AI.**

Instead of asking one AI to do everything, we created a system where multiple AI specialists work together—each with their own job, their own expertise, and their own responsibilities.

---

## The Problem

When you ask ChatGPT or Claude to help write a screenplay, you get... fine results. But here's what's missing:

- **No structure** — It doesn't know when to check formatting vs. when to focus on story
- **No specialization** — It's a generalist pretending to be an expert
- **No teamwork** — There's no one to catch mistakes or offer a different perspective
- **No standards** — Every session starts from scratch

It's like hiring one intern to do everything instead of building a real team.

---

## The Solution: An 11-Person AI Team

This template gives you a complete creative team:

| Team Member | What They Do |
|-------------|--------------|
| **Story Architect** | Makes sure your story structure works (can veto bad structural changes) |
| **Dialogue Writer** | Gives each character a unique voice |
| **Scene Writer** | Describes action and visuals |
| **Continuity Editor** | Catches timeline mistakes and contradictions |
| **Script Supervisor** | Ensures proper screenplay format (must approve before export) |
| **Research Specialist** | Checks facts and accuracy |
| **Story Analyst** | Scene-by-scene quality analysis |
| **Standards Reviewer** | Industry best practices |
| **Production Coordinator** | Handles exports and delivery |
| **Session Manager** | Coordinates workflow |
| **Scene Annotator** | Organizes notes and development |

Each one knows their job. Each one has expertise. And they work together.

---

## How It Works

### Like a Hollywood Writers' Room

In Hollywood, writers' rooms have structure:

1. **The showrunner** has final say on story direction
2. **Senior writers** can push back on bad ideas
3. **Staff writers** pitch and draft scenes
4. **The script coordinator** makes sure everything's formatted right

Our AI team works the same way.

### Some Team Members Can Say "Stop"

Not everyone on the team is equal. Some have special authority:

- **The Story Architect** can veto changes that break the story structure
- **The Script Supervisor** must approve formatting before anything is final

This prevents the AI from making mistakes that would slip through a single-AI system.

### They Share Knowledge

All team members have access to:

- **Industry patterns** — How professional screenplays are structured
- **Best practices** — What works in dialogue, scene construction, etc.
- **Your project history** — What's happened so far in your story

They're not starting from zero. They know the craft.

---

## Works With Multiple AI Platforms

We're not locked to one AI:

| Platform | Status | Harness |
|----------|--------|---------|
| ![Claude Code](https://img.shields.io/badge/Claude_Code-Anthropic-blueviolet?style=flat-square&logo=anthropic) | ✅ Full support | `.claude/` |
| ![Gemini CLI](https://img.shields.io/badge/Gemini_CLI-Google-orange?style=flat-square&logo=google) | ✅ Full support | `.gemini/` |
| **OpenAI Codex** | 📄 Documented | `.openai/` |

Same team structure. Same 11 agents, 24 skills, 30 commands. Different AI underneath.

---

## See What Your AI Team Creates

Your AI team writes Fountain files. **BetterFountain** shows you the results.

[BetterFountain](https://github.com/piersdeseilligny/betterfountain) is a free VS Code extension that transforms your workflow:

| Feature | What It Does |
|---------|--------------|
| **Live Preview** | See formatted screenplay in real-time as agents write |
| **Scene Outline** | Navigate scenes, sections, and notes in the sidebar |
| **Statistics Panel** | Character counts, dialogue distribution, scene lengths |
| **Duration Estimate** | Runtime approximation shown in status bar |
| **PDF Export** | Industry-standard output with scene bookmarks |

```
Claude Agents ──write──> .fountain file ──view──> BetterFountain
     ↑                                                    │
     └────────────────── iterate ─────────────────────────┘
```

> **Install BetterFountain before you start.** It's how you see what your AI team produces.

---

## Quick Start

> **Time to first success**: ~10 minutes

**Choose your platform:**

| Platform | Init Command |
|----------|--------------|
| macOS / Linux / WSL | `./scripts/init-project.sh` |
| Windows PowerShell | `.\scripts\init-project.ps1` |

**Full instructions:** [docs/QUICKSTART.md](docs/QUICKSTART.md) - Platform-specific prerequisites, troubleshooting, and step-by-step guide.

**New to Claude?** [Get Claude Code](https://claude.com/pricing) - Required for the AI team features.

**Required extension:** [BetterFountain](https://github.com/piersdeseilligny/betterfountain) - Install in VS Code/Cursor to preview and navigate your screenplay. See [above](#see-what-your-ai-team-creates) for details.

### The Essentials

```bash
# 1. Get the template
git clone https://github.com/bybren-llc/story-systems-template.git my-screenplay
cd my-screenplay

# 2. Initialize (run the command for your platform above)
./scripts/init-project.sh  # macOS/Linux/WSL
# .\scripts\init-project.ps1  # Windows PowerShell

# 3. Install dependencies
npm install

# 4. Start Claude Code and start writing!
claude
/start-scene Opening confrontation in the bar
```

Your AI team is now active. All 11 agents, 24 skills, and 30 commands work out of the box. The Story Architect ensures structure. The Dialogue Writer refines voices. The Script Supervisor catches formatting issues. They work together automatically.

**Extensible by design.** Story Systems supports Claude Code's native `/plugin` workflow. Install from any supported source—GitHub repos, community marketplaces, or local paths.

- **Community plugins** — Open-source extensions from the broader ecosystem
- **Company spokes** — Premium workflows from sources like WTFB *(coming soon)*

When installing plugins, Claude Code uses a permission prompt model—review prompts when plugins request actions. See [Claude Code Plugins](https://claude.com/blog/claude-code-plugins) for installation details and marketplace examples.

---

## What You Get

| Feature | Description |
|---------|-------------|
| **11 Specialized Agents** | Each with clear responsibilities and authority |
| **30+ Commands** | `/new-scene`, `/check-format`, `/export-pdf`, and more |
| **17 Craft Patterns** | Story structure, scene types, dialogue techniques |
| **Validation Stack** | Fountain syntax, spelling, formatting checks |
| **Industry Exports** | PDF, Final Draft (FDX), HTML |
| **BetterFountain Integration** | Live preview, scene navigation, statistics, and visual feedback |
| **Template Sync** | Automatic weekly updates from upstream |

---

## Why Story Systems? (Competitive Analysis)

We did the research. Here's how Story Systems compares to alternatives:

| vs. Competition | Story Systems Advantage |
|-----------------|----------------|
| **vs. Final Draft / Movie Magic** | They have no AI. We have 11 specialized agents. |
| **vs. AI Writing Tools** | They're single AI. We're multi-agent with authority controls. |
| **vs. CrewAI / AutoGen** | They're general-purpose. We have 24 craft skill modules. |
| **vs. All of Them** | We're open source, extensible, and export to industry formats. |

**Unique to Story Systems:**

- Tiered authority system (veto/gate powers)
- Enterprise self-hosting with private workflows
- Community marketplace for custom tools
- Fountain format: open, portable, AI-friendly
- VS Code Live Share for real-time collaboration

> **Full Analysis:** [Competitive Analysis: Story Systems Multi-Agent Harness](docs/COMPETITIVE-ANALYSIS-MULTI-AGENT-HARNESS.md)

---

## Global CLI

Use our tools across any project:

```bash
npm install -g @wtfb/cli
```

```bash
wtfb validate       # Validate Fountain, Markdown, spelling
wtfb export-pdf     # Export to industry-standard PDF
wtfb export-fdx     # Export to Final Draft XML
wtfb export-html    # Export to HTML preview
```

See [@wtfb/cli on npm](https://www.npmjs.com/package/@wtfb/cli) for full documentation.

---

## Beyond Screenwriting

The same pattern works for any field that needs expert collaboration:

| Screenwriting | Software Development | Legal | Medical Research |
|---------------|---------------------|-------|------------------|
| Story Architect | System Architect | Senior Partner | Principal Investigator |
| Dialogue Writer | Frontend Developer | Contract Specialist | Literature Reviewer |
| Scene Writer | Backend Developer | Compliance Officer | Biostatistician |
| Script Supervisor | QA Tester | Research Associate | Ethics Liaison |

We've already built a [software development harness](https://github.com/bybren-llc/cheddarfox-claude-marketplace/tree/main/plugins/software-dev). The architecture is universal.

---

## The Story Systems Ecosystem

Story Systems uses a **hub-spoke architecture** that's infinitely extensible:

- **Hub**: This template — complete 11-agent writing harness (free, OSS)
- **Spokes**: Plugins that extend capabilities (free or paid)

> **Story Systems is the open-source hub; company spokes (like WTFB) plug in to add brand-specific methodology and services on top of the baseline harness.**

```
              ┌──────────────────┐
              │  story-systems-  │
              │    template      │
              │   (The Hub)      │
              │  11 agents       │
              │  24 skills       │
              │  30 commands     │
              └────────┬─────────┘
                       │
       ┌───────────────┼───────────────┐
       │               │               │
       ▼               ▼               ▼
  ┌─────────┐    ┌─────────┐    ┌─────────┐
  │Community│    │  WTFB   │    │  Other  │
  │  (Free) │    │(Example)│    │Companies│
  └─────────┘    └─────────┘    └─────────┘
```

**The hub is complete by itself.** You can write, validate, and export without any plugins. But if you want more — specialized workflows, enhanced skills, professional tools — plugins extend the foundation.

---

## Creating Your Own Plugins

Anyone can extend Story Systems. The architecture is open.

### Free Plugins (Contribute to Community)

1. Fork this template or create a new plugin repo
2. Add skills/commands following the [Capability Contract](docs/guides/CAPABILITY_CONTRACT.md)
3. Submit PR or publish independently
4. Community benefits, you get credit

### Paid Plugins (Marketplace)

1. Follow the same capability contract
2. Add premium features (enhanced skills, workflows)
3. Submit to the [Plugin Marketplace](https://github.com/bybren-llc/cheddarfox-claude-marketplace)
4. Earn revenue from your expertise

### Example Company Plugins: WTFB

WTFB plugins demonstrate how a company can extend the Story Systems hub with brand-specific workflows:

| Plugin | What It Adds |
|--------|--------------|
| `wtfb-screenwriting` | WTFB methodology, showrunner workflows |
| `wtfb-novel-writing` | Extended narrative tools, chapter pacing |
| `wtfb-film-production` | Call sheets, scheduling, budget tracking |

These demonstrate how to build premium enhancements that don't duplicate the base — they extend it.

**Technical Details:** See [Plugin Architecture](docs/guides/PLUGIN_ARCHITECTURE.md) and [Capability Contract](docs/guides/CAPABILITY_CONTRACT.md).

---

## Join the Story Systems Community

The open-source hub has an active community:

- **Use the tools** — Write more, write better
- **Join the community** — Get feedback, find collaborators
- **Contribute** — Submit plugins, report issues, improve the harness

### WTFB Services (Company Spoke)

[Words To Film By](https://wordstofilmby.com) offers additional services on top of the Story Systems hub:

```
Use the Tools → Join Community → Take Courses → Get Published → Launch IRL
      ↓              ↓              ↓              ↓              ↓
  Write more    Get feedback   Master craft   WTFB publishes   Film/TV
  Write better  Find collaborators  Network    Promotes you    Distribution
```

- **Take courses** — Master the WTFB methodology
- **Get published** — Submit your work for WTFB consideration
- **Launch IRL** — From page to screen, WTFB helps make it real

**Website**: [wordstofilmby.com](https://wordstofilmby.com)

---

## Documentation

| Document | Purpose |
|----------|---------|
| [docs/QUICKSTART.md](docs/QUICKSTART.md) | Step-by-step setup guide |
| [AGENTS.md](AGENTS.md) | Complete agent team reference |
| [docs/REFERENCE.md](docs/REFERENCE.md) | Commands, patterns, structure |
| [docs/WORKFLOW.md](docs/WORKFLOW.md) | Git workflow guide |
| [docs/WTFB-HARNESS-PAPER.md](docs/WTFB-HARNESS-PAPER.md) | Architecture deep-dive |
| [docs/COMPETITIVE-ANALYSIS-MULTI-AGENT-HARNESS.md](docs/COMPETITIVE-ANALYSIS-MULTI-AGENT-HARNESS.md) | Market analysis & positioning |

### Plugin Development Guides

| Guide | Purpose |
|-------|---------|
| [docs/guides/CAPABILITY_CONTRACT.md](docs/guides/CAPABILITY_CONTRACT.md) | Technical spec for plugin authors |
| [docs/guides/PLUGIN_ARCHITECTURE.md](docs/guides/PLUGIN_ARCHITECTURE.md) | How plugins extend the template |
| [docs/guides/USER_ACCESS_TIERS.md](docs/guides/USER_ACCESS_TIERS.md) | Access levels (Community, Pro, Internal) |
| [docs/guides/TEMPLATE_MARKETPLACE_RELATIONSHIP.md](docs/guides/TEMPLATE_MARKETPLACE_RELATIONSHIP.md) | Ecosystem overview |

---

## Example Projects

| Project | Description |
|---------|-------------|
| [seoul-identity](https://github.com/bybren-llc/seoul-identity) | Feature screenplay using full harness |

---

## Contributing

We welcome contributions. See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for guidelines.

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

## Attribution

This project is the **Words To Film By™** multi-agent harness.

**Creator**: J. Scott Graham ([@cheddarfox](https://github.com/cheddarfox)) - [jscottgraham.us](https://jscottgraham.us)
**Organization**: [Bybren LLC](https://github.com/bybren-llc)
**Enterprise**: [Words To Film By™](https://wordstofilmby.com)

If you use this harness in your own projects, you must include attribution.
See [NOTICE](NOTICE) for details.

---

<p align="center">
  <strong>Words To Film By™</strong><br>
  <a href="https://wordstofilmby.com">Website</a> •
  <a href="mailto:scott@wordstofilmby.com">Contact</a> •
  <a href="https://github.com/sponsors/bybren-llc">Sponsor</a>
</p>

<p align="center">
  <em>"Your creative AI team, ready to work."</em>
</p>
