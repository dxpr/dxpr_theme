/**
 * @file
 * Main coordinator for theme settings sidebar functionality.
 */

const { createBodyWrapper } = require("./body-wrapper");
const { initSearchFunctionality } = require("./search-functionality");
const { loadStyleguide } = require("./styleguide-loader");

(function (Drupal, once) {
  "use strict";

  Drupal.behaviors.dxprThemeSettingsSidebar = {
    attach(context, settings) {
      // Only run once per page
      once("dxpr-theme-settings-sidebar", "html", context).forEach(
        (element) => {
          this.init(element, settings);
        },
      );
    },

    init(element, settings) {
      // Create body wrapper and load style guide
      createBodyWrapper();
      initSearchFunctionality();
      loadStyleguide();
    },
  };
})(Drupal, once);
