<?php

function glazed_form_system_theme_settings_alter(&$form, &$form_state) {
  /**
   * @ code
   * a bug in D7 and D8 causes the theme to load twice, if this file is loaded a
   * second time we return to prevent errors for redeclaring functions etc.
   */
  global $glazed_altered, $base_path, $theme_chain;
  if ($glazed_altered) return;
  $glazed_altered = TRUE;

  $build_info = $form_state->getBuildInfo();
  $subject_theme = $build_info['args'][0];
  $glazed_theme_path = drupal_get_path('theme', 'glazed') . '/';
  $theme_path = drupal_get_path('theme', $subject_theme) . '/';
  $themes = \Drupal::service('theme_handler')->listInfo();
  $theme_chain = array($subject_theme);
  foreach ($themes[$subject_theme]->base_themes as $base_theme => $base_theme_name) {
    $theme_chain[] = $base_theme;
  }

  $img = '<img style="width:35px;margin-right:5px;" src="' . $base_path . $glazed_theme_path . 'logo-white.png" />';
  $form['glazed_settings'] = array(
    // '#type' => 'vertical_tabs',
    '#weight' => -20,
    '#prefix' => '<h2><small>' . $img . ' ' . ucfirst($subject_theme) . ' ' . $themes[$subject_theme]->info['version'] . ' <span class="lead">(Bootstrap ' . $themes['bootstrap']->info['version'] . ')</span>' . '</small></h2>',
  );


  foreach (file_scan_directory(drupal_get_path('theme', 'glazed') . '/features', '/settings.inc/i') as $file) {
    $theme = 'glazed';
    include($file->uri);
  }

}



/**
 * Retrieves the Color module information for a particular theme.
 */
function _glazed_get_color_names($theme = NULL) {
  return FALSE;
  // static $theme_info = array();
  // if (!isset($theme)) {
  //   $theme = \Drupal::config('system.theme'); ;
  // }

  // if (isset($theme_info[$theme])) {
  //   return $theme_info[$theme];
  // }

  // $path = drupal_get_path('theme', $theme);
  // $file = DRUPAL_ROOT . '/' . $path . '/color/color.inc';
  // if ($path && file_exists($file)) {
  //   include $file;
  //   $theme_info[$theme] = $info['fields'];
  //   return $info['fields'];
  // } else {
  //   return array();
  // }
}

/**
 * Color options for theme settings
 */
function _glazed_color_options($theme) {
  $colors = array(
    '' => t('None (Theme Default)'),
    'white' => t('White'),
    'custom' => t('Custom Color'),
  );
  // $colors = array_merge($colors, array(t('Glazed Colors') => _glazed_get_color_names()));
  return $colors;
}

function _glazed_is_demo_content ($feature) {
  return ((strpos($feature->name, '_content') OR (strpos($feature->name, '_theme_settings')))
    && isset($feature->info['features']['uuid_node']));
}

function _glazed_is_demo_content_exclude_subtheme ($feature) {
  return (strpos($feature->name, '_content')
    && isset($feature->info['features']['uuid_node']));
}

function _glazed_is_subtheme ($feature) {
  return (strpos($feature->name, '_theme_settings')
    && isset($feature->info['features']['uuid_node']));
}

function _glazed_node_types_options() {
  $types = array();
  // foreach (node_type_get_types() as $key => $value) {
  //   $types[$key] = $value->name;
  // }
  return $types;
}

function _glazed_type_preview() {
  $output = <<<EOT
<div class="type-preview">
  <div class="type-container type-title-container">
    <h1>Beautiful Typography</h1>
  </div>

  <div class="type-container">
    <h2>Typewriter delectus cred. Thundercats, sed scenester before they sold out et aesthetic</h2>
    <hr>
    <p class="lead">Lead Text Direct trade gluten-free blog, fanny pack cray labore skateboard before they sold out adipisicing non magna id Helvetica freegan. Disrupt aliqua Brooklyn church-key lo-fi dreamcatcher.</p>


    <h3>Truffaut disrupt sartorial deserunt</h3>

    <p>Cosby sweater plaid shabby chic kitsch pour-over ex. Try-hard fanny pack mumblecore cornhole cray scenester. Assumenda narwhal occupy, Blue Bottle nihil culpa fingerstache. Meggings kogi vinyl meh, food truck banh mi Etsy magna 90's duis typewriter banjo organic leggings Vice.</p>

    <ul>
      <li>Roof party put a bird on it incididunt sed umami craft beer cred.</li>
      <li>Carles literally normcore, Williamsburg Echo Park fingerstache photo booth twee keffiyeh chambray whatever.</li>
      <li>Scenester High Life Banksy, proident master cleanse tousled squid sriracha ad chillwave post-ironic retro.</li>
    </ul>

    <h4>Fingerstache nesciunt lomo nostrud hoodie</h4>

    <blockquote>
      <p>Cosby sweater plaid shabby chic kitsch pour-over ex. Try-hard fanny pack mumblecore cornhole cray scenester. Assumenda narwhal occupy, Blue Bottle nihil culpa fingerstache. Meggings kogi vinyl meh, food truck banh mi Etsy magna 90's duis typewriter banjo organic leggings Vice.</p>
      <footer>Someone famous in <cite title="Source Title">Source Title</cite></footer>
    </blockquote>
  </div>
</div>
EOT;
  return $output;
}