<?php

/**
 * @file
 * Block design theme settings.
 */

/**
 * Add block design options to the theme settings form.
 *
 * @param array $form
 *   Form array.
 * @param string $theme
 *   Theme machine name.
 */
function block_design_theme_settings(array &$form, $theme) {
  $form['dxpr_theme_settings']['block'] = [
    '#title' => t('Block Design'),
    '#type' => 'details',
    '#group' => 'dxpr_theme_settings',
    '#weight' => 25,
  ];

  $form['dxpr_theme_settings']['block']['block_preset'] = [
    '#type' => 'select',
    '#title' => t('Block Design Preset'),
    '#ai_description' => 'Quick-apply design preset for sidebar blocks and widget areas. (empty)=theme defaults. block_boxed=white boxes with shadow. block_outline=bordered blocks. block_card=Bootstrap card style. title_inverted=dark title bar. title_sticker=compact title. default_divider=title with divider. custom=full manual control.',
    '#default_value' => ((theme_get_setting('block_preset') !== NULL)) ? theme_get_setting('block_preset') : 'none',
    '#options' => [
      '' => t('None (Theme Defaults)'),
      'block_boxed' => t('Block Boxed'),
      'block_outline' => t('Block Outline'),
      'block_card' => t('Block Card Style'),
      'title_inverted' => t('Title Inverted'),
      'title_inverted_shape' => t('Title Inverted Pill'),
      'title_sticker' => t('Title Sticker'),
      'title_sticker_color' => t('Title Sticker Colored'),
      'title_outline' => t('Title Outline'),
      'default_divider' => t('Divider'),
      'hairline_divider' => t('Hairline Divider'),
      'custom' => t('Custom'),
    ],
    '#prefix' => '<div class="block-design-wrapper clearfix"><div class="block-design-settings">',
  ];

  $form['dxpr_theme_settings']['block']['block_advanced'] = [
    '#title' => t('Customize Design'),
    '#type' => 'details',
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
    '#prefix' => '<br>',
  ];

  $form['dxpr_theme_settings']['block']['block_advanced']['block_el'] = [
    '#title' => t('Block Element'),
    '#type' => 'details',
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  ];

  $card_options = [
    '' => t('Custom'),
    'card card-body' => t('Card'),
    'card card-body bg-primary' => t('Card DXPR Theme Primary Color'),
    'card card-body dxpr-theme-util-background-accent1' => t('Card Accent 1 Color'),
    'card card-body dxpr-theme-util-background-accent2' => t('Card Accent 2 Color'),
    'card card-body dxpr-theme-util-background-black' => t('Card Black'),
    'card card-body dxpr-theme-util-background-white' => t('Card White'),
    'card card-body dxpr-theme-util-background-gray' => t('Card Gray'),
  ];

  $form['dxpr_theme_settings']['block']['block_advanced']['block_el']['block_card'] = [
    '#type' => 'select',
    '#title' => t('Block Card Style'),
    '#ai_description' => 'Bootstrap card class applied to blocks. (empty)=no card. card card-body=default white card. bg-primary=primary color card. Use accent variants for colored sidebar sections. Overrides block_padding, block_border when set.',
    '#default_value' => theme_get_setting('block_card'),
    '#options' => $card_options,
  ];

  $form['dxpr_theme_settings']['block']['block_advanced']['block_el']['block_background'] = [
    '#type' => 'select',
    '#title' => t('Block Background'),
    '#ai_description' => 'Background color for blocks (when not using block_card). Creates colored block containers. Use a theme palette color or custom.',
    '#default_value' => theme_get_setting('block_background'),
    '#options' => _dxpr_theme_color_options($theme),
  ];

  $form['dxpr_theme_settings']['block']['block_advanced']['block_el']['block_background_custom'] = [
    '#type' => 'textfield',
    '#title' => t('Custom Value'),
    '#ai_description' => 'Custom hex for block background. Only used when block_background=custom. Light grays (#f5f5f5, #f8f9fa) create subtle card-like blocks.',
    '#default_value' => ((theme_get_setting('block_background_custom') !== NULL)) ? theme_get_setting('block_background_custom') : '#eeeeee',
    '#states' => [
      'visible' => [
        'select[name="block_background"]' => ['value' => 'custom'],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['block']['block_advanced']['block_el']['block_padding'] = [
    '#type' => 'range',
    '#title' => t('Block Padding'),
    '#ai_description' => 'Internal padding inside blocks. 0=no padding. 10-15px=compact. 20-30px=comfortable. Disabled when block_card is set.',
    '#default_value' => ((theme_get_setting('block_padding') !== NULL)) ? theme_get_setting('block_padding') : 0,
    '#min' => 0,
    '#max' => 30,
    '#step' => 1,
    '#attributes' => [
      'class' => ['dxb-slider', 'block-padding-range', 'border-size-slider'],
      'data-dxb-slider' => TRUE,
    ],
    '#states' => [
      'disabled' => [
        'select[name="block_card"]' => ['!value' => ''],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['block']['block_advanced']['block_el']['block_border_radius'] = [
    '#type' => 'range',
    '#title' => t('Block Border Radius'),
    '#ai_description' => 'Rounded corners on blocks. 0=sharp corners (corporate). 4-8px=subtle rounding (modern standard). 12-20px=noticeably rounded (friendly). Disabled when block_card is set.',
    '#default_value' => ((theme_get_setting('block_border_radius') !== NULL)) ? theme_get_setting('block_border_radius') : 0,
    '#min' => 0,
    '#max' => 100,
    '#step' => 1,
    '#attributes' => [
      'class' => ['dxb-slider', 'block-border-radius-range', 'border-radius-slider'],
      'data-dxb-slider' => TRUE,
    ],
    '#states' => [
      'disabled' => [
        'select[name="block_card"]' => ['!value' => ''],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['block']['block_advanced']['block_el']['block_border'] = [
    '#type' => 'range',
    '#title' => t('Block Border'),
    '#ai_description' => 'Border width around blocks. 0=no border. 1px=subtle outline. 2-3px=visible frame. Disabled when block_card is set.',
    '#default_value' => ((theme_get_setting('block_border') !== NULL)) ? theme_get_setting('block_border') : 0,
    '#min' => 0,
    '#max' => 30,
    '#step' => 1,
    '#attributes' => [
      'class' => ['dxb-slider', 'block-border-range', 'border-size-slider'],
      'data-dxb-slider' => TRUE,
    ],
    '#states' => [
      'disabled' => [
        'select[name="block_card"]' => ['!value' => ''],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['block']['block_advanced']['block_el']['block_border_color'] = [
    '#type' => 'select',
    '#title' => t('Block Border Color'),
    '#ai_description' => 'Color of the block border. Often a light gray (#dee2e6) for subtle definition. Only visible when block_border>0.',
    '#default_value' => theme_get_setting('block_border_color'),
    '#options' => _dxpr_theme_color_options($theme),
    '#states' => [
      'visible' => [
        'input[name="block_border"]' => ['!value' => '0'],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['block']['block_advanced']['block_el']['block_border_color_custom'] = [
    '#type' => 'textfield',
    '#title' => t('Custom Value'),
    '#ai_description' => 'Custom hex for block border. Only used when block_border_color=custom.',
    '#default_value' => ((theme_get_setting('block_border_color_custom') !== NULL)) ? theme_get_setting('block_border_color_custom') : '#eeeeee',
    '#states' => [
      'visible' => [
        'input[name="block_border"]' => ['!value' => '0'],
        'select[name="block_border_color"]' => ['value' => 'custom'],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['block']['block_advanced']['title_el'] = [
    '#title' => t('Block Title Element'),
    '#type' => 'details',
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  ];

  $form['dxpr_theme_settings']['block']['block_advanced']['title_el']['title_font_size'] = [
    '#type' => 'radios',
    '#title' => t('Title Font Size'),
    '#ai_description' => 'Heading level for block titles. h2=large section heading. h3=standard block title (default). h4=smaller heading. body=paragraph-sized (subtle).',
    '#default_value' => ((theme_get_setting('title_font_size') !== NULL)) ? theme_get_setting('title_font_size') : 'h3',
    '#options' => [
      'h1' => t('h1'),
      'h2' => t('h2'),
      'h3' => t('h3'),
      'h4' => t('h4'),
      'body' => t('Paragraph'),
    ],
  ];

  $form['dxpr_theme_settings']['block']['block_advanced']['title_el']['title_align'] = [
    '#type' => 'radios',
    '#title' => t('Title Align'),
    '#ai_description' => 'Block title text alignment. left=standard (default). center=formal/symmetrical. right=unconventional.',
    '#default_value' => ((theme_get_setting('title_align') !== NULL)) ? theme_get_setting('title_align') : 'left',
    '#options' => [
      'left' => t('Left'),
      'center' => t('Center'),
      'right' => t('Right'),
    ],
  ];

  $form['dxpr_theme_settings']['block']['block_advanced']['title_el']['title_card'] = [
    '#type' => 'select',
    '#title' => t('Title Card Style'),
    '#ai_description' => 'Bootstrap card styling on the title element separately from the block body. Creates a highlighted title bar.',
    '#default_value' => theme_get_setting('title_card'),
    '#options' => $card_options,
  ];

  $form['dxpr_theme_settings']['block']['block_advanced']['title_el']['title_background'] = [
    '#type' => 'select',
    '#title' => t('Title Background'),
    '#ai_description' => 'Background color for block titles. Creates colored title bars. Combined with contrasting text creates the inverted title look.',
    '#default_value' => theme_get_setting('title_background'),
    '#options' => _dxpr_theme_color_options($theme),
  ];

  $form['dxpr_theme_settings']['block']['block_advanced']['title_el']['title_background_custom'] = [
    '#type' => 'textfield',
    '#title' => t('Custom Value'),
    '#ai_description' => 'Custom hex for title background. Only used when title_background=custom.',
    '#default_value' => ((theme_get_setting('title_background_custom') !== NULL)) ? theme_get_setting('title_background_custom') : '#eeeeee',
    '#states' => [
      'visible' => [
        'select[name="title_background"]' => ['value' => 'custom'],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['block']['block_advanced']['title_el']['title_padding'] = [
    '#type' => 'range',
    '#title' => t('Title Padding'),
    '#ai_description' => 'Padding inside the title element. 5-10px=compact. 15-20px=comfortable. 25-30px=spacious title bar. Disabled when title_card is set.',
    '#default_value' => ((theme_get_setting('title_padding') !== NULL)) ? theme_get_setting('title_padding') : 10,
    '#min' => 0,
    '#max' => 30,
    '#step' => 1,
    '#attributes' => [
      'class' => ['dxb-slider', 'title-padding-range', 'border-size-slider'],
      'data-dxb-slider' => TRUE,
    ],
    '#states' => [
      'disabled' => [
        'select[name="title_card"]' => ['!value' => ''],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['block']['block_advanced']['title_el']['title_border'] = [
    '#type' => 'range',
    '#title' => t('Title Border'),
    '#ai_description' => 'Border width on block titles. 0=no border. 1-2px=subtle underline/frame. 3+px=bold accent.',
    '#default_value' => ((theme_get_setting('title_border') !== NULL)) ? theme_get_setting('title_border') : 0,
    '#min' => 0,
    '#max' => 30,
    '#step' => 1,
    '#attributes' => [
      'class' => ['dxb-slider', 'title-border-range', 'border-size-slider'],
      'data-dxb-slider' => TRUE,
    ],
    '#states' => [
      'disabled' => [
        'select[name="title_card"]' => ['!value' => ''],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['block']['block_advanced']['title_el']['title_border_radius'] = [
    '#type' => 'range',
    '#title' => t('Title Border Radius'),
    '#ai_description' => 'Rounded corners on the title element. 0=sharp. 4-8px=subtle.',
    '#default_value' => ((theme_get_setting('title_border_radius') !== NULL)) ? theme_get_setting('title_border_radius') : 0,
    '#min' => 0,
    '#max' => 30,
    '#step' => 1,
    '#attributes' => [
      'class' => ['dxb-slider', 'title-border-radius-range', 'border-radius-slider'],
      'data-dxb-slider' => TRUE,
    ],
    '#states' => [
      'disabled' => [
        'select[name="title_card"]' => ['!value' => ''],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['block']['block_advanced']['title_el']['title_border_color'] = [
    '#type' => 'select',
    '#title' => t('Title Border Color'),
    '#ai_description' => 'Color of the title border. Often an accent color for decorative emphasis.',
    '#default_value' => theme_get_setting('title_border_color'),
    '#options' => _dxpr_theme_color_options($theme),
    '#states' => [
      'visible' => [
        'input[name="title_border"]' => ['!value' => '0'],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['block']['block_advanced']['title_el']['title_border_color_custom'] = [
    '#type' => 'textfield',
    '#title' => t('Custom Value'),
    '#ai_description' => 'Custom hex for title border. Only used when title_border_color=custom.',
    '#default_value' => ((theme_get_setting('title_border_color_custom') !== NULL)) ? theme_get_setting('title_border_color_custom') : '#eeeeee',
    '#states' => [
      'visible' => [
        'input[name="title_border"]' => ['!value' => '0'],
        'select[name="title_border_color"]' => ['value' => 'custom'],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['block']['block_advanced']['title_el']['title_align'] = [
    '#type' => 'radios',
    '#title' => t('Title Align'),
    '#ai_description' => 'Block title text alignment. left=standard (default). center=formal/symmetrical. right=unconventional.',
    '#default_value' => ((theme_get_setting('title_align') !== NULL)) ? theme_get_setting('title_align') : 'left',
    '#options' => [
      'left' => t('Left'),
      'center' => t('Center'),
      'right' => t('Right'),
    ],
    '#states' => [
      'visible' => [
        ':input[name="title_sticker"]' => ['checked' => FALSE],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['block']['block_advanced']['title_el']['title_sticker'] = [
    '#type' => 'checkbox',
    '#title' => t('Title Sticker Mode'),
    '#default_value' => ((theme_get_setting('title_sticker') !== NULL)) ? theme_get_setting('title_sticker') : 0,
    '#description' => t("When enabled, the title width adjusts to fit its content instead of spanning the full block width."),
    '#ai_description' => 'When enabled, title element shrinks to fit its text content instead of spanning full block width. Creates compact modern title label. Works well with title_background. Overrides title_align.',
    '#prefix' => '<br>',
  ];

  $form['dxpr_theme_settings']['block']['block_advanced']['divider_el'] = [
    '#title' => t('Divider Element'),
    '#type' => 'details',
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  ];

  $form['dxpr_theme_settings']['block']['block_advanced']['divider_el']['block_divider'] = [
    '#type' => 'checkbox',
    '#title' => t('Add Divider to Block'),
    '#ai_description' => 'Add a horizontal divider line between block title and content. Creates clean visual separation. Popular in minimal/editorial designs.',
    '#default_value' => ((theme_get_setting('block_divider') !== NULL)) ? theme_get_setting('block_divider') : 0,
  ];

  $form['dxpr_theme_settings']['block']['block_advanced']['divider_el']['block_divider_custom'] = [
    '#type' => 'checkbox',
    '#title' => t('Customize Divider'),
    '#description' => t('Override the global divider styles from the Typography tab for this block only.'),
    '#ai_description' => 'Enable to override global divider settings with block-specific divider styling. Disable to inherit global divider_thickness/length/color.',
    '#default_value' => ((theme_get_setting('block_divider_custom') !== NULL)) ? theme_get_setting('block_divider_custom') : 0,
    '#states' => [
      'visible' => [
        ':input[name="block_divider"]' => ['checked' => TRUE],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['block']['block_advanced']['divider_el']['block_divider_color'] = [
    '#type' => 'select',
    '#title' => t('Divider Color'),
    '#ai_description' => 'Color for block-specific divider. Only active when block_divider=true and block_divider_custom=true.',
    '#default_value' => theme_get_setting('block_divider_color'),
    '#options' => _dxpr_theme_color_options($theme),
    '#states' => [
      'visible' => [
        ':input[name="block_divider"]' => ['checked' => TRUE],
        ':input[name="block_divider_custom"]' => ['checked' => TRUE],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['block']['block_advanced']['divider_el']['block_divider_color_custom'] = [
    '#type' => 'textfield',
    '#title' => t('Custom Value'),
    '#ai_description' => 'Custom hex for block divider. Only used when block_divider_color=custom.',
    '#default_value' => ((theme_get_setting('block_divider_color_custom') !== NULL)) ? theme_get_setting('block_divider_color_custom') : '#eeeeee',
    '#states' => [
      'visible' => [
        'select[name="block_divider_color"]' => ['value' => 'custom'],
        ':input[name="block_divider"]' => ['checked' => TRUE],
        ':input[name="block_divider_custom"]' => ['checked' => TRUE],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['block']['block_advanced']['divider_el']['block_divider_thickness_wrapper'] = [
    '#type' => 'container',
    '#attributes' => ['class' => ['dxb-slider-wrapper-container']],
    '#states' => [
      'visible' => [
        ':input[name="block_divider"]' => ['checked' => TRUE],
        ':input[name="block_divider_custom"]' => ['checked' => TRUE],
      ],
    ],
    'block_divider_thickness' => [
      '#type' => 'range',
      '#title' => t('Divider Thickness'),
      '#ai_description' => 'Thickness of block dividers. 1-2px=hairline. 3-4px=standard. Only active when block_divider=true and block_divider_custom=true.',
      '#default_value' => ((theme_get_setting('block_divider_thickness') !== NULL)) ? theme_get_setting('block_divider_thickness') : 4,
      '#min' => 0,
      '#max' => 20,
      '#step' => 1,
      '#attributes' => [
        'class' => ['dxb-slider', 'block-divider-thickness-range'],
        'data-dxb-slider' => TRUE,
      ],
    ],
  ];

  $form['dxpr_theme_settings']['block']['block_advanced']['divider_el']['block_divider_length_wrapper'] = [
    '#type' => 'container',
    '#attributes' => ['class' => ['dxb-slider-wrapper-container']],
    '#states' => [
      'visible' => [
        ':input[name="block_divider"]' => ['checked' => TRUE],
        ':input[name="block_divider_custom"]' => ['checked' => TRUE],
      ],
    ],
    'block_divider_length' => [
      '#type' => 'range',
      '#title' => t('Divider Length'),
      '#ai_description' => 'Width of block dividers. 0=full width. Short lengths (30-80px) create accent marks. Only active when block_divider=true and block_divider_custom=true.',
      '#default_value' => ((theme_get_setting('block_divider_length') !== NULL)) ? theme_get_setting('block_divider_length') : 10,
      '#min' => 0,
      '#max' => 500,
      '#step' => 1,
      '#attributes' => [
        'class' => ['dxb-slider', 'block-divider-length-range'],
        'data-dxb-slider' => TRUE,
      ],
    ],
  ];

  $form['dxpr_theme_settings']['block']['block_advanced']['divider_el']['block_divider_spacing_wrapper'] = [
    '#type' => 'container',
    '#attributes' => ['class' => ['dxb-slider-wrapper-container']],
    '#states' => [
      'visible' => [
        ':input[name="block_divider"]' => ['checked' => TRUE],
        ':input[name="block_divider_custom"]' => ['checked' => TRUE],
      ],
    ],
    'block_divider_spacing' => [
      '#type' => 'range',
      '#title' => t('Divider Spacing'),
      '#ai_description' => 'Vertical space above and below the block divider. 10-15px=tight. 20px=standard. 30+px=generous. Only active when block_divider=true and block_divider_custom=true.',
      '#default_value' => ((theme_get_setting('block_divider_spacing') !== NULL)) ? theme_get_setting('block_divider_spacing') : 20,
      '#min' => 0,
      '#max' => 100,
      '#step' => 1,
      '#attributes' => [
        'class' => ['dxb-slider', 'block-divider-spacing-range'],
        'data-dxb-slider' => TRUE,
      ],
    ],
  ];

  $form['dxpr_theme_settings']['block']['regions'] = [
    '#title' => t('Choose Regions'),
    '#type' => 'details',
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
    '#description' => t('Block design styles only apply to selected regions.'),
    '#suffix' => '</div></div>',
  ];

  $form['dxpr_theme_settings']['block']['regions']['block_design_regions'] = [
    '#type' => 'checkboxes',
    '#multiple' => TRUE,
    '#title' => t('Regions'),
    '#ai_description' => 'Select which theme regions these block design settings apply to. Common choices: sidebar_first, sidebar_second (sidebar widgets), footer (footer blocks), content (main content blocks).',
    '#default_value' => ((theme_get_setting('block_design_regions') !== NULL)) ? theme_get_setting('block_design_regions') : [],
    '#options' => [
      'secondary_header' => t('Secondary Header'),
      'navigation' => t('Navigation'),
      'slider' => t('Hero Region'),
      'header' => t('Page Title'),
      'highlighted' => t('Highlighted'),
      'help' => t('Help'),
      'sidebar_first' => t('Sidebar First'),
      'sidebar_second' => t('Sidebar Second'),
      'content_top' => t('Content Top'),
      'content_bottom' => t('Content Bottom'),
      'content' => t('Main Content'),
      'footer' => t('Footer'),
    ],
  ];
}
