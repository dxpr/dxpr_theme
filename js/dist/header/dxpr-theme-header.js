/**
 * @file
 * A JavaScript file that styles the page with bootstrap classes.
 *
 * @see sass/styles.scss for more info
 */

const { setupStickyHeader } = require("./sticky-header");
const { debounce } = require("./performance-helpers");
const { setupMobileMenu } = require("./menu-mobile");
const { setupDesktopMenu } = require("./menu-desktop");
const { hitDetection } = require("./hit-detection");
const { handleOverlayPosition } = require("./overlay-position");
const { applyFixedHeaderStyles } = require("./apply-fixed-header-styles");
const { dxpr_themeMenuGovernorBodyClass } = require("./menu-governor-body");

(function (Drupal, drupalSettings, once) {
  let dxpr_themeMenuState = "";

  const navBreak =
    window.dxpr_themeNavBreakpoint ??
    drupalSettings?.dxpr_themeSettings?.headerMobileBreakpoint ??
    1200;

  if (
    document.querySelectorAll(".dxpr-theme-header--sticky").length > 0 &&
    !document.querySelectorAll(".dxpr-theme-header--overlay").length &&
    window.innerWidth > navBreak
  ) {
    // Injecting function setupStickyHeader() from sticky-header.js
    setupStickyHeader();
  }

  function dxpr_themeMenuGovernor(context) {
    if (window.innerWidth > navBreak) {
      setupDesktopMenu();

      if (dxpr_themeMenuState === "top") {
        return false;
      }

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
      // Injecting menu-mobile.js
      setupMobileMenu();
    }
  }

  // Fixed header on mobile and tablet
  const { headerMobileHeight } = drupalSettings.dxpr_themeSettings;
  const headerFixed = drupalSettings.dxpr_themeSettings.headerMobileFixed;

  if (
    headerFixed &&
    document.querySelectorAll(".dxpr-theme-header").length > 0 &&
    window.innerWidth <= navBreak
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

        // Add --drupal-displace-offset-top Drupal 9.x.
        const html = document.documentElement;
        const toolbar = document.getElementById("toolbar-bar");
        if (!html.style.getPropertyValue("--drupal-displace-offset-top")) {
          html.style.setProperty("--drupal-displace-offset-top", "0px");
        }
        if (toolbar) {
          html.style.setProperty(
            "--drupal-displace-offset-top",
            `${toolbar.offsetHeight}px`,
          );
        }
      }
    }, 50),
  );

  document.addEventListener("DOMContentLoaded", () => {
    const mainMenuNav = document.querySelector("#dxpr-theme-main-menu .nav");
    if (mainMenuNav) {
      dxpr_themeMenuGovernorBodyClass();
      dxpr_themeMenuGovernor(document);
    }
  });
})(Drupal, drupalSettings, once);
