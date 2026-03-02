import { test, expect } from '@playwright/test';
import path from 'path';

const designSystemPath = path.resolve(__dirname, '..', 'delightful-design-system.html');
const fileUrl = `file://${designSystemPath}`;

test.describe('Press Interaction System', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(fileUrl);
    await page.waitForLoadState('networkidle');
    // Disable content-visibility: auto for test reliability — headless Chromium
    // doesn't resolve :hover styles on descendants inside content-visibility sections
    await page.addStyleTag({ content: '.ds-section { content-visibility: visible; }' });
  });

  test('base .btn shadow is shadow-sm (2px 2px)', async ({ page }) => {
    // Variant buttons override the shadow, so inject a bare .btn to test base styles
    const shadow = await page.evaluate(() => {
      const btn = document.createElement('button');
      btn.className = 'btn btn-md';
      btn.textContent = 'Test';
      document.body.appendChild(btn);
      const s = getComputedStyle(btn).boxShadow;
      btn.remove();
      return s;
    });
    expect(shadow).not.toBeNull();
    // shadow-sm = 2px 2px 0 <color>
    expect(shadow).toMatch(/2px 2px 0px/);
  });

  test('base .btn hover escalates shadow to shadow-md (4px 4px)', async ({ page }) => {
    // Inject a bare .btn, hover it, check shadow
    await page.evaluate(() => {
      const btn = document.createElement('button');
      btn.className = 'btn btn-md';
      btn.id = 'test-btn-hover';
      btn.textContent = 'Test';
      btn.style.position = 'fixed';
      btn.style.top = '50px';
      btn.style.left = '50px';
      btn.style.zIndex = '99999';
      document.body.appendChild(btn);
    });
    const btn = page.locator('#test-btn-hover');
    await btn.hover();
    await page.waitForTimeout(200);

    const shadow = await btn.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(shadow).toMatch(/4px 4px 0px/);
  });

  test('.btn-secondary inherits base btn shadow (shadow-sm → shadow-md)', async ({ page }) => {
    // .btn-secondary no longer overrides shadows — inherits from base .btn
    const baseShadow = await page.evaluate(() => {
      const btn = document.querySelector('.btn.btn-secondary');
      if (!btn) return null;
      return getComputedStyle(btn).boxShadow;
    });
    expect(baseShadow).toMatch(/2px 2px 0px/);

    const btn = page.locator('.btn.btn-secondary').first();
    await btn.scrollIntoViewIfNeeded();
    await btn.hover();
    await page.waitForTimeout(200);
    const hoverShadow = await btn.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(hoverShadow).toMatch(/4px 4px 0px/);
  });

  test('button active state: CSS defines translate(2px, 2px) and shadow 0', async ({ page }) => {
    // :active pseudo-class requires real pointer interaction.
    // Verify via page.mouse.down while hovering.
    await page.evaluate(() => {
      const btn = document.createElement('button');
      btn.className = 'btn btn-md';
      btn.id = 'test-btn-active';
      btn.textContent = 'Test';
      btn.style.position = 'fixed';
      btn.style.top = '100px';
      btn.style.left = '100px';
      btn.style.zIndex = '99999';
      document.body.appendChild(btn);
    });
    const btn = page.locator('#test-btn-active');
    const box = await btn.boundingBox();
    expect(box).not.toBeNull();

    // Move to center of button and press down (triggers :active)
    await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await page.mouse.down();
    await page.waitForTimeout(150);

    const styles = await btn.evaluate((el) => {
      const cs = getComputedStyle(el);
      return {
        transform: cs.transform,
        boxShadow: cs.boxShadow,
      };
    });

    // translate(2px, 2px) serializes as matrix(1, 0, 0, 1, 2, 2)
    expect(styles.transform).toMatch(/matrix\(1,\s*0,\s*0,\s*1,\s*2,\s*2\)/);
    // Shadow should be 0 0 0 <color>
    expect(styles.boxShadow).toMatch(/0px 0px 0px/);

    await page.mouse.up();
  });

  test('card-interactive base shadow is shadow-md (4px 4px)', async ({ page }) => {
    const shadow = await page.evaluate(() => {
      const card = document.querySelector('.card-interactive');
      if (!card) return null;
      return getComputedStyle(card).boxShadow;
    });
    expect(shadow).not.toBeNull();
    expect(shadow).toMatch(/4px 4px 0px/);
  });

  test('card-interactive hover escalates shadow to shadow-lg (8px 8px)', async ({ page }) => {
    const card = page.locator('.card-interactive').first();
    await card.scrollIntoViewIfNeeded();
    await card.hover();
    await page.waitForTimeout(200);

    const shadow = await card.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(shadow).toMatch(/8px 8px 0px/);
  });

  test('tile base shadow is shadow-md (4px 4px)', async ({ page }) => {
    const shadow = await page.evaluate(() => {
      const tile = document.querySelector('.tile');
      if (!tile) return null;
      return getComputedStyle(tile).boxShadow;
    });
    expect(shadow).not.toBeNull();
    expect(shadow).toMatch(/4px 4px 0px/);
  });

  test('tile hover escalates shadow to shadow-lg (8px 8px)', async ({ page }) => {
    const tile = page.locator('.tile').first();
    await tile.scrollIntoViewIfNeeded();
    await tile.hover();
    await page.waitForTimeout(200);

    const shadow = await tile.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(shadow).toMatch(/8px 8px 0px/);
  });

  test('sidebar-item hover uses translateY only (no X)', async ({ page }) => {
    const item = page.locator('.sidebar-item').first();
    await item.scrollIntoViewIfNeeded();
    await item.hover();
    await page.waitForTimeout(200);

    const transform = await item.evaluate((el) => getComputedStyle(el).transform);
    // translateY(-1px) serializes as matrix(1, 0, 0, 1, 0, -1)
    // The X translation (5th value) should be 0
    expect(transform).toMatch(/matrix\(1,\s*0,\s*0,\s*1,\s*0,\s*-1\)/);
  });

  test('page-btn hover uses translateY only (no X)', async ({ page }) => {
    const btn = page.locator('.page-btn').first();
    await btn.scrollIntoViewIfNeeded();
    await btn.hover();
    await page.waitForTimeout(200);

    const transform = await btn.evaluate((el) => getComputedStyle(el).transform);
    // translateY(-1px) serializes as matrix(1, 0, 0, 1, 0, -1)
    expect(transform).toMatch(/matrix\(1,\s*0,\s*0,\s*1,\s*0,\s*-1\)/);
  });

  test('disabled button has no transform on hover', async ({ page }) => {
    const disabledBtn = page.locator('.btn[disabled]').first();
    await disabledBtn.scrollIntoViewIfNeeded();

    // pointer-events: none means hover won't apply, but let's verify the base state
    const transform = await disabledBtn.evaluate((el) => getComputedStyle(el).transform);
    expect(transform).toBe('none');

    // Also verify opacity indicates disabled state
    const opacity = await disabledBtn.evaluate((el) => getComputedStyle(el).opacity);
    expect(parseFloat(opacity)).toBeLessThan(1);
  });

  test('disabled button CSS rule enforces no transform', async ({ page }) => {
    // Verify the CSS rule itself prevents interaction
    const styles = await page.evaluate(() => {
      const btn = document.querySelector('.btn[disabled]');
      if (!btn) return null;
      const cs = getComputedStyle(btn);
      return {
        pointerEvents: cs.pointerEvents,
        cursor: cs.cursor,
        opacity: cs.opacity,
      };
    });
    expect(styles).not.toBeNull();
    expect(styles!.pointerEvents).toBe('none');
    expect(styles!.cursor).toBe('not-allowed');
    expect(parseFloat(styles!.opacity)).toBeLessThan(1);
  });
});
