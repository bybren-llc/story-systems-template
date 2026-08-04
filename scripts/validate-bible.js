#!/usr/bin/env node
/**
 * WTFB Story Bible Validator
 *
 * Structural gate for the story-bible/ knowledge vault. Enforces the contract in
 * story-bible/_meta/vault-config.json:
 *   - required frontmatter fields (incl. sources + verified_against)
 *   - type / status / tags / domain come from the controlled vocabularies
 *   - description length, timestamp format, verified_against is a git SHA
 *   - cited paths (sources, docs) exist on disk
 *   - resource_required types have at least one source
 *   - the card's ## sections match its type (order-sensitive), exactly one # H1
 *   - link rules: no wikilinks / leading-slash / repo-file (blob/raw) URLs; out-of-bundle
 *     links only under "Appears In"; bundle-internal links resolve
 *   - manifest sync (every card in the manifest and vice versa)
 *
 * Zero runtime deps (node builtins only). Advisory by default (exit 0); pass
 * --strict (or BIBLE_STRICT=1) to exit non-zero on errors.
 *
 * Usage:
 *   node scripts/validate-bible.js [--strict] [--vault <dir>]
 */

const fs = require('fs');
const path = require('path');

const C = { red: '\x1b[31m', yellow: '\x1b[33m', green: '\x1b[32m', gray: '\x1b[90m', reset: '\x1b[0m' };

function findRepoRoot(start) {
  let dir = start;
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, '.git'))) return dir;
    dir = path.dirname(dir);
  }
  return start;
}

function realpath(p) {
  try { return fs.realpathSync(p); } catch (e) { return p; }
}

// Return the token after `flag`, or undefined if it is missing / is another flag.
function argValue(flag) {
  const i = process.argv.indexOf(flag);
  if (i === -1) return undefined;
  const next = process.argv[i + 1];
  if (next === undefined || next.startsWith('-')) return undefined;
  return next;
}

function readJson(file, repoRoot, exitCode) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    console.error(`${C.red}Invalid JSON in ${path.relative(repoRoot, file)}: ${e.message}${C.reset}`);
    process.exit(exitCode);
  }
}

// Walk a directory tree, returning all files (skips .git / node_modules).
function walk(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function unquote(s) {
  const m = s.match(/^"([\s\S]*)"$/) || s.match(/^'([\s\S]*)'$/);
  return m ? m[1] : s;
}

// Quote-aware split of an inline list body (the text between [ and ]).
function splitInlineList(body) {
  const out = [];
  let cur = '';
  let quote = null;
  for (const ch of body) {
    if (quote) { if (ch === quote) quote = null; else cur += ch; }
    else if (ch === '"' || ch === "'") quote = ch;
    else if (ch === ',') { out.push(cur.trim()); cur = ''; }
    else cur += ch;
  }
  out.push(cur.trim());
  return out.filter((s) => s !== '');
}

// Minimal YAML-subset frontmatter parser: scalars, quoted strings, inline [a, b]
// lists (quote-aware), and two-space block lists.
function parseFrontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { fm: null, body: raw };
  const fm = {};
  let curKey = null;
  for (const line of m[1].split('\n')) {
    if (line.trim() === '' || line.trim().startsWith('#')) continue;
    const kv = line.match(/^([A-Za-z_][A-Za-z0-9_-]*):\s?(.*)$/);
    const item = line.match(/^\s+-\s+(.*)$/);
    if (kv) {
      curKey = kv[1];
      const val = kv[2].trim();
      if (val === '') fm[curKey] = [];
      else if (val.startsWith('[') && val.endsWith(']')) fm[curKey] = splitInlineList(val.slice(1, -1));
      else fm[curKey] = unquote(val);
    } else if (item && curKey) {
      if (!Array.isArray(fm[curKey])) fm[curKey] = [];
      fm[curKey].push(unquote(item[1].trim()));
    }
  }
  return { fm, body: m[2] };
}

function validateCard(file, rel, cfg, repoRoot, bundleBase, manifestIds) {
  const errors = [];
  const warnings = [];
  const raw = fs.readFileSync(file, 'utf8');
  const { fm, body } = parseFrontmatter(raw);

  if (!fm) { errors.push('missing YAML frontmatter'); return { errors, warnings }; }

  // required fields
  for (const f of cfg.frontmatter.required) {
    const v = fm[f];
    const empty = v === undefined || v === null || v === '' || (Array.isArray(v) && v.length === 0);
    if (empty) errors.push(`missing required frontmatter: ${f}`);
  }
  // list-typed fields must actually be lists
  for (const f of ['tags', 'sources']) {
    if (fm[f] !== undefined && !Array.isArray(fm[f])) errors.push(`${f} must be a list`);
  }
  // type / status / tags / domain vocabularies
  if (fm.type && !cfg.types[fm.type]) errors.push(`unknown type: ${fm.type}`);
  if (fm.status && !cfg.statuses.includes(fm.status)) errors.push(`invalid status: ${fm.status}`);
  if (Array.isArray(fm.tags)) for (const t of fm.tags) if (!cfg.tags.includes(t)) errors.push(`tag not in vocabulary: ${t}`);
  if (fm.domain && !cfg.domains.includes(fm.domain)) errors.push(`domain not in vocabulary: ${fm.domain}`);
  // scalar shape checks
  if (typeof fm.description === 'string' && fm.description.length > cfg.frontmatter.max_description_length) {
    errors.push(`description exceeds ${cfg.frontmatter.max_description_length} chars (${fm.description.length})`);
  }
  if (fm.timestamp && !/^\d{4}-\d{2}-\d{2}$/.test(fm.timestamp)) errors.push(`timestamp must be YYYY-MM-DD: ${fm.timestamp}`);
  if (fm.verified_against && !/^[0-9a-f]{7,40}$/.test(fm.verified_against)) {
    errors.push(`verified_against must be a git SHA: ${fm.verified_against}`);
  }
  // unrecognized keys
  const known = new Set([...cfg.frontmatter.required, ...cfg.frontmatter.optional]);
  for (const k of Object.keys(fm)) if (!known.has(k)) warnings.push(`unrecognized frontmatter key: ${k}`);

  // path fields exist (verified_against is a SHA, never a path)
  for (const field of cfg.frontmatter.path_fields) {
    for (const p of (Array.isArray(fm[field]) ? fm[field] : fm[field] ? [fm[field]] : [])) {
      if (/^https?:\/\//.test(p)) continue;
      if (!fs.existsSync(path.resolve(repoRoot, p))) errors.push(`${field} path does not exist: ${p}`);
    }
  }

  // type contract: resource_required, sections, single H1
  const typeDef = fm.type && cfg.types[fm.type];
  if (typeDef) {
    if (typeDef.resource_required) {
      const has = Array.isArray(fm.sources) ? fm.sources.length > 0 : !!fm.sources;
      if (!has) errors.push(`type "${fm.type}" requires at least one source`);
    }
    if (!typeDef.internal) {
      const got = [...body.matchAll(/^##\s+(.+?)\s*$/gm)].map((x) => x[1]);
      if (JSON.stringify(got) !== JSON.stringify(typeDef.sections)) {
        errors.push(`sections ${JSON.stringify(got)} != expected ${JSON.stringify(typeDef.sections)}`);
      }
      const h1 = [...body.matchAll(/^#\s+(.+)$/gm)];
      if (h1.length !== 1) errors.push(`expected exactly one H1, found ${h1.length}`);
    }
  }

  // line budget
  const lineCount = raw.split('\n').length;
  if (lineCount > cfg.max_concept_lines) {
    warnings.push(`card is ${lineCount} lines (> ${cfg.max_concept_lines}); summarize and cite instead`);
  }

  // link rules — walk body tracking the current ## section
  const appearsIn = cfg.link_rules.external_repo_links_only_under;
  let section = null;
  for (const line of body.split('\n')) {
    const h2 = line.match(/^##\s+(.+?)\s*$/);
    if (h2) { section = h2[1]; continue; }
    if (/\[\[[^\]]+\]\]/.test(line)) errors.push('wikilinks are not allowed');
    for (const lk of line.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      const target = lk[1].trim();
      if (/^https?:\/\//.test(target)) {
        // only repo-FILE URLs are forbidden (blob/raw); issue/PR/homepage links are fine
        if (/\/blob\/|\/raw\/|raw\.githubusercontent\.com/.test(target)) {
          errors.push(`repo-file URL (use a relative path instead): ${target}`);
        }
        continue;
      }
      if (target.startsWith('/')) { errors.push(`leading-slash path not allowed: ${target}`); continue; }
      const abs = path.resolve(path.dirname(file), target.split('#')[0]);
      const insideBundle = abs === bundleBase || abs.startsWith(bundleBase + path.sep);
      if (!fs.existsSync(abs)) errors.push(`broken link: ${target}`);
      if (!insideBundle && section !== appearsIn) {
        errors.push(`out-of-bundle link outside "${appearsIn}" section: ${target}`);
      }
    }
  }

  // manifest membership
  const id = rel.replace(/\.md$/, '');
  if (manifestIds && !manifestIds.has(id)) errors.push(`card not registered in manifest.json: ${id}`);

  return { errors, warnings };
}

function main() {
  const strict = process.argv.includes('--strict') || process.env.BIBLE_STRICT === '1';
  const softExit = strict ? 1 : 0;
  const repoRoot = realpath(findRepoRoot(process.cwd()));
  const vaultArg = argValue('--vault');
  const vaultDir = realpath(vaultArg ? path.resolve(vaultArg) : path.join(repoRoot, 'story-bible'));

  if (!fs.existsSync(vaultDir)) { console.log('No story-bible/ vault found — nothing to validate.'); process.exit(0); }

  const cfgPath = path.join(vaultDir, '_meta', 'vault-config.json');
  if (!fs.existsSync(cfgPath)) { console.error(`${C.red}Missing ${path.relative(repoRoot, cfgPath)}${C.reset}`); process.exit(softExit); }
  const cfg = readJson(cfgPath, repoRoot, softExit);

  // manifest ids (optional file)
  let manifestIds = null;
  const manifestPath = path.join(vaultDir, '_meta', 'manifest.json');
  if (fs.existsSync(manifestPath)) {
    const manifest = readJson(manifestPath, repoRoot, softExit);
    manifestIds = new Set((manifest.concepts || []).map((c) => c.id));
  }

  // concept cards = *.md under the vault, excluding _meta/**, index.md, log.md, README.md
  const reserved = new Set(['index.md', 'log.md', 'README.md']);
  const cards = walk(vaultDir).filter((f) => {
    const rel = path.relative(vaultDir, f);
    if (!f.endsWith('.md')) return false;
    if (rel.startsWith('_meta' + path.sep)) return false;
    if (reserved.has(rel)) return false;
    return true;
  });

  let totalErrors = 0;
  let totalWarnings = 0;
  console.log(`Validating ${cards.length} Story Bible card(s)...\n`);

  for (const file of cards) {
    const rel = path.relative(vaultDir, file);
    const { errors, warnings } = validateCard(file, rel, cfg, repoRoot, vaultDir, manifestIds);
    if (errors.length || warnings.length) {
      console.log(`${C.yellow}${rel}${C.reset}`);
      for (const e of errors) console.log(`  ${C.red}ERROR${C.reset} ${e}`);
      for (const w of warnings) console.log(`  ${C.yellow}WARN${C.reset}  ${w}`);
      console.log('');
    } else {
      console.log(`${C.green}✓${C.reset} ${rel}`);
    }
    totalErrors += errors.length;
    totalWarnings += warnings.length;
  }

  // reverse manifest check: manifest ids that have no card on disk
  if (manifestIds) {
    const diskIds = new Set(cards.map((f) => path.relative(vaultDir, f).replace(/\.md$/, '')));
    for (const id of manifestIds) {
      if (!diskIds.has(id)) { console.log(`  ${C.red}ERROR${C.reset} manifest references missing card: ${id}`); totalErrors++; }
    }
  }

  console.log('');
  console.log(`Summary: ${totalErrors} error(s), ${totalWarnings} warning(s)`);
  if (totalErrors > 0 && strict) { console.log(`${C.red}Strict mode: failing due to errors.${C.reset}`); process.exit(1); }
  if (totalErrors > 0) console.log('Note: advisory run — re-run with --strict to fail on errors.');
  else console.log(`${C.green}Story Bible is valid.${C.reset}`);
  process.exit(0);
}

main();
