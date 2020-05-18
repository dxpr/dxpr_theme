<?php

/**
 * @file
 */

/**
 * Override or insert variables into the page template.
 */
function dxpr_theme_process_page(&$vars) {
  // Hook into color.module.
  if (module_exists('color')) {
    _color_page_alter($vars);
  }
}
