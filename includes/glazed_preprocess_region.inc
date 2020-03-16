<?php

/**
 * Override or insert variables into the page template for HTML output.
 */
function glazed_preprocess_region(&$vars) {
  global $theme_path;
  switch ($vars['region']) {
    case 'secondary_header':
      drupal_add_css($theme_path . '/css/components/glazed-secondary-header.css', array('group' => CSS_THEME));
    case 'navigation':
      drupal_add_css($theme_path . '/css/components/glazed-header.css', array('group' => CSS_THEME));
      drupal_add_css($theme_path . '/css/components/glazed-header--top.css', array('group' => CSS_THEME));
      drupal_add_css($theme_path . '/css/components/glazed-header--side.css', array('group' => CSS_THEME));
      drupal_add_css($theme_path . '/css/components/glazed-header--mobile.css', array('group' => CSS_THEME));
      break;
    case 'footer':
      drupal_add_css($theme_path . '/css/base/footer-menu.css', array('group' => CSS_THEME));
      break;
  }
}
