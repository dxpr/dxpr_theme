<?php

$weights = array(
  '' => t('Theme defaults'),
  '100' => t('Thin') . ' ' . t('100'),
  '200' => t('UltraLight') . ' ' . t('200'),
  '300' => t('Light') . ' ' . t('300'),
  '400' => t('Normal') . ' ' . t('400'),
  '500' => t('Medium') . ' ' . t('500'),
  '600' => t('SemiBold') . ' ' . t('600'),
  '700' => t('Bold') . ' ' . t('700'),
  '800' => t('ExtraBold') . ' ' . t('800'),
  '900' => t('Black') . ' ' . t('900'),
  '950' => t('ExtraBlack') . ' ' . t('950'),
);

$font_list = glazed_font_list();
$font_count = count($font_list, COUNT_RECURSIVE);

$form['glazed_settings']['fonts'] = array(
  '#title' => t('Fonts'),
  '#type' => 'details',
  '#collapsible' => TRUE,
  '#collapsed' => TRUE,
   '#weight' => 4,
  '#weight' => 20,
);

// Regular Fonts Settings
$form['glazed_settings']['fonts']['body_font_face'] = array(
  '#type' => 'select',
  '#title' => t('Base font'),
  '#default_value' =>  theme_get_setting('body_font_face'),
  '#options' => $font_list,
  '#prefix'        => '<p>' . t('You can select web fonts, local fonts or google fonts. All fonts are functional in all commonly used browsers. Local fonts are included in the theme and loaded with @font-face CSS. Google fonts are hosted and delivered by Google using @font-face CSS via google\'s cdn.') . '</p>',
);

$form['glazed_settings']['fonts']['body_font_face_selector'] = array(
  '#type' => 'textfield',
  '#title' => t('CSS Selector'),
  '#default_value' => ((theme_get_setting('body_font_face_selector') !== null)) ? theme_get_setting('body_font_face_selector') : 'body',
);

$form['glazed_settings']['fonts']['headings_font_face'] = array(
  '#type' => 'select',
  '#title' => t('Headings'),
  '#default_value' =>  theme_get_setting('headings_font_face'),
  '#options' => $font_list,
);

$form['glazed_settings']['fonts']['headings_font_face_selector'] = array(
  '#type' => 'textfield',
  '#title' => '&nbsp;',
  '#default_value' => ((theme_get_setting('headings_font_face_selector') !== null)) ? theme_get_setting('headings_font_face_selector') : 'h1,h2,h3,h4,h5,h6,label,.field-label,.page-title, .html .tp-caption',
);

$form['glazed_settings']['fonts']['nav_font_face'] = array(
  '#type' => 'select',
  '#title' => t('Navigation'),
  '#default_value' =>  theme_get_setting('nav_font_face'),
  '#options' => $font_list,
);

$form['glazed_settings']['fonts']['nav_font_face_selector'] = array(
  '#type' => 'textfield',
  '#title' => '&nbsp;',
  '#default_value' => ((theme_get_setting('nav_font_face_selector') !== null)) ? theme_get_setting('nav_font_face_selector') : 'nav,nav ul li,nav a',
);

$form['glazed_settings']['fonts']['sitename_font_face'] = array(
  '#type' => 'select',
  '#title' => t('Site name'),
  '#default_value' =>  theme_get_setting('sitename_font_face'),
  '#options' => $font_list,
);

$form['glazed_settings']['fonts']['sitename_font_face_selector'] = array(
  '#type' => 'textfield',
  '#title' => '&nbsp;',
  '#default_value' => ((theme_get_setting('sitename_font_face_selector') !== null)) ? theme_get_setting('sitename_font_face_selector') : 'nav,nav ul li,nav a',
);

$form['glazed_settings']['fonts']['blockquote_font_face'] = array(
  '#type' => 'select',
  '#title' => t('Blockquote'),
  '#default_value' =>  theme_get_setting('blockquote_font_face'),
  '#options' => $font_list,
);

$form['glazed_settings']['fonts']['blockquote_font_face_selector'] = array(
  '#type' => 'textfield',
  '#title' => '&nbsp;',
  '#default_value' => ((theme_get_setting('blockquote_font_face_selector') !== null)) ? theme_get_setting('blockquote_font_face_selector') : 'blockquote, blockquote p',
);

$form['glazed_settings']['fonts']['font_preview'] = array(
  '#title' => t('Browse & View Fonts'),
  '#type' => 'details',
  '#collapsible' => TRUE,
  '#collapsed' => TRUE,
  '#prefix' => '<br style="clear: both;"><br style="clear: both;">',
  '#suffix' => _glazed_type_preview(),
);

$form['glazed_settings']['fonts']['font_preview']['preview'] = array(
 '#type' => 'markup',
 '#markup' => _glazed_font_previews(),
);


