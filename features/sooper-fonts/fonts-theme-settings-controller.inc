<?php

/**
 * @file
 * Applying theme font settings.
 */

/**
 * Process theme font theme settings.
 *
 * @param array $variables
 *   Variables array for the html template.
 */
function fonts_theme_settings_controller(array &$variables) {
  $dxpr_theme_fonts = [];
  $dxpr_theme_fonts[] = theme_get_setting('body_font_face');
  $dxpr_theme_fonts[] = theme_get_setting('headings_font_face');
  $dxpr_theme_fonts[] = theme_get_setting('nav_font_face');
  $dxpr_theme_fonts[] = theme_get_setting('sitename_font_face');
  $dxpr_theme_fonts[] = theme_get_setting('blockquote_font_face');

  $dxpr_theme_fonts = array_unique($dxpr_theme_fonts);

  foreach ($dxpr_theme_fonts as $dxpr_theme_font) {
    if (isset($dxpr_theme_font[0]) && $dxpr_theme_font[0] === '0') {
      // If the font is loaded without a weight or style specified
      // try to load a complete set.
      if (substr($dxpr_theme_font, -1) == ':') {
        $dxpr_theme_font .= '400italic,700italic,400,700';
      }
      _dxpr_theme_add_goog_font($dxpr_theme_font, $variables);
    }
    elseif (isset($dxpr_theme_font[0]) && $dxpr_theme_font[0] === '1') {
      _dxpr_theme_add_local_font($dxpr_theme_font, $variables);
    }
  }
}

/**
 * Helper function to add google fonts to the page.
 *
 * @param string $font
 *   Font family name.
 * @param array $variables
 *   Variables array.
 */
function _dxpr_theme_add_goog_font($font, array &$variables) {
  $font = substr($font, 1);
  $element = [
    '#tag' => 'link',
    '#attributes' => [
      'href' => '//fonts.googleapis.com/css?family=' . $font,
      'rel' => 'stylesheet',
      'type' => 'text/css',
    ],
  ];
  $variables['#attached']['html_head'][] = [$element, $font];
}

/**
 * Helper function to add local fonts to the page.
 *
 * Add query string to stylesheet to prevent identically named files
 * to overwrite each other.
 *
 * @param string $font
 *   Font family name.
 * @param array $variables
 *   Variables array.
 */
function _dxpr_theme_add_local_font($font, array &$variables) {
  global $base_url;

  $font = explode('|', substr($font, 1));
  $element = [
    '#tag' => 'link',
    '#attributes' => [
      'href' => $base_url . '/' . drupal_get_path('theme', $font[0]) . $font[1],
      'rel' => 'stylesheet',
      'type' => 'text/css',
    ],
  ];
  $variables['#attached']['html_head'][] = [$element, $font[2]];
}
