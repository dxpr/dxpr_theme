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
          el.addEventListener("change", (e) => {
            this.fieldHandler(e);
          });

          // Add handler also to potential "_custom" fields.
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
      const systemThemeSettings = document.querySelector(".system-theme-settings");
      if (systemThemeSettings) {
        const inputs = systemThemeSettings.querySelectorAll("input, select, textarea");
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
            const radio = document.querySelector(`[name="${depFieldName}"]:checked`);
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

      let p1, p2, p3;

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
      const textValue = event.target.parentElement.textContent;
      const unit = textValue.replace(/[^a-z]/gi, "");
      const validUnits = ["px", "em", "rem"];
      let value = event.target.value;

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
      this.root.style.setProperty(`${cssVarSettingsPrefix}${cssVarName}`, String(value));

      // Workaround for block divider position.
      // Adds a divider-position-block CSS variable.
      if (setting === "divider_position") {
        if (event.target.value === "3") {
          value = "calc(100% - var(--dxt-setting-block-divider-length))";
        }
        this.root.style.setProperty(`${cssVarSettingsPrefix}${cssVarName}-block`, String(value));
      }

      // Add mobile title font size variable.
      if (setting === "title_font_size") {
        value = value.replace("-font-size", "-mobile-font-size");
        this.root.style.setProperty(`${cssVarSettingsPrefix}${cssVarName}-mobile`, String(value));
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
          if (drupalSettings.dxpr_themeSettings.colors.palette.hasOwnProperty(value)) {
            value = `var(${cssVarColorsPrefix + value})`;
          } else if (value === "custom") {
            const customField = document.querySelector(`[name="${setting}_custom"]`);
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
            !styleSheet.href || styleSheet.href.startsWith(window.location.origin)
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
    }
  };

  /**
   * Provide vertical tab summaries for Bootstrap settings.
   */
  /* eslint-disable */
  Drupal.behaviors.dxpr_themeSettingsControls = {
    attach: function (context, settings) {
      // Selektiranje svih ciljnih inputa jednom po učitavanju stranice.
      once('dxpr-settings-controls', 'html', context).forEach(function () {
        const opacitySelectors = [
          "#edit-header-top-bg-opacity-scroll",
          "#edit-header-top-bg-opacity",
          "#edit-header-side-bg-opacity",
          "#edit-side-header-background-opacity",
          "#edit-page-title-image-opacity",
          "#edit-header-top-opacity",
          "#edit-header-top-opacity-scroll",
          "#edit-menu-full-screen-opacity"
        ];

        opacitySelectors.forEach(function (selector) {
          const originalInput = document.querySelector(selector);
          if (originalInput) {
            transformToDXBSlider(originalInput);
          }
        });
      });

      function transformToDXBSlider(inputElement) {
        // Kreiranje wrappera
        const wrapper = document.createElement('div');
        wrapper.classList.add('dxb-slider-wrapper');

        const track = document.createElement('div');
        track.classList.add('dxb-slider-track');

        // Postavljanje atributa na input
        inputElement.type = 'range';
        inputElement.classList.add('dxb-slider');
        inputElement.setAttribute('data-dxb-slider', '');
        inputElement.setAttribute('min', '0');
        inputElement.setAttribute('max', '1');
        inputElement.setAttribute('step', '0.01');
        inputElement.setAttribute('aria-labelledby', 'fontSizeLabel');
        inputElement.setAttribute('aria-valuemin', '0');
        inputElement.setAttribute('aria-valuemax', '1');
        inputElement.setAttribute('aria-valuenow', inputElement.value);

        // Kreiranje inputa za brojčanu vrijednost
        const numberInput = document.createElement('input');
        numberInput.type = 'number';
        numberInput.className = 'dxb-slider-value';
        numberInput.setAttribute('aria-hidden', 'true');
        numberInput.setAttribute('tabindex', '-1');
        numberInput.setAttribute('pattern', '[0-9]*');
        numberInput.setAttribute('inputmode', 'decimal');
        numberInput.min = '0';
        numberInput.max = '1';
        numberInput.step = '0.01';
        numberInput.value = inputElement.value;

        // Omotavanje inputa u wrapper
        inputElement.parentNode.insertBefore(wrapper, inputElement);
        wrapper.appendChild(track);
        track.appendChild(inputElement);
        wrapper.appendChild(numberInput);

        // Funkcija za ažuriranje vrijednosti
        function updateValue() {
          const val = inputElement.value;
          const min = inputElement.min;
          const max = inputElement.max;
          const percent = (val - min) / (max - min) * 100;
          inputElement.style.setProperty('--value-percent', `${percent}%`);
          numberInput.value = val;
          inputElement.setAttribute('aria-valuenow', val);
        }

        inputElement.addEventListener('input', updateValue);
        numberInput.addEventListener('input', () => {
          inputElement.value = numberInput.value;
          updateValue();
        });

        // Inicijalno postavljanje vrijednosti
        updateValue();
      }
    }
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
})(Drupal, once);
