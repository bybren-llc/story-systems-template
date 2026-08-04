# Story Bible — Conventions

The Story Bible is your project's durable, validated source of record for **who, where, when,
what, and why** — characters, locations, timeline events, props, themes, and arcs. It is the
crystallized, versioned form of what the `continuity-tracking` skill tracks while you write.

Adapted from the Open Knowledge Format (OKF v0.1) vault mechanism in our
`safe-agentic-workflow` reference repo — the machinery is proven; the card types are native to
storytelling.

## The one rule: map-cards, not copies

A card **cites** the manuscript; it does **not** restate it. If you are copying more than a
sentence from a scene, stop and cite it instead. A card that duplicates its source becomes two
things to maintain, and they *will* diverge. Keep every card under **50 lines**
(`max_concept_lines`).

## Frontmatter contract (every card)

```yaml
---
type: character            # character | location | timeline-event | prop | theme | arc
title: "Name"
description: "One sentence, <=160 chars"
tags: [cast, protagonist]  # from the controlled vocabulary in vault-config.json
timestamp: 2026-08-04      # date this card was last VERIFIED against its sources (not last edited)
status: draft              # canon | draft | provisional | cut
sources:                   # manuscript paths this card describes (repo-root-relative)
  - "path/to/scene.fountain"
verified_against: "<git-sha>"   # the commit SHA the claims were checked at
# optional: domain, aka, ticket, docs
---
```

- **`sources` + `verified_against` are the drift hooks.** When a `sources` file changes after
  `verified_against`, the card is **stale** — re-read the scene, update the claims, then bump
  `timestamp` and `verified_against`. (The drift checker that flags this arrives in STO-5.)
- **`timestamp`** = last verified, not last edited. This is deliberate.

## Sections

Each card type has a fixed set of `##` sections (see `types` in `vault-config.json`) — use
exactly those, in order, with a single `#` H1. Every card ends with **`## Appears In`**.

## Links

- **Relative Markdown only.** No `[[wikilinks]]`, no leading-slash paths, no GitHub blob URLs
  for repo files.
- **Concept-to-concept links stay inside the bundle** (link other cards).
- **Out-of-bundle links** (into `.fountain` / `manuscript/**`) appear **only** under
  `## Appears In`.

## Statuses

- `canon` — established story truth.
- `draft` — still being figured out.
- `provisional` — tentative; may change.
- `cut` — removed from the story, retained for reference.

## Layout

```
story-bible/
├── _meta/            config, conventions, templates, manifest   (synced from upstream)
├── characters/  locations/  timeline/  props/  themes/  arcs/   (your canon — protected)
├── index.md          reference door
└── log.md            dated changelog
```
