<?php

/**
 * @file
 * Theme layout settings.
 */

/**
 * Add layout options to the theme settings form.
 *
 * @param array $form
 *   Form array.
 * @param string $theme
 *   Theme machine name.
 */
function layout_theme_settings(array &$form, $theme) {
  $form['dxpr_theme_settings']['layout'] = [
    '#title' => t('Layout'),
    '#type' => 'details',
    '#group' => 'dxpr_theme_settings',
    '#weight' => 5,
  ];

  $form['dxpr_theme_settings']['layout']['boxed_layout'] = [
    '#type' => 'checkbox',
    '#title' => t('Boxed Layout'),
    '#default_value' => ((theme_get_setting('boxed_layout') !== NULL)) ? theme_get_setting('boxed_layout') : 1,
    '#description' => t('When enabled, all container backgrounds are constrained to a centered column instead of spanning full width.'),
    '#ai_description' => 'Controls whether page backgrounds span full viewport or are contained in a centered column. 0 (off)=full-bleed backgrounds spanning entire browser width, modern and immersive, preferred for contemporary SaaS/portfolio/agency sites. 1 (on)=backgrounds constrained to centered box with visible page margins, traditional corporate/blog feel. Most modern designs use 0.',
  ];

  $form['dxpr_theme_settings']['layout']['sticky_footer'] = [
    '#type' => 'checkbox',
    '#title' => t('Sticky Footer'),
    '#default_value' => ((theme_get_setting('sticky_footer') !== NULL)) ? theme_get_setting('sticky_footer') : 1,
    '#description' => t('Keeps the footer at the bottom of the viewport on short pages. Not compatible with boxed layout.'),
    '#ai_description' => 'Prevents footer from floating mid-page when content is shorter than viewport. Enable (1) for most sites. Only relevant when boxed_layout is disabled (0).',
    '#states' => [
      'visible' => [
        ':input[name="boxed_layout"]' => ['checked' => FALSE],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['layout']['boxed_layout_boxbg'] = [
    '#type' => 'textfield',
    '#title' => t('Box Background'),
    '#default_value' => ((theme_get_setting('boxed_layout_boxbg') !== NULL)) ? theme_get_setting('boxed_layout_boxbg') : '#ffffff',
    '#description' => t('Background color for the main content area in boxed mode.'),
    '#ai_description' => 'Background color visible behind the centered content box when boxed_layout=1. Usually white (#ffffff) or very light gray (#f8f9fa). Only visible when boxed_layout is enabled.',
    '#states' => [
      'visible' => [
        ':input[name="boxed_layout"]' => ['checked' => TRUE],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['layout']['grid'] = [
    '#title' => t('Grid Settings'),
    '#type' => 'details',
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  ];

  $form['dxpr_theme_settings']['layout']['grid']['box_max_width_wrapper'] = [
    '#type' => 'container',
    '#attributes' => ['class' => ['dxb-slider-wrapper-container']],
    'box_max_width' => [
      '#type' => 'range',
      '#title' => t('Boxed Container Max-width'),
      '#default_value' => ((theme_get_setting('box_max_width') !== NULL)) ? theme_get_setting('box_max_width') : 1170,
      '#min' => 480,
      '#max' => 4100,
      '#step' => 10,
      '#description' => t('Maximum width of the boxed layout container. Set this higher than the content max-width.'),
      '#ai_description' => 'Maximum width of the boxed container. 1170px is Bootstrap default. 960-1170px for traditional readability, 1400-1600px for modern widescreen layouts. Only applies when boxed_layout=1.',
      '#attributes' => [
        'class' => ['dxb-slider', 'box-max-width-range'],
        'data-dxb-slider' => TRUE,
      ],
    ],
    '#states' => [
      'visible' => [
        ':input[name="boxed_layout"]' => ['checked' => TRUE],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['layout']['grid']['layout_max_width'] = [
    '#type' => 'range',
    '#title' => t('Content Max-width'),
    '#default_value' => ((theme_get_setting('layout_max_width') !== NULL)) ? theme_get_setting('layout_max_width') : 1170,
    '#min' => 480,
    '#max' => 4100,
    '#step' => 10,
    '#description' => t('Maximum width of the main content container. Default is 1170px.'),
    '#ai_description' => 'Maximum width of the main content container. Controls how wide content stretches on large screens. 1170px=Bootstrap default (traditional). 1400-1600px=modern widescreen. 960px=narrow focused reading. Wider values suit image-heavy portfolio/agency sites.',
    '#attributes' => [
      'class' => ['dxb-slider', 'layout-max-width-range'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['layout']['grid']['gutter_horizontal'] = [
    '#type' => 'range',
    '#title' => t('Column Spacing'),
    '#default_value' => ((theme_get_setting('gutter_horizontal') !== NULL)) ? theme_get_setting('gutter_horizontal') : 20,
    '#min' => 0,
    '#max' => 100,
    '#step' => 1,
    '#description' => t('Horizontal space between columns. Default is 20px.'),
    '#ai_description' => 'Space between Bootstrap grid columns. 15-20px=dense content-heavy layouts (news, dashboards). 30-40px=balanced modern designs. 50+px=airy luxury/portfolio spacing with lots of whitespace.',
    '#attributes' => [
      'class' => ['dxb-slider', 'gutter-horizontal-range'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['layout']['grid']['gutter_vertical'] = [
    '#type' => 'range',
    '#title' => t('Row Spacing'),
    '#default_value' => ((theme_get_setting('gutter_vertical') !== NULL)) ? theme_get_setting('gutter_vertical') : 0,
    '#min' => 0,
    '#max' => 100,
    '#step' => 1,
    '#description' => t('Vertical space between rows. Default is 0.'),
    '#ai_description' => 'Vertical space between grid rows. 0=rows touch (default, spacing managed by content). 10-20px=subtle separation. 30+px=strong visual separation between row elements.',
    '#attributes' => [
      'class' => ['dxb-slider', 'gutter-vertical-range'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['layout']['grid']['gutter_container'] = [
    '#type' => 'range',
    '#title' => t('Container Padding'),
    '#default_value' => ((theme_get_setting('gutter_container') !== NULL)) ? theme_get_setting('gutter_container') : 30,
    '#min' => 0,
    '#max' => 500,
    '#step' => 1,
    '#description' => t('Horizontal padding inside the container. Default is 30px.'),
    '#ai_description' => 'Horizontal padding inside the main container, i.e. the breathing room between content and viewport edge. 15-20px=compact. 30px=standard. 50+px=generous whitespace for luxury/editorial feel.',
    '#attributes' => [
      'class' => ['dxb-slider', 'gutter-container-range'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['layout']['background'] = [
    '#title' => t('Background Image'),
    '#type' => 'details',
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  ];

  // @see dxpr_theme_helper.module dxpr_theme_helper_settings_form_submit()
  $form['dxpr_theme_settings']['layout']['background']['background_image_path'] = [
    '#type' => 'textfield',
    '#title' => t('Background Image Path'),
    '#default_value' => theme_get_setting('background_image_path'),
    '#description' => t('Path to the background image file. This field is automatically populated when you upload an image below.'),
    '#ai_description' => 'File path to the site-wide body background image. Set via media upload or direct path. Common for textured backgrounds (paper, fabric) or subtle patterns.',
  ];
  $form['dxpr_theme_settings']['layout']['background']['background_image'] = [
    '#type' => 'media_library',
    '#allowed_bundles' => ['image'],
    '#title' => t('Upload Background Image'),
    '#default_value' => theme_get_setting('background_image'),
    '#description' => t('Upload a default background image. You can override this per node using the Header Image field.'),
    '#ai_description' => 'Upload a site-wide body background image. Creates a textured or photographic backdrop behind all page content. Can be overridden per-node.',
  ];

  $form['dxpr_theme_settings']['layout']['background']['background_image_style'] = [
    '#type' => 'radios',
    '#title' => t('Background Size'),
    '#ai_description' => 'How the background image fills the viewport. cover=fills entire area, crops to fit (best for photos). contain=shows full image, may leave gaps. no_repeat=actual pixel size. repeat=tiles the image (best for patterns/textures).',
    '#default_value' => ((theme_get_setting('background_image_style') !== NULL)) ? theme_get_setting('background_image_style') : 'cover',
    '#options' => [
      'cover' => t('Cover (fill area)'),
      'contain' => t('Contain (fit inside)'),
      'no_repeat' => t('Actual size'),
      'repeat' => t('Tile'),
    ],
  ];

  $form['dxpr_theme_settings']['layout']['background']['background_image_position'] = [
    '#type' => 'radios',
    '#title' => t('Background Position'),
    '#ai_description' => 'Anchor point for the background image. center_center=safe default for most images. left_top=align to top-left (logos, patterns). Adjust based on the image focal point.',
    '#default_value' => ((theme_get_setting('background_image_position') !== NULL)) ? theme_get_setting('background_image_position') : 'center_center',
    '#options' => [
      'center_center' => t('Center'),
      'left_top' => t('Top left'),
      'left_center' => t('Center left'),
      'left_bottom' => t('Bottom left'),
      'right_top' => t('Top right'),
      'right_center' => t('Center right'),
      'right_bottom' => t('Bottom right'),
      'center_bottom' => t('Bottom center'),
    ],
  ];

  $form['dxpr_theme_settings']['layout']['background']['background_image_attachment'] = [
    '#type' => 'radios',
    '#title' => t('Background Scroll Behavior'),
    '#ai_description' => 'scroll=background moves with page content (natural feel). fixed=background stays still while content scrolls over it (parallax effect, dramatic but can cause performance issues on mobile).',
    '#default_value' => ((theme_get_setting('background_image_attachment') !== NULL)) ? theme_get_setting('background_image_attachment') : 'fixed',
    '#options' => [
      'scroll' => t('Scroll with page'),
      'fixed' => t('Fixed (parallax effect)'),
    ],
  ];

  $form['dxpr_theme_settings']['layout']['mobile_layout'] = [
    '#title' => t('Mobile Layout'),
    '#type' => 'details',
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  ];

  $form['dxpr_theme_settings']['layout']['mobile_layout']['gutter_horizontal_mobile'] = [
    '#type' => 'range',
    '#title' => t('Column Spacing'),
    '#default_value' => ((theme_get_setting('gutter_horizontal_mobile') !== NULL)) ? theme_get_setting('gutter_horizontal_mobile') : 10,
    '#min' => 0,
    '#max' => 100,
    '#step' => 1,
    '#description' => t('Horizontal space between columns on viewports under 1200px. Default is 10px.'),
    '#ai_description' => 'Column spacing on mobile (below header_mobile_breakpoint). Usually smaller than desktop gutter_horizontal. 5-10px=tight mobile layout. 15-20px=comfortable mobile spacing.',
    '#attributes' => [
      'class' => ['dxb-slider', 'gutter-horizontal-mobile-range'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['layout']['mobile_layout']['gutter_vertical_mobile'] = [
    '#type' => 'range',
    '#title' => t('Row Spacing'),
    '#default_value' => ((theme_get_setting('gutter_vertical_mobile') !== NULL)) ? theme_get_setting('gutter_vertical_mobile') : 0,
    '#min' => 0,
    '#max' => 100,
    '#step' => 1,
    '#description' => t('Vertical space between rows on viewports under 1200px. Default is 0.'),
    '#ai_description' => 'Row spacing on mobile devices. Same logic as gutter_vertical but for smaller screens.',
    '#attributes' => [
      'class' => ['dxb-slider', 'gutter-vertical-mobile-range'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['layout']['mobile_layout']['gutter_container_mobile'] = [
    '#type' => 'range',
    '#title' => t('Container Padding'),
    '#default_value' => ((theme_get_setting('gutter_container_mobile') !== NULL)) ? theme_get_setting('gutter_container_mobile') : 20,
    '#min' => 0,
    '#max' => 500,
    '#step' => 1,
    '#description' => t('Horizontal padding inside the container on viewports under 1200px. Default is 20px.'),
    '#ai_description' => 'Container padding on mobile. 10-15px=maximizes content width on small screens. 20px=comfortable default. Keep smaller than desktop gutter_container.',
    '#attributes' => [
      'class' => ['dxb-slider', 'gutter-container-mobile-range'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  // Secondary Header.
  $form['dxpr_theme_settings']['layout']['mobile_layout']['secondary_header'] = [
    '#title' => t('Secondary Header'),
    '#type' => 'details',
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  ];

  $form['dxpr_theme_settings']['layout']['mobile_layout']['secondary_header']['secondary_header_hide'] = [
    '#type' => 'radios',
    '#title' => t('Hide on Small Devices'),
    '#ai_description' => 'Controls when the secondary header (top bar with contact info, social links, etc.) hides on smaller screens. hidden_none=always visible. hidden_xs=hide on phones (<768px). hidden_sm=hide on tablets (<992px). hidden_md=hide below desktop (<1200px). Hide early if secondary header is not critical to mobile UX.',
    '#default_value' => ((theme_get_setting('secondary_header_hide') !== NULL)) ? theme_get_setting('secondary_header_hide') : 'hidden_none',
    '#options' => [
      'hidden_none' => t('Never hide'),
      'hidden_xs' => t('Extra small devices (below 768px)'),
      'hidden_sm' => t('Small devices (below 992px)'),
      'hidden_md' => t('Medium devices (below 1200px)'),
    ],
  ];

  $form['dxpr_theme_settings']['layout']['granular_boxed'] = [
    '#title' => t('Full Width Regions and Content Types'),
    '#type' => 'details',
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  ];

  $form['dxpr_theme_settings']['layout']['granular_boxed']['full_width_containers'] = [
    '#type' => 'checkboxes',
    '#multiple' => TRUE,
    '#title' => t('Full Width Regions'),
    '#description' => t('Select regions that should span the full browser width. Useful for full-width blocks or full-screen backgrounds.'),
    '#ai_description' => 'Select regions whose backgrounds span the full browser width (edge-to-edge). Enable for regions where you want full-bleed color sections or hero images. Most modern designs enable this for all regions. Requires boxed_layout=0 to have visual effect.',
    '#default_value' => ((theme_get_setting('full_width_containers') !== NULL)) ? theme_get_setting('full_width_containers') : [],
    '#options' => [
      'cnt_secondary_header' => t('Secondary Header'),
      'cnt_header_nav' => t('Header / Navigation'),
      'cnt_page_title' => t('Page Title'),
      'cnt_content_top' => t('Content Top'),
      'cnt_content' => t('Content'),
      'cnt_content_bottom' => t('Content Bottom'),
      'cnt_footer' => t('Footer'),
    ],
  ];

  $default_options = _dxpr_theme_node_types_options();
  foreach ($default_options as $key => $value) {
    if (strpos($key, 'drag_drop') !== FALSE) {
      $default_options[$key] = $key;
    }
    else {
      $default_options[$key] = 0;
    }
  }
  $form['dxpr_theme_settings']['layout']['granular_boxed']['full_width_content_types'] = [
    '#type' => 'checkboxes',
    '#title' => t('Full Width Content Types'),
    '#description' => t('Enable full-width sections for these content types. Only works on pages without sidebars.'),
    '#ai_description' => 'Enable full-width content regions for specific content types. Only effective on pages without sidebars. Useful for landing pages and portfolio content types.',
    '#default_value' => ((theme_get_setting('full_width_content_types') !== NULL)) ? theme_get_setting('full_width_content_types') : $default_options,
    '#options' => _dxpr_theme_node_types_options(),
  ];

  $default_options = _dxpr_theme_node_types_options();
  foreach ($default_options as $key => $value) {
    if (in_array($key, ['blog', 'event', 'news', 'portfolio'])) {
      $default_options[$key] = $key;
    }
    else {
      $default_options[$key] = 0;
    }
  }

  $form['dxpr_theme_settings']['layout']['hide_regions'] = [
    '#title' => t('Hide Regions'),
    '#type' => 'details',
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  ];

  $form['dxpr_theme_settings']['layout']['hide_regions']['hidden_regions'] = [
    '#type' => 'checkboxes',
    '#multiple' => TRUE,
    '#title' => t('Hidden Regions'),
    '#description' => t('Selected regions will be hidden site-wide.'),
    '#ai_description' => 'Permanently hide theme regions site-wide. Useful for simplifying layouts, e.g. hide sidebar_first and sidebar_second for a single-column design, hide page_title for a minimal look, hide secondary_header if not using a top bar.',
    '#default_value' => ((theme_get_setting('hidden_regions') !== NULL)) ? theme_get_setting('hidden_regions') : [],
    '#options' => [
      'navigation' => t('Navigation (branding)'),
      'navigation_collapsible' => t('Navigation Collapsible (menu)'),
      'secondary_header' => t('Secondary Header'),
      'page_title' => t('Page Title'),
      'highlighted' => t('Hero Region'),
      'header' => t('Header'),
      'content_top' => t('Content Top'),
      'content' => t('Content'),
      'content_bottom' => t('Content Bottom'),
      'sidebar_first' => t('Primary'),
      'sidebar_second' => t('Secondary'),
      'footer' => t('Footer'),

    ],
  ];
}
