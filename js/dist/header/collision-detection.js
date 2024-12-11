/**
 * Accepts 2 getBoundingClientRect objects.
 * Checks if two rectangles intersect.
 * @param {DOMRect} rect1 - The first rectangle.
 * @param {DOMRect} rect2 - The second rectangle.
 * @returns {boolean} - True if the rectangles intersect, otherwise false.
 */
function dxprThemeCollisionCheck(rect1, rect2) {
  return !(
    rect1.right < rect2.left ||
    rect1.left > rect2.right ||
    rect1.bottom < rect2.top ||
    rect1.top > rect2.bottom
  );
}

module.exports = { dxprThemeCollisionCheck };
