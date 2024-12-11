/**
 * Setup for Mobile Menu.
 */
function setupMobileMenu() {
  // Temporarily hide the main menu while setting up classes
  document.getElementById("dxpr-theme-main-menu").style.display = "none";

  const headerTop = document.querySelector(".dxpr-theme-header--top");
  headerTop?.classList.add("dxpr-theme-header--side");
  headerTop?.classList.remove("dxpr-theme-header--top");

  // eslint-disable-next-line spellcheck/spell-checker
  // Clear megamenu styles for mobile view
  document
    .querySelectorAll(
      "#dxpr-theme-main-menu .menu .dropdown-menu, #dxpr-theme-main-menu .menu .dropdown-menu li",
    )
    .forEach((el) => {
      el.removeAttribute("style");
    });

  const mainMenu = document.getElementById("dxpr-theme-main-menu");
  if (mainMenu) {
    const menuItems = mainMenu.querySelectorAll(".menu");
    menuItems.forEach((menuItem) => {
      menuItem.classList.add("menu__level");

      const dropdownMenus = menuItem.querySelectorAll(".dropdown-menu");
      dropdownMenus.forEach((dropdownMenu) => {
        dropdownMenu.classList.add("menu__level");
      });

      const megamenus = menuItem.querySelectorAll(".dxpr-theme-megamenu");
      megamenus.forEach((megamenu) => {
        megamenu.classList.add("menu__level");
      });

      const links = menuItem.querySelectorAll("a");
      links.forEach((link) => {
        link.classList.add("menu__link");
      });

      const listItems = menuItem.querySelectorAll("li");
      listItems.forEach((listItem) => {
        listItem.classList.add("menu__item");
      });
    });
  }

  // Set up data attributes
  document
    .querySelectorAll("#dxpr-theme-main-menu .menu a.dropdown-toggle")
    .forEach((element) => {
      const nextElement = element.nextElementSibling;
      element.setAttribute("data-submenu", element.textContent);
      nextElement.setAttribute("data-menu", element.textContent);
    });

  document
    .querySelectorAll(
      "#dxpr-theme-main-menu .menu a.dxpr-theme-megamenu__heading",
    )
    .forEach((element) => {
      const nextMegaElement = element.nextElementSibling;
      element.setAttribute("data-submenu", element.textContent);
      nextMegaElement.setAttribute("data-menu", element.textContent);
    });

  // Initialize MLMenu with breadcrumb control
  const bc =
    document.querySelectorAll("#dxpr-theme-main-menu .menu .dropdown-menu")
      .length > 0;
  const menuEl = document.getElementById("dxpr-theme-main-menu");
  new MLMenu(menuEl, {
    breadcrumbsCtrl: bc, // Show breadcrumbs
    initialBreadcrumb: "menu", // Initial breadcrumb text
    backCtrl: false, // Show back button
    itemsDelayInterval: 10, // Delay between each menu item sliding animation
  });

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

  // Restore menu visibility
  document.getElementById("dxpr-theme-main-menu").style.position = "fixed";
  document.getElementById("dxpr-theme-main-menu").style.display = "block";

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
