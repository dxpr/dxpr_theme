<?php

/**
 * @file
 */

$page_title_animate = theme_get_setting('page_title_animate');

if ($page_title_animate) {
  $path_to_css = drupal_get_path('theme', 'glazed') . '/vendor/animate.css/animate.min.css';
  drupal_add_css($path_to_css, array('group' => CSS_DEFAULT, 'every_page' => TRUE));
}
