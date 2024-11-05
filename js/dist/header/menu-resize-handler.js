/**
 * Handles menu styling on window resize for mobile and desktop.
 * Adjusts the main menu position and direction based on window width and settings.
 * @param {Object} drupalSettings - Global settings for Drupal theme configurations.
 */
function dxpr_themeMenuOnResize() {
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

module.exports = { dxpr_themeMenuOnResize };
