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
$requested_google_fonts = [];

foreach ($dxpr_theme_fonts as $dxpr_theme_font) {
  if (isset($dxpr_theme_font[0]) && $dxpr_theme_font[0] === '0') {
    $dxpr_theme_font = trim(substr($dxpr_theme_font, 1), ':');
    $requested_google_fonts[] = $dxpr_theme_font;
  }
  elseif (isset($dxpr_theme_font[0]) && $dxpr_theme_font[0] === '1') {
    _dxpr_theme_add_local_font($dxpr_theme_font);
  }
}

if (!empty($requested_google_fonts)) {
  _dxpr_theme_add_google_fonts($requested_google_fonts);
}

/**
 * Helper function to add google fonts to the page.
 *
 * @param array $google_fonts
 *   Requested Google fonts.
 */
function _dxpr_theme_add_google_fonts(array $google_fonts) {
  $planned_fonts_update = variable_get('dxpr_theme_fonts_update', 0);
  $stored_fonts = variable_get('dxpr_theme_stored_fonts', '');

  $active_theme = variable_get('theme_default');
  $fonts_folder_uri = 'public://' . $active_theme . '/fonts';

  // Check if fonts were already saved to files folder.
  file_prepare_directory($fonts_folder_uri, FILE_CREATE_DIRECTORY);
  $font_family_exists = file_exists($fonts_folder_uri . '/font-face.css');

  $obsolete_fonts_cache = time() > $planned_fonts_update ||
    $stored_fonts !== implode(',', $google_fonts);

  if ($obsolete_fonts_cache || !$font_family_exists) {
    _dxpr_theme_remove_google_fonts();
    _dxpr_theme_cache_google_fonts($google_fonts, $fonts_folder_uri);
  }

  if (file_exists($fonts_folder_uri . '/font-face.css')) {
    $absolute_file_source = file_create_url($fonts_folder_uri . '/font-face.css');

    $element = array(
      '#tag' => 'style',
      '#value' => file_get_contents($absolute_file_source),
    );

    drupal_add_html_head($element, 'dxpr_theme_google_fonts');
  }
}

/**
  * Cache requested Google fonts in public folder.
  *
  * @param array $google_fonts
  *   Requested Google fonts.
  * @param string $fonts_folder_uri
  *   Path to "cached" Google fonts.
  */
function _dxpr_theme_cache_google_fonts(array $google_fonts, string $fonts_folder_uri) {
  $fonts_url = '';
  global $base_url;

  // Build url to request Google fonts.
  foreach ($google_fonts as $google_font) {
    $font_params = explode(':', $google_font);

    if (!isset($font_params[1])) {
      $fonts_url .= 'family=' . $google_font . '&';
    }
    else if (is_numeric($font_params[1])) {
      $fonts_url .= 'family=' . $font_params[0] . ':wght@' . $font_params[1] . '&';
    }
    else if ($font_params[1] === 'italic') {
      $fonts_url .= 'family=' . $font_params[0] . ':ital@0;1&';
    }
    else {
      preg_match_all('/\d+/', $font_params[1], $matches);
      $font_weight = $matches[0][0];
      $fonts_url .= 'family=' . $font_params[0] . ':ital,wght@1,' . $font_weight . '&';
    }
  }

  // Store font-face css file.
  $request_url = 'https://fonts.googleapis.com/css2?' . $fonts_url . 'display=swap';
  $font_face = drupal_http_request($request_url, array(
    'headers' => array(
      'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
    ),
  ));
  if ($font_face->code == 200) {
    $font_face = $font_face->data;
  }
  else {
    watchdog('default', '@message', array('@message' => $font_face->error), WATCHDOG_ERROR);
    return;
  }

  // Store font-face source.
  preg_match_all('/src[\s]*:[\s]*url\([\'"]*(.+?)[\'"]*\)[\s]*format\([\'"]*(.+?)[\'"]*\)/i', $font_face, $font_source_matches);
  foreach ($font_source_matches[1] as $key => $font_source) {
    $google_font_source = drupal_http_request($font_source);
    if ($google_font_source->code == 200) {
      $google_font_source = $google_font_source->data;
    }
    else {
      watchdog('default', '@message', array('@message' => $google_font_source->error), WATCHDOG_ERROR);
      continue;
    }

    preg_match('/[A-Za-z0-9_\-\.]+\.[A-Za-z0-9]+$/i', $font_source, $font_name);
    $file_name = $fonts_folder_uri . '/' . $font_name[0];
    file_save_data($google_font_source, $file_name, FILE_EXISTS_REPLACE);

    // Update font-face to use local links.
    $absolute_file_source = file_create_url($fonts_folder_uri . '/' . $font_name[0]);
    $font_face = str_replace($font_source, $absolute_file_source, $font_face);
  }

  file_save_data($font_face, $fonts_folder_uri . '/' . 'font-face.css', FILE_EXISTS_REPLACE);
  variable_set('dxpr_theme_fonts_update', strtotime("+1 week"));
  variable_set('dxpr_theme_stored_fonts', implode(',', $google_fonts));
}

/**
 * Delete existing "cached" Google fonts for before re-download.
 */
function _dxpr_theme_remove_google_fonts() {
  $theme_name = variable_get('theme_default');
  $fonts_folder = 'public://' . $theme_name . '/fonts';

  // Scan the directory and get a list of files.
  $file_list = file_scan_directory($fonts_folder, '/.*/', array(
    'recurse' => FALSE,
    'key' => 'uri'
  ));

  // Delete each file.
  foreach ($file_list as $file) {
    if (file_exists($file->uri)) {
      unlink($file->uri);
    }
  }
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

  _dxpr_theme_add_local_font_preload_link($path, $font[2]);
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
