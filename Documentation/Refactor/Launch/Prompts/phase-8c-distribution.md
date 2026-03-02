---
title: "Phase 8c: Claude Plugin + Platform Distribution"
date: 2026-03-02
type: prompt
scope: launch
status: shell
---

> **Shell Prompt** -- This prompt will be revised before execution. Complete the pre-flight checklist before beginning.

---

## Pre-flight Checklist

- [ ] `npm run build` succeeds and all emitter outputs exist in `ports/`
- [ ] Light theme screenshot taken (1280x720 from `docs/preview-light.html`)
- [ ] Dark theme screenshot taken (1280x720 from `docs/preview-dark.html`)
- [ ] VS Code Marketplace publisher account created
- [ ] Open VSX account created (for VS Codium users)
- [ ] GitHub repos created for each distribution: `delightful-vscode`, `obsidian-delightful`, `delightful-ghostty`, `delightful-iterm2`, `delightful-shell`, `delightful-claude-plugin`
- [ ] Claude Plugin Directory submission requirements reviewed
- [ ] Starship presets submission process reviewed

---

## Objective

Build the Claude Code plugin with `/build` and `/refactor` skills, auditor and builder agents. Prepare all 6 platform distribution repos for submission.

---

## Instructions

### Part 1: Claude Code Plugin

#### Step 1: Author design-system.md

Write `ports/claude-plugin/design-system.md` as a condensed reference covering:
- Token tier model and the strict rule
- Complete semantic token list with purposes
- Cascade layer order
- Component CSS patterns with examples
- Motion system overview

Source this from the spec files. Keep it concise -- this is context for Claude, not human documentation.

#### Step 2: Author /build Skill

Write `ports/claude-plugin/skills/build.md`. The skill prompt should:
- Load `design-system.md` and `tokens.css` as context
- Accept a component description from the user
- Generate `@layer component` CSS with `var()` token references
- Generate semantic HTML with accessibility attributes
- Follow the patterns from `src/components/*.css`

#### Step 3: Author /refactor Skill

Write `ports/claude-plugin/skills/refactor.md`. The skill prompt should:
- Load `design-system.md` and `tokens.css` as context
- Accept existing CSS/HTML from the user
- Replace hardcoded values with token references
- Add missing `@layer` declarations
- Add missing reduced-motion handling

#### Step 4: Author Auditor Agent

Write `ports/claude-plugin/agents/auditor.md`. The agent should:
- Check for primitive token references in component CSS
- Check for semantic misuse
- Check for missing `@layer component` wrapper
- Check for hardcoded values
- Report findings with severity and suggested fixes

#### Step 5: Author Builder Agent

Write `ports/claude-plugin/agents/builder.md`. The agent should:
- Accept a component spec file path
- Read the spec and generate complete CSS implementation
- Optionally generate React wrapper and test file
- Follow patterns established in the MVP build

#### Step 6: Copy Generated Files

Copy `src/tokens.css` to `ports/claude-plugin/tokens.css` (this is done by the build script, but verify it exists).

### Part 2: Platform Distribution Repos

For each of the 6 platforms, follow the steps in `Specs/platform-distribution.md`:

#### Step 7: VS Code

1. Copy `ports/vscode/` contents to the `delightful-vscode` repo.
2. Add `icon.png` (128x128).
3. Write README with install instructions and screenshots.
4. Package with `vsce package`.
5. Test locally with `code --install-extension`.
6. Submit to VS Code Marketplace and Open VSX.

#### Step 8: Obsidian

1. Copy `ports/obsidian/theme.css` to the `obsidian-delightful` repo.
2. Create `manifest.json` with required fields.
3. Write README with screenshots.
4. Open PR to `obsidian-releases` adding to `community-css-themes.json`.

#### Step 9: Ghostty

1. Copy `ports/ghostty/` configs to the `delightful-ghostty` repo.
2. Write README with screenshots.
3. Submit to ghostty.style.

#### Step 10: iTerm2

1. Copy `ports/iterm2/` `.itermcolors` files to the `delightful-iterm2` repo.
2. Write README with screenshots.
3. Open PR to `mbadolato/iTerm2-Color-Schemes`.

#### Step 11: Starship

1. Copy `ports/starship/starship.toml` to the `delightful-shell` repo.
2. Write README with install instructions.
3. Submit to Starship presets.

#### Step 12: Claude Plugin

1. Copy `ports/claude-plugin/` contents to the `delightful-claude-plugin` repo.
2. Write README with usage instructions.
3. Submit to Claude Plugin Directory.

### Step 13: Validate

Run the distribution checklist from `QA/distribution-checklist.md`. All platforms must pass before considering this phase complete.
