---
title: "Table"
date: 2026-03-02
type: spec
scope: mvp
status: active
---

# Table

> Sortable data table with column sort arrows (ascending/descending toggle), selectable rows with checkboxes, row hover highlighting with lift effect, and responsive stacked layout at narrow viewports. Uses `sortTable()`, `toggleRow()`, and `toggleAllRows()` JavaScript functions.

Cross-references: [[checkbox]] (row selection uses `.check-group` and `.check-box` pattern), [[badge]] (status dots in table cells), [[token-tiers]] (spacing, typography, radius, motion, easing tokens).

Visual reference: Section "DATA TABLE" in `design-reference.html` (lines ~2190-2330 CSS, lines ~5712-5791 HTML, lines ~8194-8267 JS, lines ~989-1025 responsive CSS).

---

## 1. HTML Structure

### 1.1 Complete Sortable Table with Selectable Rows

```html
<div class="table-wrap">
  <table class="data-table" id="components-table">
    <thead>
      <tr>
        <th style="width:40px">
          <label class="check-group" onclick="toggleAllRows(this, 'components-table')">
            <input type="checkbox" class="sr-only" aria-label="Select all rows">
            <span class="check-box" aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
          </label>
        </th>
        <th class="sortable" onclick="sortTable('components-table', 1)">
          Component
          <svg class="sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </th>
        <th class="sortable" onclick="sortTable('components-table', 2)">
          Status
          <svg class="sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </th>
        <th class="sortable" onclick="sortTable('components-table', 3)">Variants<!-- sort icon --></th>
        <th class="sortable" onclick="sortTable('components-table', 4)">Last Updated<!-- sort icon --></th>
      </tr>
    </thead>
    <tbody>
      <tr onclick="toggleRow(this)" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();toggleRow(this)}" tabindex="0">
        <td>
          <label class="check-group">
            <input type="checkbox" class="sr-only" aria-label="Select Button row">
            <span class="check-box" aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </span>
          </label>
        </td>
        <td data-label="Component" style="font-weight:550">Button</td>
        <td data-label="Status" data-sort="1Stable">
          <span class="status-row">
            <span class="status-dot" style="background:var(--accent-green)"></span> Stable
          </span>
        </td>
        <td data-label="Variants">5</td>
        <td data-label="Updated" class="mono" data-sort="2026-02-22">Feb 22, 2026</td>
      </tr>
      <!-- additional rows -->
    </tbody>
  </table>
</div>
```

---

## 2. CSS Classes

### 2.1 `.table-wrap`

| Property | Value | Token |
|---|---|---|
| `border` | `2px solid var(--border-subtle)` | -- |
| `border-radius` | `var(--radius-lg)` | `24px` |
| `overflow` | `hidden` | -- |

### 2.2 `.data-table`

| Property | Value | Token |
|---|---|---|
| `width` | `100%` | -- |
| `border-collapse` | `collapse` | -- |
| `font-size` | `0.8125rem` | `--ui-text-sm` = `13px` |

### 2.3 `.data-table th`

| Property | Value | Token |
|---|---|---|
| `text-align` | `left` | -- |
| `padding` | `var(--space-3) var(--space-4)` | `12px 16px` |
| `font-weight` | `600` | -- |
| `font-size` | `0.6875rem` | `--ui-text-2xs` = `11px` |
| `letter-spacing` | `0.04em` | -- |
| `text-transform` | `uppercase` | -- |
| `color` | `var(--text-muted)` | -- |
| `background` | `var(--bg-subtle)` | -- |
| `border-bottom` | `2px solid var(--border-subtle)` | -- |
| `user-select` | `none` | -- |

### 2.4 `.data-table th.sortable`

| Property | Value |
|---|---|
| `cursor` | `pointer` |
| `transition` | `transform var(--motion-instant) linear, color var(--motion-fast) var(--ease-out), background var(--motion-fast) var(--ease-out)` |

| State | CSS Changes |
|---|---|
| Hover | `color: var(--text-primary); background: var(--border-subtle)` |
| Active | `transform: translateY(1px)` |

### 2.5 `.sort-icon`

| Property | Value | Token |
|---|---|---|
| `display` | `inline-block` | -- |
| `width` | `12px` | -- |
| `height` | `12px` | -- |
| `margin-left` | `var(--space-1)` | `4px` |
| `vertical-align` | `middle` | -- |
| `opacity` | `0.4` | -- |
| `transition` | `transform var(--motion-fast) var(--ease-bounce), opacity var(--motion-fast) var(--ease-out)` | -- |

### 2.6 Sort Direction Classes

| Class | Changes |
|---|---|
| `.sorted-asc .sort-icon` | `opacity: 1; transform: rotate(180deg); color: var(--text-primary)` |
| `.sorted-desc .sort-icon` | `opacity: 1; transform: rotate(0deg); color: var(--text-primary)` |

### 2.7 `.data-table td`

| Property | Value | Token |
|---|---|---|
| `padding` | `var(--space-3) var(--space-4)` | `12px 16px` |
| `border-bottom` | `1px solid var(--border-subtle)` | -- |
| `transition` | `background var(--motion-fast) var(--ease-out)` | -- |

Last row: `border-bottom: none`.

### 2.8 `.data-table tbody tr`

| Property | Value | Token |
|---|---|---|
| `transition` | `background var(--motion-fast) var(--ease-out), transform var(--motion-fast) var(--ease-bounce), box-shadow var(--motion-fast) var(--ease-out)` | -- |
| `will-change` | `transform, background` | -- |

### 2.9 Row States

| State | CSS Changes |
|---|---|
| Hover | `background: var(--bg-subtle); transform: scale(1.01) translateY(-1px); box-shadow: var(--shadow-sm); border-radius: var(--radius-sm)` + td border-bottom becomes transparent |
| Selected (`.selected`) | `background: var(--accent-primary-subtle)` + td border-bottom-color: `var(--accent-primary-subtle)` |

### 2.10 `.mono`

| Property | Value | Token |
|---|---|---|
| `font-family` | `var(--font-mono)` | -- |
| `font-size` | `0.75rem` | `12px` |

### 2.11 Table Header Color Variants

| Class | `th` background | `th` color | `th` border-bottom-color |
|---|---|---|---|
| `.table-header-pink` | `var(--accent-primary-subtle)` | `var(--accent-primary)` | `var(--accent-primary)` |
| `.table-header-gold` | `var(--accent-gold-subtle)` | `var(--accent-gold-text)` | `var(--accent-gold)` |
| `.table-header-cyan` | `var(--accent-cyan-subtle)` | `var(--accent-cyan)` | `var(--accent-cyan)` |
| `.table-header-purple` | `var(--accent-purple-subtle)` | `var(--accent-purple)` | `var(--accent-purple)` |

### 2.12 Status Helpers

| Class | Properties |
|---|---|
| `.status-dot` | `width: 7px; height: 7px; border-radius: 50%; display: inline-block` |
| `.status-row` | `display: inline-flex; align-items: center; gap: var(--space-1-5)` |

---

## 3. Responsive Behavior

### At `max-width: 600px`:

- `<thead>` hidden (`display: none`)
- `<tbody> tr` becomes `display: flex; flex-direction: column; padding: var(--space-3) var(--space-4); border-bottom: 2px solid var(--border-subtle); gap: var(--space-1)`
- Row hover: `transform: none; box-shadow: none`
- `<td>` becomes `display: flex; justify-content: space-between; padding: var(--space-1) 0; border-bottom: none`
- `<td>::before` shows `content: attr(data-label)` with `font-weight: 600; font-size: 0.6875rem; letter-spacing: 0.04em; text-transform: uppercase; color: var(--text-muted)`

---

## 4. JavaScript Behavior

### 4.1 `sortTable(tableId, colIndex)`

```js
window.sortTable = function (tableId, colIndex) {
  const table = document.getElementById(tableId);
  const tbody = table.querySelector('tbody');
  const ths = table.querySelectorAll('th.sortable');
  const th = table.querySelectorAll('th')[colIndex];

  let isAsc = th.classList.contains('sorted-asc');
  ths.forEach(t => { t.classList.remove('sorted-asc', 'sorted-desc'); });
  th.classList.add(isAsc ? 'sorted-desc' : 'sorted-asc');

  const rows = Array.from(tbody.querySelectorAll('tr'));
  rows.sort((a, b) => {
    const tdA = a.querySelectorAll('td')[colIndex];
    const tdB = b.querySelectorAll('td')[colIndex];
    const valA = tdA.getAttribute('data-sort') || tdA.textContent.trim();
    const valB = tdB.getAttribute('data-sort') || tdB.textContent.trim();
    const numA = parseFloat(valA);
    const numB = parseFloat(valB);
    if (!isNaN(numA) && !isNaN(numB)) {
      return isAsc ? numB - numA : numA - numB;
    }
    return isAsc ? valB.localeCompare(valA) : valA.localeCompare(valB);
  });
  rows.forEach(row => tbody.appendChild(row));
};
```

### 4.2 `toggleRow(rowElement)`

```js
window.toggleRow = function (rowElement) {
  const input = rowElement.querySelector('input[type="checkbox"]');
  const cb = rowElement.querySelector('.check-box');
  if (input) {
    input.checked = !input.checked;
    rowElement.classList.toggle('selected', input.checked);
  } else if (cb) {
    const isChecked = cb.classList.toggle('checked');
    rowElement.classList.toggle('selected', isChecked);
  }
};
```

### 4.3 `toggleAllRows(headerElement, tableId)`

```js
window.toggleAllRows = function (headerElement, tableId) {
  if (event) event.stopPropagation();
  const headerInput = headerElement.querySelector('input[type="checkbox"]');
  const headerCb = headerElement.querySelector('.check-box');
  let isChecked;
  if (headerInput) {
    headerInput.checked = !headerInput.checked;
    isChecked = headerInput.checked;
  } else if (headerCb) {
    isChecked = headerCb.classList.toggle('checked');
  }
  const table = document.getElementById(tableId);
  const rows = table.querySelectorAll('tbody tr');
  rows.forEach(row => {
    const rowInput = row.querySelector('input[type="checkbox"]');
    const rowCb = row.querySelector('.check-box');
    if (rowInput) rowInput.checked = isChecked;
    else if (rowCb) rowCb.classList.toggle('checked', isChecked);
    row.classList.toggle('selected', isChecked);
  });
};
```

---

## 5. Accessibility

- Sortable headers use `onclick` for sort -- implementing agents should add `role="columnheader"` and `aria-sort="ascending"` / `"descending"` / `"none"`
- Selectable rows use `tabindex="0"` and `onkeydown` for Enter/Space keyboard activation
- Select-all checkbox in header uses `aria-label="Select all rows"`
- Individual row checkboxes use `aria-label="Select [Row Name] row"`
- `data-label` attribute on `<td>` provides column headers for the responsive stacked view
- `data-sort` attribute provides sortable values for columns that display formatted text (dates, status)

---

## 6. Token Dependencies

### Tier 2 (Semantic)

- `--bg-subtle`
- `--text-primary`, `--text-muted`
- `--border-subtle`
- `--accent-primary-subtle`
- `--accent-primary`, `--accent-gold`, `--accent-gold-text`, `--accent-cyan`, `--accent-purple`, `--accent-purple-subtle`, `--accent-gold-subtle`, `--accent-cyan-subtle`
- `--shadow-sm`

### Tier 3 (Component)

- `--space-1` (`4px`), `--space-1-5` (`6px`), `--space-3` (`12px`), `--space-4` (`16px`)
- `--radius-sm` (`10px`), `--radius-lg` (`24px`)
- `--ui-text-2xs` (`11px`), `--ui-text-sm` (`13px`)
- `--font-mono`
- `--motion-instant` (`100ms`), `--motion-fast` (`160ms`)
- `--ease-out`, `--ease-bounce`

---

## 7. Test Specification

### 7.1 Computed Style Assertions

- `.table-wrap` has `border-radius: 24px`
- `.data-table` has `font-size` resolving to `13px`
- `.data-table th` has `text-transform: uppercase` and `font-size` resolving to `11px`
- `.data-table tbody tr.selected` has `background` matching `--accent-primary-subtle`
- `.sort-icon` has `opacity: 0.4` by default
- `.sorted-asc .sort-icon` has `opacity: 1` and `transform: rotate(180deg)`

### 7.2 Interaction Assertions

- Clicking a sortable header adds `sorted-asc` class (first click) or `sorted-desc` (second click)
- Rows are reordered in DOM after sort
- Clicking a row toggles `.selected` class and checkbox state
- Header checkbox toggles all row checkboxes
- Row hover shows `background: var(--bg-subtle)` and `box-shadow: var(--shadow-sm)`

### 7.3 Visual Regression Scenarios

- Table with no sort active (light mode)
- Table with no sort active (dark mode)
- Table with column sorted ascending
- Table with 2 rows selected
- Table at 500px viewport (stacked layout)
- Table with pink header variant

### 7.4 Reduced Motion Compliance

- With `prefers-reduced-motion: reduce`, all transitions complete in 0.01ms

## Implementation CSS

```css
@layer component {
  .table-wrap {
    width: 100%;
    overflow-x: auto;
    border: 2px solid var(--border-default);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
  }
  .data-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
  }
  .data-table th {
    padding: var(--space-3) var(--space-4);
    text-align: left;
    font-weight: 700;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
    background: var(--bg-subtle);
    border-bottom: 2px solid var(--border-default);
    white-space: nowrap;
  }
  .data-table th.sortable { cursor: pointer; user-select: none; }
  .data-table th.sortable:hover { color: var(--text-primary); }
  .sort-icon { opacity: 0.3; margin-left: var(--space-1); }
  .data-table th.sorted-asc .sort-icon,
  .data-table th.sorted-desc .sort-icon { opacity: 1; }

  .data-table td {
    padding: var(--space-3) var(--space-4);
    border-bottom: 1px solid var(--border-subtle);
    color: var(--text-primary);
  }
  .data-table tbody tr { transition: background var(--motion-fast) var(--ease-out); }
  .data-table tbody tr:hover { background: var(--bg-subtle); }
  .data-table tbody tr.selected { background: var(--accent-primary-subtle); }
  .mono { font-family: var(--font-mono); font-size: 0.8125rem; }
}
```
