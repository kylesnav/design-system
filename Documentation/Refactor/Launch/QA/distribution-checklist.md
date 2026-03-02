---
title: "Platform Distribution Submission Checklist"
date: 2026-03-02
type: qa
scope: launch
status: shell
---

> **Shell QA** -- This checklist will be revised before execution. MVP must be complete before this phase begins.

---

## Pre-submission (all platforms)

- [ ] Light theme screenshot taken (1280x720 from `docs/preview-light.html`)
- [ ] Dark theme screenshot taken (1280x720 from `docs/preview-dark.html`)
- [ ] README written with install instructions
- [ ] Version number set in distribution repo
- [ ] License file present (MIT)
- [ ] Emitter output is up-to-date (regenerated from latest `palettes/delightful.json`)

## VS Code

- [ ] Package with `vsce package` (produces `.vsix`)
- [ ] Test locally: `code --install-extension delightful-*.vsix`
- [ ] Light theme loads correctly in VS Code
- [ ] Dark theme loads correctly in VS Code
- [ ] All 324+ color property mappings resolve
- [ ] Terminal colors display correctly
- [ ] Submit to marketplace.visualstudio.com
- [ ] Submit to open-vsx.org (mirror)
- [ ] Extension icon provided (128x128 PNG)

## Obsidian

- [ ] `theme.css` present in repo root
- [ ] `manifest.json` present with correct fields (`name`, `version`, `minAppVersion`, `author`, `authorUrl`)
- [ ] Theme loads in Obsidian without errors
- [ ] Light mode displays correctly
- [ ] Dark mode displays correctly
- [ ] Style Settings plugin integration works (if applicable)
- [ ] PR opened to `obsidian-releases` repo adding to `community-css-themes.json`

## Ghostty

- [ ] `.conf` file present with all required palette fields
- [ ] Light theme file includes all 16 ANSI colors + foreground/background/cursor
- [ ] Dark theme file includes all 16 ANSI colors + foreground/background/cursor
- [ ] Theme loads in Ghostty without errors
- [ ] Colors display correctly in terminal
- [ ] Submit to ghostty.style

## iTerm2

- [ ] `.itermcolors` plist is valid XML
- [ ] Light theme loads in iTerm2 Preferences > Profiles > Colors
- [ ] Dark theme loads in iTerm2 Preferences > Profiles > Colors
- [ ] Colors display correctly in terminal
- [ ] ANSI palette matches Ghostty palette (cross-port consistency)
- [ ] PR opened to `mbadolato/iTerm2-Color-Schemes`
- [ ] Note: this also adds to Ghostty's built-in themes list

## Starship

- [ ] `starship.toml` is valid TOML
- [ ] Preset loads in Starship without errors
- [ ] Prompt segments display correct colors
- [ ] Submit to Starship presets

## Claude Plugin

- [ ] Plugin structure is valid (skills/, agents/, tokens.css, design-system.md)
- [ ] `/build` skill generates valid component CSS
- [ ] `/refactor` skill correctly identifies and replaces hardcoded values
- [ ] Auditor agent catches primitive token references in component CSS
- [ ] Builder agent generates complete component implementations from specs
- [ ] Skills tested locally with Claude Code
- [ ] Submit to Claude Plugin Directory
