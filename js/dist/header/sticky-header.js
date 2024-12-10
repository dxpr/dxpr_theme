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

    const onScroll = () => {
      const scroll = window.scrollY;

      if (scroll >= headerScroll) {
        elHeader.classList.add("affix");
        elHeader.classList.remove("affix-top");
        wrapContainer.style.marginTop = `${headerHeight}px`;
      } else {
        elHeader.classList.add("affix-top");
        elHeader.classList.remove("affix");
        wrapContainer.style.marginTop = "0";
      }
    };

    window.addEventListener("scroll", onScroll);
  }
}

module.exports = { setupStickyHeader };
