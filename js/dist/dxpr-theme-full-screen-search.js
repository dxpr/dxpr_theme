/**
 * @file
 * A JavaScript file that styles the page with bootstrap classes.
 *
 * @see sass/styles.scss for more info
 */
(function($, Drupal, window, document, undefined) {
  Drupal.behaviors.fullScreenSearch = {
    attach(context, settings) {
      function clearSearchForm() {
        $searchForm.toggleClass("element-invisible"),
          $("body").toggleClass("body--full-screen-search"),
          setTimeout(() => {
            $searchFormInput.val("");
          }, 350);
      }
      const $searchButton = $(".full-screen-search-button");
      var $searchForm = $(".full-screen-search-form");
      var $searchFormInput = $searchForm.find(".search-query");
      const escapeCode = 27;
      $searchButton.on("touchstart click", event => {
        event.preventDefault(),
          $searchForm.toggleClass("element-invisible"),
          $("body").toggleClass("body--full-screen-search"),
          $searchFormInput.focus();
      }),
        $searchForm.on("touchstart click", $searchButton => {
          $($searchButton.target).hasClass("search-query") || clearSearchForm();
        }),
        $(document).keydown(event => {
          event.which === escapeCode &&
            !$searchForm.hasClass("element-invisible") &&
            clearSearchForm();
        });
    }
  };
})(jQuery, Drupal, this, this.document);
