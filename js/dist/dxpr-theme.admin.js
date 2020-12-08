(function($, Drupal) {
  /* global jQuery:false */
  /* global Drupal:false */

  "use strict";

  /**
   * Provide vertical tab summaries for Bootstrap settings.
   */
  Drupal.behaviors.dxpr_themeAdmin = {
    attach(context) {
      const $context = $(context);
      let $toolbar = $("#toolbar, #navbar-bar, #admin-menu", context);
      if ($toolbar.length > 0 && Drupal.settings.dxpr_theme.dxpr_themePath) {
        dxpr_themeButtonAdd($toolbar);
      }
      /**
       * Hook into Admin Menu Cached loading
       */
      if ("admin" in Drupal) {
        Drupal.admin.behaviors.dxpr_themeButton = function(
          context,
          settings,
          $adminMenu
        ) {
          $toolbar = $("#admin-menu", context);
          dxpr_themeButtonAdd($toolbar);
        };
      }

      function dxpr_themeButtonAdd($toolbar) {
        const themeName = Drupal.settings.dxpr_themeDefaultTheme || "dxpr_theme";
        const dxpr_themeLogoPath = `${Drupal.settings.basePath +
          Drupal.settings.dxpr_theme.dxpr_themePath}/dxpr-logo-white.svg`;
        const $dxpr_themeButton = $('<div id="dxpr-theme-button-wrapper">').html(
          $("<a>", {
            text: Drupal.t("Theme Settings"),
            title: "Theme Settings, Demo Import, and more",
            class: "dxpr-theme-button",
            href: `${Drupal.settings.basePath}admin/appearance/settings/${themeName}`
          }).prepend(
            $("<img>", {
              src: dxpr_themeLogoPath,
              width: 25
            })
          )
        );
        $(".toolbar-menu, #admin-menu-wrapper", $toolbar)
          .once("dxpr_theme_button")
          .append($dxpr_themeButton);
      }
    }
  };
})(jQuery, Drupal);
