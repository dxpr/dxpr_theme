<?php

/**
 * @file
 */

$dxpr_theme_fonts = array();
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
    _dxpr_theme_add_goog_font($dxpr_theme_font);
  }
  elseif (isset($dxpr_theme_font[0]) && $dxpr_theme_font[0] === '1') {
    _dxpr_theme_add_local_font($dxpr_theme_font);
  }
}

/**
 * Helper function to add google fonts to the page.
 */
function _dxpr_theme_add_goog_font($font) {
  $font = substr($font, 1);
  $element = array(
    '#tag' => 'link',
    '#attributes' => array(
      'href' => '//fonts.googleapis.com/css?family=' . $font,
      'rel' => 'stylesheet',
      'type' => 'text/css',
    ),
  );
  drupal_add_html_head($element, $font);
}

/**
 * Helper function to add local fonts to the page. Add query string to stylesheet to prevent
 * identically named files to overwrite eachother.
 */
function _dxpr_theme_add_local_font($font) {
  global $base_path;
  $added_stylesheets = &drupal_static(__FUNCTION__);
  $added_stylesheets = isset($added_stylesheets) ? $added_stylesheets : array();
  $font = explode('|', substr($font, 1));
  $path = drupal_get_path('theme', $font[0]) . $font[1];
  if (!isset($added_stylesheets[$path])) {
    $element = array(
      '#tag' => 'link',
      '#attributes' => array(
        'href' => $base_path . $path,
        'rel' => 'stylesheet',
        'type' => 'text/css',
      ),
    );
    drupal_add_html_head($element, $font[2]);
    $added_stylesheets[$path] = $path;
  }
  if (theme_get_setting('preload_local_fonts')) {
    _dxpr_theme_add_local_font_preload_link($path, $font[2]);
  }
}

/**
 * Helper function to add preload links for local fonts to the page header.
 *
 * @param string $path
 *   Path to the fonts stylesheet file.
 * @param string $font_family
 *   Font family name.
 */
function _dxpr_theme_add_local_font_preload_link($path, $font_family) {
  $font_families = _dxpr_theme_add_local_font_parse_font_families($path);
  if (!empty($font_families[$font_family])) {
    $element = [
      '#tag' => 'link',
      '#attributes' => [
        'rel' => 'preload',
        'href' => '/' . dirname($path) . '/' . $font_families[$font_family]['url'],
        'as' => 'font',
        'type' => 'font/' . $font_families[$font_family]['format'],
        'crossorigin' => 'crossorigin',
      ],
    ];
    drupal_add_html_head($element, $font_family . '_preload');
  }
}

/**
 * Parse stylesheet file to fetch font files url and format.
 *
 * @param $path
 *   Path to the fonts stylesheet file.
 * @return array
 *   Array of the parsed data for the provided stylesheet file.
 */
function _dxpr_theme_add_local_font_parse_font_families($path) {
  $font_families = &drupal_static(__FUNCTION__);
  $font_families = isset($font_families) ? $font_families : array();
  if (!isset($font_families[$path])) {
    $font_families[$path] = array();
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
