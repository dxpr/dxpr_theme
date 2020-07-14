<?php

/**
 * @file
 */

/**
 * Override or insert variables into the page template for HTML output.
 */
function dxpr_theme_preprocess_breadcrumb(&$vars) {
  global $theme, $theme_path;
  // There is a bug that makes global variable $theme_path return the base theme
  // path instead of the active theme path, hence the custom variable below.
  $theme_path_custom = drupal_get_path('theme', $theme);
  if ($vars['breadcrumb']) {
    drupal_add_css($theme_path_custom . '/css/vendor-extensions/drupal-breadcrumbs.css', array('group' => CSS_THEME));
    drupal_add_js($theme_path . '/js/minified/dxpr-theme-breadcrumbs.min.js');
  }
}
