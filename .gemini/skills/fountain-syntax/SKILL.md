---
name: fountain-syntax
description: |
  Complete Fountain screenplay format syntax reference.
  Covers scene headings, action, character names, dialogue, parentheticals,
  transitions, dual dialogue, notes, title page, emphasis, and page breaks.

  Use when: writing or editing .fountain files, validating screenplay format,
  converting between formats, or teaching Fountain syntax.
---

# Fountain Syntax

## Overview
Fountain is a plain text markup language for writing screenplays. Files use the `.fountain` extension.

## Core Elements

### Scene Headings
```fountain
INT. COFFEE SHOP - DAY
EXT. CITY STREET - NIGHT
INT./EXT. CAR (MOVING) - CONTINUOUS
```

Must begin with `INT`, `EXT`, or `INT./EXT.` followed by location and time of day.

### Action
Plain paragraphs become action/description:
```fountain
Sarah enters the crowded coffee shop, scanning the room. She spots MIKE at a corner table.
```

### Character Names
Character names in ALL CAPS on their own line:
```fountain
SARAH
Hello, Mike. It's been a while.
```

### Dialogue
Follows character name, indented automatically:
```fountain
MIKE
(surprised)
Sarah? I didn't expect to see you here.
```

### Parentheticals
Direction within dialogue, in parentheses:
```fountain
SARAH
(sitting down)
We need to talk.
```

### Transitions
End with `TO:` or force with `>`:
```fountain
CUT TO:

> FADE OUT.
```

### Dual Dialogue
Use `^` for simultaneous speech:
```fountain
SARAH
I can't believe you—

MIKE ^
Let me explain—
```

### Notes
```fountain
[[This is a production note]]

/* This is a hidden comment */
```

### Title Page
```fountain
Title: SCREENPLAY TITLE
Credit: Written by
Author: Writer Name
Draft date: January 2025
```

## Scene Numbers
Force scene numbers with `#`:
```fountain
INT. OFFICE - DAY #1#
```

## Emphasis
```fountain
*italics*
**bold**
***bold italics***
_underline_
```

## Page Breaks
Three or more equal signs:
```fountain
===
```
