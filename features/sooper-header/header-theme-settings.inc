<?php


$form['glazed_settings']['header'] = array(
  '#title' => t('Header & Main Menu'),
  '#type' => 'fieldset',
  '#weight' => 10,
);


$form['glazed_settings']['header']['header_position'] = array(
  '#type' => 'checkbox',
  '#title' => t('Side-Header'),
  '#default_value' => ((theme_get_setting('header_position') !== null)) ? theme_get_setting('header_position') : 0,
);

$form['glazed_settings']['header']['header_top'] = array(
  '#title' => t('Top Header Options'),
  '#type' => 'fieldset',
  '#collapsible' => TRUE,
  '#collapsed' => TRUE,
  '#states' => array(
    'visible' => array(
      ':input[name="header_position"]' => array('checked' => FALSE),
    ),
  ),
);

$form['glazed_settings']['header']['header_top']['header_top_layout'] = array(
    '#type' => 'radios',
    '#title' => t('Layout'),
    '#description' => t('Different header layouts give a different view at your menu and logo.'),
    '#default_value' => ((theme_get_setting('header_top_layout') !== null)) ? theme_get_setting('header_top_layout') : '0',
    '#options' => array(
      '0' => t('Normal (Logo left, Menu Right)'),
      'centered' => t('Centered (stacked)'),
      'centered_inline' => t('Centered (inline)'),
      'logo_left_menu_left' => t('Logo Left, Menu Left'),
      'logo_center_menu_left' => t('Logo Center, Menu Left'),
      'logo_center_menu_right' => t('Logo Center, Menu Right'),
      'logo_right_menu_left' => t('Logo Right, Menu Left'),
    ),
);

$form['glazed_settings']['header']['header_top']['header_style'] = array(
    '#type' => 'radios',
    '#title' => t('Header Style'),
    '#description' => t('Create transparent headers and free floating navbars. Overlays the header over the page title and content.'),
    '#default_value' => ((theme_get_setting('header_style') !== null)) ? theme_get_setting('header_style') : 'normal',
    '#options' => array(
      'normal' => t('Normal'),
      'overlay' => t('Overlay'),
      'navbar_pull_down' => t('Pull-down Navbar'),
    ),
);

$form['glazed_settings']['header']['header_top']['header_top_bg_opacity'] = array(
  '#type' => 'textfield',
  '#title' => t('Header Opacity'),
  '#default_value' => ((theme_get_setting('header_top_bg_opacity') !== null)) ? theme_get_setting('header_top_bg_opacity') : 1,
  '#size' => 9,
  '#maxlength' => 9,
  '#description' => t('Creates RGBa translucent background color. 0 is fully transparent and 1 is fully opaque.'),
  '#states' => array(
    'visible' => array(
      ':input[name="header_style"]' => array('value' => 'overlay'),
    ),
  ),
);

$form['glazed_settings']['header']['header_top']['header_top_height'] = array(
  '#type' => 'textfield',
  '#title' => t('Height'),
  '#default_value' => ((theme_get_setting('header_top_height') !== null)) ? theme_get_setting('header_top_height') : '100',
  '#size' => 9,
  '#maxlength' => 9,
  '#description' => t('Initial height of the header. 10px - 200px. Default is 100.'),
);

$form['glazed_settings']['header']['header_top']['header_top_fixed'] = array(
  '#type' => 'checkbox',
  '#title' => t('Fixed Position'),
  '#default_value' => ((theme_get_setting('header_top_fixed') !== null)) ? theme_get_setting('header_top_fixed') : FALSE,
  '#description' => t('A Fixed header stays in the top of the browser when a user scrolls.'),
);

$form['glazed_settings']['header']['header_top']['header_top_sticky'] = array(
  '#type' => 'checkbox',
  '#title' => t('Sticky Header'),
  '#default_value' => ((theme_get_setting('header_top_sticky') !== null)) ? theme_get_setting('header_top_sticky') : FALSE,
  '#description' => t('A sticky can first be positioned at a distance from the top edge of the window and when the user scrolls past a certain point it will stick to the top of the window.'),
  '#states' => array(
    'visible' => array(
      ':input[name="header_top_fixed"]' => array('checked' => TRUE),
    ),
  ),
);

$form['glazed_settings']['header']['header_top']['sticky'] = array(
  '#title' => t('Sticky Header Options'),
  '#type' => 'fieldset',
  '#collapsible' => TRUE,
  '#collapsed' => TRUE,
  '#states' => array(
    'visible' => array(
      ':input[name="header_top_fixed"]' => array('checked' => TRUE),
      ':input[name="header_top_sticky"]' => array('checked' => TRUE),
    ),
  ),
);

$form['glazed_settings']['header']['header_top']['sticky']['header_top_sticky_show'] = array(
  '#type' => 'radios',
  '#title' => t('Hide before Scrolling'),
  '#default_value' => ((theme_get_setting('header_top_sticky_show') !== null)) ? theme_get_setting('header_top_sticky_show') : 'always',
  '#options' => array(
    'always' => t('Always Show'),
    'after_scroll' => t('Hide initially. Show after scroll offset'),
  ),
  '#description' => t('Hide menu before or after scrolling. Turn on "Overlay Mode" to prevent your menu creating an empty space at the top of your layout.'),
  '#states' => array(
    'visible' => array(
      ':input[name="header_top_fixed"]' => array('checked' => TRUE),
      ':input[name="header_top_sticky"]' => array('checked' => TRUE),
    ),
  ),
  '#states' => array(
    'unchecked' => array(
      ':input[name="header_top_fixed"]' => array('checked' => FALSE),
    ),
  ),
);

$form['glazed_settings']['header']['header_top']['sticky']['header_top_height_sticky_offset'] = array(
  '#type' => 'textfield',
  '#title' => t('Scroll offset'),
  '#default_value' => ((theme_get_setting('header_top_height_sticky_offset') !== null)) ? theme_get_setting('header_top_height_sticky_offset') : '60',
  '#size' => 9,
  '#maxlength' => 9,
  '#description' => t('Scroll distance before header jumps to its fixed position at the top of page. 0 - 2096px. Default is 60.'),
  '#states' => array(
    'visible' => array(
      ':input[name="header_top_fixed"]' => array('checked' => TRUE),
      ':input[name="header_top_sticky"]' => array('checked' => TRUE),
    ),
  ),
);

$form['glazed_settings']['header']['header_top']['sticky']['header_top_height_scroll'] = array(
  '#type' => 'textfield',
  '#title' => t('Height'),
  '#default_value' => ((theme_get_setting('header_top_height_scroll') !== null)) ? theme_get_setting('header_top_height_scroll') : '50',
  '#size' => 9,
  '#maxlength' => 9,
  '#description' => t('Header height after scrolling past scroll offset. Default is 50.'),
  '#states' => array(
    'visible' => array(
      ':input[name="header_top_fixed"]' => array('checked' => TRUE),
      ':input[name="header_top_sticky"]' => array('checked' => TRUE),
    ),
  ),
);

$form['glazed_settings']['header']['header_top']['sticky']['header_top_bg_opacity_scroll'] = array(
  '#type' => 'textfield',
  '#title' => t('Background Opacity'),
  '#default_value' => ((theme_get_setting('header_top_bg_opacity_scroll') !== null)) ? theme_get_setting('header_top_bg_opacity_scroll') : 1,
  '#size' => 9,
  '#maxlength' => 9,
  '#description' => t('Creates RGBa translucent background color. 0 is fully transparent and 1 is fully opaque.'),
  '#states' => array(
    'visible' => array(
      ':input[name="header_top_fixed"]' => array('checked' => TRUE),
      ':input[name="header_top_sticky"]' => array('checked' => TRUE),
    ),
  ),
);

$form['glazed_settings']['header']['header_top']['navcolors'] = array(
  '#title' => t('Customize Navigation Colors'),
  '#type' => 'fieldset',
  '#collapsible' => TRUE,
  '#collapsed' => TRUE,
);

$form['glazed_settings']['header']['header_top']['navcolors']['navbar_background'] = array(
  '#type' => 'select',
  '#title' => t('Navbar Background'),
  '#default_value' =>  theme_get_setting('navbar_background'),
  '#options' => _glazed_color_options($theme),
);

$form['glazed_settings']['header']['header_top']['navcolors']['navbar_background_custom'] = array(
  '#type' => 'textfield',
  '#title' => t('Custom Navbar Background'),
  '#default_value' => ((theme_get_setting('navbar_background_custom') !== null)) ? theme_get_setting('navbar_background_custom') : theme_get_setting('navbar_background_custom'),
  '#states' => array(
    'visible' => array(
      ':input[name="navbar_background"]' => array('value' => 'custom'),
    ),
  ),
);

$form['glazed_settings']['header']['header_top']['navcolors']['header_block_background'] = array(
  '#type' => 'select',
  '#title' => t('Block Background'),
  '#default_value' =>  theme_get_setting('header_block_background'),
  '#options' => _glazed_color_options($theme),
);

$form['glazed_settings']['header']['header_top']['navcolors']['header_block_background_custom'] = array(
  '#type' => 'textfield',
  '#title' => t('Custom Block Background'),
  '#default_value' => ((theme_get_setting('header_block_background_custom') !== null)) ? theme_get_setting('header_block_background_custom') : theme_get_setting('header_block_background_custom'),
  '#states' => array(
    'visible' => array(
      ':input[name="header_block_background"]' => array('value' => 'custom'),
    ),
  ),
);

$form['glazed_settings']['header']['header_top']['navcolors']['header_block_text_color'] = array(
  '#type' => 'select',
  '#title' => t('Block Text'),
  '#default_value' =>  theme_get_setting('header_block_text_color'),
  '#options' => _glazed_color_options($theme),
);

$form['glazed_settings']['header']['header_top']['navcolors']['header_block_text_color_custom'] = array(
  '#type' => 'textfield',
  '#title' => t('Custom Block Text Color'),
  '#default_value' => ((theme_get_setting('header_block_text_color_custom') !== null)) ? theme_get_setting('header_block_text_color_custom') : theme_get_setting('header_block_text_color_custom'),
  '#states' => array(
    'visible' => array(
      ':input[name="header_block_text_color"]' => array('value' => 'custom'),
    ),
  ),
);

$form['glazed_settings']['header']['header_top']['navcolors']['menu_background'] = array(
  '#type' => 'select',
  '#title' => t('Menu Background'),
  '#default_value' =>  theme_get_setting('menu_background'),
  '#options' => _glazed_color_options($theme),
);

$form['glazed_settings']['header']['header_top']['navcolors']['menu_background_custom'] = array(
  '#type' => 'textfield',
  '#title' => t('Custom Menu Background'),
  '#default_value' => ((theme_get_setting('menu_background_custom') !== null)) ? theme_get_setting('menu_background_custom') : theme_get_setting('menu_background_custom'),
  '#states' => array(
    'visible' => array(
      ':input[name="menu_background"]' => array('value' => 'custom'),
    ),
  ),
);

$form['glazed_settings']['header']['header_top']['navcolors']['menu_text_color'] = array(
  '#type' => 'select',
  '#title' => t('Menu Text'),
  '#default_value' =>  theme_get_setting('menu_text_color'),
  '#options' => _glazed_color_options($theme),
);

$form['glazed_settings']['header']['header_top']['navcolors']['menu_text_color_custom'] = array(
  '#type' => 'textfield',
  '#title' => t('Custom Menu Text Color'),
  '#default_value' => ((theme_get_setting('menu_text_color_custom') !== null)) ? theme_get_setting('menu_text_color_custom') : theme_get_setting('menu_text_color_custom'),
  '#states' => array(
    'visible' => array(
      ':input[name="menu_text_color"]' => array('value' => 'custom'),
    ),
  ),
);

$form['glazed_settings']['header']['header_top']['navcolors']['menu_hover_background'] = array(
  '#type' => 'select',
  '#title' => t('Menu Hover Background'),
  '#default_value' =>  theme_get_setting('menu_hover_background'),
  '#options' => _glazed_color_options($theme),
);

$form['glazed_settings']['header']['header_top']['navcolors']['menu_hover_background_custom'] = array(
  '#type' => 'textfield',
  '#title' => t('Custom Menu Hover Background'),
  '#default_value' => ((theme_get_setting('menu_hover_background_custom') !== null)) ? theme_get_setting('menu_hover_background_custom') : theme_get_setting('menu_hover_background_custom'),
  '#states' => array(
    'visible' => array(
      ':input[name="menu_hover_background"]' => array('value' => 'custom'),
    ),
  ),
);

$form['glazed_settings']['header']['header_top']['navcolors']['menu_hover_text_color'] = array(
  '#type' => 'select',
  '#title' => t('Menu Hover Text'),
  '#default_value' =>  theme_get_setting('menu_hover_text_color'),
  '#options' => _glazed_color_options($theme),
);

$form['glazed_settings']['header']['header_top']['navcolors']['menu_hover_text_color_custom'] = array(
  '#type' => 'textfield',
  '#title' => t('Custom Menu Hover Text Color'),
  '#default_value' => ((theme_get_setting('menu_hover_text_color_custom') !== null)) ? theme_get_setting('menu_hover_text_color_custom') : theme_get_setting('menu_hover_text_color_custom'),
  '#states' => array(
    'visible' => array(
      ':input[name="menu_hover_text_color"]' => array('value' => 'custom'),
    ),
  ),
);

$form['glazed_settings']['header']['header_top']['navcolors']['dropdown_background'] = array(
  '#type' => 'select',
  '#title' => t('Dropdown Background'),
  '#default_value' =>  theme_get_setting('dropdown_background'),
  '#options' => _glazed_color_options($theme),
);

$form['glazed_settings']['header']['header_top']['navcolors']['dropdown_background_custom'] = array(
  '#type' => 'textfield',
  '#title' => t('Custom Dropdown Background'),
  '#default_value' => ((theme_get_setting('dropdown_background_custom') !== null)) ? theme_get_setting('dropdown_background_custom') : theme_get_setting('dropdown_background_custom'),
  '#states' => array(
    'visible' => array(
      ':input[name="dropdown_background"]' => array('value' => 'custom'),
    ),
  ),
);

$form['glazed_settings']['header']['header_top']['navcolors']['dropdown_text_color'] = array(
  '#type' => 'select',
  '#title' => t('Dropdown Text'),
  '#default_value' =>  theme_get_setting('dropdown_text_color'),
  '#options' => _glazed_color_options($theme),
);

$form['glazed_settings']['header']['header_top']['navcolors']['dropdown_text_color_custom'] = array(
  '#type' => 'textfield',
  '#title' => t('Custom Dropdown Text Color'),
  '#default_value' => ((theme_get_setting('dropdown_text_color_custom') !== null)) ? theme_get_setting('dropdown_text_color_custom') : theme_get_setting('dropdown_text_color_custom'),
  '#states' => array(
    'visible' => array(
      ':input[name="dropdown_text_color"]' => array('value' => 'custom'),
    ),
  ),
);

$form['glazed_settings']['header']['header_top']['navcolors']['dropdown_hover_background'] = array(
  '#type' => 'select',
  '#title' => t('Dropdown Hover Background'),
  '#default_value' =>  theme_get_setting('dropdown_hover_background'),
  '#options' => _glazed_color_options($theme),
);

$form['glazed_settings']['header']['header_top']['navcolors']['dropdown_hover_background_custom'] = array(
  '#type' => 'textfield',
  '#title' => t('Custom Dropdown Hover Background'),
  '#default_value' => ((theme_get_setting('dropdown_hover_background_custom') !== null)) ? theme_get_setting('dropdown_hover_background_custom') : theme_get_setting('dropdown_hover_background_custom'),
  '#states' => array(
    'visible' => array(
      ':input[name="dropdown_hover_background"]' => array('value' => 'custom'),
    ),
  ),
);

$form['glazed_settings']['header']['header_top']['navcolors']['dropdown_hover_text_color'] = array(
  '#type' => 'select',
  '#title' => t('Dropdown Hover Text'),
  '#default_value' =>  theme_get_setting('dropdown_hover_text_color'),
  '#options' => _glazed_color_options($theme),
);

$form['glazed_settings']['header']['header_top']['navcolors']['dropdown_hover_text_color_custom'] = array(
  '#type' => 'textfield',
  '#title' => t('Custom Dropdown Hover Text Color'),
  '#default_value' => ((theme_get_setting('dropdown_hover_text_color_custom') !== null)) ? theme_get_setting('dropdown_hover_text_color_custom') : theme_get_setting('dropdown_hover_text_color_custom'),
  '#states' => array(
    'visible' => array(
      ':input[name="dropdown_hover_text_color"]' => array('value' => 'custom'),
    ),
  ),
);

$form['glazed_settings']['header']['header_side'] = array(
  '#title' => t('Side Header & Mobile Menu Options'),
  '#type' => 'fieldset',
  '#collapsible' => TRUE,
  '#collapsed' => TRUE,
);

$form['glazed_settings']['header']['header_side']['header_side_align'] = array(
  '#type' => 'radios',
  '#title' => t('Align Content'),
  '#description' => t('Different header aligns give a different view at your menu and logo.'),
  '#default_value' => ((theme_get_setting('header_side_align') !== null)) ? theme_get_setting('header_side_align') : 'left',
  '#options' => array(
    'left' => t('Left'),
    'center' => t('Center'),
    'right' => t('Right'),
  ),
);

$form['glazed_settings']['header']['header_side']['header_side_width'] = array(
  '#type' => 'textfield',
  '#title' => t('Width'),
  '#default_value' => ((theme_get_setting('header_side_width') !== null)) ? theme_get_setting('header_side_width') : '300',
  '#size' => 9,
  '#maxlength' => 9,
  '#description' => t('Width of the side-header. Default is 300.'),
);

$form['glazed_settings']['header']['header_side']['header_side_direction'] = [
  '#type' => 'radios',
  '#title' => t('Mobile menu open direction'),
  '#default_value' => ((theme_get_setting('header_side_direction') !== null)) ? theme_get_setting('header_side_direction') : 'left',
  '#description' => t('Open menu from the right'),
  '#options' => [
    'left' => t('Left to Right'),
    'right' => t('Right to Left'),
  ],
];

$form['glazed_settings']['header']['menu'] = array(
  '#title' => t('Main Menu Links'),
  '#type' => 'fieldset',
  '#collapsible' => TRUE,
  '#collapsed' => TRUE,
);

// $form['glazed_settings']['header']['menu']['menu_style'] = array(
//     '#type' => 'radios',
//     '#title' => t('Menu Style'),
//     '#default_value' => ((theme_get_setting('menu_style') !== null)) ? theme_get_setting('menu_style') : 'normal',
//     '#options' => array(
//       'normal' => t('Normal'),
//       'full_screen' => t('Full Screen'),
//       'off_canvas' => t('Off-Canvas (side fold-out)')
//     ),
//     '#description' => t('Choose your menu style. Only Normal menu style supports Mega Menu dropdowns.'),
// );

// $form['glazed_settings']['header']['menu']['menu_full_screen_opacity'] = array(
//   '#type' => 'textfield',
//   '#title' => t('Menu Background opacity'),
//   '#default_value' => ((theme_get_setting('menu_full_screen_opacity') !== null)) ? theme_get_setting('menu_full_screen_opacity') : 1,
//   '#size' => 9,
//   '#maxlength' => 9,
//   '#description' => t('0 is fully transparent and 1 is fully opaque.'),
// );

$form['glazed_settings']['header']['menu']['menu_type'] = array(
    '#type' => 'radios',
    '#title' => t('Font Style'),
    '#default_value' => ((theme_get_setting('menu_type') !== null)) ? theme_get_setting('menu_type') : '',
    '#options' => array(
      '' => t('Normal'),
      'uppercase' => t('Uppercase'),
      'bold' => t('Bold'),
      'lead' => t('Lead text')
    ),
);

$form['glazed_settings']['header']['menu']['menu_hover'] = array(
    '#type' => 'radios',
    '#title' => t('Hover Style'),
    '#default_value' => ((theme_get_setting('menu_hover') !== null)) ? theme_get_setting('menu_hover') : 'opacity',
    '#options' => array(
      'opacity' => t('Opacity'),
      'background' => t('Colored Background'),
      'text' => t('Colored text'),
      'border' => t('Border'),
    ),
);

// Would like to use FAPI states here but doesn't work: https://www.drupal.org/node/2751693
$form['glazed_settings']['header']['menu']['menu_border'] = array(
  '#title' => t('Customize Menu Border'),
  '#type' => 'fieldset',
  '#collapsible' => TRUE,
  '#collapsed' => TRUE,
);

$form['glazed_settings']['header']['menu']['menu_border']['menu_border_position'] = array(
  '#type' => 'radios',
  '#title' => t('Hover Style'),
  '#default_value' => ((theme_get_setting('menu_border_position') !== null)) ? theme_get_setting('menu_border_position') : 'bottom',
  '#options' => array(
    'top' => t('Top'),
    'bottom' => t('Bottom'),
  ),
);

$form['glazed_settings']['header']['menu']['menu_border']['menu_border_animate'] = array(
  '#type' => 'radios',
  '#title' => t('Animation'),
  '#default_value' => ((theme_get_setting('menu_border_animate') !== null)) ? theme_get_setting('menu_border_animate') : 0,
  '#options' => array(
    '' => t('No Animation'),
    'ltr' => t('Left to Right'),
    'rtl' => t('Right to Left'),
    'middle' => t('Middle Out'),
    'drop' => t('Fade in from Top'),
  ),
);

$form['glazed_settings']['header']['menu']['menu_border']['menu_border_position_offset'] = array(
  '#type' => 'textfield',
  '#title' => t('Position Offset'),
  '#default_value' => ((theme_get_setting('menu_border_position_offset') !== null)) ? theme_get_setting('menu_border_position_offset') : '0',
  '#size' => 9,
  '#maxlength' => 9,
  '#states' => array(
    'visible' => array(
      ':input[name="header_position"]' => array('checked' => FALSE),
    ),
  ),
);

$form['glazed_settings']['header']['menu']['menu_border']['menu_border_position_offset_sticky'] = array(
  '#type' => 'textfield',
  '#title' => t('Position Offset for Sticky Header'),
  '#default_value' => ((theme_get_setting('menu_border_position_offset_sticky') !== null)) ? theme_get_setting('menu_border_position_offset_sticky') : '0',
  '#size' => 9,
  '#maxlength' => 9,
  '#states' => array(
    'visible' => array(
      ':input[name="header_position"]' => array('checked' => FALSE),
      ':input[name="header_top_fixed"]' => array('checked' => TRUE),
      ':input[name="header_top_sticky"]' => array('checked' => TRUE),
    ),
  ),
);

$form['glazed_settings']['header']['menu']['menu_border']['menu_border_size'] = array(
  '#type' => 'textfield',
  '#title' => t('Border Thickness'),
  '#default_value' => ((theme_get_setting('menu_border_size') !== null)) ? theme_get_setting('menu_border_size') : '2',
  '#size' => 9,
  '#maxlength' => 9,
);

$form['glazed_settings']['header']['menu']['menu_border']['menu_border_color'] = array(
  '#type' => 'select',
  '#title' => t('Border Color'),
  '#default_value' =>  theme_get_setting('menu_border_color'),
  '#options' => _glazed_color_options($theme),
);

$form['glazed_settings']['header']['menu']['menu_border']['menu_border_color_custom'] = array(
  '#type' => 'textfield',
  '#title' => t('Custom Value'),
  '#default_value' => ((theme_get_setting('menu_border_color_custom') !== null)) ? theme_get_setting('menu_border_color_custom') : theme_get_setting('menu_border_color_custom'),
  '#states' => array(
    'visible' => array(
      'select[name="menu_border_color"]' => array('value' => 'custom'),
    ),
  ),
);


// Header in mobile mode
$form['glazed_settings']['header']['header_mobile'] = array(
  '#title' => t('Mobile Header'),
  '#type' => 'fieldset',
  '#collapsible' => TRUE,
  '#collapsed' => TRUE,
);

$form['glazed_settings']['header']['header_mobile']['header_mobile_breakpoint'] = array(
  '#type' => 'textfield',
  '#title' => t('Mobile Breakpoint'),
  '#default_value' => ((theme_get_setting('header_mobile_breakpoint') !== null)) ? theme_get_setting('header_mobile_breakpoint') : '1200',
  '#size' => 9,
  '#maxlength' => 9,
  '#description' => t('Point below where Glazed switches to mobile header and navigation. If you set this to the maximum value (4100) the desktop style will never show. Default is 1200.'),
);

$form['glazed_settings']['header']['header_mobile']['header_mobile_height'] = array(
  '#type' => 'textfield',
  '#title' => t('Height'),
  '#default_value' => ((theme_get_setting('header_mobile_height') !== null)) ? theme_get_setting('header_mobile_height') : '60',
  '#size' => 9,
  '#maxlength' => 9,
  '#description' => t('Height of header in mobile view. 10px - 200px. Default is 60.'),
);
