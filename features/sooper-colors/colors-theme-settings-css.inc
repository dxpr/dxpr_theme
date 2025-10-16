<?php

/**
 * @file
 * CSS color variable styles.
 */

use Drupal\Component\Utility\Color;

/**
 * Generate css color variables css styles.
 *
 * @param string $theme
 *   Theme machine name.
 * @param string $css
 *   Generated css styles string.
 * @param array $palette
 *   Theme palette array.
 */
function colors_theme_settings_css($theme, &$css, array $palette) {
  $color_prefix = _dxpr_theme_get_const('cssColorPrefix');

  // Add RGB CSS variable.
  $palette['header-rgb'] = implode(',', Color::hexToRgb($palette['header']));

  $css_variables = implode(";\n", array_map(
    function ($key, $value) use ($color_prefix) {
      return '  ' . $color_prefix . $key . ': ' . $value;
    },
    array_keys($palette),
    $palette
  ));

  if ($css_variables) {
    $css .= ":root.dxpr-scheme-custom {\n" . $css_variables . ";\n";

    // Add algorithmic subtle color generation.
    $css .= "  --dxt-color-basesubtle: color-mix(in srgb, white 80%, var(--dxt-color-base));\n";
    $css .= "  --dxt-color-basesubtletext: color-mix(in srgb, black 60%, var(--dxt-color-base));\n";
    $css .= "  --dxt-color-accent1subtle: color-mix(in srgb, white 80%, var(--dxt-color-accent1));\n";
    $css .= "  --dxt-color-accent1subtletext: color-mix(in srgb, black 60%, var(--dxt-color-accent1));\n";
    $css .= "  --dxt-color-accent2subtle: color-mix(in srgb, white 80%, var(--dxt-color-accent2));\n";
    $css .= "  --dxt-color-accent2subtletext: color-mix(in srgb, black 60%, var(--dxt-color-accent2));\n";
    $css .= "  --dxt-color-headingssubtle: color-mix(in srgb, white 80%, var(--dxt-color-headings));\n";
    $css .= "  --dxt-color-headingssubtletext: color-mix(in srgb, black 60%, var(--dxt-color-headings));\n";

    // Add Bootstrap 5 CSS custom property overrides.
    $css .= "  --bs-primary: var(--dxt-color-base);\n";
    $css .= "  --bs-secondary: var(--dxt-color-accent1);\n";
    $css .= "  --bs-primary-text-emphasis: color-mix(in srgb, black 60%, var(--dxt-color-base));\n";
    $css .= "  --bs-secondary-text-emphasis: color-mix(in srgb, black 60%, var(--dxt-color-accent1));\n";
    $css .= "  --bs-primary-bg-subtle: color-mix(in srgb, white 80%, var(--dxt-color-base));\n";
    $css .= "  --bs-secondary-bg-subtle: color-mix(in srgb, white 80%, var(--dxt-color-accent1));\n";
    $css .= "  --bs-primary-border-subtle: color-mix(in srgb, white 60%, var(--dxt-color-base));\n";
    $css .= "  --bs-secondary-border-subtle: color-mix(in srgb, white 60%, var(--dxt-color-accent1));\n";
    $css .= "  --bs-body-color: var(--dxt-color-text);\n";
    $css .= "  --bs-body-bg: var(--dxt-color-body);\n";
    $css .= "  --bs-heading-color: var(--dxt-color-headings);\n";
    $css .= "  --bs-link-color: var(--dxt-color-link);\n";
    $css .= "  --bs-link-hover-color: var(--dxt-color-accent1);\n";
    $css .= "  --bs-code-color: var(--dxt-color-base);\n";
    $css .= "  --bs-border-color: var(--dxt-color-graylighter);\n";
    $css .= "  --bs-border-color-translucent: rgba(0, 0, 0, 0.175);\n";
    $css .= "  --bs-light: var(--dxt-color-silver);\n";
    $css .= "  --bs-dark: var(--dxt-color-headings);\n";
    $css .= "  --bs-light-text-emphasis: var(--dxt-color-text);\n";
    $css .= "  --bs-dark-text-emphasis: var(--dxt-color-headings);\n";
    $css .= "  --bs-light-bg-subtle: var(--dxt-color-silver);\n";
    $css .= "  --bs-dark-bg-subtle: color-mix(in srgb, white 80%, var(--dxt-color-headings));\n";
    $css .= "  --bs-light-border-subtle: var(--dxt-color-graylighter);\n";
    $css .= "  --bs-dark-border-subtle: var(--dxt-color-headings);\n";
    $css .= "  --bs-emphasis-color: var(--dxt-color-headings);\n";
    $css .= "  --bs-secondary-color: var(--dxt-color-text);\n";
    $css .= "  --bs-secondary-bg: var(--dxt-color-card);\n";
    $css .= "  --bs-tertiary-color: var(--dxt-color-text);\n";
    $css .= "  --bs-tertiary-bg: var(--dxt-color-silver);\n";

    $css .= "}\n\n";
  }
}
