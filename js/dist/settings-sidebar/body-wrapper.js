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
}

module.exports = { createBodyWrapper };
