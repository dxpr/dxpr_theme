<?php

/**
 * @file
 * Custom css settings css styles.
 */

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
  if (\Drupal\dxpr_theme\ThemeSettings::get('custom_css_site', $theme)) {
    $css .= "/* Custom CSS */\n";
    $css .= trim(\Drupal\dxpr_theme\ThemeSettings::get('custom_css_site', $theme));
    $css .= "\n\n";
  }
}
