# Contributing to WTFB Projects

Thank you for your interest in contributing to this project!

## Getting Started

1. **Fork and Clone**: Fork this repository and clone your fork locally
2. **Create a Branch**: Create a feature branch for your work
3. **Make Changes**: Implement your changes following our guidelines
4. **Validate**: Run `npm run validate` before committing
5. **Submit PR**: Create a pull request with a clear description

## Branch Naming

Use these prefixes for your branches:

- `feature/` - New content, scenes, chapters
- `fix/` - Bug fixes, continuity corrections
- `revision/` - Full-script revision passes
- `docs/` - Documentation updates

## Commit Messages

Follow this format:

```
type(scope): description

Types: scene, dialogue, action, structure, revision, notes, format, docs
```

Examples:
- `scene(opening): add bar confrontation`
- `dialogue(character): refine monologue`
- `docs(readme): update cast list`

## Code of Conduct

- Be respectful and constructive
- Focus on the work, not the person
- Welcome diverse perspectives
- Maintain creative integrity

## Validation

Before submitting:

```bash
npm run validate        # Full validation
npm run lint:fountain   # Fountain syntax (screenplays)
npm run lint:md         # Markdown linting
npm run lint:spell      # Spell check
```

## Questions?

Open an issue or reach out to the project maintainers.
