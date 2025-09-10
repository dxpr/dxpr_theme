/**
 * @file
 * Search functionality for theme settings sidebar.
 */

function initSearchFunctionality() {
  const themeSettings = document.getElementById("system-theme-settings");
  if (!themeSettings) {
    return;
  }

  // Create search container
  const searchContainer = document.createElement("div");
  searchContainer.className = "dxpr-search-container";
  searchContainer.innerHTML =
    '<input type="text" id="dxpr-settings-search" placeholder="Search settings" autocomplete="off">';

  // Insert search at the top of theme settings
  const { firstChild } = themeSettings;
  themeSettings.insertBefore(searchContainer, firstChild);

  const searchInput = document.getElementById("dxpr-settings-search");
  let searchableElements = [];

  // Index all searchable elements
  const indexSearchableElements = function () {
    searchableElements = [];
    const labels = themeSettings.querySelectorAll(
      "label, legend, .vertical-tabs__menu-item-title, .form-header h2, .card-header, summary .details-title",
    );
    const descriptions = themeSettings.querySelectorAll(
      ".description, .help-block",
    );

    // Combine labels and descriptions for searching
    labels.forEach((el) => {
      const parent = el.closest(
        ".form-item, .js-form-type-checkbox, .form-wrapper, details, .vertical-tabs__menu-item",
      );
      if (parent) {
        searchableElements.push({
          element: parent,
          text: el.textContent.toLowerCase(),
          type: "label",
        });
      }
    });

    descriptions.forEach((el) => {
      const parent = el.closest(
        ".form-item, .js-form-type-checkbox, .form-wrapper, details",
      );
      if (parent) {
        searchableElements.push({
          element: parent,
          text: el.textContent.toLowerCase(),
          type: "description",
        });
      }
    });
  };

  // Fast search function
  const performSearch = function (query) {
    query = query.toLowerCase().trim();

    if (query === "") {
      // Show all elements
      searchableElements.forEach((item) => {
        item.element.style.display = "";
      });
      // Show all vertical tabs
      const tabMenuItems = themeSettings.querySelectorAll(
        ".vertical-tabs__menu-item",
      );
      tabMenuItems.forEach((tab) => {
        tab.style.display = "";
      });
      // Ensure vertical tabs container is visible
      const verticalTabsContainer = themeSettings.querySelector(
        ".form-type-vertical-tabs",
      );
      if (verticalTabsContainer) {
        verticalTabsContainer.style.display = "";
      }
      return;
    }

    const matchedElements = new Set();
    const matchedTabs = new Set();

    // Search through indexed elements
    searchableElements.forEach((item) => {
      if (item.text.includes(query)) {
        matchedElements.add(item.element);

        // If this is a section header or form wrapper that matches,
        // also include all form elements within it
        if (
          item.element.classList.contains("form-wrapper") ||
          item.element.classList.contains("card") ||
          item.element.tagName === "DETAILS" ||
          item.element.tagName === "FIELDSET"
        ) {
          const childFormItems = item.element.querySelectorAll(
            ".form-item, .js-form-type-checkbox, .js-form-type-radio, .js-form-type-select, .js-form-type-textfield, .js-form-type-range",
          );
          childFormItems.forEach((child) => {
            matchedElements.add(child);
          });
        }

        // If element is in a vertical tab, mark tab as matched
        const tabPane = item.element.closest(".vertical-tabs__pane");
        if (tabPane) {
          const tabId = tabPane.id;
          if (tabId) {
            matchedTabs.add(tabId);
          }
        }
      }
    });

    // Get all unique elements to hide/show
    const allElements = new Set();
    searchableElements.forEach((item) => {
      allElements.add(item.element);
    });

    // Hide/show form elements
    allElements.forEach((element) => {
      if (matchedElements.has(element)) {
        element.style.display = "";

        // Also ensure all parent containers up to the tab are visible
        let parent = element.parentElement;
        while (parent && !parent.classList.contains("vertical-tabs__pane")) {
          if (
            parent.classList.contains("form-wrapper") ||
            parent.classList.contains("card") ||
            parent.tagName === "DETAILS" ||
            parent.tagName === "FIELDSET"
          ) {
            parent.style.display = "";
            if (parent.tagName === "DETAILS") {
              parent.open = true;
            }
          }
          parent = parent.parentElement;
        }
      } else {
        element.style.display = "none";
      }
    });

    // Ensure vertical tabs container is always visible when there are matches
    if (matchedElements.size > 0) {
      const verticalTabsContainer = themeSettings.querySelector(
        ".form-type-vertical-tabs",
      );
      if (verticalTabsContainer) {
        verticalTabsContainer.style.display = "block";
      }
    }

    // Hide/show vertical tabs based on matches
    const tabMenuItems = themeSettings.querySelectorAll(
      ".vertical-tabs__menu-item",
    );
    tabMenuItems.forEach((tab) => {
      const tabLink = tab.querySelector("a");
      if (tabLink) {
        const href = tabLink.getAttribute("href");
        if (href && href.startsWith("#")) {
          const tabId = href.substring(1);
          const shouldShow = matchedTabs.has(tabId);

          if (shouldShow) {
            tab.style.display = "";

            // Also ensure the tab pane is visible
            const tabPane = document.getElementById(tabId);
            if (tabPane) {
              tabPane.style.display = "";
            }
          } else {
            tab.style.display = "none";
          }
        }
      }
    });
  };

  // Debounced search for performance
  let searchTimeout;
  searchInput.addEventListener("input", () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      performSearch(searchInput.value);
    }, 150);
  });

  // Initialize search index with delay to ensure DOM is ready
  setTimeout(() => {
    indexSearchableElements();
  }, 500);

  // Re-index when new content is loaded (for dynamic content)
  const observer = new MutationObserver(() => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      indexSearchableElements();
    }, 300);
  });
  observer.observe(themeSettings, { childList: true, subtree: true });

  // Also re-index on window load and when vertical tabs are clicked
  window.addEventListener("load", () => {
    setTimeout(indexSearchableElements, 1000);
  });

  // Listen for vertical tab clicks to re-index
  document.addEventListener("click", (e) => {
    if (e.target.closest(".vertical-tabs__menu-item")) {
      setTimeout(indexSearchableElements, 100);
    }
  });
}

module.exports = { initSearchFunctionality };
