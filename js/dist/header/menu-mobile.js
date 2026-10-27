/**
 * Setup for Mobile Menu.
 */
function setupMobileMenu() {
  // Close/open menu function
  const closeMenu = function () {
    if (drupalSettings.dxpr_themeSettings.hamburgerAnimation === "cross") {
      document
        .querySelector("#dxpr-theme-menu-toggle")
        .classList.toggle("navbar-toggle--active");
    }
    document
      .querySelector("#dxpr-theme-main-menu")
      .classList.toggle("menu--open");
    document
      .querySelector("html")
      .classList.toggle("html--dxpr-theme-nav-mobile--open");
  };

  // The header calls this function whenever the window changes size at mobile
  // widths, and phones change it each time the address bar slides away.
  // Without once() every call would add a listener that toggles the menu again.

  // Mobile menu toggle
  once("dxpr-theme-menu-toggle", "#dxpr-theme-menu-toggle").forEach(
    (toggle) => {
      toggle.addEventListener("click", () => {
        closeMenu();
      });
    },
  );

  // Close menu with click on anchor link
  once("dxpr-theme-menu-link", ".menu__link").forEach((link) => {
    link.addEventListener("click", function () {
      if (!this.getAttribute("data-submenu")) {
        closeMenu();
      }
    });
  });
}

module.exports = { setupMobileMenu };
