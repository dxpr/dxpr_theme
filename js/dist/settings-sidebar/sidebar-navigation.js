/**
 * @file
 * Sidebar navigation scroll functionality.
 */

/**
 * Initialize scroll navigation for sidebar menu items.
 */
function initializeSidebarNavigation() {
  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeSidebarNavigation);
    return;
  }

  // Function to scroll to a section in the styleguide
  const scrollToSection = (sectionId) => {
    const styleguideContainer = document.querySelector(".bd-cheatsheet");
    if (!styleguideContainer) {
      return;
    }

    if (sectionId === "top") {
      // Scroll to the very top of the entire page
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    const targetElement = styleguideContainer.querySelector(`#${sectionId}`);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Mapping of sidebar menu items to styleguide section IDs
  const navigationMap = {
    Colors: "backgrounds", // Colors section in styleguide
    "Page Title": "top", // Scroll to top
    "Header & Main Menu": "top", // Scroll to top
    Typography: "typography", // Typography section
    Fonts: "typography", // Also goes to typography section
    "Block Design": "block-design", // Drupal Blocks section
  };

  // Add click handlers to vertical tabs menu items
  const addNavigationHandler = () => {
    const menuItems = document.querySelectorAll(".vertical-tabs__menu-item a");

    menuItems.forEach((menuItem) => {
      const menuTitle = menuItem.querySelector(
        ".vertical-tabs__menu-item-title",
      );
      if (menuTitle) {
        const titleText = menuTitle.textContent.trim();

        if (Object.prototype.hasOwnProperty.call(navigationMap, titleText)) {
          menuItem.addEventListener("click", (e) => {
            // Let the normal tab switching happen first
            setTimeout(() => {
              scrollToSection(navigationMap[titleText]);
            }, 100);
          });
        }
      }
    });
  };

  // Initialize immediately if tabs already exist
  addNavigationHandler();

  // Also set up a mutation observer to handle dynamic content
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        // Re-initialize handlers when new content is added
        addNavigationHandler();
      }
    });
  });

  // Observe the form for changes
  const formContainer = document.getElementById("system-theme-settings");
  if (formContainer) {
    observer.observe(formContainer, {
      childList: true,
      subtree: true,
    });
  }
}

// Initialize the navigation
initializeSidebarNavigation();

module.exports = { initializeSidebarNavigation };
