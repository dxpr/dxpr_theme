(function ($, Drupal, once) {
  /* global ReinventedColorWheel */

  "use strict";

  // Define constants.
  const cssVarColorsPrefix = "--dxpr-color-";
  const cssVarSettingsPrefix = "--dxpr-setting-";

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

        // Use jQuery to handle bootstrapSlider events.
        els.forEach((el) => {
          $(el).on("change", (e) => {
            this.fieldHandler(e);
          });

          // Add handler also to potential "_custom" fields.
          const customField = document.querySelector(
            `[name="${inputName}_custom"]`,
          );

          if (customField) {
            $(customField).on("change keyup", (e) => {
              this.fieldHandler(e);
            });
          }
        });
      });
    },
    setNoPreview() {
      // Mark all fields with a no-preview icon.
      document
        .querySelector(".system-theme-settings")
        .querySelectorAll("input, select, textarea")
        .forEach((input) => {
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
          ];

          if (!skip.some((name) => input.name.startsWith(name))) {
            this.setPreviewClass(input, true);
          }
        });
    },
    setPreview(name, input) {
      if (!name || !input) {
        return;
      }

      // Handled fields with no preview.
      const aNoPreviewFields = [
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

      if (aNoPreviewFields.includes(name)) {
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

          if (elDep.type === "checkbox" && elDep.checked) {
            this.setPreviewClass(input, false);
          }

          if (name === "nav_font_size" || name === "nav_mobile_font_size") {
            const radio = document.querySelector(
              `[name="${depFieldName}"]:checked`,
            );
            if (radio.value !== "lead") {
              this.setPreviewClass(input, false);
            }
          }
        }
      });

      // If not been processed it has no dependency and icon can be removed.
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

      if (action === true) {
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
        label = elInputOrName.closest("fieldset")?.querySelector("legend");

        // If no legend, get first available form item wrapper label.
        if (!label) {
          label = elInputOrName.closest(".form-item")?.querySelector("label");
        }
      }

      return label;
    },
    getInputName(setting) {
      let inputId = setting
        .replace(cssVarSettingsPrefix, "")
        .replace(/-/g, "_");
      let [p1, p2, p3] = "";

      // Fix id's containing brackets.
      switch (inputId) {
        case "title_type_italic":
        case "title_type_bold":
        case "title_type_uppercase":
          [p1, p2, p3] = inputId.split("_");
          inputId = `${p1}_${p2}[${p3}]`;
          break;
        default:
      }

      return inputId;
    },
    /**
     * Handles the change event for form fields.
     *
     * @param event
     */
    fieldHandler(event) {
      const {
        name: setting,
        parentElement: { textContent: textValue },
      } = event.target;
      const unit = textValue.replace(/[^a-z]/gi, "");
      const validUnits = ["px", "em", "rem"];
      let { value } = event.target;

      if (event.target.type === "checkbox") {
        value = event.target.checked;
      }

      // Append unit if value is numeric.
      if (validUnits.includes(unit) && !Number.isNaN(parseFloat(value))) {
        value += unit;
      }

      value = this.massageValue(setting, value);

      // Create CSS variable name.
      const cssVarName = setting
        .replace("_custom", "")
        .replace(/[[_]/g, "-")
        .replace("]", "");

      // Override CSS variable.
      this.root.style.setProperty(
        cssVarSettingsPrefix + cssVarName,
        String(value),
      );

      // Workaround for block divider position.
      // Adds a divider-position-block CSS variable.
      if (setting === "divider_position") {
        if (event.target.value === "3") {
          value = "calc(100% - var(--dxpr-setting-block-divider-length))";
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
        // Breadcrumb separator
        case "page_title_breadcrumbs_separator":
          value = `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
          break;
        // Title font
        case "title_font_size":
          value = `var(--dxpr-setting-${value}-font-size)`;
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
              value = "calc(100% - var(--dxpr-setting-divider-length))";
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
          if (value in drupalSettings.dxpr_themeSettings.colors.palette) {
            value = `var(${cssVarColorsPrefix + value})`;
          } else if (value === "custom") {
            const customField = document.querySelector(
              `[name="${setting}_custom"]`,
            );
            value = customField.value;
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
      return [...document.styleSheets]
        .filter(
          (styleSheet) =>
            !styleSheet.href ||
            styleSheet.href.startsWith(window.location.origin),
        )
        .reduce((finalArr, sheet) => {
          const propKeySet = new Set(finalArr);
          try {
            [...sheet.cssRules].forEach((rule) => {
              if (rule.type === 1) {
                [...rule.style].forEach((propName) => {
                  propName = propName.trim();
                  if (propName.indexOf(cssVarSettingsPrefix) === 0) {
                    propKeySet.add(propName);
                  }
                });
              }
            });
          } catch (e) {
            // Could not access cssRules for stylesheet.
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
      const cb = document.querySelector(`input[name="${toggle}"]`);
      const els = document.querySelectorAll(selector);

      els.forEach((el) => {
        el.style.display = cb.checked ? "block" : "none";
      });

      cb.addEventListener("change", () => {
        els.forEach((el) => {
          el.style.display = cb.checked ? "block" : "none";
        });
      });
    },
  };

  /**
   * Provide vertical tab summaries for Bootstrap settings.
   */
  /* eslint-disable */
  Drupal.behaviors.dxpr_themeSettingsControls = {
    attach(context) {
      if (once("dxpr-settings-controls", "html", context).length) {
        this.init();
        this.handleFields();
      }
    },
    init() {
      /**
       * Bootstrap slider configuration.
       */
      // Opacity Sliders
      const $opacitySliders = $(
        "#edit-header-top-bg-opacity-scroll," +
        "#edit-header-top-bg-opacity," +
        "#edit-header-side-bg-opacity," +
        "#edit-side-header-background-opacity," +
        "#edit-page-title-image-opacity," +
        "#edit-header-top-opacity," +
        "#edit-header-top-opacity-scroll," +
        "#edit-menu-full-screen-opacity"
      );
      $opacitySliders.each(function() {
        const startValue = $(this).val();
        $(this).bootstrapSlider({
          step   : 0.01,
          min    : 0,
          max    : 1,
          tooltip: "hide",
          value  : parseFloat(startValue),
        });
      });

      // Line Height Sliders
      $(".line-height-slider").each(function() {
        const startValue = $(this).val();
        $(this).bootstrapSlider({
          step   : 0.1,
          min    : 0,
          max    : 3,
          tooltip: "hide",
          formatter(value) {
            return `${value}em`;
          },
          value: parseFloat(startValue),
        });
      });

      // Border Size Sliders
      $(".border-size-slider").each(function() {
        const startValue = $(this).val();
        $(this).bootstrapSlider({
          step   : 1,
          min    : 0,
          max    : 30,
          tooltip: "hide",
          formatter(value) {
            return `${value}px`;
          },
          value: parseFloat(startValue),
        });
      });

      // Border Radius Sliders
      $(".border-radius-slider").each(function() {
        const startValue = $(this).val();
        $(this).bootstrapSlider({
          step   : 1,
          min    : 0,
          max    : 100,
          tooltip: "hide",
          formatter(value) {
            return `${value}px`;
          },
          value: parseFloat(startValue),
        });
      });

      let $input;

      // Body Font Size
      $input = $("#edit-body-font-size");
      $input.bootstrapSlider({
        step   : 1,
        min    : 8,
        max    : 30,
        tooltip: "hide",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Nav Font Size
      $input = $("#edit-nav-font-size");
      $input.bootstrapSlider({
        step   : 1,
        min    : 8,
        max    : 30,
        tooltip: "hide",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Body Mobile Font Size
      $input = $("#edit-body-mobile-font-size");
      $input.bootstrapSlider({
        step   : 1,
        min    : 8,
        max    : 30,
        tooltip: "hide",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Nav Mobile Font Size
      $input = $("#edit-nav-mobile-font-size");
      $input.bootstrapSlider({
        step   : 1,
        min    : 8,
        max    : 30,
        tooltip: "hide",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Other Font Sizes
      $(".font-size-slider").each(function() {
        const startValue = $(this).val();
        $(this).bootstrapSlider({
          step   : 1,
          min    : 8,
          max    : 100,
          tooltip: "hide",
          formatter(value) {
            return `${value}px`;
          },
          value: parseFloat(startValue),
        });
      });

      // Scale Factor
      $input = $("#edit-scale-factor");
      $input.bootstrapSlider({
        step   : 0.01,
        min    : 1,
        max    : 2,
        tooltip: "hide",
        value  : parseFloat($input.val()),
      });

      // Divider Thickness
      $input = $("#edit-divider-thickness");
      $input.bootstrapSlider({
        step   : 1,
        min    : 0,
        max    : 20,
        tooltip: "hide",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Divider Thickness
      $input = $("#edit-block-divider-thickness");
      $input.bootstrapSlider({
        step   : 1,
        min    : 0,
        max    : 20,
        tooltip: "hide",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Divider Length
      $input = $("#edit-divider-length");
      $input.bootstrapSlider({
        step   : 10,
        min    : 0,
        max    : 500,
        tooltip: "hide",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Divider Length
      $input = $("#edit-block-divider-length");
      $input.bootstrapSlider({
        step   : 10,
        min    : 0,
        max    : 500,
        tooltip: "hide",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      function formatPosition(pos) {
        let label = Drupal.t("Left");
        if (pos === 2) label = Drupal.t("Center");
        if (pos === 3) label = Drupal.t("Right");
        return label;
      }

      // Divider Position
      $input = $("#edit-divider-position");
      $input.bootstrapSlider({
        step     : 1,
        min      : 1,
        max      : 3,
        selection: "none",
        tooltip  : "hide",
        formatter: formatPosition,
        value    : parseFloat($input.val()),
      });

      // Headings letter spacing
      $input = $("#edit-headings-letter-spacing");
      $input.bootstrapSlider({
        step   : 0.01,
        min    : -0.1,
        max    : 0.3,
        tooltip: "hide",
        formatter(value) {
          return `${value}em`;
        },
        value: parseFloat($input.val()),
      });

      // Block Design Divider Spacing
      $input = $("#edit-block-divider-spacing");
      $input.bootstrapSlider({
        step   : 1,
        min    : 0,
        max    : 100,
        tooltip: "hide",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Page Title height
      $input = $("#edit-page-title-height");
      $input.bootstrapSlider({
        step   : 5,
        min    : 50,
        max    : 500,
        tooltip: "hide",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Header height slider
      $input = $("#edit-header-top-height");
      $input.bootstrapSlider({
        step   : 1,
        min    : 10,
        max    : 200,
        tooltip: "hide",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Header Mobile Breakpoint slider
      $input = $("#edit-header-mobile-breakpoint");
      $input.bootstrapSlider({
        step   : 10,
        min    : 480,
        max    : 4100,
        tooltip: "hide",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Header Mobile height slider
      $input = $("#edit-header-mobile-height");
      $input.bootstrapSlider({
        step   : 1,
        min    : 10,
        max    : 200,
        tooltip: "hide",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Header after-scroll height slider
      $input = $("#edit-header-top-height-scroll");
      $input.bootstrapSlider({
        step   : 1,
        min    : 10,
        max    : 200,
        tooltip: "hide",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Sticky header scroll offset
      $input = $("#edit-header-top-height-sticky-offset");
      $input.bootstrapSlider({
        step   : 10,
        min    : 0,
        max    : 2096,
        tooltip: "hide",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Side Header after-scroll height slider
      $input = $("#edit-header-side-width");
      $input.bootstrapSlider({
        step   : 5,
        min    : 50,
        max    : 500,
        tooltip: "hide",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Main Menu Hover Border Thickness
      $input = $("#edit-dropdown-width");
      $input.bootstrapSlider({
        step   : 5,
        min    : 100,
        max    : 400,
        tooltip: "hide",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Main Menu Hover Border Thickness
      $input = $("#edit-menu-border-size");
      $input.bootstrapSlider({
        step   : 1,
        min    : 1,
        max    : 20,
        tooltip: "hide",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Main Menu Hover Border Position Offset
      $input = $("#edit-menu-border-position-offset");
      $input.bootstrapSlider({
        step   : 1,
        min    : 0,
        max    : 100,
        tooltip: "hide",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Main Menu Hover Border Position Offset Sticky
      $input = $("#edit-menu-border-position-offset-sticky");
      $input.bootstrapSlider({
        step   : 1,
        min    : 0,
        max    : 100,
        tooltip: "hide",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Layout max width
      $input = $("#edit-layout-max-width");
      $input.bootstrapSlider({
        step   : 10,
        min    : 480,
        max    : 4100,
        tooltip: "hide",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Box max width
      $input = $("#edit-box-max-width");
      $input.bootstrapSlider({
        step   : 10,
        min    : 480,
        max    : 4100,
        tooltip: "hide",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Layout Gutter Horizontal
      $input = $("#edit-gutter-horizontal");
      $input.bootstrapSlider({
        step   : 1,
        min    : 0,
        max    : 100,
        tooltip: "hide",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Layout Gutter Vertical
      $input = $("#edit-gutter-vertical");
      $input.bootstrapSlider({
        step   : 1,
        min    : 0,
        max    : 100,
        tooltip: "hide",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Layout Gutter Vertical
      $input = $("#edit-gutter-container");
      $input.bootstrapSlider({
        step   : 1,
        min    : 0,
        max    : 500,
        tooltip: "hide",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Layout Gutter Horizontal Mobile
      $input = $("#edit-gutter-horizontal-mobile");
      $input.bootstrapSlider({
        step   : 1,
        min    : 0,
        max    : 100,
        tooltip: "hide",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Layout Gutter Vertical Mobile
      $input = $("#edit-gutter-vertical-mobile");
      $input.bootstrapSlider({
        step   : 1,
        min    : 0,
        max    : 100,
        tooltip: "hide",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Layout Gutter Vertical
      $input = $("#edit-gutter-container-mobile");
      $input.bootstrapSlider({
        step   : 1,
        min    : 0,
        max    : 500,
        tooltip: "hide",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Reflow layout when showing a tab
      // var $sliders = $('.slider + input');
      // $sliders.each( function() {
      //   $slider = $(this);
      //   $('.vertical-tab-button').click(function() {
      //     $slider.bootstrapSlider('relayout');
      //   });
      // });
      $(".vertical-tab-button a").click(() => {
        $(".slider + input").bootstrapSlider("relayout");
      });
      $('input[type="radio"]').change(() => {
        $(".slider + input").bootstrapSlider("relayout");
      });

      // Typographic Scale Master Slider
      $('#edit-scale-factor').change(function() {
        const base   = $('#edit-body-font-size').val();
        const factor = $(this).bootstrapSlider('getValue');

        $('#edit-h1-font-size, #edit-h1-mobile-font-size').bootstrapSlider(
          "setValue",
          base * Math.pow(factor, 4),
        ).change();

        $('#edit-h2-font-size, #edit-h2-mobile-font-size').bootstrapSlider(
          'setValue',
          base * Math.pow(factor, 3),
        ).change();

        $('#edit-h3-font-size, #edit-h3-mobile-font-size').bootstrapSlider(
          'setValue',
          base * Math.pow(factor, 2),
        ).change();

        $('#edit-h4-font-size,' +
          '#edit-h4-mobile-font-size,' +
          '#edit-blockquote-font-size,' +
          '#edit-blockquote-mobile-font-size'
        ).bootstrapSlider(
          'setValue',
          base * factor,
        ).change();
      });
    },
    handleFields() {
      const self = this;

      // Add wrappers to sliders.
      const textFields = document.querySelectorAll('.js-form-type-textfield');

      textFields.forEach(textField => {
        const divs = Array.from(textField.querySelectorAll('.slider-horizontal, .form-text:not(.dxpr_themeProcessed)'));

        if (divs.length >= 2) {
          for (let i = 0; i < divs.length; i += 2) {
            const slice = divs.slice(i, i + 2);
            const wrapper = document.createElement('div');
            wrapper.classList.add('slider-input-wrapper');
            slice.forEach(div => {
              wrapper.appendChild(div);
              div.classList.add('dxpr_themeProcessed');
            });
            textField.appendChild(wrapper);
          }
        }
      });

      document.addEventListener("change", handleDocumentEvents);
      document.addEventListener("keyup", handleDocumentEvents);

      // Add jQuery event handler for sliders.
      document.querySelectorAll('.slider').forEach((el) => {
        $(el).on('change', (e) => {
          handleDocumentEvents(e);
        });
      });

      /**
       * Handle document changes.
       */
      function handleDocumentEvents(event) {
        const el = event.target;
        const id = el?.id ?? '';
        const value = el?.value ?? '';
        const elName = el?.name ?? '';

        // Set Block Preset to Custom if any value is changed.
        if (el.closest('#edit-block-advanced')) {
          document.getElementById('edit-block-preset').value = "custom";
        }

        // Block Design Presets.
        if (id === 'edit-block-preset') {
          // Defaults.
          const setDefaults = {
            "block_border": 0,
            "block_border_color": "",
            "block_card": "",
            "block_divider": false,
            "block_divider_custom": false,
            "block_divider_length": 0,
            "block_divider_thickness": 0,
            "block_divider_spacing": 0,
            "block_padding": 0,
            "title_align": "left",
            "title_background": "",
            "title_border": 0,
            "title_border_color": "",
            "title_border_radius": 0,
            "title_card": "",
            "title_font_size": "h3",
            "title_padding": 0,

          };

          let set = {};
          switch (value) {
            case "block_boxed":
              set = {
                "block_border": 5,
                "block_border_color": "text",
                "block_padding": 15,
              }
              break;
            case "block_outline":
              set = {
                "block_border": 1,
                "block_border_color": "text",
                "block_padding": 10,
              }
              break;
            case "block_card":
              set = {
                "block_card": "card card-body",
                "title_font_size": "h3",
              };
              break;
            case "title_inverted":
              set = {
                "title_background": "text",
                "title_card": "card card-body dxpr-theme-util-background-gray",
                "title_font_size": "h3",
                "title_padding": 10,
              };
              break;
            case "title_inverted_shape":
              set = {
                "title_align": "center",
                "title_background": "text",
                "title_border_radius": 100,
                "title_card": "card card-body dxpr-theme-util-background-gray",
                "title_font_size": "h4",
                "title_padding": 10,
              };
              break;
            case "title_sticker":
              set = {
                "title_card": "card card-body dxpr-theme-util-background-gray",
                "title_font_size": "body",
                "title_padding": 10,
              };
              break;
            case "title_sticker_color":
              set = {
                "title_card": "card card-body bg-primary",
                "title_font_size": "body",
                "title_padding": 10,
              };
              break;
            case "title_outline":
              set = {
                "title_border": 1,
                "title_border_color": "text",
                "title_font_size": "h4",
                "title_padding": 15,
              };
              break;
            case "default_divider":
              set = {
                "block_divider": true,
                "block_divider_thickness": 4,
                "block_divider_spacing": 15,
              }
              break;
            case "hairline_divider":
              set = {
                "block_divider": true,
                "block_divider_thickness": 1,
                "block_divider_spacing": 15,
              };
              break;
          }

          // Add missing properties.
          for (let key in setDefaults) {
            if (!(key in set)) {
              set[key] = setDefaults[key];
            }
          }

          Object.keys(set).forEach((key) => {
            self.setFieldValue(key, set[key]);
          });
        }

        const presetClassesRemove = [
          'card', 'card-body', 'bg-primary',
          'dxpr-theme-util-background-accent1',
          'dxpr-theme-util-background-accent2',
          'dxpr-theme-util-background-black',
          'dxpr-theme-util-background-white',
          'dxpr-theme-util-background-gray'
        ];

        // Block Card Style.
        if (id === 'edit-block-card' || id === 'edit-title-card') {
          const presetClasses = value.trim().split(/\s+/);
          const target = (id === 'edit-title-card') ? '.block-title' : '.block';

          document.querySelectorAll('.region-block-design ' + target).forEach(block => {
            block.classList.remove(...presetClassesRemove);
            block.classList.add(...presetClasses.filter(className => className !== ''));
          });
        }

        // Block Regions.
        if (elName.startsWith('block_design_regions[')) {
          let blockDesignClass = 'region-block-design';
          let regionClass = '.region-' + value.replace('_', '-');
          let elRegion = document.querySelector(regionClass);
          if (!elRegion) return;

          if (el.checked) {
            elRegion.classList.add(blockDesignClass);

            // Trigger the change event for block and block title card so that
            // classes gets reapplied.
            const elements = document.querySelectorAll('#edit-block-card, #edit-title-card');
            const changeEvent = new Event('change', {
              bubbles: true,
              cancelable: true,
            });
            elements.forEach(el => {
              el.dispatchEvent(changeEvent);
            });
          }
          else {
            elRegion.classList.remove(blockDesignClass);

            // Remove all applied block and block title classes.
            let selectors = regionClass + ' .block,' + regionClass + ' .block-title';
            document.querySelectorAll(selectors).forEach(block => {
              block.classList.remove(...presetClassesRemove);
            });
          }
        }

        // Title Sticker Mode.
        if (id === 'edit-title-sticker') {
          const blockTitles = document.querySelectorAll('.region-block-design .block-title');

          blockTitles.forEach(title => {
            title.style.display = el.checked ? 'inline-block' : '';
          });
        }

        // Remove CSS vars for Block divider if not in use.
        if (id === 'edit-block-divider' || id === 'edit-block-divider-custom') {
          if (!el.checked) {
            [
              'block_divider_color',
              'block_divider_thickness',
              'block_divider_length',
              'block_divider_spacing',
            ].forEach((key) => {
              const cssVarName = key.replace(/[\[_]/g, '-');
              document.documentElement.style.removeProperty(cssVarSettingsPrefix + cssVarName);
            });
          }

          // Set default divider values.
          if (id === 'edit-block-divider' && el.checked) {
            let set = {
              "block_divider_length": 0,
              "block_divider_thickness": 4,
              "block_divider_spacing": 15,
            }
            Object.keys(set).forEach((key) => {
              self.setFieldValue(key, set[key]);
            });
          }
        }
      }

    },
    /**
     * Update field value.
     * Use jQuery due to bootstrapSlider compat.
     */
    setFieldValue(key, value) {
      const field = `[name="${key}"]`;
      let newVal  = value;

      if ($(field).parent().is('.slider-input-wrapper')) {
        $(field).bootstrapSlider('setValue', newVal).trigger('change');
      }
      else {
        if ($(field).is(':checkbox')) {
          $(field).prop('checked', newVal).trigger('change');
        }
        else if ($(field).is(':radio')) {
          $(field).filter(`[value='${newVal}']`)
            .prop('checked', true)
            .trigger('change');
        }
        else {
          $(field).val(newVal).trigger('change');
        }
      }
    },
  };

  /**
   * Provide vertical tab summaries for Bootstrap settings.
   *
   * Since the number of settings categories has grown I decided to remove
   * summaries as to lighten this navigation and clear it up.
   */
  // Drupal.behaviors.dxpr_themeSettingSummaries = {
  //   attach: function (context) {
  //     var $context = $(context);

  //     // Page Title.
  //     $context.find('#edit-page-title').drupalSetSummary(function () {
  //       var summary = [];

  //       var align = $context.find('input[name="page_title_align"]:checked');
  //       if (align.val()) {
  //         summary.push(Drupal.t('Align @align', {
  //           '@align': align.find('+label').text()
  //         }));
  //       }

  //       var animate = $context.find('input[name="page_title_animate"]:checked');
  //       if (animate.val()) {
  //         summary.push(Drupal.t('@animate', {
  //           '@animate': animate.find('+label').text()
  //         }));
  //       }

  //       if ($context.find(':input[name="page_title_breadcrumbs"]').is(':checked')) {
  //         summary.push(Drupal.t('Crumbs'));
  //       } else {
  //         summary.push(Drupal.t('No Crumbs'));
  //       }
  //       return summary.join(', ');

  //     });

  //     // Menu.
  //     $context.find('#edit-menu').drupalSetSummary(function () {
  //       var summary = [];

  //       var menu = $context.find('input[name="menu_type"]:checked');
  //       if (menu.val()) {
  //         summary.push(Drupal.t('@menu', {
  //           '@menu': menu.find('+label').text()
  //         }));
  //       }
  //       return summary.join(', ');

  //     });

  //     // Colors.
  //     $context.find('#color_scheme_form').drupalSetSummary(function () {
  //       var summary = [];

  //       var scheme = $context.find('select[name="scheme"] :selected');
  //       if (scheme.val()) {
  //         summary.push(Drupal.t('@scheme', {
  //           '@scheme': scheme.text()
  //         }));
  //       }
  //       return summary.join(', ');

  //     });

  //     // Layout.
  //     $context.find('#edit-layout').drupalSetSummary(function () {
  //       var summary = [];

  //       var layoutWidth = $context.find('input[name="layout_max_width"]');
  //       if (layoutWidth.length) {
  //         summary.push(Drupal.t('@layoutWidth', {
  //           '@layoutWidth': layoutWidth.val() + 'px'
  //         }));
  //       }

  //       return summary.join(', ');

  //     });

  //     // Header.
  //     $context.find('#edit-header').drupalSetSummary(function () {
  //       var summary = [];

  //       if ($context.find(':input[name="header_position"]').is(':checked')) {
  //         summary.push(Drupal.t('Side Header'));
  //       } else {
  //         summary.push(Drupal.t('Top Header'));
  //       }
  //       return summary.join(', ');

  //     });

  //     // Typography.
  //     $context.find('#edit-fonts').drupalSetSummary(function () {
  //       var summary = [];

  //       var typography = $context.find('select[name="body_font_face"] :selected');
  //       if (typography.val()) {
  //         summary.push(Drupal.t('Base: @typography', {
  //           '@typography': typography.text()
  //         }));
  //       }
  //       return summary.join(', ');

  //     });
  //   }
  // };
})(jQuery, Drupal, once);
