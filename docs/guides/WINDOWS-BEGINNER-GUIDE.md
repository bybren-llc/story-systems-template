<!-- wtfb:windows-beginner-guide -->
# Story Systems Template: Windows Beginner's Guide

Write your screenplay with an 11-person AI team, even if you have never used GitHub, a terminal,
or Claude Code before.

> **Who this guide is for**
>
> - You are on a **Windows 10 or 11** computer.
> - This is your first time using **GitHub**.
> - This is your first time using **Claude Desktop / Claude Code**.
> - You are not comfortable with the "terminal" (the black text window), and you would rather
>   click buttons.
>
> That is exactly who we wrote this for. We use graphical apps you click wherever possible, and
> when a command is unavoidable, you let Claude type it for you. You do not need to understand
> any code.
>
> **Time:** about 30 to 45 minutes the first time, most of it downloading and installing. After
> that, opening your project takes about 10 seconds.

If a word is unfamiliar (repo, clone, commit, terminal), jump to the
[Plain-English glossary](#plain-english-glossary) at the bottom. Nothing here assumes you already
know it.

---

## Table of contents

1. [The big picture (read this first)](#1-the-big-picture-read-this-first)
2. [What you need before you start](#2-what-you-need-before-you-start)
3. [Part A: Install the four tools (once)](#part-a-install-the-four-tools-once)
   - [A1. Get a paid Claude plan (required)](#a1-get-a-paid-claude-plan-required)
   - [A2. Install the Claude desktop app](#a2-install-the-claude-desktop-app)
   - [A3. Install Node.js (required)](#a3-install-nodejs-required)
   - [A4. Install Git for Windows (required)](#a4-install-git-for-windows-required)
   - [A5. Make a GitHub account and install GitHub Desktop](#a5-make-a-github-account-and-install-github-desktop)
4. [Part B: Make your own copy of the template on GitHub](#part-b-make-your-own-copy-of-the-template-on-github)
5. [Part C: Download your project to your PC](#part-c-download-your-project-to-your-pc)
6. [Part D: Open your project in Claude](#part-d-open-your-project-in-claude)
7. [Part E: Set up your project](#part-e-set-up-your-project)
8. [Part F: Start writing](#part-f-start-writing)
9. [Part G: Save your work back to GitHub](#part-g-save-your-work-back-to-github)
10. [Naming cheat-sheet (important)](#naming-cheat-sheet-important)
11. [Troubleshooting](#troubleshooting)
12. [Plain-English glossary](#plain-english-glossary)
13. [Where to go next](#where-to-go-next)

---

## 1. The big picture (read this first)

You are about to set up a creative writing workspace that comes pre-loaded with an AI team: a
Story Architect, a Dialogue Writer, a Script Supervisor, and eight more specialists. You talk to
them in plain English, and they help you write and format a professional screenplay.

To make that happen, four tools each do one job. Here is the whole system in one picture.

| The tool | What it is, in one line | Its job in your setup |
|---|---|---|
| **GitHub** (website) | An online locker for projects | Holds the master template, and later your own online backup |
| **GitHub Desktop** (app) | A click-button front-end for GitHub | Downloads your project to your PC and backs it up, with no typing |
| **Claude desktop app** | The Claude app, with a built-in **Code** mode | Where your AI writing team lives and does the work |
| **Node.js and Git** | Two small background tools | Quiet helpers the project needs. You install them once and forget them |

Here is the flow you are about to follow. Each step below is one of these arrows.

```text
Template on GitHub  ->  Your own copy on GitHub  ->  Downloaded to your PC
        (Part B)                (Part B)                   (Part C)

   ->  Opened in Claude  ->  Set up by Claude  ->  You start writing
           (Part D)             (Part E)             (Part F)
```

> **The one idea that makes this easy:** The Claude **Code** tab is not only a chat box. It can
> run the setup steps for you. So instead of learning commands, you open your project and type
> something like *"install the dependencies and initialize this project as a screenplay named
> my-first-script."* Claude does it while you watch.

---

## 2. What you need before you start

**Your computer:**

- A **Windows 10 (version 1809 or newer) or Windows 11** PC.
- About **2 to 3 GB of free disk space** and an internet connection.
- An **email address** you can receive mail at, for the GitHub and Claude accounts.

**Prerequisites you will set up in Part A (all one-time):**

| Prerequisite | Why it is needed | Free? |
|---|---|---|
| **Claude Pro or Max plan** | Claude Code (the "Code" tab) is not on the free plan | Paid |
| **Claude desktop app** | Runs your AI writing team with a graphical interface | Free app |
| **Node.js** | The template uses it to check your formatting and spelling | Free |
| **Git for Windows** | Claude's Code tab needs it to work on files on your PC | Free |
| **GitHub account + GitHub Desktop** | Stores your project online and downloads it to your PC | Free |

You only do Part A once, ever. After that you skip straight to opening your project.

> **Important prerequisite: Claude Code needs a paid Claude plan.**
>
> The free Claude plan does not include Claude Code (the "Code" tab). To use your AI writing team
> you need one of these paid plans:
>
> - **Claude Pro**, the usual choice for individual writers.
> - **Claude Max**, for more usage headroom if you write a lot.
> - Team or Enterprise also work, but Pro or Max is what most writers pick.
>
> You can start on Pro and upgrade later. See plans at <https://claude.com/pricing>. If you skip
> this, everything installs fine, but the **Code** tab shows an "upgrade" prompt instead of
> letting you work. We call this out again in [Part A1](#a1-get-a-paid-claude-plan-required).

---

## Part A: Install the four tools (once)

Do these five short steps in order. You never have to repeat Part A. Once these are on your PC,
you are set for every future project.

### A1. Get a paid Claude plan (required)

1. In a web browser, go to <https://claude.ai> and sign up (or log in) with your email.
2. Go to <https://claude.com/pricing> and subscribe to **Claude Pro** (recommended to start) or
   **Claude Max**.
3. That is it. The same login works in the desktop app you will install next.

> **Why this comes first:** if the plan is not active, the later steps still look like they work,
> but the **Code** tab will not open. Getting this out of the way now saves confusion.

### A2. Install the Claude desktop app

This is the app where your AI team works. It includes Claude Code built in, with a graphical
interface, so no terminal is required.

1. Go to <https://claude.com/download> in your browser.
2. Click the **Windows** download. A file like `Claude-Setup.exe` lands in your **Downloads**
   folder.
3. Double-click the downloaded file and follow the installer. You do not need to be an
   administrator.
4. When it finishes, open **Claude** from the **Start menu** and sign in with the same account
   you paid for in A1.
5. At the top of the app you will see three tabs: **Chat**, **Cowork**, and **Code**. You will
   use **Code** later. If clicking **Code** asks you to upgrade, your paid plan from A1 is not
   active yet, so fix that first.

> **Tip:** Do not worry about exploring yet. Just confirm you can sign in and that the **Code**
> tab does not demand an upgrade. We come back to it in Part D.

### A3. Install Node.js (required)

**Node.js** is a small free tool. The template uses it behind the scenes to check your formatting
and spelling. You install it once and never think about it again.

1. Go to <https://nodejs.org>.
2. Click the big button that says **LTS**, which means "the stable version" (for example
   "20.x.x LTS"). A file like `node-v20.x.x-x64.msi` downloads.
3. Double-click it and click **Next**, **Next**, **Install** all the way through. The defaults
   are correct, so do not change anything.
4. When it is done, click **Finish**.

> You will not see a new app in your Start menu, which is normal. Node.js works quietly in the
> background. It is separate from Claude. The Claude app has its own copy of Claude Code, but the
> template's helper tools need this one.

### A4. Install Git for Windows (required)

**Git** is the technology GitHub is built on. Claude's **Code** tab needs Git installed to work
on a project on your PC (a "Local" session). Install it once.

1. Go to <https://git-scm.com/downloads/win>.
2. Click the **64-bit Git for Windows Setup** download.
3. Double-click the downloaded file. The installer asks a lot of questions. You can safely click
   **Next** on every screen and accept all the defaults, then **Install**, then **Finish**. None
   of the options matter for what we are doing.

> You do not need to be an administrator, and you do not need to understand any of the Git
> screens. The defaults are fine.

### A5. Make a GitHub account and install GitHub Desktop

**GitHub** is the website that stores the template and, later, backs up your work. **GitHub
Desktop** is a friendly app that does all the GitHub steps with buttons instead of commands.

1. **Create a free GitHub account:** go to <https://github.com/signup> and follow the prompts
   (username, email, password). It is free.
2. **Install GitHub Desktop:** go to <https://desktop.github.com>, click **Download for
   Windows**, then double-click the downloaded `GitHubDesktopSetup.exe`.
3. Open **GitHub Desktop** and sign in with the GitHub account you just made. It may open a
   browser window to confirm, so click **Authorize**.

> **End of Part A checklist.** You should now have: a paid Claude plan, the **Claude** app
> (signed in), **Node.js**, **Git for Windows**, a **GitHub account**, and **GitHub Desktop**
> (signed in). If all five are done, you never touch Part A again.

---

## Part B: Make your own copy of the template on GitHub

You do not write inside the shared template. You make your own private copy of it first. GitHub
has a one-click button for exactly this.

1. In your browser, go to the template page:
   <https://github.com/bybren-llc/story-systems-template>
2. Near the top-right, click the green **Use this template** button, then choose **Create a new
   repository**. ("Repository," or "repo," is just GitHub's word for one project folder. See the
   [glossary](#plain-english-glossary).)
3. On the "Create a new repository" screen:
   - **Repository name:** type a name for your screenplay project. Use all lowercase letters and
     hyphens instead of spaces, for example `my-first-script` or `midnight-diner`. See the
     [Naming cheat-sheet](#naming-cheat-sheet-important), because this matters.
   - **Owner:** leave it as your own username.
   - **Public or Private:** choose **Private** if you want your script kept to yourself
     (recommended for creative work). **Public** means anyone can see it.
   - Leave **"Include all branches"** unchecked.
4. Click **Create repository**. After a few seconds, GitHub shows your new copy. The web address
   will be `github.com/YOUR-USERNAME/my-first-script`.

> **What just happened:** you now own a complete, private copy of the whole AI-writing template.
> The original stays untouched, and you will only ever change your copy.

---

## Part C: Download your project to your PC

Your project lives online right now. To write on your computer, you "clone" it, which is GitHub's
word for downloading a working copy. GitHub Desktop does this with two clicks.

1. On your new repository's GitHub page, click the green **&lt; &gt; Code** button, then click
   **Open with GitHub Desktop**. Your browser may ask "Open GitHub Desktop?", so click **Open**.
2. GitHub Desktop opens a **Clone a repository** window:
   - **Local path** is where the folder will live on your PC. The default (something like
     `C:\Users\YourName\Documents\GitHub\my-first-script`) is fine. Remember this location,
     because that is where your screenplay will be.
   - Click **Clone**.
3. GitHub Desktop may ask how you are planning to use this repository. Choose **For my own
   purposes** and click **Continue**.

Your project files are now on your PC in that folder. Keep GitHub Desktop open, because you will
use it again in Part G to save your work.

> No terminal and no `git clone` command needed. GitHub Desktop did it all. If you ever want to
> find the folder later, click **Repository**, then **Show in Explorer** in GitHub Desktop.

---

## Part D: Open your project in Claude

Now we bring in your AI team.

1. Open the **Claude** desktop app from the Start menu.
2. Click the **Code** tab at the top center.
3. When it asks how to run, choose **Local**, which means "work on the files on my own PC."
4. Click **Select folder** and navigate to the folder GitHub Desktop created in Part C, for
   example `C:\Users\YourName\Documents\GitHub\my-first-script`. Select it and confirm.
5. Near the send button there is a model dropdown. The default is fine, and you can change it
   later.

You now have your project open with Claude Code. The big text box at the bottom is where you talk
to your AI team.

> **You are always in control.** The Code tab starts in "Manual mode." Claude shows you every
> change and waits for you to click **Accept** or **Reject** before anything happens to your
> files. Nothing is edited or run without your approval.

---

## Part E: Set up your project

Your folder is a fresh copy of the template. Two small things need to happen once: install the
helper tools, and "initialize" the project, which names it and creates your blank screenplay
file. You will not type any commands. You ask Claude to do it.

### The easy way: ask Claude to do it

In the message box at the bottom of the **Code** tab, type this (change the name to your project,
using lowercase with hyphens), then press **Enter**:

```text
Please set up this project for me. First run "npm install" to install the
dependencies, then run the Windows initializer script to initialize it as a
screenplay project named my-first-script. Show me each command before you run it.
```

Claude will propose running `npm install` and then the setup script
(`.\scripts\init-project.ps1`). Because you are in **Manual mode**, it shows you each step and
waits, so click **Accept** or **Run** to let each one proceed. When it asks about the project
type, the answer is **screenplay** (option 1), the only type that is ready today.

When it finishes, Claude will have created your personal files, including:

- `my-first-script.fountain`, your actual screenplay (it starts almost blank, ready for you).
- `templates/beat-sheet.md` and `templates/character-registry.md`, your planning docs.
- A personalized `README.md` and project settings with your project's name.

> **About the name you chose:** the setup takes your hyphenated name and makes two things from
> it. `my-first-script` becomes the file `my-first-script.fountain`, and it becomes the on-screen
> title "My First Script" (each word capitalized). That is why the name should be lowercase with
> hyphens. See the [Naming cheat-sheet](#naming-cheat-sheet-important).
>
> **If you see "CLAUDE.md (copy: symlink requires Developer Mode)":** that is a normal, harmless
> Windows message. Everything works exactly the same, so you can ignore it.

### The manual way (only if you prefer to run it yourself)

You can also run the two steps in the app's built-in terminal:

1. Open the integrated terminal with **Ctrl** + **`** (the backtick key, top-left of your
   keyboard, under **Esc**). A command area appears inside Claude.
2. Type this and press **Enter**:

   ```powershell
   npm install
   ```
3. When it finishes, type this and press **Enter**:

   ```powershell
   .\scripts\init-project.ps1
   ```
   - If Windows blocks it with a red "execution policy" message, run this instead:

     ```powershell
     PowerShell -ExecutionPolicy Bypass -File .\scripts\init-project.ps1
     ```
   - It will ask for a project name. Type your lowercase-hyphenated name (for example
     `my-first-script`) and press **Enter**.
   - It will ask for a project type. Press **Enter** to accept **screenplay** (the default,
     option 1).

The easy way above is what this whole system is designed for, so letting Claude run the setup is
the intended experience.

---

## Part F: Start writing

Your AI team is ready. You steer it two ways, both in the same message box.

### 1. Slash commands (type `/`)

Type a forward slash `/` in the message box and a menu of commands pops up. Or click the **+**
button, then **Slash commands**, to browse them. A few to start with:

| Type this | What it does |
|---|---|
| `/start-scene A tense diner argument at midnight` | Begins a new scene with the right setup |
| `/writers-room` | Convenes the AI team to brainstorm your story before you write |
| `/check-format` | Checks your screenplay is correctly formatted |
| `/scene-list` | Lists every scene with a page estimate |
| `/export-pdf` | Turns your script into a professional PDF |
| `/stuck` | Looks at where you are and suggests what to do next |

> **New to all this?** Type `/stuck`, or just say, in plain English, "I'm new here, help me start
> my first scene." The AI team is built to guide beginners.

### 2. Plain English

You do not have to use commands at all. You can simply type things like:

- "Help me brainstorm a logline for a heist movie set in a bakery."
- "Write an opening scene: a lighthouse keeper finds a message in a bottle."
- "Read my beat sheet and tell me if Act Two is too slow."

Every change Claude makes to a file is shown to you first, in that diff view with **Accept** and
**Reject** buttons. Nothing happens to your screenplay without your approval.

---

## Part G: Save your work back to GitHub

As you write, your changes are on your PC. To keep a safe online backup, and to be able to work
from another computer later, you save them back to GitHub. There are two easy ways.

### Easiest: ask Claude

In the **Code** tab, just type:

```text
Please save my work: commit these changes with a short message describing them,
then push to GitHub.
```

Claude will show you what it is doing and back up your work online.

### Or use GitHub Desktop (buttons only)

1. Switch to the **GitHub Desktop** app. On the left you will see the files you changed.
2. At the bottom-left, type a short note in the **Summary** box, for example "Wrote opening diner
   scene."
3. Click **Commit to main**. Commit means "save a snapshot."
4. Click **Push origin** at the top. Push means "upload the snapshot to GitHub."

> Do this whenever you finish a writing session. It is your undo history and your backup in one.
> If your PC ever dies, your screenplay is safe on GitHub.

**To come back tomorrow:** just open the **Claude** app, click the **Code** tab, and your project
is remembered (or click **Select folder** again). Then keep writing. That is the 10-second daily
routine.

---

## Naming cheat-sheet (important)

Getting names right up front avoids confusing errors later. There are three names, and the
simplest life is to make them all the same lowercase-hyphenated word.

| Where | What to type | Good example | Avoid |
|---|---|---|---|
| **GitHub repository name** (Part B) | Your project name | `midnight-diner` | `Midnight Diner`, `Midnight_Diner!` |
| **Local folder name** (Part C) | Usually auto-matches the repo | `midnight-diner` | spaces, symbols |
| **Project name in setup** (Part E) | The same word again | `midnight-diner` | `Midnight Diner` |

The golden rules for the project name:

- Use all lowercase, for example `midnight-diner`.
- Use hyphens (`-`) instead of spaces, so not `midnight diner`.
- Use letters and numbers only, so no `!`, `@`, `.`, `'`, or `/`.
- No spaces, no capitals, and no punctuation.

Here is what the setup makes from your name, so you can see why it matters. If you enter
`midnight-diner`, the system creates the file `midnight-diner.fountain` and sets your screenplay's
display title to "Midnight Diner" (it capitalizes each word for you). You can always change the
on-screen title later inside the `.fountain` file. The folder and file name are simplest to just
get right once.

---

## Troubleshooting

Common first-timer bumps on Windows, and the fix for each.

**The "Code" tab tells me to upgrade.**
Your paid Claude plan is not active. Revisit [A1](#a1-get-a-paid-claude-plan-required) and
subscribe to **Pro** or **Max** at <https://claude.com/pricing>, then restart the Claude app.

**"Select folder" or the Local session will not start, or it mentions Git.**
Git is not installed. Do [A4](#a4-install-git-for-windows-required), then fully close and reopen
the Claude app.

**`npm` is not recognized, or "npm is not installed."**
Node.js is not installed, or the app was open before you installed it. Do
[A3](#a3-install-nodejs-required), then completely close and reopen the Claude app so it sees the
new tool, and try Part E again.

**The setup script is blocked by a red "execution policy" message.**
Windows is being cautious about scripts. Use this version of the command (Claude can run it for
you, or you can type it in the integrated terminal):

```powershell
PowerShell -ExecutionPolicy Bypass -File .\scripts\init-project.ps1
```

**I see "CLAUDE.md (copy: symlink requires Developer Mode)."**
This is normal on Windows, and the copy works identically, so there is nothing to fix. If you
want the tidier version, Windows **Settings**, then **System**, then **For developers**, then
**Developer Mode: On** enables it, but it is purely cosmetic.

**"git is not recognized" in the terminal.**
Git was installed but the app was already open. Close and reopen the Claude app (and GitHub
Desktop) so they pick up Git.

**A command seems stuck, or I am lost.**
In the **Code** tab you can always type, in plain English, "that didn't work, here's what I see:
[paste the message]. What should I do?" Claude reads the message and walks you through it.

**I accidentally changed something I did not mean to.**
Nothing is permanent until you commit (Part G). In GitHub Desktop you can right-click a changed
file and choose **Discard changes** to undo it.

**Reset everything and start the install fresh.**
Node, Git, GitHub Desktop, and Claude are all normal Windows programs. Uninstall from
**Settings**, then **Apps**, and redo Part A. Your writing lives in your project folder and on
GitHub, separate from the apps.

---

## Plain-English glossary

You do not need these to follow the guide, but here is what the jargon means.

- **Terminal (also called the command line or CLI):** the plain text window where you type
  commands instead of clicking. This guide avoids it, and when it is needed, Claude types the
  commands for you.
- **GitHub:** a website that stores projects online, like a locker with version history.
- **Repository ("repo"):** GitHub's word for one project, meaning a folder of files plus its
  history.
- **Template:** a ready-made starter repo you copy to begin your own. That is what this whole
  system is.
- **Clone:** to download a working copy of a repo onto your PC (Part C). GitHub Desktop does it
  with a button.
- **Commit:** to save a snapshot of your changes, with a short note (Part G).
- **Push:** to upload your saved snapshots to GitHub so there is an online backup (Part G).
- **Claude Code (the "Code" tab):** the mode of the Claude app that can read your files, write,
  and run setup steps. It is your AI writing team's workshop.
- **Slash command:** a shortcut you trigger by typing `/` (like `/start-scene`) to run a built-in
  task.
- **Node.js and npm:** the background tool, and its installer, that the template uses to check
  your work. Install once, ignore forever.
- **Git:** the underlying version-tracking technology that GitHub and GitHub Desktop are built
  on.
- **Fountain (a `.fountain` file):** a simple text format for screenplays. Your script is a
  `.fountain` file, and you mostly let the AI team handle the formatting.
- **Diff:** a "before and after" view of a change, with **Accept** and **Reject** buttons.

---

## Where to go next

Once you are writing, these files (already in your project) go deeper:

- `AGENTS.md`: meet all 11 members of your AI team and what each one does.
- `docs/QUICKSTART.md`: the standard quick-start, which also covers Mac, Linux, and terminal
  users.
- `docs/REFERENCE.md`: the full list of commands.
- `docs/WORKFLOW.md`: how the writing and branching workflow works as you grow.
- `CLAUDE.md`: the instructions your AI team follows, which is good to skim once you are curious.

Any time you are unsure, remember the one move that always works: open the Code tab and ask, in
plain English. That is the whole point of this system.

---

<p align="center">
  <strong>Words To Film By</strong>: "Your creative AI team, ready to work."<br>
  Harness by J. Scott Graham / Bybren LLC
</p>
