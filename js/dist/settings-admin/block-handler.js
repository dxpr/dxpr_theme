/**
 * @file
 * Handles block-related events and field updates.
 */

/**
 * Handles document change events for block configurations.
 *
 * @param {Event} event - The event triggered by user interaction.
 * @param {Function} setFieldValue - A function to update field values dynamically.
 */
function handleDocumentEvents(event, setFieldValue) {
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
}

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

module.exports = { handleDocumentEvents, setFieldValue };
