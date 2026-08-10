<?php

/**
 * @file
 * Fonts settings css styles.
 */

/**
 * Generate fonts theme css styles.
 *
 * @param string $theme
 *   Theme machine name.
 * @param string $css
 *   Generated css styles string.
 * @param array $palette
 *   Theme palette array.
 */
function fonts_theme_settings_css(string $theme, &$css, array $palette) {

  // Font theme settings keys.
  $fonts = [
    'body_font_face',
    'nav_font_face',
    'headings_font_face',
    'sitename_font_face',
    'blockquote_font_face',
  ];

  $prefix = _dxpr_theme_get_const('cssSettingPrefix');

  foreach ($fonts as $font_key) {
    if (theme_get_setting($font_key, $theme)) {
      $selector = theme_get_setting($font_key . '_selector', $theme);

      // Add additional selector for the body font.
      if ($font_key === 'body_font_face') {
        $selector .= ', .tooltip';
      }

      // Build CSS variable names for weight/style from the font key.
      // E.g. "body_font_face" -> "--dxt-setting-body-font-weight".
      $base_var = str_replace('_', '-', str_replace('_face', '', $font_key));

      $css .= "/* " . str_replace('_', ' ', $font_key) . " */\n";
      $css .= $selector . " {\n";
      $css .= _dxpr_theme_settings_add_css($font_key, 'font-family');
      $css .= "  font-style: var({$prefix}{$base_var}-style);\n";
      if ($font_key !== 'headings_font_face') {
        $css .= "  font-weight: var({$prefix}{$base_var}-weight);\n";
      }
      $css .= "}\n\n";
    }
  }
}
