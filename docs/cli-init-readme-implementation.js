/**
 * init-readme command implementation for @wtfb/cli
 *
 * Add this to the wtfb-packages repo at:
 * packages/cli/src/commands/init-readme.js (or equivalent)
 *
 * Then register in the CLI command index.
 */

const fs = require('fs');
const path = require('path');

const TEMPLATE_MARKER = '<!-- wtfb:template-readme -->';
const TEMPLATE_PATH = 'templates/readme-imdb-style.md';
const PROJECT_CONFIG_PATH = '.wtfb/project.json';
const README_PATH = 'README.md';

// Type display mapping
const TYPE_LABELS = {
  'screenplay': 'Screenplay',
  'novel': 'Novel',
  'film-production': 'Film Production'
};

/**
 * Convert hyphenated string to Title Case
 * "my-awesome-project" -> "My Awesome Project"
 */
function toTitleCase(str) {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Check if README has the template marker
 */
function hasTemplateMarker(readmePath) {
  if (!fs.existsSync(readmePath)) {
    return false; // No README means safe to create
  }
  const content = fs.readFileSync(readmePath, 'utf8');
  return content.includes(TEMPLATE_MARKER);
}

/**
 * Read project configuration
 */
function readProjectConfig() {
  if (!fs.existsSync(PROJECT_CONFIG_PATH)) {
    return null;
  }
  const content = fs.readFileSync(PROJECT_CONFIG_PATH, 'utf8');
  return JSON.parse(content);
}

/**
 * Generate README content from template
 */
function generateReadme(title, type, year) {
  if (!fs.existsSync(TEMPLATE_PATH)) {
    throw new Error(`Template not found: ${TEMPLATE_PATH}`);
  }

  let content = fs.readFileSync(TEMPLATE_PATH, 'utf8');

  // Get display label for type
  const typeLabel = TYPE_LABELS[type] || type;

  // Replace exact header pattern only (first line with title placeholder)
  content = content.replace(
    /^# \[Project Title\] \(Year\)/m,
    `# ${title} (${year})`
  );

  // Replace project type placeholders
  content = content.replace(/\[Project Type\]/g, typeLabel);

  // Remove template marker from output (marker lifecycle contract)
  content = content.replace(TEMPLATE_MARKER + '\n', '');
  content = content.replace(TEMPLATE_MARKER, '');

  return content;
}

/**
 * Main command handler
 */
async function initReadme(options = {}) {
  const { title: titleOverride, type: typeOverride, force, dryRun } = options;

  // Check if safe to proceed
  const readmeExists = fs.existsSync(README_PATH);
  const hasMarker = hasTemplateMarker(README_PATH);

  if (readmeExists && !hasMarker && !force) {
    console.log('ℹ️  README.md appears to be customized - leaving it unchanged.');
    console.log('   Use --force to replace it anyway.');
    return { status: 'skipped', reason: 'customized' };
  }

  // Get project info
  const projectConfig = readProjectConfig();

  let projectName, projectType;

  if (titleOverride) {
    projectName = titleOverride;
  } else if (projectConfig?.name) {
    projectName = toTitleCase(projectConfig.name);
  } else {
    throw new Error('No project name found. Use --title or run init first.');
  }

  if (typeOverride) {
    if (!TYPE_LABELS[typeOverride]) {
      throw new Error(`Invalid type: ${typeOverride}. Use: screenplay, novel, or film-production`);
    }
    projectType = typeOverride;
  } else if (projectConfig?.projectType) {
    projectType = projectConfig.projectType;
  } else {
    projectType = 'screenplay'; // Default
  }

  const currentYear = new Date().getFullYear();

  // Generate content
  const readmeContent = generateReadme(projectName, projectType, currentYear);

  if (dryRun) {
    console.log('--- DRY RUN: Would generate ---');
    console.log(readmeContent.substring(0, 500) + '...');
    console.log('-------------------------------');
    return { status: 'dry-run', content: readmeContent };
  }

  // Write README
  fs.writeFileSync(README_PATH, readmeContent, 'utf8');

  const action = force && readmeExists && !hasMarker ? 'forced overwrite' : 'generated';
  console.log(`✅ README.md ${action}!`);
  console.log('');
  console.log(`  # ${projectName} (${currentYear})`);
  console.log(`  **${TYPE_LABELS[projectType]}** | **[Genre]** | **[Runtime]**`);
  console.log('');
  console.log('Fill in the remaining placeholders:');
  console.log('  - Logline and synopsis');
  console.log('  - Character and crew details');

  return { status: action, title: projectName, type: projectType, year: currentYear };
}

// CLI argument parsing (adapt to your CLI framework)
function parseArgs(args) {
  const options = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg === '--title' && args[i + 1]) {
      options.title = args[++i];
    } else if (arg === '--type' && args[i + 1]) {
      options.type = args[++i];
    } else if (arg === '--force') {
      options.force = true;
    } else if (arg === '--dry-run') {
      options.dryRun = true;
    }
  }

  return options;
}

// Export for CLI integration
module.exports = {
  command: 'init-readme',
  description: 'Initialize project README from IMDb-style template',
  options: [
    { flags: '--title <title>', description: 'Override project title' },
    { flags: '--type <type>', description: 'Override project type (screenplay|novel|film-production)' },
    { flags: '--force', description: 'Overwrite even if README is customized' },
    { flags: '--dry-run', description: 'Show what would be generated without writing' }
  ],
  handler: async (options) => {
    try {
      await initReadme(options);
      process.exit(0);
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
      process.exit(1);
    }
  }
};

// Direct execution support
if (require.main === module) {
  const options = parseArgs(process.argv.slice(2));
  initReadme(options)
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(`❌ Error: ${err.message}`);
      process.exit(1);
    });
}
