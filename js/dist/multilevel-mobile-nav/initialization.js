/**
 * Initialization module for MLMenu.
 * Handles setting up menus, back button, breadcrumbs, and binding events.
 */

/**
 * Initializes the menu structure, back button, and breadcrumbs.
 * @param {Object} context - The MLMenu instance.
 */
function init(context) {
  context.menusArr = [];
  context.menus.forEach((menuEl, pos) => {
    const menu = { menuEl, menuItems: [].slice.call(menuEl.children) };
    context.menusArr.push(menu);

    // Set current menu class
    if (pos === context.current) {
      classie.add(menuEl, "menu__level--current");
    }
  });

  // Create back button
  if (context.options.backCtrl) {
    context.backCtrl = document.createElement("button");
    context.backCtrl.className = "menu__back menu__back--hidden";
    context.backCtrl.setAttribute("aria-label", "Go back");
    context.backCtrl.innerHTML = '<span class="icon icon--arrow-left"></span>';
    context.el.insertBefore(context.backCtrl, context.el.firstChild);
  }

  // Create breadcrumbs
  if (context.options.breadcrumbsCtrl) {
    context.breadcrumbsCtrl = document.createElement("nav");
    context.breadcrumbsCtrl.className = "menu__breadcrumbs";
    context.el.insertBefore(context.breadcrumbsCtrl, context.el.firstChild);
    // Add initial breadcrumb
    context._addBreadcrumb(0);
  }

  // Bind events
  initEvents(context);
}

/**
 * Binds events to menu items and back button.
 * @param {Object} context - The MLMenu instance.
 */
function initEvents(context) {
  context.menusArr.forEach((menu) => {
    menu.menuItems.forEach((item, pos) => {
      if (item.querySelector("a")) {
        item.querySelector("a").addEventListener("click", (ev) => {
          const submenu = ev.target.getAttribute("data-submenu");
          const itemName = ev.target.innerHTML;
          const subMenuEl = context.el.querySelector(
            `ul[data-menu="${submenu}"]`,
          );

          // Check if there's a submenu for this item
          if (submenu && subMenuEl) {
            ev.preventDefault();
            // Open it
            context._openSubMenu(subMenuEl, pos, itemName);
          } else {
            // Add class current
            const currentlink = context.el.querySelector(
              ".menu__link--current",
            );
            if (currentlink) {
              classie.remove(
                context.el.querySelector(".menu__link--current"),
                "menu__link--current",
              );
            }
            classie.add(ev.target, "menu__link--current");

            // Callback
            context.options.onItemClick(ev, itemName);
          }
        });
      }
    });
  });

  // Back navigation
  if (context.options.backCtrl) {
    context.backCtrl.addEventListener("click", () => {
      context._back();
    });
  }
}

module.exports = { init, initEvents };
