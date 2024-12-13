/**
 * @file
 * This script dynamically adjusts the text color of dropdown menu items
 * based on the darkness of their background color.
 *
 * It calculates the luminance of the background color using the WCAG formula
 * to determine whether the background is too dark for readable text.
 * If the background is dark, it updates the text color of relevant elements
 * to a lighter shade (#b0b0b0) for better visibility and accessibility.
 *
 * Key features:
 * - Calculates the luminance of an RGB color using a standard accessibility formula.
 * - Targets specific menu elements:
 *   - `#navbar.dxpr-theme-header--top .dropdown`
 *   - `#navbar.dxpr-theme-header--top .dropdown-menu a`
 * - Dynamically updates text color only when the background is detected as dark.
 *
 * This ensures the menu remains accessible and visually appealing across
 * various themes and background configurations.
 */

function setupDarkBackgroundMenu() {
  const dropdownMenu = document.querySelector(
    "#navbar.dxpr-theme-header--top .dropdown-menu",
  );

  // Function to calculate luminance of a color
  function getLuminance(rgbColor) {
    const [r, g, b] = rgbColor
      .replace(/[^\d,]/g, "")
      .split(",")
      .map((value) => {
        const num = parseInt(value, 10) / 255;
        return num <= 0.03928 ? num / 12.92 : ((num + 0.055) / 1.055) ** 2.4;
      });

    // WCAG luminance formula
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  if (dropdownMenu) {
    const style = window.getComputedStyle(dropdownMenu);
    const { backgroundColor } = style;

    if (backgroundColor.startsWith("rgb")) {
      const luminance = getLuminance(backgroundColor);

      // Check if background is dark
      if (luminance < 0.2) {
        const elementsToUpdate = document.querySelectorAll(
          "#navbar.dxpr-theme-header--top .dropdown, #navbar.dxpr-theme-header--top .dropdown-menu a",
        );

        elementsToUpdate.forEach((element) => {
          // Set light text color for dark backgrounds
          element.style.color = "#b0b0b0";
        });
      }
    }
  }
}

module.exports = { setupDarkBackgroundMenu };
