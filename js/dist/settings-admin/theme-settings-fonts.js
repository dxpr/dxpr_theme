/**
 * @file
 * Handles the AI font generator in theme settings.
 */

const dxprThemeSettingsFonts = {
  fontSettings: drupalSettings.dxpr_themeSettings?.fonts ?? {},

  attach(context) {
    if (once("dxpr-font-init", "html", context).length) {
      this.init();
    }
  },

  init() {
    this.initAiFontGenerator();
  },

  // Initialize AI font generator.
  initAiFontGenerator() {
    const pt = this;
    const generateButton = document.getElementById("ai-font-generate");
    const promptField = document.getElementById("ai-font-prompt");

    if (!generateButton || !promptField) {
      return;
    }

    const submitPrompt = () => {
      const prompt = promptField.value.trim();

      if (!prompt) {
        pt.showAiError("Please enter a description.");
        return;
      }

      pt.generateAiFonts(prompt);
    };

    generateButton.addEventListener("click", (ev) => {
      ev.preventDefault();
      submitPrompt();
    });

    // Command/Ctrl+Enter to submit.
    promptField.addEventListener("keydown", (ev) => {
      if ((ev.metaKey || ev.ctrlKey) && ev.key === "Enter") {
        ev.preventDefault();
        submitPrompt();
      }
    });
  },

  // Generate fonts using AI.
  generateAiFonts(prompt) {
    const pt = this;
    const generateButton = document.getElementById("ai-font-generate");
    const originalText = generateButton.value;

    // Clear any previous error.
    this.hideAiError();

    // Show loading state.
    generateButton.disabled = true;
    generateButton.classList.add("is-loading");
    generateButton.value = "Generating...";

    // Add rainbow border to all font select fields during generation.
    const fontSelects = document.querySelectorAll(
      "#edit-fonts .form-item-body-font-face .form-select, " +
        "#edit-fonts .form-item-headings-font-face .form-select, " +
        "#edit-fonts .form-item-nav-font-face .form-select, " +
        "#edit-fonts .form-item-sitename-font-face .form-select, " +
        "#edit-fonts .form-item-blockquote-font-face .form-select",
    );
    fontSelects.forEach((field) => field.classList.add("dxt-admin-ai-updated"));

    fetch(`${drupalSettings.path.baseUrl}admin/dxpr-theme/generate-fonts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest",
      },
      credentials: "same-origin",
      body: `prompt=${encodeURIComponent(prompt)}`,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          pt.showAiError(data.error);
        } else if (data.fonts) {
          pt.applyAiFonts(data.fonts);
          // Brief success flash on button.
          generateButton.classList.add("is-success");
          setTimeout(() => generateButton.classList.remove("is-success"), 1500);
        }
      })
      .catch((error) => {
        pt.showAiError("Request failed. Please try again.");
        // eslint-disable-next-line no-console
        console.error("AI font error:", error);
      })
      .finally(() => {
        generateButton.disabled = false;
        generateButton.classList.remove("is-loading");
        generateButton.value = originalText;

        // Remove rainbow border from all font select fields after generation.
        fontSelects.forEach((field) =>
          field.classList.remove("dxt-admin-ai-updated"),
        );
      });
  },

  // Apply AI-generated fonts to form fields.
  applyAiFonts(fonts) {
    const fontFieldMap = {
      body_font_face: "edit-body-font-face",
      headings_font_face: "edit-headings-font-face",
      nav_font_face: "edit-nav-font-face",
      sitename_font_face: "edit-sitename-font-face",
      blockquote_font_face: "edit-blockquote-font-face",
    };

    Object.keys(fonts).forEach((key) => {
      const selectId = fontFieldMap[key];
      if (!selectId) return;

      const selectField = document.getElementById(selectId);
      if (selectField) {
        const fontValue = fonts[key];

        // Check if the option exists.
        const optionExists = Array.from(selectField.options).some(
          (option) => option.value === fontValue,
        );

        if (optionExists) {
          selectField.value = fontValue;

          // Trigger change event to update any listeners.
          selectField.dispatchEvent(new Event("change", { bubbles: true }));
        } else {
          // eslint-disable-next-line no-console
          console.warn(`Font option not found: ${fontValue} for ${key}`);
        }
      }
    });
  },

  // Show error message below prompt.
  showAiError(message) {
    const errorDiv = document.getElementById("ai-font-error");
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = "block";
    }
  },

  // Hide error message.
  hideAiError() {
    const errorDiv = document.getElementById("ai-font-error");
    if (errorDiv) {
      errorDiv.textContent = "";
      errorDiv.style.display = "none";
    }
  },
};

module.exports = { dxprThemeSettingsFonts };
