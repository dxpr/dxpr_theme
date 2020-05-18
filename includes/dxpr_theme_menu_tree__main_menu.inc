<?php

/**
 * @file
 * Overrides theme_menu_tree().
 * Add bootstrap 'navbar-nav' class and dxpr_theme wrapper to main menu block.
 */

/**
 *
 */
function dxpr_theme_menu_tree__main_menu(&$variables) {
  return '<ul class="menu nav">' . $variables['tree'] . '</ul>';
}
