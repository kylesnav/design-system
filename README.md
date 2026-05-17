# Delightful

Public site and source-of-truth reference for [delightful.build](https://delightful.build/): a warm, neo-brutalist design system built on OKLCH color science, three-tier tokens, solid shadows, and springy motion.

## What's Here

- `index.html` — public `delightful.build` homepage and ecosystem hub
- `delightful-design-system.html` — complete component, token, interaction, and composition reference
- `delightful-color.html` — OKLCH color architecture explorer
- `delightful-motion.html` — CSS animation and motion catalog
- `delightful-animation.html` — JavaScript motion, gesture, spring, and generative demos
- `screenshots/` — public visual assets used by the site and README
- `tests/` — Playwright checks for token consistency, interactions, animation behavior, and screenshots

## Ecosystem

Delightful ships as standalone repos. This repo no longer contains local copies of those ports.

| Surface | Repo | Role |
|---|---|---|
| Claude Code | [delightful-claude-plugin](https://github.com/kylesnav/delightful-claude-plugin) | Skills, agents, MCP tools, and design-system context |
| VS Code | [delightful-vscode](https://github.com/kylesnav/delightful-vscode) | Light and dark editor color themes |
| Obsidian | [obsidian-delightful](https://github.com/kylesnav/obsidian-delightful) | Community theme with modular CSS source |
| Ghostty | [delightful-ghostty](https://github.com/kylesnav/delightful-ghostty) | Terminal theme, config, and optional shaders |
| iTerm2 | [delightful-iterm2](https://github.com/kylesnav/delightful-iterm2) | Generated `.itermcolors` profiles |
| Starship | [delightful-starship](https://github.com/kylesnav/delightful-starship) | Rainbow powerline prompt theme |
| Shell | [delightful-shell](https://github.com/kylesnav/delightful-shell) | tmux, zsh, and terminal utilities |
| Setup | [claude-setup](https://github.com/kylesnav/claude-setup) | Machine setup orchestration for the full environment |

## Development

Open the HTML files directly or serve the repo with any static server.

```sh
npm install
npm test
```

Use `npm run bump <version>` only when cutting a site/design-system release. It updates the root package version and creates a git tag.

## Design Rules

- Colors use OKLCH in source files.
- Token architecture is primitives -> semantic -> component.
- HTML reference pages are self-contained, with inline CSS and JavaScript.
- CSS uses cascade layers: `@layer reset, primitives, semantic, component, utilities`.
- Shadows use a hard zero-blur offset plus an ambient depth layer.
- Borders are 2px solid unless a component explicitly documents a different state.

## License

[MIT](LICENSE)
