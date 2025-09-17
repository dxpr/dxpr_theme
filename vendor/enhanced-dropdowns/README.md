# Bootstrap 5 Enhanced Dropdowns

[![npm downloads](https://img.shields.io/npm/dm/bs-enhanced-dropdowns.svg)](https://www.npmjs.com/package/bs-enhanced-dropdowns)

**[Live Demo of Bootstrap 5 Enhanced Dropdowns](https://dxpr.github.io/bs-dropdown-extended/)**

A powerful enhancement for Bootstrap 5 navigation menus, featuring split dropdown buttons, multi-level submenus, improved keyboard accessibility, and intelligent handling of link behavior based on the `href` attribute.

## Core Features

-   **Split Dropdown Buttons**: Main link area navigates, separate caret button toggles the dropdown.
-   **Full Toggle Dropdown Links**: Traditional dropdown links where the entire item toggles the menu.
-   **Intelligent `href` Handling**: 
    -   For **split buttons**, the link part always navigates if `href` is a valid URL.
    -   For **full toggle links** (e.g., `.dropdown-item.dropdown-toggle`), if `href` is `"#"` or empty, it acts as a dropdown toggle. If `href` is a valid URL, it will navigate *and* attempt to toggle (though typically these are used only for toggling).
    -   The JavaScript primarily uses the presence and value of `href` on anchor tags to distinguish between navigational links and toggle-only actions, especially for full `dropdown-toggle` items.
-   **Multi-level Submenus**: Supports nested dropdowns (currently styled for up to 3 levels effectively).
-   **Automatic Multi-Column Layout (Desktop)**: Top-level dropdowns automatically arrange items into 1 to 5 columns on larger screens (>=992px) based on item count. Dropdowns with 3 or more columns expand to the full width of the navbar.
-   **Enhanced Keyboard Navigation**: Intuitive navigation using Arrow keys, Enter, Space, Escape, and Tab.
-   **ARIA Accessibility**: Implements ARIA roles and attributes for screen readers and assistive technologies.
-   **Focus Management**: Ensures logical focus flow when opening, closing, and navigating menus.
-   **Mobile-Friendly**: Responsive design adapts to smaller viewports.
-   **Customizable**: Uses CSS variables for key metrics like indentation and caret size.

## Setup & Usage

1.  **Include Bootstrap 5**: Ensure you have Bootstrap 5 CSS and JS included in your HTML.
    ```html
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    ```

2.  **Include Enhanced Dropdown Assets**: Link the provided CSS and JS files in your HTML.
    ```html
    <link href="css/enhanced-dropdowns.css" rel="stylesheet">
    <script src="js/enhanced-dropdowns.js"></script>
    ```

3.  **Initialize JavaScript**: After the DOM is loaded, create a new instance of `BootstrapEnhancedDropdowns`.
    ```html
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        new BootstrapEnhancedDropdowns({
          debug: false // Set to true for console logs during development
        });
      });
    </script>
    ```

## HTML Structure Examples

Wrap your navigation in a `<ul class="navbar-nav" role="menubar">`.

**Key Custom Classes (applied by script or for structure):**

-   `.bs-dropdown-wrapper`: Wrapper for top-level split buttons (contains a `.nav-link` and a `.bs-dropdown-caret`).
-   `.bs-dropdown-item-wrapper`: Wrapper for nested split buttons within a dropdown menu (contains a `.dropdown-item` and a `.bs-dropdown-caret`).
-   `.bs-dropdown-caret`: The clickable caret button in a split button setup.
-   `.bs-dropdown-submenu`: Applied to an `<li>` that contains a nested dropdown menu.
-   `.dropdown-menu-columns-X` (e.g., `dropdown-menu-columns-2`): Applied by the script to `.dropdown-menu` on desktop for multi-column layout (X can be 2-5).
-   `.dropdown-full-width`: Applied by the script to the parent `li.nav-item.dropdown` on desktop when its menu has 3+ columns, making the menu span the navbar width.

**1. Simple Nav Link**

```html
<li class="nav-item" role="none">
    <a class="nav-link" href="#home" role="menuitem">Home</a>
</li>
```

**2. Top-Level Split Dropdown**

```html
<li class="nav-item dropdown" role="none">
    <div class="bs-dropdown-wrapper">
        <a class="nav-link" href="#features" id="featuresLink" role="menuitem">Features</a>
        <button class="bs-dropdown-caret" type="button" aria-expanded="false" aria-controls="featuresMenu" aria-labelledby="featuresLink">
            <span class="visually-hidden">Toggle Features submenu</span>
        </button>
    </div>
    <ul class="dropdown-menu" id="featuresMenu" aria-labelledby="featuresLink">
        <li><a class="dropdown-item" href="#features-overview" role="menuitem">Features Overview</a></li>
        <!-- More items or submenus -->
    </ul>
</li>
```

**3. Top-Level Full Toggle Dropdown (Standard Bootstrap)**
   - The script enhances these with better keyboard navigation if they are part of submenus handled by the script.
   - `data-bs-toggle="dropdown"` is standard Bootstrap for these.
   - If `href="#"`, it acts purely as a toggle. If `href` has a URL, Bootstrap's default behavior applies (navigates).

```html
<li class="nav-item dropdown" role="none">
    <a class="nav-link dropdown-toggle" href="#" id="aboutLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        About
    </a>
    <ul class="dropdown-menu" aria-labelledby="aboutLink">
        <li><a class="dropdown-item" href="#about-overview" role="menuitem">About Overview</a></li>
    </ul>
</li>
```

**4. Nested Split Submenu Item**

```html
<li class="bs-dropdown-submenu" role="none">
    <div class="bs-dropdown-item-wrapper">
        <a class="dropdown-item" href="#performance" id="performanceLink" role="menuitem">Performance</a>
        <button class="bs-dropdown-caret" type="button" aria-expanded="false" aria-controls="performanceMenu" aria-labelledby="performanceLink">
            <span class="visually-hidden">Toggle Performance submenu</span>
        </button>
    </div>
    <ul class="dropdown-menu" id="performanceMenu" aria-labelledby="performanceLink">
        <li><a class="dropdown-item" href="#speed" role="menuitem">Speed Analysis</a></li>
    </ul>
</li>
```

**5. Nested Full Toggle Submenu Item**
   - `href="#"` makes this a toggle. If it had a different URL, the script would still treat it primarily as a toggle due to `.dropdown-toggle`.

```html
<li class="bs-dropdown-submenu" role="none">
    <a class="dropdown-item dropdown-toggle" href="#" id="securityLink" role="button" aria-expanded="false" aria-controls="securityMenu">
        Security
    </a>
    <ul class="dropdown-menu" id="securityMenu" aria-labelledby="securityLink">
        <li><a class="dropdown-item" href="#firewall" role="menuitem">Firewall Options</a></li>
    </ul>
</li>
```

## Accessibility (A11y) & User Experience (UX)

-   **ARIA Roles**: Uses `role="menubar"`, `role="none"` (on `<li>`), `role="menuitem"`, and `role="button"` appropriately.
-   **ARIA States/Properties**: Manages `aria-expanded`, `aria-controls`, and `aria-labelledby` to provide context to assistive technologies.
-   **Keyboard Navigation**:
    -   `Tab` / `Shift+Tab`: Moves between top-level navigation items and into/out of open menus according to standard tab flow.
    -   `ArrowDown` / `ArrowUp`: Navigates between items within an open dropdown menu.
    -   `Enter` / `Space`: Activates a menu item (navigates or opens/closes a submenu).
    -   `Escape`: Closes the current open dropdown menu and returns focus to its toggle button.
    -   `ArrowLeft` (within a submenu): Closes the current submenu and returns focus to its parent toggle. For split buttons, this only works if focus is on the first item.
-   **Focus Management**: When a dropdown is opened, focus is moved to the first interactive item. When closed, focus returns to the toggle button.
-   **Clear Visual Cues**: Caret icons indicate dropdown functionality. Hover and focus states are distinct.
-   **Separation of Concerns (Split Buttons)**: Users can click the text part to navigate directly or the caret to explore submenu options, providing a clear and predictable UX.

## Customization

-   **CSS Variables**: Modify the following variables in `css/enhanced-dropdowns.css` or override them in your own CSS for basic structural changes:
    -   `--bs-dropdown-caret-width`: Width of the caret button in split layouts.
    -   `--bs-dropdown-caret-padding-x`: Horizontal padding within the caret button.
    -   `--bs-dropdown-indent-step`: Indentation amount for each submenu level.
-   **Auto-Column Behavior (Desktop)**: The script automatically applies multi-column layouts to top-level dropdowns based on the number of `<li>` items:
    -   1-7 items: 1 column (standard Bootstrap behavior, no extra classes)
    -   8-14 items: 2 columns (`.dropdown-menu-columns-2`)
    -   15-20 items: 3 columns (`.dropdown-menu-columns-3`, becomes full-width)
    -   21-27 items: 4 columns (`.dropdown-menu-columns-4`, becomes full-width)
    -   28+ items: 5 columns (`.dropdown-menu-columns-5`, becomes full-width)
    This behavior is active on viewports 992px and wider. The full-width effect relies on the parent `li.nav-item.dropdown` getting the `.dropdown-full-width` class, which sets its position to static.
-   **Border Radius**: As an example of Bootstrap customization, you can set global border-radius to 0 in your page-specific CSS if desired:
    ```css
    /* In your page-specific <style> tag or CSS file */
    :root {
        --bs-border-radius: 0;
        --bs-border-radius-sm: 0;
        /* ... and other radius variables ... */
        --bs-border-radius-pill: 0;
    }
    ```

Refer to `index.html` and `demo.html` for complete examples of implementation. 