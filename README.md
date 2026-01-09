# WTFB Projects Template

<p align="center">
  <a href="https://github.com/bybren-llc/wtfb-projects-template/releases/latest">
    <img src="https://img.shields.io/github/v/release/bybren-llc/wtfb-projects-template?include_prereleases&style=flat-square&color=blue" alt="Version">
  </a>
  <a href="https://github.com/bybren-llc/wtfb-projects-template/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/bybren-llc/wtfb-projects-template?style=flat-square" alt="License">
  </a>
  <a href="https://github.com/bybren-llc/wtfb-projects-template/actions/workflows/validate.yml">
    <img src="https://img.shields.io/github/actions/workflow/status/bybren-llc/wtfb-projects-template/validate.yml?style=flat-square&label=validation" alt="Validation">
  </a>
  <a href="https://github.com/bybren-llc/wtfb-projects-template/stargazers">
    <img src="https://img.shields.io/github/stars/bybren-llc/wtfb-projects-template?style=flat-square" alt="Stars">
  </a>
</p>

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

| Platform | Status |
|----------|--------|
| **Claude Code** (Anthropic) | Full support |
| **Gemini CLI** (Google) | Full support |
| **OpenAI Codex** | Documented |

Same team structure. Different AI underneath.

---

## Quick Start

> **New to WTFB?** See the full [QUICKSTART Guide](docs/QUICKSTART.md) for step-by-step instructions with screenshots and troubleshooting.

### 1. Create Your Project

```bash
# From GitHub template
gh repo create my-screenplay --template bybren-llc/wtfb-projects-template --clone --public
cd my-screenplay

# Initialize (interactive prompts)
./scripts/init-project.sh
npm install
```

### 2. Install the AI Team (Claude Code)

```bash
/plugin install wtfb-screenwriting@github.com/bybren-llc/wtfb-claude-marketplace/plugins/screenwriting
```

### 3. Start Writing

```bash
/start-scene Opening confrontation in the bar
```

Your AI team is now active. The Story Architect will ensure structure. The Dialogue Writer will refine voices. The Script Supervisor will catch formatting issues. They work together automatically.

---

## What You Get

| Feature | Description |
|---------|-------------|
| **11 Specialized Agents** | Each with clear responsibilities and authority |
| **30+ Commands** | `/new-scene`, `/check-format`, `/export-pdf`, and more |
| **17 Craft Patterns** | Story structure, scene types, dialogue techniques |
| **Validation Stack** | Fountain syntax, spelling, formatting checks |
| **Industry Exports** | PDF, Final Draft (FDX), HTML |
| **Template Sync** | Automatic weekly updates from upstream |

---

## Beyond Screenwriting

The same pattern works for any field that needs expert collaboration:

| Screenwriting | Software Development | Legal | Medical Research |
|---------------|---------------------|-------|------------------|
| Story Architect | System Architect | Senior Partner | Principal Investigator |
| Dialogue Writer | Frontend Developer | Contract Specialist | Literature Reviewer |
| Scene Writer | Backend Developer | Compliance Officer | Biostatistician |
| Script Supervisor | QA Tester | Research Associate | Ethics Liaison |

We've already built a [software development harness](https://github.com/bybren-llc/wtfb-claude-marketplace/tree/main/plugins/software-dev). The architecture is universal.

---

## Documentation

| Document | Purpose |
|----------|---------|
| [docs/QUICKSTART.md](docs/QUICKSTART.md) | Step-by-step setup guide |
| [AGENTS.md](AGENTS.md) | Complete agent team reference |
| [docs/REFERENCE.md](docs/REFERENCE.md) | Commands, patterns, structure |
| [docs/WORKFLOW.md](docs/WORKFLOW.md) | Git workflow guide |
| [docs/WTFB-HARNESS-PAPER.md](docs/WTFB-HARNESS-PAPER.md) | Architecture deep-dive |

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

<p align="center">
  <strong>Words To Film By</strong><br>
  <a href="https://wordstofilmby.com">Website</a> •
  <a href="mailto:scott@wordstofilmby.com">Contact</a> •
  <a href="https://wordstofilmby.com/projects/wtfb-projects-template/sponsor">Sponsor</a>
</p>

<p align="center">
  <em>"Your creative AI team, ready to work."</em>
</p>
