<?php

/**
 * @file
 */

/**
 * Override or insert variables into the page template for HTML output.
 */
function dxpr_theme_process_html(&$vars) {
  // Hook into color.module.
  if (module_exists('color')) {
    _dxpr_theme_color_html_alter($vars);
  }
  $vars['page_bottom'] .= theme_get_setting('custom_javascript_site');
  if (drupal_is_front_page()) {
    $vars['page_bottom'] .= '<div style="display:none">sfy39587stp18</div>';
  }
}
