/**
 * Delightful Design System — VSCode Theme Generator
 *
 * Converts OKLCH tokens from the design system to hex and generates
 * both light and dark VSCode color theme JSON files.
 *
 * Usage: node generate-themes.mjs
 * Requires: culori (npm install)
 */

import { formatHex, parse, clampChroma } from 'culori';
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const THEMES_DIR = join(__dirname, '..', 'themes');

// ---------------------------------------------------------------------------
// OKLCH → Hex conversion
// ---------------------------------------------------------------------------

function toHex(oklchStr) {
  const color = parse(oklchStr);
  if (!color) throw new Error(`Failed to parse color: ${oklchStr}`);
  // Clamp to sRGB gamut before formatting
  return formatHex(clampChroma(color, 'oklch'));
}

function toHexAlpha(oklchStr, alpha) {
  const hex = toHex(oklchStr);
  const a = Math.round(alpha * 255).toString(16).padStart(2, '0');
  return hex + a;
}

// ---------------------------------------------------------------------------
// TIER 1 — Primitives (OKLCH strings, never used directly in themes)
// ---------------------------------------------------------------------------

const primitives = {
  neutral: {
    0:   'oklch(1.00 0.000 0)',
    25:  'oklch(0.988 0.006 70)',
    50:  'oklch(0.980 0.008 70)',
    100: 'oklch(0.960 0.010 70)',
    150: 'oklch(0.940 0.012 70)',
    200: 'oklch(0.920 0.012 70)',
    300: 'oklch(0.860 0.014 70)',
    400: 'oklch(0.750 0.014 70)',
    500: 'oklch(0.600 0.012 70)',
    600: 'oklch(0.480 0.010 70)',
    700: 'oklch(0.350 0.010 70)',
    800: 'oklch(0.250 0.012 60)',
    900: 'oklch(0.180 0.012 60)',
    950: 'oklch(0.140 0.012 60)',
  },
  pink: {
    100: 'oklch(0.920 0.060 350)',
    200: 'oklch(0.840 0.140 350)',
    300: 'oklch(0.720 0.220 350)',
    400: 'oklch(0.640 0.270 350)',
    500: 'oklch(0.560 0.280 350)',
  },
  red: {
    100: 'oklch(0.930 0.050 20)',
    200: 'oklch(0.850 0.110 20)',
    300: 'oklch(0.720 0.180 20)',
    400: 'oklch(0.620 0.220 20)',
    500: 'oklch(0.540 0.230 20)',
  },
  gold: {
    100: 'oklch(0.960 0.050 85)',
    200: 'oklch(0.920 0.110 85)',
    300: 'oklch(0.870 0.160 85)',
    400: 'oklch(0.840 0.175 85)',
    500: 'oklch(0.820 0.165 84)',
  },
  cyan: {
    100: 'oklch(0.930 0.038 210)',
    200: 'oklch(0.850 0.085 210)',
    300: 'oklch(0.740 0.125 210)',
    400: 'oklch(0.650 0.148 210)',
    500: 'oklch(0.570 0.155 210)',
  },
  green: {
    100: 'oklch(0.930 0.042 148)',
    200: 'oklch(0.840 0.095 148)',
    300: 'oklch(0.730 0.145 148)',
    400: 'oklch(0.630 0.170 148)',
    500: 'oklch(0.540 0.165 148)',
  },
  purple: {
    100: 'oklch(0.940 0.040 300)',
    200: 'oklch(0.860 0.080 300)',
    300: 'oklch(0.720 0.160 300)',
    400: 'oklch(0.640 0.220 300)',
    500: 'oklch(0.560 0.260 300)',
  },
};

// ---------------------------------------------------------------------------
// TIER 2 — Semantic Tokens (OKLCH strings)
// ---------------------------------------------------------------------------

const light = {
  bgPage:       'oklch(0.982 0.008 70)',
  bgSurface:    'oklch(0.995 0.004 70)',
  bgElevated:   'oklch(1.00 0.00 0)',
  bgSubtle:     'oklch(0.965 0.012 70)',
  bgMuted:      'oklch(0.948 0.014 70)',

  textPrimary:   'oklch(0.200 0.015 60)',
  textSecondary: 'oklch(0.420 0.015 60)',
  textMuted:     'oklch(0.560 0.012 60)',
  textOnAccent:  'oklch(1.00 0.000 0)',
  textOnGold:    'oklch(0.220 0.020 70)',

  borderSubtle: 'oklch(0.820 0.015 70)',

  accentPrimary:       'oklch(0.640 0.270 350)',
  accentPrimaryHover:  'oklch(0.580 0.280 350)',
  accentPrimarySubtle: 'oklch(0.955 0.040 350)',
  accentPrimaryText:   'oklch(0.560 0.270 350)',

  accentDanger:       'oklch(0.620 0.220 20)',
  accentDangerHover:  'oklch(0.570 0.230 20)',
  accentDangerSubtle: 'oklch(0.950 0.040 20)',
  accentDangerText:   'oklch(0.550 0.220 20)',

  accentGold:       'oklch(0.840 0.175 85)',
  accentGoldHover:  'oklch(0.820 0.165 84)',
  accentGoldSubtle: 'oklch(0.965 0.060 85)',
  accentGoldText:   'oklch(0.440 0.130 85)',

  accentCyan:       'oklch(0.650 0.148 210)',
  accentCyanHover:  'oklch(0.600 0.150 210)',
  accentCyanSubtle: 'oklch(0.945 0.030 210)',
  accentCyanText:   'oklch(0.520 0.148 210)',

  accentGreen:       'oklch(0.630 0.170 148)',
  accentGreenHover:  'oklch(0.580 0.165 148)',
  accentGreenSubtle: 'oklch(0.945 0.035 148)',
  accentGreenText:   'oklch(0.480 0.165 148)',

  accentPurple:       'oklch(0.640 0.220 300)',
  accentPurpleHover:  'oklch(0.580 0.230 300)',
  accentPurpleSubtle: 'oklch(0.950 0.035 300)',
  accentPurpleText:   'oklch(0.520 0.220 300)',
};

const dark = {
  bgPage:       'oklch(0.140 0.014 65)',
  bgSurface:    'oklch(0.165 0.015 65)',
  bgElevated:   'oklch(0.190 0.015 65)',
  bgSubtle:     'oklch(0.210 0.015 65)',
  bgMuted:      'oklch(0.180 0.013 65)',

  textPrimary:   'oklch(0.935 0.008 70)',
  textSecondary: 'oklch(0.690 0.012 70)',
  textMuted:     'oklch(0.540 0.010 70)',
  textOnAccent:  'oklch(1.00 0.000 0)',
  textOnGold:    'oklch(0.140 0.014 65)',

  borderSubtle: 'oklch(0.330 0.015 65)',

  accentPrimary:       'oklch(0.700 0.230 350)',
  accentPrimaryHover:  'oklch(0.740 0.220 350)',
  accentPrimarySubtle: 'oklch(0.250 0.065 350)',
  accentPrimaryText:   'oklch(0.750 0.210 350)',

  accentDanger:       'oklch(0.660 0.200 20)',
  accentDangerHover:  'oklch(0.700 0.190 20)',
  accentDangerSubtle: 'oklch(0.250 0.055 20)',
  accentDangerText:   'oklch(0.720 0.180 20)',

  accentGold:       'oklch(0.840 0.170 85)',
  accentGoldHover:  'oklch(0.870 0.155 84)',
  accentGoldSubtle: 'oklch(0.260 0.065 85)',
  accentGoldText:   'oklch(0.870 0.155 85)',

  accentCyan:       'oklch(0.720 0.140 210)',
  accentCyanHover:  'oklch(0.760 0.130 210)',
  accentCyanSubtle: 'oklch(0.250 0.045 210)',
  accentCyanText:   'oklch(0.780 0.130 210)',

  accentGreen:       'oklch(0.680 0.155 148)',
  accentGreenHover:  'oklch(0.720 0.145 148)',
  accentGreenSubtle: 'oklch(0.250 0.048 148)',
  accentGreenText:   'oklch(0.740 0.145 148)',

  accentPurple:       'oklch(0.700 0.200 300)',
  accentPurpleHover:  'oklch(0.740 0.190 300)',
  accentPurpleSubtle: 'oklch(0.250 0.055 300)',
  accentPurpleText:   'oklch(0.760 0.180 300)',
};

// Canonical syntax colors from delightful-design-system.html:2792-2798
// Designed for dark backgrounds
const syntaxDark = {
  keyword:  'oklch(0.750 0.200 350)',
  string:   'oklch(0.870 0.160 85)',
  function: 'oklch(0.750 0.130 210)',
  comment:  'oklch(0.550 0.010 60)',
  number:   'oklch(0.800 0.140 148)',
  operator: 'oklch(0.700 0.000 0)',
  property: 'oklch(0.780 0.100 350)',
};

// Terminal ANSI palette — reused from Ghostty (validated hex)
const ansi = {
  black:         '#16100c',
  red:           '#ed324b',
  green:         '#22a448',
  yellow:        '#febf00',
  blue:          '#00a6c0',
  magenta:       '#f600a3',
  cyan:          '#17c0d6',
  white:         '#f6f1eb',
  brightBlack:   '#615d58',
  brightRed:     '#ff6e74',
  brightGreen:   '#60c072',
  brightYellow:  '#ffcb3f',
  brightBlue:    '#88ddec',
  brightMagenta: '#ff5cb8',
  brightCyan:    '#88ddec',
  brightWhite:   '#ffffff',
};

// ---------------------------------------------------------------------------
// Build workbench colors
// ---------------------------------------------------------------------------

function buildColors(t) {
  const h = (s) => toHex(s);
  const ha = (s, a) => toHexAlpha(s, a);

  return {
    // Global
    'foreground': h(t.textPrimary),
    'descriptionForeground': h(t.textSecondary),
    'disabledForeground': h(t.textMuted),
    'errorForeground': h(t.accentDanger),
    'icon.foreground': h(t.textSecondary),
    'focusBorder': h(t.accentPrimary),
    'selection.background': ha(t.accentPrimarySubtle, 0.8),
    'widget.shadow': ha(t.textPrimary, 0.10),
    'widget.border': h(t.borderSubtle),

    // Text
    'textLink.foreground': h(t.accentPrimaryText),
    'textLink.activeForeground': h(t.accentPrimaryHover),
    'textBlockQuote.background': h(t.bgSubtle),
    'textBlockQuote.border': h(t.accentPrimary),
    'textCodeBlock.background': h(t.bgMuted),
    'textPreformat.foreground': h(t.accentDangerText),
    'textSeparator.foreground': h(t.borderSubtle),

    // Editor
    'editor.background': h(t.bgSurface),
    'editor.foreground': h(t.textPrimary),
    'editorCursor.foreground': h(t.accentPrimary),
    'editor.lineHighlightBackground': h(t.bgSubtle),
    'editor.selectionBackground': ha(t.accentPrimarySubtle, 0.8),
    'editor.selectionHighlightBackground': ha(t.accentGoldSubtle, 0.5),
    'editor.wordHighlightBackground': ha(t.accentCyanSubtle, 0.5),
    'editor.wordHighlightStrongBackground': ha(t.accentGreenSubtle, 0.5),
    'editor.findMatchBackground': h(t.accentGoldSubtle),
    'editor.findMatchHighlightBackground': ha(t.accentGoldSubtle, 0.5),
    'editor.hoverHighlightBackground': ha(t.bgSubtle, 0.6),
    'editor.rangeHighlightBackground': ha(t.bgSubtle, 0.5),
    'editorLink.activeForeground': h(t.accentPrimaryText),
    'editorWhitespace.foreground': ha(t.borderSubtle, 0.4),
    'editorIndentGuide.background': ha(t.borderSubtle, 0.35),
    'editorIndentGuide.activeBackground': h(t.borderSubtle),
    'editorRuler.foreground': ha(t.borderSubtle, 0.4),
    'editorLineNumber.foreground': h(t.textMuted),
    'editorLineNumber.activeForeground': h(t.textPrimary),
    'editorBracketMatch.background': ha(t.accentCyanSubtle, 0.5),
    'editorBracketMatch.border': h(t.accentCyan),
    'editorBracketHighlight.foreground1': h(t.accentPrimary),
    'editorBracketHighlight.foreground2': h(t.accentCyan),
    'editorBracketHighlight.foreground3': h(t.accentGold),
    'editorBracketHighlight.foreground4': h(t.accentGreen),
    'editorBracketHighlight.foreground5': h(t.accentDanger),
    'editorBracketHighlight.foreground6': h(t.accentPrimaryText),
    'editor.foldBackground': ha(t.bgMuted, 0.4),
    'editorCodeLens.foreground': h(t.textMuted),
    'editorInlayHint.foreground': h(t.textMuted),
    'editorInlayHint.background': ha(t.bgMuted, 0.5),
    'editorGhostText.foreground': h(t.textMuted),

    // Errors, warnings, info
    'editorError.foreground': h(t.accentDanger),
    'editorWarning.foreground': h(t.accentGold),
    'editorInfo.foreground': h(t.accentPrimary),
    'editorHint.foreground': h(t.accentGreen),
    'problemsErrorIcon.foreground': h(t.accentDanger),
    'problemsWarningIcon.foreground': h(t.accentGold),
    'problemsInfoIcon.foreground': h(t.accentPrimary),

    // Gutter (git decorations in editor)
    'editorGutter.background': h(t.bgSurface),
    'editorGutter.modifiedBackground': h(t.accentCyan),
    'editorGutter.addedBackground': h(t.accentGreen),
    'editorGutter.deletedBackground': h(t.accentDanger),
    'editorGutter.foldingControlForeground': h(t.textMuted),

    // Overview ruler
    'editorOverviewRuler.border': h(t.borderSubtle),
    'editorOverviewRuler.findMatchForeground': ha(t.accentGold, 0.7),
    'editorOverviewRuler.errorForeground': h(t.accentDanger),
    'editorOverviewRuler.warningForeground': h(t.accentGold),
    'editorOverviewRuler.infoForeground': h(t.accentPrimary),
    'editorOverviewRuler.modifiedForeground': h(t.accentCyan),
    'editorOverviewRuler.addedForeground': h(t.accentGreen),
    'editorOverviewRuler.deletedForeground': h(t.accentDanger),
    'editorOverviewRuler.bracketMatchForeground': h(t.accentCyan),

    // Minimap
    'minimap.selectionHighlight': ha(t.accentPrimary, 0.4),
    'minimap.findMatchHighlight': ha(t.accentGold, 0.5),
    'minimap.errorHighlight': ha(t.accentDanger, 0.6),
    'minimap.warningHighlight': ha(t.accentGold, 0.5),
    'minimapSlider.background': ha(t.textMuted, 0.12),
    'minimapSlider.hoverBackground': ha(t.textMuted, 0.20),
    'minimapSlider.activeBackground': ha(t.textMuted, 0.30),
    'minimapGutter.addedBackground': h(t.accentGreen),
    'minimapGutter.modifiedBackground': h(t.accentCyan),
    'minimapGutter.deletedBackground': h(t.accentDanger),

    // Scrollbar
    'scrollbar.shadow': ha(t.textPrimary, 0.08),
    'scrollbarSlider.background': ha(t.textMuted, 0.18),
    'scrollbarSlider.hoverBackground': ha(t.textMuted, 0.30),
    'scrollbarSlider.activeBackground': ha(t.textMuted, 0.45),

    // Diff editor
    'diffEditor.insertedTextBackground': ha(t.accentGreenSubtle, 0.4),
    'diffEditor.removedTextBackground': ha(t.accentDangerSubtle, 0.4),
    'diffEditor.insertedLineBackground': ha(t.accentGreenSubtle, 0.25),
    'diffEditor.removedLineBackground': ha(t.accentDangerSubtle, 0.25),
    'diffEditor.diagonalFill': ha(t.borderSubtle, 0.3),
    'diffEditorOverview.insertedForeground': h(t.accentGreen),
    'diffEditorOverview.removedForeground': h(t.accentDanger),

    // Editor groups and tabs
    'editorGroup.border': h(t.borderSubtle),
    'editorGroupHeader.tabsBackground': h(t.bgPage),
    'tab.activeBackground': h(t.bgSurface),
    'tab.activeForeground': h(t.textPrimary),
    'tab.activeBorderTop': h(t.accentPrimary),
    'tab.inactiveBackground': h(t.bgPage),
    'tab.inactiveForeground': h(t.textSecondary),
    'tab.border': h(t.bgPage),
    'tab.hoverBackground': h(t.bgSubtle),
    'tab.hoverForeground': h(t.textPrimary),
    'tab.unfocusedActiveForeground': h(t.textSecondary),
    'tab.unfocusedInactiveForeground': h(t.textMuted),
    'tab.activeModifiedBorder': h(t.accentPrimary),
    'tab.inactiveModifiedBorder': h(t.textMuted),

    // Activity bar
    'activityBar.background': h(t.bgPage),
    'activityBar.foreground': h(t.textPrimary),
    'activityBar.inactiveForeground': h(t.textMuted),
    'activityBar.border': h(t.borderSubtle),
    'activityBar.activeBorder': h(t.accentPrimary),
    'activityBarBadge.background': h(t.accentPrimary),
    'activityBarBadge.foreground': h(t.textOnAccent),

    // Sidebar
    'sideBar.background': h(t.bgPage),
    'sideBar.foreground': h(t.textSecondary),
    'sideBar.border': h(t.borderSubtle),
    'sideBarTitle.foreground': h(t.textPrimary),
    'sideBarSectionHeader.background': h(t.bgSubtle),
    'sideBarSectionHeader.foreground': h(t.textPrimary),
    'sideBarSectionHeader.border': h(t.borderSubtle),

    // Lists (sidebar, explorer, etc.)
    'list.activeSelectionBackground': h(t.accentPrimarySubtle),
    'list.activeSelectionForeground': h(t.textPrimary),
    'list.activeSelectionIconForeground': h(t.textPrimary),
    'list.inactiveSelectionBackground': h(t.bgMuted),
    'list.inactiveSelectionForeground': h(t.textPrimary),
    'list.hoverBackground': h(t.bgSubtle),
    'list.hoverForeground': h(t.textPrimary),
    'list.focusHighlightForeground': h(t.accentPrimaryText),
    'list.highlightForeground': h(t.accentPrimaryText),
    'list.errorForeground': h(t.accentDanger),
    'list.warningForeground': h(t.accentGoldText),
    'list.invalidItemForeground': h(t.accentDanger),
    'list.deemphasizedForeground': h(t.textMuted),
    'list.filterMatchBackground': ha(t.accentGoldSubtle, 0.6),
    'tree.indentGuidesStroke': h(t.borderSubtle),

    // Title bar
    'titleBar.activeBackground': h(t.bgPage),
    'titleBar.activeForeground': h(t.textPrimary),
    'titleBar.inactiveBackground': h(t.bgPage),
    'titleBar.inactiveForeground': h(t.textMuted),
    'titleBar.border': h(t.borderSubtle),

    // Status bar
    'statusBar.background': h(t.bgPage),
    'statusBar.foreground': h(t.textSecondary),
    'statusBar.border': h(t.borderSubtle),
    'statusBar.debuggingBackground': h(t.accentGold),
    'statusBar.debuggingForeground': h(t.textOnGold),
    'statusBar.noFolderBackground': h(t.bgMuted),
    'statusBar.noFolderForeground': h(t.textSecondary),
    'statusBarItem.hoverBackground': ha(t.textPrimary, 0.10),
    'statusBarItem.activeBackground': ha(t.textPrimary, 0.15),
    'statusBarItem.remoteBackground': h(t.accentCyan),
    'statusBarItem.remoteForeground': h(t.textOnAccent),
    'statusBarItem.errorBackground': h(t.accentDanger),
    'statusBarItem.errorForeground': h(t.textOnAccent),
    'statusBarItem.warningBackground': h(t.accentGold),
    'statusBarItem.warningForeground': h(t.textOnGold),
    'statusBarItem.prominentBackground': h(t.accentPrimary),
    'statusBarItem.prominentForeground': h(t.textOnAccent),

    // Buttons
    'button.background': h(t.accentPrimary),
    'button.foreground': h(t.textOnAccent),
    'button.hoverBackground': h(t.accentPrimaryHover),
    'button.secondaryBackground': h(t.bgMuted),
    'button.secondaryForeground': h(t.textPrimary),
    'button.secondaryHoverBackground': h(t.bgSubtle),

    // Badges
    'badge.background': h(t.accentPrimary),
    'badge.foreground': h(t.textOnAccent),

    // Inputs
    'input.background': h(t.bgElevated),
    'input.foreground': h(t.textPrimary),
    'input.border': h(t.borderSubtle),
    'input.placeholderForeground': h(t.textMuted),
    'inputOption.activeBorder': h(t.accentPrimary),
    'inputOption.activeBackground': ha(t.accentPrimarySubtle, 0.5),
    'inputOption.activeForeground': h(t.textPrimary),
    'inputValidation.errorBackground': h(t.accentDangerSubtle),
    'inputValidation.errorBorder': h(t.accentDanger),
    'inputValidation.warningBackground': h(t.accentGoldSubtle),
    'inputValidation.warningBorder': h(t.accentGold),
    'inputValidation.infoBackground': h(t.accentPrimarySubtle),
    'inputValidation.infoBorder': h(t.accentPrimary),

    // Dropdowns
    'dropdown.background': h(t.bgElevated),
    'dropdown.foreground': h(t.textPrimary),
    'dropdown.border': h(t.borderSubtle),

    // Checkbox
    'checkbox.background': h(t.bgElevated),
    'checkbox.border': h(t.borderSubtle),
    'checkbox.foreground': h(t.accentPrimary),

    // Panels
    'panel.background': h(t.bgPage),
    'panel.border': h(t.borderSubtle),
    'panelTitle.activeForeground': h(t.textPrimary),
    'panelTitle.activeBorder': h(t.accentPrimary),
    'panelTitle.inactiveForeground': h(t.textMuted),
    'panelSectionHeader.background': h(t.bgSubtle),
    'panelSectionHeader.foreground': h(t.textPrimary),
    'panelSectionHeader.border': h(t.borderSubtle),

    // Terminal
    'terminal.background': h(t.bgSurface),
    'terminal.foreground': h(t.textPrimary),
    'terminal.border': h(t.borderSubtle),
    'terminal.selectionBackground': ha(t.accentPrimarySubtle, 0.8),
    'terminal.ansiBlack': ansi.black,
    'terminal.ansiRed': ansi.red,
    'terminal.ansiGreen': ansi.green,
    'terminal.ansiYellow': ansi.yellow,
    'terminal.ansiBlue': ansi.blue,
    'terminal.ansiMagenta': ansi.magenta,
    'terminal.ansiCyan': ansi.cyan,
    'terminal.ansiWhite': ansi.white,
    'terminal.ansiBrightBlack': ansi.brightBlack,
    'terminal.ansiBrightRed': ansi.brightRed,
    'terminal.ansiBrightGreen': ansi.brightGreen,
    'terminal.ansiBrightYellow': ansi.brightYellow,
    'terminal.ansiBrightBlue': ansi.brightBlue,
    'terminal.ansiBrightMagenta': ansi.brightMagenta,
    'terminal.ansiBrightCyan': ansi.brightCyan,
    'terminal.ansiBrightWhite': ansi.brightWhite,
    'terminalCursor.foreground': h(t.accentPrimary),
    'terminalCommandDecoration.defaultBackground': h(t.textMuted),
    'terminalCommandDecoration.successBackground': h(t.accentGreen),
    'terminalCommandDecoration.errorBackground': h(t.accentDanger),

    // Editor widgets (autocomplete, hover, etc.)
    'editorWidget.background': h(t.bgElevated),
    'editorWidget.foreground': h(t.textPrimary),
    'editorWidget.border': h(t.borderSubtle),
    'editorSuggestWidget.background': h(t.bgElevated),
    'editorSuggestWidget.border': h(t.borderSubtle),
    'editorSuggestWidget.foreground': h(t.textPrimary),
    'editorSuggestWidget.highlightForeground': h(t.accentPrimaryText),
    'editorSuggestWidget.selectedBackground': h(t.accentPrimarySubtle),
    'editorSuggestWidget.selectedForeground': h(t.textPrimary),
    'editorHoverWidget.background': h(t.bgElevated),
    'editorHoverWidget.border': h(t.borderSubtle),
    'editorHoverWidget.foreground': h(t.textPrimary),

    // Peek view
    'peekView.border': h(t.accentPrimary),
    'peekViewTitle.background': h(t.bgSubtle),
    'peekViewTitleLabel.foreground': h(t.textPrimary),
    'peekViewTitleDescription.foreground': h(t.textSecondary),
    'peekViewEditor.background': h(t.bgSurface),
    'peekViewEditor.matchHighlightBackground': ha(t.accentGoldSubtle, 0.6),
    'peekViewResult.background': h(t.bgPage),
    'peekViewResult.fileForeground': h(t.textPrimary),
    'peekViewResult.lineForeground': h(t.textMuted),
    'peekViewResult.selectionBackground': h(t.accentPrimarySubtle),
    'peekViewResult.selectionForeground': h(t.textPrimary),
    'peekViewResult.matchHighlightBackground': h(t.accentGoldSubtle),

    // Merge conflict
    'merge.currentHeaderBackground': ha(t.accentGreenSubtle, 0.6),
    'merge.currentContentBackground': ha(t.accentGreenSubtle, 0.3),
    'merge.incomingHeaderBackground': ha(t.accentCyanSubtle, 0.6),
    'merge.incomingContentBackground': ha(t.accentCyanSubtle, 0.3),

    // Git decorations
    'gitDecoration.addedResourceForeground': h(t.accentGreen),
    'gitDecoration.modifiedResourceForeground': h(t.accentGoldText),
    'gitDecoration.deletedResourceForeground': h(t.accentDanger),
    'gitDecoration.renamedResourceForeground': h(t.accentCyan),
    'gitDecoration.untrackedResourceForeground': h(t.accentGreen),
    'gitDecoration.conflictingResourceForeground': h(t.accentDanger),
    'gitDecoration.ignoredResourceForeground': h(t.textMuted),
    'gitDecoration.stageModifiedResourceForeground': h(t.accentGoldText),
    'gitDecoration.stageDeletedResourceForeground': h(t.accentDanger),

    // Notifications
    'notificationCenter.border': h(t.borderSubtle),
    'notifications.background': h(t.bgElevated),
    'notifications.foreground': h(t.textPrimary),
    'notifications.border': h(t.borderSubtle),
    'notificationsErrorIcon.foreground': h(t.accentDanger),
    'notificationsWarningIcon.foreground': h(t.accentGold),
    'notificationsInfoIcon.foreground': h(t.accentPrimary),
    'notificationLink.foreground': h(t.accentPrimaryText),

    // Quick input (command palette)
    'quickInput.background': h(t.bgElevated),
    'quickInput.foreground': h(t.textPrimary),
    'quickInputList.focusBackground': h(t.accentPrimarySubtle),
    'quickInputList.focusForeground': h(t.textPrimary),
    'quickInputList.focusIconForeground': h(t.textPrimary),
    'quickInputTitle.background': h(t.bgSubtle),
    'pickerGroup.border': h(t.borderSubtle),
    'pickerGroup.foreground': h(t.accentPrimaryText),

    // Keybinding
    'keybindingLabel.background': h(t.bgMuted),
    'keybindingLabel.foreground': h(t.textPrimary),
    'keybindingLabel.border': h(t.borderSubtle),
    'keybindingLabel.bottomBorder': h(t.borderSubtle),

    // Breadcrumbs
    'breadcrumb.foreground': h(t.textMuted),
    'breadcrumb.focusForeground': h(t.textPrimary),
    'breadcrumb.activeSelectionForeground': h(t.textPrimary),
    'breadcrumbPicker.background': h(t.bgElevated),

    // Search
    'searchEditor.findMatchBackground': h(t.accentGoldSubtle),
    'search.resultsInfoForeground': h(t.textSecondary),

    // Debug
    'debugToolBar.background': h(t.bgElevated),
    'debugExceptionWidget.background': h(t.accentDangerSubtle),
    'debugExceptionWidget.border': h(t.accentDanger),
    'debugTokenExpression.name': h(t.accentCyanText),
    'debugTokenExpression.value': h(t.textPrimary),
    'debugTokenExpression.string': h(t.accentGoldText),
    'debugTokenExpression.boolean': h(t.accentPrimaryText),
    'debugTokenExpression.number': h(t.accentGreenText),
    'debugTokenExpression.error': h(t.accentDanger),

    // Testing
    'testing.iconPassed': h(t.accentGreen),
    'testing.iconFailed': h(t.accentDanger),
    'testing.iconErrored': h(t.accentDanger),
    'testing.iconQueued': h(t.textMuted),
    'testing.iconSkipped': h(t.textMuted),

    // Menu
    'menu.background': h(t.bgElevated),
    'menu.foreground': h(t.textPrimary),
    'menu.selectionBackground': h(t.accentPrimarySubtle),
    'menu.selectionForeground': h(t.textPrimary),
    'menu.separatorBackground': h(t.borderSubtle),
    'menu.border': h(t.borderSubtle),

    // Toolbar
    'toolbar.hoverBackground': h(t.bgSubtle),
    'toolbar.activeBackground': h(t.bgMuted),

    // Sticky scroll
    'editorStickyScroll.background': h(t.bgSurface),
    'editorStickyScroll.border': h(t.borderSubtle),

    // Welcome page
    'welcomePage.tileBackground': h(t.bgSubtle),
    'welcomePage.tileHoverBackground': h(t.bgMuted),
    'welcomePage.tileBorder': h(t.borderSubtle),
    'welcomePage.progress.foreground': h(t.accentPrimary),

    // Settings
    'settings.headerForeground': h(t.textPrimary),
    'settings.modifiedItemIndicator': h(t.accentPrimary),
    'settings.checkboxBackground': h(t.bgElevated),
    'settings.checkboxBorder': h(t.borderSubtle),
    'settings.checkboxForeground': h(t.accentPrimary),
    'settings.textInputBackground': h(t.bgElevated),
    'settings.textInputBorder': h(t.borderSubtle),
    'settings.textInputForeground': h(t.textPrimary),
    'settings.numberInputBackground': h(t.bgElevated),
    'settings.numberInputBorder': h(t.borderSubtle),
    'settings.numberInputForeground': h(t.textPrimary),
    'settings.dropdownBackground': h(t.bgElevated),
    'settings.dropdownBorder': h(t.borderSubtle),
    'settings.dropdownForeground': h(t.textPrimary),
  };
}

// ---------------------------------------------------------------------------
// Build token colors (syntax highlighting)
// ---------------------------------------------------------------------------

function buildLightTokenColors(t) {
  const h = (s) => toHex(s);

  return [
    {
      name: 'Comments',
      scope: ['comment', 'punctuation.definition.comment'],
      settings: { foreground: h(t.textMuted), fontStyle: 'italic' },
    },
    {
      name: 'Keywords',
      scope: ['keyword', 'keyword.control', 'storage.type', 'storage.modifier'],
      settings: { foreground: h(t.accentPrimaryText) },
    },
    {
      name: 'Operators',
      scope: ['keyword.operator', 'keyword.operator.assignment', 'keyword.operator.arithmetic'],
      settings: { foreground: h(t.textSecondary) },
    },
    {
      name: 'Strings',
      scope: ['string', 'string.template', 'string.quoted'],
      settings: { foreground: h(t.accentGoldText) },
    },
    {
      name: 'Numbers',
      scope: ['constant.numeric'],
      settings: { foreground: h(t.accentGreenText) },
    },
    {
      name: 'Constants',
      scope: ['constant.language', 'constant.other', 'support.constant'],
      settings: { foreground: h(t.accentDangerText) },
    },
    {
      name: 'Escape characters',
      scope: ['constant.character.escape'],
      settings: { foreground: h(t.accentDangerText) },
    },
    {
      name: 'Functions',
      scope: ['entity.name.function', 'support.function', 'meta.function-call'],
      settings: { foreground: h(t.accentCyanText) },
    },
    {
      name: 'Types and classes',
      scope: ['entity.name.type', 'entity.name.class', 'support.type', 'support.class'],
      settings: { foreground: h(t.accentCyan) },
    },
    {
      name: 'Variables',
      scope: ['variable', 'variable.other.readwrite'],
      settings: { foreground: h(t.textPrimary) },
    },
    {
      name: 'Properties',
      scope: ['variable.other.property', 'support.type.property-name', 'meta.object-literal.key'],
      settings: { foreground: toHex('oklch(0.480 0.180 350)') },
    },
    {
      name: 'Parameters',
      scope: ['variable.parameter'],
      settings: { foreground: h(t.textPrimary), fontStyle: 'italic' },
    },
    {
      name: 'Tags (HTML/JSX)',
      scope: ['entity.name.tag'],
      settings: { foreground: h(t.accentPrimaryText) },
    },
    {
      name: 'Attributes (HTML)',
      scope: ['entity.other.attribute-name'],
      settings: { foreground: h(t.accentGoldText) },
    },
    {
      name: 'CSS property names',
      scope: ['support.type.property-name.css', 'support.type.property-name.scss'],
      settings: { foreground: h(t.accentCyanText) },
    },
    {
      name: 'CSS values',
      scope: ['support.constant.property-value', 'support.constant.color'],
      settings: { foreground: h(t.accentGreenText) },
    },
    {
      name: 'Regex',
      scope: ['string.regexp'],
      settings: { foreground: h(t.accentDanger) },
    },
    {
      name: 'Punctuation',
      scope: ['punctuation.definition.tag', 'punctuation.separator', 'punctuation.terminator'],
      settings: { foreground: h(t.textSecondary) },
    },
    {
      name: 'Template expression',
      scope: ['punctuation.definition.template-expression', 'punctuation.section.embedded'],
      settings: { foreground: h(t.accentPrimaryText) },
    },
    {
      name: 'Markdown heading',
      scope: ['markup.heading', 'entity.name.section'],
      settings: { foreground: h(t.textPrimary), fontStyle: 'bold' },
    },
    {
      name: 'Markdown bold',
      scope: ['markup.bold'],
      settings: { foreground: h(t.textPrimary), fontStyle: 'bold' },
    },
    {
      name: 'Markdown italic',
      scope: ['markup.italic'],
      settings: { foreground: h(t.textSecondary), fontStyle: 'italic' },
    },
    {
      name: 'Markdown link',
      scope: ['markup.underline.link'],
      settings: { foreground: h(t.accentPrimaryText) },
    },
    {
      name: 'Markdown inline code',
      scope: ['markup.inline.raw'],
      settings: { foreground: h(t.accentDangerText) },
    },
    {
      name: 'Markdown list',
      scope: ['markup.list.numbered', 'markup.list.unnumbered'],
      settings: { foreground: h(t.textPrimary) },
    },
    {
      name: 'JSON property name',
      scope: ['support.type.property-name.json'],
      settings: { foreground: h(t.accentCyanText) },
    },
  ];
}

function buildDarkTokenColors(t) {
  const h = (s) => toHex(s);

  return [
    {
      name: 'Comments',
      scope: ['comment', 'punctuation.definition.comment'],
      settings: { foreground: h(syntaxDark.comment), fontStyle: 'italic' },
    },
    {
      name: 'Keywords',
      scope: ['keyword', 'keyword.control', 'storage.type', 'storage.modifier'],
      settings: { foreground: h(syntaxDark.keyword) },
    },
    {
      name: 'Operators',
      scope: ['keyword.operator', 'keyword.operator.assignment', 'keyword.operator.arithmetic'],
      settings: { foreground: h(syntaxDark.operator) },
    },
    {
      name: 'Strings',
      scope: ['string', 'string.template', 'string.quoted'],
      settings: { foreground: h(syntaxDark.string) },
    },
    {
      name: 'Numbers',
      scope: ['constant.numeric'],
      settings: { foreground: h(syntaxDark.number) },
    },
    {
      name: 'Constants',
      scope: ['constant.language', 'constant.other', 'support.constant'],
      settings: { foreground: h(t.accentDangerText) },
    },
    {
      name: 'Escape characters',
      scope: ['constant.character.escape'],
      settings: { foreground: h(t.accentDangerText) },
    },
    {
      name: 'Functions',
      scope: ['entity.name.function', 'support.function', 'meta.function-call'],
      settings: { foreground: h(syntaxDark.function) },
    },
    {
      name: 'Types and classes',
      scope: ['entity.name.type', 'entity.name.class', 'support.type', 'support.class'],
      settings: { foreground: h(t.accentCyanText) },
    },
    {
      name: 'Variables',
      scope: ['variable', 'variable.other.readwrite'],
      settings: { foreground: h(t.textPrimary) },
    },
    {
      name: 'Properties',
      scope: ['variable.other.property', 'support.type.property-name', 'meta.object-literal.key'],
      settings: { foreground: h(syntaxDark.property) },
    },
    {
      name: 'Parameters',
      scope: ['variable.parameter'],
      settings: { foreground: h(t.textPrimary), fontStyle: 'italic' },
    },
    {
      name: 'Tags (HTML/JSX)',
      scope: ['entity.name.tag'],
      settings: { foreground: h(syntaxDark.keyword) },
    },
    {
      name: 'Attributes (HTML)',
      scope: ['entity.other.attribute-name'],
      settings: { foreground: h(syntaxDark.string) },
    },
    {
      name: 'CSS property names',
      scope: ['support.type.property-name.css', 'support.type.property-name.scss'],
      settings: { foreground: h(syntaxDark.function) },
    },
    {
      name: 'CSS values',
      scope: ['support.constant.property-value', 'support.constant.color'],
      settings: { foreground: h(syntaxDark.number) },
    },
    {
      name: 'Regex',
      scope: ['string.regexp'],
      settings: { foreground: h(t.accentDanger) },
    },
    {
      name: 'Punctuation',
      scope: ['punctuation.definition.tag', 'punctuation.separator', 'punctuation.terminator'],
      settings: { foreground: h(t.textSecondary) },
    },
    {
      name: 'Template expression',
      scope: ['punctuation.definition.template-expression', 'punctuation.section.embedded'],
      settings: { foreground: h(t.accentPrimaryText) },
    },
    {
      name: 'Markdown heading',
      scope: ['markup.heading', 'entity.name.section'],
      settings: { foreground: h(t.textPrimary), fontStyle: 'bold' },
    },
    {
      name: 'Markdown bold',
      scope: ['markup.bold'],
      settings: { foreground: h(t.textPrimary), fontStyle: 'bold' },
    },
    {
      name: 'Markdown italic',
      scope: ['markup.italic'],
      settings: { foreground: h(t.textSecondary), fontStyle: 'italic' },
    },
    {
      name: 'Markdown link',
      scope: ['markup.underline.link'],
      settings: { foreground: h(t.accentPrimaryText) },
    },
    {
      name: 'Markdown inline code',
      scope: ['markup.inline.raw'],
      settings: { foreground: h(t.accentDangerText) },
    },
    {
      name: 'Markdown list',
      scope: ['markup.list.numbered', 'markup.list.unnumbered'],
      settings: { foreground: h(t.textPrimary) },
    },
    {
      name: 'JSON property name',
      scope: ['support.type.property-name.json'],
      settings: { foreground: h(syntaxDark.function) },
    },
  ];
}

// ---------------------------------------------------------------------------
// Build semantic token colors
// ---------------------------------------------------------------------------

function buildSemanticTokenColors(t) {
  const h = (s) => toHex(s);

  return {
    'variable.readonly': h(t.accentDangerText),
    'parameter': { foreground: h(t.textPrimary), italic: true },
    'property.declaration': h(t === light
      ? 'oklch(0.480 0.180 350)'
      : syntaxDark.property),
    'function.declaration': { foreground: h(t === light ? t.accentCyanText : syntaxDark.function), bold: true },
    'type': h(t === light ? t.accentCyan : t.accentCyanText),
    'interface': h(t === light ? t.accentCyan : t.accentCyanText),
    'enum': h(t === light ? t.accentCyan : t.accentCyanText),
    'enumMember': h(t.accentDangerText),
    'namespace': h(t.textSecondary),
  };
}

// ---------------------------------------------------------------------------
// Generate and write theme files
// ---------------------------------------------------------------------------

function generateTheme(name, type, tokens) {
  const isLight = type === 'light';
  const colors = buildColors(tokens);
  const tokenColors = isLight ? buildLightTokenColors(tokens) : buildDarkTokenColors(tokens);
  const semanticTokenColors = buildSemanticTokenColors(tokens);

  return {
    name,
    type,
    semanticHighlighting: true,
    colors,
    tokenColors,
    semanticTokenColors,
  };
}

const lightTheme = generateTheme('Delightful Light', 'light', light);
const darkTheme = generateTheme('Delightful Dark', 'dark', dark);

writeFileSync(
  join(THEMES_DIR, 'delightful-light-color-theme.json'),
  JSON.stringify(lightTheme, null, 2) + '\n',
);

writeFileSync(
  join(THEMES_DIR, 'delightful-dark-color-theme.json'),
  JSON.stringify(darkTheme, null, 2) + '\n',
);

console.log('Generated:');
console.log('  themes/delightful-light-color-theme.json');
console.log('  themes/delightful-dark-color-theme.json');
