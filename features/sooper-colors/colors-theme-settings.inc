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

  $palette = unserialize(theme_get_setting('color_palette') ?? '', ['allowed_classes' => FALSE]);
  $palette = $palette ?: ($schemes['default']['colors'] ?? []);

  // Check if DXPR Theme Helper and AI module are available.
  $ai_palette_available = \Drupal::moduleHandler()->moduleExists('dxpr_theme_helper')
    && \Drupal::moduleHandler()->moduleExists('ai');

  // Attach palette and schemes.
  $form['#attached']['drupalSettings']['dxpr_themeSettings']['colors'] = [
    'palette' => $palette,
    'schemes' => $schemes,
    'aiPaletteAvailable' => $ai_palette_available,
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
    '#title' => t('Color Set'),
    '#default_value' => theme_get_setting('color_scheme') ?? 'default',
    '#options' => $scheme_options,
    '#attributes' => [
      'id' => 'edit-color-scheme',
    ],
  ];

  // AI Palette Generator.
  if ($ai_palette_available) {
    $form['dxpr_theme_settings']['colors']['wrapper']['ai_palette'] = [
      '#type' => 'container',
      '#attributes' => [
        'class' => ['ai-palette-generator'],
      ],
    ];

    $form['dxpr_theme_settings']['colors']['wrapper']['ai_palette']['ai_prompt'] = [
      '#type' => 'textarea',
      '#title' => t('Describe your color palette'),
      '#title_display' => 'invisible',
      '#rows' => 3,
      '#attributes' => [
        'id' => 'ai-palette-prompt',
        'placeholder' => t('E.g., "Modern tech startup" or "Warm bakery tones"'),
      ],
    ];

    $form['dxpr_theme_settings']['colors']['wrapper']['ai_palette']['ai_generate'] = [
      '#type' => 'button',
      '#value' => t('Generate'),
      '#attributes' => [
        'id' => 'ai-palette-generate',
        'class' => ['button', 'button--primary', 'ai-generate-btn'],
      ],
    ];

    $form['dxpr_theme_settings']['colors']['wrapper']['ai_palette']['ai_error'] = [
      '#type' => 'html_tag',
      '#tag' => 'div',
      '#attributes' => [
        'id' => 'ai-palette-error',
        'class' => ['ai-palette-error'],
        'role' => 'alert',
      ],
    ];
  }
  else {
    // Show promotional message when AI module is not available.
    $form['dxpr_theme_settings']['colors']['wrapper']['ai_palette_promo'] = [
      '#type' => 'html_tag',
      '#tag' => 'p',
      '#value' => t('Install the <a href="@url">AI module</a> to generate color palettes with AI.', [
        '@url' => 'https://drupal.org/project/ai',
      ]),
      '#attributes' => [
        'class' => ['text-muted', 'fst-italic'],
      ],
    ];
  }

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
      '#size' => 7,
      '#maxlength' => 7,
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
