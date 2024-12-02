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

      /**
       * Handle document changes.
       */
      function handleDocumentEvents(event) {
        const targetElement = event.target;
        const id = targetElement?.id ?? "";
        const value = targetElement?.value ?? "";
        const elName = targetElement?.name ?? "";

        // Set Block Preset to Custom if any value within Block Advanced section is changed.
        (function () {
          const blockAdvancedSection = document.querySelector(
            "#edit-block-advanced",
          );

          if (blockAdvancedSection) {
            blockAdvancedSection.addEventListener("change", (e) => {
              if (blockAdvancedSection.contains(targetElement)) {
                document.getElementById("edit-block-preset").value = "custom";
              }
            });
          }
        })();

        // Handle Block Design Presets based on selected preset.
        if (id === "edit-block-preset") {
          // Default settings for the Block Design Presets.
          const setDefaults = {
            block_border: 0,
            block_border_color: "",
            block_card: "",
            block_divider: false,
            block_divider_custom: false,
            block_divider_length: 0,
            block_divider_thickness: 0,
            block_divider_spacing: 0,
            block_padding: 0,
            title_align: "left",
            title_background: "",
            title_border: 0,
            title_border_color: "",
            title_border_radius: 0,
            title_card: "",
            title_font_size: "h3",
            title_padding: 0,
          };

          let set = {};
          switch (value) {
            case "block_boxed":
              set = {
                block_border: 5,
                block_border_color: "text",
                block_padding: 15,
              };
              break;
            case "block_outline":
              set = {
                block_border: 1,
                block_border_color: "text",
                block_padding: 10,
              };
              break;
            case "block_card":
              set = {
                block_card: "card card-body",
                title_font_size: "h3",
              };
              break;
            case "title_inverted":
              set = {
                title_background: "text",
                title_card: "card card-body dxpr-theme-util-background-gray",
                title_font_size: "h3",
                title_padding: 10,
              };
              break;
            case "title_inverted_shape":
              set = {
                title_align: "center",
                title_background: "text",
                title_border_radius: 100,
                title_card: "card card-body dxpr-theme-util-background-gray",
                title_font_size: "h4",
                title_padding: 10,
              };
              break;
            case "title_sticker":
              set = {
                title_card: "card card-body dxpr-theme-util-background-gray",
                title_font_size: "body",
                title_padding: 10,
              };
              break;
            case "title_sticker_color":
              set = {
                title_card: "card card-body bg-primary",
                title_font_size: "body",
                title_padding: 10,
              };
              break;
            case "title_outline":
              set = {
                title_border: 1,
                title_border_color: "text",
                title_font_size: "h4",
                title_padding: 15,
              };
              break;
            case "default_divider":
              set = {
                block_divider: true,
                block_divider_thickness: 4,
                block_divider_spacing: 15,
              };
              break;
            case "hairline_divider":
              set = {
                block_divider: true,
                block_divider_thickness: 1,
                block_divider_spacing: 15,
              };
              break;
            default:
              // Handle the case when no known value matches
              set = {};
              break;
          }

          // Add missing properties from defaults if not present in set.
          Object.keys(setDefaults).forEach((key) => {
            if (!(key in set)) {
              set[key] = setDefaults[key];
            }
          });

          // Apply the preset values to the corresponding fields.
          Object.keys(set).forEach((key) => {
            self.setFieldValue(key, set[key]);
          });
        }

        const presetClassesRemove = [
          "card",
          "card-body",
          "bg-primary",
          "dxpr-theme-util-background-accent1",
          "dxpr-theme-util-background-accent2",
          "dxpr-theme-util-background-black",
          "dxpr-theme-util-background-white",
          "dxpr-theme-util-background-gray",
        ];

        // Apply classes to Block Card Style based on the selected card style.
        if (id === "edit-block-card" || id === "edit-title-card") {
          const presetClasses = value.trim().split(/\s+/);
          const target = id === "edit-title-card" ? ".block-title" : ".block";

          document
            .querySelectorAll(`.region-block-design ${target}`)
            .forEach((block) => {
              block.classList.remove(...presetClassesRemove);
              block.classList.add(
                ...presetClasses.filter((className) => className !== ""),
              );
            });
        }

        // Apply or remove block design classes based on region selection.
        if (elName.startsWith("block_design_regions[")) {
          const blockDesignClass = "region-block-design";
          const regionClass = `.region-${value.replace("_", "-")}`;
          const elRegion = document.querySelector(regionClass);
          if (!elRegion) return;

          if (targetElement.checked) {
            elRegion.classList.add(blockDesignClass);

            // Trigger change event for block and block title card to reapply classes.
            const elements = document.querySelectorAll(
              "#edit-block-card, #edit-title-card",
            );
            const changeEvent = new Event("change", {
              bubbles: true,
              cancelable: true,
            });
            elements.forEach((element) => {
              element.dispatchEvent(changeEvent);
            });
          } else {
            elRegion.classList.remove(blockDesignClass);

            // Remove all applied block and block title classes.
            const selectors = `${regionClass} .block,${regionClass} .block-title`;
            document.querySelectorAll(selectors).forEach((block) => {
              block.classList.remove(...presetClassesRemove);
            });
          }
        }

        // Toggle display of Title Sticker Mode based on checkbox state.
        if (id === "edit-title-sticker") {
          const blockTitles = document.querySelectorAll(
            ".region-block-design .block-title",
          );

          blockTitles.forEach((title) => {
            title.style.display = targetElement.checked ? "inline-block" : "";
          });
        }

        // Remove CSS variables related to Block Divider if not in use.
        if (id === "edit-block-divider" || id === "edit-block-divider-custom") {
          if (!targetElement.checked) {
            [
              "block_divider_color",
              "block_divider_thickness",
              "block_divider_length",
              "block_divider_spacing",
            ].forEach((key) => {
              const cssVarName = key.replace(/[_]/g, "-");
              document.documentElement.style.removeProperty(`--${cssVarName}`);
            });
          }

          // Set default divider values if divider is checked.
          if (id === "edit-block-divider" && targetElement.checked) {
            const set = {
              block_divider_length: 0,
              block_divider_thickness: 4,
              block_divider_spacing: 15,
            };
            Object.keys(set).forEach((key) => {
              self.setFieldValue(key, set[key]);
            });
          }
        }
      }

      // Listen for change and keyup events on the document to handle field changes.
      document.addEventListener("change", handleDocumentEvents);
      document.addEventListener("keyup", handleDocumentEvents);

      // Add event listener for slider elements to handle their change events.
      document.querySelectorAll(".dxb-slider").forEach((el) => {
        el.addEventListener("input", (e) => {
          handleDocumentEvents(e);
        });
      });
    },

    /**
     * Update field value.
     * Updated to use Vanilla JS.
     */

    setFieldValue(key, value) {
      const field = document.querySelector(`[name="${key}"]`);
      if (!field) {
        return;
      }

      if (field.type === "range" || field.classList.contains("dxb-slider")) {
        field.value = value;
        field.dispatchEvent(new Event("input"));
      } else if (field.type === "checkbox") {
        field.checked = value;
        field.dispatchEvent(new Event("change"));
      } else if (field.type === "radio") {
        const radioField = document.querySelector(
          `[name="${key}"][value="${value}"]`,
        );
        if (radioField) {
          radioField.checked = true;
          radioField.dispatchEvent(new Event("change"));
        }
      } else {
        field.value = value;
        field.dispatchEvent(new Event("change"));
      }
    },
  };
})(Drupal, once);
