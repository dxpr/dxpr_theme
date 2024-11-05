/**
 * Adjusts the position of the main menu based on branding and last block overlap.
 */
function adjustMenuPosition() {
  // Check position of the branding element
  let brandingBottom = 0;
  const brandingElement = document.querySelector(".wrap-branding");
  if (brandingElement) {
    brandingBottom = brandingElement.getBoundingClientRect().bottom;;
  }

  // Identify the last block element in the main menu
  const lastBlock = document.querySelector(
    "#dxpr-theme-main-menu .block:not(.block-menu):last-of-type"
  );

  // If in side header mode and conditions are met, apply paddingTop correction to main menu
  if (
    document.querySelectorAll(".body--dxpr-theme-header-side").length > 0 &&
    window.innerWidth > (window.dxpr_themeNavBreakpoint || 1200) &&
    lastBlock &&
    brandingBottom > 0
  ) {
    document.getElementById("dxpr-theme-main-menu").style.paddingTop = `${brandingBottom + 40}px`;
  }

  // Define menu elements for breadcrumb, levels, and side-levels
  const menuBreadcrumbs = document.querySelector(".menu__breadcrumbs");
  const menuLevels = document.querySelector(".menu__level");
  const menuSideLevels = document.querySelector(".dxpr-theme-header--side .menu__level");

  // Adjust top and height properties based on last block or branding element
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
}

module.exports = { adjustMenuPosition };
