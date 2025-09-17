(function (Drupal, once) {
  Drupal.behaviors.fullScreenSearch = {
    attach(context, settings) {
      const searchButton = document.querySelector(".full-screen-search-button");
      const searchForm = document.querySelector(".full-screen-search-form");
      const searchFormInput = searchForm.querySelector(".search-query");
      const searchStatus = document.querySelector("#search-status");

      function clearSearchForm() {
        searchForm.classList.toggle("invisible");
        document.body.classList.toggle("body--full-screen-search");

        // Update ARIA states for accessibility
        const isVisible = !searchForm.classList.contains("invisible");
        searchButton.setAttribute("aria-expanded", isVisible.toString());
        searchForm.setAttribute("aria-hidden", (!isVisible).toString());

        // Announce state change to screen readers
        if (searchStatus) {
          searchStatus.textContent = isVisible
            ? "Search opened"
            : "Search closed";
        }

        setTimeout(() => {
          searchFormInput.value = "";
        }, 350);
      }

      function handleSearchButtonClick(event) {
        event.preventDefault();
        searchForm.classList.toggle("invisible");
        document.body.classList.toggle("body--full-screen-search");

        // Update ARIA states for accessibility
        const isVisible = !searchForm.classList.contains("invisible");
        searchButton.setAttribute("aria-expanded", isVisible.toString());
        searchForm.setAttribute("aria-hidden", (!isVisible).toString());

        // Announce state change to screen readers
        if (searchStatus) {
          searchStatus.textContent = isVisible
            ? "Search opened"
            : "Search closed";
        }

        searchFormInput.focus();
      }

      function handleSearchFormClick(ele) {
        if (!ele.target.classList.contains("search-query")) {
          clearSearchForm();
        }
      }

      // Handle the search button click or touchstart
      if (searchButton && once("search-button", searchButton).length) {
        searchButton.addEventListener("touchstart", handleSearchButtonClick);
        searchButton.addEventListener("click", handleSearchButtonClick);
      }

      // Handle the search form click or touchstart
      if (searchForm && once("search-form", searchForm).length) {
        searchForm.addEventListener("touchstart", handleSearchFormClick);
        searchForm.addEventListener("click", handleSearchFormClick);
      }

      // Handle the escape key to close the search form
      document.addEventListener("keydown", (event) => {
        if (
          event.key === "Escape" && // Check if Escape key is pressed
          !searchForm.classList.contains("invisible") // Ensure the form is visible
        ) {
          clearSearchForm(); // Call the function to clear the form
          searchButton.focus(); // Return focus to the search button
        }
      });
    },
  };
})(Drupal, once);
