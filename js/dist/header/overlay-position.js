const { dxprThemeHit } = require("./collision-detection");

/**
 * Adjusts the position of the overlay header based on overlap with the secondary header.
 * @param {Object} drupalSettings - Global settings for Drupal theme configurations.
 */
function handleOverlayPosition(drupalSettings) {
  // Check if both secondary header and overlay navbar exist
  if (
    document.querySelectorAll("#secondary-header").length > 0 &&
    document.querySelectorAll("#navbar.dxpr-theme-header--overlay").length > 0
  ) {
    // Get bounding rectangles for both elements
    const secHeaderRect = document
      .querySelector("#secondary-header")
      .getBoundingClientRect();
    const navbarOverlayRect = document
      .querySelector("#navbar.dxpr-theme-header--overlay")
      .getBoundingClientRect();

    // If elements overlap, adjust the overlay header position
    if (dxprThemeHit(navbarOverlayRect, secHeaderRect)) {
      const navbarOverlay = document.querySelector(
        "#navbar.dxpr-theme-header--overlay",
      );
      const secondaryHeader = document.querySelector("#secondary-header");

      if (drupalSettings.dxpr_themeSettings.secondHeaderSticky) {
        // Position overlay below the secondary header and remove sticky class
        navbarOverlay.style.cssText = `top:${secHeaderRect.bottom}px !important;`;
        secondaryHeader.classList.remove("dxpr-theme-secondary-header--sticky");
      } else {
        // Adjust overlay position based on toolbar presence
        if (document.querySelectorAll("#toolbar-bar").length > 0) {
          navbarOverlay.style.top = `${secHeaderRect.bottom}px`;
        } else {
          navbarOverlay.style.top = "0";
        }
        secondaryHeader.classList.remove("dxpr-theme-secondary-header--sticky");
      }
    }
  }
}

module.exports = { handleOverlayPosition };
