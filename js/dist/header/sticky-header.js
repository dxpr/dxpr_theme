/**
 * Logic for adding/removing sticky behavior to the header.
 *
 * This function applies a "sticky" class to the header when
 * the page scrolls beyond a certain point, determined by
 * `headerScroll`. It also sets `marginTop` on the main container
 * to account for the sticky header height.
 *
 * - `affix` class is added when header is sticky
 * - `affix-top` class is added when header is at the top
 */

function setupStickyHeader() {
  const headerHeight = parseFloat(
    drupalSettings.dxpr_themeSettings.headerHeight,
  );

  const headerScroll = parseFloat(
    drupalSettings.dxpr_themeSettings.headerOffset,
  );

  if (headerHeight && headerScroll) {
    const elHeader = document.querySelector(".dxpr-theme-header--sticky");
    const wrapContainer = document.getElementsByClassName("wrap-containers")[0];

    /**
     * Adjusts the margin-bottom of the branding element based on sticky header state
     * @param {number} marginValue - The margin value in pixels (80 for normal, 60 for sticky)
     */
    const adjustBrandingSpacing = (marginValue) => {
      const brandingElement = document.querySelector(".wrap-branding:has(.name.navbar-brand)");
      if (brandingElement) {
        brandingElement.style.marginBottom = `${marginValue}px`;
      }
    };

    const onScroll = () => {
      const scroll = window.scrollY;

      if (scroll >= headerScroll) {
        elHeader.classList.add("affix");
        elHeader.classList.remove("affix-top");
        wrapContainer.style.marginTop = `${headerHeight}px`;
        // Reduce spacing when header is sticky to prevent excessive gaps
        adjustBrandingSpacing(60);
      } else {
        elHeader.classList.add("affix-top");
        elHeader.classList.remove("affix");
        wrapContainer.style.marginTop = "0";
        // Normal spacing when header is at the top
        adjustBrandingSpacing(80);
      }
    };

    window.addEventListener("scroll", onScroll);
    
    // Set initial spacing when page loads
    adjustBrandingSpacing(80);
  }
}

module.exports = { setupStickyHeader };
