/**
 * @file
 * Handles theme settings behaviors.
 */

const { dxprThemeSettingsColors } = require("./theme-settings-colors");
const { handleMaxWidthSettings } = require("./handle-max-width");
const {
  setNoPreview,
  setPreview,
  setPreviewClass,
} = require("./no-preview-handler");

const { fieldHandler, massageValue } = require("./field-handler");
const { handleDocumentEvents, setFieldValue } = require("./block-handler");

(function (Drupal, once) {
  /* global ReinventedColorWheel */

  "use strict";

  // Define constants.
  const cssVarColorsPrefix = "--dxt-color-";
  const cssVarSettingsPrefix = "--dxt-setting-";

  /**
   * Handles the 'Colors' theme settings page.
   */
  Drupal.behaviors.dxpr_themeSettingsColors = dxprThemeSettingsColors;

  /**
   * Handle dynamic theme settings.
   */
  Drupal.behaviors.dxpr_themeSettingsDynamic = {
    root: document.documentElement,
    attach(context) {
      if (once("dxpr-settings-init", "html", context).length) {
        this.init();
      }
    },
    init() {
      setNoPreview(setPreviewClass);
      const settings = this.getCssVariables();

      this.toggleElement("page_title_breadcrumbs", "header ol.breadcrumb");
      this.toggleElement("block_divider", ".block-preview hr");

      handleMaxWidthSettings(
        settings,
        this.getInputName.bind(this),
        (name, input) => setPreview(name, input, setPreviewClass),
        (event) => fieldHandler(event, this.root, cssVarSettingsPrefix, massageValue)
      );
    },

    getInputName(setting) {
      let inputId = setting
        .replace(cssVarSettingsPrefix, "")
        .replace(/-/g, "_");
      let p1;
      let p2;
      let p3;

      // Fix id's containing brackets.
      switch (inputId) {
        case "title_type_italic":
        case "title_type_bold":
        case "title_type_uppercase":
          [p1, p2, p3] = inputId.split("_");
          inputId = `${p1}_${p2}[${p3}]`;
          break;
        default:
          break;
      }

      return inputId;
    },

    /**
     * Returns all dxpr settings CSS variables.
     *
     * @returns array
     */
    getCssVariables() {
      return Array.from(document.styleSheets)
        .filter(
          (styleSheet) =>
            !styleSheet.href ||
            styleSheet.href.startsWith(window.location.origin),
        )
        .reduce((finalArr, sheet) => {
          const propKeySet = new Set(finalArr);
          try {
            Array.from(sheet.cssRules).forEach((rule) => {
              if (rule.type === 1) {
                Array.from(rule.style).forEach((propName) => {
                  propName = propName.trim();
                  if (propName.indexOf(cssVarSettingsPrefix) === 0) {
                    propKeySet.add(propName);
                  }
                });
              }
            });
          } catch (e) {
            // Could not access cssRules for this stylesheet
          }
          return Array.from(propKeySet);
        }, []);
    },

    /**
     * Toggles show/hide of all matching elements based on a field status.
     *
     * @param toggle    Field name to use as toggle.
     * @param selector  CSS Selector for element to toggle.
     */
    toggleElement(toggle, selector) {
      const checkbox = document.querySelector(`input[name="${toggle}"]`);
      const elements = document.querySelectorAll(selector);

      const toggleDisplay = () => {
        elements.forEach((element) => {
          element.style.display = checkbox.checked ? "block" : "none";
        });
      };
      toggleDisplay();

      checkbox.addEventListener("change", toggleDisplay);
    },
  };

  /**
   * Provide vertical tab summaries for Bootstrap settings.
   */
  Drupal.behaviors.dxpr_themeSettingsControls = {
    attach(context) {
      once("dxpr-settings-controls-fields", "html", context).forEach(() => {
        this.handleFields();
      });

      // Select all target inputs once when the page loads.
      once("dxpr-settings-controls", "html", context).forEach(() => {});

      // Function to re-layout the slider
      function relayoutSlider(sliderElement) {
        // Reset value and style
        const val = parseFloat(sliderElement.value).toFixed(2);
        const min = parseFloat(sliderElement.min);
        const max = parseFloat(sliderElement.max);
        const percent = ((val - min) / (max - min)) * 100;

        sliderElement.style.setProperty("--value-percent", `${percent}%`);
        sliderElement.setAttribute("aria-valuenow", val);
      }

      // Event listener for radio button change
      document.querySelectorAll('input[type="radio"]').forEach((radioInput) => {
        radioInput.addEventListener("change", () => {
          // Find all sliders that need a re-layout
          document.querySelectorAll(".dxb-slider").forEach((sliderElement) => {
            relayoutSlider(sliderElement);
          });
        });
      });

      // Typographic Scale Master Slider
      document
        .querySelector("#edit-scale-factor")
        .addEventListener("input", function () {
          const base = parseFloat(
            document.querySelector("#edit-body-font-size").value,
          );
          const factor = parseFloat(this.value); // Get value from the scale factor slider

          function setFontSize(selector, exponent) {
            document.querySelectorAll(selector).forEach((input) => {
              const newValue = base * factor ** exponent;
              input.value = newValue.toFixed(2); // Set new font size value
              input.dispatchEvent(new Event("input")); // Trigger change event
            });
          }

          setFontSize("#edit-h1-font-size, #edit-h1-mobile-font-size", 4);
          setFontSize("#edit-h2-font-size, #edit-h2-mobile-font-size", 3);
          setFontSize("#edit-h3-font-size, #edit-h3-mobile-font-size", 2);
          setFontSize(
            "#edit-h4-font-size, #edit-h4-mobile-font-size, #edit-blockquote-font-size, #edit-blockquote-mobile-font-size",
            1,
          );
        });
    },
    handleFields() {
      const self = this;

      document.addEventListener("change", (e) => handleDocumentEvents(e, setFieldValue));
      document.addEventListener("keyup", (e) => handleDocumentEvents(e, setFieldValue));

    },
  };
})(Drupal, once);
