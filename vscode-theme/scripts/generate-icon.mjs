import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(__dirname, 'icon.html');
const outputPath = path.join(__dirname, '..', 'icon.png');

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 256, height: 256 });
await page.goto(`file://${htmlPath}`);
await page.waitForTimeout(1000); // wait for font to load
await page.screenshot({ path: outputPath, omitBackground: true });
await browser.close();

console.log(`Icon saved to ${outputPath}`);
