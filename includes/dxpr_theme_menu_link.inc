<?php

/**
 * @file
 */

/**
 * Override menu link to support multilevel dropdowns.
 *
 * @param array $variables
 *   An associative array containing:
 *   - element: Structured array data for a menu link.
 *
 * @return string
 *   The constructed HTML.
 *
 * @see theme_menu_link()
 *
 * @ingroup theme_functions
 */
function dxpr_theme_menu_link(array $variables) {
  global $theme;
  $current_theme_path = drupal_get_path('theme', $theme);
  $element = $variables['element'];
  $sub_menu = '';
  $careticon = '';

  if ($element['#below']) {
    // below file should be loaded here after properly separating all mulitilevel menu code from dxpr-theme-header.js
    // drupal_add_js($current_theme_path . '/js/minified/dxpr-theme-multilevel-mobile-nav.min.js');

    // Prevent dropdown functions from being added to management menu so it
    // does not affect the navbar module.
    if (($element['#original_link']['menu_name'] == 'management') && (module_exists('navbar'))) {
      $sub_menu = drupal_render($element['#below']);
    }
    elseif ((!empty($element['#original_link']['depth'])) && ($element['#original_link']['depth'] == 1)) {
      // Add our own wrapper.
      unset($element['#below']['#theme_wrappers']);
      $sub_menu = '<ul class="dropdown-menu">' . drupal_render($element['#below']) . '</ul>';
      // Generate as standard dropdown.
      $element['#attributes']['class'][] = 'dropdown';
      $element['#localized_options']['html'] = TRUE;

      // Set dropdown trigger element to # to prevent inadvertant page loading
      // when a submenu link is clicked.
      $careticon .= ' <span class="caret" data-toggle="dropdown"></span>';
      $element['#localized_options']['attributes']['data-target'] = '#';
      $element['#localized_options']['attributes']['class'][] = 'dropdown-toggle';
      // $element['#localized_options']['attributes']['data-toggle'] = 'dropdown';
    }
    elseif ((!empty($element['#original_link']['depth'])) && ($element['#original_link']['depth'] >= 2)) {
      // Add our own wrapper.
      unset($element['#below']['#theme_wrappers']);
      $sub_menu = '<ul class="dxpr-theme-megamenu">' . drupal_render($element['#below']) . '</ul>';
      // $element['#attributes']['class'][] = 'megamenu';
      // $element['#localized_options']['html'] = TRUE;
      // Set dropdown trigger element to # to prevent inadvertant page loading
      // when a submenu link is clicked.
      // $element['#localized_options']['attributes']['data-target'] = '#';.
      $element['#localized_options']['attributes']['class'][] = 'dxpr-theme-megamenu__heading';
    }
  }
  // On primary navigation menu, class 'active' is not set on active menu item.
  // @see https://drupal.org/node/1896674
  if (($element['#href'] == $_GET['q'] || ($element['#href'] == '<front>' && drupal_is_front_page())) && (empty($element['#localized_options']['language']))) {
    $element['#attributes']['class'][] = 'active';
  }
  $output = l($element['#title'], $element['#href'], $element['#localized_options']);
  return '<li' . drupal_attributes($element['#attributes']) . '>' . $careticon . $output . $sub_menu . "</li>\n";
}