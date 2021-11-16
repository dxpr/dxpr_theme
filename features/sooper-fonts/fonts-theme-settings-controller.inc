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

  $added_stylesheets = &drupal_static(__FUNCTION__);
  $added_stylesheets = $added_stylesheets ?? [];

  $font = explode('|', substr($font, 1));
  $path = drupal_get_path('theme', $font[0]) . $font[1];
  if (empty($added_stylesheets[$path])) {
    $element = [
      '#tag' => 'link',
      '#attributes' => [
        'href' => $base_url . '/' . $path,
        'rel' => 'stylesheet',
        'type' => 'text/css',
      ],
    ];
    $variables['#attached']['html_head'][] = [$element, $font[2]];
    $added_stylesheets[$path] = $path;
  }
  if (theme_get_setting('preload_local_fonts')) {
    _dxpr_theme_add_local_font_preload_link($path, $font[2], $variables);
  }
}

/**
 * Helper function to add preload links for local fonts to the page header.
 *
 * @param string $path
 *   Path to the fonts stylesheet file.
 * @param string $font_family
 *   Font family name.
 * @param array $variables
 *   Variables array.
 */
function _dxpr_theme_add_local_font_preload_link($path, $font_family, array $variables) {
  $font_families = _dxpr_theme_add_local_font_parse_font_families($path);
  if (!empty($font_families[$font_family])) {
    $element = [
      '#type' => 'html_tag',
      '#tag' => 'link',
      '#attributes' => [
        'rel' => 'preload',
        'href' => '/' . dirname($path) . '/' . $font_families[$font_family]['url'],
        'as' => 'font',
        'type' => 'font/' . $font_families[$font_family]['format'],
        'crossorigin' => TRUE,
      ],
    ];
    $variables['#attached']['html_head'][] = [
      $element,
      $font_family . '_preload',
    ];
  }
}

/**
 * Parse stylesheet file to fetch font files url and format.
 *
 * @param string $path
 *   Path to the fonts stylesheet file.
 *
 * @return array
 *   Array of the parsed data for the provided stylesheet file.
 */
function _dxpr_theme_add_local_font_parse_font_families($path) {
  $font_families = &drupal_static(__FUNCTION__);
  $font_families = $font_families ?? [];
  if (!isset($font_families[$path])) {
    $font_families[$path] = [];
    $content = file_get_contents($path);
    preg_match_all('/@font-face\s*{([\s\S]*?)}/i', $content, $font_faces);
    foreach ($font_faces[1] as $font_face) {
      if (preg_match('/font-family: [\'"](.*?)[\'"]/i', $font_face, $font_family)) {
        $font_families[$path][$font_family[1]] = [];
        if (preg_match('/src[\s]*:[\s]*url\([\'"]*(.+?)[\'"]*\)[\s]*format\([\'"]*(.+?)[\'"]*\)/i', $font_face, $matches)) {
          $font_families[$path][$font_family[1]] = [
            'url' => $matches[1],
            'format' => $matches[2],
          ];
        }
      }
    }
  }
  return $font_families[$path];
}
