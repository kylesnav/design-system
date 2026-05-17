# Delightful

Public site and source-of-truth reference for `delightful.build`.

## Source of Truth

`delightful-design-system.html` is the canonical design-system reference. The other HTML pages are companion references and demos:

- `index.html` — public homepage and ecosystem hub
- `delightful-color.html` — color architecture explorer
- `delightful-motion.html` — CSS motion catalog
- `delightful-animation.html` — JavaScript animation demos

Standalone ports live in sibling repos under `../`. Do not recreate local port copies in this repo.

## Validate

```sh
npm install
npm test
```

For visual work, open the affected HTML page in Browser and capture desktop/mobile, light/dark, and reduced-motion states where relevant.

## Versioning

```sh
npm run bump <version>
```

This bumps only the root package and creates a tag for the `delightful.build` site repo. Platform ports version themselves in their own repos.

## Ecosystem Repos

- `../delightful-claude-plugin`
- `../delightful-vscode`
- `../obsidian-delightful`
- `../delightful-ghostty`
- `../delightful-iterm2`
- `../delightful-starship`
- `../delightful-shell`
- `../claude-setup`

## Conventions

- All source colors use OKLCH.
- Token architecture: primitives -> semantic -> component. Components never reference primitives directly.
- HTML files are self-contained; no external dependencies except optional web fonts.
- CSS uses cascade layers: `@layer reset, primitives, semantic, component, utilities`.
- Shadows use hard zero-blur offsets plus ambient depth. Borders are 2px solid by default.
- Preserve `CNAME`; the canonical public URL is `https://delightful.build/`.
