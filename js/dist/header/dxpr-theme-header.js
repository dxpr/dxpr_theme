/**
 * @file
 * A JavaScript file that styles the page with bootstrap classes.
 *
 * @see sass/styles.scss for more info
 */

const { setupStickyHeader } = require("./sticky-header");
const { debounce } = require("./performance-helpers");
const { setupDesktopMenu } = require("./menu-desktop");
const { setupMobileMenu } = require("./menu-mobile");
const { hitDetection } = require("./hit-detection");
const { handleOverlayPosition } = require("./overlay-position");
const { adjustMenuPosition } = require("./menu-position");
const { applyFixedHeaderStyles } = require("./apply-fixed-header-styles");
const { dxpr_themeMenuGovernorBodyClass } = require("./menu-governor-body");
const { dxpr_themeMenuOnResize } = require("./menu-resize-handler");

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

      // Injecting menu-desktop.js
      setupDesktopMenu();

      dxpr_themeMenuState = "top";

      // Hit Detection for Header
      if (
        document.querySelectorAll(".tabs--primary").length > 0 &&
        document.querySelectorAll("#navbar").length > 0
      ) {
        // Injecting hit-detection.js
        hitDetection();
      }

      if (
        document.querySelectorAll("#secondary-header").length > 0 &&
        document.querySelectorAll("#navbar.dxpr-theme-header--overlay").length >
          0
      ) {
        // Injecting overlay-position.js and inside it's collision-detection.js
        handleOverlayPosition(drupalSettings);
      }
    } else {
      // Mobile Menu with sliding panels and breadcrumb
      // @see dxpr-theme-multilevel-mobile-nav.js
      if (dxpr_themeMenuState === "side") {
        return false;
      }

      // Injecting menu-mobile.js
      setupMobileMenu();

      dxpr_themeMenuState = "side";

      // Injecting menu-position.js
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
    // Injecting apply-fixed-header-styles.js
    applyFixedHeaderStyles(headerMobileHeight);
  }

  // Injecting menu-governor-body.js
  dxpr_themeMenuGovernorBodyClass();

  window.addEventListener(
    "resize",
    debounce(() => {
      if (document.querySelectorAll("#dxpr-theme-main-menu .nav").length > 0) {
        dxpr_themeMenuGovernorBodyClass();
        dxpr_themeMenuGovernor(document);
      }
      // eslint-disable-next-line spellcheck/spell-checker
      // Injecting menu-resize-handler.js
      dxpr_themeMenuOnResize();
    }, 50),
  );
  // eslint-disable-next-line spellcheck/spell-checker
  // Injecting menu-resize-handler.js
  dxpr_themeMenuOnResize();

  document.addEventListener("DOMContentLoaded", () => {
    const mainMenuNav = document.querySelector("#dxpr-theme-main-menu .nav");
    if (mainMenuNav) {
      dxpr_themeMenuGovernorBodyClass();
      dxpr_themeMenuGovernor(document);
    }
  });
})(Drupal, once);
