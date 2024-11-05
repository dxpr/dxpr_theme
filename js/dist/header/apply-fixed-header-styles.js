/**
 * Applies styles to make the header fixed on mobile and tablet devices.
 * @param {number} headerMobileHeight - The height of the header on mobile.
 */
function applyFixedHeaderStyles(headerMobileHeight) {
  const navbarElement = document.querySelector("#navbar");

  if (document.querySelectorAll("#toolbar-bar").length > 0) {
    navbarElement.classList.add("header-mobile-admin-fixed");
  }

  // Toggle active class based on screen width
  if (window.innerWidth >= 975) {
    navbarElement.classList.add("header-mobile-admin-fixed-active");
  } else {
    navbarElement.classList.remove("header-mobile-admin-fixed-active");
  }

  // Set overflow for the boxed container and apply fixed classes
  document.querySelector(".dxpr-theme-boxed-container").style.overflow = "hidden";
  document.querySelector("#toolbar-bar").classList.add("header-mobile-fixed");
  navbarElement.classList.add("header-mobile-fixed");

  // Adjust margin for the secondary header if it exists
  const secondaryHeaderEle = document.querySelector("#secondary-header");
  if (secondaryHeaderEle) {
    secondaryHeaderEle.style.marginTop = `${headerMobileHeight}px`;
  }
}

module.exports = { applyFixedHeaderStyles };
