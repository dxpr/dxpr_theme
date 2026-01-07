/**
 * @file
 * Handles the 'Colors' theme settings page.
 */

const cssVarColorsPrefix = "--dxt-color-";

const dxprThemeSettingsColors = {
  elColorPalette: document.querySelector("#color-palette"),
  elSchemeSelect: document.getElementById("edit-color-scheme"),
  colorSettings: drupalSettings.dxpr_themeSettings.colors ?? [],

  attach(context) {
    if (once("dxpr-color-init", "html", context).length) {
      this.init();
    }
  },

  init() {
    const pt = this;
    const colorPalette = this.elColorPalette;

    // Create Color picker.
    const colorWheel = new ReinventedColorWheel({
      appendTo: document.getElementById("color-picker-placeholder"),
      hex: colorPalette.querySelector(".form-text").value,
      wheelDiameter: 190,
      wheelReflectsSaturation: false,
      onChange(color) {
        const activeField = colorPalette.querySelector(".form-text.active");
        if (activeField) {
          pt.updateColorField(activeField, color.hex);
        }
      },
    });
    colorWheel.onChange(colorWheel);

    // Handler for color fields.
    if (colorPalette) {
      const colorFields = colorPalette.querySelectorAll(".form-text");

      const colorFieldHandler = {
        init(ev) {
          if (ev.key === "Backspace" || ev.keyCode === 8) {
            return;
          }
          pt.setActiveField(ev.target);
          colorWheel.hex = ev.target.value;
        },
      };

      colorFields.forEach((el) => {
        el.addEventListener(
          "focus",
          colorFieldHandler.init.bind(colorFieldHandler),
        );
        el.addEventListener(
          "change",
          colorFieldHandler.init.bind(colorFieldHandler),
        );
        el.addEventListener(
          "keyup",
          colorFieldHandler.init.bind(colorFieldHandler),
        );
      });
    }

    // Handle color select.
    this.elSchemeSelect.addEventListener("change", (ev) => {
      let selectedScheme = ev.target.value;
      pt.populateColorFields(selectedScheme);
      pt.setActiveField(null);

      if (selectedScheme === "current") {
        selectedScheme = "custom";
      }

      ev.target.value = selectedScheme;
    });

    // Handle AI palette generation.
    this.initAiPaletteGenerator();

    this.populateColorFields("current");
  },

  // Initialize AI palette generator.
  initAiPaletteGenerator() {
    const pt = this;
    const generateButton = document.getElementById("ai-palette-generate");
    const promptField = document.getElementById("ai-palette-prompt");

    if (!generateButton || !promptField) {
      return;
    }

    const submitPrompt = () => {
      const prompt = promptField.value.trim();

      if (!prompt) {
        pt.showAiError("Please enter a description.");
        return;
      }

      pt.generateAiPalette(prompt);
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

  // Generate palette using AI.
  generateAiPalette(prompt) {
    const pt = this;
    const generateButton = document.getElementById("ai-palette-generate");
    const originalText = generateButton.value;

    // Clear any previous error.
    this.hideAiError();

    // Show loading state.
    generateButton.disabled = true;
    generateButton.classList.add("is-loading");
    generateButton.value = "Generating...";

    // Add rainbow border to all color fields during generation.
    const colorFields = this.elColorPalette.querySelectorAll(".form-text");
    colorFields.forEach((field) => field.classList.add("dxt-admin-ai-updated"));

    fetch(`${drupalSettings.path.baseUrl}admin/dxpr-theme/generate-palette`, {
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
        } else if (data.colors) {
          pt.applyAiPalette(data.colors);
          // Brief success flash on button.
          generateButton.classList.add("is-success");
          setTimeout(() => generateButton.classList.remove("is-success"), 1500);
        }
      })
      .catch((error) => {
        pt.showAiError("Request failed. Please try again.");
        // eslint-disable-next-line no-console
        console.error("AI palette error:", error);
      })
      .finally(() => {
        generateButton.disabled = false;
        generateButton.classList.remove("is-loading");
        generateButton.value = originalText;

        // Remove rainbow border from all color fields after generation.
        colorFields.forEach((field) =>
          field.classList.remove("dxt-admin-ai-updated"),
        );
      });
  },

  // Apply AI-generated palette to form fields.
  applyAiPalette(colors) {
    Object.keys(colors).forEach((key) => {
      const colorField = document.getElementById(`edit-color-palette-${key}`);
      if (colorField) {
        this.updateColorField(colorField, colors[key], true);
      }
    });

    // Set scheme to custom.
    this.elSchemeSelect.value = "custom";

    // Update live preview.
    this.setDocumentPalette(colors);
  },

  // Show error message below prompt.
  showAiError(message) {
    const errorDiv = document.getElementById("ai-palette-error");
    if (errorDiv) {
      errorDiv.textContent = message;
      errorDiv.style.display = "block";
    }
  },

  // Hide error message.
  hideAiError() {
    const errorDiv = document.getElementById("ai-palette-error");
    if (errorDiv) {
      errorDiv.textContent = "";
      errorDiv.style.display = "none";
    }
  },

  // Set field as active.
  setActiveField(el) {
    const colorFields = this.elColorPalette.querySelectorAll(".form-text");
    colorFields.forEach((field) => field.classList.remove("active"));
    if (el) {
      el.classList.add("active");
    }
  },

  // Populate color fields with selected palette.
  populateColorFields(selectedScheme) {
    if (selectedScheme === "custom" || !this.colorSettings) {
      return;
    }

    const schemePalette =
      selectedScheme === "current"
        ? this.colorSettings.palette
        : this.colorSettings.schemes[selectedScheme]?.colors;

    if (schemePalette) {
      Object.keys(schemePalette).forEach((key) => {
        const hexColor = schemePalette[key];
        const colorField = document.getElementById(`edit-color-palette-${key}`);
        this.updateColorField(colorField, hexColor, true);
      });
      this.setDocumentPalette(schemePalette);
    }
  },

  // Update Color input field.
  updateColorField(elField, hexColor, setOriginal) {
    if (!elField) return;

    if (elField.classList.contains("error")) {
      elField.classList.remove("error");
      return;
    }

    elField.value = hexColor;
    elField.style.background = hexColor;
    elField.style.color = hexColor ? this.getContrastColor(hexColor) : "";

    if (setOriginal) {
      elField.dataset.original = hexColor;
    } else {
      if (
        this.elSchemeSelect.value !== "custom" &&
        hexColor !== elField.dataset.original
      ) {
        this.elSchemeSelect.value = "custom";
      }

      const key = elField.id.replace("edit-color-palette-", "");
      const palette = { [key]: hexColor };
      this.setDocumentPalette(palette);
    }
  },

  /**
   * Update active color scheme.
   *
   * @param palette
   *   Array of colors. Passing null removes set colors.
   */
  setDocumentPalette(palette) {
    const root = document.documentElement;

    if (palette) {
      Object.keys(palette).forEach((key) => {
        root.style.setProperty(
          `${cssVarColorsPrefix}${key}`,
          String(palette[key]),
        );

        if (key === "header") {
          const [r, g, b] = this.getHexToRgb(palette[key]);
          root.style.setProperty(
            `${cssVarColorsPrefix}${key}-rgb`,
            `${r},${g},${b}`,
          );
        }
      });
    }

    if (palette === null) {
      for (let i = root.style.length - 1; i >= 0; i--) {
        const propertyName = root.style[i];
        if (propertyName.startsWith(cssVarColorsPrefix)) {
          root.style.removeProperty(propertyName);
        }
      }
    }
  },

  // Returns recommended contrast color.
  getContrastColor(hexColor) {
    const [r, g, b] = this.getHexToRgb(hexColor);
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 128 ? "#000" : "#fff";
  },

  getHexToRgb(hexColor) {
    if (hexColor.length === 4) {
      hexColor = `#${[...hexColor.slice(1)].map((char) => char + char).join("")}`;
    }
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    return [r, g, b];
  },
};

module.exports = { dxprThemeSettingsColors };
