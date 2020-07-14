/**
 * @file
 * A JavaScript file that styles the page with bootstrap classes.
 *
 * @see sass/styles.scss for more info
 */
(function($, Drupal, window, document, undefined) {
  Drupal.behaviors.dxpr_theme_breadcrumbs = {
    attach(context, settings) {
      // Breadcrumbs
      $(document).ready(() => {
        if (Drupal.settings.dxpr_theme.breadcrumbsSeparator) {
          const { breadcrumbsSeparator } = Drupal.settings.dxpr_theme;
          $(".breadcrumb a", context)
            .once("dxpr_theme")
            .after(
              ` <span class="dxpr-theme-breadcrumb-spacer">${breadcrumbsSeparator}</span> `
            );
        } else {
          $(".breadcrumb a", context)
            .once("dxpr_theme")
            .after(' <span class="dxpr-theme-breadcrumb-spacer">/</span> ');
        }
      });
    }
  };
})(jQuery, Drupal, this, this.document);
