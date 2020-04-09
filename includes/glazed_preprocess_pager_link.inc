<?php

/**
 * Override or insert variables into the page template for HTML output.
 */
function glazed_preprocess_pager_link(&$vars) {
  global $theme, $theme_path;
  // There is a bug that makes global variable $theme_path return the base theme
  // path instead of the active theme path, hence the custom variable below
  $theme_path_custom = drupal_get_path('theme', $theme);
  drupal_add_css($theme_path_custom . '/css/vendor-extensions/drupal-pager.css', array('group' => CSS_THEME));
}
