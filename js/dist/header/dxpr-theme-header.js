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
const { hitDetection } = require("./hit-detection");
const { handleOverlayPosition } = require("./overlay-position");
const { adjustMenuPosition } = require("./menu-position");

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
        //Injecting hit-detection.js
        hitDetection();
      }

      if (
        document.querySelectorAll("#secondary-header").length > 0 &&
        document.querySelectorAll("#navbar.dxpr-theme-header--overlay").length > 0
      ) {

        //Injecting overlay-position.js and inside it's collision-detection.js
        handleOverlayPosition(drupalSettings);
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

      //Injecting menu-position.js
      adjustMenuPosition();
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


