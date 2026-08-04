#!/usr/bin/env node
/**
 * validate-capabilities.js
 *
 * Validates skills and commands against WTFB compliance checklist.
 * See: docs/guides/SKILL_COMPLIANCE_CHECKLIST.md
 *
 * Usage:
 *   node scripts/validate-capabilities.js [--mode=template|marketplace]
 *
 * Exit codes:
 *   0 - All checks passed (warnings may exist)
 *   1 - One or more errors found
 */

const fs = require('fs');
const path = require('path');

// Mode detection
const args = process.argv.slice(2);
const modeArg = args.find(a => a.startsWith('--mode='));
let mode = modeArg ? modeArg.split('=')[1] : null;

// Auto-detect mode from project.json if not specified
if (!mode) {
  try {
    const projectJson = JSON.parse(fs.readFileSync('.wtfb/project.json', 'utf8'));
    // If plugins.installed has items, likely marketplace context
    mode = projectJson.plugins?.installed?.length > 0 ? 'marketplace' : 'template';
  } catch {
    mode = 'template';
  }
}

// Results tracking
const results = {
  skills: { errors: [], warnings: [] },
  commands: { errors: [], warnings: [] },
  parity: { errors: [], warnings: [] },
  summary: { totalErrors: 0, totalWarnings: 0 }
};

// ANSI colors
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const GREEN = '\x1b[32m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

/**
 * Parse YAML frontmatter from markdown content
 * Simple parser - handles basic YAML without external dependencies
 */
function parseFrontmatter(content) {
  const lines = content.split('\n');

  if (lines[0] !== '---') {
    return null;
  }

  const endIndex = lines.slice(1).findIndex(line => line === '---');
  if (endIndex === -1) {
    return null;
  }

  const yamlLines = lines.slice(1, endIndex + 1);
  const frontmatter = {};
  let currentKey = null;
  let multilineValue = '';
  let inMultiline = false;

  for (const line of yamlLines) {
    // Check for new key
    const keyMatch = line.match(/^(\w+):\s*(.*)$/);

    if (keyMatch && !inMultiline) {
      const [, key, value] = keyMatch;

      if (value === '|' || value === '>') {
        // Start multiline
        currentKey = key;
        inMultiline = true;
        multilineValue = '';
      } else {
        frontmatter[key] = value.trim();
      }
    } else if (inMultiline) {
      // Check if line is indented (part of multiline)
      if (line.startsWith('  ') || line === '') {
        multilineValue += (multilineValue ? '\n' : '') + line.replace(/^  /, '');
      } else {
        // End multiline, save and process this line
        frontmatter[currentKey] = multilineValue.trim();
        inMultiline = false;

        // Process current line as new key
        const newKeyMatch = line.match(/^(\w+):\s*(.*)$/);
        if (newKeyMatch) {
          const [, key, value] = newKeyMatch;
          if (value === '|' || value === '>') {
            currentKey = key;
            inMultiline = true;
            multilineValue = '';
          } else {
            frontmatter[key] = value.trim();
          }
        }
      }
    }
  }

  // Handle final multiline
  if (inMultiline && currentKey) {
    frontmatter[currentKey] = multilineValue.trim();
  }

  return frontmatter;
}

/**
 * Validate a skill directory
 */
function validateSkill(skillDir) {
  const skillName = path.basename(skillDir);
  const skillPath = path.join(skillDir, 'SKILL.md');
  const errors = [];
  const warnings = [];

  // Check SKILL.md exists
  if (!fs.existsSync(skillPath)) {
    errors.push(`SKILL.md not found in ${skillDir}`);
    return { errors, warnings };
  }

  const content = fs.readFileSync(skillPath, 'utf8');
  const lines = content.split('\n');

  // ERROR: Frontmatter exists
  if (lines[0] !== '---') {
    errors.push(`Missing frontmatter (file must start with ---)`);
    return { errors, warnings };
  }

  // Parse frontmatter
  const frontmatter = parseFrontmatter(content);
  if (!frontmatter) {
    errors.push(`Invalid frontmatter structure`);
    return { errors, warnings };
  }

  // ERROR: name matches directory
  if (!frontmatter.name) {
    errors.push(`Missing 'name' field in frontmatter`);
  } else if (frontmatter.name !== skillName) {
    errors.push(`name '${frontmatter.name}' does not match directory '${skillName}'`);
  }

  // ERROR: wtfbId format
  if (!frontmatter.wtfbId) {
    errors.push(`Missing 'wtfbId' field in frontmatter`);
  } else {
    if (mode === 'template') {
      // Template mode: must be wtfb:{name}
      const expectedWtfbId = `wtfb:${skillName}`;
      if (frontmatter.wtfbId !== expectedWtfbId) {
        errors.push(`wtfbId '${frontmatter.wtfbId}' should be '${expectedWtfbId}'`);
      }
    } else {
      // Marketplace mode: must be {plugin}:{name} and NOT wtfb:
      if (frontmatter.wtfbId.startsWith('wtfb:')) {
        errors.push(`Marketplace skills cannot use 'wtfb:' namespace (reserved for template)`);
      } else if (!frontmatter.wtfbId.includes(':')) {
        errors.push(`wtfbId '${frontmatter.wtfbId}' must follow {plugin}:{name} format`);
      }
    }
  }

  // WARNING: description includes "Use when:"
  if (!frontmatter.description) {
    warnings.push(`Missing 'description' field`);
  } else {
    if (!frontmatter.description.toLowerCase().includes('use when')) {
      warnings.push(`description should include 'Use when:' trigger conditions`);
    }

    // WARNING: description max length
    if (frontmatter.description.length > 1024) {
      warnings.push(`description exceeds 1024 characters (${frontmatter.description.length})`);
    }
  }

  return { errors, warnings };
}

/**
 * Validate a command file
 */
function validateCommand(commandPath) {
  const commandName = path.basename(commandPath, '.md');
  const errors = [];
  const warnings = [];

  const content = fs.readFileSync(commandPath, 'utf8');
  const lines = content.split('\n');

  // Check for frontmatter (optional but recommended)
  const hasFrontmatter = lines[0] === '---';
  let frontmatter = null;
  let contentStart = 0;

  if (hasFrontmatter) {
    frontmatter = parseFrontmatter(content);
    const endIndex = lines.slice(1).findIndex(line => line === '---');
    contentStart = endIndex + 2;
  } else {
    warnings.push(`Missing frontmatter (recommended for autocomplete)`);
  }

  // ERROR: H1 heading matches filename
  const h1Match = lines.slice(contentStart).find(line => line.startsWith('# /'));
  if (h1Match) {
    const headingName = h1Match.replace('# /', '').trim();
    if (headingName !== commandName) {
      errors.push(`H1 heading '/${headingName}' does not match filename '${commandName}.md'`);
    }
  } else {
    errors.push(`Missing H1 heading '# /${commandName}'`);
  }

  // Frontmatter-specific warnings
  if (frontmatter) {
    if (frontmatter.description) {
      // WARNING: description length
      if (frontmatter.description.length > 100) {
        warnings.push(`description exceeds 100 characters (${frontmatter.description.length})`);
      }

      // WARNING: imperative voice (starts with verb)
      const imperativeVerbs = [
        'add', 'analyze', 'apply', 'begin', 'build', 'check', 'clean', 'clear',
        'complete', 'configure', 'conduct', 'convene', 'create', 'delete', 'deploy',
        'detect', 'display', 'draft', 'end', 'estimate', 'evaluate', 'execute', 'export',
        'extract', 'find', 'fix', 'format', 'generate', 'get', 'help', 'import',
        'initialize', 'insert', 'install', 'list', 'load', 'log', 'make', 'manage',
        'merge', 'move', 'open', 'parse', 'perform', 'prepare', 'print', 'process',
        'provide', 'publish', 'read', 'refactor', 'refresh', 'register', 'remove',
        'rename', 'render', 'replace', 'report', 'reset', 'resolve', 'restart',
        'restore', 'retrieve', 'return', 'review', 'run', 'save', 'scan', 'search',
        'send', 'set', 'setup', 'show', 'start', 'stop', 'structure', 'submit',
        'sync', 'test', 'track', 'transform', 'update', 'upgrade', 'upload', 'use',
        'validate', 'verify', 'view', 'welcome', 'write'
      ];

      const firstWord = frontmatter.description.toLowerCase().split(/\s+/)[0];
      if (!imperativeVerbs.includes(firstWord)) {
        warnings.push(`description should start with imperative verb (found: '${firstWord}')`);
      }
    } else {
      warnings.push(`Missing 'description' field in frontmatter`);
    }
  }

  return { errors, warnings };
}

/**
 * List markdown stems in a directory, excluding README.
 */
function mdStems(dir) {
  if (!fs.existsSync(dir)) return null;
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md') && f.toLowerCase() !== 'readme.md')
    .map(f => path.basename(f, '.md'))
    .sort();
}

/**
 * List command stems in a harness dir, excluding README.
 * Claude commands are .md; Gemini commands are .toml.
 */
function commandStems(dir, ext) {
  if (!fs.existsSync(dir)) return null;
  return fs.readdirSync(dir)
    .filter(f => f.endsWith(ext) && f.toLowerCase() !== 'readme' + ext)
    .map(f => path.basename(f, ext))
    .sort();
}

/**
 * Read the `model:` field from an agent markdown file's frontmatter.
 */
function agentModel(agentPath) {
  const fm = parseFrontmatter(fs.readFileSync(agentPath, 'utf8'));
  return fm ? fm.model : undefined;
}

/**
 * Report set differences between an authoritative list and a mirror list.
 */
function diffSets(label, authoritative, mirror, errors) {
  const a = new Set(authoritative);
  const b = new Set(mirror);
  const missing = [...a].filter(x => !b.has(x));
  const extra = [...b].filter(x => !a.has(x));
  if (missing.length) errors.push(`${label}: missing ${missing.join(', ')}`);
  if (extra.length) errors.push(`${label}: unexpected ${extra.join(', ')}`);
}

/**
 * Cross-surface consistency gate.
 *
 * Guarantees the capability schema, the on-disk Claude agents/commands, and every
 * mirrored harness (.gemini, and .codex if present) describe the SAME asset set —
 * so counts can't silently diverge again (STO-12). A mirror that does not exist is
 * skipped, never fabricated.
 */
function validateParity() {
  const errors = [];
  const warnings = [];

  // 1. Schema agents <-> on-disk Claude agents (ids + models)
  let schemaAgents = null;
  try {
    schemaAgents = JSON.parse(fs.readFileSync('.wtfb/ai-harness/schema.json', 'utf8')).agents || [];
  } catch (e) {
    errors.push(`Could not read .wtfb/ai-harness/schema.json: ${e.message}`);
  }
  const diskAgents = mdStems('.claude/agents');

  if (schemaAgents && diskAgents) {
    const schemaIds = schemaAgents.map(a => a.id).sort();
    diffSets('schema.agents vs .claude/agents', diskAgents, schemaIds, errors);

    // Model routing must agree between schema and agent frontmatter.
    for (const a of schemaAgents) {
      const p = path.join('.claude/agents', `${a.id}.md`);
      if (!fs.existsSync(p)) continue;
      const diskModel = agentModel(p);
      if (diskModel && a.model && diskModel !== a.model) {
        errors.push(`model drift for ${a.id}: schema=${a.model} frontmatter=${diskModel}`);
      }
    }
  }

  // 2. Mirrors must match the Claude surface exactly (agents + commands).
  const claudeCommands = commandStems('.claude/commands', '.md');
  const mirrors = [
    { name: '.gemini', agents: '.gemini/agents', commands: '.gemini/commands', cmdExt: '.toml' },
    { name: '.codex', agents: '.codex/agents', commands: '.codex/commands', cmdExt: '.md' }
  ];

  for (const m of mirrors) {
    const hasMirror = fs.existsSync(m.agents) || fs.existsSync(m.commands);
    if (!hasMirror) continue; // absent mirror is fine — we never fabricate one

    const mirrorAgents = mdStems(m.agents);
    if (diskAgents && mirrorAgents) {
      diffSets(`${m.name}/agents vs .claude/agents`, diskAgents, mirrorAgents, errors);
    }
    const mirrorCommands = commandStems(m.commands, m.cmdExt);
    if (claudeCommands && mirrorCommands) {
      diffSets(`${m.name}/commands vs .claude/commands`, claudeCommands, mirrorCommands, errors);
    }
  }

  return { errors, warnings };
}

/**
 * Main validation runner
 */
function main() {
  console.log(`${BOLD}WTFB Capability Validator${RESET}`);
  console.log(`Mode: ${mode}\n`);

  // Validate skills
  const skillsDir = '.claude/skills';
  if (fs.existsSync(skillsDir)) {
    const skillDirs = fs.readdirSync(skillsDir, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => path.join(skillsDir, d.name));

    console.log(`${BOLD}Validating ${skillDirs.length} skills...${RESET}`);

    for (const skillDir of skillDirs) {
      const skillName = path.basename(skillDir);
      const { errors, warnings } = validateSkill(skillDir);

      if (errors.length > 0) {
        results.skills.errors.push({ skill: skillName, issues: errors });
        results.summary.totalErrors += errors.length;
      }
      if (warnings.length > 0) {
        results.skills.warnings.push({ skill: skillName, issues: warnings });
        results.summary.totalWarnings += warnings.length;
      }

      const status = errors.length > 0 ? `${RED}FAIL${RESET}` :
                     warnings.length > 0 ? `${YELLOW}WARN${RESET}` :
                     `${GREEN}PASS${RESET}`;
      console.log(`  ${status} ${skillName}`);
    }
  } else {
    console.log(`${YELLOW}No skills directory found${RESET}`);
  }

  console.log();

  // Validate commands
  const commandsDir = '.claude/commands';
  if (fs.existsSync(commandsDir)) {
    const commandFiles = fs.readdirSync(commandsDir)
      .filter(f => f.endsWith('.md') && f.toLowerCase() !== 'readme.md')
      .map(f => path.join(commandsDir, f));

    console.log(`${BOLD}Validating ${commandFiles.length} commands...${RESET}`);

    for (const commandPath of commandFiles) {
      const commandName = path.basename(commandPath, '.md');
      const { errors, warnings } = validateCommand(commandPath);

      if (errors.length > 0) {
        results.commands.errors.push({ command: commandName, issues: errors });
        results.summary.totalErrors += errors.length;
      }
      if (warnings.length > 0) {
        results.commands.warnings.push({ command: commandName, issues: warnings });
        results.summary.totalWarnings += warnings.length;
      }

      const status = errors.length > 0 ? `${RED}FAIL${RESET}` :
                     warnings.length > 0 ? `${YELLOW}WARN${RESET}` :
                     `${GREEN}PASS${RESET}`;
      console.log(`  ${status} /${commandName}`);
    }
  } else {
    console.log(`${YELLOW}No commands directory found${RESET}`);
  }

  console.log();

  // Cross-surface parity (schema <-> disk <-> mirrors)
  console.log(`${BOLD}Checking cross-surface parity...${RESET}`);
  const parity = validateParity();
  results.parity.errors = parity.errors;
  results.parity.warnings = parity.warnings;
  results.summary.totalErrors += parity.errors.length;
  results.summary.totalWarnings += parity.warnings.length;
  const parityStatus = parity.errors.length > 0 ? `${RED}FAIL${RESET}` :
                       parity.warnings.length > 0 ? `${YELLOW}WARN${RESET}` :
                       `${GREEN}PASS${RESET}`;
  console.log(`  ${parityStatus} schema / disk / mirror consistency`);

  // Print summary
  console.log();
  console.log(`${BOLD}Summary${RESET}`);
  console.log(`  Errors:   ${results.summary.totalErrors > 0 ? RED : GREEN}${results.summary.totalErrors}${RESET}`);
  console.log(`  Warnings: ${results.summary.totalWarnings > 0 ? YELLOW : GREEN}${results.summary.totalWarnings}${RESET}`);

  // Print error details
  if (results.summary.totalErrors > 0) {
    console.log();
    console.log(`${RED}${BOLD}Errors (blocking):${RESET}`);

    for (const { skill, issues } of results.skills.errors) {
      console.log(`  ${BOLD}${skill}${RESET}`);
      for (const issue of issues) {
        console.log(`    ${RED}!${RESET} ${issue}`);
      }
    }

    for (const { command, issues } of results.commands.errors) {
      console.log(`  ${BOLD}/${command}${RESET}`);
      for (const issue of issues) {
        console.log(`    ${RED}!${RESET} ${issue}`);
      }
    }

    if (results.parity.errors.length > 0) {
      console.log(`  ${BOLD}parity${RESET}`);
      for (const issue of results.parity.errors) {
        console.log(`    ${RED}!${RESET} ${issue}`);
      }
    }
  }

  // Print warning details
  if (results.summary.totalWarnings > 0) {
    console.log();
    console.log(`${YELLOW}${BOLD}Warnings (non-blocking):${RESET}`);

    for (const { skill, issues } of results.skills.warnings) {
      console.log(`  ${BOLD}${skill}${RESET}`);
      for (const issue of issues) {
        console.log(`    ${YELLOW}~${RESET} ${issue}`);
      }
    }

    for (const { command, issues } of results.commands.warnings) {
      console.log(`  ${BOLD}/${command}${RESET}`);
      for (const issue of issues) {
        console.log(`    ${YELLOW}~${RESET} ${issue}`);
      }
    }
  }

  // Exit with appropriate code
  if (results.summary.totalErrors > 0) {
    console.log();
    console.log(`${RED}${BOLD}Validation failed with ${results.summary.totalErrors} error(s)${RESET}`);
    process.exit(1);
  } else {
    console.log();
    console.log(`${GREEN}${BOLD}Validation passed${RESET}`);
    process.exit(0);
  }
}

main();
