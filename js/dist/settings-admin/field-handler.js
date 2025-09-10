/**
 * Tweak certain settings to valid values.
 *
 * @param setting
 * @param value
 * @param cssVarColorsPrefix
 * @returns {string}
 */
function massageFieldValue(setting, value, cssVarColorsPrefix) {
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
}

/**
 * Handles the change event for form fields.
 *
 * @param event
 * @param root
 * @param cssVarSettingsPrefix
 * @param massageValue
 */
function fieldHandler(event, root, cssVarSettingsPrefix, massageValue) {
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

  value = massageFieldValue(setting, value);

  // Create CSS variable name.
  const cssVarName = setting
    .replace("_custom", "")
    .replace(/[[_]/g, "-")
    .replace("]", "");

  // Override CSS variable.
  root.style.setProperty(`${cssVarSettingsPrefix}${cssVarName}`, String(value));

  // Workaround for block divider position.
  if (setting === "divider_position") {
    if (event.target.value === "3") {
      value = "calc(100% - var(--dxt-setting-block-divider-length))";
    }
    root.style.setProperty(
      `${cssVarSettingsPrefix}${cssVarName}-block`,
      String(value),
    );
  }

  // Add mobile title font size variable.
  if (setting === "title_font_size") {
    value = value.replace("-font-size", "-mobile-font-size");
    root.style.setProperty(
      `${cssVarSettingsPrefix}${cssVarName}-mobile`,
      String(value),
    );
  }
}

module.exports = { fieldHandler, massageFieldValue };
