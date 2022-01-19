<?php

/**
 * @file template.php
 */

/**
 * Load template.php logic from theme features
 */

foreach (file_scan_directory(drupal_get_path('theme', 'dxpr_theme') . '/features', '/controller.inc/i') as $file) {
  require_once($file->uri);
}
/**
 * Load template.php DXPR Theme functions
 */

foreach (file_scan_directory(drupal_get_path('theme', 'dxpr_theme') . '/includes', '/.inc/i') as $file) {
  require_once($file->uri);
}

function dxpr_themeNavFastInit() {
  if ($breakpoint = theme_get_setting('header_mobile_breakpoint')) {
    if ($breakpoint > 4099) {
      $breakpoint = 99999;
    }
  }
  else {
    $breakpoint = 1200;
  }
  $nav_init = <<<EOT
  <script>
  var dxpr_themeNavBreakpoint = {$breakpoint};
  var dxpr_themeWindowWidth = window.innerWidth;
  if (dxpr_themeWindowWidth > dxpr_themeNavBreakpoint) {
    document.body.className += ' body--dxpr-theme-nav-desktop';
  }
  else {
    document.body.className += ' body--dxpr-theme-nav-mobile';
  }
  </script>
EOT;
  return $nav_init;
}


/**
 * Replace stylesheet by the colorized version.
 *
 * @param array $vars
 *  Variables array.
 */
function _dxpr_theme_color_html_alter(&$vars) {
  global $theme_key;
  $theme_path_key = drupal_get_path('theme', $theme_key);
  // Override stylesheets.
  $color_paths = variable_get('color_' . $theme_key . '_stylesheets', array());
  if (!empty($color_paths)) {
    $color_paths_map = array();
    foreach ($color_paths as $color_path) {
      $color_paths_map[drupal_basename($color_path)] = $color_path;
    }
    foreach ($vars['css'] as $old_path => $data) {
      if (strpos($old_path, $theme_path_key) === 0 && isset($color_paths_map[drupal_basename($old_path)])) {
        $vars['css'][$old_path]['data'] = $color_paths_map[drupal_basename($old_path)];
      }
    }

    $vars['styles'] = drupal_get_css($vars['css']);
  }
}
