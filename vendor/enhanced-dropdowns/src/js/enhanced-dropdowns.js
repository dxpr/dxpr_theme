/**
 * Bootstrap 5 Enhanced Dropdowns
 * Adds support for split dropdown buttons and better keyboard navigation
 * Version 1.0.0
 */

class BootstrapEnhancedDropdowns {
  constructor(options = {}) {
    this.options = {
      splitButtonSelector: '.bs-dropdown-wrapper',
      caretSelector: '.bs-dropdown-caret',
      submenuSelector: '.bs-dropdown-submenu',
      fullToggleSelector: '.dropdown-toggle',
      debug: false,
      ...options
    };
        
    this.init();
  }
    
  init() {
    // Initialize after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupDropdowns());
    } else {
      this.setupDropdowns();
    }
  }
    
  setupDropdowns() {
    this.initSplitButtonDropdowns();
    this.initSubmenuDropdowns();
    this.initAutoColumns();
  }
    
  _createDropdownInstance(toggleElement, menuElement, isSubmenu = false) {
    // Only add Bootstrap attributes for top-level dropdowns
    // Submenus need manual handling since Bootstrap doesn't support nested dropdowns
    if (!isSubmenu && !toggleElement.hasAttribute('data-bs-toggle')) {
      toggleElement.setAttribute('data-bs-toggle', 'dropdown');
    }

    const dropdownInstance = new bootstrap.Dropdown(toggleElement);
    dropdownInstance._menu = menuElement; // Manually set menu reference
    return dropdownInstance;
  }

  _attachKeyboardHandler(toggleElement, dropdownInstance) {
    // Shared keyboard handler for Enter/Space keys
    toggleElement.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.stopPropagation();
        dropdownInstance.toggle();
      }
    });
  }

  _attachClickHandler(toggleElement, dropdownInstance) {
    // Manual click handler for submenu toggles
    toggleElement.addEventListener('click', (event) => {
      event.stopPropagation();
      // For submenu links that are also toggles (href="#"), prevent navigation
      if (toggleElement.tagName === 'A' &&
          (toggleElement.getAttribute('href') === '#' || toggleElement.getAttribute('href') === '')) {
        event.preventDefault();
      }
      dropdownInstance.toggle();
    });
  }

  _attachToggleHandlers(toggleElement, dropdownInstance, isSubmenu = false) {
    // Always add keyboard support
    this._attachKeyboardHandler(toggleElement, dropdownInstance);

    // Add click handler only for submenus (top-level uses Bootstrap's native handling)
    if (isSubmenu) {
      this._attachClickHandler(toggleElement, dropdownInstance);
    }
  }

  _attachAriaSyncHandlers(eventSourceElement, targetAttributeElement, submenuParent = null, focusTargetMenu = null) {
    eventSourceElement.addEventListener('show.bs.dropdown', () => {
      targetAttributeElement.setAttribute('aria-expanded', 'true');
      if (submenuParent) {
        submenuParent.classList.add('show');
      }
    });
    
    if (focusTargetMenu) { // Only for submenus that need focus on first item
      eventSourceElement.addEventListener('shown.bs.dropdown', () => {
        const firstItem = focusTargetMenu.querySelector('.dropdown-item:not(.disabled)');
        if (firstItem) {
          firstItem.focus();
        }
      });
    }
            
    eventSourceElement.addEventListener('hide.bs.dropdown', () => {
      targetAttributeElement.setAttribute('aria-expanded', 'false');
      if (submenuParent) {
        submenuParent.classList.remove('show');
      }
    });
  }

  _findAssociatedMenuForSplitButton(toggleElement, parentWrapperElement) {
    let menuId = toggleElement.getAttribute('data-bs-target') || toggleElement.getAttribute('aria-controls');
    let menu = null;
    if (menuId) {
      menu = document.getElementById(menuId.startsWith('#') ? menuId.substring(1) : menuId);
    }
    // Fallback for structure where menu is next sibling of the wrapper (splitButton)
    if (!menu && parentWrapperElement) { 
      menu = parentWrapperElement.nextElementSibling;
      if (menu && !menu.classList.contains('dropdown-menu')) {
        menu = null; // Ensure it's actually a dropdown menu
      }
    }
    return menu;
  }

  _setupDropdownCommon(toggleElement, menuElement, isSubmenu, ariaTarget, submenuParent = null) {
    // Common dropdown setup logic
    const dropdownInstance = this._createDropdownInstance(toggleElement, menuElement, isSubmenu);
    this._attachToggleHandlers(toggleElement, dropdownInstance, isSubmenu);
    this._attachAriaSyncHandlers(toggleElement, ariaTarget, submenuParent, isSubmenu ? menuElement : null);
    this.setupMenuKeyboardNavigation(menuElement, toggleElement, submenuParent !== null);
    return dropdownInstance;
  }

  initSplitButtonDropdowns() {
    const splitButtons = document.querySelectorAll(this.options.splitButtonSelector);

    splitButtons.forEach((splitButton) => {
      const caretButton = splitButton.querySelector(this.options.caretSelector);
      const linkElement = splitButton.querySelector(`.nav-link:not(${this.options.fullToggleSelector})`);

      if (!caretButton || !linkElement) return;

      const menu = this._findAssociatedMenuForSplitButton(caretButton, splitButton);
      if (!menu) return;

      this._setupDropdownCommon(caretButton, menu, false, caretButton);
    });
  }
    
  _setupSubmenuAria(toggleElement, menuElement, linkElement, isSplitButton) {
    // Setup ARIA attributes for submenu
    const labelledById = (isSplitButton && linkElement) ? (linkElement.id || '') : (toggleElement.id || '');
    if (!menuElement.id && labelledById) menuElement.id = `${labelledById}-menu`;
    if (labelledById) menuElement.setAttribute('aria-labelledby', labelledById);
    if (menuElement.id && !toggleElement.hasAttribute('aria-controls')) {
      toggleElement.setAttribute('aria-controls', menuElement.id);
    }
  }

  initSubmenuDropdowns() {
    const submenuDropdowns = document.querySelectorAll(this.options.submenuSelector);

    submenuDropdowns.forEach((submenu) => {
      const itemWrapper = submenu.querySelector('.bs-dropdown-item-wrapper');
      let toggleElement, linkElement, isSplitButton = false;

      if (itemWrapper) {
        linkElement = itemWrapper.querySelector(`.dropdown-item:not(${this.options.fullToggleSelector})`);
        toggleElement = itemWrapper.querySelector(this.options.caretSelector);
        isSplitButton = true;
      } else {
        toggleElement = submenu.querySelector(this.options.fullToggleSelector);
      }

      if (!toggleElement) return;

      const menuElement = submenu.querySelector('.dropdown-menu');
      if (!menuElement) return;

      this._setupSubmenuAria(toggleElement, menuElement, linkElement, isSplitButton);
      this._setupDropdownCommon(toggleElement, menuElement, true, toggleElement, submenu);
    });
  }
    
  _closeDropdown(toggleElement) {
    // Helper to reliably close a Bootstrap dropdown instance
    if (!toggleElement) return;
    const instance = bootstrap.Dropdown.getInstance(toggleElement);
    if (instance) {
      instance.hide();
    }
  }
    
  setupMenuKeyboardNavigation(menu, toggleElement, isSplitButton) {
    menu.addEventListener('keydown', (event) => {
      const items = Array.from(menu.querySelectorAll('.dropdown-item:not(.disabled)'));
      if (items.length === 0) return;

      const currentIndex = items.indexOf(document.activeElement);
      let handled = false;

      if (event.key === 'ArrowDown') {
        const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % items.length : 0;
        items[nextIndex].focus();
        handled = true;
      } else if (event.key === 'ArrowUp') {
        const prevIndex = currentIndex >= 0 ?
          (currentIndex - 1 + items.length) % items.length : items.length - 1;
        items[prevIndex].focus();
        handled = true;
      } else if (
        (!isSplitButton && event.key === 'ArrowLeft') ||
        (isSplitButton && event.key === 'ArrowLeft' && document.activeElement === items[0])
      ) {
        this._closeDropdown(toggleElement);
        if (toggleElement) toggleElement.focus();
        handled = true;
      } else if (event.key === 'Tab') {
        if (
          (currentIndex === items.length - 1 && !event.shiftKey) ||
          (currentIndex === 0 && event.shiftKey)
        ) {
          setTimeout(() => { // Timeout to allow tab to propagate first
            this._closeDropdown(toggleElement);
          }, 0);
          // Not setting handled = true, as Tab should proceed
        }
      }
      // Note: Removed manual Escape handling - Bootstrap will handle this automatically

      if (handled) {
        event.preventDefault();
        event.stopPropagation();
      }
    });
  }

  _calculateColumns(itemCount) {
    // Calculate number of columns based on item count
    if (itemCount >= 28) return 5;
    if (itemCount >= 21) return 4;
    if (itemCount >= 15) return 3;
    if (itemCount >= 8) return 2;
    return 1;
  }

  _cleanupColumnClasses(menu, parentLi) {
    // Remove existing column classes
    for (let i = 1; i <= 5; i++) {
      menu.classList.remove(`dropdown-menu-columns-${i}`);
    }
    if (parentLi) {
      parentLi.classList.remove('dropdown-full-width');
    }
  }

  _applyColumnClasses(menu, parentLi, numColumns) {
    // Apply new column classes
    if (numColumns > 1) {
      menu.classList.add(`dropdown-menu-columns-${numColumns}`);
    }
    if (numColumns >= 3 && parentLi) {
      parentLi.classList.add('dropdown-full-width');
    }
  }

  initAutoColumns() {
    const topLevelMenus = document.querySelectorAll('.navbar-nav > .nav-item.dropdown > .dropdown-menu');

    topLevelMenus.forEach(menu => {
      if (menu.closest('.bs-dropdown-submenu')) return;

      const items = Array.from(menu.children).filter(child => child.tagName === 'LI');
      const itemCount = items.length;
      const numColumns = this._calculateColumns(itemCount);
      const parentLi = menu.closest('.nav-item.dropdown');

      this._cleanupColumnClasses(menu, parentLi);

      if (itemCount > 0) {
        this._applyColumnClasses(menu, parentLi, numColumns);
      }
    });
  }
}

// Export for various module systems
if (typeof module !== 'undefined' && module.exports) {
  // CommonJS/Node
  module.exports = BootstrapEnhancedDropdowns;
} else if (typeof define === 'function' && define.amd) {
  // AMD/RequireJS
  define([], function() {
    return BootstrapEnhancedDropdowns;
  });
} else {
  // Browser global
  window.BootstrapEnhancedDropdowns = BootstrapEnhancedDropdowns;
} 