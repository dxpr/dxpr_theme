/**
 * Main.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2015, Codrops
 * http://www.codrops.com
 */

const { extend } = require("./helpers");
const { onEndAnimation } = require("./animations");
const { init, initEvents } = require("./initialization");
const { addBreadcrumb } = require("./add-breadcrumb");

(function (window) {
  "use strict";

  function MLMenu(el, options) {
    this.el = el;
    this.options = extend({}, this.options);
    extend(this.options, options);

    // The menus (<ul>´s)
    this.menus = [].slice.call(this.el.querySelectorAll(".menu__level"));
    // Index of current menu
    this.current = 0;

    this._init();
  }

  MLMenu.prototype.options = {
    // Show breadcrumbs
    breadcrumbsCtrl: true,
    // Initial breadcrumb text
    initialBreadcrumb: "all",
    // Show back button
    backCtrl: true,
    // Delay between each menu item sliding animation
    itemsDelayInterval: 60,
    // Direction
    direction: "r2l",
    // Callback: item that does not have a sub menu gets clicked
    // onItemClick([event], [inner HTML of the clicked item])
    onItemClick(ev, itemName) {
      return false;
    },
  };

  MLMenu.prototype._init = function () {
    init(this);
  };

  MLMenu.prototype._initEvents = function () {
    initEvents(this);
  };

  MLMenu.prototype._openSubMenu = function (
    subMenuEl,
    clickPosition,
    subMenuName,
  ) {
    if (this.isAnimating) {
      return false;
    }
    this.isAnimating = true;

    // Save "parent" menu index for back navigation
    this.menusArr[this.menus.indexOf(subMenuEl)].backIdx = this.current;
    // Save "parent" menu´s name
    this.menusArr[this.menus.indexOf(subMenuEl)].name = subMenuName;
    // Current menu slides out
    this._menuOut(clickPosition);
    // Next menu (sub menu) slides in
    this._menuIn(subMenuEl, clickPosition);
  };

  MLMenu.prototype._back = function () {
    if (this.isAnimating) {
      return false;
    }
    this.isAnimating = true;

    // Current menu slides out
    this._menuOut();
    // Next menu (previous menu) slides in
    const backMenu = this.menusArr[this.menusArr[this.current].backIdx].menuEl;
    this._menuIn(backMenu);

    // Remove last breadcrumb
    if (this.options.breadcrumbsCtrl) {
      this.breadcrumbsCtrl.removeChild(this.breadcrumbsCtrl.lastElementChild);
    }
  };

  MLMenu.prototype._menuOut = function (clickPosition) {
    // The current menu
    const self = this;
    const currentMenu = this.menusArr[this.current].menuEl;
    const isBackNavigation = typeof clickPosition == "undefined";

    // Slide out current menu items - first, set the delays for the items
    this.menusArr[this.current].menuItems.forEach((item, pos) => {
      const delayValue = isBackNavigation
        ? `${parseInt(pos * self.options.itemsDelayInterval, 10)}ms`
        : `${parseInt(
            Math.abs(clickPosition - pos) * self.options.itemsDelayInterval,
            10,
          )}ms`;
      item.style.WebkitAnimationDelay = delayValue;
      item.style.animationDelay = delayValue;
    });
    // Animation class
    if (this.options.direction === "r2l") {
      classie.add(
        currentMenu,
        !isBackNavigation ? "animate-outToLeft" : "animate-outToRight",
      );
    } else {
      classie.add(
        currentMenu,
        isBackNavigation ? "animate-outToLeft" : "animate-outToRight",
      );
    }
  };

  MLMenu.prototype._menuIn = function (nextMenuEl, clickPosition) {
    const self = this;
    // The current menu
    const currentMenu = this.menusArr[this.current].menuEl;
    const isBackNavigation = typeof clickPosition == "undefined";
    // Index of the nextMenuEl
    const nextMenuIdx = this.menus.indexOf(nextMenuEl);

    const nextMenuItems = this.menusArr[nextMenuIdx].menuItems;
    const nextMenuItemsTotal = nextMenuItems.length;

    // Slide in next menu items - first, set the delays for the items
    nextMenuItems.forEach((item, pos) => {
      const delayValue = isBackNavigation
        ? `${parseInt(pos * self.options.itemsDelayInterval, 10)}ms`
        : `${parseInt(
            Math.abs(clickPosition - pos) * self.options.itemsDelayInterval,
            10,
          )}ms`;
      item.style.WebkitAnimationDelay = delayValue;
      item.style.animationDelay = delayValue;

      // We need to reset the classes once the last item animates in
      // the "last item" is the farthest from the clicked item
      // let's calculate the index of the farthest item
      const farthestIdx =
        clickPosition <= nextMenuItemsTotal / 2 || isBackNavigation
          ? nextMenuItemsTotal - 1
          : 0;

      if (pos === farthestIdx) {
        onEndAnimation(item, () => {
          // Reset classes
          if (self.options.direction === "r2l") {
            classie.remove(
              currentMenu,
              !isBackNavigation ? "animate-outToLeft" : "animate-outToRight",
            );
            classie.remove(
              nextMenuEl,
              !isBackNavigation ? "animate-inFromRight" : "animate-inFromLeft",
            );
          } else {
            classie.remove(
              currentMenu,
              isBackNavigation ? "animate-outToLeft" : "animate-outToRight",
            );
            classie.remove(
              nextMenuEl,
              isBackNavigation ? "animate-inFromRight" : "animate-inFromLeft",
            );
          }
          classie.remove(currentMenu, "menu__level--current");
          classie.add(nextMenuEl, "menu__level--current");

          // Reset current
          self.current = nextMenuIdx;

          // Control back button and breadcrumbs navigation elements
          if (!isBackNavigation) {
            // Show back button
            if (self.options.backCtrl) {
              classie.remove(self.backCtrl, "menu__back--hidden");
            }

            // Add breadcrumb
            self._addBreadcrumb(nextMenuIdx);
          } else if (self.current === 0 && self.options.backCtrl) {
            // Hide back button
            classie.add(self.backCtrl, "menu__back--hidden");
          }

          // We can navigate again..
          self.isAnimating = false;
        });
      }
    });

    // Animation class
    if (this.options.direction === "r2l") {
      classie.add(
        nextMenuEl,
        !isBackNavigation ? "animate-inFromRight" : "animate-inFromLeft",
      );
    } else {
      classie.add(
        nextMenuEl,
        isBackNavigation ? "animate-inFromRight" : "animate-inFromLeft",
      );
    }
  };

  MLMenu.prototype._addBreadcrumb = function (idx) {
    addBreadcrumb(this, idx);
  };

  window.MLMenu = MLMenu;
})(window);
