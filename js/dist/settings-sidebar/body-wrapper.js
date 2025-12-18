/**
 * @file
 * Body wrapper functionality for theme settings sidebar.
 */

function createBodyWrapper() {
  const { body } = document;
  const wrapper = document.createElement("div");
  wrapper.className = "dxpr-body-wrapper";

  // Move all body children to wrapper
  while (body.firstChild) {
    wrapper.appendChild(body.firstChild);
  }
  body.appendChild(wrapper);

  // Set displacement API variable for right offset to match sidebar width
  document.documentElement.style.setProperty(
    "--drupal-displace-offset-right",
    "40vw",
  );
}

module.exports = { createBodyWrapper };
