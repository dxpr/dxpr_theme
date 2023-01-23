<?php

/**
 * @file
 * Applying theme font settings.
 */

use Drupal\Core\File\FileSystemInterface;

/**
 * Process theme font theme settings.
 *
 * @param array $variables
 *   Variables array for the html template.
 *
 * @throws \Drupal\Core\Entity\EntityStorageException
 */
function fonts_theme_settings_controller(array &$variables) {
  $dxpr_theme_fonts = [];
  $dxpr_theme_fonts[] = theme_get_setting('body_font_face');
  $dxpr_theme_fonts[] = theme_get_setting('headings_font_face');
  $dxpr_theme_fonts[] = theme_get_setting('nav_font_face');
  $dxpr_theme_fonts[] = theme_get_setting('sitename_font_face');
  $dxpr_theme_fonts[] = theme_get_setting('blockquote_font_face');

  $dxpr_theme_fonts = array_unique($dxpr_theme_fonts);
  $requested_google_fonts = [];

  foreach ($dxpr_theme_fonts as $dxpr_theme_font) {
    if (isset($dxpr_theme_font[0]) && $dxpr_theme_font[0] === '0') {
      // If the font is loaded without a weight or style specified
      // try to load a complete set.
      if (substr($dxpr_theme_font, -1) == ':') {
        $dxpr_theme_font .= '400italic,700italic,400,700';
      }
      _dxpr_theme_add_google_font($dxpr_theme_font, $variables);
      $requested_google_fonts[] = $dxpr_theme_font;
    }
    elseif (isset($dxpr_theme_font[0]) && $dxpr_theme_font[0] === '1') {
      _dxpr_theme_add_local_font($dxpr_theme_font, $variables);
    }
  }

  // Cleanup fonts cache storage to keep only used fonts.
  _dxpr_theme_remove_unused_cached_fonts($requested_google_fonts);
}

/**
 * Helper function to add google fonts to the page.
 *
 * @param string $font
 *   Font family name.
 * @param array $variables
 *   Variables array.
 *
 * @throws \Drupal\Core\Entity\EntityStorageException
 */
function _dxpr_theme_add_google_font($font, array &$variables) {
  $active_theme = \Drupal::service('theme.manager')->getActiveTheme();
  /** @var \Drupal\Core\File\FileSystemInterface $file_system */
  $file_system = \Drupal::service('file_system');

  $font = substr($font, 1);

  $path_to_theme = 'public://' . $active_theme->getName();
  $font_family_uri = $path_to_theme . '/' . $font;

  $file_system->prepareDirectory($font_family_uri, FileSystemInterface::CREATE_DIRECTORY);
  // Check if requested font exists in font folder.
  $font_family_exists = file_exists($font_family_uri . '/font-face.css');

  if (!$font_family_exists) {
    _dxpr_theme_cache_google_font($font, $font_family_uri);
  }

  // Check if font needs update.
  if (time() > \Drupal::state()->get($font)) {
    // Request font to store in files.
    _dxpr_theme_cache_google_font($font, $font_family_uri);
  }

  if ($wrapper = \Drupal::service('stream_wrapper_manager')->getViaUri($font_family_uri . '/' . 'font-face.css')) {
    $absolute_file_source = $wrapper->getExternalUrl();
    $preload_element = [
      '#type' => 'html_tag',
      '#tag' => 'link',
      '#attributes' => [
        'rel' => 'preload',
        'href' => $absolute_file_source,
        'as' => 'style',
        'crossorigin' => TRUE,
      ],
    ];

    $variables['#attached']['html_head'][] = [
      $preload_element,
      $font . '_preload',
    ];

    $element = [
      '#tag' => 'link',
      '#attributes' => [
        'href' => $absolute_file_source,
        'rel' => 'stylesheet preload',
        'type' => 'text/css',
      ],
    ];
    $variables['#attached']['html_head'][] = [$element, $font];
  }
}

/**
 * @param string $font
 *   The font-family name.
 * @param string $font_family_uri
 *   Path to "cached" font-family location.
 *
 * @throws \Drupal\Core\Entity\EntityStorageException
 */
function _dxpr_theme_cache_google_font(string $font, string $font_family_uri) {
  /** @var \GuzzleHttp\ClientInterface $http_client */
  $http_client = \Drupal::httpClient();
  /** @var \Drupal\file\FileRepositoryInterface $file_repository */
  $file_repository = \Drupal::service('file.repository');

  // Request font to store in files.
  $font_sources = &drupal_static(__FUNCTION__);
  $font_sources = $font_sources ?? [];

  // Store font-face css file.
  $response = $http_client->request('GET', '//fonts.googleapis.com/css?family=' . $font, [
    'headers' => [
      'User-Agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36',
    ],
  ]);
  $font_face = $response->getBody()->getContents();

  // Store font-face source.
  preg_match_all('/src[\s]*:[\s]*url\([\'"]*(.+?)[\'"]*\)[\s]*format\([\'"]*(.+?)[\'"]*\)/i', $font_face, $font_source_matches);
  foreach ($font_source_matches[1] as $key => $font_source) {
    $response = $http_client->get($font_source);
    $google_font_source = $response->getBody()->getContents();

    preg_match('/\.[0-9a-z]+$/i', $font_source, $file_type);
    $file_name = $font_family_uri . '/' . $font . '-' . $key . $file_type[0];
    $file_repository->writeData($google_font_source, $file_name, FileSystemInterface::EXISTS_REPLACE);

    // Update font-face to use local links.
    if ($wrapper = \Drupal::service('stream_wrapper_manager')->getViaUri($file_name)) {
      $absolute_file_source = $wrapper->getExternalUrl();
      $font_face = str_replace($font_source, $absolute_file_source, $font_face);
    }
  }

  $file_repository->writeData($font_face, $font_family_uri . '/' . 'font-face.css', FileSystemInterface::EXISTS_REPLACE);
  \Drupal::state()->set($font, strtotime("+1 week"));
}

/**
 * Delete existing "cached" fonts and keep only requested fonts.
 *
 * @param array $requested_fonts
 *   Enabled fonts in DXPR Theme settings.
 */
function _dxpr_theme_remove_unused_cached_fonts($requested_fonts) {
  $active_theme = \Drupal::service('theme.manager')->getActiveTheme();
  $path_to_theme = 'public://' . $active_theme->getName();

  $iterator = new RecursiveDirectoryIterator($path_to_theme, RecursiveDirectoryIterator::SKIP_DOTS);
  foreach ($iterator as $font_family) {
    if ($font_family->isDir()) {
      $filename = $font_family->getFilename();
      if (!in_array('0' . $filename, $requested_fonts) && $filename !== 'css') {
        \Drupal::service('file_system')->deleteRecursive($path_to_theme . '/' . $font_family->getFilename());
      }
    }
  }
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
  $path = \Drupal::service('extension.list.theme')->getPath($font[0]) . $font[1];
  if (empty($added_stylesheets[$path])) {
    $element = [
      '#tag' => 'link',
      '#attributes' => [
        'href' => $base_url . '/' . $path,
        'rel' => 'stylesheet preload',
        'type' => 'text/css',
      ],
    ];
    $variables['#attached']['html_head'][] = [$element, $font[2]];
    $added_stylesheets[$path] = $path;
  }

  _dxpr_theme_add_local_font_preload_link($path, $font[2], $variables);
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
