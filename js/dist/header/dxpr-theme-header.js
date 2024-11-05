/**
 * @file
 * A JavaScript file that styles the page with bootstrap classes.
 *
 * @see sass/styles.scss for more info
 */

const { setupStickyHeader } = require("./sticky-header");
const { debounce, throttle, delay } = require("./performance-helpers");
const { setupDesktopMenu } = require("./menu-desktop");
const { setupMobileMenu } = require("./menu-mobile");

(function (Drupal, once) {
  let dxpr_themeMenuState = "";

  const navBreak =
    "dxpr_themeNavBreakpoint" in window ? window.dxpr_themeNavBreakpoint : 1200;

  if (
    document.querySelectorAll(".dxpr-theme-header--sticky").length > 0 &&
    !document.querySelectorAll(".dxpr-theme-header--overlay").length &&
    window.innerWidth > navBreak
  ) {
    // Injecting function setupStickyHeader() from sticky-header.js
    setupStickyHeader();
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

      //Injecting menu-desktop.js
      setupDesktopMenu();

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

      //Injecting menu-mobile.js
      setupMobileMenu();

      dxpr_themeMenuState = "side"

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
    if (
      drupalSettings.dxpr_themeSettings.headerSideDirection === "right" &&
      window.innerWidth <= window.dxpr_themeNavBreakpoint
    ) {
      document
        .querySelector(".dxpr-theme-main-menu")
        .classList.add("dxpr-theme-main-menu--to-left");
    } else {
      document
        .querySelector(".dxpr-theme-main-menu")
        .classList.remove("dxpr-theme-main-menu--to-left");
    }
    // Fix bug with not styled content on page load.
    if (
      window.innerWidth > window.dxpr_themeNavBreakpoint &&
      document.querySelectorAll(".dxpr-theme-header--side").length === 0
    ) {
      document.getElementById("dxpr-theme-main-menu").style.position =
        "relative";
    }
  }

  window.addEventListener(
    "resize",
    debounce(() => {
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


