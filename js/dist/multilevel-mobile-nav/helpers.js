/**
 * Helper functions for common operations.
 *
 * This module provides utility functions that can be reused across
 * multiple parts of the application.
 */

/**
 * Merges the properties of object `b` into object `a`.
 * Only properties that exist in `b` and are not inherited will be copied.
 *
 * @param {Object} a - The target object to which properties are added.
 * @param {Object} b - The source object from which properties are copied.
 * @returns {Object} - The updated target object `a`.
 */
function extend(a, b) {
  Object.keys(b).forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(b, key)) {
      a[key] = b[key];
    }
  });
  return a;
}

module.exports = { extend };
