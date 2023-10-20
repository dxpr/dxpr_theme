<?php

/**
 * @file
 * CSS color variable styles.
 */

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
  $color_prefix = '--dxpr-color-';

  $css_variables = implode(";\n", array_map(
    function ($key, $value) use ($color_prefix) {
      return '  ' . $color_prefix . $key . ': ' . $value;
    },
    array_keys($palette),
    $palette
  ));

  if ($css_variables) {
    $css .= ":root{\n" . $css_variables . ";\n}\n\n";
  }
}
