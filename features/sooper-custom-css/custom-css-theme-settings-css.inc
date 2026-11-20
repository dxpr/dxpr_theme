<?php

/**
 * @file
 * Custom css settings css styles.
 */

use Drupal\dxpr_theme\ThemeSettings;

/**
 * Generate custom css theme css styles.
 *
 * @param string $theme
 *   Theme machine name.
 * @param string $css
 *   Generated css styles string.
 * @param array $palette
 *   Theme palette array.
 */
function custom_css_theme_settings_css($theme, &$css, array $palette) {
  if (ThemeSettings::get('custom_css_site', $theme)) {
    $css .= "/* Custom CSS */\n";
    $css .= trim(ThemeSettings::get('custom_css_site', $theme));
    $css .= "\n\n";
  }
}
