<?php

/**
 * @file
 * Theme typography settings.
 */

/**
 * Add typography options to the theme settings form.
 *
 * @param array $form
 *   Form array.
 * @param string $theme
 *   Theme machine name.
 */
function typography_theme_settings(array &$form, $theme) {
  $form['#attributes']['novalidate'] = 'novalidate';

  // Pass web-safe font stacks to JavaScript for live preview.
  $form['#attached']['drupalSettings']['dxpr_themeSettings']['fontStacks'] = _dxpr_theme_font_stack();

  $form['dxpr_theme_settings']['typography'] = [
    '#title' => t('Typography'),
    '#type' => 'details',
    '#group' => 'dxpr_theme_settings',
    '#weight' => 15,
  ];

  $form['dxpr_theme_settings']['typography']['body_line_height'] = [
    '#type' => 'range',
    '#title' => t('Body Line Height'),
    '#ai_description' => 'Space between lines of body text. 1.4-1.5=standard comfortable reading. 1.6-1.8=airy, open feel (luxury, editorial). 1.2-1.3=compact, dense (dashboards, data-heavy). Higher values improve readability for long-form content.',
    '#default_value' => ((theme_get_setting('body_line_height') !== NULL)) ? theme_get_setting('body_line_height') : 1.5,
    '#min' => 0,
    '#max' => 3,
    '#step' => 0.01,
    '#attributes' => [
      'class' => ['dxb-slider', 'body-line-height-range', 'line-height-slider'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['typography']['body_font_size'] = [
    '#type' => 'range',
    '#title' => t('Body Font Size'),
    '#ai_description' => 'Base font size for all body text in pixels. 14px=compact (traditional Drupal). 16px=modern web standard (recommended). 18px=large, accessible (editorial, luxury). 16px is the most widely recommended base size.',
    '#default_value' => ((theme_get_setting('body_font_size') !== NULL)) ? theme_get_setting('body_font_size') : 14,
    '#min' => 8,
    '#max' => 100,
    '#step' => 1,
    '#attributes' => [
      'class' => ['dxb-slider', 'body-font-size-range'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['typography']['nav_font_size'] = [
    '#type' => 'range',
    '#title' => t('Main menu Font Size'),
    '#ai_description' => 'Font size for main menu links. 12-13px=small subtle nav. 14-15px=standard. 16-18px=prominent nav links. Usually similar to or slightly smaller than body_font_size.',
    '#default_value' => ((theme_get_setting('nav_font_size') !== NULL)) ? theme_get_setting('nav_font_size') : 14,
    '#min' => 8,
    '#max' => 100,
    '#step' => 1,
    '#attributes' => [
      'class' => ['dxb-slider', 'nav-font-size-range'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['typography']['headings_line_height'] = [
    '#type' => 'range',
    '#title' => t('Headings Line Height'),
    '#ai_description' => 'Line height for headings. 1.0-1.1=tight (good for large display headings). 1.2-1.3=standard heading spacing. 1.4+=loose. Tighter line-height looks better on larger headings, especially uppercase.',
    '#default_value' => ((theme_get_setting('headings_line_height') !== NULL)) ? theme_get_setting('headings_line_height') : 1.05,
    '#min' => 0,
    '#max' => 3,
    '#step' => 0.1,
    '#attributes' => [
      'class' => ['dxb-slider', 'headings-line-height-range', 'line-height-slider'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['typography']['scale_factor'] = [
    '#type' => 'range',
    '#title' => t('Typography Scale Factor'),
    '#description' => t('This overrides advanced type controls.'),
    '#ai_description' => 'Typographic scale ratio multiplied across heading sizes. 1.0=manual control (use individual h1-h4 sizes). 1.125=major second (subtle). 1.25=major third (balanced, most popular). 1.333=perfect fourth. 1.5=perfect fifth (dramatic). 1.618=golden ratio. When >1, overrides individual h1-h4 font sizes.',
    '#default_value' => ((theme_get_setting('scale_factor') !== NULL)) ? theme_get_setting('scale_factor') : 1,
    '#min' => 1,
    '#max' => 2,
    '#step' => 0.01,
    '#attributes' => [
      'class' => ['dxb-slider', 'scale-factor-range'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['typography']['advanced_type'] = [
    '#title' => t('Advanced Type Controls'),
    '#description' => t('The Scale Factor control above will recalculate these font sizes when changed.'),
    '#type' => 'details',
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  ];

  $form['dxpr_theme_settings']['typography']['advanced_type']['h1_font_size'] = [
    '#type' => 'range',
    '#title' => t('H1 Font Size (Page Title)'),
    '#ai_description' => 'Font size for H1 (page titles, main headings). 28-32px=modest. 36-42px=standard (default 36). 48-64px=large display. 72+px=hero statement. Only active when scale_factor=1.',
    '#default_value' => ((theme_get_setting('h1_font_size') !== NULL)) ? theme_get_setting('h1_font_size') : 36,
    '#min' => 8,
    '#max' => 100,
    '#step' => 1,
    '#attributes' => [
      'class' => ['dxb-slider', 'h1-font-size-range', 'font-size-slider'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['typography']['advanced_type']['h2_font_size'] = [
    '#type' => 'range',
    '#title' => t('H2 Font Size'),
    '#ai_description' => 'Font size for H2 (section headings). Usually 60-80% of h1. 20-24px=compact. 28-32px=standard. Should be clearly smaller than h1 but larger than h3.',
    '#default_value' => ((theme_get_setting('h2_font_size') !== NULL)) ? theme_get_setting('h2_font_size') : 16,
    '#min' => 8,
    '#max' => 100,
    '#step' => 1,
    '#attributes' => [
      'class' => ['dxb-slider', 'h2-font-size-range', 'font-size-slider'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['typography']['advanced_type']['h3_font_size'] = [
    '#type' => 'range',
    '#title' => t('H3 Font Size'),
    '#ai_description' => 'Font size for H3 (subsection headings). 16-18px=subtle. 20-24px=clear. Should be visually distinct from body text but smaller than h2.',
    '#default_value' => ((theme_get_setting('h3_font_size') !== NULL)) ? theme_get_setting('h3_font_size') : 14,
    '#min' => 8,
    '#max' => 100,
    '#step' => 1,
    '#attributes' => [
      'class' => ['dxb-slider', 'h3-font-size-range', 'font-size-slider'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['typography']['advanced_type']['h4_font_size'] = [
    '#type' => 'range',
    '#title' => t('H4 Font Size'),
    '#ai_description' => 'Font size for H4 (minor headings, labels). 12-14px=same as body (distinguished by weight). 16-18px=slightly larger. Often same size as body but bold.',
    '#default_value' => ((theme_get_setting('h4_font_size') !== NULL)) ? theme_get_setting('h4_font_size') : 12,
    '#min' => 8,
    '#max' => 100,
    '#step' => 1,
    '#attributes' => [
      'class' => ['dxb-slider', 'h4-font-size-range', 'font-size-slider'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['typography']['advanced_type']['blockquote_font_size'] = [
    '#type' => 'range',
    '#title' => t('Blockquote Font Size'),
    '#ai_description' => 'Font size for blockquotes/pullquotes. Usually larger than body to create emphasis. 16-18px=subtle emphasis. 20-24px=clear callout. 28+px=dramatic pullquote.',
    '#default_value' => ((theme_get_setting('blockquote_font_size') !== NULL)) ? theme_get_setting('blockquote_font_size') : 16,
    '#min' => 8,
    '#max' => 100,
    '#step' => 1,
    '#attributes' => [
      'class' => ['dxb-slider', 'blockquote-font-size-range', 'font-size-slider'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['typography']['advanced_type']['blockquote_line_height'] = [
    '#type' => 'range',
    '#title' => t('Blockquote Line Height'),
    '#ai_description' => 'Line height for blockquotes. 1.4-1.6=comfortable reading. Often slightly more generous than body_line_height since blockquotes are usually larger text.',
    '#default_value' => ((theme_get_setting('blockquote_line_height') !== NULL)) ? theme_get_setting('blockquote_line_height') : 1.5,
    '#min' => 0,
    '#max' => 3,
    '#step' => 0.1,
    '#attributes' => [
      'class' => ['dxb-slider', 'blockquote-line-height-range', 'line-height-slider'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['typography']['advanced_type']['headings_letter_spacing'] = [
    '#type' => 'range',
    '#title' => t('Headings Letter Spacing'),
    '#ai_description' => 'Letter spacing (tracking) for headings in em units. 0=normal (default). 0.05-0.1em=slightly open (modern, clean). 0.15-0.2em=wide tracking (luxury, fashion). -0.02 to -0.05em=tight (heavy display headings). Wide tracking works best with uppercase headings.',
    '#default_value' => ((theme_get_setting('headings_letter_spacing') !== NULL)) ? theme_get_setting('headings_letter_spacing') : 0,
    '#min' => -0.1,
    '#max' => 0.3,
    '#step' => 0.01,
    '#attributes' => [
      'class' => ['dxb-slider', 'headings-letter-spacing-range'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['typography']['advanced_type']['headings_uppercase'] = [
    '#type' => 'checkbox',
    '#title' => t('Headings Uppercase'),
    '#ai_description' => 'Transform all headings to UPPERCASE. Creates a strong, authoritative look. Works well with wider headings_letter_spacing (0.05-0.1em). Common in corporate, fashion, and portfolio sites.',
    '#default_value' => ((theme_get_setting('headings_uppercase') !== NULL)) ? theme_get_setting('headings_uppercase') : FALSE,
    '#size' => 9,
    '#maxlength' => 9,
  ];

  $form['dxpr_theme_settings']['typography']['advanced_type']['headings_bold'] = [
    '#type' => 'checkbox',
    '#title' => t('Headings Bold'),
    '#ai_description' => 'Force all headings to bold weight. Enable for strong visual hierarchy. Some heading fonts already include bold weights, making this redundant.',
    '#default_value' => ((theme_get_setting('headings_bold') !== NULL)) ? theme_get_setting('headings_bold') : FALSE,
    '#size' => 9,
    '#maxlength' => 9,
  ];

  $form['dxpr_theme_settings']['typography']['advanced_type']['mobile_type'] = [
    '#title' => t('Mobile Type Controls'),
    '#type' => 'details',
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  ];

  $form['dxpr_theme_settings']['typography']['advanced_type']['mobile_type']['body_mobile_font_size'] = [
    '#type' => 'range',
    '#title' => t('Body Font Size'),
    '#ai_description' => 'Body text size on mobile screens. Usually same as desktop (14-16px) or slightly larger for thumb-distance reading. Never go below 14px on mobile for accessibility.',
    '#default_value' => ((theme_get_setting('body_mobile_font_size') !== NULL)) ? theme_get_setting('body_mobile_font_size') : 14,
    '#min' => 8,
    '#max' => 100,
    '#step' => 1,
    '#attributes' => [
      'class' => ['dxb-slider', 'body-mobile-font-size-range'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['typography']['advanced_type']['mobile_type']['nav_mobile_font_size'] = [
    '#type' => 'range',
    '#title' => t('Nav Font Size'),
    '#ai_description' => 'Navigation text size in the mobile hamburger menu. 14-16px=standard. 18-20px=large touch-friendly links.',
    '#default_value' => ((theme_get_setting('nav_mobile_font_size') !== NULL)) ? theme_get_setting('nav_mobile_font_size') : 14,
    '#min' => 8,
    '#max' => 100,
    '#step' => 1,
    '#attributes' => [
      'class' => ['dxb-slider', 'nav-mobile-font-size-range'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['typography']['advanced_type']['mobile_type']['h1_mobile_font_size'] = [
    '#type' => 'range',
    '#title' => t('H1 Font Size (Page Title)'),
    '#ai_description' => 'H1 size on mobile. Usually 60-80% of desktop h1 to fit small screens. 24-28px=compact. 32-36px=standard mobile heading.',
    '#default_value' => ((theme_get_setting('h1_mobile_font_size') !== NULL)) ? theme_get_setting('h1_mobile_font_size') : 36,
    '#min' => 8,
    '#max' => 100,
    '#step' => 1,
    '#attributes' => [
      'class' => ['dxb-slider', 'h1-mobile-font-size-range', 'font-size-slider'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['typography']['advanced_type']['mobile_type']['h2_mobile_font_size'] = [
    '#type' => 'range',
    '#title' => t('H2 Font Size'),
    '#ai_description' => 'H2 size on mobile. Scale proportionally with h1_mobile_font_size.',
    '#default_value' => ((theme_get_setting('h2_mobile_font_size') !== NULL)) ? theme_get_setting('h2_mobile_font_size') : 30,
    '#min' => 8,
    '#max' => 100,
    '#step' => 1,
    '#attributes' => [
      'class' => ['dxb-slider', 'h2-mobile-font-size-range', 'font-size-slider'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['typography']['advanced_type']['mobile_type']['h3_mobile_font_size'] = [
    '#type' => 'range',
    '#title' => t('H3 Font Size'),
    '#ai_description' => 'H3 size on mobile. Often same as desktop h3 since it is already relatively small.',
    '#default_value' => ((theme_get_setting('h3_mobile_font_size') !== NULL)) ? theme_get_setting('h3_mobile_font_size') : 16,
    '#min' => 8,
    '#max' => 100,
    '#step' => 1,
    '#attributes' => [
      'class' => ['dxb-slider', 'h3-mobile-font-size-range', 'font-size-slider'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['typography']['advanced_type']['mobile_type']['h4_mobile_font_size'] = [
    '#type' => 'range',
    '#title' => t('H4 Font Size'),
    '#ai_description' => 'H4 size on mobile. Often same as desktop h4.',
    '#default_value' => ((theme_get_setting('h4_mobile_font_size') !== NULL)) ? theme_get_setting('h4_mobile_font_size') : 14,
    '#min' => 8,
    '#max' => 100,
    '#step' => 1,
    '#attributes' => [
      'class' => ['dxb-slider', 'h4-mobile-font-size-range', 'font-size-slider'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['typography']['advanced_type']['mobile_type']['blockquote_mobile_font_size'] = [
    '#type' => 'range',
    '#title' => t('Blockquote Font Size'),
    '#ai_description' => 'Blockquote size on mobile. Can be slightly larger than desktop to maintain the pullquote emphasis effect on small screens.',
    '#default_value' => ((theme_get_setting('blockquote_mobile_font_size') !== NULL)) ? theme_get_setting('blockquote_mobile_font_size') : 18,
    '#min' => 8,
    '#max' => 100,
    '#step' => 1,
    '#attributes' => [
      'class' => ['dxb-slider', 'blockquote-mobile-font-size-range', 'font-size-slider'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['typography']['divider'] = [
    '#title' => t('Divider'),
    '#type' => 'details',
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  ];

  $form['dxpr_theme_settings']['typography']['divider']['divider_thickness'] = [
    '#type' => 'range',
    '#title' => t('Divider Thickness'),
    '#ai_description' => 'Height/thickness of horizontal rule dividers. 1-2px=hairline (subtle, elegant). 3-4px=standard (default 4). 6-8px=bold accent bar. 10+px=thick decorative band.',
    '#default_value' => ((theme_get_setting('divider_thickness') !== NULL)) ? theme_get_setting('divider_thickness') : 4,
    '#min' => 8,
    '#max' => 20,
    '#step' => 1,
    '#attributes' => [
      'class' => ['dxb-slider', 'divider-thickness-range'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['typography']['divider']['divider_length'] = [
    '#type' => 'range',
    '#title' => t('Divider Length'),
    '#description' => t('Set to 0 for full width.'),
    '#ai_description' => 'Width of the divider line. 0=full width (spans entire container). 50-100px=short accent mark (modern, minimal). 200-300px=medium decorative line.',
    '#default_value' => ((theme_get_setting('divider_length') !== NULL)) ? theme_get_setting('divider_length') : 100,
    '#min' => 0,
    '#max' => 500,
    '#step' => 10,
    '#attributes' => [
      'class' => ['dxb-slider', 'divider-length-range'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['typography']['divider']['divider_position'] = [
    '#type' => 'range',
    '#title' => t('Divider Position'),
    '#ai_description' => 'Horizontal alignment when divider_length is not 0. 1=left aligned. 2=centered (most common for short dividers). 3=right aligned.',
    '#default_value' => ((theme_get_setting('divider_position') !== NULL)) ? theme_get_setting('divider_position') : 1,
    '#min' => 1,
    '#max' => 3,
    '#step' => 1,
    '#states' => [
      'invisible' => [
        ':input[name="divider_length"]' => ['value' => '0'],
      ],
    ],
    '#attributes' => [
      'class' => ['dxb-slider', 'divider-position-range', 'element-invisible'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['typography']['divider']['divider_color'] = [
    '#type' => 'select',
    '#title' => t('Divider Color'),
    '#ai_description' => 'Color of the divider line. Use a theme palette color name or custom with divider_color_custom. Often a subtle gray or the primary accent color.',
    '#default_value' => theme_get_setting('divider_color'),
    '#options' => _dxpr_theme_color_options($theme),
  ];

  $form['dxpr_theme_settings']['typography']['divider']['divider_color_custom'] = [
    '#type' => 'textfield',
    '#title' => t('Custom Value'),
    '#ai_description' => 'Custom hex color for divider. Only used when divider_color=custom. #eeeeee=very subtle light gray. Use brand accent color for decorative emphasis.',
    '#default_value' => ((theme_get_setting('divider_color_custom') !== NULL)) ? theme_get_setting('divider_color_custom') : '#eeeeee',
    '#states' => [
      'visible' => [
        'select[name="divider_color"]' => ['value' => 'custom'],
      ],
    ],
  ];
}
