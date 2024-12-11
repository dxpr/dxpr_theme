/**
 * Module for adding breadcrumbs in MLMenu.
 */

/**
 * Adds a breadcrumb for the given menu index.
 * @param {Object} context - MLMenu instance.
 * @param {number} idx - Index of the menu.
 */
function addBreadcrumb(context, idx) {
  if (!context.options.breadcrumbsCtrl) {
    return false;
  }

  const bc = document.createElement("a");
  bc.innerHTML = idx
    ? context.menusArr[idx].name
    : context.options.initialBreadcrumb;
  context.breadcrumbsCtrl.appendChild(bc);

  bc.addEventListener("click", (ev) => {
    ev.preventDefault();

    // Do nothing if this breadcrumb is the last one in the list of breadcrumbs
    if (!bc.nextSibling || context.isAnimating) {
      return false;
    }
    context.isAnimating = true;

    // Current menu slides out
    context._menuOut();
    // Next menu slides in
    const nextMenu = context.menusArr[idx].menuEl;
    context._menuIn(nextMenu);

    // Remove breadcrumbs that are ahead
    let siblingNode = bc.nextSibling;
    while (siblingNode) {
      context.breadcrumbsCtrl.removeChild(siblingNode);
      siblingNode = bc.nextSibling;
    }

    context.isAnimating = false; // Reset animating flag
  });
}

module.exports = { addBreadcrumb };
