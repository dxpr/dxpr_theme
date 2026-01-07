/**
 * @file
 * Google Fonts dynamic loader for live preview.
 */

// Track loaded fonts to avoid duplicate requests.
const loadedFonts = new Set();

// Delay timers per font field.
const delayTimers = {};

// Delay duration in milliseconds.
const DELAY_DURATION = 300;

// Default fallback font stack.
const DEFAULT_FONT_STACK =
  'Arial, Helvetica, "Nimbus Sans L", "Liberation Sans", "FreeSans", sans-serif';

/**
 * Get web-safe font stacks from drupalSettings (single source of truth from PHP).
 *
 * @returns {object} - Font stacks mapping.
 */
function getWebSafeFontStacks() {
  return (
    (typeof drupalSettings !== "undefined" &&
      drupalSettings.dxpr_themeSettings &&
      drupalSettings.dxpr_themeSettings.fontStacks) ||
    {}
  );
}

/**
 * Parse a font key into family and variant.
 *
 * Font key format: "0FontFamily:variant" (Google) or "1theme|path|name" (Local)
 *
 * @param {string} fontKey - The font key from the select field.
 * @returns {object|null} - Object with family, variant, weight, style, or null if invalid.
 */
function parseFontKey(fontKey) {
  if (!fontKey || typeof fontKey !== "string") {
    return null;
  }

  const prefix = fontKey.charAt(0);

  // Google font (prefix "0").
  if (prefix === "0") {
    const fontPart = fontKey.substring(1);
    const [familyEncoded, variant = ""] = fontPart.split(":");
    const family = familyEncoded.replace(/\+/g, " ");

    // Parse variant into weight and style.
    let weight = "400";
    let style = "normal";

    if (variant) {
      // Extract numeric weight.
      const weightMatch = variant.match(/(\d+)/);
      if (weightMatch) {
        [, weight] = weightMatch;
      }

      // Check for italic.
      if (variant.includes("italic")) {
        style = "italic";
      }
    }

    return { type: "google", family, variant, weight, style };
  }

  // Local font (prefix "1").
  if (prefix === "1") {
    const parts = fontKey.substring(1).split("|");
    if (parts.length >= 3) {
      return {
        type: "local",
        family: parts[2],
        weight: "400",
        style: "normal",
      };
    }
  }

  // Web-safe font (no prefix).
  return { type: "websafe", family: fontKey, weight: "400", style: "normal" };
}

/**
 * Build Google Fonts CSS API URL.
 *
 * @param {string} family - Font family name.
 * @param {string} variant - Font variant (weight + style).
 * @returns {string} - Google Fonts CSS URL.
 */
function buildGoogleFontsUrl(family, variant) {
  const familyEncoded = family.replace(/ /g, "+");

  // Build weight specification.
  let weightSpec = "";
  if (variant) {
    const weightMatch = variant.match(/(\d+)/);
    const weight = weightMatch ? weightMatch[1] : "400";
    const isItalic = variant.includes("italic");

    if (isItalic) {
      weightSpec = `:ital,wght@1,${weight}`;
    } else {
      weightSpec = `:wght@${weight}`;
    }
  }

  return `https://fonts.googleapis.com/css2?family=${familyEncoded}${weightSpec}&display=swap`;
}

/**
 * Load a Google Font dynamically.
 *
 * @param {string} family - Font family name.
 * @param {string} variant - Font variant.
 * @returns {Promise} - Resolves when font is loaded.
 */
function loadGoogleFont(family, variant) {
  const fontId = `${family}:${variant}`;

  // Skip if already loaded.
  if (loadedFonts.has(fontId)) {
    return Promise.resolve();
  }

  const url = buildGoogleFontsUrl(family, variant);
  const linkId = `google-font-${family.replace(/ /g, "-")}-${variant || "regular"}`;

  // Check if link already exists.
  if (document.getElementById(linkId)) {
    loadedFonts.add(fontId);
    return Promise.resolve();
  }

  return new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.id = linkId;
    link.rel = "stylesheet";
    link.href = url;

    link.onload = () => {
      loadedFonts.add(fontId);
      resolve();
    };

    link.onerror = () => {
      // eslint-disable-next-line no-console
      console.warn(`Failed to load font: ${family}`);
      reject(new Error(`Failed to load font: ${family}`));
    };

    document.head.appendChild(link);
  });
}

/**
 * Get CSS font-family value for a font key.
 *
 * @param {string} fontKey - The font key.
 * @returns {string} - CSS font-family value.
 */
function getFontFamilyValue(fontKey) {
  const parsed = parseFontKey(fontKey);

  if (!parsed) {
    return "";
  }

  // For web-safe fonts, return the full font stack from drupalSettings.
  if (parsed.type === "websafe") {
    const fontStacks = getWebSafeFontStacks();
    return fontStacks[fontKey] || DEFAULT_FONT_STACK;
  }

  // For Google/local fonts, return quoted font family with fallback.
  return `"${parsed.family}", -apple-system, BlinkMacSystemFont, sans-serif`;
}

/**
 * Get CSS font-weight value for a font key.
 *
 * @param {string} fontKey - The font key.
 * @returns {string} - CSS font-weight value.
 */
function getFontWeightValue(fontKey) {
  const parsed = parseFontKey(fontKey);
  return parsed ? parsed.weight : "400";
}

/**
 * Get CSS font-style value for a font key.
 *
 * @param {string} fontKey - The font key.
 * @returns {string} - CSS font-style value.
 */
function getFontStyleValue(fontKey) {
  const parsed = parseFontKey(fontKey);
  return parsed ? parsed.style : "normal";
}

/**
 * Handle font field change with debouncing.
 *
 * @param {string} fieldName - The field name.
 * @param {string} fontKey - The selected font key.
 * @param {function} callback - Callback to execute after font loads.
 */
function handleFontChange(fieldName, fontKey, callback) {
  // Clear existing delay timer.
  if (delayTimers[fieldName]) {
    clearTimeout(delayTimers[fieldName]);
  }

  delayTimers[fieldName] = setTimeout(() => {
    const parsed = parseFontKey(fontKey);

    if (!parsed) {
      callback(fontKey);
      return;
    }

    // For Google fonts, load first then callback.
    if (parsed.type === "google") {
      loadGoogleFont(parsed.family, parsed.variant)
        .then(() => callback(fontKey))
        .catch(() => callback(fontKey)); // Still apply even if load fails.
    } else {
      // For local/web-safe fonts, callback immediately.
      callback(fontKey);
    }
  }, DELAY_DURATION);
}

/**
 * Check if a field is a font face field.
 *
 * @param {string} fieldName - The field name.
 * @returns {boolean} - True if this is a font face field.
 */
function isFontFaceField(fieldName) {
  const fontFields = [
    "body_font_face",
    "headings_font_face",
    "nav_font_face",
    "sitename_font_face",
    "blockquote_font_face",
  ];
  return fontFields.includes(fieldName);
}

module.exports = {
  parseFontKey,
  loadGoogleFont,
  getFontFamilyValue,
  getFontWeightValue,
  getFontStyleValue,
  handleFontChange,
  isFontFaceField,
};
