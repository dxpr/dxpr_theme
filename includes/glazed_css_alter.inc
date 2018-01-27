<?php

/**
 * Implements hook_css_alter().
 */
function glazed_css_alter(&$css) {
  // kill bootstrap overrides.min.css
  foreach($css as $key => $value){
    if(strpos($key, 'overrides.min.css')){
      unset($css[$key]);
    }
  }
}