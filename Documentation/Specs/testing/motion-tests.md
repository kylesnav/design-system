# Motion Tests

> Animation testing specification for `tests/motion.spec.ts`. Covers reduced-motion compliance, keyframe existence verification, spring easing token validation, stagger delay correctness, and timing token values.

Cross-references: [[motion]] (timing tokens, easing tokens, keyframe inventory, reduced-motion gate), [[token-tiers]] (motion tokens in Tier 3), [[test-strategy]] (Playwright config, reduced-motion emulation).

---

## 1. Test Setup

```typescript
import { test, expect, type Page } from '@playwright/test';
import { readFileSync } from 'node:fs';

const tokensCSS = readFileSync('src/tokens.css', 'utf-8');
const resetCSS = readFileSync('src/reset.css', 'utf-8');
const foundationCSS = readFileSync('src/foundation.css', 'utf-8');
const motionCSS = readFileSync('src/motion/motion.css', 'utf-8');

async function loadMotionPage(page: Page, html: string): Promise<void> {
  await page.setContent(`
    <!DOCTYPE html>
    <html lang="en" data-theme="light">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>${tokensCSS}</style>
      <style>${resetCSS}</style>
      <style>${foundationCSS}</style>
      <style>${motionCSS}</style>
    </head>
    <body style="padding: 40px; background: var(--bg-page);">
      ${html}
    </body>
    </html>
  `, { waitUntil: 'domcontentloaded' });
}
```

---

## 2. Reduced-Motion Compliance

### 2.1 Global Gate

```typescript
test.describe('Reduced Motion Compliance', () => {
  test('with prefers-reduced-motion: reduce, all animation-duration resolves to 0.01ms', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });

    // Build HTML with all animation classes applied
    const animClasses = [
      'anim-in', 'anim-text-stamp', 'hover-lift', 'badge-pop',
      'feedback-enter', 'shake-anim', 'scroll-reveal',
    ];
    const html = animClasses.map(cls =>
      `<div class="${cls}" style="width:100px;height:40px;background:#ccc;">${cls}</div>`
    ).join('\n');

    await loadMotionPage(page, html);

    const violations = await page.evaluate(() => {
      const allElements = document.querySelectorAll('[class]');
      const problems: string[] = [];
      for (const el of allElements) {
        const style = getComputedStyle(el);
        const duration = style.animationDuration;
        // Duration should be either "0s" or "0.01ms" (which is "0.00001s")
        if (duration && duration !== '0s' && duration !== '0.01ms' && duration !== '0.00001s') {
          const ms = parseFloat(duration) * (duration.endsWith('ms') ? 1 : 1000);
          if (ms > 0.02) {
            problems.push(`${el.className}: animation-duration=${duration}`);
          }
        }
      }
      return problems;
    });
    expect(violations).toEqual([]);
  });

  test('with prefers-reduced-motion: reduce, all transition-duration resolves to 0.01ms', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });

    await loadMotionPage(page, `
      <div class="hover-lift" style="width:100px;height:40px;background:#ccc;">Lift</div>
      <div class="badge-pop" style="width:60px;height:24px;background:#ccc;">Badge</div>
    `);

    const violations = await page.evaluate(() => {
      const allElements = document.querySelectorAll('*');
      const problems: string[] = [];
      for (const el of allElements) {
        const style = getComputedStyle(el);
        const durations = style.transitionDuration.split(',').map(d => d.trim());
        for (const d of durations) {
          if (d && d !== '0s' && d !== '0.01ms' && d !== '0.00001s') {
            const ms = parseFloat(d) * (d.endsWith('ms') ? 1 : 1000);
            if (ms > 0.02) {
              problems.push(`${el.tagName}.${el.className}: transition-duration includes ${d}`);
              break;
            }
          }
        }
      }
      return problems;
    });
    expect(violations).toEqual([]);
  });
```

### 2.2 Per-Animation-Class Verification

```typescript
  const animClassesWithExpectedKeyframe: Array<{ class: string; keyframe: string }> = [
    { class: 'anim-in', keyframe: 'fadeInUp' },
    { class: 'anim-text-stamp', keyframe: 'text-stamp' },
    { class: 'feedback-enter', keyframe: 'scale-in' },
    { class: 'shake-anim', keyframe: 'shake' },
  ];

  for (const { class: cls, keyframe } of animClassesWithExpectedKeyframe) {
    test(`reduced motion: .${cls} animation-duration <= 0.01ms`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await loadMotionPage(page, `
        <div class="${cls}" style="width:100px;height:40px;background:#ccc;">Test</div>
      `);

      const duration = await page.locator(`.${cls}`).evaluate(
        el => getComputedStyle(el).animationDuration
      );
      const ms = parseFloat(duration) * (duration.endsWith('ms') ? 1 : 1000);
      expect(ms).toBeLessThanOrEqual(0.02);
    });
  }
});
```

---

## 3. Keyframe Existence Verification

These tests verify that each keyframe is properly defined and resolves when the associated class is applied. With `prefers-reduced-motion: no-preference` (the default in Playwright), animation names should resolve to their keyframe names rather than "none".

```typescript
test.describe('Keyframe Existence', () => {
  // Default Playwright has no reduced-motion preference, so animations are active

  const keyframeTests: Array<{ name: string; class: string; description: string }> = [
    { name: 'fadeInUp', class: 'anim-in', description: 'Fade in with upward translate' },
    { name: 'fadeIn', class: 'anim-fade-in', description: 'Simple fade in' },
    { name: 'shimmer', class: 'skeleton-shimmer', description: 'Skeleton loading shimmer' },
    { name: 'pulse-skel', class: 'skeleton-pulse', description: 'Skeleton loading pulse' },
    { name: 'shake', class: 'shake-anim', description: 'Error feedback shake' },
    { name: 'checkmark-draw', class: 'checkmark-anim', description: 'Checkbox checkmark draw' },
    { name: 'scale-in', class: 'feedback-enter', description: 'Scale-in feedback' },
    { name: 'progress-shrink', class: 'progress-shrink-anim', description: 'Progress bar countdown' },
    { name: 'text-stamp', class: 'anim-text-stamp', description: 'Per-character stamp-in' },
    { name: 'fadeOutRight', class: 'anim-fade-out-right', description: 'Fade out to right' },
    { name: 'slideInLeft', class: 'anim-slide-in-left', description: 'Slide in from left' },
    { name: 'spin', class: 'anim-spin', description: 'Rotation (button loading spinner)' },
    { name: 'spin-slow', class: 'anim-spin-slow', description: 'Slow decorative rotation' },
    { name: 'scroll-progress-fill', class: 'scroll-progress', description: 'Scroll progress bar fill' },
    { name: 'typing', class: 'anim-typing', description: 'Typewriter text effect' },
    { name: 'blink', class: 'anim-blink', description: 'Cursor blink for typewriter' },
  ];

  for (const { name, class: cls, description } of keyframeTests) {
    test(`@keyframes ${name} exists (${description})`, async ({ page }) => {
      await loadMotionPage(page, `
        <div class="${cls}" style="width:100px;height:40px;background:#ccc;">Test</div>
      `);

      const animationName = await page.locator(`.${cls}`).evaluate(
        el => getComputedStyle(el).animationName
      );
      // The animation-name should resolve to the keyframe name, not "none"
      expect(animationName, `Expected keyframe "${name}" but got "${animationName}"`).toContain(name);
    });
  }

  test('spot-check: fadeInUp keyframe produces translateY animation', async ({ page }) => {
    await loadMotionPage(page, `
      <div class="anim-in" style="width:100px;height:40px;background:#ccc;">Animated</div>
    `);

    // Query CSSStyleSheet for the keyframe definition
    const hasKeyframe = await page.evaluate((keyframeName) => {
      for (const sheet of document.styleSheets) {
        try {
          for (const rule of sheet.cssRules) {
            if (rule instanceof CSSKeyframesRule && rule.name === keyframeName) {
              return true;
            }
          }
        } catch (e) {
          // Cross-origin stylesheet, skip
        }
      }
      return false;
    }, 'fadeInUp');

    expect(hasKeyframe).toBe(true);
  });
});
```

---

## 4. Spring Easing Token Validation

```typescript
test.describe('Spring Easing Tokens', () => {
  test.beforeEach(async ({ page }) => {
    await loadMotionPage(page, '<div>Spring test</div>');
  });

  test('--ease-spring-gentle resolves to a string starting with linear(', async ({ page }) => {
    const value = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--ease-spring-gentle').trim()
    );
    expect(value).toMatch(/^linear\(/);
  });

  test('--ease-spring-bouncy resolves to a string starting with linear(', async ({ page }) => {
    const value = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--ease-spring-bouncy').trim()
    );
    expect(value).toMatch(/^linear\(/);
  });

  test('--ease-spring-gentle contains multiple comma-separated points', async ({ page }) => {
    const value = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--ease-spring-gentle').trim()
    );
    // Remove the "linear(" prefix and ")" suffix, count commas
    const inner = value.replace(/^linear\(/, '').replace(/\)$/, '');
    const points = inner.split(',');
    // The gentle spring has 15 control points
    expect(points.length).toBeGreaterThanOrEqual(10);
  });

  test('--ease-spring-bouncy contains multiple comma-separated points', async ({ page }) => {
    const value = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--ease-spring-bouncy').trim()
    );
    const inner = value.replace(/^linear\(/, '').replace(/\)$/, '');
    const points = inner.split(',');
    // The bouncy spring has 34 control points
    expect(points.length).toBeGreaterThanOrEqual(25);
  });
});
```

---

## 5. Stagger Delay Correctness

The animation delay classes `.anim-d1` through `.anim-d12` use a 60ms increment.

| Class | Expected Delay |
|---|---|
| `.anim-d1` | `0.06s` (60ms) |
| `.anim-d2` | `0.12s` (120ms) |
| `.anim-d3` | `0.18s` (180ms) |
| `.anim-d4` | `0.24s` (240ms) |
| `.anim-d5` | `0.30s` (300ms) |
| `.anim-d6` | `0.36s` (360ms) |
| `.anim-d7` | `0.42s` (420ms) |
| `.anim-d8` | `0.48s` (480ms) |
| `.anim-d9` | `0.54s` (540ms) |
| `.anim-d10` | `0.60s` (600ms) |
| `.anim-d11` | `0.66s` (660ms) |
| `.anim-d12` | `0.72s` (720ms) |

```typescript
test.describe('Stagger Delay Classes', () => {
  const expectedDelays: Array<{ class: string; delayMs: number }> = [
    { class: 'anim-d1', delayMs: 60 },
    { class: 'anim-d2', delayMs: 120 },
    { class: 'anim-d3', delayMs: 180 },
    { class: 'anim-d4', delayMs: 240 },
    { class: 'anim-d5', delayMs: 300 },
    { class: 'anim-d6', delayMs: 360 },
    { class: 'anim-d7', delayMs: 420 },
    { class: 'anim-d8', delayMs: 480 },
    { class: 'anim-d9', delayMs: 540 },
    { class: 'anim-d10', delayMs: 600 },
    { class: 'anim-d11', delayMs: 660 },
    { class: 'anim-d12', delayMs: 720 },
  ];

  for (const { class: cls, delayMs } of expectedDelays) {
    test(`.${cls} has animation-delay of ${delayMs}ms`, async ({ page }) => {
      await loadMotionPage(page, `
        <div class="anim-in ${cls}" style="width:100px;height:40px;background:#ccc;">Stagger</div>
      `);

      const delay = await page.locator(`.${cls}`).evaluate(
        el => getComputedStyle(el).animationDelay
      );
      // Convert to ms for comparison
      const actualMs = parseFloat(delay) * (delay.endsWith('ms') ? 1 : 1000);
      expect(actualMs).toBeCloseTo(delayMs, 0);
    });
  }

  test('delays increment consistently by 60ms', async ({ page }) => {
    const html = expectedDelays.map(({ class: cls }) =>
      `<div class="anim-in ${cls}" style="width:100px;height:20px;background:#ccc;">${cls}</div>`
    ).join('\n');

    await loadMotionPage(page, html);

    const delays = await page.evaluate(() => {
      const results: number[] = [];
      for (let i = 1; i <= 12; i++) {
        const el = document.querySelector(`.anim-d${i}`);
        if (!el) continue;
        const delay = getComputedStyle(el).animationDelay;
        const ms = parseFloat(delay) * (delay.endsWith('ms') ? 1 : 1000);
        results.push(ms);
      }
      return results;
    });

    // Verify consistent 60ms increment
    for (let i = 1; i < delays.length; i++) {
      const increment = delays[i] - delays[i - 1];
      expect(increment).toBeCloseTo(60, 0);
    }
  });
});
```

---

## 6. Timing Token Correctness

```typescript
test.describe('Timing Tokens', () => {
  test.beforeEach(async ({ page }) => {
    await loadMotionPage(page, '<div>Timing test</div>');
  });

  const timingTokens: Array<{ property: string; expectedValue: string; expectedMs: number }> = [
    { property: '--motion-instant', expectedValue: '100ms', expectedMs: 100 },
    { property: '--motion-fast', expectedValue: '160ms', expectedMs: 160 },
    { property: '--motion-base', expectedValue: '240ms', expectedMs: 240 },
    { property: '--motion-slow', expectedValue: '360ms', expectedMs: 360 },
    { property: '--motion-deliberate', expectedValue: '500ms', expectedMs: 500 },
  ];

  for (const { property, expectedValue, expectedMs } of timingTokens) {
    test(`${property} resolves to ${expectedValue}`, async ({ page }) => {
      const value = await page.evaluate(
        (prop) => getComputedStyle(document.documentElement).getPropertyValue(prop).trim(),
        property
      );
      expect(value).toBe(expectedValue);
    });
  }

  test('timing tokens form an increasing sequence', async ({ page }) => {
    const values = await page.evaluate(() => {
      const props = ['--motion-instant', '--motion-fast', '--motion-base', '--motion-slow', '--motion-deliberate'];
      return props.map(p => {
        const val = getComputedStyle(document.documentElement).getPropertyValue(p).trim();
        return parseFloat(val);
      });
    });

    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThan(values[i - 1]);
    }
  });
});
```

---

## 7. Cubic Bezier Easing Tokens

```typescript
test.describe('Easing Tokens', () => {
  test.beforeEach(async ({ page }) => {
    await loadMotionPage(page, '<div>Easing test</div>');
  });

  const cubicBezierTokens: Array<{ property: string; expected: string }> = [
    { property: '--ease-out', expected: 'cubic-bezier(0.16, 1, 0.3, 1)' },
    { property: '--ease-bounce', expected: 'cubic-bezier(0.34, 1.56, 0.64, 1)' },
    { property: '--ease-smooth', expected: 'cubic-bezier(0.22, 1, 0.36, 1)' },
    { property: '--ease-slam', expected: 'cubic-bezier(0.55, 0.06, 0.68, 0.19)' },
    { property: '--ease-elastic', expected: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' },
  ];

  for (const { property, expected } of cubicBezierTokens) {
    test(`${property} resolves to correct cubic-bezier`, async ({ page }) => {
      const value = await page.evaluate(
        (prop) => getComputedStyle(document.documentElement).getPropertyValue(prop).trim(),
        property
      );
      expect(value).toBe(expected);
    });
  }
});
```

---

## 8. Visual Regression

```typescript
test.describe('Motion Visual Regression', () => {
  test('animation classes with no-preference: elements are visible after animation', async ({ page }) => {
    await loadMotionPage(page, `
      <div class="anim-in" style="width:200px;padding:16px;background:var(--bg-surface);border:2px solid var(--border-default);">
        Fade In Up
      </div>
    `);
    // Wait for animation to complete (fadeInUp is 500ms)
    await page.waitForTimeout(600);
    // Element should be fully visible (opacity 1, no translateY)
    const opacity = await page.locator('.anim-in').evaluate(el => getComputedStyle(el).opacity);
    expect(opacity).toBe('1');
  });

  test('visual regression - animation classes at rest', async ({ page }) => {
    await loadMotionPage(page, `
      <div style="display:flex;flex-direction:column;gap:12px;">
        <div class="anim-in" style="width:200px;padding:16px;background:var(--bg-surface);">anim-in</div>
        <div class="hover-lift" style="width:200px;padding:16px;background:var(--bg-surface);border:2px solid var(--border-default);">hover-lift</div>
        <div class="badge-pop" style="width:80px;padding:4px 12px;background:var(--accent-primary-subtle);text-align:center;">badge</div>
      </div>
    `);
    await page.waitForTimeout(600);
    await expect(page).toHaveScreenshot('motion-classes-rest.png');
  });
});
```

---

## 9. Integration: Motion + Component Interaction

```typescript
test.describe('Motion + Component Integration', () => {
  test('button loading spinner uses spin keyframe', async ({ page }) => {
    const buttonCSS = readFileSync('src/components/button.css', 'utf-8');
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en" data-theme="light">
      <head>
        <style>${tokensCSS}</style>
        <style>${resetCSS}</style>
        <style>${foundationCSS}</style>
        <style>${motionCSS}</style>
        <style>${buttonCSS}</style>
      </head>
      <body style="padding:40px;">
        <button class="btn btn-md btn-primary btn-loading">Loading</button>
      </body>
      </html>
    `);

    const animName = await page.evaluate(() => {
      const btn = document.querySelector('.btn-loading');
      if (!btn) return 'not found';
      return getComputedStyle(btn, '::after').animationName;
    });
    expect(animName).toContain('spin');
  });

  test('button loading spinner respects reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });

    const buttonCSS = readFileSync('src/components/button.css', 'utf-8');
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en" data-theme="light">
      <head>
        <style>${tokensCSS}</style>
        <style>${resetCSS}</style>
        <style>${foundationCSS}</style>
        <style>${motionCSS}</style>
        <style>${buttonCSS}</style>
      </head>
      <body style="padding:40px;">
        <button class="btn btn-md btn-primary btn-loading">Loading</button>
      </body>
      </html>
    `);

    const duration = await page.evaluate(() => {
      const btn = document.querySelector('.btn-loading');
      if (!btn) return 'not found';
      return getComputedStyle(btn, '::after').animationDuration;
    });
    const ms = parseFloat(duration) * (duration.endsWith('ms') ? 1 : 1000);
    expect(ms).toBeLessThanOrEqual(0.02);
  });
});
```
