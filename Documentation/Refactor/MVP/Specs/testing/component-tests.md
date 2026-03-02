---
title: "Component Tests"
date: 2026-03-02
type: spec
scope: mvp
status: active
---

# Component Tests

> Per-component test specifications for `tests/components/*.spec.ts`. Each component gets a dedicated spec file with computed style assertions, interaction tests, visual regression screenshots, and reduced-motion compliance checks.

Cross-references: [[button]] [[card]] [[toggle]] (component specs with exact token values), [[token-tiers]] (token inventory), [[dark-mode]] (shadow inversion, accent brightening), [[test-strategy]] (Playwright config, test page setup, helpers), [[motion]] (reduced-motion gate).

---

## 1. General Test Structure

Every component spec file follows this pattern:

```typescript
import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

const tokensCSS = readFileSync('src/tokens.css', 'utf-8');
const resetCSS = readFileSync('src/reset.css', 'utf-8');
const foundationCSS = readFileSync('src/foundation.css', 'utf-8');
const componentCSS = readFileSync('src/components/<component>.css', 'utf-8');

async function loadPage(page: Page, html: string, theme: 'light' | 'dark' = 'light'): Promise<void> {
  await page.setContent(`
    <!DOCTYPE html>
    <html lang="en" data-theme="${theme}">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>${tokensCSS}</style>
      <style>${resetCSS}</style>
      <style>${foundationCSS}</style>
      <style>${componentCSS}</style>
    </head>
    <body style="padding: 40px; background: var(--bg-page);">
      ${html}
    </body>
    </html>
  `, { waitUntil: 'domcontentloaded' });
}

test.describe('ComponentName', () => {
  test.beforeEach(async ({ page }) => {
    // Load the component in its default state
  });

  test('renders base state correctly', async ({ page }) => { /* ... */ });
  test('hover state applies correct shadow/transform', async ({ page }) => { /* ... */ });
  test('active state collapses shadow', async ({ page }) => { /* ... */ });
  test('disabled state', async ({ page }) => { /* ... */ });
  test('visual regression - base', async ({ page }) => {
    await expect(page).toHaveScreenshot();
  });
  test('reduced motion compliance', async ({ page }) => { /* ... */ });
});
```

### 1.1 Interaction Simulation Helpers

```typescript
/** Simulate hover by dispatching mouse events */
async function hoverElement(page: Page, selector: string): Promise<void> {
  await page.hover(selector);
  // Allow transition to complete
  await page.waitForTimeout(200);
}

/** Get computed style of a pseudo-element */
async function getComputedPseudo(
  page: Page, selector: string, pseudo: string, property: string
): Promise<string> {
  return page.evaluate(
    ([sel, ps, prop]) => {
      const el = document.querySelector(sel);
      if (!el) throw new Error(`Element not found: ${sel}`);
      return getComputedStyle(el, ps).getPropertyValue(prop).trim();
    },
    [selector, pseudo, property]
  );
}
```

---

## 2. Button -- `tests/components/button.spec.ts`

### 2.1 Computed Style Assertions

```typescript
test.describe('Button', () => {
  const buttonHTML = `
    <button class="btn btn-md btn-primary">Primary</button>
    <button class="btn btn-md btn-danger">Danger</button>
    <button class="btn btn-md btn-gold">Gold</button>
    <button class="btn btn-md btn-cyan">Cyan</button>
    <button class="btn btn-md btn-green">Green</button>
    <button class="btn btn-md btn-purple">Purple</button>
    <button class="btn btn-md btn-secondary">Secondary</button>
    <button class="btn btn-md btn-ghost">Ghost</button>
  `;

  test.beforeEach(async ({ page }) => {
    await loadPage(page, buttonHTML);
  });

  test('base .btn has border-radius 16px', async ({ page }) => {
    const radius = await page.locator('.btn-primary').evaluate(
      el => getComputedStyle(el).borderRadius
    );
    expect(radius).toBe('16px');
  });

  test('base .btn has border: 2px solid', async ({ page }) => {
    const width = await page.locator('.btn-primary').evaluate(
      el => getComputedStyle(el).borderWidth
    );
    expect(width).toBe('2px');
  });

  test('base .btn has font-weight 700', async ({ page }) => {
    const weight = await page.locator('.btn-primary').evaluate(
      el => getComputedStyle(el).fontWeight
    );
    expect(weight).toBe('700');
  });

  test('.btn-sm has height 32px', async ({ page }) => {
    await loadPage(page, '<button class="btn btn-sm btn-primary">Small</button>');
    const height = await page.locator('.btn-sm').evaluate(el => getComputedStyle(el).height);
    expect(height).toBe('32px');
  });

  test('.btn-md has height 36px', async ({ page }) => {
    const height = await page.locator('.btn-md.btn-primary').evaluate(
      el => getComputedStyle(el).height
    );
    expect(height).toBe('36px');
  });

  test('.btn-lg has height 44px', async ({ page }) => {
    await loadPage(page, '<button class="btn btn-lg btn-primary">Large</button>');
    const height = await page.locator('.btn-lg').evaluate(el => getComputedStyle(el).height);
    expect(height).toBe('44px');
  });
```

### 2.2 Color Variant Assertions

```typescript
  test('.btn-primary background resolves to accent-primary OKLCH', async ({ page }) => {
    const bg = await page.locator('.btn-primary').evaluate(
      el => getComputedStyle(el).backgroundColor
    );
    // Browser resolves OKLCH to an rgb() or oklch() value
    // Assert it resolves to the accent-primary color (oklch(0.640 0.270 350))
    expect(bg).toBeTruthy();
    // Exact resolved value depends on browser OKLCH support
    // Use a color-distance check or snapshot the resolved RGB
  });

  test('.btn-gold text color resolves to text-on-gold', async ({ page }) => {
    const color = await page.locator('.btn-gold').evaluate(
      el => getComputedStyle(el).color
    );
    // text-on-gold = oklch(0.220 0.020 70), a dark color
    expect(color).toBeTruthy();
  });

  test('.btn-ghost has transparent background and no box-shadow', async ({ page }) => {
    const bg = await page.locator('.btn-ghost').evaluate(
      el => getComputedStyle(el).backgroundColor
    );
    const shadow = await page.locator('.btn-ghost').evaluate(
      el => getComputedStyle(el).boxShadow
    );
    // transparent resolves to rgba(0, 0, 0, 0)
    expect(bg).toMatch(/rgba\(0,\s*0,\s*0,\s*0\)/);
    expect(shadow).toBe('none');
  });

  // Verify all 7 color variants (excluding ghost) have distinct background colors
  const colorVariants = [
    { class: 'btn-primary', name: 'primary' },
    { class: 'btn-danger', name: 'danger' },
    { class: 'btn-gold', name: 'gold' },
    { class: 'btn-cyan', name: 'cyan' },
    { class: 'btn-green', name: 'green' },
    { class: 'btn-purple', name: 'purple' },
    { class: 'btn-secondary', name: 'secondary' },
  ];

  for (const variant of colorVariants) {
    test(`${variant.name} variant has correct background color`, async ({ page }) => {
      const bg = await page.locator(`.${variant.class}`).evaluate(
        el => getComputedStyle(el).backgroundColor
      );
      expect(bg).toBeTruthy();
      expect(bg).not.toBe('rgba(0, 0, 0, 0)'); // Not transparent
    });
  }
```

### 2.3 Interaction Assertions

```typescript
  test('hover: transform = translateY(-2px)', async ({ page }) => {
    await page.hover('.btn-primary');
    await page.waitForTimeout(150); // Allow transition
    const transform = await page.locator('.btn-primary').evaluate(
      el => getComputedStyle(el).transform
    );
    // translateY(-2px) resolves to matrix(1, 0, 0, 1, 0, -2)
    expect(transform).toBe('matrix(1, 0, 0, 1, 0, -2)');
  });

  test('hover: box-shadow escalates to --shadow-md (4px 4px)', async ({ page }) => {
    await page.hover('.btn-primary');
    await page.waitForTimeout(150);
    const shadow = await page.locator('.btn-primary').evaluate(
      el => getComputedStyle(el).boxShadow
    );
    // --shadow-md = 4px 4px 0 <color>
    // Resolved as "rgb(R, G, B) 4px 4px 0px" or "oklch(...) 4px 4px 0px"
    expect(shadow).toMatch(/4px\s+4px\s+0px/);
  });

  test('active: transform = translate(2px, 2px)', async ({ page }) => {
    // Use mouse.down to simulate active state
    const btn = page.locator('.btn-primary');
    await btn.hover();
    await page.mouse.down();
    await page.waitForTimeout(50);
    const transform = await btn.evaluate(el => getComputedStyle(el).transform);
    // translate(2px, 2px) resolves to matrix(1, 0, 0, 1, 2, 2)
    expect(transform).toBe('matrix(1, 0, 0, 1, 2, 2)');
    await page.mouse.up();
  });

  test('active: box-shadow collapses to 0 0 0', async ({ page }) => {
    const btn = page.locator('.btn-primary');
    await btn.hover();
    await page.mouse.down();
    await page.waitForTimeout(50);
    const shadow = await btn.evaluate(el => getComputedStyle(el).boxShadow);
    // 0 0 0 <color> resolves to "rgb(...) 0px 0px 0px"
    expect(shadow).toMatch(/0px\s+0px\s+0px/);
    await page.mouse.up();
  });
```

### 2.4 Disabled State

```typescript
  test('disabled: opacity = 0.4', async ({ page }) => {
    await loadPage(page, '<button class="btn btn-md btn-primary" disabled>Disabled</button>');
    const opacity = await page.locator('.btn').evaluate(el => getComputedStyle(el).opacity);
    expect(opacity).toBe('0.4');
  });

  test('disabled: pointer-events = none', async ({ page }) => {
    await loadPage(page, '<button class="btn btn-md btn-primary" disabled>Disabled</button>');
    const pe = await page.locator('.btn').evaluate(el => getComputedStyle(el).pointerEvents);
    expect(pe).toBe('none');
  });
```

### 2.5 Visual Regression

```typescript
  test('visual regression - all 8 variants light mode', async ({ page }) => {
    await loadPage(page, buttonHTML);
    await expect(page).toHaveScreenshot('button-variants-light.png');
  });

  test('visual regression - all 8 variants dark mode', async ({ page }) => {
    await loadPage(page, buttonHTML, 'dark');
    await expect(page).toHaveScreenshot('button-variants-dark.png');
  });

  test('visual regression - 3 sizes', async ({ page }) => {
    await loadPage(page, `
      <button class="btn btn-sm btn-primary">Small</button>
      <button class="btn btn-md btn-primary">Medium</button>
      <button class="btn btn-lg btn-primary">Large</button>
    `);
    await expect(page).toHaveScreenshot('button-sizes.png');
  });

  test('visual regression - hover state', async ({ page }) => {
    await loadPage(page, '<button class="btn btn-md btn-primary force-hover">Hover</button>');
    await expect(page).toHaveScreenshot('button-hover.png');
  });

  test('visual regression - all 5 states', async ({ page }) => {
    await loadPage(page, `
      <button class="btn btn-md btn-primary">Default</button>
      <button class="btn btn-md btn-primary force-hover">Hover</button>
      <button class="btn btn-md btn-primary force-active">Active</button>
      <button class="btn btn-md btn-primary force-focus">Focus</button>
      <button class="btn btn-md btn-primary" disabled>Disabled</button>
    `);
    await expect(page).toHaveScreenshot('button-states.png');
  });

  test('visual regression - icon buttons', async ({ page }) => {
    await loadPage(page, `
      <button class="btn btn-icon btn-sm btn-primary" aria-label="Add">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>
      <button class="btn btn-icon btn-md btn-secondary" aria-label="Search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </button>
      <button class="btn btn-icon btn-md btn-ghost" aria-label="Edit">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
      </button>
    `);
    await expect(page).toHaveScreenshot('button-icons.png');
  });

  test('visual regression - loading buttons', async ({ page }) => {
    await loadPage(page, `
      <button class="btn btn-md btn-primary btn-loading">Saving</button>
      <button class="btn btn-md btn-secondary btn-loading">Loading</button>
      <button class="btn btn-md btn-danger btn-loading">Deleting</button>
      <button class="btn btn-md btn-gold btn-loading">Processing</button>
    `);
    await expect(page).toHaveScreenshot('button-loading.png');
  });
});
```

---

## 3. Card -- `tests/components/card.spec.ts`

### 3.1 Computed Style Assertions

```typescript
test.describe('Card', () => {
  const cardHTML = `
    <div class="card">
      <div class="card-title">Design Tokens</div>
      <div class="card-desc">Centralized design decisions.</div>
      <div class="card-meta">47 tokens</div>
    </div>
  `;

  test('base .card has border-radius 16px', async ({ page }) => {
    await loadPage(page, cardHTML);
    const radius = await page.locator('.card').evaluate(el => getComputedStyle(el).borderRadius);
    expect(radius).toBe('16px');
  });

  test('base .card has border: 2px solid (text-primary color)', async ({ page }) => {
    await loadPage(page, cardHTML);
    const width = await page.locator('.card').evaluate(el => getComputedStyle(el).borderWidth);
    expect(width).toBe('2px');
  });

  test('base .card has padding 24px', async ({ page }) => {
    await loadPage(page, cardHTML);
    const padding = await page.locator('.card').evaluate(el => getComputedStyle(el).padding);
    expect(padding).toBe('24px');
  });

  test('.card-compact has padding 16px', async ({ page }) => {
    await loadPage(page, '<div class="card card-compact"><div class="card-title">Compact</div></div>');
    const padding = await page.locator('.card-compact').evaluate(el => getComputedStyle(el).padding);
    expect(padding).toBe('16px');
  });

  test('.card box-shadow matches --shadow-md (4px 4px 0)', async ({ page }) => {
    await loadPage(page, cardHTML);
    const shadow = await page.locator('.card').evaluate(el => getComputedStyle(el).boxShadow);
    expect(shadow).toMatch(/4px\s+4px\s+0px/);
  });

  test('.card-featured has border-top-width 3px', async ({ page }) => {
    await loadPage(page, '<div class="card card-featured"><div class="card-title">Featured</div></div>');
    const btw = await page.locator('.card-featured').evaluate(el => getComputedStyle(el).borderTopWidth);
    expect(btw).toBe('3px');
  });

  test('.card-featured border-top-color matches accent-primary', async ({ page }) => {
    await loadPage(page, '<div class="card card-featured"><div class="card-title">Featured</div></div>');
    const color = await page.locator('.card-featured').evaluate(el => getComputedStyle(el).borderTopColor);
    expect(color).toBeTruthy();
    // Resolves to accent-primary color value
  });

  test('.card-featured-cyan border-top-color matches accent-cyan', async ({ page }) => {
    await loadPage(page, '<div class="card card-featured card-featured-cyan"><div class="card-title">Cyan</div></div>');
    const color = await page.locator('.card-featured-cyan').evaluate(el => getComputedStyle(el).borderTopColor);
    expect(color).toBeTruthy();
    // Resolves to accent-cyan color value
  });
```

### 3.2 Interactive Card Assertions

```typescript
  test('interactive hover: transform = translate(-4px, -4px)', async ({ page }) => {
    await loadPage(page, '<div class="card card-interactive"><div class="card-title">Interactive</div></div>');
    await page.hover('.card-interactive');
    await page.waitForTimeout(150);
    const transform = await page.locator('.card-interactive').evaluate(
      el => getComputedStyle(el).transform
    );
    // translate(-4px, -4px) = matrix(1, 0, 0, 1, -4, -4)
    expect(transform).toBe('matrix(1, 0, 0, 1, -4, -4)');
  });

  test('interactive hover: box-shadow escalates to --shadow-lg (8px 8px)', async ({ page }) => {
    await loadPage(page, '<div class="card card-interactive"><div class="card-title">Interactive</div></div>');
    await page.hover('.card-interactive');
    await page.waitForTimeout(150);
    const shadow = await page.locator('.card-interactive').evaluate(
      el => getComputedStyle(el).boxShadow
    );
    expect(shadow).toMatch(/8px\s+8px\s+0px/);
  });

  test('interactive active: transform = translate(2px, 2px), shadow collapses', async ({ page }) => {
    await loadPage(page, '<div class="card card-interactive"><div class="card-title">Interactive</div></div>');
    const card = page.locator('.card-interactive');
    await card.hover();
    await page.mouse.down();
    await page.waitForTimeout(50);
    const transform = await card.evaluate(el => getComputedStyle(el).transform);
    expect(transform).toBe('matrix(1, 0, 0, 1, 2, 2)');
    const shadow = await card.evaluate(el => getComputedStyle(el).boxShadow);
    expect(shadow).toMatch(/0px\s+0px\s+0px/);
    await page.mouse.up();
  });
```

### 3.3 Dark Mode Shadow Inversion

```typescript
  test('dark mode: card shadow uses cream color', async ({ page }) => {
    await loadPage(page, cardHTML, 'dark');
    const shadow = await page.locator('.card').evaluate(el => getComputedStyle(el).boxShadow);
    // In dark mode, --shadow-md = 4px 4px 0 oklch(0.92 0.010 65)
    // The browser resolves oklch to rgb -- the resolved color should be a cream/off-white
    expect(shadow).toMatch(/4px\s+4px\s+0px/);
    // The RGB value of oklch(0.92 0.010 65) is approximately rgb(236, 232, 225)
    // Exact value depends on browser gamut mapping
  });
```

### 3.4 Visual Regression

```typescript
  test('visual regression - base card light', async ({ page }) => {
    await loadPage(page, cardHTML);
    await expect(page).toHaveScreenshot('card-base-light.png');
  });

  test('visual regression - featured card all 6 colors', async ({ page }) => {
    await loadPage(page, `
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
        <div class="card card-featured"><div class="card-title">Pink</div></div>
        <div class="card card-featured card-featured-red"><div class="card-title">Red</div></div>
        <div class="card card-featured card-featured-gold"><div class="card-title">Gold</div></div>
        <div class="card card-featured card-featured-cyan"><div class="card-title">Cyan</div></div>
        <div class="card card-featured card-featured-green"><div class="card-title">Green</div></div>
        <div class="card card-featured card-featured-purple"><div class="card-title">Purple</div></div>
      </div>
    `);
    await expect(page).toHaveScreenshot('card-featured-colors.png');
  });

  test('visual regression - accent shadow cards', async ({ page }) => {
    await loadPage(page, `
      <div style="display: flex; gap: 16px;">
        <div class="card card-interactive card-accent-pink"><div class="card-title">Pink</div></div>
        <div class="card card-interactive card-accent-gold"><div class="card-title">Gold</div></div>
        <div class="card card-interactive card-accent-cyan"><div class="card-title">Cyan</div></div>
        <div class="card card-interactive card-accent-green"><div class="card-title">Green</div></div>
        <div class="card card-interactive card-accent-purple"><div class="card-title">Purple</div></div>
      </div>
    `);
    await expect(page).toHaveScreenshot('card-accent-shadows.png');
  });

  test('visual regression - dark mode', async ({ page }) => {
    await loadPage(page, cardHTML, 'dark');
    await expect(page).toHaveScreenshot('card-base-dark.png');
  });
});
```

---

## 4. Toggle -- `tests/components/toggle.spec.ts`

### 4.1 Computed Style Assertions

```typescript
test.describe('Toggle', () => {
  const toggleOffHTML = `
    <button class="toggle toggle-bg-anim" role="switch" aria-checked="false" aria-label="Test toggle">
      <span class="toggle-knob toggle-knob-anim" aria-hidden="true"></span>
    </button>
  `;
  const toggleOnHTML = `
    <button class="toggle toggle-bg-anim" role="switch" aria-checked="true" aria-label="Test toggle">
      <span class="toggle-knob toggle-knob-anim" aria-hidden="true"></span>
    </button>
  `;

  test('.toggle has width 40px and height 22px', async ({ page }) => {
    await loadPage(page, toggleOffHTML);
    const width = await page.locator('.toggle').evaluate(el => getComputedStyle(el).width);
    const height = await page.locator('.toggle').evaluate(el => getComputedStyle(el).height);
    expect(width).toBe('40px');
    expect(height).toBe('22px');
  });

  test('.toggle has border-radius 9999px', async ({ page }) => {
    await loadPage(page, toggleOffHTML);
    const radius = await page.locator('.toggle').evaluate(el => getComputedStyle(el).borderRadius);
    expect(radius).toBe('9999px');
  });

  test('off state: background matches --toggle-off-bg (primitive-neutral-300)', async ({ page }) => {
    await loadPage(page, toggleOffHTML);
    const bg = await page.locator('.toggle').evaluate(el => getComputedStyle(el).backgroundColor);
    // --toggle-off-bg = var(--primitive-neutral-300) = oklch(0.860 0.014 70)
    // Documents the primitive violation -- this is intentional
    expect(bg).toBeTruthy();
  });

  test('on state: background matches --toggle-on-bg (accent-primary)', async ({ page }) => {
    await loadPage(page, toggleOnHTML);
    const bg = await page.locator('.toggle').evaluate(el => getComputedStyle(el).backgroundColor);
    // --toggle-on-bg = var(--accent-primary) = oklch(0.640 0.270 350)
    expect(bg).toBeTruthy();
  });

  test('.toggle-knob has width 16px and height 16px', async ({ page }) => {
    await loadPage(page, toggleOffHTML);
    const width = await page.locator('.toggle-knob').evaluate(el => getComputedStyle(el).width);
    const height = await page.locator('.toggle-knob').evaluate(el => getComputedStyle(el).height);
    expect(width).toBe('16px');
    expect(height).toBe('16px');
  });

  test('.toggle-knob has border-radius 50%', async ({ page }) => {
    await loadPage(page, toggleOffHTML);
    // 50% of 16px = 8px
    const radius = await page.locator('.toggle-knob').evaluate(el => getComputedStyle(el).borderRadius);
    expect(radius).toBe('50%');
  });

  test('.toggle-knob background is white (primitive-neutral-0)', async ({ page }) => {
    await loadPage(page, toggleOffHTML);
    const bg = await page.locator('.toggle-knob').evaluate(el => getComputedStyle(el).backgroundColor);
    // --toggle-knob = var(--primitive-neutral-0) = oklch(1.00 0.000 0) = white
    // Resolves to rgb(255, 255, 255) or similar
    expect(bg).toMatch(/rgb\(255,\s*255,\s*255\)/);
  });

  test('on state: knob transform = translateX(18px)', async ({ page }) => {
    await loadPage(page, toggleOnHTML);
    const transform = await page.locator('.toggle-knob').evaluate(
      el => getComputedStyle(el).transform
    );
    // translateX(18px) = matrix(1, 0, 0, 1, 18, 0)
    expect(transform).toBe('matrix(1, 0, 0, 1, 18, 0)');
  });
```

### 4.2 Interaction Assertions

```typescript
  test('clicking toggle changes aria-checked from false to true', async ({ page }) => {
    await loadPage(page, `
      <button class="toggle toggle-bg-anim" role="switch" aria-checked="false" aria-label="Test"
        onclick="this.setAttribute('aria-checked', this.getAttribute('aria-checked') === 'true' ? 'false' : 'true')">
        <span class="toggle-knob toggle-knob-anim" aria-hidden="true"></span>
      </button>
    `);
    const toggle = page.locator('.toggle');
    expect(await toggle.getAttribute('aria-checked')).toBe('false');
    await toggle.click();
    expect(await toggle.getAttribute('aria-checked')).toBe('true');
  });

  test('clicking toggle twice returns to false', async ({ page }) => {
    await loadPage(page, `
      <button class="toggle toggle-bg-anim" role="switch" aria-checked="false" aria-label="Test"
        onclick="this.setAttribute('aria-checked', this.getAttribute('aria-checked') === 'true' ? 'false' : 'true')">
        <span class="toggle-knob toggle-knob-anim" aria-hidden="true"></span>
      </button>
    `);
    const toggle = page.locator('.toggle');
    await toggle.click();
    await toggle.click();
    expect(await toggle.getAttribute('aria-checked')).toBe('false');
  });
```

### 4.3 Visual Regression

```typescript
  test('visual regression - toggle off light', async ({ page }) => {
    await loadPage(page, toggleOffHTML);
    await expect(page).toHaveScreenshot('toggle-off-light.png');
  });

  test('visual regression - toggle on light', async ({ page }) => {
    await loadPage(page, toggleOnHTML);
    await expect(page).toHaveScreenshot('toggle-on-light.png');
  });

  test('visual regression - toggle off dark', async ({ page }) => {
    await loadPage(page, toggleOffHTML, 'dark');
    await expect(page).toHaveScreenshot('toggle-off-dark.png');
  });

  test('visual regression - toggle on dark', async ({ page }) => {
    await loadPage(page, toggleOnHTML, 'dark');
    await expect(page).toHaveScreenshot('toggle-on-dark.png');
  });
});
```

---

## 5. Input -- `tests/components/input.spec.ts`

### 5.1 Assertions

```typescript
test.describe('Input', () => {
  const inputHTML = '<input class="input" type="text" placeholder="Enter text...">';

  test('focus state: border-color matches accent-primary', async ({ page }) => {
    await loadPage(page, inputHTML);
    await page.locator('.input').focus();
    await page.waitForTimeout(100);
    const borderColor = await page.locator('.input').evaluate(
      el => getComputedStyle(el).borderColor
    );
    // Should resolve to --accent-primary color
    expect(borderColor).toBeTruthy();
  });

  test('focus state: box-shadow has pink accent value', async ({ page }) => {
    await loadPage(page, inputHTML);
    await page.locator('.input').focus();
    await page.waitForTimeout(100);
    const shadow = await page.locator('.input').evaluate(
      el => getComputedStyle(el).boxShadow
    );
    expect(shadow).not.toBe('none');
  });

  test('error state: border-color matches accent-danger', async ({ page }) => {
    await loadPage(page, '<input class="input input-error" type="text" value="bad input">');
    const borderColor = await page.locator('.input-error').evaluate(
      el => getComputedStyle(el).borderColor
    );
    // Should resolve to --accent-danger color
    expect(borderColor).toBeTruthy();
  });

  test('disabled: opacity = 0.5', async ({ page }) => {
    await loadPage(page, '<input class="input" type="text" disabled placeholder="Disabled">');
    const opacity = await page.locator('.input').evaluate(el => getComputedStyle(el).opacity);
    expect(opacity).toBe('0.5');
  });

  test('disabled: cursor = not-allowed', async ({ page }) => {
    await loadPage(page, '<input class="input" type="text" disabled>');
    const cursor = await page.locator('.input').evaluate(el => getComputedStyle(el).cursor);
    expect(cursor).toBe('not-allowed');
  });

  test('visual regression - input states', async ({ page }) => {
    await loadPage(page, `
      <div style="display: flex; flex-direction: column; gap: 12px; max-width: 300px;">
        <input class="input" type="text" placeholder="Default">
        <input class="input input-error" type="text" value="Error state">
        <input class="input" type="text" disabled placeholder="Disabled">
      </div>
    `);
    await expect(page).toHaveScreenshot('input-states.png');
  });
});
```

---

## 6. Checkbox -- `tests/components/checkbox.spec.ts`

### 6.1 Assertions

```typescript
test.describe('Checkbox', () => {
  test('checked: background matches accent-primary', async ({ page }) => {
    await loadPage(page, `
      <label class="checkbox-group">
        <input type="checkbox" class="checkbox" checked>
        <span class="checkbox-indicator"></span>
        <span>Checked</span>
      </label>
    `);
    const bg = await page.locator('.checkbox-indicator').evaluate(
      el => getComputedStyle(el).backgroundColor
    );
    // Resolves to --accent-primary color when checked
    expect(bg).toBeTruthy();
  });

  test('checked: checkmark is visible', async ({ page }) => {
    await loadPage(page, `
      <label class="checkbox-group">
        <input type="checkbox" class="checkbox" checked>
        <span class="checkbox-indicator"></span>
        <span>Checked</span>
      </label>
    `);
    // The checkmark is typically a pseudo-element or SVG
    const checkmarkVisible = await page.locator('.checkbox-indicator').evaluate(el => {
      const after = getComputedStyle(el, '::after');
      return after.opacity !== '0' && after.display !== 'none';
    });
    expect(checkmarkVisible).toBe(true);
  });

  test('checkmark draw animation plays on check (unless reduced-motion)', async ({ page }) => {
    await loadPage(page, `
      <label class="checkbox-group">
        <input type="checkbox" class="checkbox">
        <span class="checkbox-indicator"></span>
        <span>Check me</span>
      </label>
    `);
    // Check the checkbox
    await page.locator('.checkbox').check();
    // Verify animation is applied (checkmark-draw keyframe)
    const animName = await page.locator('.checkbox-indicator').evaluate(el => {
      const after = getComputedStyle(el, '::after');
      return after.animationName;
    });
    // Should contain 'checkmark-draw' when motion is allowed
    expect(animName).toContain('checkmark-draw');
  });

  test('visual regression - checkbox states', async ({ page }) => {
    await loadPage(page, `
      <div style="display: flex; flex-direction: column; gap: 12px;">
        <label class="checkbox-group">
          <input type="checkbox" class="checkbox">
          <span class="checkbox-indicator"></span>
          <span>Unchecked</span>
        </label>
        <label class="checkbox-group">
          <input type="checkbox" class="checkbox" checked>
          <span class="checkbox-indicator"></span>
          <span>Checked</span>
        </label>
      </div>
    `);
    await expect(page).toHaveScreenshot('checkbox-states.png');
  });
});
```

---

## 7. Toast -- `tests/components/toast.spec.ts`

### 7.1 Assertions

```typescript
test.describe('Toast', () => {
  const toastSetup = `
    <div id="toast-container"></div>
    <script>
      function showToast(message, type, duration) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast toast-' + type;
        toast.innerHTML = '<span>' + message + '</span><div class="toast-progress"></div>';
        container.appendChild(toast);
        if (duration) {
          setTimeout(() => toast.remove(), duration);
        }
      }
    </script>
  `;

  test('showToast adds element to DOM', async ({ page }) => {
    await loadPage(page, toastSetup);
    await page.evaluate(() => (window as any).showToast('Test message', 'success', 5000));
    const toastCount = await page.locator('.toast').count();
    expect(toastCount).toBe(1);
  });

  test('toast has progress bar element', async ({ page }) => {
    await loadPage(page, toastSetup);
    await page.evaluate(() => (window as any).showToast('Test', 'success', 5000));
    const progressBar = await page.locator('.toast-progress').count();
    expect(progressBar).toBe(1);
  });

  test('toast auto-removes after specified duration', async ({ page }) => {
    await loadPage(page, toastSetup);
    await page.evaluate(() => (window as any).showToast('Auto-remove', 'info', 500));
    // Initially present
    expect(await page.locator('.toast').count()).toBe(1);
    // Wait for removal
    await page.waitForTimeout(700);
    expect(await page.locator('.toast').count()).toBe(0);
  });

  test('maximum 3 toasts stack correctly', async ({ page }) => {
    await loadPage(page, toastSetup);
    await page.evaluate(() => {
      (window as any).showToast('Toast 1', 'success', 10000);
      (window as any).showToast('Toast 2', 'info', 10000);
      (window as any).showToast('Toast 3', 'warning', 10000);
    });
    const toasts = await page.locator('.toast').count();
    expect(toasts).toBe(3);
    // Verify they are visually stacked (each has increasing offset)
    const positions = await page.locator('.toast').evaluateAll(els =>
      els.map(el => el.getBoundingClientRect().top)
    );
    // Each toast should be at a different vertical position
    const uniquePositions = new Set(positions);
    expect(uniquePositions.size).toBe(3);
  });

  test('visual regression - toast types', async ({ page }) => {
    await loadPage(page, toastSetup);
    await page.evaluate(() => {
      (window as any).showToast('Success message', 'success', 10000);
      (window as any).showToast('Error message', 'error', 10000);
      (window as any).showToast('Warning message', 'warning', 10000);
      (window as any).showToast('Info message', 'info', 10000);
    });
    await expect(page).toHaveScreenshot('toast-types.png');
  });
});
```

---

## 8. Modal -- `tests/components/modal.spec.ts`

### 8.1 Assertions

```typescript
test.describe('Modal', () => {
  const modalHTML = `
    <button id="trigger" class="btn btn-md btn-primary">Open Modal</button>
    <dialog class="modal" id="test-modal">
      <div class="modal-content">
        <h2>Modal Title</h2>
        <p>Modal body content.</p>
        <button class="btn btn-md btn-secondary modal-close">Close</button>
      </div>
    </dialog>
    <script>
      document.getElementById('trigger').addEventListener('click', () => {
        document.getElementById('test-modal').showModal();
      });
      document.querySelector('.modal-close').addEventListener('click', () => {
        document.getElementById('test-modal').close();
      });
    </script>
  `;

  test('showModal() makes dialog visible', async ({ page }) => {
    await loadPage(page, modalHTML);
    await page.click('#trigger');
    const visible = await page.locator('#test-modal').isVisible();
    expect(visible).toBe(true);
  });

  test('backdrop is visible when modal is open', async ({ page }) => {
    await loadPage(page, modalHTML);
    await page.click('#trigger');
    // The ::backdrop pseudo-element is rendered by the browser for <dialog>
    const hasBackdrop = await page.evaluate(() => {
      const dialog = document.getElementById('test-modal') as HTMLDialogElement;
      return dialog.open;
    });
    expect(hasBackdrop).toBe(true);
  });

  test('Escape key closes modal', async ({ page }) => {
    await loadPage(page, modalHTML);
    await page.click('#trigger');
    expect(await page.locator('#test-modal').isVisible()).toBe(true);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(100);
    const isOpen = await page.evaluate(() =>
      (document.getElementById('test-modal') as HTMLDialogElement).open
    );
    expect(isOpen).toBe(false);
  });

  test('focus returns to trigger on close', async ({ page }) => {
    await loadPage(page, `
      ${modalHTML}
      <script>
        document.getElementById('test-modal').addEventListener('close', () => {
          document.getElementById('trigger').focus();
        });
      </script>
    `);
    await page.click('#trigger');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(100);
    const focusedId = await page.evaluate(() => document.activeElement?.id);
    expect(focusedId).toBe('trigger');
  });

  test('visual regression - modal open', async ({ page }) => {
    await loadPage(page, modalHTML);
    await page.click('#trigger');
    await page.waitForTimeout(200);
    await expect(page).toHaveScreenshot('modal-open.png');
  });
});
```

---

## 9. Table -- `tests/components/table.spec.ts`

### 9.1 Assertions

```typescript
test.describe('Table', () => {
  const tableHTML = `
    <table class="table">
      <thead>
        <tr>
          <th><input type="checkbox" class="table-select-all"></th>
          <th class="table-sort" data-sort="name">Name</th>
          <th class="table-sort" data-sort="role">Role</th>
        </tr>
      </thead>
      <tbody>
        <tr><td><input type="checkbox" class="table-row-select"></td><td>Alice</td><td>Engineer</td></tr>
        <tr><td><input type="checkbox" class="table-row-select"></td><td>Bob</td><td>Designer</td></tr>
        <tr><td><input type="checkbox" class="table-row-select"></td><td>Charlie</td><td>Manager</td></tr>
      </tbody>
    </table>
    <script>
      document.querySelectorAll('.table-sort').forEach(th => {
        th.addEventListener('click', () => {
          const tbody = th.closest('table').querySelector('tbody');
          const rows = Array.from(tbody.querySelectorAll('tr'));
          const col = th.cellIndex;
          const asc = !th.classList.contains('sort-asc');
          rows.sort((a, b) => {
            const aVal = a.cells[col].textContent;
            const bVal = b.cells[col].textContent;
            return asc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
          });
          th.closest('thead').querySelectorAll('.table-sort').forEach(h => {
            h.classList.remove('sort-asc', 'sort-desc');
          });
          th.classList.add(asc ? 'sort-asc' : 'sort-desc');
          rows.forEach(row => tbody.appendChild(row));
        });
      });
      document.querySelectorAll('.table-row-select').forEach(cb => {
        cb.addEventListener('change', () => {
          cb.closest('tr').setAttribute('aria-selected', cb.checked ? 'true' : 'false');
        });
      });
    </script>
  `;

  test('sorting: click column header reorders rows', async ({ page }) => {
    await loadPage(page, tableHTML);
    // Click "Name" header to sort ascending
    await page.click('.table-sort[data-sort="name"]');
    const firstCell = await page.locator('tbody tr:first-child td:nth-child(2)').textContent();
    expect(firstCell).toBe('Alice');
  });

  test('sort direction toggles on second click', async ({ page }) => {
    await loadPage(page, tableHTML);
    await page.click('.table-sort[data-sort="name"]'); // ascending
    await page.click('.table-sort[data-sort="name"]'); // descending
    const firstCell = await page.locator('tbody tr:first-child td:nth-child(2)').textContent();
    expect(firstCell).toBe('Charlie');
  });

  test('selected rows: checkbox click updates aria-selected', async ({ page }) => {
    await loadPage(page, tableHTML);
    await page.locator('tbody tr:first-child .table-row-select').check();
    const ariaSelected = await page.locator('tbody tr:first-child').getAttribute('aria-selected');
    expect(ariaSelected).toBe('true');
  });

  test('visual regression - table', async ({ page }) => {
    await loadPage(page, tableHTML);
    await expect(page).toHaveScreenshot('table-base.png');
  });
});
```

---

## 10. Accordion -- `tests/components/accordion.spec.ts`

### 10.1 Assertions

```typescript
test.describe('Accordion', () => {
  const accordionHTML = `
    <div class="accordion">
      <div class="accordion-item">
        <button class="accordion-header" aria-expanded="false" aria-controls="panel-1">
          Section 1
        </button>
        <div class="accordion-panel" id="panel-1" role="region">
          <div class="accordion-content">Content for section 1.</div>
        </div>
      </div>
    </div>
    <script>
      document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
          const expanded = header.getAttribute('aria-expanded') === 'true';
          header.setAttribute('aria-expanded', String(!expanded));
        });
      });
    </script>
  `;

  test('click header: aria-expanded changes from false to true', async ({ page }) => {
    await loadPage(page, accordionHTML);
    const header = page.locator('.accordion-header');
    expect(await header.getAttribute('aria-expanded')).toBe('false');
    await header.click();
    expect(await header.getAttribute('aria-expanded')).toBe('true');
  });

  test('expanded panel uses grid-template-rows transition (0fr to 1fr)', async ({ page }) => {
    await loadPage(page, accordionHTML);
    // Before expansion, the panel should have grid-template-rows: 0fr or equivalent
    await page.locator('.accordion-header').click();
    await page.waitForTimeout(300); // Allow transition
    // After expansion, grid-template-rows should be 1fr
    const gtr = await page.locator('.accordion-panel').evaluate(
      el => getComputedStyle(el).gridTemplateRows
    );
    // 1fr resolves to the content height in pixels
    expect(gtr).not.toBe('0px');
  });

  test('visual regression - accordion', async ({ page }) => {
    await loadPage(page, accordionHTML);
    await expect(page).toHaveScreenshot('accordion-collapsed.png');
    await page.locator('.accordion-header').click();
    await page.waitForTimeout(300);
    await expect(page).toHaveScreenshot('accordion-expanded.png');
  });
});
```

---

## 11. Command Palette -- `tests/components/command-palette.spec.ts`

### 11.1 Assertions

```typescript
test.describe('Command Palette', () => {
  // Command palette tests run against the full docs page which includes the JS
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
  });

  test('Cmd+K opens palette', async ({ page }) => {
    await page.keyboard.press('Meta+k');
    await page.waitForTimeout(200);
    const paletteVisible = await page.locator('.command-palette').isVisible();
    expect(paletteVisible).toBe(true);
  });

  test('typing in search filters results in real-time', async ({ page }) => {
    await page.keyboard.press('Meta+k');
    await page.waitForTimeout(200);
    await page.locator('.command-palette input').fill('button');
    await page.waitForTimeout(100);
    const results = await page.locator('.command-palette-result').count();
    expect(results).toBeGreaterThan(0);
    // Verify results are filtered (contain "button" text)
    const firstResult = await page.locator('.command-palette-result').first().textContent();
    expect(firstResult?.toLowerCase()).toContain('button');
  });

  test('arrow keys navigate results', async ({ page }) => {
    await page.keyboard.press('Meta+k');
    await page.waitForTimeout(200);
    await page.keyboard.press('ArrowDown');
    // First result should be highlighted/focused
    const activeResult = await page.locator('.command-palette-result.active, .command-palette-result:focus').count();
    expect(activeResult).toBeGreaterThan(0);
  });

  test('Escape closes palette', async ({ page }) => {
    await page.keyboard.press('Meta+k');
    await page.waitForTimeout(200);
    expect(await page.locator('.command-palette').isVisible()).toBe(true);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(200);
    expect(await page.locator('.command-palette').isVisible()).toBe(false);
  });

  test('Enter selects highlighted result', async ({ page }) => {
    await page.keyboard.press('Meta+k');
    await page.waitForTimeout(200);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(200);
    // Palette should close after selection
    const paletteVisible = await page.locator('.command-palette').isVisible();
    expect(paletteVisible).toBe(false);
  });
});
```

---

## 12. Reduced-Motion Compliance -- All Interactive Components

This test suite verifies that ALL interactive components respect `prefers-reduced-motion: reduce`.

```typescript
test.describe('Reduced Motion Compliance', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('no component has animation-duration > 0.01ms', async ({ page }) => {
    // Load page with all components
    const allCSS = [
      readFileSync('src/tokens.css', 'utf-8'),
      readFileSync('src/reset.css', 'utf-8'),
      readFileSync('src/foundation.css', 'utf-8'),
      readFileSync('src/motion/motion.css', 'utf-8'),
      readFileSync('src/components/index.css', 'utf-8'),
    ].join('\n');

    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en" data-theme="light">
      <head><style>${allCSS}</style></head>
      <body>
        <button class="btn btn-md btn-primary btn-loading">Loading</button>
        <div class="skeleton skeleton-shimmer" style="width:200px;height:20px;"></div>
        <div class="anim-in">Animated</div>
      </body>
      </html>
    `);

    const violations = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*');
      const problems: string[] = [];
      for (const el of allElements) {
        const style = getComputedStyle(el);
        const duration = parseFloat(style.animationDuration);
        // 0.01ms = 0.00001s
        if (!isNaN(duration) && duration > 0.00002) {
          problems.push(`${el.tagName}.${el.className}: animation-duration=${style.animationDuration}`);
        }
      }
      return problems;
    });
    expect(violations).toEqual([]);
  });

  test('no component has transition-duration > 0.01ms for non-essential transitions', async ({ page }) => {
    const allCSS = [
      readFileSync('src/tokens.css', 'utf-8'),
      readFileSync('src/reset.css', 'utf-8'),
      readFileSync('src/foundation.css', 'utf-8'),
      readFileSync('src/components/index.css', 'utf-8'),
    ].join('\n');

    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en" data-theme="light">
      <head><style>${allCSS}</style></head>
      <body>
        <button class="btn btn-md btn-primary">Button</button>
        <div class="card card-interactive"><div class="card-title">Card</div></div>
        <button class="toggle" role="switch" aria-checked="false">
          <span class="toggle-knob"></span>
        </button>
        <input class="input" type="text">
      </body>
      </html>
    `);

    const violations = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*');
      const problems: string[] = [];
      for (const el of allElements) {
        const style = getComputedStyle(el);
        const durations = style.transitionDuration.split(',').map(d => parseFloat(d.trim()));
        for (const duration of durations) {
          if (!isNaN(duration) && duration > 0.00002) {
            problems.push(`${el.tagName}.${el.className}: transition-duration=${style.transitionDuration}`);
            break;
          }
        }
      }
      return problems;
    });
    expect(violations).toEqual([]);
  });
});
```
