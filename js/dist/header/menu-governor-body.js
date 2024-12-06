/**
 * Updates the body class for the menu layout based on window width and breakpoint.
 * @param {number} navBreakMenu - The breakpoint width for switching between mobile and desktop menu classes.
 */
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

module.exports = { dxpr_themeMenuGovernorBodyClass };
