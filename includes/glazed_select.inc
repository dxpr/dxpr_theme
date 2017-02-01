<?php

/**
 * Overrides theme_select().
 * Adds wrapper for themed animated down arrow
 */

function glazed_select($variables) {
  $element = $variables['element'];
  element_set_attributes($element, array('id', 'name', 'size'));
  _form_set_class($element, array('form-select'));
  $output = '';
  // Glazed Themed Selectbox, only works with single select, not multi selectbox
  if (!isset($element['#attributes']['multiple'])) {
    $output .= '<div class="glazed-select">';
  }
  $output .= '<select' . drupal_attributes($element['#attributes']) . '>' . form_select_options($element) . '</select>';
  if (!isset($element['#attributes']['multiple'])) {
    $output .= '</div>';
  }
  return $output;
}
