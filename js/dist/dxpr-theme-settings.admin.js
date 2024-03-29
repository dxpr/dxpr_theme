(function ($, Drupal) {
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
      if (once("dxpr-color-init", "html").length) {
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
    attach(context) {
      if (once("dxpr-settings-init", "html").length) {
        this.init();
      }
    },
    init() {
      const settings = this.getCssVariables();

      this.toggleElement("page_title_breadcrumbs", "header ol.breadcrumb");

      Object.keys(settings).forEach((setting) => {
        const inputId = this.getInputId(setting);
        const els = document.querySelectorAll(`[name="${inputId}"]`);

        // Use jQuery to handle bootstrapSlider events.
        els.forEach((el) => {
          $(el).on("change", (e) => {
            this.fieldHandler(e);
          });
        });
      });
    },
    getInputId(setting) {
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
      const root = document.documentElement;
      const {
        name: setting,
        parentElement: { textContent: textValue }
      } = event.target;
      let { value } = event.target;

      if (event.target.type === "checkbox") {
        value = event.target.checked;
      }

      // Use textValue if possible as it includes the unit suffix.
      if (textValue.startsWith(value)) {
        value = textValue;
      }

      value = this.massageValue(setting, value);

      // Override CSS variable.
      root.style.setProperty(
        cssVarSettingsPrefix + setting.replace(/\[|_/g, "-").replace("]", ""),
        String(value),
      );
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
        // Generic: Add Quotes
        case "page_title_breadcrumbs_separator":
          value = `"${value}"`;
          break;
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
        case "divider_length":
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
        default:
          break;
      }
      return value;
    },
    /**
     * Returns all dxpr settings CSS variables.
     *
     * @returns {{}}
     */
    getCssVariables() {
      const styles = window.getComputedStyle(document.documentElement);
      const cssVariables = {};
      for (let i = 0; i < styles.length; i++) {
        const property = styles[i];
        if (property.startsWith(cssVarSettingsPrefix)) {
          cssVariables[property] = styles.getPropertyValue(property);
        }
      }
      return cssVariables;
    },
    /**
     * Toggles show/hide of an element based on a field status.
     *
     * @param toggle    Field name to use as toggle.
     * @param selector  CSS Selector for element to toggle.
     */
    toggleElement(toggle, selector) {
      const cb = document.querySelector(`input[name="${toggle}"]`);
      const el = document.querySelector(selector);

      el.style.display = cb.checked ? "block" : "none";

      cb.addEventListener("change", () => {
        el.style.display = cb.checked ? "block" : "none";
      });
    },
  };

  /**
   * Provide vertical tab summaries for Bootstrap settings.
   */
  /* eslint-disable */
  Drupal.behaviors.dxpr_themeSettingsControls = {
    attach(context) {
      $("#system-theme-settings h2 > small").addClass("form-header");
      var $input = "";
      // JQuery once is not working..
      $("#system-theme-settings .form-type-radio .control-label")
        .not(".dxpr_themeProcessed")
        .each(function () {
          $(this).addClass("dxpr_themeProcessed");
          $input = $(this).find("input").remove();
          $(this).wrapInner('<span class="dxpr-theme-label">').prepend($input);
        });

      function dxpr_theme_map_color(color) {
        if (color in drupalSettings.dxpr_themeSettings.colors.palette) {
          color = `var(${cssVarColorsPrefix + color})`;
        }
        return color;
      }

      // BOOTSTRAP SLIDER CONFIG

      // Opacity Sliders
      const $opacitySliders = $(
        "#edit-header-top-bg-opacity-scroll, #edit-header-top-bg-opacity, #edit-header-side-bg-opacity, #edit-side-header-background-opacity,#edit-page-title-image-opacity,#edit-header-top-opacity,#edit-header-top-opacity-scroll,#edit-menu-full-screen-opacity"
      );
      var startValue = 1;
      $opacitySliders.each(function () {
        startValue = $(this).val();
        $(this).bootstrapSlider({
          step: 0.01,
          min: 0,
          max: 1,
          tooltip: "show",
          value: parseFloat(startValue),
        });
      });

      // Line Height Sliders
      var $lhSliders = $(".line-height-slider");
      var startValue = 1;
      $lhSliders.each(function () {
        startValue = $(this).val();
        $(this).bootstrapSlider({
          step: 0.1,
          min: 0,
          max: 3,
          tooltip: "show",
          formatter(value) {
            return `${value}em`;
          },
          value: parseFloat(startValue),
        });
      });

      // Border Size Sliders
      var $lhSliders = $(".border-size-slider");
      var startValue = 1;
      $lhSliders.each(function () {
        startValue = $(this).val();
        $(this).bootstrapSlider({
          step: 1,
          min: 0,
          max: 30,
          tooltip: "show",
          formatter(value) {
            return `${value}px`;
          },
          value: parseFloat(startValue),
        });
      });

      // Border Radius Sliders
      var $lhSliders = $(".border-radius-slider");
      var startValue = 1;
      $lhSliders.each(function () {
        startValue = $(this).val();
        $(this).bootstrapSlider({
          step: 1,
          min: 0,
          max: 100,
          tooltip: "show",
          formatter(value) {
            return `${value}px`;
          },
          value: parseFloat(startValue),
        });
      });

      // Body Font Size
      var $input = $("#edit-body-font-size");
      $input.bootstrapSlider({
        step: 1,
        min: 8,
        max: 30,
        tooltip: "show",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Nav Font Size
      $input = $("#edit-nav-font-size");
      $input.bootstrapSlider({
        step: 1,
        min: 8,
        max: 30,
        tooltip: "show",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Body Mobile Font Size
      $input = $("#edit-body-mobile-font-size");
      $input.bootstrapSlider({
        step: 1,
        min: 8,
        max: 30,
        tooltip: "show",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Nav Mobile Font Size
      $input = $("#edit-nav-mobile-font-size");
      $input.bootstrapSlider({
        step: 1,
        min: 8,
        max: 30,
        tooltip: "show",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Other Font Sizes
      const $fsSliders = $(".font-size-slider");
      var startValue = 1;
      $fsSliders.each(function () {
        startValue = $(this).val();
        $(this).bootstrapSlider({
          step: 1,
          min: 8,
          max: 100,
          tooltip: "show",
          formatter(value) {
            return `${value}px`;
          },
          value: parseFloat(startValue),
        });
      });

      // Scale Factor
      $input = $("#edit-scale-factor");
      $input.bootstrapSlider({
        step: 0.01,
        min: 1,
        max: 2,
        tooltip: "show",
        value: parseFloat($input.val()),
      });

      // Divider Thickness
      $input = $("#edit-divider-thickness");
      $input.bootstrapSlider({
        step: 1,
        min: 0,
        max: 20,
        tooltip: "show",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Divider Thickness
      $input = $("#edit-block-divider-thickness");
      $input.bootstrapSlider({
        step: 1,
        min: 0,
        max: 20,
        tooltip: "show",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Divider Length
      $input = $("#edit-divider-length");
      $input.bootstrapSlider({
        step: 10,
        min: 0,
        max: 500,
        tooltip: "show",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Divider Length
      $input = $("#edit-block-divider-length");
      $input.bootstrapSlider({
        step: 10,
        min: 0,
        max: 500,
        tooltip: "show",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      function formatPosition(pos) {
        let label = Drupal.t("Left");
        if (pos == 2) label = Drupal.t("Center");
        if (pos == 3) label = Drupal.t("Right");
        return label;
      }

      // Divider Position
      $input = $("#edit-divider-position");
      $input.bootstrapSlider({
        step: 1,
        min: 1,
        max: 3,
        selection: "none",
        tooltip: "show",
        formatter: formatPosition,
        value: parseFloat($input.val()),
      });

      // Headings letter spacing
      $input = $("#edit-headings-letter-spacing");
      $input.bootstrapSlider({
        step: 0.01,
        min: -0.1,
        max: 0.3,
        tooltip: "show",
        formatter(value) {
          return `${value}em`;
        },
        value: parseFloat($input.val()),
      });

      // Block Design Divider Spacing
      $input = $("#edit-block-divider-spacing");
      $input.bootstrapSlider({
        step: 1,
        min: 0,
        max: 100,
        tooltip: "show",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Page Title height
      $input = $("#edit-page-title-height");
      $input.bootstrapSlider({
        step: 5,
        min: 50,
        max: 500,
        tooltip: "show",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Header height slider
      $input = $("#edit-header-top-height");
      $input.bootstrapSlider({
        step: 1,
        min: 10,
        max: 200,
        tooltip: "show",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Header Mobile Breakpoint slider
      $input = $("#edit-header-mobile-breakpoint");
      $input.bootstrapSlider({
        step: 10,
        min: 480,
        max: 4100,
        tooltip: "show",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Header Mobile height slider
      $input = $("#edit-header-mobile-height");
      $input.bootstrapSlider({
        step: 1,
        min: 10,
        max: 200,
        tooltip: "show",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Header after-scroll height slider
      $input = $("#edit-header-top-height-scroll");
      $input.bootstrapSlider({
        step: 1,
        min: 10,
        max: 200,
        tooltip: "show",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Sticky header scroll offset
      $input = $("#edit-header-top-height-sticky-offset");
      $input.bootstrapSlider({
        step: 10,
        min: 0,
        max: 2096,
        tooltip: "show",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Side Header after-scroll height slider
      $input = $("#edit-header-side-width");
      $input.bootstrapSlider({
        step: 5,
        min: 50,
        max: 500,
        tooltip: "show",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Main Menu Hover Border Thickness
      $input = $("#edit-dropdown-width");
      $input.bootstrapSlider({
        step: 5,
        min: 100,
        max: 400,
        tooltip: "show",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Main Menu Hover Border Thickness
      $input = $("#edit-menu-border-size");
      $input.bootstrapSlider({
        step: 1,
        min: 1,
        max: 20,
        tooltip: "show",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Main Menu Hover Border Position Offset
      $input = $("#edit-menu-border-position-offset");
      $input.bootstrapSlider({
        step: 1,
        min: 0,
        max: 100,
        tooltip: "show",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Main Menu Hover Border Position Offset Sticky
      $input = $("#edit-menu-border-position-offset-sticky");
      $input.bootstrapSlider({
        step: 1,
        min: 0,
        max: 100,
        tooltip: "show",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Layout max width
      $input = $("#edit-layout-max-width");
      $input.bootstrapSlider({
        step: 10,
        min: 480,
        max: 4100,
        tooltip: "show",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Box max width
      $input = $("#edit-box-max-width");
      $input.bootstrapSlider({
        step: 10,
        min: 480,
        max: 4100,
        tooltip: "show",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Layout Gutter Horizontal
      $input = $("#edit-gutter-horizontal");
      $input.bootstrapSlider({
        step: 1,
        min: 0,
        max: 100,
        tooltip: "show",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Layout Gutter Vertical
      $input = $("#edit-gutter-vertical");
      $input.bootstrapSlider({
        step: 1,
        min: 0,
        max: 100,
        tooltip: "show",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Layout Gutter Vertical
      $input = $("#edit-gutter-container");
      $input.bootstrapSlider({
        step: 1,
        min: 0,
        max: 500,
        tooltip: "show",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Layout Gutter Horizontal Mobile
      $input = $("#edit-gutter-horizontal-mobile");
      $input.bootstrapSlider({
        step: 1,
        min: 0,
        max: 100,
        tooltip: "show",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Layout Gutter Vertical Mobile
      $input = $("#edit-gutter-vertical-mobile");
      $input.bootstrapSlider({
        step: 1,
        min: 0,
        max: 100,
        tooltip: "show",
        formatter(value) {
          return `${value}px`;
        },
        value: parseFloat($input.val()),
      });

      // Layout Gutter Vertical
      $input = $("#edit-gutter-container-mobile");
      $input.bootstrapSlider({
        step: 1,
        min: 0,
        max: 500,
        tooltip: "show",
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
      let base = 14;
      let factor = 1.25;
      $("#edit-scale-factor").change(function () {
        base = $("#edit-body-font-size").val();
        factor = $(this).bootstrapSlider("getValue");
        $("#edit-h1-font-size, #edit-h1-mobile-font-size")
          .bootstrapSlider("setValue", base * Math.pow(factor, 4))
          .change();
        $("#edit-h2-font-size, #edit-h2-mobile-font-size")
          .bootstrapSlider("setValue", base * Math.pow(factor, 3))
          .change();
        $("#edit-h3-font-size, #edit-h3-mobile-font-size")
          .bootstrapSlider("setValue", base * Math.pow(factor, 2))
          .change();
        $(
          "#edit-h4-font-size, #edit-h4-mobile-font-size, #edit-blockquote-font-size, #edit-blockquote-mobile-font-size"
        )
          .bootstrapSlider("setValue", base * factor)
          .change();
      });

      // Block Design Preset Loader
      let preset = "";
      $("#edit-block-preset").bind("keyup change", function () {
        // Reset defaults
        $("#edit-block-advanced .slider + .form-text").bootstrapSlider(
          "setValue",
          0
        );
        $("#edit-block-divider-thickness").bootstrapSlider(
          "setValue",
          parseInt($("#edit-divider-thickness").val())
        );
        $("#edit-block-divider-length").bootstrapSlider(
          "setValue",
          parseInt($("#edit-divider-length").val())
        );
        $("#edit-block-divider-spacing").bootstrapSlider("setValue", 10);
        $(
          "#edit-block-background-custom, #edit-title-background-custom, #edit-block-divider-color-custom"
        ).val("");
        $("#edit-block-advanced select").val("");
        $("#edit-title-align-left").prop("checked", true);
        $("#edit-title-font-size-h2").prop("checked", true);

        // Set presets
        preset = $(this).val();
        switch (preset) {
          case "block_boxed":
            $("#edit-block-padding").bootstrapSlider("setValue", 15);
            $("#edit-block-border").bootstrapSlider("setValue", 5);
            $("#edit-block-border-color").val("text");
            break;
          case "block_outline":
            $("#edit-block-padding").bootstrapSlider("setValue", 15);
            $("#edit-block-border").bootstrapSlider("setValue", 1);
            $("#edit-block-border-color").val("text");
            break;
          case "block_card":
            $("#edit-block-card").val("card card-body");
            $("#edit-title-font-size-h3").prop("checked", true);
            break;
          case "title_inverted":
            $("#edit-title-background").val("text");
            $("#edit-title-card").val(
              "card card-body dxpr-theme-util-background-gray"
            );
            $("#edit-title-padding").bootstrapSlider("setValue", 10);
            $("#edit-title-font-size-h3").prop("checked", true);
            break;
          case "title_inverted_shape":
            $("#edit-title-background").val("text");
            $("#edit-title-card").val(
              "card card-body dxpr-theme-util-background-gray"
            );
            $("#edit-title-padding").bootstrapSlider("setValue", 10);
            $("#edit-title-border-radius").bootstrapSlider("setValue", 100);
            $("#edit-title-font-size-h4").prop("checked", true);
            $("#edit-title-align-center").prop("checked", true);
            break;
          case "title_sticker":
            $("#edit-title-card").val(
              "card card-body dxpr-theme-util-background-gray"
            );
            $("#edit-title-padding").bootstrapSlider("setValue", 10);
            $("#edit-title-font-size-body").prop("checked", true);
            break;
          case "title_sticker_color":
            $("#edit-title-font-size-body").prop("checked", true);
            $("#edit-title-padding").bootstrapSlider("setValue", 10);
            $("#edit-title-card").val("card card-body bg-primary");
            break;
          case "title_outline":
            $("#edit-title-padding").bootstrapSlider("setValue", 15);
            $("#edit-title-border").bootstrapSlider("setValue", 1);
            $("#edit-title-border-color").val("text");
            $("#edit-title-font-size-h4").prop("checked", true);
            break;
          case "hairline_divider":
            $("#edit-block-divider-thickness").bootstrapSlider("setValue", 1);
            break;
        }
        $("#edit-block-advanced input, #edit-block-advanced select").trigger(
          "change"
        );
        if ($("#edit-block-padding").val() == 0) {
          $("#edit-block .block").css("padding", "");
        }
        if ($("#edit-title-padding").val() == 0) {
          $("#edit-block .block-title").css("padding", "");
        }
        $(this).val(preset);
      });

      /**
       * Typography Preview
       */
      const typoDividerColor = document.querySelector("#edit-divider-color");
      const typoDividerColorCustom = document.querySelector("#edit-divider-color-custom");
      const typoDividerPreviewEl = document.querySelector(".type-preview hr");

      typoDividerColor.addEventListener("change", () => {
        typoDividerPreviewEl.style.borderTopColor = dxpr_theme_map_color(typoDividerColor.value);
      });
      typoDividerColorCustom.addEventListener("keyup change", () => {
        typoDividerPreviewEl.style.borderTopColor = typoDividerColorCustom.value;
      });

      // BLOCK DESIGN LIVE PREVIEW
      let value = "";
      $("#edit-block-advanced").bind("keyup change", () => {
        $("#edit-block-preset").val("custom");
      });

      $("#edit-block-card").change(function () {
        $(".block-preview .block").removeClass(
          "card card-body bg-primary dxpr-theme-util-background-accent1 dxpr-theme-util-background-accent2 dxpr-theme-util-background-black dxpr-theme-util-background-white dxpr-theme-util-background-gray"
        );
        $(".block-preview .block").addClass($(this).val());
      });
      $("#edit-block-background").change(function () {
        $(".block-preview .block").css(
          "background-color",
          dxpr_theme_map_color($(this).val())
        );
      });
      $("#edit-block-background-custom").change(function () {
        $(".block-preview .block").css("background-color", $(this).val());
      });
      $("#edit-block-padding").bind("keyup change", function () {
        $(".block-preview .block").css(
          "padding",
          `${$(this).bootstrapSlider("getValue")}px`
        );
      });
      $("#edit-block-border").change(function () {
        $(".block-preview .block").css(
          "border-width",
          `${$(this).bootstrapSlider("getValue")}px`
        );
        if ($(this).bootstrapSlider("getValue") > 0) {
          $(".block-preview .block").css("border-style", "solid");
        }
      });
      $("#edit-block-border-color").change(function () {
        $(".block-preview .block").css(
          "border-color",
          dxpr_theme_map_color($(this).val())
        );
      });
      $("#edit-block-border-color-custom").bind("keyup change", function () {
        $(".block-preview .block").css("border-color", $(this).val());
      });
      $("#edit-block-border-radius").change(function () {
        $(".block-preview .block").css(
          "border-radius",
          `${$(this).bootstrapSlider("getValue")}px`
        );
      });
      // Block title
      $("#edit-title-card").change(function () {
        $(".block-preview .block-title").removeClass(
          "card card-body bg-primary dxpr-theme-util-background-accent1 dxpr-theme-util-background-accent2 dxpr-theme-util-background-black dxpr-theme-util-background-white dxpr-theme-util-background-gray"
        );
        $(".block-preview .block-title").addClass($(this).val());
      });
      $("#edit-title-font-size").change(function () {
        // Retrieve the matching font size from the typography settings
        value = $(this).find(":checked").val();
        value = `#edit-${value}-font-size`;
        value = $(value).val();
        $(".block-preview .block-title").css("font-size", `${value}px`);
      });
      $("#edit-title-align").change(function () {
        $(".block-preview .block-title").css(
          "text-align",
          $(this).find(":checked").val()
        );
      });
      $("#edit-title-background").change(function () {
        $(".block-preview .block-title").css(
          "background-color",
          dxpr_theme_map_color($(this).val())
        );
      });
      $("#edit-title-background-custom").bind("keyup change", function () {
        $(".block-preview .block-title").css("background-color", $(this).val());
      });
      $("#edit-title-sticker").click(function () {
        if ($(this).prop("checked") == true) {
          $(".block-preview .block-title").css("display", "inline-block");
        } else {
          $(".block-preview .block-title").css("display", "block");
        }
      });
      $("#edit-title-padding").change(function () {
        $(".block-preview .block-title").css(
          "padding",
          `${$(this).bootstrapSlider("getValue")}px`
        );
      });
      $("#edit-title-border").change(function () {
        $(".block-preview .block-title").css(
          "border-width",
          `${$(this).bootstrapSlider("getValue")}px`
        );
        if ($(this).bootstrapSlider("getValue") > 0) {
          $(".block-preview .block-title").css("border-style", "solid");
        }
      });
      $("#edit-title-border-radius").change(function () {
        $(".block-preview .block-title").css(
          "border-radius",
          `${$(this).bootstrapSlider("getValue")}px`
        );
      });
      $("#edit-title-border-color").change(function () {
        $(".block-preview .block-title").css(
          "border-color",
          dxpr_theme_map_color($(this).val())
        );
      });
      $("#edit-title-border-color-custom").bind("keyup change", function () {
        $(".block-preview .block-title").css("border-color", $(this).val());
      });
      // Block divider
      if ($("#edit-block-divider:checked").length == 0) {
        $(".block-preview hr").hide();
      }
      $("#edit-block-divider").click(function () {
        if ($(this).prop("checked") == true) {
          $(".block-preview hr").show();
        } else {
          $(".block-preview hr").hide();
        }
      });
      $("#edit-block-divider-color").change(function () {
        $(".block-preview hr").css(
          "background-color",
          dxpr_theme_map_color($(this).val())
        );
      });
      $("#edit-block-divider-color-custom").bind("keyup change", function () {
        $(".block-preview hr").css("background-color", $(this).val());
      });
      $("#edit-block-divider-thickness").change(function () {
        $(".block-preview hr").css(
          "height",
          `${$(this).bootstrapSlider("getValue")}px`
        );
      });
      $("#edit-block-divider-length").change(function () {
        if ($(this).bootstrapSlider("getValue") > 0) {
          $(".block-preview hr").css(
            "width",
            `${$(this).bootstrapSlider("getValue")}px`
          );
        } else {
          $(".block-preview hr").css("width", "100%");
        }
      });
      $("#edit-block-divider-spacing").change(function () {
        $(".block-preview hr").css(
          "margin-top",
          `${$(this).bootstrapSlider("getValue")}px`
        );
        $(".block-preview hr").css(
          "margin-bottom",
          `${$(this).bootstrapSlider("getValue")}px`
        );
      });
      $(".js-form-type-textfield").each(function () {
        const divs = $(this)
          .find(".slider-horizontal,.form-text")
          .not(".dxpr_themeProcessed");
        if (divs.length >= 2) {
          for (let i = 0; i < divs.length; i += 2) {
            divs
              .slice(i, i + 2)
              .wrapAll("<div class='slider-input-wrapper'></div>")
              .addClass("dxpr_themeProcessed");
          }
        }
      });
    },
  };
  /* eslint-enable */

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
})(jQuery, Drupal);
