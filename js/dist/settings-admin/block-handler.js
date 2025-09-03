/* eslint-disable max-lines */
/**
 * @file
 * Handles block-related events and field updates.
 */

/**
 * Updates a field's value dynamically.
 */
function setFieldValue(key, value) {
  const field = document.querySelector(`[name="${key}"]`);
  if (!field) return;

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
}

/**
 * Apply custom style overrides for elements that have preset classes but need custom colors.
 */
function applyCustomStyleOverrides(element, type) {
  const prefix = type === "block" ? "block" : "title";

  // Check if custom background color should override preset
  const backgroundField = document.getElementById(`edit-${prefix}-background`);
  const backgroundCustomField = document.getElementById(
    `edit-${prefix}-background-custom`,
  );

  if (
    backgroundField &&
    backgroundCustomField &&
    backgroundField.value === "custom" &&
    backgroundCustomField.value
  ) {
    // Custom color overrides any preset background
    element.style.backgroundColor = backgroundCustomField.value;
  } else {
    // Remove any previous override to let CSS/preset handle it
    element.style.removeProperty("background-color");
  }

  // Check if custom border color should override preset
  const borderColorField = document.getElementById(
    `edit-${prefix}-border-color`,
  );
  const borderColorCustomField = document.getElementById(
    `edit-${prefix}-border-color-custom`,
  );

  if (
    borderColorField &&
    borderColorCustomField &&
    borderColorField.value === "custom" &&
    borderColorCustomField.value
  ) {
    element.style.borderColor = borderColorCustomField.value;
  } else {
    element.style.removeProperty("border-color");
  }
}

/**
 * Apply custom overrides when background/border settings change.
 */
function handleCustomColorChanges(event) {
  const targetElement = event.target;
  const id = targetElement?.id ?? "";

  // Handle custom background color changes
  if (id === "edit-block-background" || id === "edit-block-background-custom") {
    document
      .querySelectorAll(".region-block-design .block")
      .forEach((block) => {
        applyCustomStyleOverrides(block, "block");
      });
  }

  if (id === "edit-title-background" || id === "edit-title-background-custom") {
    document
      .querySelectorAll(".region-block-design .block-title")
      .forEach((title) => {
        applyCustomStyleOverrides(title, "title");
      });
  }

  if (
    id === "edit-block-border-color" ||
    id === "edit-block-border-color-custom"
  ) {
    document
      .querySelectorAll(".region-block-design .block")
      .forEach((block) => {
        applyCustomStyleOverrides(block, "block");
      });
  }

  if (
    id === "edit-title-border-color" ||
    id === "edit-title-border-color-custom"
  ) {
    document
      .querySelectorAll(".region-block-design .block-title")
      .forEach((title) => {
        applyCustomStyleOverrides(title, "title");
      });
  }
}

/**
 * Handles document change events for block configurations.
 *
 * @param {Event} event - The event triggered by user interaction.
 * @param {Function} updateFieldValue - A function to update field values dynamically.
 */
function handleDocumentEvents(event, updateFieldValue) {
  const targetElement = event.target;
  const id = targetElement?.id ?? "";
  const value = targetElement?.value ?? "";
  const elName = targetElement?.name ?? "";

  // Logic to set Block Preset to "Custom" if advanced block settings are changed.
  (function () {
    const blockAdvancedSection = document.querySelector("#edit-block-advanced");

    if (blockAdvancedSection) {
      blockAdvancedSection.addEventListener("change", () => {
        if (blockAdvancedSection.contains(targetElement)) {
          document.getElementById("edit-block-preset").value = "custom";
        }
      });
    }
  })();

  // Handle Block Design Presets based on selected preset.
  if (id === "edit-block-preset") {
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

    const presets = {
      block_boxed: {
        block_border: 5,
        block_border_color: "text",
        block_padding: 15,
      },
      block_outline: {
        block_border: 1,
        block_border_color: "text",
        block_padding: 10,
      },
      block_card: {
        block_card: "card card-body",
        title_font_size: "h3",
      },
      title_inverted: {
        title_background: "text",
        title_card: "card card-body dxpr-theme-util-background-gray",
        title_font_size: "h3",
        title_padding: 10,
      },
      title_inverted_shape: {
        title_align: "center",
        title_background: "text",
        title_border_radius: 100,
        title_card: "card card-body dxpr-theme-util-background-gray",
        title_font_size: "h4",
        title_padding: 10,
      },
      title_sticker: {
        title_card: "card card-body dxpr-theme-util-background-gray",
        title_font_size: "body",
        title_padding: 10,
      },
      title_sticker_color: {
        title_card: "card card-body bg-primary",
        title_font_size: "body",
        title_padding: 10,
      },
      title_outline: {
        title_border: 1,
        title_border_color: "text",
        title_font_size: "h4",
        title_padding: 15,
      },
      default_divider: {
        block_divider: true,
        block_divider_thickness: 4,
        block_divider_spacing: 15,
      },
      hairline_divider: {
        block_divider: true,
        block_divider_thickness: 1,
        block_divider_spacing: 15,
      },
    };

    const preset = presets[value] || {};
    const settings = { ...setDefaults, ...preset };

    Object.keys(settings).forEach((key) => {
      setFieldValue(key, settings[key]);
    });

    // Trigger change events for block_card and title_card to update preview
    setTimeout(() => {
      const blockCardField = document.getElementById("edit-block-card");
      const titleCardField = document.getElementById("edit-title-card");

      if (blockCardField) {
        blockCardField.dispatchEvent(
          new Event("change", {
            bubbles: true,
            cancelable: true,
          }),
        );
      }

      if (titleCardField) {
        titleCardField.dispatchEvent(
          new Event("change", {
            bubbles: true,
            cancelable: true,
          }),
        );
      }
    }, 10);
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
      .forEach((element) => {
        element.classList.remove(...presetClassesRemove);
        element.classList.add(
          ...presetClasses.filter((className) => className !== ""),
        );

        // Apply custom color overrides if they exist
        if (target === ".block") {
          applyCustomStyleOverrides(element, "block");
        } else {
          applyCustomStyleOverrides(element, "title");
        }
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

      const selectors = `${regionClass} .block,${regionClass} .block-title`;
      document.querySelectorAll(selectors).forEach((block) => {
        block.classList.remove(...presetClassesRemove);
      });
    }
  }

  if (id === "edit-title-sticker") {
    const blockTitles = document.querySelectorAll(
      ".region-block-design .block-title",
    );

    blockTitles.forEach((title) => {
      title.style.display = targetElement.checked ? "inline-block" : "";
    });
  }

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

    if (id === "edit-block-divider" && targetElement.checked) {
      const set = {
        block_divider_length: 0,
        block_divider_thickness: 4,
        block_divider_spacing: 15,
      };
      Object.keys(set).forEach((key) => {
        setFieldValue(key, set[key]);
      });
    }
  }

  // Handle custom color changes
  handleCustomColorChanges(event);
}

/**
 * Initialize block preview with current settings on page load.
 */
function initializeBlockPreview() {
  // Wait for DOM to be fully loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeBlockPreview);
    return;
  }

  // Apply current block_card and title_card settings to preview
  setTimeout(() => {
    const blockCardField = document.getElementById("edit-block-card");
    const titleCardField = document.getElementById("edit-title-card");

    if (blockCardField) {
      blockCardField.dispatchEvent(
        new Event("change", {
          bubbles: true,
          cancelable: true,
        }),
      );
    }

    if (titleCardField) {
      titleCardField.dispatchEvent(
        new Event("change", {
          bubbles: true,
          cancelable: true,
        }),
      );
    }

    // Also check if block divider is enabled
    const blockDivider = document.getElementById("edit-block-divider");
    if (blockDivider && blockDivider.checked) {
      blockDivider.dispatchEvent(
        new Event("change", {
          bubbles: true,
          cancelable: true,
        }),
      );
    }

    // Check title sticker setting
    const titleSticker = document.getElementById("edit-title-sticker");
    if (titleSticker && titleSticker.checked) {
      titleSticker.dispatchEvent(
        new Event("change", {
          bubbles: true,
          cancelable: true,
        }),
      );
    }
  }, 100);
}

// Initialize on load
initializeBlockPreview();

module.exports = {
  handleDocumentEvents,
  setFieldValue,
  initializeBlockPreview,
  applyCustomStyleOverrides,
  handleCustomColorChanges,
};
