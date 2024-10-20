(function (Drupal, once) {
  /* global ReinventedColorWheel */

  "use strict";

  // Define constants.
  const cssVarColorsPrefix = "--dxt-color-";
  const cssVarSettingsPrefix = "--dxt-setting-";

  /**
   * Handles the 'Colors' theme settings page.
   */
  Drupal.behaviors.dxpr_themeSettingsColors = {
    // Settings.
    elColorPalette: document.querySelector("#color-palette"),
    elSchemeSelect: document.getElementById("edit-color-scheme"),
    colorSettings: drupalSettings.dxpr_themeSettings.colors ?? [],
    // Methods.
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
          const el = colorPalette.querySelector(".form-text.active");

          if (el) {
            pt.updateColorField(el, color.hex);
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
          el.addEventListener("focus", colorFieldHandler.init);
          el.addEventListener("change", colorFieldHandler.init);
          el.addEventListener("keyup", colorFieldHandler.init);
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

      // Initialize with the current scheme.
      this.populateColorFields("current");
    },
    /**
     * Set field as active.
     */
    setActiveField(el) {
      const colorFields = this.elColorPalette.querySelectorAll(".form-text");

      colorFields.forEach((field) => {
        field.classList.remove("active");
      });

      if (el) {
        el.classList.add("active");
      }
    },
    /**
     * Populate color fields with selected palette.
     */
    populateColorFields(selectedScheme) {
      // Keep current values on custom.
      if (selectedScheme === "custom" || !this.colorSettings) {
        return;
      }

      const schemePalette =
        selectedScheme === "current"
          ? this.colorSettings.palette
          : this.colorSettings.schemes[selectedScheme].colors;

      if (schemePalette) {
        Object.keys(schemePalette).forEach((key) => {
          const hexColor = schemePalette[key];
          const colorField = document.getElementById(
            `edit-color-palette-${key}`,
          );
          this.updateColorField(colorField, hexColor, true);
        });
        this.setDocumentPalette(schemePalette);
      }
    },
    /**
     * Update Color input field.
     */
    updateColorField(elField, hexColor, setOriginal) {
      if (!elField) {
        return;
      }

      // Do not update field with error.
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
        // Set select to 'custom' if color is not from palette.
        if (
          this.elSchemeSelect.value !== "custom" &&
          hexColor !== elField.dataset.original
        ) {
          this.elSchemeSelect.value = "custom";
        }

        // Update active palette.
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
            cssVarColorsPrefix + key,
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
    /**
     * Returns recommended contrast color.
     */
    getContrastColor(hexColor) {
      const [r, g, b] = this.getHexToRgb(hexColor);
      const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
      return luminance > 128 ? "#000" : "#fff";
    },
    /**
     * Returns an array with r,g,b color values from given hex value.
     *
     * @param hexColor
     * @returns {number[]}
     */
    getHexToRgb(hexColor) {
      // Expand shorthand color values.
      if (hexColor.length === 4) {
        hexColor = `#${hexColor
          .slice(1)
          .split("")
          .map((char) => char + char)
          .join("")}`;
      }
      const r = parseInt(hexColor.slice(1, 3), 16);
      const g = parseInt(hexColor.slice(3, 5), 16);
      const b = parseInt(hexColor.slice(5, 7), 16);
      return [r, g, b];
    },
  };

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
      this.setNoPreview();
      const settings = this.getCssVariables();

      this.toggleElement("page_title_breadcrumbs", "header ol.breadcrumb");
      this.toggleElement("block_divider", ".block-preview hr");

      Object.values(settings).forEach((setting) => {
        const inputName = this.getInputName(setting);
        const els = document.querySelectorAll(`[name="${inputName}"]`);
        this.setPreview(inputName, els[0] ?? null);

        els.forEach((el) => {
          if (
            el.id === "edit-box-max-width" ||
            el.id === "edit-layout-max-width"
          ) {
            el.addEventListener("change", (e) => {
              this.fieldHandler(e);
            });
          } else {
            el.addEventListener("input", (e) => {
              this.fieldHandler(e);
            });
          }

          const customField = document.querySelector(
            `[name="${inputName}_custom"]`,
          );

          if (customField) {
            customField.addEventListener("change", (e) => {
              this.fieldHandler(e);
            });

            customField.addEventListener("keyup", (e) => {
              this.fieldHandler(e);
            });
          }
        });
      });
    },
    setNoPreview() {
      // Mark all fields with a no-preview icon.
      const systemThemeSettings = document.querySelector(
        ".system-theme-settings",
      );
      if (systemThemeSettings) {
        const inputs = systemThemeSettings.querySelectorAll(
          "input, select, textarea",
        );
        inputs.forEach((input) => {
          // Skip adding no-preview class for these fields.
          const skip = [
            "color_scheme",
            "color_palette",
            "headings_font_face_selector",
            "nav_font_face_selector",
            "sitename_font_face_selector",
            "blockquote_font_face_selector",
            "block_preset",
            "block_card",
            "title_card",
            "block_design_regions",
            "block_divider",
            "block_divider_custom",
            "page_title_breadcrumbs",
          ];

          if (!skip.some((name) => input.name.startsWith(name))) {
            this.setPreviewClass(input, true);
          }
        });
      }
    },
    setPreview(name, input) {
      if (!name || !input) {
        return;
      }

      // Handled fields with no preview.
      const noPreviewFields = [
        "background_image_style",
        "background_image_position",
        "background_image_attachment",
        "header_top_height_sticky_offset",
        "header_side_direction",
        "hamburger_menu",
        "hamburger_animation",
        "menu_border_position_offset",
        "menu_border_position_offset_sticky",
        "menu_border_size",
        "menu_border_color",
        "header_mobile_breakpoint",
        "page_title_image_opacity",
        "page_title_image_style",
        "page_title_image_position",
        // Fonts.
        "body_font_face",
        "headings_font_face",
        "nav_font_face",
        "sitename_font_face",
        "blockquote_font_face",
      ];

      if (noPreviewFields.includes(name)) {
        return;
      }

      // Set dependency array as fieldName => requiredField.
      const oDependent = {
        boxed_layout_boxbg: "boxed_layout",
        box_max_width: "boxed_layout",
        header_top_height_scroll: "header_top_sticky",
        header_top_bg_opacity_scroll: "header_top_sticky",
        nav_font_size: "menu_type",
        nav_mobile_font_size: "menu_type",
      };

      // Iterate dependent fields.
      let processed = false;
      Object.entries(oDependent).forEach(([fieldName, depFieldName]) => {
        if (fieldName === name) {
          processed = true;
          const elDep = document.querySelector(`[name="${depFieldName}"]`);

          if (elDep && elDep.type === "checkbox" && elDep.checked) {
            this.setPreviewClass(input, false);
          }

          if (name === "nav_font_size" || name === "nav_mobile_font_size") {
            const radio = document.querySelector(
              `[name="${depFieldName}"]:checked`,
            );
            if (radio && radio.value !== "lead") {
              this.setPreviewClass(input, false);
            }
          }
        }
      });

      // If not processed, it has no dependency, and the icon can be removed.
      if (!processed) {
        this.setPreviewClass(input, false);
      }
    },
    /**
     * Set action to TRUE to add the no-preview class, and FALSE to remove it.
     */
    setPreviewClass(input, action) {
      const label = this.getLabel(input);
      if (!label) return;

      if (action) {
        label.classList.add("no-preview");
      } else {
        label.classList.remove("no-preview");
      }
    },
    getLabel(elInputOrName) {
      let label = null;

      if (typeof elInputOrName === "string") {
        elInputOrName = document.querySelector(`[name="${elInputOrName}"]`);
      }

      if (elInputOrName) {
        // Get legend for grouped field items.
        const fieldset = elInputOrName.closest("fieldset");
        if (fieldset) {
          label = fieldset.querySelector("legend");
        }

        // If no legend, get first available form item wrapper label.
        if (!label) {
          const formItem = elInputOrName.closest(".form-item");
          if (formItem) {
            label = formItem.querySelector("label");
          }
        }
      }

      return label;
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
     * Handles the change event for form fields.
     *
     * @param event
     */
    fieldHandler(event) {
      const setting = event.target.name;
      const validUnits = ["px", "em", "rem"];
      let { value } = event.target;

      if (event.target.type === "checkbox") {
        value = event.target.checked;
      }

      // Define variables that expect "px".
      const pxRequiredVars = [
        "box_max_width",
        "header_top_height",
        "layout_max_width",
        "gutter_horizontal",
        "gutter_vertical",
        "gutter_container",
        "gutter_horizontal_mobile",
        "gutter_vertical_mobile",
        "gutter_container_mobile",
        "header_side_width",
        "header_side_logo_height",
        "dropdown_width",
        "menu_border_position_offset",
        "menu_border_position_offset_sticky",
        "menu_border_size",
        "header_mobile_breakpoint",
        "header_mobile_height",
        "page_title_height",
        "body_font_size",
        "nav_font_size",
        "h1_font_size",
        "h2_font_size",
        "h3_font_size",
        "h4_font_size",
        "blockquote_font_size",
        "body_mobile_font_size",
        "nav_mobile_font_size",
        "h1_mobile_font_size",
        "h2_mobile_font_size",
        "h3_mobile_font_size",
        "h4_mobile_font_size",
        "blockquote_mobile_font_size",
        "divider_thickness",
        "divider_length",
        "block_padding",
        "block_border_radius",
        "block_border",
        "title_padding",
        "title_border",
        "title_border_radius",
        "block_divider_spacing",
      ];

      // Define variables that expect "em".
      const emRequiredVars = [
        "body_line_height",
        "headings_line_height",
        "blockquote_line_height",
        "headings_letter_spacing",
      ];

      // If the value has no unit and the variable expects 'px', add 'px'.
      if (
        pxRequiredVars.some((varName) => setting.includes(varName)) &&
        !validUnits.some((unit) => value.endsWith(unit)) &&
        !Number.isNaN(Number(value))
      ) {
        value += "px";
      }

      // If the value has no unit and the variable expects 'em', add 'em'.
      if (
        emRequiredVars.some((varName) => setting.includes(varName)) &&
        !validUnits.some((unit) => value.endsWith(unit)) &&
        !Number.isNaN(Number(value))
      ) {
        value += "em";
      }

      value = this.massageValue(setting, value);

      // Create CSS variable name.
      const cssVarName = setting
        .replace("_custom", "")
        .replace(/[[_]/g, "-")
        .replace("]", "");

      // Override CSS variable.
      this.root.style.setProperty(
        `${cssVarSettingsPrefix}${cssVarName}`,
        String(value),
      );

      // Workaround for block divider position.
      // Adds a divider-position-block CSS variable.
      if (setting === "divider_position") {
        if (event.target.value === "3") {
          value = "calc(100% - var(--dxt-setting-block-divider-length))";
        }
        this.root.style.setProperty(
          `${cssVarSettingsPrefix}${cssVarName}-block`,
          String(value),
        );
      }

      // Add mobile title font size variable.
      if (setting === "title_font_size") {
        value = value.replace("-font-size", "-mobile-font-size");
        this.root.style.setProperty(
          `${cssVarSettingsPrefix}${cssVarName}-mobile`,
          String(value),
        );
      }
    },
    /**
     * Tweak certain settings to valid values.
     *
     * @param setting
     * @param value
     * @returns {string}
     */
    massageValue(setting, value) {
      switch (setting) {
        // Generic: Inline/Block display
        case "title_sticker":
          value = value === "1" ? "inline-block" : "block";
          break;
        // Generic: Uppercase
        case "headings_uppercase":
        case "title_type[uppercase]":
          value = value ? "uppercase" : "normal";
          break;
        // Generic: Bold
        case "headings_bold":
        case "title_type[bold]":
          value = value ? "bold" : "normal";
          break;
        // Generic: Italic
        case "title_type[italic]":
          value = value ? "italic" : "normal";
          break;
        // Generic: Percentage
        case "logo_height":
          value = `${value}%`;
          break;
        // Breadcrumb separator
        case "page_title_breadcrumbs_separator":
          value = `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
          break;
        // Title font
        case "title_font_size":
          value = `var(--dxt-setting-${value}-font-size)`;
          break;
        // Dividers: 0px = 100%
        case "divider_length":
        case "block_divider_length":
          value = value === "0px" ? "100%" : value;
          break;
        case "divider_position":
          switch (value) {
            case "1":
              value = "0";
              break;
            case "2":
              value = "auto";
              break;
            case "3":
              value = "calc(100% - var(--dxt-setting-divider-length))";
              break;
            default:
              break;
          }
          break;
        // Handle color fields.
        case "divider_color":
        case "block_background":
        case "title_background":
        case "block_border_color":
        case "title_border_color":
        case "block_divider_color":
        case "menu_border_color":
        case "navbar_background":
        case "header_block_background":
        case "header_block_text_color":
        case "menu_background":
        case "menu_text_color":
        case "menu_hover_background":
        case "menu_hover_text_color":
        case "dropdown_background":
        case "dropdown_text_color":
        case "dropdown_hover_background":
        case "dropdown_hover_text_color":
          if (
            Object.prototype.hasOwnProperty.call(
              drupalSettings.dxpr_themeSettings.colors.palette,
              value,
            )
          ) {
            value = `var(${cssVarColorsPrefix + value})`;
          } else if (value === "custom") {
            const customField = document.querySelector(
              `[name="${setting}_custom"]`,
            );
            if (customField) {
              value = customField.value;
            }
          } else if (value === "white") {
            value = "#ffffff";
          } else {
            value = "";
          }
          break;
        default:
          break;
      }
      return value;
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
        if (targetElement.closest("#edit-block-advanced")) {
          document.getElementById("edit-block-preset").value = "custom";
        }

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
