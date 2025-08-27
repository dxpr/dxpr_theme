/**
 * @file
 * Main coordinator for theme settings sidebar functionality.
 */

const { createBodyWrapper } = require("./body-wrapper");
const { initSearchFunctionality } = require("./search-functionality");
const { loadStyleguide } = require("./styleguide-loader");

(function (Drupal, once) {
  'use strict';

  Drupal.behaviors.dxprThemeSettingsSidebar = {
    attach: function (context, settings) {
      // Only run once per page
      once('dxpr-theme-settings-sidebar', 'html', context).forEach(function (element) {
        this.init(element, settings);
      }.bind(this));
    },

    init: function (element, settings) {
      // Create body wrapper and load styleguide
      createBodyWrapper();
      initSearchFunctionality();
      loadStyleguide();
    }
  };
})(Drupal, once);
