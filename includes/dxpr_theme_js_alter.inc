<?php

/**
 * @file
 */

/**
 * Implements hook_js_alter().
 */
function dxpr_theme_js_alter(&$js) {
  $theme_path = drupal_get_path('theme', 'dxpr_theme') . '/';
  // Add Bootstrap settings.
  $js['settings']['data'][]['dxpr_theme'] = array(
    'dxpr_themePath' => $theme_path,
  );
  // Override color module color.js because it's broken when bootstrap theme is loaded.
  if (isset($js['modules/color/color.js']['data'])) {
    $js['modules/color/color.js']['data'] = $theme_path . 'js/minified/color.min.js';
  }
}
