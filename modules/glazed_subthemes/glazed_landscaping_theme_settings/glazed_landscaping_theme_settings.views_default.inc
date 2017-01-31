<?php
/**
 * @file
 * glazed_landscaping_theme_settings.views_default.inc
 */

/**
 * Implements hook_views_default_views().
 */
function glazed_landscaping_theme_settings_views_default_views() {
  $export = array();

  $view = new view();
  $view->name = 'glazed_landscaping';
  $view->description = '';
  $view->tag = 'default';
  $view->base_table = 'node';
  $view->human_name = 'Glazed Landscaping';
  $view->core = 7;
  $view->api_version = '3.0';
  $view->disabled = FALSE; /* Edit this to true to make a default view disabled initially */

  /* Display: Master */
  $handler = $view->new_display('default', 'Master', 'default');
  $handler->display->display_options['title'] = 'Glazed Filter No Spacing';
  $handler->display->display_options['use_more_always'] = FALSE;
  $handler->display->display_options['access']['type'] = 'perm';
  $handler->display->display_options['cache']['type'] = 'none';
  $handler->display->display_options['query']['type'] = 'views_query';
  $handler->display->display_options['query']['options']['distinct'] = TRUE;
  $handler->display->display_options['exposed_form']['type'] = 'basic';
  $handler->display->display_options['pager']['type'] = 'full';
  $handler->display->display_options['pager']['options']['items_per_page'] = '8';
  $handler->display->display_options['pager']['options']['offset'] = '0';
  $handler->display->display_options['pager']['options']['id'] = '0';
  $handler->display->display_options['pager']['options']['quantity'] = '9';
  $handler->display->display_options['pager']['options']['tags']['previous'] = '‹ ';
  $handler->display->display_options['pager']['options']['tags']['next'] = ' ›';
  $handler->display->display_options['style_plugin'] = 'md_portfolio_mdp_plugin_style';
  $handler->display->display_options['style_options']['md_style_flag'] = '1';
  $handler->display->display_options['style_options']['md_style_view'] = array(
    'vid' => '1',
    'vname' => 'glazed_landscaping',
    'display_id' => 'glazed_portfolio_filter2',
    'filter_tax_id_field_name' => 'cms_portfolio_category/field_portfolio_category',
    'filter_default_tax_id' => '3',
    'filter_default_tax_mname' => 'cms_portfolio_category',
    'filter_default_field' => 'field_portfolio_category',
    'filter_div_id' => 'mdp-filter-1',
    'grid_div_id' => 'mdp-grid-1',
  );
  $handler->display->display_options['style_options']['md_style_filter_count'] = array(
    'flag_check' => 0,
    'options' => array(
      'count_type' => 'cbp-count-tooltip',
      'field_prefix' => '(',
      'field_suffix' => ')',
    ),
  );
  $handler->display->display_options['style_options']['md_style_filter_type'] = 'cbp-l-filters-buttonCenter';
  $handler->display->display_options['style_options']['md_style_container_type'] = 'cbp-l-grid-fullScreen';
  $handler->display->display_options['style_options']['md_style_animationType'] = 'quicksand';
  $handler->display->display_options['style_options']['md_style_caption'] = 'fadeIn';
  $handler->display->display_options['style_options']['md_style_displayType'] = 'sequentially';
  $handler->display->display_options['style_options']['md_style_displayTypeSpeed'] = '100';
  $handler->display->display_options['style_options']['md_style_gridAdjustment'] = 'responsive';
  $handler->display->display_options['style_options']['md_style_gapHorizontal'] = '30';
  $handler->display->display_options['style_options']['md_style_gapVertical'] = '30';
  $handler->display->display_options['style_options']['md_style_view_node'] = 'full';
  $handler->display->display_options['row_plugin'] = 'md_portfolio_mdp_plugin_rows';
  $handler->display->display_options['row_options']['md_rows'] = array(
    'field_portfolio_images' => array(
      'field' => '',
      'flag' => 'caption',
      'caption' => array(
        'class_link' => 'none',
        'text' => '',
        'field_display' => array(
          'title' => 1,
        ),
      ),
      'more' => array(
        'caption_flag' => 0,
        'caption_text' => 'View Image',
        'full_page_flag' => 0,
        'full_page_text' => 'View Content',
        'inline_page_flag' => 0,
        'inline_page_text' => 'View Content',
        'field_display' => array(
          'title' => 0,
        ),
      ),
    ),
    'title' => array(
      'field' => 'title',
      'flag' => '0',
    ),
  );
  /* Field: Content: Select Images */
  $handler->display->display_options['fields']['field_portfolio_images']['id'] = 'field_portfolio_images';
  $handler->display->display_options['fields']['field_portfolio_images']['table'] = 'field_data_field_portfolio_images';
  $handler->display->display_options['fields']['field_portfolio_images']['field'] = 'field_portfolio_images';
  $handler->display->display_options['fields']['field_portfolio_images']['label'] = '';
  $handler->display->display_options['fields']['field_portfolio_images']['alter']['alter_text'] = TRUE;
  $handler->display->display_options['fields']['field_portfolio_images']['alter']['text'] = '[field_portfolio_images]';
  $handler->display->display_options['fields']['field_portfolio_images']['element_type'] = '0';
  $handler->display->display_options['fields']['field_portfolio_images']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['field_portfolio_images']['element_default_classes'] = FALSE;
  $handler->display->display_options['fields']['field_portfolio_images']['click_sort_column'] = 'fid';
  $handler->display->display_options['fields']['field_portfolio_images']['settings'] = array(
    'image_style' => 'bootstrap3_col6_photo',
    'image_link' => '',
    'field_formatter_class' => '',
    'image_hover_effects' => '0',
    'image_hover_effects_data' => '+',
  );
  $handler->display->display_options['fields']['field_portfolio_images']['delta_limit'] = '1';
  $handler->display->display_options['fields']['field_portfolio_images']['delta_offset'] = '0';
  /* Field: Content: Title */
  $handler->display->display_options['fields']['title']['id'] = 'title';
  $handler->display->display_options['fields']['title']['table'] = 'node';
  $handler->display->display_options['fields']['title']['field'] = 'title';
  $handler->display->display_options['fields']['title']['label'] = '';
  $handler->display->display_options['fields']['title']['alter']['text'] = '[title]';
  $handler->display->display_options['fields']['title']['element_type'] = 'h3';
  $handler->display->display_options['fields']['title']['element_class'] = 'glazed-portfolio-title';
  $handler->display->display_options['fields']['title']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['title']['element_default_classes'] = FALSE;
  $handler->display->display_options['fields']['title']['link_to_node'] = FALSE;
  /* Sort criterion: Content: Post date */
  $handler->display->display_options['sorts']['created']['id'] = 'created';
  $handler->display->display_options['sorts']['created']['table'] = 'node';
  $handler->display->display_options['sorts']['created']['field'] = 'created';
  $handler->display->display_options['sorts']['created']['order'] = 'DESC';
  /* Filter criterion: Content: Published */
  $handler->display->display_options['filters']['status']['id'] = 'status';
  $handler->display->display_options['filters']['status']['table'] = 'node';
  $handler->display->display_options['filters']['status']['field'] = 'status';
  $handler->display->display_options['filters']['status']['value'] = 1;
  $handler->display->display_options['filters']['status']['group'] = 1;
  $handler->display->display_options['filters']['status']['expose']['operator'] = FALSE;
  /* Filter criterion: Content: Type */
  $handler->display->display_options['filters']['type']['id'] = 'type';
  $handler->display->display_options['filters']['type']['table'] = 'node';
  $handler->display->display_options['filters']['type']['field'] = 'type';
  $handler->display->display_options['filters']['type']['value'] = array(
    'portfolio' => 'portfolio',
  );

  /* Display: Landscaping Gallery */
  $handler = $view->new_display('page', 'Landscaping Gallery', 'landscaping_gallery');
  $handler->display->display_options['defaults']['title'] = FALSE;
  $handler->display->display_options['title'] = 'Landscaping Gallery';
  $handler->display->display_options['defaults']['fields'] = FALSE;
  /* Field: Content: Select Images */
  $handler->display->display_options['fields']['field_portfolio_images']['id'] = 'field_portfolio_images';
  $handler->display->display_options['fields']['field_portfolio_images']['table'] = 'field_data_field_portfolio_images';
  $handler->display->display_options['fields']['field_portfolio_images']['field'] = 'field_portfolio_images';
  $handler->display->display_options['fields']['field_portfolio_images']['label'] = '';
  $handler->display->display_options['fields']['field_portfolio_images']['alter']['alter_text'] = TRUE;
  $handler->display->display_options['fields']['field_portfolio_images']['alter']['text'] = '[field_portfolio_images]';
  $handler->display->display_options['fields']['field_portfolio_images']['element_type'] = '0';
  $handler->display->display_options['fields']['field_portfolio_images']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['field_portfolio_images']['element_default_classes'] = FALSE;
  $handler->display->display_options['fields']['field_portfolio_images']['click_sort_column'] = 'fid';
  $handler->display->display_options['fields']['field_portfolio_images']['settings'] = array(
    'image_style' => 'bootstrap3_col6_photo',
    'image_link' => '',
    'field_formatter_class' => '',
    'image_hover_effects' => '0',
    'image_hover_effects_data' => '+',
  );
  $handler->display->display_options['fields']['field_portfolio_images']['delta_limit'] = '1';
  $handler->display->display_options['fields']['field_portfolio_images']['delta_offset'] = '0';
  /* Field: Content: Title */
  $handler->display->display_options['fields']['title']['id'] = 'title';
  $handler->display->display_options['fields']['title']['table'] = 'node';
  $handler->display->display_options['fields']['title']['field'] = 'title';
  $handler->display->display_options['fields']['title']['label'] = '';
  $handler->display->display_options['fields']['title']['alter']['text'] = '[title]';
  $handler->display->display_options['fields']['title']['element_type'] = 'h4';
  $handler->display->display_options['fields']['title']['element_class'] = 'glazed-portfolio-title';
  $handler->display->display_options['fields']['title']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['title']['element_default_classes'] = FALSE;
  $handler->display->display_options['path'] = 'gallery';
  $handler->display->display_options['menu']['title'] = 'Glazed Filter With Spacing';
  $handler->display->display_options['menu']['weight'] = '0';
  $handler->display->display_options['menu']['name'] = 'main-menu';
  $handler->display->display_options['menu']['context'] = 0;
  $handler->display->display_options['menu']['context_only_inline'] = 0;

  /* Display: Landscaping 4x2 */
  $handler = $view->new_display('block', 'Landscaping 4x2', 'landscaping_4x2');
  $handler->display->display_options['defaults']['title'] = FALSE;
  $handler->display->display_options['title'] = 'Landscaping 4x2';
  $handler->display->display_options['defaults']['use_ajax'] = FALSE;
  $handler->display->display_options['use_ajax'] = TRUE;
  $handler->display->display_options['defaults']['pager'] = FALSE;
  $handler->display->display_options['pager']['type'] = 'some';
  $handler->display->display_options['pager']['options']['items_per_page'] = '8';
  $handler->display->display_options['pager']['options']['offset'] = '0';
  $handler->display->display_options['defaults']['style_plugin'] = FALSE;
  $handler->display->display_options['style_plugin'] = 'md_portfolio_mdp_plugin_style';
  $handler->display->display_options['style_options']['md_style_flag'] = '1';
  $handler->display->display_options['style_options']['md_style_view'] = array(
    'vid' => '',
    'vname' => 'glazed_landscaping',
    'display_id' => 'landscaping_4x2',
    'filter_tax_id_field_name' => 'cms_portfolio_category/field_portfolio_category',
    'filter_default_tax_id' => '3',
    'filter_default_tax_mname' => 'cms_portfolio_category',
    'filter_default_field' => 'field_portfolio_category',
    'filter_div_id' => 'mdp-filter-',
    'grid_div_id' => 'mdp-grid-',
  );
  $handler->display->display_options['style_options']['md_style_filter_count'] = array(
    'flag_check' => 0,
    'options' => array(
      'count_type' => 'cbp-count-default',
      'field_prefix' => '(',
      'field_suffix' => ')',
    ),
  );
  $handler->display->display_options['style_options']['md_style_filter_type'] = 'cbp-l-filters-button';
  $handler->display->display_options['style_options']['md_style_container_type'] = 'cbp-l-grid-fullScreen';
  $handler->display->display_options['style_options']['md_style_animationType'] = 'quicksand';
  $handler->display->display_options['style_options']['md_style_caption'] = 'fadeIn';
  $handler->display->display_options['style_options']['md_style_displayType'] = 'fadeInToTop';
  $handler->display->display_options['style_options']['md_style_displayTypeSpeed'] = '100';
  $handler->display->display_options['style_options']['md_style_gridAdjustment'] = 'default';
  $handler->display->display_options['style_options']['md_style_mediaQueries'] = '[1100, 4]
[800, 3]
[480, 2]
[320, 1]';
  $handler->display->display_options['style_options']['md_style_gapHorizontal'] = '20';
  $handler->display->display_options['style_options']['md_style_gapVertical'] = '20';
  $handler->display->display_options['style_options']['md_style_view_node'] = 'full';
  $handler->display->display_options['defaults']['style_options'] = FALSE;
  $handler->display->display_options['defaults']['row_plugin'] = FALSE;
  $handler->display->display_options['row_plugin'] = 'md_portfolio_mdp_plugin_rows';
  $handler->display->display_options['row_options']['md_rows'] = array(
    'field_portfolio_images' => array(
      'field' => '',
      'flag' => 'caption',
      'caption' => array(
        'class_link' => 'none',
        'text' => '',
        'field_display' => array(
          'title' => 1,
        ),
      ),
      'more' => array(
        'caption_flag' => 0,
        'caption_text' => 'View Image',
        'full_page_flag' => 0,
        'full_page_text' => 'View Content',
        'inline_page_flag' => 0,
        'inline_page_text' => 'View Content',
        'field_display' => array(
          'title' => 0,
        ),
      ),
    ),
    'title' => array(
      'field' => 'title',
      'flag' => '0',
    ),
  );
  $handler->display->display_options['defaults']['row_options'] = FALSE;
  $handler->display->display_options['defaults']['fields'] = FALSE;
  /* Field: Content: Select Images */
  $handler->display->display_options['fields']['field_portfolio_images']['id'] = 'field_portfolio_images';
  $handler->display->display_options['fields']['field_portfolio_images']['table'] = 'field_data_field_portfolio_images';
  $handler->display->display_options['fields']['field_portfolio_images']['field'] = 'field_portfolio_images';
  $handler->display->display_options['fields']['field_portfolio_images']['label'] = '';
  $handler->display->display_options['fields']['field_portfolio_images']['alter']['alter_text'] = TRUE;
  $handler->display->display_options['fields']['field_portfolio_images']['alter']['text'] = '[field_portfolio_images]';
  $handler->display->display_options['fields']['field_portfolio_images']['element_type'] = '0';
  $handler->display->display_options['fields']['field_portfolio_images']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['field_portfolio_images']['element_default_classes'] = FALSE;
  $handler->display->display_options['fields']['field_portfolio_images']['click_sort_column'] = 'fid';
  $handler->display->display_options['fields']['field_portfolio_images']['settings'] = array(
    'image_style' => 'bootstrap3_col6_photo',
    'image_link' => 'content',
    'field_formatter_class' => '',
    'image_hover_effects' => '0',
    'image_hover_effects_data' => '+',
  );
  $handler->display->display_options['fields']['field_portfolio_images']['delta_limit'] = '1';
  $handler->display->display_options['fields']['field_portfolio_images']['delta_offset'] = '0';
  /* Field: Content: Title */
  $handler->display->display_options['fields']['title']['id'] = 'title';
  $handler->display->display_options['fields']['title']['table'] = 'node';
  $handler->display->display_options['fields']['title']['field'] = 'title';
  $handler->display->display_options['fields']['title']['label'] = '';
  $handler->display->display_options['fields']['title']['alter']['text'] = '[title]';
  $handler->display->display_options['fields']['title']['element_type'] = 'h4';
  $handler->display->display_options['fields']['title']['element_class'] = 'glazed-portfolio-title';
  $handler->display->display_options['fields']['title']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['title']['element_default_classes'] = FALSE;
  $export['glazed_landscaping'] = $view;

  return $export;
}
