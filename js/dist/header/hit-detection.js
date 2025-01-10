/**
 * @function hitDetection
 * Adjusts the margin of the primary tabs to avoid overlap with the header elements.
 * This function calculates and applies a margin-top to the `.tabs--primary` element
 * based on its bounding rectangle and the position of the navbar or pull-down container.
 *
 * Dependencies:
 * - dxprThemeCollisionCheck: A helper function to detect rectangle intersection.
 */

const { dxprThemeCollisionCheck } = require("./collision-detection");

function hitDetection() {
  // Get the bounding rectangle of the primary tabs element
  const tabsRect = document
    .querySelector(".tabs--primary")
    .getBoundingClientRect();

  // Check if navbar pull-down elements are present
  if (
    document.querySelectorAll(".dxpr-theme-header--navbar-pull-down").length >
      0 &&
    document.querySelectorAll("#navbar .container-col").length > 0
  ) {
    // Get the bounding rectangle of the pull-down container
    const pullDownRect = document
      .querySelector("#navbar .container-col")
      .getBoundingClientRect();

    // If pull-down overlaps with tabs, adjust margin-top of the tabs
    if (dxprThemeCollisionCheck(pullDownRect, tabsRect)) {
      document.querySelector(".tabs--primary").style.marginTop =
        `${pullDownRect.bottom - tabsRect.top + 6}px`;
    }
  } else {
    // Fallback: Get the bounding rectangle of the main navbar if pull-down is absent
    const navbarRect = document
      .querySelector("#navbar")
      .getBoundingClientRect();

    // If navbar overlaps with tabs, adjust margin-top of the tabs
    if (dxprThemeCollisionCheck(navbarRect, tabsRect)) {
      document.querySelector(".tabs--primary").style.marginTop =
        `${navbarRect.bottom - tabsRect.top + 6}px`;
    }
  }
}

module.exports = { hitDetection };
