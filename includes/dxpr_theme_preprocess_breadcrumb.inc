<?php

/**
 * @file
 */

/**
 * Override or insert variables into the page template for HTML output.
 */
function dxpr_theme_preprocess_breadcrumb(&$vars) {
  global $theme;
  // Global $theme_path variable is buggy so we create our own vars
  // @see https://github.com/dxpr/dxpr_theme/issues/170
  $theme_path_active = drupal_get_path('theme', $theme);
  $theme_path_base = drupal_get_path('theme', 'dxpr_theme');

  if ($vars['breadcrumb']) {
    drupal_add_css($theme_path_active . '/css/vendor-extensions/drupal-breadcrumbs.css', array('group' => CSS_THEME));
    drupal_add_js($theme_path_base . '/js/minified/dxpr-theme-breadcrumbs.min.js');
  }
}
