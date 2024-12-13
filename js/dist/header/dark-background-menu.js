/**
 * @file
 * Handles setting text color for menu items based on background darkness.
 */

function setupDarkBackgroundMenu() {
  const dropdownMenu = document.querySelector(
    '#navbar.dxpr-theme-header--top .dropdown-menu'
  );

  // Function to calculate luminance of a color
  function getLuminance(rgbColor) {
    const [r, g, b] = rgbColor
      .replace(/[^\d,]/g, '')
      .split(',')
      .map(value => {
        const num = parseInt(value, 10) / 255;
        return num <= 0.03928 ? num / 12.92 : Math.pow((num + 0.055) / 1.055, 2.4);
      });

    // WCAG luminance formula
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  if (dropdownMenu) {
    const style = window.getComputedStyle(dropdownMenu);
    const backgroundColor = style.backgroundColor;

    if (backgroundColor.startsWith('rgb')) {
      const luminance = getLuminance(backgroundColor);

      // Check if background is dark
      if (luminance < 0.2) {
        const elementsToUpdate = document.querySelectorAll(
          '#navbar.dxpr-theme-header--top .dropdown, #navbar.dxpr-theme-header--top .dropdown-menu a'
        );

        elementsToUpdate.forEach(element => {
          // Set light text color for dark backgrounds
          element.style.color = '#b0b0b0';
        });
      }
    }
  }
}

module.exports = { setupDarkBackgroundMenu };
