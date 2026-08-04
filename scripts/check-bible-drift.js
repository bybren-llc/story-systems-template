#!/usr/bin/env node
/**
 * WTFB Story Bible Drift Checker
 *
 * A card records the manuscript paths it describes (`sources`) and the commit SHA
 * its claims were verified at (`verified_against`, mirrored by the vault
 * `baseline_sha`). When a source file changes after that baseline, the card is
 * STALE — its claims may no longer match the manuscript.
 *
 * This tool diffs changed paths against each manifest concept's `sources` and
 * reports the stale cards. Report-only by default (exit 0); pass --strict to exit
 * non-zero when any card is stale (so CI can require a scene edit to be paired
 * with a bumped timestamp/verified_against on the affected card).
 *
 * Determining changed paths (in priority order):
 *   --paths a.fountain,b.md   explicit list (the flag forces explicit mode even
 *                             when the list is empty — it never falls through to git)
 *   --since <sha>             git diff <sha>..HEAD
 *   else manifest.baseline_sha
 *
 * SECURITY: the `since` value can come from repo data (manifest.baseline_sha) or a
 * flag, so it is validated as a git SHA (^[0-9a-f]{7,40}$) BEFORE use, and git is
 * invoked with `--end-of-options` before the range. Together these close both shell
 * injection (arg array) AND git option injection (a `since` like `--output=…` that
 * would otherwise be parsed as an option). git is invoked via execFileSync with an
 * argument array — never a shell string.
 *
 * Usage:
 *   node scripts/check-bible-drift.js [--strict] [--since <sha>] [--paths a,b] [--vault <dir>]
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const C = { red: '\x1b[31m', yellow: '\x1b[33m', green: '\x1b[32m', gray: '\x1b[90m', reset: '\x1b[0m' };
const SHA_RE = /^[0-9a-f]{7,40}$/;

function findRepoRoot(start) {
  let dir = start;
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, '.git'))) return dir;
    dir = path.dirname(dir);
  }
  return start;
}

// Return the token after `flag`, or undefined if it is missing / is another flag.
function argValue(flag) {
  const i = process.argv.indexOf(flag);
  if (i === -1) return undefined;
  const next = process.argv[i + 1];
  if (next === undefined || next.startsWith('-')) return undefined;
  return next;
}

function readJson(file, exitCode) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    console.error(`${C.red}Invalid JSON in ${file}: ${e.message}${C.reset}`);
    process.exit(exitCode);
  }
}

// minimal glob -> RegExp for watch_list_exclusions ("a/**", "b/*.md")
function globToRegExp(glob) {
  let re = '';
  for (let i = 0; i < glob.length; i++) {
    const c = glob[i];
    if (c === '*') {
      if (glob[i + 1] === '*') { re += '.*'; i++; if (glob[i + 1] === '/') i++; }
      else re += '[^/]*';
    } else if (c === '?') re += '[^/]';
    else if ('.+^${}()|[]\\'.includes(c)) re += '\\' + c;
    else re += c;
  }
  return new RegExp('^' + re + '$');
}

function main() {
  const strict = process.argv.includes('--strict') || process.env.BIBLE_STRICT === '1';
  const softExit = strict ? 1 : 0;
  const repoRoot = findRepoRoot(process.cwd());
  const vaultArg = argValue('--vault');
  const vaultDir = vaultArg ? path.resolve(vaultArg) : path.join(repoRoot, 'story-bible');

  const cfgPath = path.join(vaultDir, '_meta', 'vault-config.json');
  const manifestPath = path.join(vaultDir, '_meta', 'manifest.json');
  if (!fs.existsSync(manifestPath)) { console.log('No manifest.json — nothing to drift-check.'); process.exit(0); }
  const cfg = (fs.existsSync(cfgPath) ? readJson(cfgPath, softExit) : {}) || {};
  const manifest = readJson(manifestPath, softExit);
  if (manifest == null || typeof manifest !== 'object' || Array.isArray(manifest) || !Array.isArray(manifest.concepts)) {
    console.error(`${C.red}manifest.json: "concepts" must be an array.${C.reset}`);
    process.exit(softExit);
  }
  const concepts = manifest.concepts.filter((c) => c && typeof c === 'object');

  // 1. determine changed paths
  let changed;
  if (process.argv.includes('--paths')) {
    // explicit mode — never falls through to git, even when the list is empty
    const raw = argValue('--paths');
    changed = (raw || '').split(',').map((s) => s.trim()).filter(Boolean);
  } else {
    const since = argValue('--since') || manifest.baseline_sha;
    if (!since) { console.log('No --since and no baseline_sha in manifest — nothing to compare.'); process.exit(0); }
    // SECURITY: reject anything that is not a bare git SHA before it reaches git,
    // so a crafted baseline_sha/--since cannot be parsed by git as an option.
    if (!SHA_RE.test(since)) {
      console.error(`${C.red}Refusing to diff: "since" is not a valid git SHA: ${since}${C.reset}`);
      process.exit(softExit);
    }
    try {
      const out = execFileSync('git', ['diff', '--name-only', '--end-of-options', `${since}..HEAD`], { cwd: repoRoot, encoding: 'utf8' });
      changed = out.split('\n').map((s) => s.trim()).filter(Boolean);
    } catch (e) {
      const detail = (e && e.stderr && e.stderr.toString().trim()) || (e && e.message) || 'unknown error';
      console.error(`${C.red}git diff failed for ${since}: ${detail}${C.reset}`);
      process.exit(softExit);
    }
  }

  // 2. drop excluded paths
  const exclusions = (cfg.watch_list_exclusions || []).map(globToRegExp);
  changed = changed.filter((p) => !exclusions.some((re) => re.test(p)));

  // 3. reverse index: a concept is stale if any changed path matches one of its sources
  const changedSet = new Set(changed);
  const isChanged = (src) => changedSet.has(src) || changed.some((p) => p === src || p.startsWith(src.replace(/\/$/, '') + '/'));

  const stale = [];
  for (const c of concepts) {
    const hits = (c.sources || []).filter(isChanged);
    if (hits.length) stale.push({ id: c.id, path: c.path, hits });
  }

  // 4. report
  console.log(`Drift check: ${changed.length} changed path(s), ${concepts.length} concept(s).\n`);
  if (!stale.length) {
    console.log(`${C.green}No stale cards — the Story Bible is in sync.${C.reset}`);
    process.exit(0);
  }
  console.log(`${C.yellow}STALE CARDS (re-verify against the manuscript, then bump timestamp + verified_against):${C.reset}`);
  for (const s of stale) {
    console.log(`  ${C.yellow}${s.id}${C.reset} (${s.path})`);
    for (const h of s.hits) console.log(`    ${C.gray}changed source: ${h}${C.reset}`);
  }
  console.log(`\n${stale.length} stale card(s).`);
  process.exit(strict ? 1 : 0);
}

main();
