# Workflows Directory

This directory contains GitHub Actions workflows for automated CI/CD.

## Available Workflows

### validate.yml

**Purpose:** Validate project files on every push and PR.

**Triggers:**
- Push to `main` or `draft/**` branches
- Pull requests to `main`

**Jobs:**

1. **detect-type**: Reads project type from `.wtfb/project.json`
2. **validate-screenplay**: Runs if type is `screenplay`
   - Fountain syntax validation
   - Markdown linting
   - Spell checking
3. **validate-novel**: Runs if type is `novel`
   - Markdown linting
   - Spell checking
4. **validate-structure**: Always runs
   - Checks required files exist
   - Validates JSON syntax

**Required files:**
- `README.md`
- `CLAUDE.md`
- `.wtfb/project.json`

**Required directories:**
- `sourcematerials/`
- `exports/`
- `templates/`
- `marketing/`

**Customization:**
```yaml
# Add additional validation
- name: Custom validation
  run: node scripts/my-validator.js
```

---

### sync-upstream.yml

**Purpose:** Automatically check for and merge template updates.

**Triggers:**
- Scheduled: Weekly on Sundays at midnight UTC
- Manual: `workflow_dispatch`

**How it works:**

1. Reads upstream URL from `.wtfb/project.json`
2. Adds upstream remote and fetches
3. Counts commits behind
4. If updates available:
   - Gets sync paths from config
   - Attempts merge
   - Creates PR if successful

**PR created:**
- Title: `sync: Update from upstream template`
- Labels: `sync`, `template-update`
- Body: Lists commits behind, sync paths, review checklist

**Protected paths:**
Changes to files in `protectedPaths` will cause merge conflicts that require manual resolution. This is intentional - your content is protected.

**Customization:**

Change schedule:
```yaml
on:
  schedule:
    - cron: '0 0 1 * *'  # Monthly instead of weekly
```

---

### deploy-pages.yml

**Purpose:** Deploy marketing pages to GitHub Pages.

**Triggers:**
- Push to `main` that changes `marketing/**` or `README.md`
- Manual: `workflow_dispatch`

**How it works:**

1. **Build job:**
   - Checks out code
   - Reads `marketing/wtfb-marketing.json`
   - Generates static HTML site
   - Uploads as artifact

2. **Deploy job:**
   - Downloads artifact
   - Deploys to GitHub Pages

**Generated site:**
- `index.html` - Project landing page
- `data.json` - Marketing config (for API access)
- `assets/` - Images and media

**Page content:**
- Project title and subtitle
- Logline
- Genre tags
- Synopsis (from one-sheet)
- Creator information
- Contact link (if enabled)

**Enabling GitHub Pages:**

1. Go to repo Settings > Pages
2. Source: "GitHub Actions"
3. Wait for first deployment
4. Access at `https://[user].github.io/[repo]`

**Custom domain:**

1. Add `CNAME` file to `marketing/pages/`
2. Configure DNS for your domain
3. Enable HTTPS in Pages settings

---

## Workflow Permissions

All workflows request minimal permissions:

```yaml
permissions:
  contents: read      # Read repository
  pages: write        # Deploy pages (deploy-pages only)
  pull-requests: write # Create PRs (sync-upstream only)
```

## Environment Variables

| Variable | Used In | Purpose |
|----------|---------|---------|
| `GITHUB_TOKEN` | All | Authentication (automatic) |

No custom secrets required for basic operation.

## Adding Custom Workflows

### Example: Nightly Export

```yaml
name: Nightly Export

on:
  schedule:
    - cron: '0 2 * * *'  # 2 AM daily

jobs:
  export:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: npm ci

      # There is no `npm run export:*` script — the export CLI is an external
      # prerequisite, so a nightly export workflow has to install it itself.
      - name: Install the export CLI
        run: npm install -g afterwriting

      - name: Generate PDF
        run: afterwriting --source screenplay.fountain --pdf --output exports/pdf/screenplay.pdf

      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: screenplay-${{ github.sha }}
          path: exports/pdf/*.pdf
```

### Example: Slack Notification

```yaml
name: Notify Slack

on:
  pull_request:
    types: [opened, closed]

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Send notification
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "PR ${{ github.event.action }}: ${{ github.event.pull_request.title }}"
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

## Debugging Workflows

### View logs

1. Go to Actions tab
2. Click on workflow run
3. Expand job and step logs

### Re-run failed jobs

1. Open failed workflow run
2. Click "Re-run failed jobs"

### Test locally with `act`

```bash
# Install act
brew install act

# Run workflow locally
act push

# Run specific job
act -j validate-structure
```

### Common issues

**Workflow not triggering:**
```yaml
# Check path filters
on:
  push:
    paths:
      - 'marketing/**'  # Only triggers on marketing changes
```

**Permission denied:**
```yaml
# Add required permissions
permissions:
  contents: write
```

**Node modules cache miss:**
```yaml
# Ensure package-lock.json is committed
- uses: actions/setup-node@v4
  with:
    cache: 'npm'  # Requires package-lock.json
```

## Best Practices

1. **Pin action versions**: Use `@v4` not `@main`
2. **Use caching**: Speed up repeated runs
3. **Fail fast**: Put quick checks first
4. **Minimal permissions**: Request only what's needed
5. **Clear names**: Job and step names should be descriptive
6. **Idempotent**: Workflows should be safe to re-run
