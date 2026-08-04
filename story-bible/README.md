# story-bible/

Your project's **Story Bible** — a lightweight, validated knowledge vault for continuity.

- **What it is:** short "map-cards" for characters, locations, timeline events, props, themes,
  and arcs. Each card *cites* the manuscript (never copies it) and records the git SHA it was
  last verified against, so a scene edit can flag which cards went stale.
- **Start here:** [`index.md`](index.md) and [`_meta/CONVENTIONS.md`](_meta/CONVENTIONS.md).
- **Templates:** [`_meta/templates/`](_meta/templates/) — one per card type.
- **Machine rules:** [`_meta/vault-config.json`](_meta/vault-config.json) defines the frontmatter
  contract, section sets, statuses, and link rules.

Adapted from the OKF knowledge-vault in our `safe-agentic-workflow` reference repo, with card
types native to storytelling. It complements the `continuity-tracking` skill: the skill is the
working brain while you write; the Story Bible is the versioned store of record.

> **Validation & drift-checking** (`lint:bible`, `check-bible-drift`) land in STO-5; the CI gate
> in STO-6; the `/bible` authoring command + `continuity-tracking` integration in STO-7.
