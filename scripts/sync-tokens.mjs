// scripts/sync-tokens.mjs
// Syncs tokens from the source of truth (delightful-design-system.html)
// into all derivative files: CSS tokens, Obsidian theme, motion/animation HTML.
import fs from 'fs';
import path from 'path';

// --- Paths ---
const ROOT_DIR = path.resolve(process.cwd());
const HTML_FILE = path.join(ROOT_DIR, 'delightful-design-system.html');
const CSS_TOKENS_FILE = path.join(ROOT_DIR, 'claude-plugin/themes/css/delightful-tokens.css');
const OBSIDIAN_THEME_FILE = path.join(ROOT_DIR, 'obsidian-theme/theme.css');
const MOTION_FILE = path.join(ROOT_DIR, 'delightful-motion.html');
const ANIMATION_FILE = path.join(ROOT_DIR, 'delightful-animation.html');
const COLOR_FILE = path.join(ROOT_DIR, 'delightful-color.html');

// --- Helper Functions ---
function readFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found at ${filePath}`);
    process.exit(1);
  }
  return fs.readFileSync(filePath, 'utf8');
}

function readFileOptional(filePath) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  return fs.readFileSync(filePath, 'utf8');
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`  Updated ${path.relative(ROOT_DIR, filePath)}`);
}

function extractCSSBlock(htmlContent, blockComment) {
  // Finds a block starting with the given comment, matching :root or [data-theme] up to the closing brace
  // Handles optional @layer wrapping (e.g. @layer primitives { :root { ... } })
  const regex = new RegExp(`\\/\\* ={10,}\\s*${blockComment.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}[\\s\\S]*?={10,} \\*\\/\\s*(?:@layer\\s+\\w+\\s*\\{\\s*)?(:root|,?\\s*\\[data-theme=[^\\]]+\\])\\s*\\{([\\s\\S]*?)\\n\\s{4}\\}`, 'g');

  const matches = [...htmlContent.matchAll(regex)];
  if (matches.length === 0) {
      console.warn(`  Warning: Could not find block matching comment: "${blockComment}"`);
      return null;
  }

  return matches; // Array of [fullMatch, selector, innerContent]
}

/**
 * Extracts a full token section from the source HTML, including the comment
 * header, selector, braces, and all inner content.
 *
 * Returns the text from `/* ===...TIER_LABEL...=== * /` through the closing `}`.
 */
function extractFullTokenBlock(htmlContent, tierLabel) {
  const escaped = tierLabel.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  // Match: comment block + optional @layer wrapper + selector(s) + {content}
  // Handles both `@layer X { :root { ... } }` and plain `:root { ... }` formats
  const regex = new RegExp(
    `(\\/\\* ={10,}\\s*${escaped}[\\s\\S]*?={10,} \\*\\/)` + // comment block
    `(\\s*(?:@layer\\s+\\w+\\s*\\{)?` + // optional @layer opener
    `\\s*(?::root|\\[data-theme=[^\\]]+\\])(?:,\\s*(?::root|\\[data-theme=[^\\]]+\\]))*)` + // selector(s)
    `(\\s*\\{[\\s\\S]*?\\n\\s{4}\\})` + // { content }
    `(\\s*\\}\\s*\\/\\*[^*]*\\*\\/)?`, // optional @layer closing } /* end ... */
    ''
  );
  const m = htmlContent.match(regex);
  return m ? m[0] : null;
}

// --- CSS Tokens Sync ---
function syncCSSTokens(htmlContent) {
  console.log('\n--- CSS Tokens ---');

  const tier1Matches = extractCSSBlock(htmlContent, 'TIER 1 — PRIMITIVES');
  const tier2LightMatches = extractCSSBlock(htmlContent, 'TIER 2 — SEMANTIC TOKENS (Light) - V3 NEO-BRUTALIST');
  const tier2DarkMatches = extractCSSBlock(htmlContent, 'TIER 2 — SEMANTIC TOKENS (Dark)');
  const tier3Matches = extractCSSBlock(htmlContent, 'TIER 3 — COMPONENT TOKENS + TYPOGRAPHY + SPACING + MOTION');

  if (!tier1Matches || !tier2LightMatches || !tier2DarkMatches || !tier3Matches) {
      console.error('  Failed to extract one or more token tiers. CSS sync aborted.');
      return false;
  }

  let cssTokensContent = readFile(CSS_TOKENS_FILE);

  const replaceBlock = (content, commentMarker, newMatches) => {
      newMatches.forEach(match => {
          const innerVariables = match[2];
          const fullSelector = match[1];
          const blockRegex = new RegExp(
            `(\\/\\* ={10,}\\s*${commentMarker.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}[\\s\\S]*?={10,} \\*\\/\\s*${fullSelector.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\s*\\{)[\\s\\S]*?(\\n\\})`,
            'g'
          );
          if (!blockRegex.test(content)) {
              console.warn(`  Could not find target block for ${commentMarker} in CSS file`);
          }
          content = content.replace(blockRegex, `$1${innerVariables}$2`);
      });
      return content;
  };

  cssTokensContent = replaceBlock(cssTokensContent, 'TIER 1 — PRIMITIVES', tier1Matches);
  cssTokensContent = replaceBlock(cssTokensContent, 'TIER 2 — SEMANTIC TOKENS (Light) - V3 NEO-BRUTALIST', tier2LightMatches);
  cssTokensContent = replaceBlock(cssTokensContent, 'TIER 2 — SEMANTIC TOKENS (Dark)', tier2DarkMatches);
  cssTokensContent = replaceBlock(cssTokensContent, 'TIER 3 — COMPONENT TOKENS + TYPOGRAPHY + SPACING + MOTION', tier3Matches);

  writeFile(CSS_TOKENS_FILE, cssTokensContent);
  return true;
}

// --- Obsidian Theme Sync ---
function syncObsidianTheme(htmlContent) {
  console.log('\n--- Obsidian Theme ---');

  const tier1Matches = extractCSSBlock(htmlContent, 'TIER 1 — PRIMITIVES');
  if (!tier1Matches) {
    console.error('  Failed to extract Tier 1 primitives. Obsidian sync aborted.');
    return false;
  }

  let obsidianContent = readFile(OBSIDIAN_THEME_FILE);

  const primitivesList = tier1Matches[0][2].split('\n').filter(line => line.includes('--primitive-'));
  let updatedCount = 0;

  primitivesList.forEach(line => {
      const match = line.match(/--primitive-([a-z0-9-]+):\s*(oklch\([^)]+\));/);
      if (match) {
          const [_, name, val] = match;
          const obsidianVar = `--d-${name}`;
          const obsRegex = new RegExp(`(${obsidianVar}:\\s*)oklch\\([^)]+\\);`, 'g');
          const before = obsidianContent;
          obsidianContent = obsidianContent.replace(obsRegex, `$1${val};`);
          if (obsidianContent !== before) updatedCount++;
      }
  });

  writeFile(OBSIDIAN_THEME_FILE, obsidianContent);
  console.log(`  ${updatedCount} primitive value(s) updated in Obsidian theme`);
  return true;
}

// --- Motion / Animation HTML Token Sync ---
function syncCompanionHTML(htmlContent, targetPath, label) {
  const targetContent = readFileOptional(targetPath);
  if (targetContent === null) {
    console.log(`  ${label}: file not found, skipping.`);
    return false;
  }

  console.log(`\n--- ${label} ---`);

  // Extract full token blocks from the source of truth
  const tiers = [
    'TIER 1 — PRIMITIVES',
    'TIER 2 — SEMANTIC TOKENS (Light) - V3 NEO-BRUTALIST',
    'TIER 2 — SEMANTIC TOKENS (Dark)',
    'TIER 3 — COMPONENT TOKENS + TYPOGRAPHY + SPACING + MOTION',
  ];

  let updated = targetContent;
  let syncedCount = 0;

  for (const tierLabel of tiers) {
    const sourceBlock = extractFullTokenBlock(htmlContent, tierLabel);
    if (!sourceBlock) {
      console.warn(`  Warning: Could not extract "${tierLabel}" from source`);
      continue;
    }

    // Also find the same section in the target by the same tier label
    const targetBlock = extractFullTokenBlock(updated, tierLabel);
    if (!targetBlock) {
      // The target may use a shorter comment variant (e.g. "TIER 2 — SEMANTIC TOKENS (Light)")
      // Try a looser match: look for the tier label without the " - V3 NEO-BRUTALIST" suffix
      const shortLabel = tierLabel.replace(/ - V3 NEO-BRUTALIST$/, '');
      if (shortLabel !== tierLabel) {
        const altBlock = extractFullTokenBlock(updated, shortLabel);
        if (altBlock) {
          updated = updated.replace(altBlock, sourceBlock);
          syncedCount++;
          continue;
        }
      }
      console.warn(`  Warning: Could not find "${tierLabel}" in ${label}, skipping tier`);
      continue;
    }

    updated = updated.replace(targetBlock, sourceBlock);
    syncedCount++;
  }

  if (syncedCount > 0) {
    writeFile(targetPath, updated);
    console.log(`  ${syncedCount} token tier(s) synced`);
  } else {
    console.log(`  No token tiers matched in ${label} -- nothing to sync`);
  }

  return syncedCount > 0;
}

// --- OKLCH-to-Hex Reference ---
// NOTE: Accurate OKLCH-to-hex conversion requires a color library (e.g. culori).
// The values in Ghostty, iTerm2, and Starship configs use pre-computed hex values.
// To regenerate hex from OKLCH primitives:
//   1. Use the VSCode theme generator: cd vscode-theme/scripts && node generate-themes.mjs
//   2. Or use an online OKLCH converter: https://oklch.com
//   3. Or install culori: npm install culori, then:
//      import { formatHex } from 'culori';
//      formatHex('oklch(0.640 0.270 350)') // => '#e0197d' (approximate)
// This script does NOT perform OKLCH-to-hex conversion. Terminal themes (Ghostty,
// iTerm2) and Starship must be updated manually or via a dedicated converter.

// --- Main ---
function run() {
  console.log('Starting token sync...');
  console.log(`Source: ${path.relative(ROOT_DIR, HTML_FILE)}`);
  const htmlContent = readFile(HTML_FILE);

  // 1. CSS Tokens
  syncCSSTokens(htmlContent);

  // 2. Obsidian Theme
  syncObsidianTheme(htmlContent);

  // 3. Motion HTML (companion doc — sync token blocks only)
  syncCompanionHTML(htmlContent, MOTION_FILE, 'delightful-motion.html');

  // 4. Animation HTML (companion doc — sync token blocks only)
  syncCompanionHTML(htmlContent, ANIMATION_FILE, 'delightful-animation.html');

  // 5. Color HTML (companion doc — sync token blocks only)
  syncCompanionHTML(htmlContent, COLOR_FILE, 'delightful-color.html');

  console.log('\nToken sync complete!');
}

run();
