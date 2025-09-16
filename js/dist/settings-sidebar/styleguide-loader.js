/**
 * @file
 * Style guide loading functionality for theme settings sidebar.
 */

const { initializeSidebarNavigation } = require("./sidebar-navigation");

function loadStyleguide() {
  requestAnimationFrame(() => {
    const contentRegion = document.querySelector(".region-content");
    if (contentRegion) {
      const styleguideDiv = document.createElement("div");
      styleguideDiv.innerHTML = "<p>Loading...</p>";
      contentRegion.insertBefore(styleguideDiv, contentRegion.firstChild);

      // Get style guide URL from Drupal settings or construct it
      const styleguideUrl =
        drupalSettings.dxpr_theme && drupalSettings.dxpr_theme.styleguide_url
          ? drupalSettings.dxpr_theme.styleguide_url
          : `${
              window.location.origin +
              window.location.pathname.replace("/admin/appearance/settings", "")
            }/themes/custom/dxpr_theme/resources/styleguide.html`;

      // Add cache-busting to ensure admins always see the latest HTML
      const cacheBustedUrl = `${styleguideUrl}?v=${Date.now()}`;
      fetch(cacheBustedUrl, { cache: "no-store" })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return response.text();
        })
        .then((html) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          const cheatsheet = doc.querySelector(".bd-cheatsheet");

          if (cheatsheet) {
            styleguideDiv.innerHTML = cheatsheet.outerHTML;

            // Initialize sidebar navigation after styleguide is loaded
            initializeSidebarNavigation();

            // After styleguide is loaded, initialize block preview
            setTimeout(() => {
              const blockCardField = document.getElementById("edit-block-card");
              const titleCardField = document.getElementById("edit-title-card");

              if (blockCardField) {
                blockCardField.dispatchEvent(
                  new Event("change", {
                    bubbles: true,
                    cancelable: true,
                  }),
                );
              }

              if (titleCardField) {
                titleCardField.dispatchEvent(
                  new Event("change", {
                    bubbles: true,
                    cancelable: true,
                  }),
                );
              }

              // Also check if block divider is enabled
              const blockDivider =
                document.getElementById("edit-block-divider");
              if (blockDivider && blockDivider.checked) {
                blockDivider.dispatchEvent(
                  new Event("change", {
                    bubbles: true,
                    cancelable: true,
                  }),
                );
              }

              // Check title sticker setting
              const titleSticker =
                document.getElementById("edit-title-sticker");
              if (titleSticker && titleSticker.checked) {
                titleSticker.dispatchEvent(
                  new Event("change", {
                    bubbles: true,
                    cancelable: true,
                  }),
                );
              }
            }, 100);
          } else {
            // User-facing fallback when .bd-cheatsheet element is not found
            styleguideDiv.innerHTML =
              '<div class="alert alert-warning"><p><strong>Notice:</strong> Styleguide content structure has changed. The expected content section (.bd-cheatsheet) was not found in the loaded HTML.</p><p>This may indicate a change in the styleguide format or a configuration issue.</p></div>';
          }
        })
        .catch((error) => {
          // User-facing fallback with specific error information
          const errorMessage = error.message || "Unknown error occurred";
          styleguideDiv.innerHTML = `<h2>Bootstrap Style Guide</h2><div class="alert alert-danger"><p><strong>Error:</strong> Failed to load style guide content.</p><p><strong>Details:</strong> ${
            errorMessage
          }</p><p>Please check your network connection and ensure the style guide file is accessible.</p></div>`;
        });
    }
  });
}

module.exports = { loadStyleguide };
