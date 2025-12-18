<?php

/**
 * @file
 * Theme page title settings.
 */

/**
 * Add page title options to the theme settings form.
 *
 * @param array $form
 *   Form array.
 * @param string $theme
 *   Theme machine name.
 */
function page_title_theme_settings(array &$form, $theme) {
  $form['dxpr_theme_settings']['page_title'] = [
    '#title' => t('Page Title'),
    '#type' => 'details',
    '#group' => 'dxpr_theme_settings',
    '#weight' => 10,
  ];

  $form['dxpr_theme_settings']['page_title']['page_title_breadcrumbs'] = [
    '#type' => 'checkbox',
    '#title' => t('Show Breadcrumbs'),
    '#default_value' => ((theme_get_setting('page_title_breadcrumbs') !== NULL)) ? theme_get_setting('page_title_breadcrumbs') : 1,
  ];

  $form['dxpr_theme_settings']['page_title']['page_title_breadcrumbs_align'] = [
    '#type' => 'radios',
    '#title' => t('Align Breadcrumbs'),
    '#default_value' => ((theme_get_setting('page_title_breadcrumbs_align') !== NULL)) ? theme_get_setting('page_title_breadcrumbs_align') : 'right',
    '#options' => [
      'left' => t('Left'),
      'center' => t('Center'),
      'right' => t('Right'),
    ],
    '#states' => [
      'visible' => [
        ':input[name="page_title_breadcrumbs"]' => ['checked' => TRUE],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['page_title']['page_title_breadcrumbs_separator'] = [
    '#type' => 'textfield',
    '#title' => t('Breadcrumbs Separator'),
    '#default_value' => (theme_get_setting('page_title_breadcrumbs_separator')) ? theme_get_setting('page_title_breadcrumbs_separator') : '/',
    '#states' => [
      'visible' => [
        ':input[name="page_title_breadcrumbs"]' => ['checked' => TRUE],
      ],
    ],
  ];

  $form['dxpr_theme_settings']['page_title']['page_title_home_hide'] = [
    '#type' => 'checkbox',
    '#title' => t('Hide on Homepage'),
    '#default_value' => ((theme_get_setting('page_title_home_hide') !== NULL)) ? theme_get_setting('page_title_home_hide') : 1,
  ];

  $form['dxpr_theme_settings']['page_title']['page_title_align'] = [
    '#type' => 'radios',
    '#title' => t('Align Title'),
    '#default_value' => ((theme_get_setting('page_title_align') !== NULL)) ? theme_get_setting('page_title_align') : 'left',
    '#options' => [
      'left' => t('Left'),
      'center' => t('Center'),
      'right' => t('Right'),
    ],
  ];

  $form['dxpr_theme_settings']['page_title']['title_type'] = [
    '#type' => 'checkboxes',
    '#title' => t('Font Style'),
    '#default_value' => ((theme_get_setting('title_type') !== NULL)) ? theme_get_setting('title_type') : [],
    '#options' => [
      'uppercase' => t('Uppercase'),
      'bold' => t('Bold'),
      'italic' => t('Italic'),
    ],
  ];

  $form['dxpr_theme_settings']['page_title']['page_title_height'] = [
    '#type' => 'range',
    '#title' => t('Height'),
    '#default_value' => ((theme_get_setting('page_title_height') !== NULL)) ? theme_get_setting('page_title_height') : '120',
    '#min' => 50,
    '#max' => 500,
    '#step' => 5,
    '#description' => t('Height of the page title area.'),
    '#attributes' => [
      'class' => ['dxb-slider', 'page-title-height-range'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['page_title']['page_title_animate'] = [
    '#type' => 'radios',
    '#title' => t('Animation'),
    '#default_value' => ((theme_get_setting('page_title_animate') !== NULL)) ? theme_get_setting('page_title_animate') : '0',
    '#options' => [
      '0' => t('No Animation'),
      'bounce-dxpr' => t('Bounce'),
      'flash-dxpr' => t('Flash'),
      'pulse-dxpr' => t('Pulse'),
      'fade-in-dxpr' => t('Fade in'),
      'bounce-in-down-dxpr' => t('Bounce in down'),
      'bounce-in-up-dxpr' => t('Bounce in up'),
      'fade-in-down-dxpr' => t('Fade in down'),
      'fade-in-up-dxpr' => t('Fade in up'),
    ],
    '#prefix' => '<br class="clear-both"><br class="clear-both">',
  ];

  $form['dxpr_theme_settings']['page_title']['background'] = [
    '#title' => t('Background Image'),
    '#type' => 'details',
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
  ];

  // @see dxpr_theme_helper.module dxpr_theme_helper_settings_form_submit()
  $form['dxpr_theme_settings']['page_title']['background']['page_title_image_path'] = [
    '#type' => 'textfield',
    '#title' => t('Background Image Path'),
    '#default_value' => theme_get_setting('page_title_image_path'),
    '#description' => t('Automatically populated when you upload an image below.'),
  ];
  $form['dxpr_theme_settings']['page_title']['background']['page_title_image'] = [
    '#type' => 'media_library',
    '#allowed_bundles' => ['image'],
    '#title' => t('Upload Background Image'),
    '#default_value' => theme_get_setting('page_title_image'),
    '#description' => t('Override per node using the Header Image field.'),
  ];

  $form['dxpr_theme_settings']['page_title']['background']['page_title_image_opacity'] = [
    '#type' => 'range',
    '#title' => t('Background Image Opacity'),
    '#default_value' => ((theme_get_setting('page_title_image_opacity') !== NULL)) ? theme_get_setting('page_title_image_opacity') : 1,
    '#min' => 0,
    '#max' => 1,
    '#step' => 0.01,
    '#description' => t('Blend the background image with the background color. 0 = transparent, 1 = opaque.'),
    '#attributes' => [
      'class' => ['dxb-slider', 'page-title-image-opacity-range'],
      'data-dxb-slider' => TRUE,
    ],
  ];

  $form['dxpr_theme_settings']['page_title']['background']['page_title_image_style'] = [
    '#type' => 'radios',
    '#title' => t('Background Size'),
    '#default_value' => ((theme_get_setting('page_title_image_style') !== NULL)) ? theme_get_setting('page_title_image_style') : 'cover',
    '#options' => [
      'cover' => t('Cover (fill area)'),
      'contain' => t('Contain (fit inside)'),
      'no_repeat' => t('Actual size'),
      'repeat' => t('Tile'),
    ],
  ];

  $form['dxpr_theme_settings']['page_title']['background']['page_title_image_mode'] = [
    '#type' => 'radios',
    '#title' => t('Background Scroll Behavior'),
    '#default_value' => ((theme_get_setting('page_title_image_mode') !== NULL)) ? theme_get_setting('page_title_image_mode') : 'normal',
    '#options' => [
      'normal' => t('Scroll with page'),
      'fixed' => t('Fixed (parallax effect)'),
    ],
  ];

  $form['dxpr_theme_settings']['page_title']['background']['page_title_image_position'] = [
    '#type' => 'radios',
    '#title' => t('Background Position'),
    '#default_value' => ((theme_get_setting('page_title_image_position') !== NULL)) ? theme_get_setting('page_title_image_position') : 'center_center',
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
}
