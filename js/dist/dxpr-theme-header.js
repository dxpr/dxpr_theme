/**
 * @file
 * A JavaScript file that styles the page with bootstrap classes.
 *
 * @see sass/styles.scss for more info
 */
(function (Drupal, once) {
  let dxpr_themeMenuState = "";

  // Create and throttle functions if they don't exist already
  if (typeof _ != "function") {
    window._ = {};

    const restArgs = function (func, startIndex) {
      startIndex = startIndex == null ? func.length - 1 : +startIndex;
      return function (...args) {
        const length = Math.max(args.length - startIndex, 0);
        const rest = Array(length);
        let index;
        for (index = 0; index < length; index++) {
          rest[index] = args[index + startIndex];
        }
        switch (startIndex) {
          case 0:
            return func.call(this, rest);
          case 1:
            return func.call(this, args[0], rest);
          case 2:
            return func.call(this, args[0], args[1], rest);
          default:
        }
        const argsData = Array(startIndex + 1);
        for (index = 0; index < startIndex; index++) {
          argsData[index] = args[index];
        }
        argsData[startIndex] = rest;
        return func.apply(this, argsData);
      };
    };

    _.delay = restArgs((func, waitValue, args) =>
      setTimeout(() => func(...args), waitValue),
    );

    window._.debounce = function (func, wait, immediate) {
      let timeout;
      let result;

      const later = function (context, args) {
        timeout = null;
        if (args) result = func.apply(context, args);
      };

      const debounced = restArgs(function (args) {
        const callNow = immediate && !timeout;
        if (timeout) clearTimeout(timeout);
        if (callNow) {
          timeout = setTimeout(later, wait);
          result = func.apply(this, args);
        } else if (!immediate) {
          timeout = _.delay(later, wait, this, args);
        }

        return result;
      });

      debounced.cancel = function () {
        clearTimeout(timeout);
        timeout = null;
      };

      return debounced;
    };

    window._.throttle = function (func, wait, options) {
      let context;
      let args;
      let result;
      let timeout = null;
      let previous = 0;
      if (!options) options = {};
      const later = function () {
        previous = options.leading === false ? 0 : Date.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) {
          context = null;
          args = null;
        }
      };
      return function (...reArgs) {
        const now = Date.now();
        if (!previous && options.leading === false) previous = now;
        const remaining = wait - (now - previous);
        context = this;
        args = reArgs;
        if (remaining <= 0 || remaining > wait) {
          if (timeout) {
            clearTimeout(timeout);
            timeout = null;
          }
          previous = now;
          result = func.apply(context, args);
          if (!timeout) {
            context = null;
            args = null;
          }
        } else if (!timeout && options.trailing !== false) {
          timeout = setTimeout(later, remaining);
        }
        return result;
      };
    };
  }

  const navBreak =
    "dxpr_themeNavBreakpoint" in window ? window.dxpr_themeNavBreakpoint : 1200;

  if (
    document.querySelectorAll(".dxpr-theme-header--sticky").length > 0 &&
    !document.querySelectorAll(".dxpr-theme-header--overlay").length &&
    window.innerWidth > navBreak
  ) {
    const headerHeight = parseFloat(
      drupalSettings.dxpr_themeSettings.headerHeight,
    );
    const headerScroll = parseFloat(
      drupalSettings.dxpr_themeSettings.headerOffset,
    );

    if (headerHeight && headerScroll) {
      const elHeader = document.querySelector(".dxpr-theme-header--sticky");
      const wrapContainer =
        document.getElementsByClassName("wrap-containers")[0];

      const onScroll = _.throttle(() => {
        const scroll = window.scrollY;

        if (scroll >= headerScroll) {
          elHeader.classList.add("affix");
          elHeader.classList.remove("affix-top");
          wrapContainer.style.marginTop = `${headerHeight}px`;
        } else {
          elHeader.classList.add("affix-top");
          elHeader.classList.remove("affix");
          wrapContainer.style.marginTop = "0";
        }
      }, 100);

      window.addEventListener("scroll", onScroll);
    }
  }

  // Accepts 2 getBoundingClientRect objects
  function dxpr_themeHit(rect1, rect2) {
    return !(
      rect1.right < rect2.left ||
      rect1.left > rect2.right ||
      rect1.bottom < rect2.top ||
      rect1.top > rect2.bottom
    );
  }

  function dxpr_themeMenuGovernor(context) {
    // Bootstrap dropdown multi-column smart menu
    let navMenuBreak = 1200;
    if ("dxpr_themeNavBreakpoint" in window) {
      navMenuBreak = window.dxpr_themeNavBreakpoint;
    }

    if (
      document.querySelectorAll(".body--dxpr-theme-header-side").length === 0 &&
      window.innerWidth > navMenuBreak
    ) {
      if (dxpr_themeMenuState === "top") {
        return false;
      }

      const elementNavMobileOpen = document.querySelector(
        ".html--dxpr-theme-nav-mobile--open",
      );
      elementNavMobileOpen?.classList.remove(
        "html--dxpr-theme-nav-mobile--open",
      );

      const elementHeaderSide = document.querySelector(
        ".dxpr-theme-header--side",
      );
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

      dxpr_themeMenuState = "top";

      // Hit Detection for Header
      if (
        document.querySelectorAll(".tabs--primary").length > 0 &&
        document.querySelectorAll("#navbar").length > 0
      ) {
        const tabsRect = document
          .querySelector(".tabs--primary")
          .getBoundingClientRect();
        if (
          document.querySelectorAll(".dxpr-theme-header--navbar-pull-down")
            .length > 0 &&
          document.querySelectorAll("#navbar .container-col").length > 0
        ) {
          const pullDownRect = document
            .querySelector("#navbar .container-col")
            .getBoundingClientRect();
          if (dxpr_themeHit(pullDownRect, tabsRect)) {
            document.querySelector(".tabs--primary").style.marginTop =
              `${pullDownRect.bottom - tabsRect.top + 6}px`;
          }
        } else {
          const navbarRect = document
            .querySelector("#navbar")
            .getBoundingClientRect();
          if (dxpr_themeHit(navbarRect, tabsRect)) {
            document.querySelector(".tabs--primary").style.marginTop =
              `${navbarRect.bottom - tabsRect.top + 6}px`;
          }
        }
      }

      if (
        document.querySelectorAll("#secondary-header").length > 0 &&
        document.querySelectorAll("#navbar.dxpr-theme-header--overlay").length >
          0
      ) {
        const secHeaderRect = document
          .querySelector("#secondary-header")
          .getBoundingClientRect();
        const navbarOverlayRect = document
          .querySelector("#navbar.dxpr-theme-header--overlay")
          .getBoundingClientRect();
        if (dxpr_themeHit(navbarOverlayRect, secHeaderRect)) {
          if (drupalSettings.dxpr_themeSettings.secondHeaderSticky) {
            document.querySelector(
              "#navbar.dxpr-theme-header--overlay",
            ).style.cssText = `top:${secHeaderRect.bottom}px !important;`;
            document
              .querySelector("#secondary-header")
              .classList.remove("dxpr-theme-secondary-header--sticky");
          } else {
            if (document.querySelectorAll("#toolbar-bar").length > 0) {
              document.querySelector("dxpr-theme-header--overlay").style.top =
                `${secHeaderRect.bottom}px`;
            } else {
              document.querySelector("dxpr-theme-header--overlay").style.top =
                "0";
            }
            document
              .querySelector("#secondary-header")
              .classList.remove("dxpr-theme-secondary-header--sticky");
          }
        }
      }
    } else {
      // Mobile Menu with sliding panels and breadcrumb
      // @see dxpr-theme-multilevel-mobile-nav.js
      if (dxpr_themeMenuState === "side") {
        return false;
      }

      // Temporary hiding while settings up @see #290
      document.getElementById("dxpr-theme-main-menu").style.display = "none";

      // Set up classes
      const headerTop = document.querySelector(".dxpr-theme-header--top");

      headerTop?.classList.add("dxpr-theme-header--side");
      headerTop?.classList.remove("dxpr-theme-header--top");

      // Remove split-mega menu columns
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

      // See if logo or block content overlaps menu and apply correction
      let brandingBottom = 0;
      const brandingElement = document.querySelector(".wrap-branding");
      if (brandingElement) {
        brandingBottom = brandingElement.getBoundingClientRect().bottom;
      }

      const lastBlock = document.querySelector(
        "#dxpr-theme-main-menu .block:not(.block-menu):last-of-type",
      );
      if (
        document.querySelectorAll(".body--dxpr-theme-header-side").length > 0 &&
        window.innerWidth > navMenuBreak &&
        lastBlock &&
        brandingBottom > 0
      ) {
        document.getElementById("dxpr-theme-main-menu").style.paddingTop =
          `${brandingBottom + 40}px`;
      }

      const menuBreadcrumbs = document.querySelector(".menu__breadcrumbs");
      const menuLevels = document.querySelector(".menu__level");
      const menuSideLevels = document.querySelector(
        ".dxpr-theme-header--side .menu__level",
      );

      if (lastBlock) {
        const lastBlockBottom = lastBlock.getBoundingClientRect().bottom;
        if (menuBreadcrumbs) {
          menuBreadcrumbs.style.top = `${lastBlockBottom + 20}px`;
        }
        if (menuLevels) {
          menuLevels.style.top = `${lastBlockBottom + 40}px`;
        }
        const offsetBlockBottom = 40 + lastBlockBottom;
        if (menuSideLevels) {
          menuSideLevels.style.height = `calc(100vh - ${offsetBlockBottom}px)`;
        }
      } else if (
        document.querySelectorAll(".body--dxpr-theme-header-side").length > 0 &&
        brandingElement &&
        brandingBottom > 120
      ) {
        if (menuBreadcrumbs) {
          menuBreadcrumbs.style.top = `${brandingBottom + 20}px`;
        }
        if (menuLevels) {
          menuLevels.style.top = `${brandingBottom + 40}px`;
        }
        const offsetBrandingBottom = 40 + brandingBottom;
        if (menuSideLevels) {
          menuSideLevels.style.height = `calc(100vh - ${offsetBrandingBottom}px)`;
        }
      }
      dxpr_themeMenuState = "side";
    }
  }

  // Fixed header on mobile and tablet
  const { headerMobileHeight } = drupalSettings.dxpr_themeSettings;
  const headerFixed = drupalSettings.dxpr_themeSettings.headerMobileFixed;
  const navThemeBreak =
    "dxpr_themeNavBreakpoint" in window ? window.dxpr_themeNavBreakpoint : 1200;

  if (
    headerFixed &&
    document.querySelectorAll(".dxpr-theme-header").length > 0 &&
    window.innerWidth <= navThemeBreak
  ) {
    const navbarElement = document.querySelector("#navbar");
    if (document.querySelectorAll("#toolbar-bar").length > 0) {
      navbarElement.classList.add("header-mobile-admin-fixed");
    }
    if (window.innerWidth >= 975) {
      navbarElement.classList.add("header-mobile-admin-fixed-active");
    } else {
      navbarElement.classList.remove("header-mobile-admin-fixed-active");
    }
    document.querySelector(".dxpr-theme-boxed-container").style.overflow =
      "hidden";
    document.querySelector("#toolbar-bar").classList.add("header-mobile-fixed");
    navbarElement.classList.add("header-mobile-fixed");
    const secondaryHeaderEle = document.querySelector("#secondary-header");
    if (secondaryHeaderEle) {
      secondaryHeaderEle.style.marginTop = `${headerMobileHeight}px`;
    }
  }

  function dxpr_themeMenuGovernorBodyClass() {
    let navBreakMenu = 1200;
    if ("dxpr_themeNavBreakpoint" in window) {
      navBreakMenu = window.dxpr_themeNavBreakpoint;
    }
    if (window.innerWidth > navBreakMenu) {
      const elementNavMobile = document.querySelector(
        ".body--dxpr-theme-nav-mobile",
      );
      if (elementNavMobile) {
        elementNavMobile.classList.add("body--dxpr-theme-nav-desktop");
        elementNavMobile.classList.remove("body--dxpr-theme-nav-mobile");
      }
    } else {
      const elementNavDesktop = document.querySelector(
        ".body--dxpr-theme-nav-desktop",
      );
      if (elementNavDesktop) {
        elementNavDesktop.classList.add("body--dxpr-theme-nav-mobile");
        elementNavDesktop.classList.remove("body--dxpr-theme-nav-desktop");
      }
    }
  }

  function dpxr_themeMenuOnResize() {
    // Mobile menu open direction.
    const menu = document.querySelector(".dxpr-theme-main-menu");
    if (
      drupalSettings.dxpr_themeSettings.headerSideDirection === "right" &&
      window.innerWidth <= window.dxpr_themeNavBreakpoint
    ) {
      if (menu) {
        menu.classList.add("dxpr-theme-main-menu--to-left");
      } else {
        menu.classList.remove("dxpr-theme-main-menu--to-left");
      }
    }

    // Fix bug with not styled content on page load.
    const mainMenu = document.getElementById("dxpr-theme-main-menu");
    if (
      window.innerWidth > window.dxpr_themeNavBreakpoint &&
      document.querySelectorAll(".dxpr-theme-header--side").length === 0
    ) {
      if (mainMenu) {
        mainMenu.style.position = "relative";
      }
    }
  }

  window.addEventListener(
    "resize",
    _.debounce(() => {
      if (document.querySelectorAll("#dxpr-theme-main-menu .nav").length > 0) {
        dxpr_themeMenuGovernorBodyClass();
        dxpr_themeMenuGovernor(document);
      }
      dpxr_themeMenuOnResize();
    }, 50),
  );

  dpxr_themeMenuOnResize();

  document.addEventListener("DOMContentLoaded", () => {
    const mainMenuNav = document.querySelector("#dxpr-theme-main-menu .nav");
    if (mainMenuNav) {
      dxpr_themeMenuGovernorBodyClass();
      dxpr_themeMenuGovernor(document);
    }
  });
})(Drupal, once);
