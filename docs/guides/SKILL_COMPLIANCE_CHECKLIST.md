# Skill & Command Compliance Checklist

Quick validation checklist for Claude Code skills and commands before commit.

---

## Skills: YAML Frontmatter (REQUIRED)

Every skill must have valid YAML frontmatter in `SKILL.md`:

```yaml
---
name: skill-name
description: |
  What this skill does in third person.

  Use when: trigger conditions.
---
```

### Checklist

- [ ] **name**: kebab-case, matches directory name exactly
- [ ] **description**: Third person, includes "Use when:" clause
- [ ] Optional: `allowed-tools`, `model`

---

## Skills: Structure Requirements

- [ ] `SKILL.md` file exists (required)
- [ ] `README.md` with status badge (recommended)
- [ ] "When This Skill Applies" section with trigger conditions
- [ ] FORBIDDEN / CORRECT patterns with code blocks
- [ ] "Authoritative References" section linking to source docs

---

## Commands: YAML Frontmatter (Optional but Recommended)

Commands support optional frontmatter for autocomplete:

```yaml
---
description: Brief description of what this command does.
---
```

### Checklist

- [ ] **description**: Imperative voice, action-focused
- [ ] Under 100 characters
- [ ] Matches first sentence of `# /command-name` heading

---

## Naming Conventions

| Element | Format | Example |
|---------|--------|---------|
| Skill directory | kebab-case | `frontend-patterns/` |
| Skill name | matches directory | `name: frontend-patterns` |
| Command file | kebab-case.md | `export-pdf.md` |

---

## Description Best Practices

### Skills (Multi-line)

- Third person voice ("This skill provides...")
- What it does + when to use
- Must include "Use when:" trigger conditions
- Max 1024 characters

### Commands (Single line)

- Imperative voice ("Generate...", "Validate...")
- Action-focused
- Under 100 characters

---

## Pre-Commit Validation

```bash
# Validate all skills have frontmatter
for skill in .claude/skills/*/SKILL.md; do
  if ! head -1 "$skill" | grep -q "^---"; then
    echo "MISSING FRONTMATTER: $skill"
  fi
done

# Check skill name matches directory
for skill in .claude/skills/*/SKILL.md; do
  dir=$(dirname "$skill" | xargs basename)
  name=$(grep "^name:" "$skill" | cut -d: -f2 | tr -d ' ')
  [ "$dir" = "$name" ] || echo "MISMATCH: $skill (dir=$dir, name=$name)"
done

# Run lint checks
npm run lint:md && npm run lint:spell
```

---

## Common Issues & Fixes

| Issue | Cause | Fix |
|-------|-------|-----|
| Skill not loading | Missing frontmatter | Add `---` block with name/description |
| Name mismatch error | Directory != name | Make `name:` match directory exactly |
| Vague activation | Poor description | Add specific "Use when:" triggers |
| CamelCase name | Wrong convention | Convert to kebab-case |
| Command not in autocomplete | No description | Add frontmatter with description |

---

## References

- [Agent Skills Specification](https://agentskills.io/specification)
- [Claude Code Slash Commands](https://code.claude.com/docs/en/slash-commands)
- [SKILL_AUTHORING_GUIDE.md](https://github.com/bybren-llc/safe-agentic-workflow/blob/main/docs/guides/SKILL_AUTHORING_GUIDE.md)

---

*Part of the [WTFB Screenwriting Plugin](https://github.com/bybren-llc/cheddarfox-claude-marketplace) ecosystem.*
