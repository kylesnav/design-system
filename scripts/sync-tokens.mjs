// scripts/sync-tokens.mjs
import fs from 'fs';
import path from 'path';

// --- Paths ---
const ROOT_DIR = path.resolve(process.cwd());
const HTML_FILE = path.join(ROOT_DIR, 'delightful-design-system.html');
const CSS_TOKENS_FILE = path.join(ROOT_DIR, 'claude-plugin/themes/css/delightful-tokens.css');
const OBSIDIAN_THEME_FILE = path.join(ROOT_DIR, 'obsidian-theme/theme.css');

// --- Helper Functions ---
function readFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found at ${filePath}`);
    process.exit(1);
  }
  return fs.readFileSync(filePath, 'utf8');
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✅  Updated ${path.relative(ROOT_DIR, filePath)}`);
}

function extractCSSBlock(htmlContent, blockComment) {
  // Finds a block starting with the given comment, matching :root or [data-theme] up to the closing brace
  // This heavily relies on the current formatting of the HTML file.
  const regex = new RegExp(`\\/\\* ={10,}\\s*${blockComment.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}[\\s\\S]*?={10,} \\*\\/\\s*(:root|,?\\s*\\[data-theme=[^\\]]+\\])\\s*\\{([\\s\\S]*?)\\n\\s{4}\\}`, 'g');
  
  const matches = [...htmlContent.matchAll(regex)];
  if (matches.length === 0) {
      console.warn(`⚠️ Warning: Could not find block matching comment: "${blockComment}"`);
      return null;
  }
  
  return matches; // Array of [fullMatch, selector, innerContent]
}

function run() {
  console.log('🔄 Starting token sync...');
  const htmlContent = readFile(HTML_FILE);

  // 1. Extract the three core tiers from the HTML
  const tier1Matches = extractCSSBlock(htmlContent, 'TIER 1 — PRIMITIVES');
  const tier2LightMatches = extractCSSBlock(htmlContent, 'TIER 2 — SEMANTIC TOKENS (Light) - V3 NEO-BRUTALIST');
  const tier2DarkMatches = extractCSSBlock(htmlContent, 'TIER 2 — SEMANTIC TOKENS (Dark)');
  const tier3Matches = extractCSSBlock(htmlContent, 'TIER 3 — COMPONENT TOKENS + TYPOGRAPHY + SPACING + MOTION');

  if (!tier1Matches || !tier2LightMatches || !tier2DarkMatches || !tier3Matches) {
      console.error('❌ Failed to extract one or more token tiers. Sync aborted.');
      process.exit(1);
  }

  // Read current CSS file
  let cssTokensContent = readFile(CSS_TOKENS_FILE);
  
  // Create replacement blocks
  const replaceBlock = (content, commentMarker, newMatches) => {
      // Find the existing block in the target file
      newMatches.forEach(match => {
          const innerVariables = match[2];
          const fullSelector = match[1];
          // We look for the comment block that precedes it
           const blockRegex = new RegExp(`(\\/\\* ={10,}\\s*${commentMarker.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}[\\s\\S]*?={10,} \\*\\/\\s*${fullSelector.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\s*\\{)[\\s\\S]*?(\\n\\})`, 'g');
           
           if (!blockRegex.test(content)) {
                console.warn(`Could not find target block for ${commentMarker} in CSS file`);
           }
           
           content = content.replace(blockRegex, `$1${innerVariables}$2`);
      });
      return content;
  };

  // Update delightful-tokens.css
  cssTokensContent = replaceBlock(cssTokensContent, 'TIER 1 — PRIMITIVES', tier1Matches);
  cssTokensContent = replaceBlock(cssTokensContent, 'TIER 2 — SEMANTIC TOKENS (Light) - V3 NEO-BRUTALIST', tier2LightMatches);
  cssTokensContent = replaceBlock(cssTokensContent, 'TIER 2 — SEMANTIC TOKENS (Dark)', tier2DarkMatches);
  cssTokensContent = replaceBlock(cssTokensContent, 'TIER 3 — COMPONENT TOKENS + TYPOGRAPHY + SPACING + MOTION', tier3Matches);
  
  writeFile(CSS_TOKENS_FILE, cssTokensContent);

  // Update obsidian-theme/theme.css (specifically Primitives)
  let obsidianContent = readFile(OBSIDIAN_THEME_FILE);
  // The primitives in Obsidian are prefixed with --d- instead of --primitive- and lack hue 210/148 comments inline
  // Due to the complex manual mapping in Obsidian, we will ONLY update exact matched primitive values for now if they changed,
  // or instruct the user this file has a different structure.
  
  // For a robust sync, rewriting Obsidian's theme.css automatically requires a custom transformer since Obsidian adds --d- prefixes.
  // We'll write a simple regex replacer for the OKLCH values in Obsidian based on Tier 1
  
  const primitivesList = tier1Matches[0][2].split('\n').filter(line => line.includes('--primitive-'));
  
  primitivesList.forEach(line => {
      const match = line.match(/--primitive-([a-z0-9-]+):\s*(oklch\([^)]+\));/);
      if (match) {
          const [_, name, val] = match;
          // In obsidian, it's --d-name
          const obsidianVar = `--d-${name}`;
           const obsRegex = new RegExp(`(${obsidianVar}:\\s*)oklch\\([^)]+\\);`, 'g');
           obsidianContent = obsidianContent.replace(obsRegex, `$1${val};`);
      }
  });
  
  writeFile(OBSIDIAN_THEME_FILE, obsidianContent);

  console.log('✨ Token sync complete!');
}

run();
