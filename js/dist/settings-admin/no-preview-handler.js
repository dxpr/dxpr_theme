/**
 * Handles the logic for setting and removing "no-preview" icons.
 */

/**
 * Marks all fields with a "no-preview" icon, excluding specific skipped fields.
 */
function setNoPreview(setPreviewClass) {
  const systemThemeSettings = document.querySelector(".system-theme-settings");
  if (systemThemeSettings) {
    const inputs = systemThemeSettings.querySelectorAll(
      "input, select, textarea",
    );
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

    inputs.forEach((input) => {
      if (!skip.some((name) => input.name.startsWith(name))) {
        setPreviewClass(input, true);
      }
    });
  }
}

/**
 * Sets or removes "no-preview" icons on individual fields.
 */
function setPreview(name, input, setPreviewClass) {
  if (!name || !input) {
    return;
  }

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

  const oDependent = {
    boxed_layout_boxbg: "boxed_layout",
    box_max_width: "boxed_layout",
    header_top_height_scroll: "header_top_sticky",
    header_top_bg_opacity_scroll: "header_top_sticky",
    nav_font_size: "menu_type",
    nav_mobile_font_size: "menu_type",
  };

  let processed = false;
  Object.entries(oDependent).forEach(([fieldName, depFieldName]) => {
    if (fieldName === name) {
      processed = true;
      const elDep = document.querySelector(`[name="${depFieldName}"]`);

      if (elDep && elDep.type === "checkbox" && elDep.checked) {
        setPreviewClass(input, false);
      }

      if (name === "nav_font_size" || name === "nav_mobile_font_size") {
        const radio = document.querySelector(
          `[name="${depFieldName}"]:checked`,
        );
        if (radio && radio.value !== "lead") {
          setPreviewClass(input, false);
        }
      }
    }
  });

  if (!processed) {
    setPreviewClass(input, false);
  }
}

/**
 * Retrieves the label or legend associated with an input field.
 */
function getLabel(input) {
  let label = null;

  const fieldset = input.closest("fieldset");
  if (fieldset) {
    label = fieldset.querySelector("legend");
  } else {
    const formItem = input.closest(".form-item");
    if (formItem) {
      label = formItem.querySelector("label");
    }
  }
  return label;
}

/**
 * Adds or removes the "no-preview" class from the input's label.
 */
function updatePreviewClass(input, action) {
  const label = getLabel(input);
  if (!label) return;

  if (action) {
    label.classList.add("no-preview");
  } else {
    label.classList.remove("no-preview");
  }
}

module.exports = { setNoPreview, setPreview, updatePreviewClass };
