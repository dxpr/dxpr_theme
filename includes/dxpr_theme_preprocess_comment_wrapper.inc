<?php

/**
 * @file
 */

/**
 * Override or insert variables into the page template for HTML output.
 */
function dxpr_theme_preprocess_comment_wrapper(&$vars) {
  global theme_path;
  drupal_add_css($theme_path . '/css/vendor-extensions/drupal-comments.css', array('group' => CSS_THEME));
}
