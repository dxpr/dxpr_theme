<?php

$CSS .= "#page-title { text-align:  " . theme_get_setting('page_title_align', $theme) . " } \n\n";

$CSS .= "#page-title .page-title { height:  " . theme_get_setting('page_title_height', $theme) . "px } \n\n";

$CSS .= ".page-title-full-width-container:after { opacity:  " . theme_get_setting('page_title_image_opacity', $theme) . " } \n\n";

if ($position = theme_get_setting('page_title_image_position')) {
  $position = str_replace('_', ' ', $position);
  $CSS .= ".page-title-full-width-container:after { background-position: $position; }\n\n";
}

if (theme_get_setting('page_title_image_mode') == 'fixed') {
  $position = str_replace('_', ' ', $position);
  $CSS .= ".page-title-full-width-container:after { background-attachment: fixed; }\n\n";
}

if ($bgstyle = theme_get_setting('page_title_image_style')) {
  switch ($bgstyle) {
    case 'no_repeat':
      $CSS .= ".page-title-full-width-container:after { background-size: auto;background-repeat: no-repeat; }\n\n";
      break;
    case 'repeat':
      $CSS .= ".page-title-full-width-container:after { background-size: auto; }\n\n";
      break;
    case 'contain':
      $CSS .= ".page-title-full-width-container:after { background-size: contain; }\n\n";
      break;
  }
}

if ($page_title_image = theme_get_setting('page_title_image', $theme)) {
  $page_title_image = $page_title_image[0];
  if ($page_title_image && is_numeric($page_title_image) && ($page_title_image > 0)) {
    $file =  \Drupal\file\Entity\File::load($page_title_image);
    $url = $file->url();
    $CSS .= ".page-title-full-width-container:after { background-image: url('" . $url . "'); }\n\n";
  }
}
