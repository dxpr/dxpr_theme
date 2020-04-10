(function($, Drupal) {
  /* global jQuery:false */
  /* global Drupal:false */

  "use strict";

  /**
   * Provide vertical tab summaries for Bootstrap settings.
   */
  Drupal.behaviors.glazedAdmin = {
    attach(context) {
      const $context = $(context);
      let $toolbar = $("#toolbar, #navbar-bar, #admin-menu", context);
      if ($toolbar.length > 0 && Drupal.settings.glazed.glazedPath) {
        glazedButtonAdd($toolbar);
      }
      /**
       * Hook into Admin Menu Cached loading
       */
      if ("admin" in Drupal) {
        Drupal.admin.behaviors.glazedButton = function(
          context,
          settings,
          $adminMenu
        ) {
          $toolbar = $("#admin-menu", context);
          glazedButtonAdd($toolbar);
        };
      }

      function glazedButtonAdd($toolbar) {
        const themeName = Drupal.settings.glazedDefaultTheme || "glazed";
        const glazedLogoPath = `${Drupal.settings.basePath +
          Drupal.settings.glazed.glazedPath}/logo.svg`;
        const $glazedButton = $('<div id="glazed-button-wrapper">').html(
          $("<a>", {
            text: Drupal.t("Theme Settings"),
            title: "Theme Settings, Demo Import, and more",
            class: "glazed-button",
            href: `${Drupal.settings.basePath}admin/appearance/settings/${themeName}`
          }).prepend(
            $("<img>", {
              src: glazedLogoPath,
              width: 15
            })
          )
        );
        $(".toolbar-menu, #admin-menu-wrapper", $toolbar)
          .once("glazed_button")
          .append($glazedButton);
      }
    }
  };
})(jQuery, Drupal);
