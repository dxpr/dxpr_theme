# Bootstrap 5 Enhanced Dropdowns

[![npm downloads](https://img.shields.io/npm/dm/bs-enhanced-dropdowns.svg)](https://www.npmjs.com/package/bs-enhanced-dropdowns)

**[Live Demo](https://dxpr.github.io/bs-dropdown-extended/)** · Split dropdown buttons, multi-level submenus, and improved keyboard accessibility for Bootstrap 5.

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [HTML Patterns](#html-patterns)
- [Accessibility](#accessibility)
- [Customization](#customization)

---

## Features

| Feature | Description |
|---------|-------------|
| Split Dropdown Buttons | Link navigates, caret toggles dropdown |
| Multi-level Submenus | Up to 3 levels deep |
| Auto Multi-Column | 1-5 columns based on item count (desktop) |
| Smart Hover | Hover-to-open on desktop, click always works* |
| Keyboard Navigation | Arrow keys, Enter, Space, Escape, Tab |
| ARIA Accessibility | Full screen reader support |
| Mobile-Friendly | Responsive for all viewports |
| RTL Support | Full right-to-left language support |

*If any dropdown in a navbar has nested submenus, all dropdowns in that navbar become click-only to avoid frustrating hover tunnel navigation.

---

## Quick Start

**1. Include Bootstrap 5:**
```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
```

**2. Include Enhanced Dropdowns:**
```html
<link href="css/enhanced-dropdowns.css" rel="stylesheet">
<script src="js/enhanced-dropdowns.js"></script>
```

**3. Initialize:**
```html
<script>
  document.addEventListener('DOMContentLoaded', () => {
    new BootstrapEnhancedDropdowns();
  });
</script>
```

---

## HTML Patterns

Wrap navigation in `<ul class="navbar-nav" role="menubar">`.

### Split Dropdown (Top-Level)

```html
<li class="nav-item dropdown" role="none">
  <div class="bs-dropdown-wrapper">
    <a class="nav-link" href="/features" role="menuitem">Features</a>
    <button class="bs-dropdown-caret" type="button" aria-expanded="false">
      <span class="visually-hidden">Toggle submenu</span>
    </button>
  </div>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="/overview" role="menuitem">Overview</a></li>
  </ul>
</li>
```

### Standard Bootstrap Dropdown

```html
<li class="nav-item dropdown" role="none">
  <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" aria-expanded="false">
    About
  </a>
  <ul class="dropdown-menu">
    <li><a class="dropdown-item" href="/team" role="menuitem">Team</a></li>
  </ul>
</li>
```

### CSS Classes Reference

| Class | Purpose |
|-------|---------|
| `.bs-dropdown-wrapper` | Wrapper for top-level split buttons |
| `.bs-dropdown-item-wrapper` | Wrapper for nested split buttons |
| `.bs-dropdown-caret` | Clickable caret button |
| `.bs-dropdown-submenu` | Container for nested dropdown |

See `index.html` and `demo.html` for complete examples.

---

## Accessibility

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` | Move between top-level items |
| `↓` / `↑` | Navigate within dropdown |
| `Enter` / `Space` | Activate item |
| `Escape` | Close dropdown |
| `←` | Close submenu, return to parent |

### WCAG Compliance

| Criterion | Level | Description |
|-----------|-------|-------------|
| 2.1.1 Keyboard | A | Full navigation via arrows, Enter, Space, Escape, Tab |
| 2.1.2 No Keyboard Trap | A | Tab and Escape always allow exiting menus |
| 2.4.7 Focus Visible | AA | Clear focus indicators on all interactive elements |
| 1.4.13 Content on Hover or Focus | AA | Hover menus persist, dismissible via Escape |
| 4.1.2 Name, Role, Value | A | ARIA roles and states (`aria-expanded`, `aria-controls`) |
| 2.5.5 Target Size | AAA | Caret toggles meet 44×44px minimum |

---

## Customization

### CSS Variables

| Variable | Purpose |
|----------|---------|
| `--bs-dropdown-caret-width` | Caret button width |
| `--bs-dropdown-caret-padding-x` | Caret horizontal padding |
| `--bs-dropdown-indent-step` | Submenu indentation |

### Auto-Column Layout

Desktop (≥992px) applies columns automatically:

| Items | Columns | Full Width |
|-------|---------|------------|
| 1-7 | 1 | No |
| 8-14 | 2 | No |
| 15-20 | 3 | Yes |
| 21-27 | 4 | Yes |
| 28+ | 5 | Yes |
