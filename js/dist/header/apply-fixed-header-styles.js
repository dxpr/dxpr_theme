/**
 * Applies header corrections on mobile and tablet devices.
 * @param {number} headerMobileHeight - The height of the header on mobile.
 */
function applyFixedHeaderStyles(headerMobileHeight) {
  // Adjust margin for the secondary header if it exists
  const secondaryHeaderEle = document.querySelector("#secondary-header");
  if (secondaryHeaderEle) {
    secondaryHeaderEle.style.marginTop = `${headerMobileHeight}px`;
  }
}

module.exports = { applyFixedHeaderStyles };
