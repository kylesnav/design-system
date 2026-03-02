---
title: "VS Code Emitter Specification"
date: 2026-03-02
type: spec
scope: mvp
status: active
---

# VS Code Emitter Specification

> Defines how `palettes/delightful.json` is transformed into VS Code color theme JSON files — the ~324 color property mappings that style the editor, UI chrome, terminal, syntax highlighting, and debug surfaces.

Cross-references: [[palette-schema]] (input format), [[orchestrator]] (build pipeline), [[terminal-emitters]] (shared ANSI palette).

---

## 1. File & Module

```
emitters/vscode.mjs
```

Pure function module. No file I/O — returns output strings for the orchestrator to write.

---

## 2. Interface

```js
/**
 * @param {object} palette - Parsed palette JSON (validated against schema)
 * @param {object} [options] - Emitter options
 * @param {boolean} [options.indent=2] - JSON indentation spaces
 * @returns {{ files: Array<{ path: string, content: string }>, warnings: string[] }}
 */
export function emit(palette, options = {}) {
  // ...
  return {
    files: [
      { path: 'ports/vscode/themes/delightful-light-color-theme.json', content: '...' },
      { path: 'ports/vscode/themes/delightful-dark-color-theme.json', content: '...' }
    ],
    warnings: []
  };
}
```

### Contract

- **Input**: The full palette object (already validated).
- **Output**: Two theme JSON files (light and dark) plus any warnings.
- **Pure function**: No side effects, no file reads, no network calls.

---

## 3. OKLCH to Hex Conversion

The VS Code Color Theme API requires hex color strings (`#rrggbb` or `#rrggbbaa`). The emitter converts OKLCH values from the palette to hex using **culori**.

### 3.1 Conversion Pipeline

```js
import { oklch, clampChroma, formatHex } from 'culori';

function oklchToHex(oklchString) {
  // Parse "oklch(0.640 0.270 350)" → { mode: 'oklch', l: 0.640, c: 0.270, h: 350 }
  const parsed = oklch(oklchString);
  // Clamp chroma to sRGB gamut (VS Code cannot render out-of-gamut colors)
  const clamped = clampChroma(parsed, 'oklch');
  // Format as hex
  return formatHex(clamped);
}
```

### 3.2 Alpha Channel Handling

For OKLCH values with alpha (e.g., `oklch(0.200 0.015 60 / 0.30)`):

```js
function oklchToHexAlpha(oklchString) {
  const parsed = oklch(oklchString);
  const clamped = clampChroma(parsed, 'oklch');
  return formatHex8(clamped); // Returns #rrggbbaa
}
```

### 3.3 Terminal Colors: No Conversion

Terminal ANSI colors use the **hand-tuned hex values** from `palette.terminal.light` and `palette.terminal.dark` directly. These are hex-authoritative and must NOT be derived from OKLCH.

---

## 4. Input: Palette JSON Keys Used

| Key | Purpose |
|---|---|
| `primitives` | Raw OKLCH scales — converted to hex for editor/UI mappings |
| `semantic.light` | Semantic tokens — converted to hex for light theme |
| `semantic.dark` | Semantic tokens — converted to hex for dark theme |
| `terminal.light` | Hand-tuned hex values for light theme ANSI colors |
| `terminal.dark` | Hand-tuned hex values for dark theme ANSI colors |

---

## 5. Output: Theme JSON Structure

Each theme file follows the VS Code Color Theme API:

```json
{
  "$schema": "vscode://schemas/color-theme",
  "name": "Delightful Light",
  "type": "light",
  "colors": {
    "editor.background": "#fdf8f3",
    "editor.foreground": "#2d2519",
    ...
  },
  "semanticHighlighting": true,
  "semanticTokenColors": {
    ...
  },
  "tokenColors": [
    {
      "scope": ["comment", "punctuation.definition.comment"],
      "settings": {
        "foreground": "#8a7e72",
        "fontStyle": "italic"
      }
    },
    ...
  ]
}
```

### Top-level fields

| Field | Light | Dark |
|---|---|---|
| `name` | `"Delightful Light"` | `"Delightful Dark"` |
| `type` | `"light"` | `"dark"` |
| `semanticHighlighting` | `true` | `true` |

---

## 6. Color Property Mappings (~324 properties)

The following documents every VS Code color property category and its mapping to palette tokens.

### 6.1 Editor Core

| VS Code Property | Palette Token (semantic) | Purpose |
|---|---|---|
| `editor.background` | `bg-page` | Main editor background |
| `editor.foreground` | `text-primary` | Default editor text |
| `editor.lineHighlightBackground` | `bg-subtle` | Current line highlight |
| `editor.lineHighlightBorder` | (transparent) | Current line border |
| `editor.selectionBackground` | `accent-primary-subtle` | Selected text background |
| `editor.selectionForeground` | `text-primary` | Selected text foreground |
| `editor.inactiveSelectionBackground` | `bg-muted` | Selection when editor unfocused |
| `editor.selectionHighlightBackground` | `accent-primary-subtle` (+ alpha) | Other occurrences of selection |
| `editor.findMatchBackground` | `accent-gold-subtle` | Current find match |
| `editor.findMatchHighlightBackground` | `accent-gold-subtle` (+ alpha) | Other find matches |
| `editor.findMatchBorder` | `accent-gold` | Current find match border |
| `editor.wordHighlightBackground` | `accent-cyan-subtle` (+ alpha) | Word highlight on cursor |
| `editor.wordHighlightStrongBackground` | `accent-cyan-subtle` | Write-access word highlight |
| `editor.hoverHighlightBackground` | `bg-subtle` | Hover highlight |
| `editor.rangeHighlightBackground` | `bg-subtle` | Range highlight (e.g., quick open) |
| `editor.linkedEditingBackground` | `accent-primary-subtle` (+ alpha) | Linked editing ranges |

### 6.2 Editor Gutter & Line Numbers

| VS Code Property | Palette Token | Purpose |
|---|---|---|
| `editorLineNumber.foreground` | `text-muted` | Line numbers |
| `editorLineNumber.activeForeground` | `text-primary` | Active line number |
| `editorGutter.background` | `bg-page` | Gutter background |
| `editorGutter.modifiedBackground` | `accent-cyan` | Modified indicator |
| `editorGutter.addedBackground` | `accent-green` | Added indicator |
| `editorGutter.deletedBackground` | `accent-danger` | Deleted indicator |
| `editorGutter.foldingControlForeground` | `text-secondary` | Folding chevrons |

### 6.3 Editor Cursor & Whitespace

| VS Code Property | Palette Token | Purpose |
|---|---|---|
| `editorCursor.foreground` | `accent-primary` | Cursor color |
| `editorCursor.background` | `bg-page` | Cursor background (block mode) |
| `editorWhitespace.foreground` | `border-subtle` | Whitespace symbols |
| `editorIndentGuide.background` | `border-subtle` | Indent guides (inactive) |
| `editorIndentGuide.activeBackground` | `border-default` | Indent guides (active) |

### 6.4 Editor Widget (Suggest, Find, Hover)

| VS Code Property | Palette Token | Purpose |
|---|---|---|
| `editorWidget.background` | `bg-elevated` | Widget background |
| `editorWidget.foreground` | `text-primary` | Widget text |
| `editorWidget.border` | `border-default` | Widget border |
| `editorWidget.resizeBorder` | `accent-primary` | Widget resize handle |
| `editorSuggestWidget.background` | `bg-elevated` | Autocomplete dropdown bg |
| `editorSuggestWidget.border` | `border-default` | Autocomplete border |
| `editorSuggestWidget.foreground` | `text-primary` | Autocomplete text |
| `editorSuggestWidget.highlightForeground` | `accent-primary` | Autocomplete match highlight |
| `editorSuggestWidget.selectedBackground` | `bg-subtle` | Selected suggestion |
| `editorSuggestWidget.selectedForeground` | `text-primary` | Selected suggestion text |
| `editorHoverWidget.background` | `bg-elevated` | Hover tooltip bg |
| `editorHoverWidget.border` | `border-default` | Hover tooltip border |
| `editorHoverWidget.foreground` | `text-primary` | Hover tooltip text |
| `editorHoverWidget.statusBarBackground` | `bg-subtle` | Hover status bar |

### 6.5 Editor Errors, Warnings, Info

| VS Code Property | Palette Token | Purpose |
|---|---|---|
| `editorError.foreground` | `accent-danger` | Error squiggle |
| `editorError.border` | (transparent) | Error border |
| `editorWarning.foreground` | `accent-gold` | Warning squiggle |
| `editorWarning.border` | (transparent) | Warning border |
| `editorInfo.foreground` | `accent-cyan` | Info squiggle |
| `editorInfo.border` | (transparent) | Info border |
| `editorHint.foreground` | `accent-green` | Hint indicator |

### 6.6 Editor Minimap

| VS Code Property | Palette Token | Purpose |
|---|---|---|
| `minimap.findMatchHighlight` | `accent-gold` | Find matches on minimap |
| `minimap.selectionHighlight` | `accent-primary` (+ alpha) | Selection on minimap |
| `minimap.errorHighlight` | `accent-danger` | Errors on minimap |
| `minimap.warningHighlight` | `accent-gold` | Warnings on minimap |
| `minimap.background` | `bg-page` | Minimap background |
| `minimapSlider.background` | `text-muted` (+ alpha) | Minimap slider |
| `minimapSlider.hoverBackground` | `text-secondary` (+ alpha) | Slider hover |
| `minimapSlider.activeBackground` | `text-primary` (+ alpha) | Slider active |
| `minimapGutter.addedBackground` | `accent-green` | Added indicator |
| `minimapGutter.modifiedBackground` | `accent-cyan` | Modified indicator |
| `minimapGutter.deletedBackground` | `accent-danger` | Deleted indicator |

### 6.7 Editor Overview Ruler

| VS Code Property | Palette Token | Purpose |
|---|---|---|
| `editorOverviewRuler.border` | `border-subtle` | Ruler border |
| `editorOverviewRuler.findMatchForeground` | `accent-gold` | Find match marks |
| `editorOverviewRuler.rangeHighlightForeground` | `accent-cyan` (+ alpha) | Range highlights |
| `editorOverviewRuler.selectionHighlightForeground` | `accent-primary` (+ alpha) | Selection highlights |
| `editorOverviewRuler.wordHighlightForeground` | `accent-cyan` (+ alpha) | Word highlights |
| `editorOverviewRuler.modifiedForeground` | `accent-cyan` | Modified |
| `editorOverviewRuler.addedForeground` | `accent-green` | Added |
| `editorOverviewRuler.deletedForeground` | `accent-danger` | Deleted |
| `editorOverviewRuler.errorForeground` | `accent-danger` | Error marks |
| `editorOverviewRuler.warningForeground` | `accent-gold` | Warning marks |
| `editorOverviewRuler.infoForeground` | `accent-cyan` | Info marks |

### 6.8 Bracket Pair Colorization

| VS Code Property | Palette Token | Purpose |
|---|---|---|
| `editorBracketHighlight.foreground1` | `accent-primary` | Bracket pair level 1 |
| `editorBracketHighlight.foreground2` | `accent-cyan` | Bracket pair level 2 |
| `editorBracketHighlight.foreground3` | `accent-gold` | Bracket pair level 3 |
| `editorBracketHighlight.foreground4` | `accent-green` | Bracket pair level 4 |
| `editorBracketHighlight.foreground5` | `accent-purple` | Bracket pair level 5 |
| `editorBracketHighlight.foreground6` | `accent-danger` | Bracket pair level 6 |
| `editorBracketHighlight.unexpectedBracket.foreground` | `accent-danger` | Unexpected bracket |
| `editorBracketMatch.background` | `accent-primary-subtle` | Matching bracket bg |
| `editorBracketMatch.border` | `accent-primary` | Matching bracket border |

### 6.9 Activity Bar

| VS Code Property | Palette Token | Purpose |
|---|---|---|
| `activityBar.background` | `bg-surface` | Activity bar bg |
| `activityBar.foreground` | `text-primary` | Active icon color |
| `activityBar.inactiveForeground` | `text-muted` | Inactive icon color |
| `activityBar.border` | `border-subtle` | Right border |
| `activityBar.activeBorder` | `accent-primary` | Active indicator bar |
| `activityBar.activeBackground` | `bg-subtle` | Active icon bg |
| `activityBarBadge.background` | `accent-primary` | Badge bg (e.g., git count) |
| `activityBarBadge.foreground` | `text-on-accent` | Badge text |

### 6.10 Side Bar

| VS Code Property | Palette Token | Purpose |
|---|---|---|
| `sideBar.background` | `bg-surface` | Side bar bg |
| `sideBar.foreground` | `text-primary` | Side bar text |
| `sideBar.border` | `border-subtle` | Side bar border |
| `sideBar.dropBackground` | `accent-primary-subtle` (+ alpha) | Drag-and-drop bg |
| `sideBarTitle.foreground` | `text-primary` | Side bar title text |
| `sideBarSectionHeader.background` | `bg-subtle` | Section header bg |
| `sideBarSectionHeader.foreground` | `text-primary` | Section header text |
| `sideBarSectionHeader.border` | `border-subtle` | Section header border |

### 6.11 Title Bar

| VS Code Property | Palette Token | Purpose |
|---|---|---|
| `titleBar.activeBackground` | `bg-surface` | Active window title bg |
| `titleBar.activeForeground` | `text-primary` | Active window title text |
| `titleBar.inactiveBackground` | `bg-surface` | Inactive window title bg |
| `titleBar.inactiveForeground` | `text-muted` | Inactive window title text |
| `titleBar.border` | `border-subtle` | Title bar bottom border |

### 6.12 Tab Bar

| VS Code Property | Palette Token | Purpose |
|---|---|---|
| `tab.activeBackground` | `bg-page` | Active tab bg |
| `tab.activeForeground` | `text-primary` | Active tab text |
| `tab.activeBorderTop` | `accent-primary` | Active tab top border |
| `tab.border` | `border-subtle` | Tab separator border |
| `tab.inactiveBackground` | `bg-surface` | Inactive tab bg |
| `tab.inactiveForeground` | `text-secondary` | Inactive tab text |
| `tab.hoverBackground` | `bg-subtle` | Tab hover bg |
| `tab.hoverForeground` | `text-primary` | Tab hover text |
| `tab.unfocusedActiveBackground` | `bg-page` | Unfocused active tab |
| `tab.unfocusedActiveForeground` | `text-secondary` | Unfocused active tab text |
| `tab.unfocusedInactiveBackground` | `bg-surface` | Unfocused inactive tab |
| `tab.unfocusedInactiveForeground` | `text-muted` | Unfocused inactive tab text |
| `editorGroupHeader.tabsBackground` | `bg-surface` | Tab bar background |
| `editorGroupHeader.tabsBorder` | `border-subtle` | Tab bar bottom border |
| `editorGroup.border` | `border-subtle` | Editor group separator |

### 6.13 Status Bar

| VS Code Property | Palette Token | Purpose |
|---|---|---|
| `statusBar.background` | `bg-surface` | Status bar bg |
| `statusBar.foreground` | `text-secondary` | Status bar text |
| `statusBar.border` | `border-subtle` | Status bar top border |
| `statusBar.debuggingBackground` | `accent-gold` | Debug mode bg |
| `statusBar.debuggingForeground` | `text-on-gold` | Debug mode text |
| `statusBar.noFolderBackground` | `bg-muted` | No folder open bg |
| `statusBar.noFolderForeground` | `text-secondary` | No folder text |
| `statusBarItem.hoverBackground` | `bg-subtle` | Item hover bg |
| `statusBarItem.activeBackground` | `bg-muted` | Item active bg |
| `statusBarItem.prominentBackground` | `accent-primary` | Prominent item bg |
| `statusBarItem.prominentForeground` | `text-on-accent` | Prominent item text |
| `statusBarItem.prominentHoverBackground` | `accent-primary-hover` | Prominent hover bg |
| `statusBarItem.remoteBackground` | `accent-cyan` | Remote indicator bg |
| `statusBarItem.remoteForeground` | `text-on-accent` | Remote indicator text |
| `statusBarItem.errorBackground` | `accent-danger` | Error item bg |
| `statusBarItem.errorForeground` | `text-on-accent` | Error item text |
| `statusBarItem.warningBackground` | `accent-gold` | Warning item bg |
| `statusBarItem.warningForeground` | `text-on-gold` | Warning item text |

### 6.14 Panel (Terminal, Output, Debug Console)

| VS Code Property | Palette Token | Purpose |
|---|---|---|
| `panel.background` | `bg-page` | Panel bg |
| `panel.border` | `border-subtle` | Panel top border |
| `panelTitle.activeBorder` | `accent-primary` | Active panel tab indicator |
| `panelTitle.activeForeground` | `text-primary` | Active panel tab text |
| `panelTitle.inactiveForeground` | `text-muted` | Inactive panel tab text |
| `panelInput.border` | `border-default` | Panel input border |
| `panelSection.border` | `border-subtle` | Panel section separator |
| `panelSectionHeader.background` | `bg-subtle` | Section header bg |

### 6.15 Input Controls

| VS Code Property | Palette Token | Purpose |
|---|---|---|
| `input.background` | `bg-elevated` | Input field bg |
| `input.border` | `border-default` | Input field border |
| `input.foreground` | `text-primary` | Input text |
| `input.placeholderForeground` | `text-muted` | Placeholder text |
| `inputOption.activeBackground` | `accent-primary-subtle` | Active option bg |
| `inputOption.activeBorder` | `accent-primary` | Active option border |
| `inputOption.activeForeground` | `text-primary` | Active option text |
| `inputValidation.errorBackground` | `accent-danger-subtle` | Error validation bg |
| `inputValidation.errorBorder` | `accent-danger` | Error validation border |
| `inputValidation.errorForeground` | `text-primary` | Error validation text |
| `inputValidation.warningBackground` | `accent-gold-subtle` | Warning validation bg |
| `inputValidation.warningBorder` | `accent-gold` | Warning validation border |
| `inputValidation.warningForeground` | `text-primary` | Warning validation text |
| `inputValidation.infoBackground` | `accent-primary-subtle` | Info validation bg |
| `inputValidation.infoBorder` | `accent-primary` | Info validation border |
| `inputValidation.infoForeground` | `text-primary` | Info validation text |

### 6.16 Buttons

| VS Code Property | Palette Token | Purpose |
|---|---|---|
| `button.background` | `accent-primary` | Primary button bg |
| `button.foreground` | `text-on-accent` | Primary button text |
| `button.hoverBackground` | `accent-primary-hover` | Button hover bg |
| `button.secondaryBackground` | `bg-subtle` | Secondary button bg |
| `button.secondaryForeground` | `text-primary` | Secondary button text |
| `button.secondaryHoverBackground` | `bg-muted` | Secondary hover bg |
| `button.border` | `border-default` | Button border |

### 6.17 Checkbox

| VS Code Property | Palette Token | Purpose |
|---|---|---|
| `checkbox.background` | `bg-elevated` | Checkbox bg |
| `checkbox.foreground` | `accent-primary` | Checked state color |
| `checkbox.border` | `border-default` | Checkbox border |
| `checkbox.selectBackground` | `bg-elevated` | Select bg |
| `checkbox.selectBorder` | `border-default` | Select border |

### 6.18 Dropdown

| VS Code Property | Palette Token | Purpose |
|---|---|---|
| `dropdown.background` | `bg-elevated` | Dropdown bg |
| `dropdown.border` | `border-default` | Dropdown border |
| `dropdown.foreground` | `text-primary` | Dropdown text |
| `dropdown.listBackground` | `bg-elevated` | Dropdown list bg |

### 6.19 List & Tree

| VS Code Property | Palette Token | Purpose |
|---|---|---|
| `list.activeSelectionBackground` | `accent-primary-subtle` | Active selection bg |
| `list.activeSelectionForeground` | `text-primary` | Active selection text |
| `list.activeSelectionIconForeground` | `text-primary` | Active selection icon |
| `list.inactiveSelectionBackground` | `bg-subtle` | Inactive selection bg |
| `list.inactiveSelectionForeground` | `text-primary` | Inactive selection text |
| `list.hoverBackground` | `bg-subtle` | Hover bg |
| `list.hoverForeground` | `text-primary` | Hover text |
| `list.focusBackground` | `accent-primary-subtle` | Focus bg |
| `list.focusForeground` | `text-primary` | Focus text |
| `list.focusOutline` | `accent-primary` | Focus outline |
| `list.focusHighlightForeground` | `accent-primary` | Focus match highlight |
| `list.highlightForeground` | `accent-primary` | Match highlight |
| `list.invalidItemForeground` | `accent-danger` | Invalid item text |
| `list.errorForeground` | `accent-danger` | Error item text |
| `list.warningForeground` | `accent-gold` | Warning item text |
| `list.filterMatchBackground` | `accent-gold-subtle` | Filter match bg |
| `list.filterMatchBorder` | `accent-gold` | Filter match border |
| `list.deemphasizedForeground` | `text-muted` | De-emphasized text |
| `tree.indentGuidesStroke` | `border-subtle` | Tree indent guides |
| `tree.tableColumnsBorder` | `border-subtle` | Tree table column border |
| `tree.tableOddRowsBackground` | `bg-subtle` | Odd row bg |

### 6.20 Peek View

| VS Code Property | Palette Token | Purpose |
|---|---|---|
| `peekView.border` | `accent-primary` | Peek view border |
| `peekViewEditor.background` | `bg-surface` | Peek editor bg |
| `peekViewEditor.matchHighlightBackground` | `accent-gold-subtle` | Match highlight bg |
| `peekViewEditor.matchHighlightBorder` | `accent-gold` | Match highlight border |
| `peekViewEditorGutter.background` | `bg-surface` | Peek gutter bg |
| `peekViewResult.background` | `bg-subtle` | Result list bg |
| `peekViewResult.fileForeground` | `text-primary` | File name text |
| `peekViewResult.lineForeground` | `text-secondary` | Line text |
| `peekViewResult.matchHighlightBackground` | `accent-gold-subtle` | Match highlight |
| `peekViewResult.selectionBackground` | `accent-primary-subtle` | Selection bg |
| `peekViewResult.selectionForeground` | `text-primary` | Selection text |
| `peekViewTitle.background` | `bg-surface` | Title bg |
| `peekViewTitleDescription.foreground` | `text-secondary` | Title description |
| `peekViewTitleLabel.foreground` | `text-primary` | Title label |

### 6.21 Diff Editor

| VS Code Property | Palette Token | Purpose |
|---|---|---|
| `diffEditor.insertedTextBackground` | `accent-green-subtle` (+ alpha) | Inserted line bg |
| `diffEditor.insertedLineBackground` | `accent-green-subtle` (+ alpha) | Inserted line full bg |
| `diffEditor.removedTextBackground` | `accent-danger-subtle` (+ alpha) | Removed line bg |
| `diffEditor.removedLineBackground` | `accent-danger-subtle` (+ alpha) | Removed line full bg |
| `diffEditor.border` | `border-subtle` | Diff separator |
| `diffEditor.diagonalFill` | `border-subtle` | Unchanged region fill |
| `diffEditorGutter.insertedLineBackground` | `accent-green-subtle` | Gutter added |
| `diffEditorGutter.removedLineBackground` | `accent-danger-subtle` | Gutter removed |
| `diffEditorOverview.insertedForeground` | `accent-green` | Overview ruler added |
| `diffEditorOverview.removedForeground` | `accent-danger` | Overview ruler removed |

### 6.22 Scrollbar

| VS Code Property | Palette Token | Purpose |
|---|---|---|
| `scrollbar.shadow` | `border-default` (+ alpha) | Scrollbar shadow |
| `scrollbarSlider.background` | `text-muted` (+ alpha) | Scrollbar thumb |
| `scrollbarSlider.hoverBackground` | `text-secondary` (+ alpha) | Thumb hover |
| `scrollbarSlider.activeBackground` | `text-primary` (+ alpha) | Thumb active |

### 6.23 Terminal ANSI Colors

These use the **hand-tuned hex values** from `palette.terminal.light` and `palette.terminal.dark` — not OKLCH conversions.

| VS Code Property | ANSI Index | Color Name | Light Hex | Dark Hex |
|---|---|---|---|---|
| `terminal.ansiBlack` | 0 | Black | `#1b150f` | `#1b150f` |
| `terminal.ansiRed` | 1 | Red | `#ed324b` | `#ed324b` |
| `terminal.ansiGreen` | 2 | Green | `#22a448` | `#22a448` |
| `terminal.ansiYellow` | 3 | Yellow | `#febf00` | `#febf00` |
| `terminal.ansiBlue` | 4 | Blue | `#00a6c0` | `#00a6c0` |
| `terminal.ansiMagenta` | 5 | Magenta | `#f600a3` | `#f600a3` |
| `terminal.ansiCyan` | 6 | Cyan | `#17c0d6` | `#17c0d6` |
| `terminal.ansiWhite` | 7 | White | `#e8ddd3` | `#e8ddd3` |
| `terminal.ansiBrightBlack` | 8 | Bright Black | `#6b5e52` | `#6b5e52` |
| `terminal.ansiBrightRed` | 9 | Bright Red | `#ff6b7f` | `#ff6b7f` |
| `terminal.ansiBrightGreen` | 10 | Bright Green | `#44d66a` | `#44d66a` |
| `terminal.ansiBrightYellow` | 11 | Bright Yellow | `#ffe066` | `#ffe066` |
| `terminal.ansiBrightBlue` | 12 | Bright Blue | `#33cfea` | `#33cfea` |
| `terminal.ansiBrightMagenta` | 13 | Bright Magenta | `#ff33c0` | `#ff33c0` |
| `terminal.ansiBrightCyan` | 14 | Bright Cyan | `#55e8f0` | `#55e8f0` |
| `terminal.ansiBrightWhite` | 15 | Bright White | `#fdf8f3` | `#fdf8f3` |

Additional terminal properties:

| VS Code Property | Palette Token | Purpose |
|---|---|---|
| `terminal.background` | `terminal.{theme}.background` (hex) | Terminal background |
| `terminal.foreground` | `terminal.{theme}.foreground` (hex) | Terminal foreground |
| `terminalCursor.foreground` | `terminal.{theme}.cursor` (hex) | Terminal cursor |
| `terminalCursor.background` | `terminal.{theme}.background` (hex) | Cursor text |
| `terminal.selectionBackground` | `accent-primary-subtle` (OKLCH->hex) | Selection bg |
| `terminal.findMatchBackground` | `accent-gold-subtle` (OKLCH->hex) | Find match bg |
| `terminal.findMatchHighlightBackground` | `accent-gold-subtle` (+ alpha, OKLCH->hex) | Other matches |
| `terminal.tab.activeBorder` | `accent-primary` (OKLCH->hex) | Active terminal tab |

### 6.24 Debug Colors

| VS Code Property | Palette Token | Purpose |
|---|---|---|
| `debugConsole.infoForeground` | `accent-cyan` | Debug info text |
| `debugConsole.warningForeground` | `accent-gold` | Debug warning text |
| `debugConsole.errorForeground` | `accent-danger` | Debug error text |
| `debugConsole.sourceForeground` | `text-secondary` | Debug source text |
| `debugConsoleInputIcon.foreground` | `accent-primary` | Debug input icon |
| `debugIcon.breakpointForeground` | `accent-danger` | Breakpoint icon |
| `debugIcon.breakpointDisabledForeground` | `text-muted` | Disabled breakpoint |
| `debugIcon.breakpointUnverifiedForeground` | `accent-gold` | Unverified breakpoint |
| `debugIcon.startForeground` | `accent-green` | Start debug icon |
| `debugIcon.pauseForeground` | `accent-cyan` | Pause icon |
| `debugIcon.stopForeground` | `accent-danger` | Stop icon |
| `debugIcon.disconnectForeground` | `accent-danger` | Disconnect icon |
| `debugIcon.restartForeground` | `accent-green` | Restart icon |
| `debugIcon.stepOverForeground` | `accent-cyan` | Step over icon |
| `debugIcon.stepIntoForeground` | `accent-cyan` | Step into icon |
| `debugIcon.stepOutForeground` | `accent-cyan` | Step out icon |
| `debugIcon.continueForeground` | `accent-green` | Continue icon |
| `debugToolBar.background` | `bg-elevated` | Debug toolbar bg |
| `debugToolBar.border` | `border-default` | Debug toolbar border |
| `debugTokenExpression.name` | `accent-cyan` | Variable name |
| `debugTokenExpression.value` | `text-primary` | Variable value |
| `debugTokenExpression.string` | `accent-gold` | String value |
| `debugTokenExpression.boolean` | `accent-primary` | Boolean value |
| `debugTokenExpression.number` | `accent-green` | Number value |
| `debugTokenExpression.error` | `accent-danger` | Error value |

### 6.25 Git Decoration Colors

| VS Code Property | Palette Token | Purpose |
|---|---|---|
| `gitDecoration.addedResourceForeground` | `accent-green` | Added file |
| `gitDecoration.modifiedResourceForeground` | `accent-cyan` | Modified file |
| `gitDecoration.deletedResourceForeground` | `accent-danger` | Deleted file |
| `gitDecoration.renamedResourceForeground` | `accent-cyan` | Renamed file |
| `gitDecoration.untrackedResourceForeground` | `accent-green` | Untracked file |
| `gitDecoration.ignoredResourceForeground` | `text-muted` | Ignored file |
| `gitDecoration.conflictingResourceForeground` | `accent-gold` | Conflicting file |
| `gitDecoration.stageModifiedResourceForeground` | `accent-cyan` | Staged modified |
| `gitDecoration.stageDeletedResourceForeground` | `accent-danger` | Staged deleted |
| `gitDecoration.submoduleResourceForeground` | `accent-purple` | Submodule |

### 6.26 Merge Conflicts

| VS Code Property | Palette Token | Purpose |
|---|---|---|
| `merge.currentHeaderBackground` | `accent-green-subtle` | Current header bg |
| `merge.currentContentBackground` | `accent-green-subtle` (+ alpha) | Current content bg |
| `merge.incomingHeaderBackground` | `accent-cyan-subtle` | Incoming header bg |
| `merge.incomingContentBackground` | `accent-cyan-subtle` (+ alpha) | Incoming content bg |
| `merge.border` | `border-default` | Merge border |
| `merge.commonHeaderBackground` | `bg-subtle` | Common ancestor header |
| `merge.commonContentBackground` | `bg-muted` | Common ancestor content |

### 6.27 Notifications

| VS Code Property | Palette Token | Purpose |
|---|---|---|
| `notificationCenter.border` | `border-default` | Center border |
| `notificationCenterHeader.background` | `bg-surface` | Header bg |
| `notificationCenterHeader.foreground` | `text-primary` | Header text |
| `notifications.background` | `bg-elevated` | Notification bg |
| `notifications.foreground` | `text-primary` | Notification text |
| `notifications.border` | `border-default` | Notification border |
| `notificationLink.foreground` | `accent-primary` | Link color |
| `notificationsErrorIcon.foreground` | `accent-danger` | Error icon |
| `notificationsWarningIcon.foreground` | `accent-gold` | Warning icon |
| `notificationsInfoIcon.foreground` | `accent-cyan` | Info icon |

### 6.28 Quick Pick & Command Palette

| VS Code Property | Palette Token | Purpose |
|---|---|---|
| `quickInput.background` | `bg-elevated` | Quick input bg |
| `quickInput.foreground` | `text-primary` | Quick input text |
| `quickInputList.focusBackground` | `accent-primary-subtle` | Focused item bg |
| `quickInputList.focusForeground` | `text-primary` | Focused item text |
| `quickInputList.focusIconForeground` | `text-primary` | Focused item icon |
| `quickInputTitle.background` | `bg-elevated` | Title bg |
| `pickerGroup.border` | `border-subtle` | Group separator |
| `pickerGroup.foreground` | `accent-primary` | Group label |
| `keybindingLabel.background` | `bg-subtle` | Keybinding bg |
| `keybindingLabel.foreground` | `text-primary` | Keybinding text |
| `keybindingLabel.border` | `border-default` | Keybinding border |
| `keybindingLabel.bottomBorder` | `border-default` | Keybinding bottom border |

### 6.29 Settings Editor

| VS Code Property | Palette Token | Purpose |
|---|---|---|
| `settings.headerForeground` | `text-primary` | Settings header |
| `settings.modifiedItemIndicator` | `accent-primary` | Modified indicator |
| `settings.dropdownBackground` | `bg-elevated` | Dropdown bg |
| `settings.dropdownForeground` | `text-primary` | Dropdown text |
| `settings.dropdownBorder` | `border-default` | Dropdown border |
| `settings.checkboxBackground` | `bg-elevated` | Checkbox bg |
| `settings.checkboxForeground` | `accent-primary` | Checkbox check |
| `settings.checkboxBorder` | `border-default` | Checkbox border |
| `settings.textInputBackground` | `bg-elevated` | Text input bg |
| `settings.textInputForeground` | `text-primary` | Text input text |
| `settings.textInputBorder` | `border-default` | Text input border |
| `settings.numberInputBackground` | `bg-elevated` | Number input bg |
| `settings.numberInputForeground` | `text-primary` | Number input text |
| `settings.numberInputBorder` | `border-default` | Number input border |
| `settings.focusedRowBackground` | `bg-subtle` | Focused row bg |
| `settings.rowHoverBackground` | `bg-subtle` | Row hover bg |

### 6.30 Breadcrumbs

| VS Code Property | Palette Token | Purpose |
|---|---|---|
| `breadcrumb.foreground` | `text-secondary` | Breadcrumb text |
| `breadcrumb.background` | `bg-page` | Breadcrumb bg |
| `breadcrumb.focusForeground` | `text-primary` | Focused crumb |
| `breadcrumb.activeSelectionForeground` | `text-primary` | Active crumb |
| `breadcrumbPicker.background` | `bg-elevated` | Picker dropdown bg |

### 6.31 Welcome Page & Walkthrough

| VS Code Property | Palette Token | Purpose |
|---|---|---|
| `welcomePage.background` | `bg-page` | Welcome bg |
| `welcomePage.tileBackground` | `bg-surface` | Tile bg |
| `welcomePage.tileHoverBackground` | `bg-subtle` | Tile hover bg |
| `welcomePage.tileBorder` | `border-default` | Tile border |
| `welcomePage.progress.foreground` | `accent-primary` | Progress bar |
| `walkThrough.embeddedEditorBackground` | `bg-surface` | Embedded editor bg |

---

## 7. Semantic Token Colors

```json
"semanticTokenColors": {
  "variable": { "foreground": "#hex-text-primary" },
  "variable.readonly": { "foreground": "#hex-accent-cyan" },
  "variable.defaultLibrary": { "foreground": "#hex-accent-cyan" },
  "property": { "foreground": "#hex-text-primary" },
  "property.readonly": { "foreground": "#hex-accent-cyan" },
  "function": { "foreground": "#hex-accent-cyan" },
  "function.defaultLibrary": { "foreground": "#hex-accent-gold" },
  "method": { "foreground": "#hex-accent-cyan" },
  "class": { "foreground": "#hex-accent-gold" },
  "class.defaultLibrary": { "foreground": "#hex-accent-gold" },
  "interface": { "foreground": "#hex-accent-gold" },
  "type": { "foreground": "#hex-accent-gold" },
  "type.defaultLibrary": { "foreground": "#hex-accent-gold" },
  "typeParameter": { "foreground": "#hex-accent-gold" },
  "namespace": { "foreground": "#hex-accent-purple" },
  "enum": { "foreground": "#hex-accent-gold" },
  "enumMember": { "foreground": "#hex-accent-cyan" },
  "decorator": { "foreground": "#hex-accent-purple" },
  "parameter": { "foreground": "#hex-text-primary" },
  "macro": { "foreground": "#hex-accent-purple" },
  "string": { "foreground": "#hex-accent-gold" },
  "number": { "foreground": "#hex-accent-green" },
  "boolean": { "foreground": "#hex-accent-primary" },
  "keyword": { "foreground": "#hex-accent-primary" },
  "operator": { "foreground": "#hex-text-secondary" },
  "comment": { "foreground": "#hex-text-muted", "fontStyle": "italic" },
  "regexp": { "foreground": "#hex-accent-danger" }
}
```

Hex values in the above are placeholders. The emitter converts the referenced semantic token's OKLCH value to hex at build time.

---

## 8. TextMate Token Colors

The `tokenColors` array provides syntax highlighting for languages that use TextMate grammars.

```json
"tokenColors": [
  {
    "name": "Comments",
    "scope": ["comment", "punctuation.definition.comment"],
    "settings": { "foreground": "#hex-text-muted", "fontStyle": "italic" }
  },
  {
    "name": "Strings",
    "scope": ["string", "string.quoted", "string.template"],
    "settings": { "foreground": "#hex-accent-gold" }
  },
  {
    "name": "Numbers",
    "scope": ["constant.numeric"],
    "settings": { "foreground": "#hex-accent-green" }
  },
  {
    "name": "Built-in constants",
    "scope": ["constant.language"],
    "settings": { "foreground": "#hex-accent-primary" }
  },
  {
    "name": "User constants",
    "scope": ["constant.character", "constant.other"],
    "settings": { "foreground": "#hex-accent-cyan" }
  },
  {
    "name": "Keywords",
    "scope": ["keyword", "storage.type", "storage.modifier"],
    "settings": { "foreground": "#hex-accent-primary" }
  },
  {
    "name": "Operators",
    "scope": ["keyword.operator"],
    "settings": { "foreground": "#hex-text-secondary" }
  },
  {
    "name": "Functions",
    "scope": ["entity.name.function", "support.function"],
    "settings": { "foreground": "#hex-accent-cyan" }
  },
  {
    "name": "Classes",
    "scope": ["entity.name.type", "entity.name.class", "support.class"],
    "settings": { "foreground": "#hex-accent-gold" }
  },
  {
    "name": "Tags (HTML/XML)",
    "scope": ["entity.name.tag"],
    "settings": { "foreground": "#hex-accent-primary" }
  },
  {
    "name": "Attributes",
    "scope": ["entity.other.attribute-name"],
    "settings": { "foreground": "#hex-accent-cyan" }
  },
  {
    "name": "Variables",
    "scope": ["variable", "variable.other"],
    "settings": { "foreground": "#hex-text-primary" }
  },
  {
    "name": "Parameters",
    "scope": ["variable.parameter"],
    "settings": { "foreground": "#hex-text-primary" }
  },
  {
    "name": "Punctuation",
    "scope": ["punctuation"],
    "settings": { "foreground": "#hex-text-secondary" }
  },
  {
    "name": "Regular Expressions",
    "scope": ["string.regexp"],
    "settings": { "foreground": "#hex-accent-danger" }
  },
  {
    "name": "Escape Characters",
    "scope": ["constant.character.escape"],
    "settings": { "foreground": "#hex-accent-cyan" }
  },
  {
    "name": "Decorators / Annotations",
    "scope": ["meta.decorator", "meta.annotation"],
    "settings": { "foreground": "#hex-accent-purple" }
  },
  {
    "name": "Namespace",
    "scope": ["entity.name.namespace", "entity.name.module"],
    "settings": { "foreground": "#hex-accent-purple" }
  },
  {
    "name": "Type Parameters",
    "scope": ["entity.name.type.parameter"],
    "settings": { "foreground": "#hex-accent-gold", "fontStyle": "italic" }
  },
  {
    "name": "CSS Properties",
    "scope": ["support.type.property-name.css"],
    "settings": { "foreground": "#hex-accent-cyan" }
  },
  {
    "name": "CSS Values",
    "scope": ["support.constant.property-value.css"],
    "settings": { "foreground": "#hex-accent-primary" }
  },
  {
    "name": "CSS Selectors",
    "scope": ["entity.name.tag.css", "entity.other.attribute-name.css"],
    "settings": { "foreground": "#hex-accent-gold" }
  },
  {
    "name": "JSON Keys",
    "scope": ["support.type.property-name.json"],
    "settings": { "foreground": "#hex-accent-cyan" }
  },
  {
    "name": "Markdown Headings",
    "scope": ["markup.heading", "entity.name.section.markdown"],
    "settings": { "foreground": "#hex-accent-primary", "fontStyle": "bold" }
  },
  {
    "name": "Markdown Bold",
    "scope": ["markup.bold"],
    "settings": { "fontStyle": "bold" }
  },
  {
    "name": "Markdown Italic",
    "scope": ["markup.italic"],
    "settings": { "fontStyle": "italic" }
  },
  {
    "name": "Markdown Links",
    "scope": ["markup.underline.link"],
    "settings": { "foreground": "#hex-accent-cyan" }
  },
  {
    "name": "Markdown Code",
    "scope": ["markup.inline.raw", "markup.fenced_code"],
    "settings": { "foreground": "#hex-accent-green" }
  },
  {
    "name": "Diff Inserted",
    "scope": ["markup.inserted"],
    "settings": { "foreground": "#hex-accent-green" }
  },
  {
    "name": "Diff Deleted",
    "scope": ["markup.deleted"],
    "settings": { "foreground": "#hex-accent-danger" }
  },
  {
    "name": "Diff Changed",
    "scope": ["markup.changed"],
    "settings": { "foreground": "#hex-accent-cyan" }
  },
  {
    "name": "Invalid",
    "scope": ["invalid", "invalid.illegal"],
    "settings": { "foreground": "#hex-accent-danger", "fontStyle": "underline" }
  }
]
```

---

## 9. Error Handling

### Warnings

| Condition | Warning |
|---|---|
| A VS Code color property has no matching palette token | `"VSCodeEmitter: no mapping for '{property}', using fallback"` |
| OKLCH value produces out-of-gamut hex after clamping | `"VSCodeEmitter: '{token}' required gamut clamping"` |
| Terminal ANSI array has fewer than 16 entries | `"VSCodeEmitter: terminal.{theme}.ansi has {n} entries, expected 16"` |

### Errors (thrown)

| Condition | Error |
|---|---|
| `palette.semantic` is missing | `"VSCodeEmitter: palette.semantic is missing"` |
| `palette.terminal` is missing | `"VSCodeEmitter: palette.terminal is missing"` |
| culori fails to parse an OKLCH string | `"VSCodeEmitter: failed to parse '{value}' as OKLCH"` |

---

## 10. Output Files Summary

| File | Path | Size (approx) |
|---|---|---|
| Light theme | `ports/vscode/themes/delightful-light-color-theme.json` | ~25 KB |
| Dark theme | `ports/vscode/themes/delightful-dark-color-theme.json` | ~25 KB |
