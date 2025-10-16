/**
 * Updates the body class for the menu layout based on window width and breakpoint.
 * @param {number} navBreakMenu - The breakpoint width for switching between mobile and desktop menu classes.
 */
function dxpr_themeMenuGovernorBodyClass() {
  const navBreakMenu =
    window.dxpr_themeNavBreakpoint ??
    drupalSettings?.dxpr_themeSettings?.headerMobileBreakpoint ??
    1200;

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
