(function (Drupal, once) {
  // The elements of the latest attachment. The Escape listener is bound once
  // and reads them when the key is pressed, so that it also works after an
  // AJAX update has replaced the search form and button.
  let current = null;

  Drupal.behaviors.fullScreenSearch = {
    attach(context, settings) {
      const searchButton = document.querySelector(".full-screen-search-button");
      const searchForm = document.querySelector(".full-screen-search-form");
      const searchFormInput = searchForm.querySelector(".search-query");
      const searchStatus = document.querySelector("#search-status");

      // Move search form to body to escape parent stacking context
      // This ensures it appears above all other elements (sidebar, toolbar)
      if (searchForm && !searchForm.dataset.movedToBody) {
        document.body.appendChild(searchForm);
        searchForm.dataset.movedToBody = "true";
      }

      // Announce the state change to screen readers, in the page language.
      // The build shortens the Drupal parameter, and Drupal only collects
      // strings from literal Drupal.t() calls, hence window.Drupal.
      function announce(isVisible) {
        if (searchStatus) {
          searchStatus.textContent = isVisible
            ? window.Drupal.t("Search opened")
            : window.Drupal.t("Search closed");
        }
      }

      function clearSearchForm() {
        searchForm.classList.toggle("invisible");
        document.body.classList.toggle("body--full-screen-search");

        // Update ARIA states for accessibility
        const isVisible = !searchForm.classList.contains("invisible");
        searchButton.setAttribute("aria-expanded", isVisible.toString());
        searchForm.setAttribute("aria-hidden", (!isVisible).toString());
        announce(isVisible);

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
        announce(isVisible);

        searchFormInput.focus();
      }

      function handleSearchFormClick(ele) {
        // Taps on the input, the submit button and labels belong to the form.
        if (ele.target.closest("input, button, label, a")) {
          return;
        }
        clearSearchForm();
      }

      // Handle the search button click or touchstart
      if (searchButton && once("search-button", searchButton).length) {
        searchButton.addEventListener("touchstart", handleSearchButtonClick);
        searchButton.addEventListener("click", handleSearchButtonClick);
      }

      // Handle the search form click. A click covers touch screens too, and a
      // touchstart handler would hide the form before the click, so that the
      // tap fell through to the page behind it.
      if (searchForm && once("search-form", searchForm).length) {
        searchForm.addEventListener("click", handleSearchFormClick);
      }

      current = { searchForm, searchButton, clearSearchForm };

      // Handle the escape key to close the search form, once per page.
      if (once("search-escape", "html").length) {
        document.addEventListener("keydown", (event) => {
          if (
            event.key === "Escape" && // Check if Escape key is pressed
            current &&
            !current.searchForm.classList.contains("invisible") // Ensure the form is visible
          ) {
            current.clearSearchForm(); // Call the function to clear the form
            current.searchButton.focus(); // Return focus to the search button
          }
        });
      }
    },
  };
})(Drupal, once);
