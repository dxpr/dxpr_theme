/**
 * @file
 * A JavaScript file that modifies the page with bootstrap classes.
 *
 * @see sass/styles.scss for more info
 */
(function($, Drupal, window, document, undefined) {
  Drupal.behaviors.dxpr_theme = {
    attach(context, settings) {
      // Messages, position absolutely when overlay header and no page title
      if (
        $(".wrap-messages").length > 0 &&
        $(".dxpr-theme-header--overlay").length > 0 &&
        $("#page-title").length == 0
      )
        $(".wrap-messages", context).css({
          position: "absolute",
          "z-index": "9999",
          right: "0"
        });
    }
  };
})(jQuery, Drupal, this, this.document);
