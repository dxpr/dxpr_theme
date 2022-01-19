<?php

/**
 * @file
 */

/**
 * Implements hook_js_alter().
 */
function dxpr_theme_js_alter(&$js) {
  global $theme;
  // Global $theme_path variable is buggy so we create our own vars
  // @see https://github.com/dxpr/dxpr_theme/issues/170
  $theme_path_active = drupal_get_path('theme', $theme);
  $theme_path_base = drupal_get_path('theme', 'dxpr_theme');
  
  // Add Bootstrap settings.
  $js['settings']['data'][]['dxpr_theme'] = array(
    'dxpr_themePath' => $theme_path_base . '/',
  );
  // Override color module color.js because it's broken when bootstrap theme is loaded.
  if (isset($js['modules/color/color.js']['data'])) {
    $js['modules/color/color.js']['data'] = $theme_path_base . '/js/minified/color.min.js';
  }
}
