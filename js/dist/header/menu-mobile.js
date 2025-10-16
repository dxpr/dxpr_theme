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

  // Mobile menu toggle
  document
    .querySelector("#dxpr-theme-menu-toggle")
    .addEventListener("click", () => {
      closeMenu();
    });

  // Close menu with click on anchor link
  document.querySelectorAll(".menu__link").forEach((link) => {
    link.addEventListener("click", function () {
      if (!this.getAttribute("data-submenu")) {
        closeMenu();
      }
    });
  });
}

module.exports = { setupMobileMenu };
