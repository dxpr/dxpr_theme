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
    
  _createDropdownInstance(toggleElement, menuElement) {
    const dropdownInstance = new bootstrap.Dropdown(toggleElement);
    dropdownInstance._menu = menuElement; // Manually set menu reference
    return dropdownInstance;
  }

  _attachToggleHandlers(toggleElement, dropdownInstance, isSubmenuLinkToggle = false) {
    toggleElement.addEventListener('click', (event) => {
      event.stopPropagation();
      // For submenu links that are also toggles (href="#"), prevent navigation
      if (isSubmenuLinkToggle && toggleElement.tagName === 'A' && 
          (toggleElement.getAttribute('href') === '#' || toggleElement.getAttribute('href') === '')) {
        event.preventDefault();
      }
      dropdownInstance.toggle();
    });
            
    toggleElement.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        event.stopPropagation();
        dropdownInstance.toggle();
      }
    });
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

  initSplitButtonDropdowns() {
    const splitButtons = document.querySelectorAll(this.options.splitButtonSelector);
        
    splitButtons.forEach((splitButton) => {
      const caretButton = splitButton.querySelector(this.options.caretSelector);
      const linkElement = splitButton.querySelector(`.nav-link:not(${this.options.fullToggleSelector})`);
            
      if (!caretButton || !linkElement) return;
            
      const menu = this._findAssociatedMenuForSplitButton(caretButton, splitButton);
      if (!menu) return;
            
      const dropdownInstance = this._createDropdownInstance(caretButton, menu);
      this._attachToggleHandlers(caretButton, dropdownInstance);
      this._attachAriaSyncHandlers(caretButton, caretButton); // Event source and ARIA target are the same
            
      this.setupMenuKeyboardNavigation(menu, caretButton, true);
    });
  }
    
  initSubmenuDropdowns() {
    const submenuDropdowns = document.querySelectorAll(this.options.submenuSelector);
        
    submenuDropdowns.forEach((submenu) => {
      const itemWrapper = submenu.querySelector('.bs-dropdown-item-wrapper');
      let toggleElement, linkElement, menuElement, isSplitButton = false;
            
      if (itemWrapper) {
        linkElement = itemWrapper.querySelector(`.dropdown-item:not(${this.options.fullToggleSelector})`);
        toggleElement = itemWrapper.querySelector(this.options.caretSelector);
        isSplitButton = true;
      } else {
        toggleElement = submenu.querySelector(this.options.fullToggleSelector);
      }
            
      if (!toggleElement) return;
            
      menuElement = submenu.querySelector('.dropdown-menu');
      if (!menuElement) return;
            
      let labelledById = (isSplitButton && linkElement) ? (linkElement.id || '') : (toggleElement.id || '');
      if (!menuElement.id && labelledById) menuElement.id = `${labelledById}-menu`;
      if (labelledById) menuElement.setAttribute('aria-labelledby', labelledById);
      if (menuElement.id && !toggleElement.hasAttribute('aria-controls')) {
        toggleElement.setAttribute('aria-controls', menuElement.id);
      }
            
      const dropdownInstance = this._createDropdownInstance(toggleElement, menuElement);
      // Pass true if it's a full toggle link that might need event.preventDefault()
      const isLinkToggle = !isSplitButton && toggleElement.tagName === 'A';
      this._attachToggleHandlers(toggleElement, dropdownInstance, isLinkToggle); 
      // For submenus, caretButton/toggleElement is event source, but also the element for aria-expanded.
      // submenu is the parent for 'show' class. focusTargetMenu is the menu itself.
      this._attachAriaSyncHandlers(toggleElement, toggleElement, submenu, menuElement);
            
      this.setupMenuKeyboardNavigation(menuElement, toggleElement, isSplitButton);
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
        event.key === 'Escape' || 
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
            
      if (handled) {
        event.preventDefault();
        event.stopPropagation();
      }
    });
  }

  initAutoColumns() {
    const topLevelMenus = document.querySelectorAll(
      // Selects dropdown-menu that is a direct child of nav-item.dropdown,
      // which itself is a direct child of .navbar-nav (top level)
      '.navbar-nav > .nav-item.dropdown > .dropdown-menu'
    );

    topLevelMenus.forEach(menu => {
      // Ensure this menu is not part of a .bs-dropdown-submenu (nested menu)
      if (menu.closest('.bs-dropdown-submenu')) {
        return;
      }

      const items = Array.from(menu.children).filter(child => child.tagName === 'LI');
      const itemCount = items.length;
      let numColumns = 1;

      if (itemCount >= 28) { // 28+ items
        numColumns = 5;
      } else if (itemCount >= 21) { // 21-27 items
        numColumns = 4;
      } else if (itemCount >= 15) { // 15-20 items
        numColumns = 3;
      } else if (itemCount >= 8) {  // 8-14 items
        numColumns = 2;
      }
      // else numColumns remains 1 for 1-7 items

      // Clean up previous column classes
      for (let i = 1; i <= 5; i++) {
        menu.classList.remove(`dropdown-menu-columns-${i}`);
      }
      
      const parentLi = menu.closest('.nav-item.dropdown');
      if (parentLi) {
        parentLi.classList.remove('dropdown-full-width');
      }

      if (itemCount > 0) {
        if (numColumns > 1) { // Only add column class if more than 1 column
          menu.classList.add(`dropdown-menu-columns-${numColumns}`);
        }
        // If numColumns is 1, no specific column class is added, it behaves as default.

        if (numColumns >= 3 && parentLi) {
          parentLi.classList.add('dropdown-full-width');
        }
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