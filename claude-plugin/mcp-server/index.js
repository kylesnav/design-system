import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pluginRoot = join(__dirname, "..");

// ---------------------------------------------------------------------------
// 1. File loading
// ---------------------------------------------------------------------------

function readPluginFile(relativePath) {
  return readFileSync(join(pluginRoot, relativePath), "utf-8");
}

const RESOURCE_FILES = {
  "delightful://reference/tokens": { path: "reference/tokens.md", mime: "text/markdown", name: "Token Reference", desc: "All 3 tiers of token values — primitives, semantic, and component" },
  "delightful://reference/components": { path: "reference/components.md", mime: "text/markdown", name: "Component Patterns", desc: "20+ component patterns with CSS and HTML examples" },
  "delightful://reference/interactions": { path: "reference/interactions.md", mime: "text/markdown", name: "Interactions & Motion", desc: "POUNCE/SINK press patterns, animation keyframes, motion timing" },
  "delightful://reference/composition": { path: "reference/composition.md", mime: "text/markdown", name: "Composition & Layout", desc: "Page layouts, responsive patterns, utility classes" },
  "delightful://reference/philosophy": { path: "reference/philosophy.md", mime: "text/markdown", name: "Design Philosophy", desc: "Design rationale — why OKLCH, why neo-brutalism, why warm neutrals" },
  "delightful://reference/accessibility": { path: "reference/accessibility.md", mime: "text/markdown", name: "Accessibility", desc: "WCAG contract, focus model, keyboard navigation, reduced motion" },
  "delightful://reference/porting-guide": { path: "reference/porting-guide.md", mime: "text/markdown", name: "Porting Guide", desc: "How to create new platform themes from the token system" },
  "delightful://reference/governance": { path: "reference/governance.md", mime: "text/markdown", name: "Governance", desc: "How to safely extend the token system" },
  "delightful://reference/animations": { path: "reference/animations.md", mime: "text/markdown", name: "CSS Animations", desc: "56 animations across 10 categories with usage guidance" },
  "delightful://reference/color-system": { path: "reference/color-system.md", mime: "text/markdown", name: "Color System", desc: "OKLCH color architecture, palette composition, dark mode shift rules" },
  "delightful://reference/motion-js": { path: "reference/motion-js.md", mime: "text/markdown", name: "JS Motion Patterns", desc: "Spring physics, FLIP layout, particles, gestures — vanilla JS recipes" },
  "delightful://themes/css": { path: "themes/css/delightful-tokens.css", mime: "text/css", name: "CSS Tokens", desc: "Full CSS custom property stylesheet — all 3 tiers" },
  "delightful://themes/tailwind": { path: "themes/tailwind/delightful-preset.js", mime: "application/javascript", name: "Tailwind Preset", desc: "Tailwind v3 preset mapping all tokens to utility classes" },
  "delightful://themes/figma": { path: "themes/figma/tokens.json", mime: "application/json", name: "Figma Tokens", desc: "Design Tokens Community Group format for Figma/Tokens Studio" },
};

const fileContents = new Map();
for (const [uri, info] of Object.entries(RESOURCE_FILES)) {
  fileContents.set(uri, readPluginFile(info.path));
}

// ---------------------------------------------------------------------------
// 2. Token parser
// ---------------------------------------------------------------------------

const tokens = [];

function parseTokenBlock(css, tier, theme) {
  const re = /--([\w-]+)\s*:\s*([^;]+);/g;
  let m;
  while ((m = re.exec(css)) !== null) {
    const name = m[1];
    const value = m[2].trim();
    const category = categorizeToken(name);
    tokens.push({ name, value, tier, theme, category });
  }
}

function categorizeToken(name) {
  if (name.startsWith("primitive-")) return "color";
  if (name.startsWith("bg-")) return "background";
  if (name.startsWith("text-")) return "text";
  if (name.startsWith("border-")) return "border";
  if (name.startsWith("accent-")) return "accent";
  if (name.startsWith("status-")) return "status";
  if (name.startsWith("shadow-")) return "shadow";
  if (name.startsWith("focus-")) return "focus";
  if (name.startsWith("overlay-")) return "overlay";
  if (name.startsWith("space-")) return "spacing";
  if (name.startsWith("radius-")) return "radius";
  if (name.startsWith("control-")) return "control";
  if (name.startsWith("step-") || name.startsWith("ui-text-")) return "typography";
  if (name.startsWith("font-")) return "font";
  if (name.startsWith("tracking-") || name.startsWith("leading-")) return "typography";
  if (name.startsWith("motion-") || name.startsWith("ease-")) return "motion";
  if (name.startsWith("z-")) return "z-index";
  if (name.startsWith("container-")) return "container";
  if (name.startsWith("btn-")) return "button";
  if (name.startsWith("badge-")) return "badge";
  if (name.startsWith("toggle-")) return "toggle";
  if (name.startsWith("chart-")) return "chart";
  return "other";
}

// Parse the 4 blocks from delightful-tokens.css
const cssSource = fileContents.get("delightful://themes/css");

// Block 1: Tier 1 primitives — first :root { ... }
// Block 2: Tier 2 light — :root, [data-theme="light"] { ... }
// Block 3: Tier 2 dark — [data-theme="dark"] { ... }
// Block 4: Tier 3 component — second :root { ... }

const blockRe = /(?::root\s*,\s*\n\[data-theme="light"\]|\[data-theme="dark"\]|:root)\s*\{([^}]+(?:\{[^}]*\}[^}]*)*)\}/g;
const blocks = [];
let bm;
while ((bm = blockRe.exec(cssSource)) !== null) {
  blocks.push({ header: bm[0].slice(0, bm[0].indexOf("{")), content: bm[1] });
}

// The CSS has a specific order — match by header content
for (const block of blocks) {
  const h = block.header.trim();
  if (h.includes('data-theme="light"')) {
    parseTokenBlock(block.content, "semantic", "light");
  } else if (h.includes('data-theme="dark"')) {
    parseTokenBlock(block.content, "semantic", "dark");
  } else if (tokens.length === 0) {
    // First :root block = primitives
    parseTokenBlock(block.content, "primitive", "all");
  } else {
    // Subsequent :root block = component/tier 3
    parseTokenBlock(block.content, "component", "all");
  }
}

// Category keyword map for search
const CATEGORY_KEYWORDS = {
  color: ["color", "colors", "palette"],
  background: ["background", "bg", "surface"],
  text: ["text", "font-color", "foreground"],
  border: ["border", "stroke", "outline"],
  accent: ["accent", "brand", "primary", "highlight"],
  status: ["status", "info", "error", "warning", "success"],
  shadow: ["shadow", "elevation", "depth"],
  spacing: ["spacing", "space", "gap", "padding", "margin"],
  radius: ["radius", "rounded", "corner"],
  typography: ["typography", "type", "font-size", "text-size", "step", "ui-text"],
  font: ["font", "font-family", "typeface"],
  motion: ["motion", "animation", "transition", "easing", "duration", "timing"],
  "z-index": ["z-index", "z", "layer", "stacking"],
  container: ["container", "width", "max-width"],
  button: ["button", "btn"],
  badge: ["badge"],
  toggle: ["toggle", "switch"],
  chart: ["chart", "data-viz", "visualization"],
  control: ["control", "height", "input-height"],
};

// ---------------------------------------------------------------------------
// 3. Component parser
// ---------------------------------------------------------------------------

const components = new Map();

const componentsSrc = fileContents.get("delightful://reference/components");
const sections = componentsSrc.split(/^(?=## )/m);

for (const section of sections) {
  const headingMatch = section.match(/^## (.+)/);
  if (!headingMatch) continue;
  const rawHeading = headingMatch[1].trim();
  // Normalize: "Button `.btn`" -> "button", "Checkbox & Radio" -> "checkbox & radio"
  const cleanName = rawHeading.replace(/`[^`]*`/g, "").replace(/\s+/g, " ").trim().toLowerCase();
  components.set(cleanName, { heading: rawHeading, content: section.trim() });
}

// ---------------------------------------------------------------------------
// 4. OKLCH color math (zero dependencies)
// ---------------------------------------------------------------------------

// sRGB gamma decode
function linearize(c) {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

// Linear sRGB -> OKLab (Bjorn Ottosson's matrices)
function srgbToOklab(r, g, b) {
  const lr = linearize(r);
  const lg = linearize(g);
  const lb = linearize(b);

  const l_ = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m_ = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s_ = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;

  const l_c = Math.cbrt(l_);
  const m_c = Math.cbrt(m_);
  const s_c = Math.cbrt(s_);

  return {
    L: 0.2104542553 * l_c + 0.7936177850 * m_c - 0.0040720468 * s_c,
    a: 1.9779984951 * l_c - 2.4285922050 * m_c + 0.4505937099 * s_c,
    b: 0.0259040371 * l_c + 0.7827717662 * m_c - 0.8086757660 * s_c,
  };
}

// OKLab -> OKLCH
function oklabToOklch(L, a, b) {
  const C = Math.sqrt(a * a + b * b);
  let H = (Math.atan2(b, a) * 180) / Math.PI;
  if (H < 0) H += 360;
  return { L, C, H };
}

// Parse hex color
function parseHex(hex) {
  hex = hex.replace("#", "");
  if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  return {
    r: parseInt(hex.slice(0, 2), 16) / 255,
    g: parseInt(hex.slice(2, 4), 16) / 255,
    b: parseInt(hex.slice(4, 6), 16) / 255,
  };
}

// Parse any color input to OKLCH
function parseColor(input) {
  const s = input.trim().toLowerCase();

  // oklch(L C H) — direct
  const oklchMatch = s.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
  if (oklchMatch) {
    return { L: parseFloat(oklchMatch[1]), C: parseFloat(oklchMatch[2]), H: parseFloat(oklchMatch[3]) };
  }

  // hex
  if (s.startsWith("#")) {
    const { r, g, b } = parseHex(s);
    const lab = srgbToOklab(r, g, b);
    return oklabToOklch(lab.L, lab.a, lab.b);
  }

  // rgb(r, g, b) or rgb(r g b)
  const rgbMatch = s.match(/rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/);
  if (rgbMatch) {
    const r = parseFloat(rgbMatch[1]) / 255;
    const g = parseFloat(rgbMatch[2]) / 255;
    const b = parseFloat(rgbMatch[3]) / 255;
    const lab = srgbToOklab(r, g, b);
    return oklabToOklch(lab.L, lab.a, lab.b);
  }

  return null;
}

// OKLCH cylindrical distance with hue wrapping
function oklchDistance(a, b) {
  const dL = a.L - b.L;
  const dC = a.C - b.C;
  const dH = Math.abs(a.H - b.H);
  const deltaH = Math.min(dH, 360 - dH);
  const deltaHRad = (deltaH * Math.PI) / 180;
  const chromaTerm = 2 * Math.sqrt(Math.max(0, a.C * b.C)) * Math.sin(deltaHRad / 2);
  return Math.sqrt(dL * dL + dC * dC + chromaTerm * chromaTerm);
}

// Build color token index (only tokens with literal oklch values)
const colorTokens = tokens
  .filter((t) => t.value.startsWith("oklch(") && !t.value.includes("var(") && !t.value.includes("/"))
  .map((t) => {
    const parsed = parseColor(t.value);
    return parsed ? { ...t, oklch: parsed } : null;
  })
  .filter(Boolean);

// ---------------------------------------------------------------------------
// 5. CSS audit engine
// ---------------------------------------------------------------------------

const SPACING_MAP = { 4: "space-1", 6: "space-1-5", 8: "space-2", 12: "space-3", 16: "space-4", 20: "space-5", 24: "space-6", 32: "space-8", 40: "space-10", 48: "space-12", 64: "space-16", 80: "space-20" };

function auditCss(css) {
  const lines = css.split("\n");
  const violations = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    const lineNum = i + 1;

    // Skip comments, empty lines, custom property definitions
    if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("/*")) continue;
    if (trimmed.startsWith("--")) continue; // token definition

    // Skip lines that are purely var() references
    if (/:\s*var\(/.test(trimmed) && !/#|rgb|hsl/.test(trimmed.replace(/var\([^)]*\)/g, ""))) continue;

    // Check: hardcoded hex colors
    const hexInLine = trimmed.replace(/var\([^)]*\)/g, "").replace(/\/\*.*?\*\//g, "");
    const hexMatch = hexInLine.match(/#[0-9a-f]{3,8}\b/i);
    if (hexMatch) {
      const closest = findClosestToken(hexMatch[0]);
      violations.push({ line: lineNum, severity: "error", check: "Hardcoded hex color", found: hexMatch[0], fix: closest ? `Use var(--${closest.name})` : "Use a Delightful token" });
    }

    // Check: hardcoded rgb/rgba
    if (/rgba?\s*\(/.test(hexInLine)) {
      violations.push({ line: lineNum, severity: "error", check: "Hardcoded rgb color", found: trimmed.match(/rgba?\s*\([^)]+\)/)?.[0] || "rgb()", fix: "Use a Delightful token — var(--accent-*) or var(--bg-*)" });
    }

    // Check: hardcoded hsl/hsla
    if (/hsla?\s*\(/.test(hexInLine)) {
      violations.push({ line: lineNum, severity: "error", check: "Hardcoded hsl color", found: trimmed.match(/hsla?\s*\([^)]+\)/)?.[0] || "hsl()", fix: "Use a Delightful OKLCH token" });
    }

    // Check: arbitrary spacing
    const spacingMatch = trimmed.match(/(?:padding|margin|gap|top|bottom|left|right|inset)\s*:\s*(\d+(?:\.\d+)?)(px|rem)/);
    if (spacingMatch && !trimmed.includes("var(")) {
      const val = Math.round(spacingMatch[2] === "rem" ? parseFloat(spacingMatch[1]) * 16 : parseFloat(spacingMatch[1]));
      if (val > 0) {
        const tokenName = SPACING_MAP[val];
        violations.push({ line: lineNum, severity: "error", check: "Arbitrary spacing", found: `${spacingMatch[1]}${spacingMatch[2]}`, fix: tokenName ? `Use var(--${tokenName})` : `Use a --space-* token (nearest: ${val}px)` });
      }
    }

    // Check: arbitrary font-size
    if (/font-size\s*:\s*[\d.]+(px|rem|em)/.test(trimmed) && !trimmed.includes("var(")) {
      violations.push({ line: lineNum, severity: "error", check: "Arbitrary font-size", found: trimmed.match(/font-size\s*:\s*[^;]+/)?.[0] || "", fix: "Use var(--step-*) for content or var(--ui-text-*) for controls" });
    }

    // Check: raw transition/animation duration
    if (/transition[^:]*:.*\d+m?s/.test(trimmed) && !trimmed.includes("var(--motion") && !trimmed.includes("var(--ease")) {
      violations.push({ line: lineNum, severity: "warning", check: "Raw motion value", found: trimmed.match(/\d+m?s/)?.[0] || "", fix: "Use var(--motion-instant|fast|base|slow|deliberate) and var(--ease-*)" });
    }

    // Check: raw cubic-bezier
    if (/cubic-bezier\s*\(/.test(hexInLine)) {
      violations.push({ line: lineNum, severity: "warning", check: "Raw cubic-bezier", found: trimmed.match(/cubic-bezier\([^)]+\)/)?.[0] || "", fix: "Use var(--ease-out|bounce|smooth|slam|elastic|spring-gentle|spring-bouncy)" });
    }

    // Check: arbitrary z-index
    if (/z-index\s*:\s*\d+/.test(trimmed) && !trimmed.includes("var(")) {
      violations.push({ line: lineNum, severity: "info", check: "Arbitrary z-index", found: trimmed.match(/z-index\s*:\s*\d+/)?.[0] || "", fix: "Use var(--z-base|sticky|fixed|overlay|modal|toast|tooltip)" });
    }

    // Check: arbitrary border-radius
    if (/border-radius\s*:\s*\d+(px|rem)/.test(trimmed) && !trimmed.includes("var(") && !trimmed.includes("9999")) {
      violations.push({ line: lineNum, severity: "info", check: "Arbitrary border-radius", found: trimmed.match(/border-radius\s*:\s*[^;]+/)?.[0] || "", fix: "Use var(--radius-sm|md|lg|xl|full)" });
    }
  }

  return violations;
}

function findClosestToken(colorStr) {
  const parsed = parseColor(colorStr);
  if (!parsed) return null;
  let best = null;
  let bestDist = Infinity;
  for (const ct of colorTokens) {
    const d = oklchDistance(parsed, ct.oklch);
    if (d < bestDist) {
      bestDist = d;
      best = ct;
    }
  }
  return best;
}

// ---------------------------------------------------------------------------
// 6. MCP Server setup
// ---------------------------------------------------------------------------

const server = new McpServer(
  { name: "delightful-design-system", version: "0.8.0" },
  {
    instructions:
      "Delightful Design System MCP server — neo-brutalist design system with OKLCH colors, 3-tier tokens, 20+ components, and a complete motion system. Use lookup_token for token values, lookup_component for component patterns, map_color to convert colors to tokens, audit_css to check CSS compliance, and get_token_css for the full stylesheet. Browse delightful:// resources for full reference docs.",
  }
);

// ---------------------------------------------------------------------------
// 7. Resources
// ---------------------------------------------------------------------------

for (const [uri, info] of Object.entries(RESOURCE_FILES)) {
  server.resource(info.name, uri, { mimeType: info.mime, description: info.desc }, () => ({
    contents: [{ uri, mimeType: info.mime, text: fileContents.get(uri) }],
  }));
}

// ---------------------------------------------------------------------------
// 8. Tools
// ---------------------------------------------------------------------------

server.tool(
  "lookup_token",
  "Look up a Delightful Design System token by name or category. Returns value, tier, and usage guidance. Search by exact name (e.g. 'bg-page'), partial name (e.g. 'accent'), or category (e.g. 'spacing', 'color', 'motion').",
  { query: z.string().describe("Token name, partial name, or category to search for"), theme: z.enum(["light", "dark", "both"]).default("both").describe("Which theme context to include") },
  ({ query, theme }) => {
    const q = query.toLowerCase().replace(/^--/, "");
    let results = [];

    // 1. Exact match
    results = tokens.filter((t) => t.name === q);

    // 2. Prefix match
    if (!results.length) results = tokens.filter((t) => t.name.startsWith(q));

    // 3. Substring match
    if (!results.length) results = tokens.filter((t) => t.name.includes(q));

    // 4. Category keyword match
    if (!results.length) {
      for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
        if (keywords.some((kw) => kw.includes(q) || q.includes(kw))) {
          results.push(...tokens.filter((t) => t.category === cat));
          break;
        }
      }
    }

    // Filter by theme
    if (theme !== "both") {
      results = results.filter((t) => t.theme === theme || t.theme === "all");
    }

    // Deduplicate and limit
    const seen = new Set();
    results = results.filter((t) => {
      const key = `${t.name}:${t.theme}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    results = results.slice(0, 20);

    if (!results.length) {
      return { content: [{ type: "text", text: `No tokens found matching "${query}". Try: color, spacing, motion, typography, accent, bg, shadow, radius, z-index, button, toggle, chart.` }] };
    }

    const lines = results.map((t) => `--${t.name}: ${t.value}\n  Tier: ${t.tier} | Category: ${t.category} | Theme: ${t.theme}`);
    return { content: [{ type: "text", text: `Found ${results.length} token(s) matching "${query}":\n\n${lines.join("\n\n")}` }] };
  }
);

server.tool(
  "lookup_component",
  "Look up a Delightful Design System component by name. Returns the full pattern including CSS, HTML examples, variants, and usage notes.",
  { name: z.string().describe("Component name, e.g. 'button', 'card', 'modal', 'toast', 'badge'") },
  ({ name }) => {
    const q = name.toLowerCase().trim();

    // Exact match
    if (components.has(q)) {
      return { content: [{ type: "text", text: components.get(q).content }] };
    }

    // Substring match
    for (const [key, val] of components) {
      if (key.includes(q) || q.includes(key)) {
        return { content: [{ type: "text", text: val.content }] };
      }
    }

    // List available
    const names = [...components.keys()].join(", ");
    return { content: [{ type: "text", text: `No component found matching "${name}". Available: ${names}` }] };
  }
);

server.tool(
  "map_color",
  "Given a color value (hex, rgb, or oklch), find the closest matching Delightful Design System tokens. Use this to convert arbitrary colors to design system tokens.",
  { color: z.string().describe("Color value as hex (#ff5599), rgb(255, 85, 153), or oklch(0.64 0.27 350)") },
  ({ color }) => {
    const parsed = parseColor(color);
    if (!parsed) {
      return { content: [{ type: "text", text: `Could not parse color "${color}". Supported formats: #hex, rgb(r, g, b), oklch(L C H)` }] };
    }

    // Find top 5 closest
    const ranked = colorTokens
      .map((ct) => ({ ...ct, distance: oklchDistance(parsed, ct.oklch) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);

    if (!ranked.length) {
      return { content: [{ type: "text", text: "No color tokens available for comparison." }] };
    }

    const inputStr = `oklch(${parsed.L.toFixed(3)} ${parsed.C.toFixed(3)} ${parsed.H.toFixed(0)})`;
    const lines = ranked.map((r, i) => {
      const dist = r.distance.toFixed(4);
      const rec = i === 0 ? " ← closest match" : "";
      const tierNote = r.tier === "semantic" ? " (preferred — semantic tier)" : r.tier === "primitive" ? " (primitive — prefer semantic equivalent)" : "";
      return `${i + 1}. --${r.name}: ${r.value}\n   Distance: ${dist}${rec} | Tier: ${r.tier}${tierNote} | Theme: ${r.theme}`;
    });

    // Recommend the best semantic token if available
    const bestSemantic = ranked.find((r) => r.tier === "semantic");
    const recommendation = bestSemantic
      ? `\nRecommendation: Use var(--${bestSemantic.name}) — semantic tokens adapt to dark mode automatically.`
      : `\nRecommendation: Use var(--${ranked[0].name}) — consider if a semantic token better fits the use case.`;

    return { content: [{ type: "text", text: `Input: ${color} → ${inputStr}\n\nClosest Delightful tokens:\n\n${lines.join("\n\n")}${recommendation}` }] };
  }
);

server.tool(
  "audit_css",
  "Audit a CSS snippet for Delightful Design System compliance. Checks for hardcoded colors, arbitrary spacing, non-token font sizes, raw motion values, and more. Returns violations with severity and fix suggestions.",
  { css: z.string().describe("CSS code to audit") },
  ({ css }) => {
    const violations = auditCss(css);

    if (!violations.length) {
      return { content: [{ type: "text", text: "PASS — No Delightful Design System violations found." }] };
    }

    const errors = violations.filter((v) => v.severity === "error");
    const warnings = violations.filter((v) => v.severity === "warning");
    const infos = violations.filter((v) => v.severity === "info");

    const formatViolation = (v) => `  Line ${v.line}: [${v.severity.toUpperCase()}] ${v.check}\n    Found: ${v.found}\n    Fix: ${v.fix}`;

    const sections = [];
    if (errors.length) sections.push(`Errors (${errors.length}):\n${errors.map(formatViolation).join("\n")}`);
    if (warnings.length) sections.push(`Warnings (${warnings.length}):\n${warnings.map(formatViolation).join("\n")}`);
    if (infos.length) sections.push(`Info (${infos.length}):\n${infos.map(formatViolation).join("\n")}`);

    const status = errors.length ? "FAIL" : "WARN";
    const summary = `\n${status} — ${errors.length} error(s), ${warnings.length} warning(s), ${infos.length} info(s)`;

    return { content: [{ type: "text", text: `${sections.join("\n\n")}${summary}` }] };
  }
);

server.tool(
  "get_token_css",
  "Return the complete Delightful Design System CSS token stylesheet. Contains all 3 tiers of tokens (primitives, semantic light/dark, and component). Drop this into any project to use the token system.",
  {},
  () => {
    return { content: [{ type: "text", text: fileContents.get("delightful://themes/css") }] };
  }
);

// ---------------------------------------------------------------------------
// 9. Start
// ---------------------------------------------------------------------------

const transport = new StdioServerTransport();
await server.connect(transport);
