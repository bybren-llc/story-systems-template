#!/bin/bash
# WTFB Project Initializer
# Usage: ./scripts/init-project.sh [project-name] [project-type]
#
# This script initializes a new WTFB project from the template.
# It updates configuration files, creates type-specific structures,
# and prepares the project for development.

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  WTFB Project Initializer${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Get project name and type
PROJECT_NAME=${1:-""}
PROJECT_TYPE=${2:-""}

# Interactive prompts if not provided
if [ -z "$PROJECT_NAME" ]; then
    read -p "Project name (lowercase, hyphenated): " PROJECT_NAME
fi

if [ -z "$PROJECT_TYPE" ]; then
    echo "Project types:"
    echo "  1) screenplay"
    echo "  2) novel"
    echo "  3) film-production"
    read -p "Select project type [1-3]: " TYPE_NUM

    case $TYPE_NUM in
        1) PROJECT_TYPE="screenplay" ;;
        2) PROJECT_TYPE="novel" ;;
        3) PROJECT_TYPE="film-production" ;;
        *) echo -e "${RED}Invalid selection${NC}"; exit 1 ;;
    esac
fi

# Validate inputs
if [ -z "$PROJECT_NAME" ]; then
    echo -e "${RED}Error: Project name is required${NC}"
    exit 1
fi

# Validate project type
case $PROJECT_TYPE in
    screenplay|novel|film-production)
        echo -e "${GREEN}Project type: $PROJECT_TYPE${NC}"
        ;;
    *)
        echo -e "${RED}Error: Invalid project type. Use: screenplay, novel, or film-production${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${YELLOW}Initializing $PROJECT_TYPE project: $PROJECT_NAME${NC}"
echo ""

# Create title from project name (portable: works on macOS BSD and GNU)
PROJECT_TITLE=$(echo "$PROJECT_NAME" | tr '-' ' ' | awk '{for(i=1;i<=NF;i++) $i=toupper(substr($i,1,1)) tolower(substr($i,2))}1')
CURRENT_DATE=$(date -u +%Y-%m-%dT%H:%M:%SZ)
CURRENT_YEAR=$(date +%Y)

# Update .wtfb/project.json
echo "Updating project configuration..."
cat > .wtfb/project.json << EOF
{
  "\$schema": "https://wtfb.io/schemas/project.v1.json",
  "projectType": "$PROJECT_TYPE",
  "name": "$PROJECT_NAME",
  "version": "1.0.0",
  "template": {
    "upstream": "https://github.com/bybren-llc/story-systems-template",
    "version": "1.0.0",
    "lastSync": "$CURRENT_DATE"
  },
  "plugins": {
    "installed": [],
    "optional": [
      {
        "name": "wtfb-screenwriting",
        "source": "github.com/bybren-llc/cheddarfox-claude-marketplace/plugins/screenwriting",
        "when": "screenplay"
      },
      {
        "name": "wtfb-novel-writing",
        "source": "github.com/bybren-llc/cheddarfox-claude-marketplace/plugins/novel-writing",
        "when": "novel"
      },
      {
        "name": "wtfb-film-production",
        "source": "github.com/bybren-llc/cheddarfox-claude-marketplace/plugins/film-production",
        "when": "film-production"
      }
    ]
  },
  "protectedPaths": [
    "*.fountain",
    "manuscript/**",
    "sourcematerials/**",
    "docs/v*/**",
    "README.md",
    "marketing/wtfb-marketing.json",
    "marketing/assets/**"
  ],
  "syncPaths": [
    ".github/workflows/**",
    "scripts/**",
    ".wtfb/ai-harness/**",
    "templates/**"
  ]
}
EOF

# Update marketing/wtfb-marketing.json
echo "Updating marketing configuration..."
cat > marketing/wtfb-marketing.json << EOF
{
  "\$schema": "https://wtfb.io/schemas/wtfb-marketing.v1.json",
  "version": "1.0.0",
  "project": {
    "id": "$PROJECT_NAME",
    "title": "$PROJECT_TITLE",
    "subtitle": null,
    "logline": "Your logline here.",
    "type": "$PROJECT_TYPE",
    "status": "development",
    "year": $CURRENT_YEAR
  },
  "metadata": {
    "genres": [],
    "themes": [],
    "keywords": [],
    "runtime": null,
    "rating": null,
    "language": "English",
    "setting": null
  },
  "creators": {
    "primary": {
      "name": "Your Name",
      "wtfbUserId": null,
      "role": "Writer",
      "bio": null,
      "links": {}
    },
    "contributors": []
  },
  "marketing": {
    "tagline": null,
    "oneSheet": {
      "headline": null,
      "synopsis": null,
      "callToAction": "Coming Soon"
    },
    "assets": {
      "poster": "assets/poster.png",
      "banner": "assets/banner.png",
      "socialCards": {
        "twitter": "assets/social/twitter-card.png",
        "og": "assets/social/og-image.png"
      }
    },
    "quotes": []
  },
  "platform": {
    "visibility": "private",
    "featured": false,
    "allowFunding": false,
    "allowInquiries": false,
    "contactEmail": null
  },
  "commerce": {
    "enabled": false,
    "stripeAccountId": null,
    "products": []
  },
  "analytics": {
    "posthogProjectId": null,
    "trackingEvents": [
      "page_view",
      "screenplay_download",
      "funding_inquiry",
      "social_share"
    ],
    "customProperties": {}
  },
  "funding": {
    "enabled": false,
    "goal": null,
    "currency": "USD",
    "tiers": []
  },
  "rights": {
    "ownership": "creator",
    "registrations": [],
    "licensing": {
      "optionAvailable": false,
      "purchaseAvailable": false,
      "contactRequired": true
    }
  },
  "social": {
    "hashtag": null,
    "handles": {},
    "shareText": null
  }
}
EOF

# Type-specific setup
echo "Creating type-specific files..."
case $PROJECT_TYPE in
    screenplay)
        # Create main fountain file
        cat > "$PROJECT_NAME.fountain" << EOF
Title:
    **$PROJECT_TITLE**
Credit: Written by
Author: Your Name
Draft date: $(date +%Y-%m-%d)
Contact:
    your@email.com

===

# Act One

INT. LOCATION - DAY

Your story begins here.

EOF
        echo -e "  ${GREEN}Created: $PROJECT_NAME.fountain${NC}"

        # Create screenplay-specific templates
        mkdir -p templates
        cat > templates/beat-sheet.md << EOF
# $PROJECT_TITLE - Beat Sheet

## Act One (Setup)

### Opening Image
- Description:

### Theme Stated
- Description:

### Set-Up
- Description:

### Catalyst
- Description:

### Debate
- Description:

### Break into Two
- Description:

## Act Two (Confrontation)

### B Story
- Description:

### Fun and Games
- Description:

### Midpoint
- Description:

### Bad Guys Close In
- Description:

### All Is Lost
- Description:

### Dark Night of the Soul
- Description:

### Break into Three
- Description:

## Act Three (Resolution)

### Finale
- Description:

### Final Image
- Description:
EOF
        echo -e "  ${GREEN}Created: templates/beat-sheet.md${NC}"

        cat > templates/character-registry.md << EOF
# $PROJECT_TITLE - Character Registry

## Main Characters

### [CHARACTER NAME]
- **Role**: Protagonist / Antagonist / Supporting
- **Age**:
- **Occupation**:
- **Core Trait**:
- **Want**:
- **Need**:
- **Arc**:
- **First Appearance**: Scene #

---

## Supporting Characters

### [CHARACTER NAME]
- **Role**:
- **Relationship to Main**:
- **Function in Story**:
- **First Appearance**: Scene #

---

## Minor Characters

| Character | Role | First Appearance |
|-----------|------|------------------|
|           |      |                  |
EOF
        echo -e "  ${GREEN}Created: templates/character-registry.md${NC}"
        ;;

    novel)
        # Create manuscript structure
        mkdir -p manuscript/chapters world/characters world/locations

        cat > manuscript/outline.md << EOF
# $PROJECT_TITLE - Outline

## Part One

### Chapter 1: [Title]
- **POV**:
- **Summary**:
- **Key Events**:
  -

### Chapter 2: [Title]
- **POV**:
- **Summary**:
- **Key Events**:
  -

## Part Two

### Chapter 3: [Title]
- **POV**:
- **Summary**:
- **Key Events**:
  -
EOF
        echo -e "  ${GREEN}Created: manuscript/outline.md${NC}"

        cat > manuscript/chapters/chapter-01.md << EOF
# Chapter 1

Your story begins here.
EOF
        echo -e "  ${GREEN}Created: manuscript/chapters/chapter-01.md${NC}"

        cat > world/characters/protagonist.md << EOF
# [Character Name]

## Basic Info
- **Full Name**:
- **Age**:
- **Occupation**:

## Physical Description

## Personality

## Background

## Motivations
- **Want**:
- **Need**:

## Character Arc

## Relationships

## Notes
EOF
        echo -e "  ${GREEN}Created: world/characters/protagonist.md${NC}"
        ;;

    film-production)
        # Create production structure
        mkdir -p production/call-sheets production/daily-reports
        mkdir -p assets/storyboards assets/location-scouts
        mkdir -p crew

        cat > production/schedule.json << EOF
{
  "project": "$PROJECT_NAME",
  "productionDates": {
    "prepStart": null,
    "shootStart": null,
    "shootEnd": null,
    "wrapDate": null
  },
  "shootDays": [],
  "locations": [],
  "notes": []
}
EOF
        echo -e "  ${GREEN}Created: production/schedule.json${NC}"

        cat > production/budget.json << EOF
{
  "project": "$PROJECT_NAME",
  "currency": "USD",
  "total": 0,
  "categories": {
    "above-the-line": 0,
    "production": 0,
    "post-production": 0,
    "other": 0
  },
  "lineItems": []
}
EOF
        echo -e "  ${GREEN}Created: production/budget.json${NC}"

        cat > crew/contacts.json << EOF
{
  "project": "$PROJECT_NAME",
  "departments": {
    "production": [],
    "camera": [],
    "sound": [],
    "art": [],
    "wardrobe": [],
    "makeup": [],
    "electric": [],
    "grip": []
  }
}
EOF
        echo -e "  ${GREEN}Created: crew/contacts.json${NC}"
        ;;
esac

# Create symlink for CLAUDE.md
echo "Creating CLAUDE.md symlink..."
ln -sf .wtfb/ai-harness/CLAUDE.md CLAUDE.md
echo -e "  ${GREEN}Created: CLAUDE.md -> .wtfb/ai-harness/CLAUDE.md${NC}"

# Update package.json name (portable: BSD sed on macOS requires -i '')
echo "Updating package.json..."
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s/\"name\": \"wtfb-project\"/\"name\": \"$PROJECT_NAME\"/" package.json
else
    sed -i "s/\"name\": \"wtfb-project\"/\"name\": \"$PROJECT_NAME\"/" package.json
fi

# Add placeholder files
echo "Creating placeholder files..."
touch sourcematerials/.gitkeep
touch exports/pdf/.gitkeep
touch exports/fdx/.gitkeep
touch exports/html/.gitkeep
mkdir -p docs/v1-original
touch docs/v1-original/.gitkeep

# Generate project README from IMDb template
echo "Generating project README..."
npx wtfb init-readme --title "$PROJECT_TITLE" --type "$PROJECT_TYPE" || echo -e "  ${YELLOW}README generation failed${NC}"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Project initialized successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Next steps:"
echo ""
echo "  1. Update marketing/wtfb-marketing.json with your project details"
echo "  2. Add source materials to sourcematerials/"
echo "  3. Install dependencies: npm install"
echo "  4. Start developing with: claude"
echo ""

case $PROJECT_TYPE in
    screenplay)
        echo "Recommended plugin:"
        echo "  /plugin install wtfb-screenwriting@github.com/bybren-llc/cheddarfox-claude-marketplace/plugins/screenwriting"
        echo ""
        echo "Available commands after plugin install:"
        echo "  /start-scene      - Begin scene work"
        echo "  /writers-room     - Multi-agent pre-production"
        echo "  /check-format     - Validate Fountain syntax"
        ;;
    novel)
        echo "Available commands:"
        echo "  /start-chapter    - Begin chapter work"
        echo "  /outline          - View story outline"
        echo "  /word-count       - Check manuscript length"
        ;;
    film-production)
        echo "Available commands:"
        echo "  /create-schedule  - Build production schedule"
        echo "  /call-sheet       - Generate call sheet"
        echo "  /budget-check     - Review budget"
        ;;
esac

echo ""
echo -e "${BLUE}Happy creating!${NC}"
