<?php

/**
 * Implements template_preprocess_webform_form()
 */
function dxpr_theme_preprocess_webform_form(&$vars) {
  global $theme;
  // There is a bug that makes global variable $theme_path return the base theme
  // path instead of the active theme path, hence the custom variable below
  $theme_path_custom = drupal_get_path('theme', $theme);
  drupal_add_css($theme_path_custom . '/css/vendor-extensions/drupal-webform.css', array('group' => CSS_THEME));
}