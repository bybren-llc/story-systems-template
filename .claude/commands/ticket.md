---
description: Draft a four-section issue from repo coordinates and create it in Linear.
---

# /ticket

Draft a ticket a developer can pick up cold and finish without asking a question, then
create it in the tracker.

## Arguments

- `[description]` — what is wrong or what needs building, in your own words.
  e.g. `/ticket the fountain linter skips scenes inside boneyard comments`

## Workflow

### Step 1: Gather coordinates before writing a word

Do not draft from the description alone. Read the repo first and collect:

- The file and line range of the thing that is wrong — `scripts/validate-fountain.js:88-94`.
- What that code currently does that is load-bearing, and what breaks without it.
- Any external state the ticket depends on, plus **today's date** to stamp the observation.
- The command that proves the fix worked. Run it only if it is already documented in the repo —
  an `npm` script, a documented CLI — and only if it is read-only. Anything else goes into the
  ticket without being run, and you ask before running it.
- A file that already does it right, and the ticket that made it so.

If a claim cannot be traced to a file, a command, or a dated check, it does not go in the ticket.

### Step 2: Redact before anything leaves the repo

A ticket is published. Everything gathered in Step 1 lands in a tracker, and often in a public
repo after that. Strip it before drafting:

- **Secrets** — tokens, keys, passwords, connection strings — even when the point of the ticket
  is that one was committed. Cite the location (`.npmrc:4-5`), never the value.
- **Personal data** — names, emails, and account IDs of anyone outside the team.
- **Client identifiers**, when the code belongs to someone else. Replace with a structural
  placeholder (`apps/web-client`), never a look-alike of the real name.

If a secret's value is genuinely needed to do the work, say where it lives and who can read it.

### Step 3: Draft the four sections

Use the format below. Four sections, in this order, no others.

### Step 4: Self-check against the banned list

Reread the draft and cut every banned heading, phrase, and hedge. Confirm each AC bullet is an
end state a reviewer can check without you — if it reads as an instruction, rewrite it as a
condition. Confirm Step 2 held: no secret's value survived into the draft.

### Step 5: Show the draft and wait

Print the full body and ask for confirmation. Do not create the issue first and edit after.

### Step 6: Create the issue

Create it in the project's tracker — for this repo, Linear team `Story Systems` (prefix `STO`).
Title uses the commit convention: `type(scope): description`.

### Step 7: Offer the branch

Once the ID exists, offer `<TICKET-ID>-<short-description>` off `develop`, per `CONTRIBUTING.md`.

---

## The format

Four sections, in this order, no others: Problem, Goal, AC, Dev Notes.

### Problem

Two or three short paragraphs. Observed fact, with coordinates.

- Open with the artifact and its exact location — `apps/web-client/.npmrc:4-5` carries a hardcoded `_authToken`.
- Say what it currently does that is load-bearing, and what breaks without it.
- Second paragraph: the separate condition that makes this hard. Lead with `Separately,` when it is a distinct fact, not a consequence.
- Date every observation of external state — as of 2026-07-31 that allowlist holds only `apps/design-system`.
- If one thing is both the defect and the thing masking another defect, say that in one sentence.
- State the failure as when-then, concrete — when the token is revoked or expires, the web client build stops resolving `@vendor/icons`.
- Name the constraint on the fix if one exists: permissions, ownership, an environment you cannot reach.
- Name the precedent if one exists — `apps/design-system` already went through exactly this under `PROJ-1180`.

### Goal

One sentence. The end state written as if already true. Anchor to a working example when one exists.

### AC

Four to six bullets. Each is an observable end state a reviewer can check without you.

- Present tense, declarative. `The existing token is revoked in GitLab` — not `Revoke the token`.
- No `should`, `must`, `will`, `ensure that`, `verify that`.
- One checkable fact per bullet, naming the artifact it lives in.
- No trailing punctuation.
- If it cannot be checked by looking at something, it is not AC — move it to Dev Notes.

### Dev Notes

Four to seven bullets. Everything already found, so the assignee does not have to find it again.

- Exact coordinates — `.gitlab-ci.yml:207-208`, `.npmrc:4-5`, project `12345678`.
- Exact click path for UI work — `mirror-registry → Settings → CI/CD → Job token permissions → add group/web-client`.
- The verification command, verbatim and runnable.
- Traps — signals that read wrong. The legacy `ci_job_token_scope_enabled` reads `false` and is misleading.
- The pattern to copy — a file that already does it right, and the ticket that made it so.

### Style

- Backtick every path, identifier, command, flag, project ID, and ticket ID.
- Absolute dates. Never `recently`, `currently`, `at the moment`.
- Numbers you verified. If you did not check, do not write it.
- Sentences carry facts. Cut any sentence that only sets up the next one.

### Banned

Headings other than the four. `Overview`, `Summary`, `Background`, `Context`, `Impact`,
`Next Steps`, `Notes`, `Conclusion`.

Emoji. Severity theater — `CRITICAL`, `P0` in the body. Bold scattered through prose.

Phrases: `it's worth noting`, `importantly`, `this ensures`, `robust`, `seamless`,
`comprehensive`, `leverage`, `streamline`, `properly`, `simply`, `just`, `we need to`,
`the goal of this ticket is`, `in order to`, `as mentioned above`.

Rule-of-three lists where two items are real and the third is filler.

Hedges: `might`, `could potentially`, `it seems`, `appears to be` — unless the uncertainty is
the point, in which case name what would resolve it.

A closing paragraph that restates the ticket.

### Length

Problem 100–150 words. Goal one sentence. AC 4–6 bullets. Dev Notes 4–7 bullets.
Under one screen. If it runs longer, it is two tickets.

---

## What It Does

Turns a rough description into a ticket carrying the coordinates, dates, and verified facts its
assignee needs, so the work starts instead of stalling on questions.

## When to Use

- Filing any harness change — agents, skills, commands, hooks, scripts, docs.
- Splitting work that has grown past one screen into two tickets.
- Writing up something you just debugged, while the coordinates are still in front of you.

## Output

An issue in the tracker with four sections, and a branch name ready to use.

## See Also

- `CONTRIBUTING.md` — branch, commit, and PR conventions this hands off to.
- `.claude/commands/README.md` — the command index.
