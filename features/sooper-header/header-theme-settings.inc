<?php

/**
 * @file
 * Theme header settings.
 */

/**
 * Add header options to the theme settings form.
 *
 * @param array $form
 *   Form array.
 * @param string $theme
 *   Theme machine name.
 */
function header_theme_settings(array &$form, $theme) {
  // Attach color palette for live preview of navigation color settings.
  $schemes = _dxpr_theme_get_color_schemes($theme);
  $palette = unserialize(theme_get_setting('color_palette') ?? '', ['allowed_classes' => FALSE]);
  $palette = $palette ?: ($schemes['default']['colors'] ?? []);

  $form['#attached']['drupalSettings']['dxpr_themeSettings']['colors'] = [
    'palette' => $palette,
    'schemes' => $schemes,
  ];

  $form['dxpr_theme_settings']['header'] = [
    '#title' => t('Header & Main Menu'),
    '#type' => 'details',
    '#group' => 'dxpr_theme_settings',
    '#weight' => 10,
  ];

  $form['dxpr_theme_settings']['header']['header_top'] = [
    '#title' => t('Header Options'),
    '#type' => 'details',
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  ];

  $form['dxpr_theme_settings']['header']['header_top']['header_top_layout'] = [
    '#type' => 'radios',
    '#title' => t('Layout'),
    '#default_value' => ((theme_get_setting('header_top_layout') !== NULL)) ? theme_get_setting('header_top_layout') : '0',
    '#options' => [
      '0' => t('Normal (Logo left, Menu Right)'),
      'centered' => t('Centered (stacked)'),
      'centered_inline' => t('Centered (inline)'),
      'logo_left_menu_left' => t('Logo Left, Menu Left'),
      'logo_center_menu_left' => t('Logo Center, Menu Left'),
      'logo_center_menu_right' => t('Logo Center, Menu Right'),
      'logo_right_menu_left' => t('Logo Right, Menu Left'),
    ],
    '#ai_description' => 'Visual arrangement of logo and navigation. 0=logo left, menu right (standard business/corporate, most versatile). centered=logo stacked above centered menu (boutique, restaurant, elegant). centered_inline=logo centered between split menu halves (fashion, luxury). logo_left_menu_left=both left-aligned (editorial, news). logo_center_menu_left=logo centered, menu left (portfolio). logo_center_menu_right=logo centered, menu right (portfolio variant). logo_right_menu_left=logo right, menu left (RTL-friendly, unconventional).',
  ];

  // Normalize header_style value - treat deprecated values as 'normal'.
  $header_style = theme_get_setting('header_style');
  $valid_header_styles = ['normal', 'overlay'];
  if (!in_array($header_style, $valid_header_styles, TRUE)) {
    $header_style = 'normal';
  }

  $form['dxpr_theme_settings']['header']['header_top']['header_style'] = [
    '#type' => 'radios',
    '#title' => t('Header Style'),
    '#description' => t('Overlay mode places the header over page content, allowing transparent backgrounds.'),
    '#ai_description' => 'normal=standard header with its own background band above page content. overlay=header floats transparently over page content (hero images show through). Overlay is dramatic for landing pages with hero images; pair with reduced header_top_bg_opacity for glass effect.',
    '#default_value' => $header_style,
    '#options' => [
      'normal' => t('Normal'),
      'overlay' => t('Overlay'),
    ],
  ];

  $form['dxpr_theme_settings']['header']['header_top']['header_top_bg_opacity'] = [
    '#type' => 'range',
    '#title' => t('Header Opacity'),
    '#default_value' => ((theme_get_setting('header_top_bg_opacity') !== NULL)) ? theme_get_setting('header_top_bg_opacity') : 1,
    '#min' => 0,
    '#max' => 1,
    '#step' => 0.01,
    '#description' => t('0 = transparent, 1 = opaque.'),
    '#ai_description' => 'Header background transparency. 1=fully opaque (solid). 0.8-0.95=subtle transparency (glass/frosted effect). 0.5=semi-transparent (content visible behind). 0=fully transparent (header floats invisibly). Best combined with header_style=overlay for hero sections.',
    '#attributes' => [
      'class' => ['dxb-slider', 'header-top-bg-opacity-range'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['header']['header_top']['header_top_height'] = [
    '#type' => 'range',
    '#title' => t('Height'),
    '#default_value' => ((theme_get_setting('header_top_height') !== NULL)) ? theme_get_setting('header_top_height') : 100,
    '#min' => 10,
    '#max' => 200,
    '#step' => 1,
    '#description' => t('Initial height of the header.'),
    '#ai_description' => 'Header height controls visual prominence. 60-80px=compact modern header (SaaS, tech). 100px=standard balanced. 120-150px=tall prominent header (luxury, portfolio). 150-200px=very tall statement header. Pairs with logo_height percentage.',
    '#attributes' => [
      'class' => ['dxb-slider', 'header-top-height-range'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['header']['header_top']['logo_height'] = [
    '#type' => 'range',
    '#title' => t('Logo Height'),
    '#default_value' => theme_get_setting('logo_height') ?: 50,
    '#min' => 10,
    '#max' => 100,
    '#step' => 1,
    '#description' => t('Logo height as percentage of the header height.'),
    '#ai_description' => 'Logo height as percentage of header height. 50%=logo uses half the header (balanced). 70-80%=logo dominates header (brand-focused). 30-40%=subtle small logo (minimalist). Actual pixel height = header_top_height x logo_height/100.',
    '#attributes' => [
      'class' => ['dxb-slider', 'logo-height-range'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['header']['header_top']['header_top_fixed'] = [
    '#type' => 'checkbox',
    '#title' => t('Fixed Position'),
    '#default_value' => ((theme_get_setting('header_top_fixed') !== NULL)) ? theme_get_setting('header_top_fixed') : FALSE,
    '#description' => t('Header stays visible at the top when scrolling.'),
    '#ai_description' => 'Enable to keep header always visible at top of viewport while scrolling. Essential for sites with important navigation. Disable for content-focused reading experiences (blogs, articles) where you want maximum content space.',
  ];

  $form['dxpr_theme_settings']['header']['header_top']['header_top_sticky'] = [
    '#type' => 'checkbox',
    '#title' => t('Sticky Header'),
    '#default_value' => ((theme_get_setting('header_top_sticky') !== NULL)) ? theme_get_setting('header_top_sticky') : FALSE,
    '#description' => t('Header appears after scrolling past a specified offset.'),
    '#ai_description' => 'Requires header_top_fixed=true. When enabled, header shrinks/transforms after scrolling past header_top_height_sticky_offset. Creates a compact navigation that appears on scroll, a common modern UX pattern. Configure the smaller size with header_top_height_scroll.',
    '#states' => [
      'visible' => [
        ':input[name="header_top_fixed"]' => ['checked' => TRUE],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['header']['header_top']['second_header_sticky'] = [
    '#type' => 'checkbox',
    '#title' => t('Sticky Second Header'),
    '#ai_description' => 'Makes the secondary header bar also stick when scrolling. Only relevant when header_style=overlay and header_top_sticky=true. Usually disabled to keep sticky header compact.',
    '#default_value' => ((theme_get_setting('second_header_sticky') !== NULL)) ? theme_get_setting('second_header_sticky') : FALSE,
    '#states' => [
      'visible' => [
        ':input[name="header_style"]' => ['value' => 'overlay'],
        ':input[name="header_top_sticky"]' => ['checked' => TRUE],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['header']['header_top']['sticky'] = [
    '#title' => t('Sticky Header Options'),
    '#type' => 'details',
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
    '#states' => [
      'visible' => [
        ':input[name="header_top_fixed"]' => ['checked' => TRUE],
        ':input[name="header_top_sticky"]' => ['checked' => TRUE],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['header']['header_top']['sticky']['header_top_sticky_show'] = [
    '#type' => 'radios',
    '#title' => t('Hide before Scrolling'),
    '#default_value' => ((theme_get_setting('header_top_sticky_show') !== NULL)) ? theme_get_setting('header_top_sticky_show') : 'always',
    '#options' => [
      'always' => t('Always Show'),
      'after_scroll' => t('Hide initially. Show after scroll offset'),
    ],
    '#description' => t('Use Overlay mode to prevent empty space at the top when hidden initially.'),
    '#ai_description' => 'always=sticky header always visible as you scroll. after_scroll=header hides initially and only appears after scrolling down (saves space, reveals on intent). The after_scroll pattern is popular on mobile-first and content-heavy sites.',
    '#states' => [
      'visible' => [
        ':input[name="header_top_fixed"]' => ['checked' => TRUE],
        ':input[name="header_top_sticky"]' => ['checked' => TRUE],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['header']['header_top']['sticky']['header_top_height_sticky_offset'] = [
    '#type' => 'range',
    '#title' => t('Scroll offset'),
    '#default_value' => ((theme_get_setting('header_top_height_sticky_offset') !== NULL)) ? theme_get_setting('header_top_height_sticky_offset') : 60,
    '#min' => 0,
    '#max' => 2096,
    '#step' => 10,
    '#description' => t('Scroll distance before header becomes fixed.'),
    '#ai_description' => 'How far user must scroll (in px) before sticky header appears. 60px=appears quickly. 200-400px=appears after scrolling past hero section. Match to your hero/banner height for smooth transition.',
    '#states' => [
      'visible' => [
        ':input[name="header_top_fixed"]' => ['checked' => TRUE],
        ':input[name="header_top_sticky"]' => ['checked' => TRUE],
      ],
    ],
    '#attributes' => [
      'class' => ['dxb-slider', 'header-top-height-sticky-offset-range'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['header']['header_top']['sticky']['header_top_height_scroll'] = [
    '#type' => 'range',
    '#title' => t('Height'),
    '#default_value' => ((theme_get_setting('header_top_height_scroll') !== NULL)) ? theme_get_setting('header_top_height_scroll') : 50,
    '#min' => 10,
    '#max' => 200,
    '#step' => 1,
    '#description' => t('Header height after scrolling past scroll offset.'),
    '#ai_description' => 'Height of the header after it enters sticky mode. Usually smaller than header_top_height for a compact scrolled state. 40-60px=compact. 70-90px=moderate. Common pattern: header_top_height=100, header_top_height_scroll=60.',
    '#states' => [
      'visible' => [
        ':input[name="header_top_fixed"]' => ['checked' => TRUE],
        ':input[name="header_top_sticky"]' => ['checked' => TRUE],
      ],
    ],
    '#attributes' => [
      'class' => ['dxb-slider', 'header-top-height-scroll-range'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['header']['header_top']['sticky']['header_top_bg_opacity_scroll'] = [
    '#type' => 'range',
    '#title' => t('Background Opacity'),
    '#default_value' => ((theme_get_setting('header_top_bg_opacity_scroll') !== NULL)) ? theme_get_setting('header_top_bg_opacity_scroll') : 1,
    '#min' => 0,
    '#max' => 1,
    '#step' => 0.01,
    '#description' => t('0 = transparent, 1 = opaque.'),
    '#ai_description' => 'Background opacity after entering sticky mode. Usually 1 (fully opaque) so sticky header is readable against any content. Set to 0.9-0.95 for subtle glass effect in sticky state.',
    '#states' => [
      'visible' => [
        ':input[name="header_top_fixed"]' => ['checked' => TRUE],
        ':input[name="header_top_sticky"]' => ['checked' => TRUE],
      ],
    ],
    '#attributes' => [
      'class' => ['dxb-slider', 'header-top-bg-opacity-scroll-range'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['header']['header_top']['navcolors'] = [
    '#title' => t('Custom Header Colors'),
    '#type' => 'details',
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  ];

  $form['dxpr_theme_settings']['header']['header_top']['navcolors']['navbar_background'] = [
    '#type' => 'select',
    '#title' => t('Navbar Background'),
    '#ai_description' => 'Background color for the entire navbar area. Use a theme palette color name or custom with navbar_background_custom. Leave empty for transparent. Dark backgrounds create dramatic headers; light/white creates clean modern feel.',
    '#default_value' => theme_get_setting('navbar_background'),
    '#options' => _dxpr_theme_color_options($theme),
  ];

  $form['dxpr_theme_settings']['header']['header_top']['navcolors']['navbar_background_custom'] = [
    '#type' => 'textfield',
    '#title' => t('Custom Navbar Background'),
    '#ai_description' => 'Custom hex color for navbar background. Only used when navbar_background=custom. Set to match your brand color for branded headers.',
    '#default_value' => ((theme_get_setting('navbar_background_custom') !== NULL)) ? theme_get_setting('navbar_background_custom') : theme_get_setting('navbar_background_custom'),
    '#states' => [
      'visible' => [
        ':input[name="navbar_background"]' => ['value' => 'custom'],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['header']['header_top']['navcolors']['navbar_text_color'] = [
    '#type' => 'select',
    '#title' => t('Navbar Text'),
    '#ai_description' => 'Text/link color in the navbar. Must contrast with navbar_background for readability. Light text on dark backgrounds, dark text on light backgrounds.',
    '#default_value' => theme_get_setting('navbar_text_color'),
    '#options' => _dxpr_theme_color_options($theme),
  ];

  $form['dxpr_theme_settings']['header']['header_top']['navcolors']['navbar_text_color_custom'] = [
    '#type' => 'textfield',
    '#title' => t('Custom Navbar Text Color'),
    '#ai_description' => 'Custom hex color for navbar text. Only used when navbar_text_color=custom.',
    '#default_value' => theme_get_setting('navbar_text_color_custom'),
    '#states' => [
      'visible' => [
        ':input[name="navbar_text_color"]' => ['value' => 'custom'],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['header']['header_top']['navcolors']['header_block_background'] = [
    '#type' => 'select',
    '#title' => t('Block Background'),
    '#ai_description' => 'Background color for blocks placed in the header region (search, contact info, etc.). Often matches navbar_background or uses a complementary color.',
    '#default_value' => theme_get_setting('header_block_background'),
    '#options' => _dxpr_theme_color_options($theme),
  ];

  $form['dxpr_theme_settings']['header']['header_top']['navcolors']['header_block_background_custom'] = [
    '#type' => 'textfield',
    '#title' => t('Custom Block Background'),
    '#ai_description' => 'Custom hex color for header block background. Only used when header_block_background=custom.',
    '#default_value' => ((theme_get_setting('header_block_background_custom') !== NULL)) ? theme_get_setting('header_block_background_custom') : theme_get_setting('header_block_background_custom'),
    '#states' => [
      'visible' => [
        ':input[name="header_block_background"]' => ['value' => 'custom'],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['header']['header_top']['navcolors']['header_block_text_color'] = [
    '#type' => 'select',
    '#title' => t('Block Text'),
    '#ai_description' => 'Text color in header blocks. Must contrast with header_block_background.',
    '#default_value' => theme_get_setting('header_block_text_color'),
    '#options' => _dxpr_theme_color_options($theme),
  ];

  $form['dxpr_theme_settings']['header']['header_top']['navcolors']['header_block_text_color_custom'] = [
    '#type' => 'textfield',
    '#title' => t('Custom Block Text Color'),
    '#ai_description' => 'Custom hex color for header block text. Only used when header_block_text_color=custom.',
    '#default_value' => ((theme_get_setting('header_block_text_color_custom') !== NULL)) ? theme_get_setting('header_block_text_color_custom') : theme_get_setting('header_block_text_color_custom'),
    '#states' => [
      'visible' => [
        ':input[name="header_block_text_color"]' => ['value' => 'custom'],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['header']['header_top']['navcolors']['menu_background'] = [
    '#type' => 'select',
    '#title' => t('Menu Background'),
    '#ai_description' => 'Background color specifically for the main navigation menu area. Often transparent (empty) to inherit from navbar, or a distinct color to visually separate menu from rest of header.',
    '#default_value' => theme_get_setting('menu_background'),
    '#options' => _dxpr_theme_color_options($theme),
  ];

  $form['dxpr_theme_settings']['header']['header_top']['navcolors']['menu_background_custom'] = [
    '#type' => 'textfield',
    '#title' => t('Custom Menu Background'),
    '#ai_description' => 'Custom hex for menu background. Only used when menu_background=custom.',
    '#default_value' => ((theme_get_setting('menu_background_custom') !== NULL)) ? theme_get_setting('menu_background_custom') : theme_get_setting('menu_background_custom'),
    '#states' => [
      'visible' => [
        ':input[name="menu_background"]' => ['value' => 'custom'],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['header']['header_top']['navcolors']['menu_text_color'] = [
    '#type' => 'select',
    '#title' => t('Menu Text'),
    '#ai_description' => 'Color of main menu link text. Should contrast with menu_background (or navbar_background if menu_background is empty).',
    '#default_value' => theme_get_setting('menu_text_color'),
    '#options' => _dxpr_theme_color_options($theme),
  ];

  $form['dxpr_theme_settings']['header']['header_top']['navcolors']['menu_text_color_custom'] = [
    '#type' => 'textfield',
    '#title' => t('Custom Menu Text Color'),
    '#ai_description' => 'Custom hex for menu text. Only used when menu_text_color=custom.',
    '#default_value' => ((theme_get_setting('menu_text_color_custom') !== NULL)) ? theme_get_setting('menu_text_color_custom') : theme_get_setting('menu_text_color_custom'),
    '#states' => [
      'visible' => [
        ':input[name="menu_text_color"]' => ['value' => 'custom'],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['header']['header_top']['navcolors']['menu_hover_background'] = [
    '#type' => 'select',
    '#title' => t('Menu Hover Background'),
    '#ai_description' => 'Background color that appears when hovering over a menu item. Creates visual feedback. Use a slightly lighter/darker shade of menu_background, or an accent color for emphasis.',
    '#default_value' => theme_get_setting('menu_hover_background'),
    '#options' => _dxpr_theme_color_options($theme),
  ];

  $form['dxpr_theme_settings']['header']['header_top']['navcolors']['menu_hover_background_custom'] = [
    '#type' => 'textfield',
    '#title' => t('Custom Menu Hover Background'),
    '#ai_description' => 'Custom hex for menu hover background. Only used when menu_hover_background=custom.',
    '#default_value' => ((theme_get_setting('menu_hover_background_custom') !== NULL)) ? theme_get_setting('menu_hover_background_custom') : theme_get_setting('menu_hover_background_custom'),
    '#states' => [
      'visible' => [
        ':input[name="menu_hover_background"]' => ['value' => 'custom'],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['header']['header_top']['navcolors']['menu_hover_text_color'] = [
    '#type' => 'select',
    '#title' => t('Menu Hover Text'),
    '#ai_description' => 'Text color of menu items on hover. Often an accent/brand color to highlight the active item.',
    '#default_value' => theme_get_setting('menu_hover_text_color'),
    '#options' => _dxpr_theme_color_options($theme),
  ];

  $form['dxpr_theme_settings']['header']['header_top']['navcolors']['menu_hover_text_color_custom'] = [
    '#type' => 'textfield',
    '#title' => t('Custom Menu Hover Text Color'),
    '#ai_description' => 'Custom hex for menu hover text. Only used when menu_hover_text_color=custom.',
    '#default_value' => ((theme_get_setting('menu_hover_text_color_custom') !== NULL)) ? theme_get_setting('menu_hover_text_color_custom') : theme_get_setting('menu_hover_text_color_custom'),
    '#states' => [
      'visible' => [
        ':input[name="menu_hover_text_color"]' => ['value' => 'custom'],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['header']['header_top']['navcolors']['dropdown_background'] = [
    '#type' => 'select',
    '#title' => t('Dropdown Background'),
    '#ai_description' => 'Background color of dropdown/submenu panels. Usually white or light gray for readability. Dark dropdowns work on dark-themed sites.',
    '#default_value' => theme_get_setting('dropdown_background'),
    '#options' => _dxpr_theme_color_options($theme),
  ];

  $form['dxpr_theme_settings']['header']['header_top']['navcolors']['dropdown_background_custom'] = [
    '#type' => 'textfield',
    '#title' => t('Custom Dropdown Background'),
    '#ai_description' => 'Custom hex for dropdown background. Only used when dropdown_background=custom.',
    '#default_value' => ((theme_get_setting('dropdown_background_custom') !== NULL)) ? theme_get_setting('dropdown_background_custom') : theme_get_setting('dropdown_background_custom'),
    '#states' => [
      'visible' => [
        ':input[name="dropdown_background"]' => ['value' => 'custom'],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['header']['header_top']['navcolors']['dropdown_text_color'] = [
    '#type' => 'select',
    '#title' => t('Dropdown Text'),
    '#ai_description' => 'Text color inside dropdown menus. Must contrast with dropdown_background.',
    '#default_value' => theme_get_setting('dropdown_text_color'),
    '#options' => _dxpr_theme_color_options($theme),
  ];

  $form['dxpr_theme_settings']['header']['header_top']['navcolors']['dropdown_text_color_custom'] = [
    '#type' => 'textfield',
    '#title' => t('Custom Dropdown Text Color'),
    '#ai_description' => 'Custom hex for dropdown text. Only used when dropdown_text_color=custom.',
    '#default_value' => ((theme_get_setting('dropdown_text_color_custom') !== NULL)) ? theme_get_setting('dropdown_text_color_custom') : theme_get_setting('dropdown_text_color_custom'),
    '#states' => [
      'visible' => [
        ':input[name="dropdown_text_color"]' => ['value' => 'custom'],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['header']['header_top']['navcolors']['dropdown_hover_background'] = [
    '#type' => 'select',
    '#title' => t('Dropdown Hover Background'),
    '#ai_description' => 'Background color when hovering over dropdown items. Subtle shade change (e.g., #f5f5f5 on white) provides feedback.',
    '#default_value' => theme_get_setting('dropdown_hover_background'),
    '#options' => _dxpr_theme_color_options($theme),
  ];

  $form['dxpr_theme_settings']['header']['header_top']['navcolors']['dropdown_hover_background_custom'] = [
    '#type' => 'textfield',
    '#title' => t('Custom Dropdown Hover Background'),
    '#ai_description' => 'Custom hex for dropdown hover background. Only used when dropdown_hover_background=custom.',
    '#default_value' => ((theme_get_setting('dropdown_hover_background_custom') !== NULL)) ? theme_get_setting('dropdown_hover_background_custom') : theme_get_setting('dropdown_hover_background_custom'),
    '#states' => [
      'visible' => [
        ':input[name="dropdown_hover_background"]' => ['value' => 'custom'],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['header']['header_top']['navcolors']['dropdown_hover_text_color'] = [
    '#type' => 'select',
    '#title' => t('Dropdown Hover Text'),
    '#ai_description' => 'Text color of dropdown items on hover. Often matches brand/accent color.',
    '#default_value' => theme_get_setting('dropdown_hover_text_color'),
    '#options' => _dxpr_theme_color_options($theme),
  ];

  $form['dxpr_theme_settings']['header']['header_top']['navcolors']['dropdown_hover_text_color_custom'] = [
    '#type' => 'textfield',
    '#title' => t('Custom Dropdown Hover Text Color'),
    '#ai_description' => 'Custom hex for dropdown hover text. Only used when dropdown_hover_text_color=custom.',
    '#default_value' => ((theme_get_setting('dropdown_hover_text_color_custom') !== NULL)) ? theme_get_setting('dropdown_hover_text_color_custom') : theme_get_setting('dropdown_hover_text_color_custom'),
    '#states' => [
      'visible' => [
        ':input[name="dropdown_hover_text_color"]' => ['value' => 'custom'],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['header']['header_top']['navcolors']['mobile_menu_background'] = [
    '#type' => 'select',
    '#title' => t('Mobile Menu Background'),
    '#ai_description' => 'Background color of the mobile hamburger menu panel. Usually matches the site header color or uses a dark overlay. Ensure good contrast with mobile_menu_text_color.',
    '#default_value' => theme_get_setting('mobile_menu_background'),
    '#options' => _dxpr_theme_color_options($theme),
  ];

  $form['dxpr_theme_settings']['header']['header_top']['navcolors']['mobile_menu_background_custom'] = [
    '#type' => 'textfield',
    '#title' => t('Custom Mobile Menu Background'),
    '#ai_description' => 'Custom hex for mobile menu background. Only used when mobile_menu_background=custom.',
    '#default_value' => ((theme_get_setting('mobile_menu_background_custom') !== NULL)) ? theme_get_setting('mobile_menu_background_custom') : theme_get_setting('mobile_menu_background_custom'),
    '#states' => [
      'visible' => [
        ':input[name="mobile_menu_background"]' => ['value' => 'custom'],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['header']['header_top']['navcolors']['mobile_menu_text_color'] = [
    '#type' => 'select',
    '#title' => t('Mobile Menu Text'),
    '#ai_description' => 'Text color of links in the mobile menu. Must be clearly readable against mobile_menu_background.',
    '#default_value' => theme_get_setting('mobile_menu_text_color'),
    '#options' => _dxpr_theme_color_options($theme),
  ];

  $form['dxpr_theme_settings']['header']['header_top']['navcolors']['mobile_menu_text_color_custom'] = [
    '#type' => 'textfield',
    '#title' => t('Custom Mobile Menu Text Color'),
    '#ai_description' => 'Custom hex for mobile menu text. Only used when mobile_menu_text_color=custom.',
    '#default_value' => ((theme_get_setting('mobile_menu_text_color_custom') !== NULL)) ? theme_get_setting('mobile_menu_text_color_custom') : theme_get_setting('mobile_menu_text_color_custom'),
    '#states' => [
      'visible' => [
        ':input[name="mobile_menu_text_color"]' => ['value' => 'custom'],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['header']['header_top']['navcolors']['mobile_menu_hover_background'] = [
    '#type' => 'select',
    '#title' => t('Mobile Menu Hover Background'),
    '#ai_description' => 'Background color when tapping/hovering mobile menu items. Provides touch feedback.',
    '#default_value' => theme_get_setting('mobile_menu_hover_background'),
    '#options' => _dxpr_theme_color_options($theme),
  ];

  $form['dxpr_theme_settings']['header']['header_top']['navcolors']['mobile_menu_hover_background_custom'] = [
    '#type' => 'textfield',
    '#title' => t('Custom Mobile Menu Hover Background'),
    '#ai_description' => 'Custom hex for mobile menu hover background. Only used when mobile_menu_hover_background=custom.',
    '#default_value' => theme_get_setting('mobile_menu_hover_background_custom'),
    '#states' => [
      'visible' => [
        ':input[name="mobile_menu_hover_background"]' => ['value' => 'custom'],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['header']['header_top']['navcolors']['mobile_menu_hover_text_color'] = [
    '#type' => 'select',
    '#title' => t('Mobile Menu Hover Text'),
    '#ai_description' => 'Text color of mobile menu items on hover/tap.',
    '#default_value' => theme_get_setting('mobile_menu_hover_text_color'),
    '#options' => _dxpr_theme_color_options($theme),
  ];

  $form['dxpr_theme_settings']['header']['header_top']['navcolors']['mobile_menu_hover_text_color_custom'] = [
    '#type' => 'textfield',
    '#title' => t('Custom Mobile Menu Hover Text Color'),
    '#ai_description' => 'Custom hex for mobile menu hover text. Only used when mobile_menu_hover_text_color=custom.',
    '#default_value' => theme_get_setting('mobile_menu_hover_text_color_custom'),
    '#states' => [
      'visible' => [
        ':input[name="mobile_menu_hover_text_color"]' => ['value' => 'custom'],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['header']['header_side'] = [
    '#title' => t('Mobile Menu Options'),
    '#type' => 'details',
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  ];

  $form['dxpr_theme_settings']['header']['header_side']['hamburger_menu'] = [
    '#type' => 'radios',
    '#title' => t('Hamburger Icon Style'),
    '#default_value' => ((theme_get_setting('hamburger_menu') !== NULL)) ? theme_get_setting('hamburger_menu') : 'three-dash',
    '#options' => [
      'three-dash' => t('Three lines'),
      'two-dash' => t('Two lines'),
    ],
    '#ai_description' => 'Mobile menu toggle icon style. three-dash=classic three-line hamburger (universally recognized). two-dash=minimal two-line variant (modern, slightly less recognizable).',
  ];

  $form['dxpr_theme_settings']['header']['header_side']['hamburger_animation'] = [
    '#type' => 'radios',
    '#title' => t('Hamburger Animation'),
    '#default_value' => ((theme_get_setting('hamburger_animation') !== NULL)) ? theme_get_setting('hamburger_animation') : 'cross',
    '#options' => [
      'none' => t('None'),
      'cross' => t('Cross'),
    ],
    '#ai_description' => 'Animation when the hamburger icon is tapped. none=static icon. cross=lines animate into an X when menu opens (polished, signals close). Cross animation is the modern standard.',
  ];

  $form['dxpr_theme_settings']['header']['header_side']['header_side_align'] = [
    '#type' => 'radios',
    '#title' => t('Mobile Menu Alignment'),
    '#default_value' => ((theme_get_setting('header_side_align') !== NULL)) ? theme_get_setting('header_side_align') : 'left',
    '#options' => [
      'left' => t('Left'),
      'center' => t('Center'),
      'right' => t('Right'),
    ],
    '#ai_description' => 'Horizontal alignment of the mobile menu panel. left=slides in from left (most common). center=drops down centered. right=slides in from right (matches right-aligned hamburger icon).',
  ];

  $form['dxpr_theme_settings']['header']['menu'] = [
    '#title' => t('Main Menu Links'),
    '#type' => 'details',
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  ];

  // Deprecated: This setting is no longer used. Menu items with children are
  // always marked with visual indicators (carets) for accessibility.
  $form['dxpr_theme_settings']['header']['menu']['dropdown_width_auto'] = [
    '#type' => 'radios',
    '#title' => t('Dropdown Width'),
    '#default_value' => ((theme_get_setting('dropdown_width_auto') !== NULL)) ? theme_get_setting('dropdown_width_auto') : '1',
    '#options' => [
      '1' => t('Automatic (fits content)'),
      '0' => t('Fixed width'),
    ],
    '#ai_description' => '1=dropdown menus auto-size to fit their content (clean, adapts to link length). 0=all dropdowns use a fixed width (dropdown_width) for uniform appearance. Auto is usually better unless you need strict visual alignment.',
  ];

  $form['dxpr_theme_settings']['header']['menu']['dropdown_width'] = [
    '#type' => 'range',
    '#title' => t('Fixed Dropdown Width'),
    '#title_display' => 'invisible',
    '#ai_description' => 'Fixed pixel width for dropdown menus when dropdown_width_auto=0. 200px=compact. 250-300px=standard. 400+px=wide mega-menu style. Only applies when dropdown_width_auto=0.',
    '#default_value' => ((theme_get_setting('dropdown_width') !== NULL)) ? theme_get_setting('dropdown_width') : '200',
    '#min' => 100,
    '#max' => 500,
    '#step' => 5,
    '#attributes' => [
      'class' => ['dxb-slider', 'dropdown-width-range'],
      'data-dxb-slider' => TRUE,
    ],
    '#states' => [
      'visible' => [
        ':input[name="dropdown_width_auto"]' => ['value' => '0'],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['header']['menu']['menu_type'] = [
    '#type' => 'radios',
    '#title' => t('Font Style'),
    '#default_value' => ((theme_get_setting('menu_type') !== NULL)) ? theme_get_setting('menu_type') : '',
    '#options' => [
      '' => t('Normal'),
      'uppercase' => t('Uppercase'),
      'bold' => t('Bold'),
      'lead' => t('Lead text'),
    ],
    '#ai_description' => 'Font treatment for main menu links. (empty)=normal text. uppercase=ALL CAPS (strong, authoritative, suits corporate/tech). bold=heavier weight (prominent nav). lead=larger text (statement navigation). Uppercase + border hover creates a sophisticated nav pattern.',
  ];

  $form['dxpr_theme_settings']['header']['menu']['menu_link_spacing'] = [
    '#type' => 'range',
    '#title' => t('Link Spacing'),
    '#description' => t('Horizontal padding between menu links (in pixels).'),
    '#ai_description' => 'Horizontal padding between menu items. 5-10px=compact/dense navigation (many items). 15-20px=balanced spacing. 25-40px=airy spacing (few menu items, luxury feel). 50px=very spread out.',
    '#default_value' => ((theme_get_setting('menu_link_spacing') !== NULL)) ? theme_get_setting('menu_link_spacing') : '10',
    '#min' => 0,
    '#max' => 50,
    '#step' => 1,
    '#attributes' => [
      'class' => ['dxb-slider', 'menu-link-spacing-range'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['header']['menu']['menu_hover'] = [
    '#type' => 'radios',
    '#title' => t('Hover Style'),
    '#default_value' => ((theme_get_setting('menu_hover') !== NULL)) ? theme_get_setting('menu_hover') : 'opacity',
    '#options' => [
      'opacity' => t('Opacity'),
      'background' => t('Colored Background'),
      'text' => t('Colored text'),
      'border' => t('Border'),
    ],
    '#ai_description' => 'Visual feedback style when hovering over menu items. opacity=subtle fade (minimal, modern). background=colored fill behind item (corporate, clear). text=only text color changes (subtle). border=underline/overline effect (modern, editorial). Border hover is most popular in contemporary web design; configure with menu_border_* settings.',
  ];

  $form['dxpr_theme_settings']['header']['menu']['menu_border'] = [
    '#title' => t('Customize Menu Border'),
    '#type' => 'details',
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
    '#states' => [
      'visible' => [
        ':input[name="menu_hover"]' => ['value' => 'border'],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['header']['menu']['menu_border']['menu_border_position'] = [
    '#type' => 'radios',
    '#title' => t('Hover Style'),
    '#default_value' => ((theme_get_setting('menu_border_position') !== NULL)) ? theme_get_setting('menu_border_position') : 'bottom',
    '#options' => [
      'top' => t('Top'),
      'bottom' => t('Bottom'),
    ],
    '#ai_description' => 'Position of the hover border line. bottom=underline (most common, modern). top=overline (distinctive, less common). Only applies when menu_hover=border.',
  ];

  $form['dxpr_theme_settings']['header']['menu']['menu_border']['menu_border_animate'] = [
    '#type' => 'radios',
    '#title' => t('Animation'),
    '#default_value' => ((theme_get_setting('menu_border_animate') !== NULL)) ? theme_get_setting('menu_border_animate') : 0,
    '#options' => [
      '' => t('No Animation'),
      'ltr' => t('Left to Right'),
      'rtl' => t('Right to Left'),
      'middle' => t('Middle Out'),
      'drop' => t('Fade in from Top'),
    ],
    '#ai_description' => 'Animation for the hover border appearance. (empty)=instant appear. ltr=slides in from left. rtl=slides in from right. middle=expands from center outward (most popular). drop=fades down from top. The middle animation is the most refined and widely used.',
  ];

  $form['dxpr_theme_settings']['header']['menu']['menu_border']['menu_border_position_offset'] = [
    '#type' => 'range',
    '#title' => t('Position Offset'),
    '#ai_description' => 'Distance in px between the border and the menu item edge. 0=border touches the item. 5-15px=slight gap for floating effect. Adjust to align with header design.',
    '#default_value' => ((theme_get_setting('menu_border_position_offset') !== NULL)) ? theme_get_setting('menu_border_position_offset') : '0',
    '#min' => 0,
    '#max' => 100,
    '#step' => 1,
    '#attributes' => [
      'class' => ['dxb-slider', 'menu-border-position-offset-range'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['header']['menu']['menu_border']['menu_border_position_offset_sticky'] = [
    '#type' => 'range',
    '#title' => t('Position Offset for Sticky Header'),
    '#ai_description' => 'Border offset specifically for sticky header state. Often different from normal offset because sticky header has different height. Only visible when header_top_fixed and header_top_sticky are enabled.',
    '#default_value' => ((theme_get_setting('menu_border_position_offset_sticky') !== NULL)) ? theme_get_setting('menu_border_position_offset_sticky') : '0',
    '#min' => 0,
    '#max' => 100,
    '#step' => 1,
    '#states' => [
      'visible' => [
        ':input[name="header_top_fixed"]' => ['checked' => TRUE],
        ':input[name="header_top_sticky"]' => ['checked' => TRUE],
      ],
    ],
    '#attributes' => [
      'class' => ['dxb-slider', 'menu-border-position-offset-sticky-range'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['header']['menu']['menu_border']['menu_border_size'] = [
    '#type' => 'range',
    '#title' => t('Border Thickness'),
    '#ai_description' => 'Thickness of the hover border in pixels. 1-2px=subtle hairline (elegant). 3-4px=visible accent line (balanced). 5+px=bold statement border. 2-3px is most common.',
    '#default_value' => ((theme_get_setting('menu_border_size') !== NULL)) ? theme_get_setting('menu_border_size') : 2,
    '#min' => 1,
    '#max' => 20,
    '#step' => 1,
    '#attributes' => [
      'class' => ['dxb-slider', 'menu-border-size-range'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['header']['menu']['menu_border']['menu_border_color'] = [
    '#type' => 'select',
    '#title' => t('Border Color'),
    '#ai_description' => 'Color of the menu hover border. Usually matches the primary/accent color from the color palette. Use a theme palette color name or custom with menu_border_color_custom.',
    '#default_value' => theme_get_setting('menu_border_color'),
    '#options' => _dxpr_theme_color_options($theme),
  ];

  $form['dxpr_theme_settings']['header']['menu']['menu_border']['menu_border_color_custom'] = [
    '#type' => 'textfield',
    '#title' => t('Custom Value'),
    '#ai_description' => 'Custom hex for menu border color. Only used when menu_border_color=custom.',
    '#default_value' => ((theme_get_setting('menu_border_color_custom') !== NULL)) ? theme_get_setting('menu_border_color_custom') : theme_get_setting('menu_border_color_custom'),
    '#states' => [
      'visible' => [
        'select[name="menu_border_color"]' => ['value' => 'custom'],
      ],
    ],
  ];

  // Header in mobile mode.
  $form['dxpr_theme_settings']['header']['header_mobile'] = [
    '#title' => t('Mobile Header'),
    '#type' => 'details',
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  ];

  $form['dxpr_theme_settings']['header']['header_mobile']['header_mobile_breakpoint'] = [
    '#type' => 'range',
    '#title' => t('Mobile Breakpoint'),
    '#default_value' => ((theme_get_setting('header_mobile_breakpoint') !== NULL)) ? theme_get_setting('header_mobile_breakpoint') : 1200,
    '#min' => 480,
    '#max' => 4100,
    '#step' => 10,
    '#description' => t('Viewport width below which mobile header is used. Set to maximum (4100) to always use mobile style.'),
    '#ai_description' => 'Viewport width (px) at which desktop header switches to mobile hamburger menu. 992px=tablet breakpoint (shows mobile menu on tablets). 1200px=standard (default, desktop-first). 768px=only phones get mobile menu. Set based on how many menu items fit comfortably.',
    '#attributes' => [
      'class' => ['dxb-slider', 'header-mobile-breakpoint-range'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['header']['header_mobile']['header_mobile_height'] = [
    '#type' => 'range',
    '#title' => t('Height'),
    '#default_value' => ((theme_get_setting('header_mobile_height') !== NULL)) ? theme_get_setting('header_mobile_height') : 60,
    '#min' => 10,
    '#max' => 200,
    '#step' => 1,
    '#description' => t('Height of header in mobile view.'),
    '#ai_description' => 'Height of the header on mobile devices. 50-60px=compact (maximizes content space). 70-80px=comfortable with adequate tap targets. Keep smaller than desktop header_top_height.',
    '#attributes' => [
      'class' => ['dxb-slider', 'header-mobile-height-range'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['header']['header_mobile']['header_mobile_fixed'] = [
    '#type' => 'checkbox',
    '#title' => t('Fixed Position'),
    '#default_value' => ((theme_get_setting('header_mobile_fixed') !== NULL)) ? theme_get_setting('header_mobile_fixed') : FALSE,
    '#description' => t('Header stays visible at the top when scrolling.'),
    '#ai_description' => 'Fix mobile header to top of screen while scrolling. Enable for important navigation on mobile. Disable for content-reading experiences where screen real estate matters.',
  ];
}
