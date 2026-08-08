# Marketing Directory

This directory contains everything needed to market your project through the WTFB platform and GitHub Pages.

## Directory Structure

```
marketing/
├── wtfb-marketing.json          # Platform integration configuration
├── wtfb-marketing.schema.json   # JSON Schema for local validation
├── assets/                      # Visual marketing assets
│   ├── poster.png               # Movie poster / book cover
│   ├── banner.png               # Wide banner (1200x630)
│   └── social/                  # Social media cards
│       ├── twitter-card.png
│       └── og-image.png
└── pages/                       # GitHub Pages content
    ├── _config.yml              # Jekyll configuration
    └── index.md                 # Landing page template
```

## wtfb-marketing.json

This is the central configuration file that integrates your project with the WTFB platform. It controls:

### Project Identity
```json
{
  "project": {
    "id": "your-project-slug",
    "title": "Your Project Title",
    "subtitle": "A Short Film",
    "logline": "One sentence pitch",
    "type": "screenplay|novel|film-production|template",
    "status": "development|pre-production|production|completed|beta",
    "year": 2026
  }
}
```

### Metadata
Genres, themes, keywords, runtime, rating, language, and setting. Used for discovery and categorization on the WTFB platform.

### Creators
Primary creator and contributors with WTFB user IDs for platform linking and payment routing.

### Marketing Assets
References to poster, banner, and social card images. These are used by:
- GitHub Pages for your project site
- WTFB platform for discovery pages
- Social sharing previews (OpenGraph, Twitter Cards)

### Platform Settings
```json
{
  "platform": {
    "visibility": "private|public",
    "featured": false,
    "allowFunding": true,
    "allowInquiries": true,
    "contactEmail": "you@example.com"
  }
}
```

### Commerce
Enable digital downloads, merchandise, and services:

```json
{
  "commerce": {
    "enabled": true,
    "stripeAccountId": "acct_xxx",
    "products": [
      {
        "id": "screenplay-pdf",
        "type": "digital",
        "name": "Screenplay PDF",
        "price": 0,
        "access": "free-download"
      },
      {
        "id": "tshirt",
        "type": "merch",
        "name": "Official T-Shirt",
        "price": 2500,
        "fulfillment": "printful"
      }
    ]
  }
}
```

### Analytics
PostHog integration for tracking page views, downloads, and conversions:

```json
{
  "analytics": {
    "posthogProjectId": "phc_xxx",
    "trackingEvents": [
      "page_view",
      "screenplay_download",
      "funding_inquiry"
    ]
  }
}
```

### Funding
Crowdfunding tiers for project financing. The extended schema supports both recurring (monthly) sponsors and one-time donations, with optional tier limits and toggling:

```json
{
  "funding": {
    "enabled": true,
    "goal": null,
    "currency": "USD",
    "tiers": [
      {
        "id": "supporter",
        "name": "Supporter",
        "amount": 5,
        "frequency": "monthly",
        "description": "Name in README supporters section",
        "limit": null,
        "enabled": true
      },
      {
        "id": "coffee",
        "name": "Coffee",
        "amount": 10,
        "frequency": "one-time",
        "description": "Thank you mention",
        "limit": null,
        "enabled": true
      },
      {
        "id": "partner",
        "name": "Partner",
        "amount": 500,
        "frequency": "monthly",
        "description": "Large logo + Co-development sessions",
        "limit": 5,
        "enabled": true
      }
    ]
  }
}
```

#### Tier Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier for the tier (used in code) |
| `name` | string | Display name for the tier (shown to users) |
| `amount` | number | Donation amount in the specified currency |
| `frequency` | `"monthly"` \| `"one-time"` | Recurring vs one-time donation |
| `description` | string | Description of what the sponsor receives |
| `limit` | number \| null | Max number of sponsors at this tier (null = unlimited) |
| `enabled` | boolean | Whether the tier is currently available |

#### Top-Level Funding Fields

| Field | Type | Description |
|-------|------|-------------|
| `enabled` | boolean | Whether funding is active for this project |
| `goal` | number \| null | Funding goal amount (null = no specific goal) |
| `currency` | string | ISO 4217 currency code (e.g., `"USD"`, `"EUR"`) |
| `tiers` | array | List of funding tier objects (see above) |

#### Why the Extended Schema Matters

1. **Mixed funding models** — Support both recurring sponsors and one-time donations via the `frequency` field
2. **Tier limits** — Enable exclusive tiers (e.g., "only 5 Partner slots") via the `limit` field
3. **Tier toggling** — Disable tiers without removing them via the `enabled` field
4. **Display names** — Separate `id` (for code) from `name` (for display)

### Rights
Ownership and licensing information:

```json
{
  "rights": {
    "ownership": "creator",
    "registrations": [{"type": "WGA", "number": "123456"}],
    "licensing": {
      "type": "MIT",
      "optionAvailable": true,
      "purchaseAvailable": true,
      "contactRequired": false
    }
  }
}
```

## Assets Directory

### Required Assets

| Asset | Dimensions | Purpose |
|-------|------------|--------|
| `poster.png` | 800x1200 | Movie poster, book cover |
| `banner.png` | 1200x630 | Header images, social sharing |
| `social/twitter-card.png` | 1200x600 | Twitter card image |
| `social/og-image.png` | 1200x630 | Facebook/OpenGraph image |

### Asset Guidelines

- Use PNG or WebP format for quality
- Keep file sizes under 500KB for fast loading
- Include project title in images for social sharing
- Maintain consistent visual branding

## Pages Directory

GitHub Pages content for your project's marketing site.

### How It Works

1. The `deploy-pages.yml` workflow triggers on changes to `marketing/`
2. It reads `wtfb-marketing.json` and generates a static site
3. The site deploys to `https://[username].github.io/[project-name]`

### Customization

Edit `pages/_config.yml` for Jekyll settings:
- Site title and description
- Theme selection
- Build settings

Edit `pages/index.md` for custom landing page content.

## Integration with WTFB Platform

When you register your project on wordstofilmby.com:

1. **Sync**: WTFB reads your `wtfb-marketing.json` via GitHub API
2. **Display**: Your project appears in the WTFB discovery catalog
3. **Commerce**: Products are synced to WTFB's Stripe integration
4. **Analytics**: Events flow to your PostHog project
5. **Payments**: Revenue routes to your connected Stripe account

## Workflow

1. **Configure**: Fill out `wtfb-marketing.json` with your project details
2. **Create Assets**: Add poster, banner, and social card images
3. **Enable Pages**: Go to repo Settings > Pages > Enable GitHub Pages
4. **Register**: Connect your repo to wordstofilmby.com
5. **Promote**: Share your GitHub Pages URL for marketing

## Validation

The CI/CD pipeline validates your marketing config:

```bash
# Validates JSON syntax
jq empty marketing/wtfb-marketing.json

# Local schema validation (using the included schema file)
npx ajv validate -s marketing/wtfb-marketing.schema.json -d marketing/wtfb-marketing.json

# Full schema validation (when registered with WTFB)
# WTFB platform validates against https://wtfb.io/schemas/wtfb-marketing.v1.json
```

The `wtfb-marketing.schema.json` file mirrors the platform schema and defines the expected structure, including the extended funding tier fields (`name`, `frequency`, `limit`, `enabled`) and the top-level `currency` field. Use it locally to catch configuration errors before pushing.
