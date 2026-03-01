import { test, expect, Page } from '@playwright/test';
import path from 'path';

const files = {
  designSystem: path.resolve(__dirname, '..', 'delightful-design-system.html'),
  motion: path.resolve(__dirname, '..', 'delightful-motion.html'),
  animation: path.resolve(__dirname, '..', 'delightful-animation.html'),
};

/** Read a CSS custom property value from :root */
async function getToken(page: Page, token: string): Promise<string> {
  return page.evaluate((t) => {
    return getComputedStyle(document.documentElement).getPropertyValue(t).trim();
  }, token);
}

/** Read multiple tokens from a page */
async function getTokens(page: Page, tokens: string[]): Promise<Record<string, string>> {
  return page.evaluate((tks) => {
    const cs = getComputedStyle(document.documentElement);
    const result: Record<string, string> = {};
    for (const t of tks) {
      result[t] = cs.getPropertyValue(t).trim();
    }
    return result;
  }, tokens);
}

const springTokens = [
  '--ease-spring-gentle',
  '--ease-spring-bouncy',
];

const motionTokens = [
  '--motion-instant',
  '--motion-fast',
  '--motion-base',
  '--motion-slow',
];

const colorPrimitives = [
  '--primitive-pink-300',
  '--primitive-pink-400',
  '--primitive-cyan-300',
  '--primitive-cyan-400',
  '--primitive-gold-300',
  '--primitive-green-300',
  '--primitive-purple-300',
];

const shadowTokens = [
  '--shadow-sm',
  '--shadow-md',
  '--shadow-lg',
];

test.describe('Cross-file token consistency', () => {

  test('spring easing tokens match across all 3 files', async ({ page }) => {
    // Get tokens from design system (source of truth)
    await page.goto(`file://${files.designSystem}`);
    await page.waitForLoadState('networkidle');
    const dsTokens = await getTokens(page, springTokens);

    // Get tokens from motion file
    await page.goto(`file://${files.motion}`);
    await page.waitForLoadState('networkidle');
    const motionTks = await getTokens(page, springTokens);

    // Get tokens from animation file
    await page.goto(`file://${files.animation}`);
    await page.waitForLoadState('networkidle');
    const animTks = await getTokens(page, springTokens);

    for (const token of springTokens) {
      expect(dsTokens[token], `${token} should exist in design system`).toBeTruthy();
      expect(motionTks[token], `${token} mismatch: motion vs design-system`).toBe(dsTokens[token]);
      expect(animTks[token], `${token} mismatch: animation vs design-system`).toBe(dsTokens[token]);
    }
  });

  test('motion timing tokens match across all 3 files', async ({ page }) => {
    await page.goto(`file://${files.designSystem}`);
    await page.waitForLoadState('networkidle');
    const dsTokens = await getTokens(page, motionTokens);

    await page.goto(`file://${files.motion}`);
    await page.waitForLoadState('networkidle');
    const motionTks = await getTokens(page, motionTokens);

    await page.goto(`file://${files.animation}`);
    await page.waitForLoadState('networkidle');
    const animTks = await getTokens(page, motionTokens);

    for (const token of motionTokens) {
      // Some files may not define --motion-normal; skip if empty in source
      if (!dsTokens[token]) continue;
      expect(motionTks[token], `${token} mismatch: motion vs design-system`).toBe(dsTokens[token]);
      expect(animTks[token], `${token} mismatch: animation vs design-system`).toBe(dsTokens[token]);
    }
  });

  test('color primitive tokens match across all 3 files', async ({ page }) => {
    await page.goto(`file://${files.designSystem}`);
    await page.waitForLoadState('networkidle');
    const dsTokens = await getTokens(page, colorPrimitives);

    await page.goto(`file://${files.motion}`);
    await page.waitForLoadState('networkidle');
    const motionTks = await getTokens(page, colorPrimitives);

    await page.goto(`file://${files.animation}`);
    await page.waitForLoadState('networkidle');
    const animTks = await getTokens(page, colorPrimitives);

    for (const token of colorPrimitives) {
      if (!dsTokens[token]) continue;
      expect(motionTks[token], `${token} mismatch: motion vs design-system`).toBe(dsTokens[token]);
      expect(animTks[token], `${token} mismatch: animation vs design-system`).toBe(dsTokens[token]);
    }
  });

  test('shadow tokens match across all 3 files', async ({ page }) => {
    // Shadow tokens use var() references so we compare the computed values
    await page.goto(`file://${files.designSystem}`);
    await page.waitForLoadState('networkidle');
    const dsTokens = await getTokens(page, shadowTokens);

    await page.goto(`file://${files.motion}`);
    await page.waitForLoadState('networkidle');
    const motionTks = await getTokens(page, shadowTokens);

    await page.goto(`file://${files.animation}`);
    await page.waitForLoadState('networkidle');
    const animTks = await getTokens(page, shadowTokens);

    for (const token of shadowTokens) {
      if (!dsTokens[token]) continue;
      expect(motionTks[token], `${token} mismatch: motion vs design-system`).toBe(dsTokens[token]);
      expect(animTks[token], `${token} mismatch: animation vs design-system`).toBe(dsTokens[token]);
    }
  });
});
