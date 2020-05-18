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
  return;
}

/**
 * Helper function to add local fonts to the page. Add query string to stylesheet to prevent
 * identically named files to overwrite eachother.
 */
function _dxpr_theme_add_local_font($font) {
  global $base_url, $base_path;

  $font = explode('|', substr($font, 1));
  $element = array(
    '#tag' => 'link',
    '#attributes' => array(
      'href' => $base_path . drupal_get_path('theme', $font[0]) . $font[1],
      'rel' => 'stylesheet',
      'type' => 'text/css',
    ),
  );
  drupal_add_html_head($element, $font[2]);
  return;
}
