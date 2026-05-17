// scripts/bump-version.mjs
// Bumps the site package version and creates a git tag.
// Usage: node scripts/bump-version.mjs 0.7.1

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ROOT_DIR = path.resolve(process.cwd());
const PACKAGE_FILE = path.join(ROOT_DIR, 'package.json');

function validateSemver(version) {
  return /^\d+\.\d+\.\d+$/.test(version);
}

function updatePackageVersion(version) {
  const content = JSON.parse(fs.readFileSync(PACKAGE_FILE, 'utf8'));
  const old = content.version;
  content.version = version;
  fs.writeFileSync(PACKAGE_FILE, JSON.stringify(content, null, 2) + '\n', 'utf8');
  return old;
}

function run() {
  const version = process.argv[2];

  if (!version) {
    console.error('Usage: node scripts/bump-version.mjs <version>');
    console.error('Example: node scripts/bump-version.mjs 0.7.1');
    process.exit(1);
  }

  if (!validateSemver(version)) {
    console.error(`Error: "${version}" is not a valid semver version (expected X.Y.Z)`);
    process.exit(1);
  }

  const tag = `v${version}`;
  const existingTags = execSync('git tag -l', { encoding: 'utf8' });
  if (existingTags.split('\n').includes(tag)) {
    console.error(`Error: Git tag "${tag}" already exists.`);
    process.exit(1);
  }

  const oldVersion = updatePackageVersion(version);
  execSync(`git tag ${tag}`, { encoding: 'utf8' });

  console.log(`Updated package.json (${oldVersion} -> ${version})`);
  console.log(`Created git tag: ${tag}`);
  console.log('Remember to commit the version bump and push with --tags.');
}

run();
