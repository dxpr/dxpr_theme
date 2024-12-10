/**
 * Setup for Desktop Menu.
 */
function setupDesktopMenu() {
  const elementNavMobileOpen = document.querySelector(
    ".html--dxpr-theme-nav-mobile--open",
  );
  if (elementNavMobileOpen) {
    elementNavMobileOpen.classList.remove("html--dxpr-theme-nav-mobile--open");
  }

  const elementHeaderSide = document.querySelector(".dxpr-theme-header--side");
  if (elementHeaderSide) {
    elementHeaderSide.classList.add("dxpr-theme-header--top");
    elementHeaderSide.classList.remove("dxpr-theme-header--side");
  }

  const menuBreadcrumbs = document.querySelector(
    "#dxpr-theme-main-menu .menu__breadcrumbs",
  );
  if (menuBreadcrumbs) menuBreadcrumbs.remove();

  const elementMenuLevel = document.querySelector(".menu__level");
  if (elementMenuLevel) {
    elementMenuLevel.classList.remove("menu__level");
    elementMenuLevel.style.top = "100%";
    elementMenuLevel.style.marginTop = 0;
    elementMenuLevel.style.height = "auto";
  }

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

  function handleMouseOver(toggleElement) {
    const dropdownElement = toggleElement.nextElementSibling;

    if (
      dropdownElement &&
      dropdownElement.classList.contains("dropdown-menu")
    ) {
      if (dropdownElement.dataset.widthSet === "true") return;

      const headings = dropdownElement.querySelectorAll(
        ".dxpr-theme-megamenu__heading",
      );
      const columns =
        headings.length > 0
          ? headings.length
          : Math.floor(dropdownElement.querySelectorAll("li").length / 8) + 1;

      if (columns > 2) {
        dropdownElement.style.width = "100%";
        setTimeout(() => {
          dropdownElement.style.left = "0";
        }, 0);
        dropdownElement.style.setProperty("display", "flex");
        dropdownElement.parentElement.style.position = "static";
        dropdownElement.querySelectorAll(":scope > li").forEach((li) => {
          li.style.minWidth = `${100 / columns}%`;
        });
      } else {
        if (!dropdownElement.dataset.initialWidth) {
          dropdownElement.dataset.initialWidth = dropdownElement.offsetWidth;
        }

        const initialWidth = parseFloat(dropdownElement.dataset.initialWidth);

        dropdownElement.style.minWidth = `${initialWidth * columns + 2}px`;
        dropdownElement.querySelectorAll(":scope > li").forEach((li) => {
          li.style.width = `${initialWidth}px`;
        });
      }

      const topLevelItem = dropdownElement.parentElement;
      const delta = Math.round(
        bodyWidth -
          topLevelItem.offsetLeft -
          dropdownElement.offsetWidth -
          margin,
      );
      if (delta < 0) {
        dropdownElement.style.left = `${delta}px`;
      }

      dropdownElement.dataset.widthSet = "true";
    }
  }

  function handleMouseOut(toggleElement) {
    const dropdownElement = toggleElement.nextElementSibling;

    if (
      dropdownElement &&
      dropdownElement.classList.contains("dropdown-menu")
    ) {
      dropdownElement.style.removeProperty("display");
      dropdownElement.dataset.widthSet = "false";
    }
  }

  function setupDropdownEvents() {
    document.querySelectorAll(".dropdown-toggle").forEach((toggleElement) => {
      toggleElement.addEventListener("mouseover", () =>
        handleMouseOver(toggleElement),
      );
      toggleElement.addEventListener("mouseout", () =>
        handleMouseOut(toggleElement),
      );
    });
  }

  setupDropdownEvents();
}

module.exports = { setupDesktopMenu };
