<?php

/**
 * Override or insert variables into the page template for HTML output.
 */
function glazed_preprocess_breadcrumb(&$vars) {
  global $theme_path;
  if ($vars['breadcrumb']) {
    drupal_add_css($theme_path . '/css/vendor-extensions/drupal-breadcrumbs.css', array('group' => CSS_THEME));
  }
}
