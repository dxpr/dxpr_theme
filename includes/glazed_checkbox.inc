<?php

/**
 * Overrides theme_checkbox().
 */

function glazed_checkbox($variables) {
  $element = $variables['element'];
  $element['#attributes']['type'] = 'checkbox';
  element_set_attributes($element, array(
    'id',
    'name',
    '#return_value' => 'value',
  ));

  // Unchecked checkbox has #value of integer 0.
  if (!empty($element['#checked'])) {
    $element['#attributes']['checked'] = 'checked';
  }
  _form_set_class($element, array(
    'form-checkbox',
  ));
  if (arg(0) == 'admin' && arg(1) == 'appearance' && arg(2) == 'settings' && arg(3)) {
    return '<input' . drupal_attributes($element['#attributes']) . ' /><span class="switcher"></span>';
  }
  else {
	return '<input' . drupal_attributes($element['#attributes']) . ' />';
  }
}