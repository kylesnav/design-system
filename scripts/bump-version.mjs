// scripts/bump-version.mjs
// Bumps the version across all 6 canonical files and creates a git tag.
// Usage: node scripts/bump-version.mjs 0.4.5

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT_DIR = path.resolve(process.cwd());

// --- Version files ---
const VERSION_FILES = [
  {
    path: path.join(ROOT_DIR, 'package.json'),
    label: 'package.json',
    type: 'json',
    key: 'version',
  },
  {
    path: path.join(ROOT_DIR, 'vscode-theme/package.json'),
    label: 'vscode-theme/package.json',
    type: 'json',
    key: 'version',
  },
  {
    path: path.join(ROOT_DIR, 'claude-plugin/.claude-plugin/plugin.json'),
    label: 'claude-plugin/.claude-plugin/plugin.json',
    type: 'json',
    key: 'version',
  },
  {
    path: path.join(ROOT_DIR, 'obsidian-theme/manifest.json'),
    label: 'obsidian-theme/manifest.json',
    type: 'json',
    key: 'version',
  },
  {
    path: path.join(ROOT_DIR, 'claude-plugin/skills/build-with-delightful/SKILL.md'),
    label: 'claude-plugin/skills/build-with-delightful/SKILL.md',
    type: 'yaml-frontmatter',
  },
  {
    path: path.join(ROOT_DIR, 'claude-plugin/skills/refactor-with-delightful/SKILL.md'),
    label: 'claude-plugin/skills/refactor-with-delightful/SKILL.md',
    type: 'yaml-frontmatter',
  },
];

// --- Validation ---
function validateSemver(version) {
  return /^\d+\.\d+\.\d+$/.test(version);
}

// --- Updaters ---
function updateJsonFile(filePath, key, version) {
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const old = content[key];
  content[key] = version;
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf8');
  return old;
}

function updateYamlFrontmatter(filePath, version) {
  const content = fs.readFileSync(filePath, 'utf8');
  const oldMatch = content.match(/^(\s*version:\s*)(.+)$/m);
  const old = oldMatch ? oldMatch[2].trim() : '(not found)';
  const updated = content.replace(/^(\s*version:\s*).+$/m, `$1${version}`);
  fs.writeFileSync(filePath, updated, 'utf8');
  return old;
}

// --- Main ---
function run() {
  const version = process.argv[2];

  if (!version) {
    console.error('Usage: node scripts/bump-version.mjs <version>');
    console.error('Example: node scripts/bump-version.mjs 0.4.5');
    process.exit(1);
  }

  if (!validateSemver(version)) {
    console.error(`Error: "${version}" is not a valid semver version (expected X.Y.Z)`);
    process.exit(1);
  }

  const tag = `v${version}`;

  // Check that the git tag doesn't already exist
  try {
    const existingTags = execSync('git tag -l', { encoding: 'utf8' });
    if (existingTags.split('\n').includes(tag)) {
      console.error(`Error: Git tag "${tag}" already exists.`);
      process.exit(1);
    }
  } catch {
    console.warn('Warning: Could not check existing git tags.');
  }

  console.log(`\nBumping version to ${version}\n`);

  const results = [];

  for (const file of VERSION_FILES) {
    if (!fs.existsSync(file.path)) {
      console.error(`Error: File not found: ${file.label}`);
      process.exit(1);
    }

    let oldVersion;
    if (file.type === 'json') {
      oldVersion = updateJsonFile(file.path, file.key, version);
    } else if (file.type === 'yaml-frontmatter') {
      oldVersion = updateYamlFrontmatter(file.path, version);
    }

    results.push({ label: file.label, old: oldVersion, new: version });
    console.log(`  Updated ${file.label}  (${oldVersion} -> ${version})`);
  }

  // Create git tag
  try {
    execSync(`git tag ${tag}`, { encoding: 'utf8' });
    console.log(`\n  Created git tag: ${tag}`);
  } catch (err) {
    console.error(`\nError creating git tag: ${err.message}`);
    process.exit(1);
  }

  // Summary
  console.log('\n--- Summary ---');
  console.log(`Version: ${version}`);
  console.log(`Tag:     ${tag}`);
  console.log(`Files:   ${results.length} updated`);
  results.forEach(r => console.log(`  ${r.label}`));
  console.log('\nDone. Remember to commit these changes and push with --tags.');
}

run();
