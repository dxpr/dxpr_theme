<?php
/**
 * @file
 * glazed_landscaping_theme_settings.features.uuid_term.inc
 */

/**
 * Implements hook_uuid_features_default_terms().
 */
function glazed_landscaping_theme_settings_uuid_features_default_terms() {
  $terms = array();

  $terms[] = array(
    'name' => 'Garden Architecture',
    'description' => NULL,
    'format' => NULL,
    'weight' => 0,
    'uuid' => '21ea8ea6-6819-4a39-b878-b0d5b02a43c0',
    'vocabulary_machine_name' => 'cms_portfolio_category',
  );
  $terms[] = array(
    'name' => 'Lawn',
    'description' => NULL,
    'format' => NULL,
    'weight' => 0,
    'uuid' => '4d59d71f-ca0d-4f45-9c0c-7d6ddeb22595',
    'vocabulary_machine_name' => 'cms_portfolio_category',
  );
  $terms[] = array(
    'name' => 'Landscaping',
    'description' => NULL,
    'format' => NULL,
    'weight' => 0,
    'uuid' => '59c0eae2-ef48-4bd6-89f0-852aaffb23b3',
    'vocabulary_machine_name' => 'cms_portfolio_category',
  );
  $terms[] = array(
    'name' => 'Planting',
    'description' => NULL,
    'format' => NULL,
    'weight' => 0,
    'uuid' => '6aa043e2-34df-4b1b-bdc7-17ec9cdf7dbd',
    'vocabulary_machine_name' => 'cms_portfolio_category',
  );
  $terms[] = array(
    'name' => 'Irrigation',
    'description' => NULL,
    'format' => NULL,
    'weight' => 0,
    'uuid' => 'e8617552-2153-462c-95f4-a6d1b47d04b2',
    'vocabulary_machine_name' => 'cms_portfolio_category',
  );
  return $terms;
}
