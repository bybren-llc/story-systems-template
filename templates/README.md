# Templates Directory

This directory contains reusable document templates for creative project development. Templates provide consistent structure and ensure you capture all necessary information.

## Directory Structure

```
templates/
├── README.md              # This file
├── beat-sheet.md          # Story structure template
├── character-registry.md  # Character tracking template
├── treatment-template.md  # Project treatment/pitch document
├── continuity-report.md   # Continuity tracking template
└── readme-imdb-style.md   # IMDb-style project README template
```

## Available Templates

### beat-sheet.md

**Purpose:** Map out your story's structure using the Blake Snyder Beat Sheet (Save the Cat!) methodology.

**Contains:**
- 15 story beats from Opening Image to Final Image
- Page number targets for each beat
- Space for descriptions and notes
- Act structure breakdown

**When to use:**
- Early development to plan structure
- Revision passes to check pacing
- Pitch preparation

**Example usage:**
1. Copy to your project: `cp templates/beat-sheet.md docs/beat-sheet.md`
2. Fill in each beat with your story's specifics
3. Update as your story evolves

### character-registry.md

**Purpose:** Track all characters with consistent, detailed profiles.

**Contains:**
- Main character template (want, need, fear, ghost, arc)
- Supporting character template
- Minor character table
- Relationship mapping
- Knowledge state tracking

**When to use:**
- Character creation and development
- Continuity checking (who knows what, when)
- Casting preparation
- Dialogue writing (voice consistency)

**Key sections:**
- **Want**: External goal (what they pursue)
- **Need**: Internal goal (what they actually require)
- **Ghost**: Past wound driving behavior
- **Arc**: Transformation from start to end

### treatment-template.md

**Purpose:** Create a professional treatment document for pitching or development.

**Contains:**
- Title page format
- Logline section
- Synopsis
- Tone and style description
- Theme articulation
- Character summaries
- Full story (Act 1/2/3)
- Production notes

**When to use:**
- Pitching to producers/agents
- Development documentation
- Team alignment
- Funding applications

**Length guidance:**
- Short film: 2-5 pages
- Feature: 8-15 pages
- TV pilot: 10-20 pages

### continuity-report.md

**Purpose:** Track continuity across your story to prevent errors.

**Contains:**
- Timeline registry (when things happen)
- Prop inventory (what appears where)
- Character knowledge states (who knows what)
- Physical injury progression
- Costume/wardrobe tracking
- Location logic verification
- Refrain/motif tracking

**When to use:**
- During writing to maintain consistency
- Revision passes to catch errors
- Production preparation
- Script supervision

### readme-imdb-style.md

**Purpose:** Create a professional, IMDb-style README for your project that presents it like a finished film.

**Contains:**
- Title with hero image
- Genre/Type/Runtime header
- Storyline (elevator pitch)
- Plot Summary (detailed)
- Cast and Crew tables
- Technical Specs
- Themes and Keywords
- Trivia, Quotes, and Connections
- Contributing guidelines
- Copyright notice

**When to use:**
- Project presentation on GitHub
- Pitch materials
- Portfolio showcase
- Community sharing

**Example usage:**
1. Copy to your project root: `cp templates/readme-imdb-style.md README.md`
2. Replace all placeholder text with your project details
3. Add your hero image to `source-materials/`
4. Update as your project evolves

## Project Type Variations

Templates work across project types with minor adaptations:

| Template | Screenplay | Novel | Film Production |
|----------|------------|-------|-----------------|
| Beat Sheet | Scene-based | Chapter-based | Production schedule |
| Character Registry | Full use | Full use | Casting reference |
| Treatment | Industry format | Query/synopsis | Pitch deck |
| Continuity | Script supervision | Editor's notes | Production tracking |
| README IMDb-style | Project showcase | Project showcase | Project showcase |

## How Templates Are Used by AI

When you invoke commands like `/writers-room` or `/story-check`, the AI references these templates:

1. **Structure validation**: Compares your work against beat-sheet.md
2. **Character consistency**: Checks against character-registry.md
3. **Pitch preparation**: Uses treatment-template.md format
4. **Continuity checking**: Follows continuity-report.md patterns

## Customizing Templates

Templates are starting points. Customize them for your project:

1. **Copy, don't modify originals**: Keep templates/ clean for reference
2. **Add project-specific sections**: Include what you need
3. **Remove unused sections**: Don't carry dead weight
4. **Maintain structure**: AI commands expect certain sections

**Example customization:**
```bash
# Copy to docs for customization
cp templates/beat-sheet.md docs/my-beat-sheet.md

# Edit for your project
# Add/remove beats as needed
```

## Template Sync

Templates are in `syncPaths` in project.json, meaning they CAN be updated from the upstream Story Systems template. This keeps your templates current with best practices.

If you've customized templates, keep your working copies in `docs/` (which is protected).

## Adding Custom Templates

To add a project-specific template:

1. Create the file in `templates/`
2. Follow the existing format patterns
3. Include clear section headers
4. Add usage instructions at the top
5. Update this README

**Template conventions:**
- Use Markdown format
- Include YAML-like metadata section
- Use tables for structured data
- Include placeholder text in brackets: `[YOUR TEXT HERE]`

## Best Practices

1. **Fill templates early**: Structure helps creativity
2. **Update continuously**: Living documents, not one-time forms
3. **Use for validation**: Check your work against templates
4. **Share with collaborators**: Common reference point
5. **Version your filled templates**: Track in git with your project
