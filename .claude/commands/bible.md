---
description: Create or refresh a Story Bible card and stamp verified_against.
---

# /bible

Create or refresh a Story Bible card (character, location, timeline-event, prop, theme, or arc)
and stamp it with the commit it was verified against.

## Arguments

- `[type] [name]` — e.g. `character "Mara Vance"`, `location "The Pass"`

## Workflow

### Step 1: Pick the type + section folder

| Type | Folder |
|------|--------|
| character | `story-bible/characters/` |
| location | `story-bible/locations/` |
| timeline-event | `story-bible/timeline/` |
| prop | `story-bible/props/` |
| theme | `story-bible/themes/` |
| arc | `story-bible/arcs/` |

### Step 2: Create or refresh the card

- **New card:** copy `story-bible/_meta/templates/<type>.md` into the folder as `<slug>.md` and
  fill it in.
- **Refresh:** if `<slug>.md` already exists, **edit it in place** — never copy the template over
  an existing card (that would discard the writer's content).

Keep it to **at most 50 lines** — a map-card **cites** the manuscript, it does not restate it.

### Step 3: Cite sources + stamp verified_against

- List the manuscript scenes under `sources:` and `## Appears In`.
- Set `verified_against` to the current commit SHA: `git rev-parse --short HEAD`.

### Step 4: Register in the manifest

Add the card to `story-bible/_meta/manifest.json` (`id`, `type`, `title`, `path`, `sources`).

### Step 5: Validate

- `npm run lint:bible` (or `lint:bible:strict`) — structural check.
- `npm run bible:drift` — flags cards gone stale versus the manuscript.

## What It Does

Turns continuity knowledge into a durable, validated, drift-aware Story Bible card.

## When to Use

- After establishing a new character / location / prop / theme / arc / event.
- After a scene changes facts a card depends on (re-verify, then bump `verified_against`).
- Whenever `/check-continuity` surfaces a fact worth recording as canon.

## Output

A validated `.md` card in `story-bible/`, registered in the manifest.

## See Also

- **continuity-tracking** skill — the working brain; `/bible` persists its findings as canon.
- **/check-continuity** — consistency pass that reads Story Bible cards as ground truth.
- `story-bible/_meta/CONVENTIONS.md` — authoring rules.
