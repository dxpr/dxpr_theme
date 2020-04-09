<?php

/**
 * @file
 */

/**
 * Override or insert variables into the page template for HTML output.
 */
function glazed_preprocess_comment_wrapper(&$vars) {
  drupal_add_css($theme_path . '/css/vendor-extensions/drupal-comments.css', array('group' => CSS_THEME));
}
