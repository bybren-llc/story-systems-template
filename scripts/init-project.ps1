# WTFB Project Initializer (PowerShell)
# Usage: .\scripts\init-project.ps1 [project-name] [project-type]
#
# This script initializes a new WTFB project from the template.
# It updates configuration files, creates type-specific structures,
# and prepares the project for development.
#
# Requirements: PowerShell 5.1+ (Windows built-in) or PowerShell 7+
# If blocked by execution policy, run:
#   PowerShell -ExecutionPolicy Bypass -File .\scripts\init-project.ps1

param(
    [string]$ProjectName = "",
    [string]$ProjectType = ""
)

$ErrorActionPreference = "Stop"

# Colors for output
function Write-Blue { param([string]$Message) Write-Host $Message -ForegroundColor Blue }
function Write-Green { param([string]$Message) Write-Host $Message -ForegroundColor Green }
function Write-Yellow { param([string]$Message) Write-Host $Message -ForegroundColor Yellow }
function Write-Red { param([string]$Message) Write-Host $Message -ForegroundColor Red }

Write-Blue "========================================"
Write-Blue "  WTFB Project Initializer"
Write-Blue "========================================"
Write-Host ""

# Get project name and type
if ([string]::IsNullOrWhiteSpace($ProjectName)) {
    $ProjectName = Read-Host "Project name (lowercase, hyphenated)"
}

if ([string]::IsNullOrWhiteSpace($ProjectType)) {
    Write-Host "Project types:"
    Write-Host "  1) screenplay"
    Write-Host "  2) novel"
    Write-Host "  3) film-production"
    $typeNum = Read-Host "Select project type [1-3]"

    switch ($typeNum) {
        "1" { $ProjectType = "screenplay" }
        "2" { $ProjectType = "novel" }
        "3" { $ProjectType = "film-production" }
        default {
            Write-Red "Invalid selection"
            exit 1
        }
    }
}

# Validate inputs
if ([string]::IsNullOrWhiteSpace($ProjectName)) {
    Write-Red "Error: Project name is required"
    exit 1
}

# Validate project type
$validTypes = @("screenplay", "novel", "film-production")
if ($ProjectType -notin $validTypes) {
    Write-Red "Error: Invalid project type. Use: screenplay, novel, or film-production"
    exit 1
}

Write-Green "Project type: $ProjectType"
Write-Host ""
Write-Yellow "Initializing $ProjectType project: $ProjectName"
Write-Host ""

# Create title from project name (title case)
$ProjectTitle = ($ProjectName -replace '-', ' ') -split ' ' | ForEach-Object {
    $_.Substring(0,1).ToUpper() + $_.Substring(1).ToLower()
} | Join-String -Separator ' '

$CurrentDate = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
$CurrentYear = (Get-Date).Year

# Update .wtfb/project.json
Write-Host "Updating project configuration..."
$projectJson = @"
{
  "`$schema": "https://wtfb.io/schemas/project.v1.json",
  "projectType": "$ProjectType",
  "name": "$ProjectName",
  "version": "1.0.0",
  "template": {
    "upstream": "https://github.com/bybren-llc/wtfb-projects-template",
    "version": "1.0.0",
    "lastSync": "$CurrentDate"
  },
  "plugins": {
    "installed": [],
    "optional": [
      {
        "name": "wtfb-screenwriting",
        "source": "github.com/bybren-llc/wtfb-claude-marketplace/plugins/screenwriting",
        "when": "screenplay"
      },
      {
        "name": "wtfb-novel-writing",
        "source": "github.com/bybren-llc/wtfb-claude-marketplace/plugins/novel-writing",
        "when": "novel"
      },
      {
        "name": "wtfb-film-production",
        "source": "github.com/bybren-llc/wtfb-claude-marketplace/plugins/film-production",
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
"@
Set-Content -Path ".wtfb/project.json" -Value $projectJson -Encoding UTF8

# Update marketing/wtfb-marketing.json
Write-Host "Updating marketing configuration..."
$marketingJson = @"
{
  "`$schema": "https://wtfb.io/schemas/wtfb-marketing.v1.json",
  "version": "1.0.0",
  "project": {
    "id": "$ProjectName",
    "title": "$ProjectTitle",
    "subtitle": null,
    "logline": "Your logline here.",
    "type": "$ProjectType",
    "status": "development",
    "year": $CurrentYear
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
"@
Set-Content -Path "marketing/wtfb-marketing.json" -Value $marketingJson -Encoding UTF8

# Type-specific setup
Write-Host "Creating type-specific files..."

$draftDate = (Get-Date).ToString("yyyy-MM-dd")

switch ($ProjectType) {
    "screenplay" {
        # Create main fountain file
        $fountainContent = @"
Title:
    **$ProjectTitle**
Credit: Written by
Author: Your Name
Draft date: $draftDate
Contact:
    your@email.com

===

# Act One

INT. LOCATION - DAY

Your story begins here.

"@
        Set-Content -Path "$ProjectName.fountain" -Value $fountainContent -Encoding UTF8
        Write-Green "  Created: $ProjectName.fountain"

        # Create screenplay-specific templates
        if (-not (Test-Path "templates")) { New-Item -ItemType Directory -Path "templates" | Out-Null }

        $beatSheet = @"
# $ProjectTitle - Beat Sheet

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
"@
        Set-Content -Path "templates/beat-sheet.md" -Value $beatSheet -Encoding UTF8
        Write-Green "  Created: templates/beat-sheet.md"

        $characterRegistry = @"
# $ProjectTitle - Character Registry

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
"@
        Set-Content -Path "templates/character-registry.md" -Value $characterRegistry -Encoding UTF8
        Write-Green "  Created: templates/character-registry.md"
    }

    "novel" {
        # Create manuscript structure
        $dirs = @("manuscript/chapters", "world/characters", "world/locations")
        foreach ($dir in $dirs) {
            if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
        }

        $outline = @"
# $ProjectTitle - Outline

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
"@
        Set-Content -Path "manuscript/outline.md" -Value $outline -Encoding UTF8
        Write-Green "  Created: manuscript/outline.md"

        $chapter1 = @"
# Chapter 1

Your story begins here.
"@
        Set-Content -Path "manuscript/chapters/chapter-01.md" -Value $chapter1 -Encoding UTF8
        Write-Green "  Created: manuscript/chapters/chapter-01.md"

        $protagonist = @"
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
"@
        Set-Content -Path "world/characters/protagonist.md" -Value $protagonist -Encoding UTF8
        Write-Green "  Created: world/characters/protagonist.md"
    }

    "film-production" {
        # Create production structure
        $dirs = @(
            "production/call-sheets",
            "production/daily-reports",
            "assets/storyboards",
            "assets/location-scouts",
            "crew"
        )
        foreach ($dir in $dirs) {
            if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
        }

        $schedule = @"
{
  "project": "$ProjectName",
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
"@
        Set-Content -Path "production/schedule.json" -Value $schedule -Encoding UTF8
        Write-Green "  Created: production/schedule.json"

        $budget = @"
{
  "project": "$ProjectName",
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
"@
        Set-Content -Path "production/budget.json" -Value $budget -Encoding UTF8
        Write-Green "  Created: production/budget.json"

        $contacts = @"
{
  "project": "$ProjectName",
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
"@
        Set-Content -Path "crew/contacts.json" -Value $contacts -Encoding UTF8
        Write-Green "  Created: crew/contacts.json"
    }
}

# Create CLAUDE.md symlink (with fallback to copy)
Write-Host "Creating CLAUDE.md link..."
$symlinkTarget = ".wtfb/ai-harness/CLAUDE.md"
$symlinkPath = "CLAUDE.md"

# Remove existing file/link if present
if (Test-Path $symlinkPath) {
    Remove-Item $symlinkPath -Force
}

try {
    # Try to create symlink (requires Developer Mode or admin on Windows)
    New-Item -ItemType SymbolicLink -Path $symlinkPath -Target $symlinkTarget -ErrorAction Stop | Out-Null
    Write-Green "  Created: CLAUDE.md -> $symlinkTarget (symlink)"
} catch {
    # Fallback: copy the file instead
    Copy-Item -Path $symlinkTarget -Destination $symlinkPath -Force
    Write-Yellow "  Created: CLAUDE.md (copy - symlink requires Developer Mode or admin)"
}

# Update package.json name
Write-Host "Updating package.json..."
$packageJson = Get-Content -Path "package.json" -Raw
$packageJson = $packageJson -replace '"name": "wtfb-project"', "`"name`": `"$ProjectName`""
Set-Content -Path "package.json" -Value $packageJson -Encoding UTF8

# Add placeholder files
Write-Host "Creating placeholder files..."
$placeholderDirs = @(
    "sourcematerials",
    "exports/pdf",
    "exports/fdx",
    "exports/html",
    "docs/v1-original"
)
foreach ($dir in $placeholderDirs) {
    if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
    $gitkeep = Join-Path $dir ".gitkeep"
    if (-not (Test-Path $gitkeep)) { New-Item -ItemType File -Path $gitkeep -Force | Out-Null }
}

Write-Host ""
Write-Green "========================================"
Write-Green "  Project initialized successfully!"
Write-Green "========================================"
Write-Host ""
Write-Host "Next steps:"
Write-Host ""
Write-Host "  1. Update marketing/wtfb-marketing.json with your project details"
Write-Host "  2. Add source materials to sourcematerials/"
Write-Host "  3. Install dependencies: npm install"
Write-Host "  4. Start developing with: claude"
Write-Host ""

switch ($ProjectType) {
    "screenplay" {
        Write-Host "Recommended plugin:"
        Write-Host "  /plugin install wtfb-screenwriting@github.com/bybren-llc/wtfb-claude-marketplace/plugins/screenwriting"
        Write-Host ""
        Write-Host "Available commands after plugin install:"
        Write-Host "  /start-scene      - Begin scene work"
        Write-Host "  /writers-room     - Multi-agent pre-production"
        Write-Host "  /check-format     - Validate Fountain syntax"
    }
    "novel" {
        Write-Host "Available commands:"
        Write-Host "  /start-chapter    - Begin chapter work"
        Write-Host "  /outline          - View story outline"
        Write-Host "  /word-count       - Check manuscript length"
    }
    "film-production" {
        Write-Host "Available commands:"
        Write-Host "  /create-schedule  - Build production schedule"
        Write-Host "  /call-sheet       - Generate call sheet"
        Write-Host "  /budget-check     - Review budget"
    }
}

Write-Host ""
Write-Blue "Happy creating!"

exit 0
