# Visual Design Review Workflow

## Setup

Two HTTP servers for side-by-side comparison in Chrome:

| Tab | Port | Source | Role |
|-----|------|--------|------|
| A | 8901 | Desktop repo (`~/Desktop/Working/Github/delightful-design-system/`) | Before (baseline) |
| B | 8902 | Porto worktree (`~/conductor/workspaces/delightful-design-system/porto/`) | After (working) |

Start servers:
```bash
cd ~/Desktop/Working/Github/delightful-design-system && python3 -m http.server 8901 &
cd ~/conductor/workspaces/delightful-design-system/porto && python3 -m http.server 8902 &
```

Chrome MCP extension requires HTTP — `file://` URLs are blocked by the extension.

## Review Process

### Section-by-section

1. Navigate both tabs to the same `#section` anchor
2. Screenshot both tabs at matching scroll positions
3. Present differences to the user with clear labels (Before vs After)
4. User gives verdict per change (keep, revert, modify)

### Apply-as-you-go

After each section verdict:
1. Apply changes to `delightful-design-system.html` (source of truth)
2. Run `npm run sync` to propagate to companion files
3. Cache-bust refresh Tab B: navigate to `?t={timestamp}#section`
4. Screenshot updated Tab B to confirm the fix
5. Move to next section

### Cache busting

Chrome aggressively caches the HTML. Always append a unique `?t=` query param when navigating Tab B after changes:
```
http://127.0.0.1:8902/delightful-design-system.html?t={unix_timestamp}#section
```

## Change Propagation

After modifying `delightful-design-system.html`:

**Automated** (`npm run sync`):
- `claude-plugin/themes/css/delightful-tokens.css`
- `obsidian-theme/theme.css`
- `delightful-motion.html`, `delightful-animation.html`, `delightful-color.html`

**Manual** (check if component CSS was duplicated):
- `delightful-color.html` — has its own copy of `.swatch` component CSS
- `preview.html`, `preview-light.html`, `preview-dark.html` — different swatch layout, check case-by-case
- VSCode themes — regenerate via `cd vscode-theme/scripts && node generate-themes.mjs`

## Tracking

- **Review ledger**: `.claude/review-ledger.md` — tracks all changes and verdicts per section
- **Memory file**: `.claude/projects/.../memory/MEMORY.md` — persists key design decisions across sessions

## Lessons Learned

- `content-visibility: auto` applies paint containment that clips borders/shadows at section edges. Removed it to prevent clipping with dark `var(--text-primary)` borders.
- `npm run sync` propagates token-tier CSS but NOT hardcoded display values in HTML (swatch labels, `data-copy` attributes, architecture explorer JS data). Those must be updated manually.
- When reverting token hues (e.g. gold 78 → 85), search for hardcoded values throughout the entire file — not just the CSS custom properties section.
- The user drives all design decisions. Present options, don't assume.
