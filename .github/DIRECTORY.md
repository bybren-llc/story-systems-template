# .github Directory

This directory contains GitHub-specific configuration for workflows, templates, and repository settings.

## Directory Structure

```
.github/
├── README.md                    # This file
├── CODEOWNERS                   # Code ownership definitions
├── PULL_REQUEST_TEMPLATE.md     # PR template
├── ISSUE_TEMPLATE/              # Issue templates
│   ├── feature.md               # Feature request template
│   └── bug.md                   # Bug/continuity issue template
└── workflows/                   # GitHub Actions workflows
    ├── validate.yml             # Project validation
    ├── sync-upstream.yml        # Template sync automation
    └── deploy-pages.yml         # GitHub Pages deployment
```

## Purpose

The .github directory configures:

1. **Automation**: CI/CD workflows via GitHub Actions
2. **Collaboration**: PR and issue templates
3. **Governance**: Code ownership and review requirements
4. **Documentation**: Repository-level docs

## Files

### CODEOWNERS

Defines who must review changes to specific files:

```
# Default owners
* @project-owner

# Screenplay content
*.fountain @lead-writer

# Marketing
marketing/ @marketing-lead

# CI/CD
.github/ @tech-lead
```

**How it works:**
- When a PR touches files matching a pattern, listed owners are requested for review
- Owners must approve before merge (if branch protection enabled)
- Customize with your team's GitHub usernames

### PULL_REQUEST_TEMPLATE.md

Template that appears when creating PRs:

**Sections:**
- Summary of changes
- Type of change (scene, dialogue, structure, etc.)
- Changes made (bullet list)
- Validation checklist
- Continuity check
- Notes for reviewers

**Customize for your workflow:**
- Add project-specific checklists
- Include relevant links
- Adjust change types

### ISSUE_TEMPLATE/

Templates for different issue types:

**feature.md** - For feature requests:
- Feature description
- Story context
- Proposed implementation
- Impact assessment

**bug.md** - For continuity issues:
- Issue description
- Location (file, scene, page)
- The problem
- Expected behavior
- Related scenes
- Suggested fix

**Adding templates:**
```bash
# Create new template
touch .github/ISSUE_TEMPLATE/research.md
```

## Workflows Directory

See [workflows/README.md](./workflows/README.md) for detailed documentation.

**Quick reference:**

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| validate.yml | Push, PR | Validate project files |
| sync-upstream.yml | Weekly, manual | Sync template updates |
| deploy-pages.yml | Push to main | Deploy marketing pages |

## GitHub Features Used

### GitHub Actions

All workflows use GitHub Actions for automation:
- Runs on `ubuntu-latest`
- Uses official actions (checkout, setup-node, etc.)
- Supports manual triggers (`workflow_dispatch`)

### GitHub Pages

Marketing pages deploy via GitHub Pages:
- Enable in repo Settings > Pages
- Source: GitHub Actions
- Custom domain support

### Branch Protection

Recommended settings for `main` branch:
- Require PR reviews
- Require status checks (validate workflow)
- Require CODEOWNERS review
- No force pushes

## Customization

### Adding a New Workflow

1. Create file: `.github/workflows/my-workflow.yml`
2. Define trigger, jobs, steps
3. Test with `workflow_dispatch` trigger first
4. Commit and push

**Template:**
```yaml
name: My Workflow

on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  my-job:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Do something
        run: echo "Hello"
```

### Adding Issue Labels

Create labels for your project in GitHub Settings > Labels:
- `scene` - Scene-related issues
- `dialogue` - Dialogue issues
- `continuity` - Continuity errors
- `research` - Research tasks
- `enhancement` - Improvements

### Setting Up Branch Protection

1. Go to Settings > Branches
2. Add rule for `main`
3. Enable:
   - Require pull request reviews
   - Require status checks to pass
   - Include administrators

## Best Practices

1. **Keep workflows focused**: One workflow per concern
2. **Use caching**: Speed up Node.js workflows with npm cache
3. **Fail fast**: Put quick checks first
4. **Document triggers**: Comment why each trigger is used
5. **Test locally**: Use `act` for local workflow testing

## Troubleshooting

**Workflow not running:**
- Check trigger conditions
- Verify file path is correct
- Check workflow syntax (YAML)

**CODEOWNERS not working:**
- Usernames must be valid GitHub users
- Must be repo collaborators
- Branch protection must be enabled

**Pages not deploying:**
- Check Pages settings in repo
- Verify `deploy-pages.yml` runs successfully
- Check for build errors in Actions tab

## Security Considerations

- **Secrets**: Use GitHub Secrets for API keys
- **Permissions**: Minimize workflow permissions
- **Dependencies**: Pin action versions
- **Review**: Audit workflows for security issues

```yaml
# Good: Pinned version
uses: actions/checkout@v4

# Avoid: Unpinned
uses: actions/checkout@main
```
