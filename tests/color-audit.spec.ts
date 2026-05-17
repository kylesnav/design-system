import { test } from '@playwright/test';
import path from 'path';

test('screenshot color audit - light mode', async ({ page }) => {
  const filePath = path.resolve(__dirname, '..', 'delightful-color.html');
  await page.goto(`file://${filePath}`);
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'light');
  });

  await page.screenshot({
    path: path.resolve(__dirname, '..', 'test-results', 'screenshots', 'color-audit-light.png'),
    fullPage: true,
  });
});

test('screenshot color audit - dark mode', async ({ page }) => {
  const filePath = path.resolve(__dirname, '..', 'delightful-color.html');
  await page.goto(`file://${filePath}`);
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  });
  await page.waitForTimeout(200);

  await page.screenshot({
    path: path.resolve(__dirname, '..', 'test-results', 'screenshots', 'color-audit-dark.png'),
    fullPage: true,
  });
});
