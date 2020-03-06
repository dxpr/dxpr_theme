<?php

/**
 * Override or insert variables into the page template for HTML output.
 */
function glazed_preprocess_pager_link(&$vars) {
  global $theme_path;
  dsm('glazed_preprocess_pager_link');
  drupal_add_css($theme_path . '/css/vendor-extensions/drupal-pager.css', array('group' => CSS_THEME));
}
