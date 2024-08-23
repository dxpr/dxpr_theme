(function (Drupal, once) {
  Drupal.behaviors.fullScreenSearch = {
    attach(context, settings) {
      const searchButton = document.querySelector(".full-screen-search-button");
      const searchForm = document.querySelector(".full-screen-search-form");
      const searchFormInput = searchForm.querySelector(".search-query");
      const escapeCode = 27;

      function clearSearchForm() {
        searchForm.classList.toggle("invisible");
        document.body.classList.toggle("body--full-screen-search");
        setTimeout(() => {
          searchFormInput.value = "";
        }, 350);
      }

      // Handle the search button click or touchstart
      if (searchButton && once("search-button", searchButton).length) {
        searchButton.addEventListener("touchstart", handleSearchButtonClick);
        searchButton.addEventListener("click", handleSearchButtonClick);
      }

      function handleSearchButtonClick(event) {
        event.preventDefault();
        searchForm.classList.toggle("invisible");
        document.body.classList.toggle("body--full-screen-search");
        searchFormInput.focus();
      }

      // Handle the search form click or touchstart
      if (searchForm && once("search-form", searchForm).length) {
        searchForm.addEventListener("touchstart", handleSearchFormClick);
        searchForm.addEventListener("click", handleSearchFormClick);
      }

      function handleSearchFormClick(ele) {
        if (!ele.target.classList.contains("search-query")) {
          clearSearchForm();
        }
      }

      // Handle the escape key to close the search form
      document.addEventListener("keydown", (event) => {
        if (event.keyCode === escapeCode && !searchForm.classList.contains("invisible")) {
          clearSearchForm();
        }
      });
    },
  };
})(Drupal, once);
