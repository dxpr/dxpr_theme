/**
 * Setup for Desktop Menu.
 */
function setupDesktopMenu() {
  const elementNavMobileOpen = document.querySelector(
    ".html--dxpr-theme-nav-mobile--open",
  );
  elementNavMobileOpen?.classList.remove("html--dxpr-theme-nav-mobile--open");

  const elementHeaderSide = document.querySelector(".dxpr-theme-header--side");
  if (elementHeaderSide) {
    elementHeaderSide.classList.add("dxpr-theme-header--top");
    elementHeaderSide.classList.remove("dxpr-theme-header--side");
  }

  const menuBreadcrumbs = document.querySelector(
    "#dxpr-theme-main-menu .menu__breadcrumbs",
  );
  menuBreadcrumbs?.remove();

  const elementMenuLevel = document.querySelector(".menu__level");

  elementMenuLevel?.classList.remove("menu__level");
  elementMenuLevel?.style.setProperty("top", "100%");
  elementMenuLevel?.style.setProperty("marginTop", "0");
  elementMenuLevel?.style.setProperty("height", "auto");

  const elementMenuItem = document.querySelector(".menu__item");
  if (elementMenuItem) {
    elementMenuItem.classList.remove("menu__item");
  }

  // Remove data attributes for desktop
  document
    .querySelectorAll("[data-submenu]")
    .forEach((el) => el.removeAttribute("data-submenu"));
  document
    .querySelectorAll("[data-menu]")
    .forEach((el) => el.removeAttribute("data-menu"));

  const bodyWidth = document.body.clientWidth;
  const margin = 10;
  let columns;

  document
    .querySelectorAll("#dxpr-theme-main-menu .menu .dropdown-menu")
    .forEach((dropdownElement) => {
      const width = dropdownElement.offsetWidth;
      const headings = dropdownElement.querySelectorAll(
        ".dxpr-theme-megamenu__heading",
      );

      if (headings.length > 0) {
        columns = headings.length;
      } else {
        columns =
          Math.floor(dropdownElement.querySelectorAll("li").length / 8) + 1;
      }

      if (columns > 2) {
        dropdownElement.style.width = "100%";
        dropdownElement.style.left = "0";
        dropdownElement.parentElement.style.position = "static";
        dropdownElement
          .querySelectorAll(".dropdown-menu > li")
          .forEach((li) => {
            li.style.width = `${100 / columns}%`;
          });
      } else {
        if (columns > 1) {
          dropdownElement.style.minWidth = `${width * columns + 2}px`;
          dropdownElement.querySelectorAll(":scope > li").forEach((li) => {
            li.style.width = `${width}px`;
          });
        }

        const topLevelItem = dropdownElement.parentElement;
        setTimeout(() => {
          const delta = Math.round(
            bodyWidth -
              topLevelItem.offsetLeft -
              dropdownElement.offsetWidth -
              margin,
          );
          if (delta < 0) {
            dropdownElement.style.left = `${delta}px`;
          }
        }, 0);
      }
    });
}

module.exports = { setupDesktopMenu };
