---
description: Welcome a new user and help them set up their screenplay project.
---

# /start-project

Welcome a new user and help them set up their screenplay project.

## Arguments
- `[title]` - Optional: The screenplay title

## Workflow

### Step 1: Welcome Message

Display a friendly welcome:

```
------------------------------------------------------------
              Welcome to Your Screenplay Workspace
------------------------------------------------------------

I'm here to help you:
  - Set up your screenplay
  - Write in industry-standard format
  - Track your progress
  - Export to PDF, Final Draft, and more

Let's get you started!
------------------------------------------------------------
```

### Step 2: Entry Point Detection

Ask what they're starting with:

```
What are you starting with today?

  1. Starting fresh - I have an idea but no pages yet
  2. Existing screenplay - I have a script file (FDX, PDF, Word, or Fountain)
  3. Notes or outline - I have notes, a treatment, or beat sheet
  4. Photos of pages - I have handwritten or printed materials
  5. Continuing work - I've already started a project here

Just type a number or describe what you have!
```

### Step 3: Branch by Entry Point

#### Option 1: Starting Fresh

1. Ask for screenplay title
2. Ask for logline (optional - can skip)
3. Ask for main character name (optional - can skip)
4. Create complete workspace from template:
   - Initialize git silently
   - Copy all files from `resources/workspace/`:
     - `.github/workflows/validate.yml` - CI/CD automation
     - `.github/PULL_REQUEST_TEMPLATE.md` - PR review checklist
     - `docs/CONTRIBUTING.md` - Collaboration guide
     - `scripts/validate-fountain.js` - Fountain validator
     - `templates/` - Beat sheet, character registry
     - `.cspell/project-words.txt` - Custom dictionary
     - `.markdownlint-cli2.yaml` - Lint config
   - Create from templates:
     - `CLAUDE.md` from `CLAUDE.md.template`
     - `package.json` from `package.json.template`
     - `cspell.json` from `cspell.json.template`
     - `[title-slug].fountain` from `screenplay.fountain.template`
   - Create empty directories:
     - `source-materials/`
     - `exports/pdf/`, `exports/fdx/`, `exports/html/`
     - `patterns/`
   - Run `npm install` silently
   - Run `npx wtfb init-readme --title "[title]"` to generate project README

Display completion:
```
Your workspace is ready!

Created:
  [title].fountain     Your screenplay with title page
  README.md            Project info page (IMDb style)
  CLAUDE.md            AI assistant instructions
  package.json         Validation scripts (installed)

  .github/             CI/CD and PR templates
  docs/                Collaboration guide
  templates/           Beat sheets, character registry
  scripts/             Validation tools

What's next?
  /start-scene    Begin writing your first scene
  Just tell me    Describe your opening and I'll format it

Tip: Just describe what you see on screen. I'll handle the formatting!

Working with others? Check docs/CONTRIBUTING.md for the collaboration workflow.
```

#### Option 2: Existing Screenplay

Redirect to `/import` command:
```
Great! Let's bring in your existing script.

Running /import to help you bring in your file...
```

Then invoke `/import`.

#### Option 3: Notes or Outline

1. Ask user to paste or share their notes
2. Read and analyze the content using Story Analyst approach:
   - Identify story beats
   - Extract character names
   - Map structure elements
3. Create project with:
   - Beat sheet populated from notes
   - Character list extracted
   - Screenplay file ready

Display:
```
I've analyzed your notes!

Found:
  - Story beats: [X] key moments identified
  - Characters: [list names]
  - Suggested opening: [brief description]

Created:
  [title].fountain - Ready for your first scene
  beat-sheet.md - Your story structure mapped out

Ready to start writing?
  /start-scene    Begin with your opening scene
  Tell me more    Let's discuss the structure first
```

#### Option 4: Photos of Pages

1. Ask user for image path(s)
2. Read each image and transcribe content
3. Detect if screenplay format or notes
4. Convert to Fountain format
5. Show preview for confirmation

Display:
```
Transcribing your pages...

I found:
  - [X] pages of content
  - [Y] scenes
  - [Z] characters

Preview:
------------------------------------------------------------
[First 10-15 lines of transcribed content]
------------------------------------------------------------

Does this look right?
  Yes, save it      Create the screenplay file
  Show more         See the full transcription
  Fix something     Tell me what needs correcting
```

#### Option 5: Continuing Work

1. Scan for existing `.fountain` files
2. Read screenplay and analyze state
3. Show current status

Display:
```
Welcome back!

"[Screenplay Title]"
  Pages: ~[X]
  Scenes: [Y]
  Last scene: [Scene heading]

Pick up where you left off:
  /start-scene        Continue writing
  /scene-list         See all your scenes
  /analyze-structure  Check your structure

What would you like to work on?
```

### Step 4: Silent Git Setup

For new projects (Options 1, 3, 4):
- Run `git init` silently (no output to user)
- Create initial commit with message: "Initial screenplay setup"
- User never sees git commands

### Step 5: Confirm Next Steps

Always end with 2-3 clear options for what to do next.

## Success Criteria
- [ ] User understands what the workspace does
- [ ] Appropriate project structure created
- [ ] Git initialized silently
- [ ] User knows their immediate next step
- [ ] No technical jargon shown to user

## Example

```
User: /start-project