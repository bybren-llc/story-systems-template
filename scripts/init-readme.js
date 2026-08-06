#!/usr/bin/env node
/**
 * init-readme.js — generate the project README from the local IMDb-style template.
 *
 * This used to be `npx @wtfb/cli init-readme`. That package ships no `templates/` directory,
 * so it threw "Template not found" and exited 1 on every invocation — every writer's first run
 * left README.md as the unmodified template (STO-39).
 *
 * The template lives in THIS repo (`templates/readme-imdb-style.md`) and the work is three
 * string substitutions, so depending on a remote package to render our own file was coupling
 * we did not need even before it broke.
 *
 * Zero-dependency, and shared by both init-project.sh and init-project.ps1 — one code path
 * instead of two implementations that can drift.
 *
 * Usage:
 *   node scripts/init-readme.js --title "My Screenplay" [--type screenplay] [--force] [--dry-run]
 *
 * Exit: 0 written (or dry-run), 1 error, 2 bad usage.
 * Refuses to overwrite a README that is not the shipped template unless --force, so it can
 * never destroy a writer's own README.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const TEMPLATE_PATH = path.join('templates', 'readme-imdb-style.md');
const README_PATH = 'README.md';
const TEMPLATE_MARKER = '<!-- wtfb:template-readme -->';

const TYPE_LABELS = {
  screenplay: 'Screenplay',
  novel: 'Novel',
  'film-production': 'Film Production',
};

function parseArgs(argv) {
  const out = { force: false, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--force') out.force = true;
    else if (a === '--dry-run') out.dryRun = true;
    else if (a === '--title') out.title = argv[++i];
    else if (a === '--type') out.type = argv[++i];
    else if (a.startsWith('--')) return { error: `Unknown flag: ${a}` };
  }
  return out;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.error) {
    console.error(args.error);
    process.exit(2);
  }
  if (!args.title) {
    console.error('Usage: node scripts/init-readme.js --title "Title" [--type screenplay] [--force] [--dry-run]');
    process.exit(2);
  }

  if (!fs.existsSync(TEMPLATE_PATH)) {
    console.error(`Template not found: ${TEMPLATE_PATH}`);
    process.exit(1);
  }

  // Never clobber a README the writer has made their own. The shipped template carries a
  // marker; its absence means someone has edited or replaced this file.
  if (fs.existsSync(README_PATH) && !args.force) {
    const existing = fs.readFileSync(README_PATH, 'utf8');
    if (!existing.includes(TEMPLATE_MARKER)) {
      console.error(`${README_PATH} is not the shipped template — refusing to overwrite it.`);
      console.error('Re-run with --force if replacing it is what you want.');
      process.exit(1);
    }
  }

  const typeLabel = TYPE_LABELS[args.type] || TYPE_LABELS.screenplay;
  const year = String(new Date().getFullYear());

  let content = fs.readFileSync(TEMPLATE_PATH, 'utf8');
  content = content.split('[Project Title]').join(args.title);
  content = content.split('[Project Type]').join(typeLabel);
  content = content.split('(Year)').join(`(${year})`);
  content = content.split(TEMPLATE_MARKER + '\n').join('');
  content = content.split(TEMPLATE_MARKER).join('');

  if (args.dryRun) {
    console.log(`[dry-run] would write ${README_PATH} (${content.length} bytes) for "${args.title}" (${typeLabel})`);
    process.exit(0);
  }

  fs.writeFileSync(README_PATH, content);
  console.log(`Wrote ${README_PATH} for "${args.title}" (${typeLabel})`);
  process.exit(0);
}

main();
