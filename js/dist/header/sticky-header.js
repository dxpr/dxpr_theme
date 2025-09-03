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

    if (elHeader && wrapContainer) {
      let isScrolling = false;
      let lastScrollPosition = -1;
      let rafId = null;

      const updateStickyHeader = () => {
        // Use body.scrollTop since scroll events are firing on body element
        const scroll =
          document.body.scrollTop ||
          document.documentElement.scrollTop ||
          window.scrollY ||
          0;

        // Only update DOM if scroll position actually changed
        if (scroll !== lastScrollPosition) {
          lastScrollPosition = scroll;

          if (scroll >= headerScroll) {
            if (!elHeader.classList.contains("affix")) {
              elHeader.classList.add("affix");
              elHeader.classList.remove("affix-top");
              wrapContainer.style.marginTop = `${headerHeight}px`;
            }
          } else if (!elHeader.classList.contains("affix-top")) {
            elHeader.classList.add("affix-top");
            elHeader.classList.remove("affix");
            wrapContainer.style.marginTop = "0";
          }
        }

        isScrolling = false;
      };

      const onScroll = () => {
        // Throttle scroll events using requestAnimationFrame
        if (!isScrolling) {
          isScrolling = true;

          // Cancel any pending animation frame
          if (rafId) {
            window.cancelAnimationFrame(rafId);
          }

          rafId = window.requestAnimationFrame(updateStickyHeader);
        }
      };

      // Use passive listeners for better scroll performance
      const scrollOptions = { passive: true };

      // Add scroll event listeners on both window and body elements
      window.addEventListener("scroll", onScroll, scrollOptions);
      document.body.addEventListener("scroll", onScroll, scrollOptions);
      document.documentElement.addEventListener(
        "scroll",
        onScroll,
        scrollOptions,
      );

      // Initial state check
      updateStickyHeader();
    }
  }
}

module.exports = { setupStickyHeader };
