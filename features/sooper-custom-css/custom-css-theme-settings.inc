<?php

/**
 * @file
 * Theme custom css settings.
 */

/**
 * Add custom css options to the theme settings form.
 *
 * @param array $form
 *   Form array.
 * @param string $theme
 *   Theme machine name.
 */
function custom_css_theme_settings(array &$form, $theme) {
  $form['dxpr_theme_settings']['custom_css'] = [
    '#title' => t('Custom CSS & JS'),
    '#type' => 'details',
    '#group' => 'dxpr_theme_settings',
    '#description' => t("Add custom CSS and JavaScript without creating a subtheme."),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
    '#weight' => 30,
  ];

  $form['dxpr_theme_settings']['custom_css']['custom_css_site'] = [
    '#type' => 'textarea',
    '#title' => t('Sitewide CSS'),
    '#ai_description' => 'Raw CSS code injected on every page. Use for quick overrides without creating a subtheme. Avoid duplicating what theme settings already control.',
    '#default_value' => theme_get_setting('custom_css_site'),
    '#rows' => 15,
  ];

  $form['dxpr_theme_settings']['custom_css']['custom_javascript_site'] = [
    '#type' => 'textarea',
    '#title' => t('Sitewide JavaScript'),
    '#ai_description' => 'Raw JavaScript code injected on every page. Use for tracking snippets, custom interactions, or third-party widget initialization. Runs after DOM ready.',
    '#default_value' => theme_get_setting('custom_javascript_site'),
    '#rows' => 15,
  ];

}
