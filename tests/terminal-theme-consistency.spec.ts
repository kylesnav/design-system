import { readFileSync } from 'fs';
import path from 'path';
import { test, expect } from '@playwright/test';

type TerminalTheme = {
  background: string;
  foreground: string;
  cursor: string;
  selectionBg: string;
  selectionFg: string;
  palette: string[];
};

const rootDir = path.resolve(__dirname, '..');
const ghosttyFiles = {
  light: path.resolve(rootDir, 'ghostty', 'themes', 'delightful-light'),
  dark: path.resolve(rootDir, 'ghostty', 'themes', 'delightful-dark'),
};
const iterm2GeneratorFile = path.resolve(rootDir, 'iterm2', 'scripts', 'generate-profiles.mjs');

function parseGhosttyTheme(filePath: string): TerminalTheme {
  const lines = readFileSync(filePath, 'utf8').split('\n');
  const palette = new Array<string>(16);
  const theme: Partial<TerminalTheme> = {};

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separator = trimmed.indexOf('=');
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    if (!key || !value) continue;

    if (key === 'background') theme.background = value;
    if (key === 'foreground') theme.foreground = value;
    if (key === 'cursor-color') theme.cursor = value;
    if (key === 'selection-background') theme.selectionBg = value;
    if (key === 'selection-foreground') theme.selectionFg = value;

    if (key === 'palette') {
      const [index, hex] = value.split('=');
      palette[Number(index)] = hex;
    }
  }

  return {
    background: requireHex(theme.background, `${filePath} background`),
    foreground: requireHex(theme.foreground, `${filePath} foreground`),
    cursor: requireHex(theme.cursor, `${filePath} cursor-color`),
    selectionBg: requireHex(theme.selectionBg, `${filePath} selection-background`),
    selectionFg: requireHex(theme.selectionFg, `${filePath} selection-foreground`),
    palette: palette.map((hex, index) => requireHex(hex, `${filePath} palette ${index}`)),
  };
}

function parseIterm2GeneratorTheme(name: 'light' | 'dark'): TerminalTheme {
  const source = readFileSync(iterm2GeneratorFile, 'utf8');
  const blockMatch = source.match(new RegExp(`const ${name} = \\{([\\s\\S]*?)\\n\\};`));
  if (!blockMatch) {
    throw new Error(`Could not find ${name} theme in ${iterm2GeneratorFile}`);
  }

  const block = blockMatch[1];
  const ansiMatch = block.match(/ansi:\s+\[([\s\S]*?)\n\s+\],/);
  if (!ansiMatch) {
    throw new Error(`Could not parse ansi array for ${name} theme`);
  }

  const palette = Array.from(ansiMatch[1].matchAll(/"(#[0-9a-f]{6})"/g), (match) => match[1]);

  return {
    background: extractHex(block, 'background'),
    foreground: extractHex(block, 'foreground'),
    cursor: extractHex(block, 'cursor'),
    selectionBg: extractHex(block, 'selectionBg'),
    selectionFg: extractHex(block, 'selectionFg'),
    palette,
  };
}

function extractHex(block: string, key: string): string {
  const match = block.match(new RegExp(`${key}:\\s+"(#[0-9a-f]{6})"`));
  if (!match) {
    throw new Error(`Could not parse ${key}`);
  }
  return match[1];
}

function requireHex(value: string | undefined, label: string): string {
  if (!value || !/^#[0-9a-f]{6}$/.test(value)) {
    throw new Error(`Invalid hex for ${label}`);
  }
  return value;
}

function contrastRatio(foreground: string, background: string): number {
  const [fgLuminance, bgLuminance] = [foreground, background].map(relativeLuminance);
  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

function relativeLuminance(hex: string): number {
  const rgb = [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255);
  const linear = rgb.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
}

test('Ghostty and iTerm2 terminal palettes stay in sync', () => {
  const lightGhostty = parseGhosttyTheme(ghosttyFiles.light);
  const darkGhostty = parseGhosttyTheme(ghosttyFiles.dark);
  const lightIterm2 = parseIterm2GeneratorTheme('light');
  const darkIterm2 = parseIterm2GeneratorTheme('dark');

  expect(lightIterm2.palette).toHaveLength(16);
  expect(darkIterm2.palette).toHaveLength(16);
  expect(lightIterm2).toEqual(lightGhostty);
  expect(darkIterm2).toEqual(darkGhostty);
});

test('Light theme yellows keep at least 3:1 contrast against the background', () => {
  const lightTheme = parseGhosttyTheme(ghosttyFiles.light);

  expect(contrastRatio(lightTheme.palette[3], lightTheme.background)).toBeGreaterThanOrEqual(3);
  expect(contrastRatio(lightTheme.palette[11], lightTheme.background)).toBeGreaterThanOrEqual(3);
});

test('Dark theme blue and cyan remain distinct', () => {
  const darkTheme = parseGhosttyTheme(ghosttyFiles.dark);

  expect(darkTheme.palette[4]).not.toBe(darkTheme.palette[6]);
});
