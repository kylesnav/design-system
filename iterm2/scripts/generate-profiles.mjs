#!/usr/bin/env node

/**
 * Generate iTerm2 color profiles (.itermcolors) from the Delightful hex palette.
 *
 * Hex values are the single source of truth — identical to the Ghostty theme files.
 * Run: node iterm2/scripts/generate-profiles.mjs
 */

import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "colors");

// ── Shared palette (hex) ─────────────────────────────────────────────
// Matches ghostty/themes/delightful-light and delightful-dark exactly.

const light = {
  background:  "#fdf8f3",
  foreground:  "#1b150f",
  cursor:      "#f600a3",
  selectionBg: "#ffe6f4",
  selectionFg: "#1b150f",
  ansi: [
    "#16100c", // 0  black
    "#ed324b", // 1  red
    "#22a448", // 2  green
    "#febf00", // 3  yellow
    "#00a6c0", // 4  blue (cyan-400)
    "#f600a3", // 5  magenta
    "#17c0d6", // 6  cyan
    "#f6f1eb", // 7  white
    "#615d58", // 8  bright black
    "#ff6e74", // 9  bright red
    "#60c072", // 10 bright green
    "#ffcb3f", // 11 bright yellow
    "#88ddec", // 12 bright blue (cyan-200)
    "#ff5cb8", // 13 bright magenta
    "#88ddec", // 14 bright cyan
    "#ffffff", // 15 bright white
  ],
};

const dark = {
  background:  "#1e1a16",
  foreground:  "#eee9e3",
  cursor:      "#ff4fa8",
  selectionBg: "#3d2235",
  selectionFg: "#eee9e3",
  ansi: [
    "#1e1a16", // 0  black
    "#e8554c", // 1  red
    "#3aad5f", // 2  green
    "#f5c526", // 3  yellow
    "#5cb8d6", // 4  blue (cyan-400)
    "#ff4fa8", // 5  magenta
    "#5cb8d6", // 6  cyan
    "#eee9e3", // 7  white
    "#615d58", // 8  bright black
    "#ff6e74", // 9  bright red
    "#60c072", // 10 bright green
    "#ffcb3f", // 11 bright yellow
    "#88ddec", // 12 bright blue (cyan-200)
    "#ff7cc6", // 13 bright magenta
    "#88ddec", // 14 bright cyan
    "#ffffff", // 15 bright white
  ],
};

// ── Hex → RGB float ──────────────────────────────────────────────────

function hexToFloats(hex) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16) / 255;
  const g = parseInt(h.slice(2, 4), 16) / 255;
  const b = parseInt(h.slice(4, 6), 16) / 255;
  return { r: r.toFixed(6), g: g.toFixed(6), b: b.toFixed(6) };
}

// ── Plist generation ─────────────────────────────────────────────────

function colorEntry(key, hex) {
  const { r, g, b } = hexToFloats(hex);
  return `\t<key>${key}</key>
\t<dict>
\t\t<key>Alpha Component</key>
\t\t<real>1</real>
\t\t<key>Blue Component</key>
\t\t<real>${b}</real>
\t\t<key>Color Space</key>
\t\t<string>sRGB</string>
\t\t<key>Green Component</key>
\t\t<real>${g}</real>
\t\t<key>Red Component</key>
\t\t<real>${r}</real>
\t</dict>`;
}

function generateProfile(palette) {
  const entries = [];

  // ANSI colors 0-15
  for (let i = 0; i < 16; i++) {
    entries.push(colorEntry(`Ansi ${i} Color`, palette.ansi[i]));
  }

  // Special colors
  entries.push(colorEntry("Background Color", palette.background));
  entries.push(colorEntry("Bold Color", palette.foreground));
  entries.push(colorEntry("Cursor Color", palette.cursor));
  entries.push(colorEntry("Cursor Text Color", palette.background));
  entries.push(colorEntry("Foreground Color", palette.foreground));
  entries.push(colorEntry("Link Color", palette.ansi[4])); // blue slot
  entries.push(colorEntry("Selected Text Color", palette.selectionFg));
  entries.push(colorEntry("Selection Color", palette.selectionBg));

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
${entries.join("\n")}
</dict>
</plist>
`;
}

// ── Write files ──────────────────────────────────────────────────────

const profiles = [
  { name: "Delightful.itermcolors", palette: light },
  { name: "Delightful-Dark.itermcolors", palette: dark },
];

for (const { name, palette } of profiles) {
  const path = join(outDir, name);
  writeFileSync(path, generateProfile(palette));
  console.log(`  wrote ${name}`);
}

console.log("Done.");
