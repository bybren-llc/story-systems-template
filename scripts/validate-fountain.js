#!/usr/bin/env node
/**
 * WTFB Fountain Validator
 *
 * Validates Fountain screenplay files for common issues:
 * - Scene heading format
 * - Character name consistency
 * - Dialogue formatting
 * - Transition formatting
 */

const fs = require('fs');
const path = require('path');

// Find all .fountain files
function findFountainFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      files.push(...findFountainFiles(fullPath));
    } else if (item.endsWith('.fountain')) {
      files.push(fullPath);
    }
  }

  return files;
}

// Validation rules
const rules = {
  // Scene headings must start with INT., EXT., or INT./EXT.
  sceneHeading: {
    pattern: /^(INT\.|EXT\.|INT\.\/EXT\.|I\/E\.)\s+.+\s+-\s+(DAY|NIGHT|MORNING|EVENING|AFTERNOON|DAWN|DUSK|CONTINUOUS|LATER|SAME|MOMENTS LATER)/i,
    check: (line) => {
      if (line.match(/^(INT|EXT|I\/E)/i) && !line.match(rules.sceneHeading.pattern)) {
        return 'Scene heading may be malformed. Expected format: INT./EXT. LOCATION - TIME';
      }
      return null;
    }
  },

  // Character names should be all caps
  characterName: {
    pattern: /^[A-Z][A-Z\s\d'.-]+(\s*\([^)]+\))?$/,
    check: (line, prevLine) => {
      // Character names are preceded by empty line and followed by dialogue
      if (prevLine === '' && line.match(/^[A-Z]/) && !line.match(/^(INT|EXT|CUT|FADE|DISSOLVE)/)) {
        if (!line.match(rules.characterName.pattern) && line.length < 40) {
          return 'Character name should be ALL CAPS';
        }
      }
      return null;
    }
  },

  // Transitions should end with :
  transition: {
    pattern: /^(CUT TO:|FADE OUT\.|FADE IN:|DISSOLVE TO:|SMASH CUT TO:|TIME CUT:|MATCH CUT TO:)$/i,
    check: (line) => {
      if (line.match(/^(CUT|FADE|DISSOLVE|SMASH|TIME|MATCH)/i)) {
        if (!line.match(rules.transition.pattern)) {
          return 'Transition format may be incorrect';
        }
      }
      return null;
    }
  },

  // Parentheticals should be on their own line in lowercase
  parenthetical: {
    pattern: /^\([a-z\s,;'-]+\)$/,
    check: (line) => {
      if (line.startsWith('(') && line.endsWith(')')) {
        if (!line.match(rules.parenthetical.pattern)) {
          return 'Parenthetical should be lowercase in parentheses';
        }
      }
      return null;
    }
  }
};

// Validate a single file
function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const issues = [];

  let prevLine = '';
  let inTitlePage = true;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lineNum = i + 1;

    // Skip title page (before ===)
    if (line === '===') {
      inTitlePage = false;
      continue;
    }

    if (inTitlePage) continue;

    // Skip empty lines and notes
    if (line === '' || line.startsWith('[[')) {
      prevLine = line;
      continue;
    }

    // Check each rule
    for (const [ruleName, rule] of Object.entries(rules)) {
      const issue = rule.check(line, prevLine);
      if (issue) {
        issues.push({
          line: lineNum,
          rule: ruleName,
          message: issue,
          content: line.substring(0, 50) + (line.length > 50 ? '...' : '')
        });
      }
    }

    prevLine = line;
  }

  return issues;
}

// Main
function main() {
  const cwd = process.cwd();
  const fountainFiles = findFountainFiles(cwd);

  if (fountainFiles.length === 0) {
    console.log('No .fountain files found');
    process.exit(0);
  }

  console.log(`Validating ${fountainFiles.length} fountain file(s)...\n`);

  let totalIssues = 0;
  let hasErrors = false;

  for (const file of fountainFiles) {
    const relativePath = path.relative(cwd, file);
    const issues = validateFile(file);

    if (issues.length > 0) {
      console.log(`\x1b[33m${relativePath}\x1b[0m`);
      for (const issue of issues) {
        console.log(`  Line ${issue.line}: ${issue.message}`);
        console.log(`    \x1b[90m${issue.content}\x1b[0m`);
      }
      console.log('');
      totalIssues += issues.length;
    } else {
      console.log(`\x1b[32m✓\x1b[0m ${relativePath}`);
    }
  }

  console.log('');
  if (totalIssues > 0) {
    console.log(`\x1b[33mFound ${totalIssues} potential issue(s)\x1b[0m`);
    console.log('Note: These are suggestions, not hard errors. Review and fix as needed.');
    // Don't fail the build for warnings
    process.exit(0);
  } else {
    console.log('\x1b[32mAll fountain files validated successfully!\x1b[0m');
    process.exit(0);
  }
}

main();
