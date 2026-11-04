#!/usr/bin/env node

/**
 * @file
 * Generates data/settings-schema.json from PHP theme settings inc files.
 *
 * Parses the Drupal Form API arrays in features/ *-theme-settings.inc files
 * and extracts setting metadata: type, title, description, ai_description,
 * options, min/max/step, and default values.
 *
 * Run: node scripts/generate-settings-schema.js
 * Or via Grunt: grunt generate-schema
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const FEATURES_DIR = path.join(ROOT, 'features');
const OUTPUT = path.join(ROOT, 'data', 'settings-schema.json');

// Form element types that represent actual settings (not containers).
const SETTING_TYPES = new Set([
  'checkbox', 'checkboxes', 'radios', 'select', 'range',
  'textfield', 'textarea', 'media_library',
]);

// Keys to skip: UI-only form fields that don't store config.
const SKIP_KEYS = new Set([
  'ai_prompt', 'ai_font_prompt', 'ai_generate', 'ai_font_generate',
  'ai_error', 'ai_font_error',
]);

// Section mapping from inc file names.
const SECTION_MAP = {
  'layout-theme-settings.inc': 'layout',
  'header-theme-settings.inc': 'header',
  'page_title-theme-settings.inc': 'page-title',
  'colors-theme-settings.inc': 'colors',
  'fonts-theme-settings.inc': 'fonts',
  'typography-theme-settings.inc': 'typography',
  'block-design-theme-settings.inc': 'block-design',
  'custom-css-theme-settings.inc': 'custom-css',
};

/**
 * Extract all form element definitions from a PHP inc file.
 */
function parseIncFile(filePath, section) {
  const content = fs.readFileSync(filePath, 'utf8');
  const settings = {};

  // Match form element assignments: ...['setting_key'] = [
  // We look for the pattern where a form array key is assigned an array
  // containing '#type'.
  //
  // Strategy: find each block that assigns a form element with a #type,
  // extract the key name and all # properties.
  const lines = content.split('\n');
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Look for lines like: $form[...]['key_name'] = [
    // or: 'key_name' => [
    // The setting key is the last quoted string before = [ or => [
    const assignMatch = line.match(/\['([a-z_][a-z0-9_]*)'\]\s*=\s*\[/);
    const arrowMatch = !assignMatch && line.match(/'([a-z_][a-z0-9_]*)'\s*=>\s*\[/);
    const match = assignMatch || arrowMatch;

    if (!match) {
      i++;
      continue;
    }

    const key = match[1];

    // Skip UI-only form fields.
    if (SKIP_KEYS.has(key)) {
      i++;
      continue;
    }

    // Collect the full array block until we find the closing ];
    let block = '';
    let depth = 0;
    let j = i;
    let started = false;

    while (j < lines.length) {
      const l = lines[j];
      for (let c = 0; c < l.length; c++) {
        if (l[c] === '[' && (c === 0 || l[c - 1] !== "'")) {
          // Only count [ that aren't inside strings.
          // Simple heuristic: count brackets.
          depth++;
          started = true;
        }
        if (l[c] === ']' && started) {
          depth--;
        }
      }
      block += l + '\n';
      if (started && depth <= 0) {
        break;
      }
      j++;
    }

    // Check if this block has a #type that's a setting type.
    const typeMatch = block.match(/'#type'\s*=>\s*'([^']+)'/);
    if (!typeMatch || !SETTING_TYPES.has(typeMatch[1])) {
      i++;
      continue;
    }

    // Skip loop-generated keys (color_palette_ prefix, etc.)
    if (key.startsWith('color_palette_') || key.startsWith('local_')) {
      i = j + 1;
      continue;
    }

    const setting = {
      section: section,
      type: normalizeType(typeMatch[1], key),
    };

    // Extract #title.
    const titleMatch = block.match(/'#title'\s*=>\s*(?:t\()?'([^']+)'/);
    if (titleMatch) {
      setting.title = titleMatch[1];
    }

    // Extract #description.
    const descMatch = block.match(/'#description'\s*=>\s*(?:t\()?'([^']+)'/);
    if (descMatch) {
      setting.description = descMatch[1];
    }

    // Extract #ai_description.
    const aiDescMatch = block.match(/'#ai_description'\s*=>\s*'((?:[^'\\]|\\.)*)'/);
    if (aiDescMatch) {
      setting.ai_description = aiDescMatch[1].replace(/\\'/g, "'");
    }

    // Extract #options (literal arrays only).
    if (setting.type === 'radios' || setting.type === 'select' || setting.type === 'checkboxes') {
      const options = extractOptions(block);
      if (options) {
        setting.options = options;
      } else if (block.match(/'#options'\s*=>/)) {
        // Dynamic options (function call or variable).
        setting.options = '_dynamic';
      }
    }

    // Extract range properties.
    if (setting.type === 'range') {
      const minMatch = block.match(/'#min'\s*=>\s*(-?[\d.]+)/);
      const maxMatch = block.match(/'#max'\s*=>\s*(-?[\d.]+)/);
      const stepMatch = block.match(/'#step'\s*=>\s*(-?[\d.]+)/);
      if (minMatch) setting.min = parseFloat(minMatch[1]);
      if (maxMatch) setting.max = parseFloat(maxMatch[1]);
      if (stepMatch) setting.step = parseFloat(stepMatch[1]);

      // Extract unit from wrapper title or description.
      if (setting.title && setting.title.match(/\(px\)|pixels/i)) {
        setting.unit = 'px';
      } else if (setting.title && setting.title.match(/%|percent/i)) {
        setting.unit = '%';
      } else if (setting.title && setting.title.match(/em\b/i)) {
        setting.unit = 'em';
      } else if (setting.max && setting.max <= 3 && setting.step < 1) {
        // Likely a ratio/multiplier, no unit.
      } else if (setting.max && setting.max > 3) {
        setting.unit = 'px';
      }
    }

    // Extract default value.
    const defaultVal = extractDefault(block, key);
    if (defaultVal !== undefined) {
      setting.default = defaultVal;
    }

    settings[key] = setting;
    i = j + 1;
  }

  return settings;
}

/**
 * Normalize PHP form type to schema type.
 *
 * Detects color fields by key name pattern since PHP uses generic 'textfield'
 * for color inputs. Also detects theme_color selects (palette color pickers)
 * vs regular selects.
 */
function normalizeType(phpType, key) {
  if (phpType === 'checkbox') return 'boolean';
  if (phpType === 'media_library') return 'media';

  // Detect color textfields by key naming convention.
  if (phpType === 'textfield') {
    if (key.endsWith('_custom') || key === 'boxed_layout_boxbg') {
      return 'color';
    }
  }

  // Detect theme_color selects (palette color pickers) by key naming.
  if (phpType === 'select') {
    const colorSelectPattern = /^(navbar_background|navbar_text_color|header_block_background|header_block_text_color|menu_background|menu_text_color|menu_hover_background|menu_hover_text_color|dropdown_background|dropdown_text_color|dropdown_hover_background|dropdown_hover_text_color|mobile_menu_background|mobile_menu_text_color|mobile_menu_hover_background|mobile_menu_hover_text_color|menu_border_color|divider_color|block_background|block_border_color|title_background|title_border_color|block_divider_color)$/;
    if (colorSelectPattern.test(key)) {
      return 'theme_color';
    }
  }

  // Detect font selects by key naming.
  if (phpType === 'select') {
    if (key.endsWith('_font_face')) {
      return 'font';
    }
  }

  return phpType;
}

/**
 * Extract literal options from a PHP array.
 */
function extractOptions(block) {
  // Match '#options' => [ ... ]
  const optMatch = block.match(/'#options'\s*=>\s*\[([\s\S]*?)\]/);
  if (!optMatch) return null;

  const optBlock = optMatch[1];
  // Check if it's a literal array (has => pairs) vs a function call.
  if (!optBlock.includes('=>')) return null;

  const options = {};
  // Match 'key' => t('Label') or 'key' => 'Label'
  const pairRegex = /'([^']*?)'\s*=>\s*(?:t\()?'([^']*?)'/g;
  let pairMatch;
  while ((pairMatch = pairRegex.exec(optBlock)) !== null) {
    options[pairMatch[1]] = pairMatch[2];
  }

  return Object.keys(options).length > 0 ? options : null;
}

/**
 * Extract default value from theme_get_setting pattern.
 */
function extractDefault(block, key) {
  // Pattern: theme_get_setting('key') !== NULL) ? theme_get_setting('key') : DEFAULT
  // Or: theme_get_setting('key') ?? DEFAULT
  const patterns = [
    // Ternary: ... ? theme_get_setting('key') : DEFAULT
    new RegExp(`theme_get_setting\\('${key}'\\)\\s*:\\s*(-?[\\d.]+|'[^']*'|TRUE|FALSE|NULL|\\[\\])`, 'i'),
    // Null coalescing: theme_get_setting('key') ?? DEFAULT
    new RegExp(`theme_get_setting\\('${key}'\\)\\s*\\?\\?\\s*(-?[\\d.]+|'[^']*'|TRUE|FALSE|NULL|\\[\\])`, 'i'),
    // Direct #default_value => VALUE
    new RegExp(`'#default_value'\\s*=>\\s*(-?[\\d.]+|'[^']*'|TRUE|FALSE|NULL|\\[\\])`, 'i'),
  ];

  for (const pattern of patterns) {
    const match = block.match(pattern);
    if (match) {
      return parsePhpValue(match[1]);
    }
  }

  return undefined;
}

/**
 * Parse a PHP literal value to JS.
 */
function parsePhpValue(val) {
  if (val === 'TRUE' || val === 'true') return true;
  if (val === 'FALSE' || val === 'false') return false;
  if (val === 'NULL' || val === 'null') return null;
  if (val === '[]') return [];
  if (val.startsWith("'") && val.endsWith("'")) return val.slice(1, -1);
  if (!isNaN(val)) return parseFloat(val);
  return val;
}

/**
 * Find all inc files in the features directory.
 */
function findIncFiles() {
  const files = [];
  const dirs = fs.readdirSync(FEATURES_DIR);
  for (const dir of dirs) {
    const dirPath = path.join(FEATURES_DIR, dir);
    if (!fs.statSync(dirPath).isDirectory()) continue;
    const entries = fs.readdirSync(dirPath);
    for (const entry of entries) {
      if (entry.endsWith('-theme-settings.inc')) {
        files.push({
          path: path.join(dirPath, entry),
          filename: entry,
          section: SECTION_MAP[entry] || dir,
        });
      }
    }
  }
  return files;
}

// Main.
console.log('Generating settings schema from PHP theme settings...');

const incFiles = findIncFiles();
const allSettings = {};

for (const file of incFiles) {
  console.log(`  Parsing ${file.filename} (${file.section})...`);
  const settings = parseIncFile(file.path, file.section);
  const count = Object.keys(settings).length;
  console.log(`    Found ${count} settings`);
  Object.assign(allSettings, settings);
}

// Build output with _meta header.
const output = {
  _meta: {
    description: 'DXPR Theme settings schema. Auto-generated from features/*-theme-settings.inc files.',
    generated: new Date().toISOString(),
    sections: [...new Set(Object.values(allSettings).map(s => s.section))],
    fields: {
      section: 'Settings category',
      type: 'Value type: boolean, range, radios, select, textfield, textarea, checkboxes, font, color, theme_color, media, path, serialized_palette',
      title: 'Short human label (shown in GUI)',
      description: 'Terse GUI description',
      ai_description: 'Design-oriented guidance for AI agents: visual effects, value ranges for different styles, relationships',
      options: 'Valid values for radios/select/checkboxes (object or _dynamic)',
      min: 'Minimum value for range type',
      max: 'Maximum value for range type',
      step: 'Step increment for range type',
      unit: 'CSS unit (px, %, em) for range type',
      default: 'Default value',
    },
  },
  ...allSettings,
};

// Ensure output directory exists.
const outDir = path.dirname(OUTPUT);
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(OUTPUT, JSON.stringify(output, null, 2) + '\n');
const total = Object.keys(allSettings).length;
console.log(`\nGenerated ${OUTPUT} with ${total} settings.`);
