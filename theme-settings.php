<?php

function glazed_form_system_theme_settings_alter(&$form, &$form_state, $form_id = NULL) {
  /**
   * @ code
   * a bug in D7 and D8 causes the theme to load twice. Only the second time $form
   * will contain the color module data. So we ignore the first
   * @see https://www.drupal.org/node/943212
   */
  if (!isset($form_id)) { // form_id is only present the second time around
    return;
  };

  global $base_path, $theme_chain;

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
    '#type' => 'vertical_tabs', // SETTING TYPE TO DETAILS OR VERTICAL_TABS STOPS RENDERING OF ALL ELEMENTS INSIDE
    '#weight' => -20,
    '#prefix' => '<h2><small>' . $img . ' ' . ucfirst($subject_theme) . ' ' . $themes[$subject_theme]->info['version'] . ' <span class="lead">(Bootstrap ' . $themes['bootstrap']->info['version'] . ')</span>' . '</small></h2>',
  );
  // $form['color']['#group'] = 'glazed_settings';
  if (!empty($form['update'])) {
    $form['update']['#group'] = 'global';
  }
  if (!empty($form['color'])) {
    $form['color']['#group'] = 'glazed_settings';
    $form['color']['#title'] = t('Colors');
  }

  /**
   * Glazed cache builder
   * Cannot run as submit function because  it will set outdated values by
   * using theme_get_setting∂ to retrieve settings from database before the db is
   * updated. Cannot put cache builder in form scope and use $form_state because
   * it also needs to initialize default settings by reading the .info file.
   * By calling the cache builder here it will run twice: once before the
   * settings are saved and once after the redirect with the updated settings.
   * @todo come up with a less 'icky' solution
   */
  require_once(drupal_get_path('theme', 'glazed') . '/glazed_callbacks.inc');
  glazed_css_cache_build($subject_theme);

  foreach (file_scan_directory(drupal_get_path('theme', 'glazed') . '/features', '/settings.inc/i') as $file) {
    $theme = 'glazed';
    require_once($file->uri);
  }
  $form['#attached']['library'][] = 'glazed/admin.themesettings';
}


/**
 * Submit callback for theme settings form
 * Import Demo content.
 */
function glazed_settings_form_submit(&$form, &$form_state) {
  drupal_set_message(theme_get_setting('boxed_layout_boxbg'));
}

/**
 * Retrieves the Color module information for a particular theme.
 */
function _glazed_get_color_names($theme = NULL) {
  static $theme_info = array();
  if (!isset($theme)) {
    $theme = \Drupal::config('system.theme');
  }

  if (isset($theme_info[$theme])) {
    return $theme_info[$theme];
  }

  $path = drupal_get_path('theme', $theme);
  $file = DRUPAL_ROOT . '/' . $path . '/color/color.inc';
  if ($path && file_exists($file)) {
    include $file;
    $theme_info[$theme] = $info['fields'];
    return $info['fields'];
  } else {
    return array();
  }
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
  $theme_colors = _glazed_get_color_names($theme);
  $colors = array_merge($colors, $theme_colors);
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
  foreach (node_type_get_types() as $key => $value) {
    $types[$key] = $value->get('name');
  }
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
