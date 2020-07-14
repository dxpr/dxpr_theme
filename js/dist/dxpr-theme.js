/**
 * @file
 * A JavaScript file that styles the page with bootstrap classes.
 *
 * @see sass/styles.scss for more info
 */
(function($, Drupal, window, document, undefined) {
  Drupal.behaviors.dxpr_theme = {
    attach(context, settings) {

      // Main content layout
      $(".dxpr-theme-util-content-center-4-col .main-container", context)
        .find("> .row > .col-sm-12")
        .once("dxpr_theme")
        .removeClass("col-sm-12")
        .addClass("col-sm-4 col-md-offset-4");

      $(".dxpr-theme-util-content-center-6-col .main-container", context)
        .find("> .row > .col-sm-12")
        .once("dxpr_theme")
        .removeClass("col-sm-12")
        .addClass("col-sm-6 col-md-offset-3");

      $(".dxpr-theme-util-content-center-8-col .main-container", context)
        .find("> .row > .col-sm-12")
        .once("dxpr_theme")
        .removeClass("col-sm-12")
        .addClass("col-sm-8 col-md-offset-2");

      $(".dxpr-theme-util-content-center-10-col .main-container", context)
        .find("> .row > .col-sm-12")
        .once("dxpr_theme")
        .removeClass("col-sm-12")
        .addClass("col-sm-8 col-md-offset-1");

      // Sidebar nav blocks
      $(
        ".region-sidebar-first .block .view ul, .region-sidebar-second .block .view ul",
        context
      )
        .once("dxpr_theme")
        .addClass("nav");
    }
  };
})(jQuery, Drupal, this, this.document);
