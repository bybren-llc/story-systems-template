# Story Bible

The durable, validated source of record for your story world — characters, locations, timeline,
props, themes, and arcs. Each entry is a short **map-card** that cites the manuscript rather than
copying it, and carries the commit SHA it was last verified against so staleness can be computed,
not guessed.

New here? Read [`_meta/CONVENTIONS.md`](_meta/CONVENTIONS.md) first.

## Sections

- [Characters](characters/) — the cast
- [Locations](locations/) — the world
- [Timeline](timeline/) — chronology of events
- [Props](props/) — objects that carry plot or meaning
- [Themes](themes/) — the arguments the story makes
- [Arcs](arcs/) — how people (or the world) change

## Authoring a card

Copy the matching skeleton from [`_meta/templates/`](_meta/templates/) into the right section
folder, fill it in, cite the scenes under **Appears In**, and set `verified_against` to the
current commit. Keep it under 50 lines — if it's growing, you're restating the manuscript.

See [`_meta/example-character.md`](_meta/example-character.md) for a worked example (a
non-canonical teaching fixture — your `characters/` folder starts empty for your own cast).
