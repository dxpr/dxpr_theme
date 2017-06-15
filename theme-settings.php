<?php

function glazed_form_system_theme_settings_alter(&$form, &$form_state) {
  /**
   * @ code
   * a bug in D7 and D8 causes the theme to load twice, if this file is loaded a
   * second time we return to prevent errors for redeclaring functions etc.
   */
  global $glazed_altered, $base_path, $theme_chain;
  // if ($glazed_altered) return;
  $glazed_altered = TRUE;
  drupal_set_message('glazed_form_system_theme_settings_alter');
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
    // '#type' => 'details', SETTING TYPE TO DETAILS OR VERTICAL_TABS STOPS RENDERING OF ALL ELEMENTS INSIDE
    '#weight' => -20,
    '#prefix' => '<h2><small>' . $img . ' ' . ucfirst($subject_theme) . ' ' . $themes[$subject_theme]->info['version'] . ' <span class="lead">(Bootstrap ' . $themes['bootstrap']->info['version'] . ')</span>' . '</small></h2>',
  );


  foreach (file_scan_directory(drupal_get_path('theme', 'glazed') . '/features', '/settings.inc/i') as $file) {
    $theme = 'glazed';
    // kint($file);
    include($file->uri);
  }
  kint($form);
  $form['#attached']['library'][] = 'glazed/admin';
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
/**
 * Helper function to provide a list of fonts for select list in theme settings.
 */
function glazed_font_list() {
  $fonts = array(
      '' => 'Theme defaults',
    'Sans-serif web-safe' => array(
      'helvetica' => 'Helvetica/Arial',
      'myriad' => 'Myriad/Calibri',
      'verdana' => 'Verdana',
      'lucida' => 'Lucida Sans',
      'geneva' => 'Geneva',
      'tahoma' => 'Tahoma',
      'trebuchet' => 'Trebuchet',
      'century' => 'Century Gothic',
    ),
    'Serif web-safe' => array(
      'garamond' => 'Garamond',
      'georgia' => 'Georgia',
      'palatino' => 'Palatino Linotype',
      'times' => 'Times New Roman',
    ),
  );
  $fonts['Local webfonts'] = glazed_local_webfonts();
  $fonts['Google webfonts'] = glazed_google_webfonts();

  return $fonts;
}

/**
 * Helper function to get list of google web fonts
 */
function glazed_google_webfonts() {
  $json_webfonts = file_get_contents(dirname(__FILE__) . '/features/sooper-fonts/google-webfonts.json');
  $webfonts = json_decode($json_webfonts);
  $fonts = array();
  foreach ($webfonts->items as $font_family) {
    $fam_name = $font_family->family;
    foreach ($font_family->variants as $font) {
      if ($font == 'regular') $font = '';
      $font_name = $fam_name . ' ' . $font;
      $font_name_safe = str_replace(' ', '+', $fam_name) . ':' . $font;
      $font_name_key = '0' . $font_name_safe;
      $fonts[$font_name_key] = $font_name;
    }
  }
  return $fonts;
}
/**
 * Helper function to get list of locally hosted fonts
 */
function glazed_local_webfonts($loadem = FALSE) {
  global $base_path, $base_url;
  $theme_chain = array('glazed');
  $fonts = array();
  foreach ($theme_chain as $theme) {
    foreach (file_scan_directory(drupal_get_path('theme', $theme) . '/fonts', '/.css/i') as $file) {
      $font_path = str_replace(drupal_get_path('theme', $theme), '', $file->uri);
      $css = file_get_contents($file->uri);
      if ($css) {
        preg_match_all('/\'(.*?).svg#(.*?)\'/i', $css, $matches);
      }
      else {
        drupal_set_message(t('Cannot read font files, please check permissions on the fonts folder in the theme.'), 'error');
      }
      foreach ($matches[2] as $font) {
        $key = '1' . $theme . '|' . $font_path . '|' . $font;
        $fonts[$key] = preg_replace('/(?<!\ ) {A-Z]/', ' $0', $font);
      }
      // @code for theme-settings.php load all the fonts
      if ($loadem) {
        $element = array(
          '#tag' => 'link',
          '#attributes' => array(
            'href' => $base_path . $file->uri,
            'rel' => 'stylesheet',
            'type' => 'text/css',
          ),
        );
        // @todo replace with hook_page_attachments
        // drupal_add_html_head($element, $file->uri);
      }
    }
  }

  asort($fonts, SORT_STRING);
  return $fonts;
}

/**
 * Helper function to display font previews in the settings form
 */
function _glazed_font_previews() {
  $output = '<div class="fonts-previews">';
  $output .= '  <h3>Google fonts preview</h3>';
  $output .= '  <p>Check out <a href="http://www.google.com/webfonts">google.com/webfonts</a> for previews of google web fonts.</p>';
  $output .= '  <h3>Local fonts preview</h3>';
  $output .= '  <p>Glazed will automatically detect and load any Fontsquirrel-generated @font-face package in the exmapletheme/fonts folder. See <a href="https://www.fontsquirrel.com/tools/webfont-generator">Fontsquirrel.com</a></p>';
  foreach (glazed_local_webfonts(TRUE) as $key => $font_name) {
    $font = explode('|', $key);
    $local_name = $font[2];
    $output .= '  <div class="font-preview font-local" style="font-family:' . $local_name . '">';
    $output .= '  <p class="font-name">' . $font_name . '</p><p class="font-test">The quick brown fox jumps over the lazy dog.</p>';
    $output .= '  <p class="font-test-small">The quick brown fox jumps over the lazy dog.</p>';
    $output .= '  <p class="font-test-accents">&#36; &euro; &pound; &yen; &agrave; &egrave; &igrave; &ograve; &ugrave; &Agrave; &Egrave; &Igrave; &Ograve; &Ugrave; &aacute; &eacute; &iacute; &oacute; &uacute; &yacute; &Aacute; &Eacute; &Iacute; &Oacute; &Uacute; &Yacute;</p>';
    $output .= '  </div>';
  }
  $output .= '</div>';
  return $output;
}

function _glazed_block_preview() {
  $block_well = theme_get_setting('block_well');
  $title_well = theme_get_setting('title_well');
  $output = <<<EOT
<div class="blocks-preview">
  <div class="region region-sidebar-second">
    <section class="block block-tagclouds clearfix {$block_well}" id="block-tagclouds-2">
      <div class="wrap-block-title"><h2 class="block-title {$title_well}">Tags in Tags</h2></div>
      <hr class="block-hr">
      <span class=
      "tagclouds-term"><a class="tagclouds level1" href="#" title=
      "">Business</a></span> <span class="tagclouds-term"><a class=
      "tagclouds level6" href="#" title="">Inspiration</a></span>
      <span class="tagclouds-term"><a class="tagclouds level3" href=
      "#" title="">Oppurtunities</a></span> <span class=
      "tagclouds-term"><a class="tagclouds level3" href="#" title=
      "">Secrets</a></span> <span class="tagclouds-term"><a class=
      "tagclouds level5" href="#" title="">Travel</a></span>
    </section>
    <section class="block block-views clearfix {$block_well}" id=
    "block-views-cms-blog-cat-blog-categories">
      <div class="wrap-block-title"><h2 class="block-title {$title_well}">Categories</h2></div>
      <hr class="block-hr">
      <div class=
      "view view-cms-blog-cat view-id-cms_blog_cat view-display-id-blog_categories view-dom-id-414e72d6e00d6259852916a789bc63e5 ">
      <div class="view-content">
          <ul class="glazed-processed nav">
            <li class="">
              <a href="#">Business <span class=
              "glazed-util-text-muted">(12)</span></a>
            </li>
            <li class="">
              <a href="#">Lifestyle <span class=
              "glazed-util-text-muted">(3)</span></a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</div>
EOT;
  return $output;
}