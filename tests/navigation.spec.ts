import { test, expect } from '@playwright/test';
import path from 'path';

const designSystemPath = path.resolve(__dirname, '..', 'delightful-design-system.html');
const fileUrl = `file://${designSystemPath}`;

test.describe('Navigation and command palette', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(fileUrl);
    await page.waitForLoadState('networkidle');
  });

  test('quick navigation trigger uses a real button', async ({ page }) => {
    const trigger = page.locator('#cmd-k-trigger');

    await expect(trigger).toBeVisible();
    await expect(trigger).toHaveAttribute('type', 'button');

    const tagName = await trigger.evaluate((el) => el.tagName);
    expect(tagName).toBe('BUTTON');
  });

  test('command palette traps Tab and restores focus on Escape', async ({ page }) => {
    const trigger = page.locator('#cmd-k-trigger');
    const overlay = page.locator('#cmd-palette-overlay');
    const input = page.locator('#cmd-palette-input');

    await trigger.focus();
    await trigger.click();

    await expect(overlay).toHaveClass(/active/);
    await expect(overlay).toHaveAttribute('aria-hidden', 'false');
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(input).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(input).toBeFocused();

    await page.keyboard.press('Escape');
    await expect(overlay).not.toHaveClass(/active/);
    await expect(overlay).toHaveAttribute('aria-hidden', 'true');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await expect(trigger).toBeFocused();
  });

  test('hero keeps horizontal gutters on narrow viewports', async ({ page }) => {
    const hero = page.locator('.hero');

    for (const width of [700, 375]) {
      await page.setViewportSize({ width, height: 1000 });

      const padding = await hero.evaluate((el) => {
        const styles = getComputedStyle(el);
        return {
          left: parseFloat(styles.paddingLeft),
          right: parseFloat(styles.paddingRight),
        };
      });

      expect(padding.left).toBeGreaterThan(0);
      expect(padding.right).toBeGreaterThan(0);
    }
  });
});
