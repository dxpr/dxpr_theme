<?php

/**
 * @file
 * Theme color settings.
 */

/**
 * Add color options to the theme settings form.
 *
 * @param array $form
 *   Form array.
 * @param string $theme
 *   Theme machine name.
 */
function colors_theme_settings(array &$form, $theme) {
  $schemes = _dxpr_theme_get_color_schemes($theme);
  $colors = _dxpr_theme_get_color_names($theme);

  $scheme_options = array_filter(array_combine(array_keys($schemes), array_column($schemes, 'title')));
  $scheme_options = array_merge($scheme_options, [
    'custom' => t('Custom'),
    'current' => t('Revert to saved'),
  ]);

  $palette = unserialize(theme_get_setting('color_palette'), ['allowed_classes' => FALSE]);
  $palette = $palette ?: ($schemes['default']['colors'] ?? []);

  // Attach palette and schemes.
  $form['#attached']['drupalSettings']['dxpr_themeSettings']['colors'] = [
    'palette' => $palette,
    'schemes' => $schemes,
  ];

  // Build form.
  $form['dxpr_theme_settings']['colors'] = [
    '#title' => t('Colors'),
    '#type' => 'details',
    '#group' => 'dxpr_theme_settings',
    '#attributes' => [
      'class' => ['color-form'],
    ],
  ];

  $form['dxpr_theme_settings']['colors']['wrapper'] = [
    '#type' => 'html_tag',
    '#tag' => 'div',
    '#attributes' => [
      'class' => ['color-palette-wrapper'],
    ],
  ];

  $form['dxpr_theme_settings']['colors']['wrapper']['color_scheme'] = [
    '#type' => 'select',
    '#title' => t('Color set'),
    '#default_value' => theme_get_setting('color_scheme'),
    '#options' => $scheme_options,
  ];

  $form['dxpr_theme_settings']['colors']['wrapper']['color_palette'] = [
    '#type' => 'html_tag',
    '#tag' => 'div',
    '#attributes' => [
      'id' => ['color-palette'],
      'class' => ['color-palette'],
    ],
  ];

  foreach ($colors as $key => $title) {
    $form['dxpr_theme_settings']['colors']['wrapper']['color_palette']['color_palette_' . $key] = [
      '#type' => 'textfield',
      '#title' => t('@name', ['@name' => $title]),
      '#default_value' => $palette[$key] ?? '',
      '#size' => 8,
      '#maxlength' => 8,
      '#attributes' => ['data-original' => $palette[$key] ?? ''],
    ];
  }

  $form['dxpr_theme_settings']['colors']['color_picker'] = [
    '#type' => 'html_tag',
    '#tag' => 'div',
    '#attributes' => [
      'id' => ['color-picker-placeholder'],
      'class' => ['color-placeholder', 'sticky-top'],
    ],
  ];

}
