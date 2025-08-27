/**
 * @file
 * Body wrapper functionality for theme settings sidebar.
 */

function createBodyWrapper() {
  var body = document.body;
  var wrapper = document.createElement('div');
  wrapper.className = 'dxpr-body-wrapper';

  // Move all body children to wrapper
  while (body.firstChild) {
    wrapper.appendChild(body.firstChild);
  }
  body.appendChild(wrapper);
}

module.exports = { createBodyWrapper };
